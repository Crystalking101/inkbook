"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// InkBook 墨书 — Screen 4: Tone Practice
// Route: /practice?dynasty={id}&name={chineseName}
// Uses: Azure Speech SDK (pronunciation assessment) + OpenRouter (AI feedback)
// ─────────────────────────────────────────────────────────────

type PracticeWord = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  toneNumber: number;
};

type DynastyData = {
  english: string;
  chinese: string;
  color: string;
  deepColor: string;
  toneNumber: number;
  toneName: string;
  toneDescription: string;
  words: PracticeWord[];
};

const DYNASTY_DATA: Record<string, DynastyData> = {
  tang: {
    english: "Tang", chinese: "唐朝", color: "#E8E4B8", deepColor: "#8A7B2D",
    toneNumber: 1, toneName: "First Tone", toneDescription: "High and level — ā",
    words: [
      { hanzi: "妈", pinyin: "mā", meaning: "mom", toneNumber: 1 },
      { hanzi: "天", pinyin: "tiān", meaning: "sky", toneNumber: 1 },
      { hanzi: "高", pinyin: "gāo", meaning: "tall", toneNumber: 1 },
      { hanzi: "书", pinyin: "shū", meaning: "book", toneNumber: 1 },
      { hanzi: "花", pinyin: "huā", meaning: "flower", toneNumber: 1 },
    ],
  },
  han: {
    english: "Han", chinese: "汉朝", color: "#D4A832", deepColor: "#8A6A14",
    toneNumber: 2, toneName: "Second Tone", toneDescription: "Rising sharply — á",
    words: [
      { hanzi: "麻", pinyin: "má", meaning: "hemp", toneNumber: 2 },
      { hanzi: "人", pinyin: "rén", meaning: "person", toneNumber: 2 },
      { hanzi: "来", pinyin: "lái", meaning: "come", toneNumber: 2 },
      { hanzi: "年", pinyin: "nián", meaning: "year", toneNumber: 2 },
      { hanzi: "龙", pinyin: "lóng", meaning: "dragon", toneNumber: 2 },
    ],
  },
  ming: {
    english: "Ming", chinese: "明朝", color: "#E8654A", deepColor: "#9E3520",
    toneNumber: 3, toneName: "Third Tone", toneDescription: "Dipping then rising — ǎ",
    words: [
      { hanzi: "马", pinyin: "mǎ", meaning: "horse", toneNumber: 3 },
      { hanzi: "好", pinyin: "hǎo", meaning: "good", toneNumber: 3 },
      { hanzi: "水", pinyin: "shuǐ", meaning: "water", toneNumber: 3 },
      { hanzi: "古", pinyin: "gǔ", meaning: "ancient", toneNumber: 3 },
      { hanzi: "五", pinyin: "wǔ", meaning: "five", toneNumber: 3 },
    ],
  },
  qing: {
    english: "Qing", chinese: "清朝", color: "#C41E1E", deepColor: "#8B0000",
    toneNumber: 4, toneName: "Fourth Tone", toneDescription: "Falling sharply — à",
    words: [
      { hanzi: "骂", pinyin: "mà", meaning: "scold", toneNumber: 4 },
      { hanzi: "大", pinyin: "dà", meaning: "big", toneNumber: 4 },
      { hanzi: "是", pinyin: "shì", meaning: "is/are", toneNumber: 4 },
      { hanzi: "路", pinyin: "lù", meaning: "road", toneNumber: 4 },
      { hanzi: "意", pinyin: "yì", meaning: "meaning", toneNumber: 4 },
    ],
  },
  song: {
    english: "Song", chinese: "宋朝", color: "#D4849A", deepColor: "#9C4660",
    toneNumber: 5, toneName: "Neutral Tone", toneDescription: "Light and quick — a",
    words: [
      { hanzi: "吗", pinyin: "ma", meaning: "question particle", toneNumber: 5 },
      { hanzi: "的", pinyin: "de", meaning: "possessive particle", toneNumber: 5 },
      { hanzi: "了", pinyin: "le", meaning: "completion particle", toneNumber: 5 },
      { hanzi: "呢", pinyin: "ne", meaning: "question softener", toneNumber: 5 },
      { hanzi: "吧", pinyin: "ba", meaning: "suggestion particle", toneNumber: 5 },
    ],
  },
};

// ── Tone curve mini SVG paths (same style as /tones page) ──
const TONE_CURVES: Record<number, string> = {
  1: "M 8 12 L 52 12",
  2: "M 8 32 Q 30 20 52 8",
  3: "M 8 20 Q 20 40 30 36 Q 42 28 52 14",
  4: "M 8 8 L 52 36",
  5: "M 22 22 L 38 22",
};

type ScoreState = "idle" | "listening" | "processing" | "done" | "error";

async function getAIFeedback(
  hanzi: string,
  pinyin: string,
  score: number,
  dynastyName: string
): Promise<string> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://inkbook.vercel.app",
        "X-Title": "InkBook",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "user",
            content: `You are a warm, encouraging Mandarin tone coach for a language learning app called InkBook set in the ${dynastyName} dynasty. 
The student just practiced saying "${hanzi}" (${pinyin}) and scored ${score}% on tone accuracy.
Give a SHORT (1-2 sentences max) encouraging response. 
- If score >= 85: celebrate enthusiastically with a dynasty-themed compliment
- If score >= 60: encourage them and give one specific tip about this tone
- If score < 60: be kind, give one simple tip to improve
Never mention percentages. Keep it fun and themed. End with a short Chinese phrase related to the word.`,
          },
        ],
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
  } catch {
    if (score >= 85) return `Excellent tone, worthy of a ${dynastyName} scholar! 很好！`;
    if (score >= 60) return "Good effort! Try holding the tone shape a little longer. 加油！";
    return "Keep practicing — every master started as a student. 再试一次！";
  }
}

function PracticeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const dynastyId = params.get("dynasty") ?? "tang";
  const chineseName = params.get("name") ?? "";
  const dynasty = DYNASTY_DATA[dynastyId] ?? DYNASTY_DATA.tang;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scoreState, setScoreState] = useState<ScoreState>("idle");
  const [toneScore, setToneScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [scores, setScores] = useState<number[]>([]);
  const [cardFlip, setCardFlip] = useState(false);

  const recognizerRef = useRef<any>(null);
  const currentWord = dynasty.words[currentIndex];
  const totalWords = dynasty.words.length;

  // Dynamically load Azure Speech SDK from CDN
  useEffect(() => {
    if ((window as any).SpeechSDK) return;
    const script = document.createElement("script");
    script.src =
      "https://aka.ms/csspeech/jsbrowserpackageraw";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  async function startListening() {
    const SpeechSDK = (window as any).SpeechSDK;
    if (!SpeechSDK) {
      setScoreState("error");
      setFeedback("Speech SDK not loaded yet. Please wait a moment and try again.");
      return;
    }

    const key = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY;
    const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION ?? "eastus";

    if (!key) {
      setScoreState("error");
      setFeedback("Azure Speech key not found. Check your .env.local file.");
      return;
    }

    setScoreState("listening");
    setToneScore(null);
    setFeedback("");

    try {
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
      speechConfig.speechRecognitionLanguage = "zh-CN";

      const pronunciationConfig = new SpeechSDK.PronunciationAssessmentConfig(
        currentWord.pinyin,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
        true
      );
      pronunciationConfig.enableProsodyAssessment = true;

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      pronunciationConfig.applyTo(recognizer);
      recognizerRef.current = recognizer;

      recognizer.recognizeOnceAsync(
        async (result: any) => {
          setScoreState("processing");
          try {
            const pronunciationResult =
              SpeechSDK.PronunciationAssessmentResult.fromResult(result);
            // Use prosody score as a proxy for tone accuracy, fall back to accuracy score
            const rawScore =
              pronunciationResult.prosodyScore ??
              pronunciationResult.accuracyScore ??
              50;
            const finalScore = Math.round(rawScore);
            setToneScore(finalScore);
            setScores((prev) => [...prev, finalScore]);
            setCardFlip(true);
            const fb = await getAIFeedback(
              currentWord.hanzi,
              currentWord.pinyin,
              finalScore,
              dynasty.english
            );
            setFeedback(fb);
            setScoreState("done");
          } catch {
            setScoreState("error");
            setFeedback("Could not score your pronunciation. Please try again.");
          }
          recognizer.close();
        },
        (err: any) => {
          console.error(err);
          setScoreState("error");
          setFeedback("Microphone error. Make sure your browser has mic permission.");
          recognizer.close();
        }
      );
    } catch (e) {
      setScoreState("error");
      setFeedback("Could not start recording. Check mic permissions and try again.");
    }
  }

  function nextWord() {
    setCardFlip(false);
    setToneScore(null);
    setFeedback("");
    setScoreState("idle");
    if (currentIndex + 1 >= totalWords) {
      const avg = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      router.push(
        `/results?dynasty=${dynastyId}&name=${encodeURIComponent(chineseName)}&score=${avg}`
      );
    } else {
      setTimeout(() => setCurrentIndex((i) => i + 1), 120);
    }
  }

  function getScoreColor(s: number) {
    if (s >= 85) return "#2D8B50";
    if (s >= 60) return "#C4A030";
    return "#C41E1E";
  }

  function getScoreLabel(s: number) {
    if (s >= 85) return "Excellent";
    if (s >= 60) return "Good";
    return "Keep Trying";
  }

  const isListening = scoreState === "listening";
  const isProcessing = scoreState === "processing";
  const isDone = scoreState === "done";
  const isError = scoreState === "error";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5E8C8",
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 38px, rgba(139,0,0,0.10) 38px, rgba(139,0,0,0.10) 39px)",
        padding: "40px 20px 80px",
        fontFamily: "'Playfair Display', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(139,0,0,0.4); } 50% { transform:scale(1.06); box-shadow:0 0 0 14px rgba(139,0,0,0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes flipIn { from { opacity:0; transform:rotateY(90deg) scale(0.9); } to { opacity:1; transform:rotateY(0deg) scale(1); } }
        @keyframes scoreCount { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
        .mic-idle:hover { transform:scale(1.05); }
        .next-btn:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(139,0,0,0.3); }
        @media (prefers-reduced-motion: reduce) { * { animation-duration:0.01ms !important; } }
      `}</style>

      {/* Large watermark */}
      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.04)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>练</div>

      <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px", animation:"fadeUp 0.5s ease both" }}>
          <button
            onClick={() => router.push(`/tones?dynasty=${dynastyId}&name=${encodeURIComponent(chineseName)}`)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#8B0000", fontFamily:"'Playfair Display',serif", fontSize:"13px", letterSpacing:"0.05em", padding:0 }}
          >
            ← Back
          </button>
          <div style={{ textAlign:"center" }}>
            <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color:"#8B0000", letterSpacing:"4px" }}>{dynasty.chinese}</span>
            <span style={{ display:"block", fontSize:"11px", color:"rgba(139,0,0,0.5)", letterSpacing:"2px", marginTop:"2px" }}>{dynasty.toneName.toUpperCase()}</span>
          </div>
          {/* Progress dots */}
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            {dynasty.words.map((_, i) => (
              <div key={i} style={{
                width: i === currentIndex ? "10px" : "7px",
                height: i === currentIndex ? "10px" : "7px",
                borderRadius:"50%",
                background: i < currentIndex ? dynasty.deepColor : i === currentIndex ? dynasty.deepColor : "rgba(139,0,0,0.2)",
                transition:"all 0.3s ease",
              }}/>
            ))}
          </div>
        </div>

        {/* Instruction eyebrow */}
        <p style={{ textAlign:"center", color:"#8B0000", letterSpacing:"0.2em", textTransform:"uppercase", fontSize:"11px", marginBottom:"20px", animation:"fadeUp 0.5s ease 0.1s both" }}>
          {isDone ? "Here's how you did" : isListening ? "Listening..." : isProcessing ? "Scoring..." : `Say this character in the ${dynasty.english} tone`}
        </p>

        {/* Character card */}
        <div style={{
          background: isDone ? dynasty.color : "#FFF8F0",
          border: `2px solid ${dynasty.deepColor}`,
          borderRadius:"18px",
          boxShadow:"5px 7px 0 rgba(60,30,10,0.15)",
          padding:"32px 24px 28px",
          textAlign:"center",
          marginBottom:"24px",
          transition:"background 0.4s ease",
          animation: cardFlip ? "flipIn 0.4s ease" : "fadeUp 0.5s ease 0.15s both",
          position:"relative",
          overflow:"hidden",
        }}>
          {/* Tone curve mini indicator */}
          <div style={{ position:"absolute", top:"14px", right:"16px", opacity:0.4 }}>
            <svg width="60" height="44" viewBox="0 0 60 44">
              <line x1="6" y1="8" x2="6" y2="36" stroke={dynasty.deepColor} strokeWidth="0.8" opacity="0.5"/>
              <line x1="6" y1="8" x2="54" y2="8" stroke={dynasty.deepColor} strokeWidth="0.8" opacity="0.5" strokeDasharray="2,3"/>
              <line x1="6" y1="22" x2="54" y2="22" stroke={dynasty.deepColor} strokeWidth="0.8" opacity="0.5" strokeDasharray="2,3"/>
              <line x1="6" y1="36" x2="54" y2="36" stroke={dynasty.deepColor} strokeWidth="0.8" opacity="0.5" strokeDasharray="2,3"/>
              <path d={TONE_CURVES[dynasty.toneNumber]} fill="none" stroke={dynasty.deepColor} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Main character */}
          <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"clamp(80px,20vw,120px)", color: isDone ? dynasty.deepColor : "#1A1A1A", lineHeight:1, marginBottom:"10px", transition:"color 0.4s ease" }}>
            {currentWord.hanzi}
          </div>

          {/* Pinyin */}
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"26px", color:dynasty.deepColor, marginBottom:"6px" }}>
            {currentWord.pinyin}
          </div>

          {/* Meaning */}
          <div style={{ fontSize:"13px", color:"#6B5B3E", letterSpacing:"0.08em" }}>
            {currentWord.meaning}
          </div>

          {/* Score display */}
          {isDone && toneScore !== null && (
            <div style={{ marginTop:"20px", animation:"scoreCount 0.5s ease both" }}>
              <div style={{ fontSize:"52px", fontWeight:700, color:getScoreColor(toneScore), lineHeight:1, fontFamily:"'Playfair Display',serif" }}>
                {toneScore}%
              </div>
              <div style={{ fontSize:"13px", letterSpacing:"0.18em", textTransform:"uppercase", color:getScoreColor(toneScore), marginTop:"4px" }}>
                {getScoreLabel(toneScore)}
              </div>
            </div>
          )}

          {isError && (
            <div style={{ marginTop:"16px", padding:"10px 16px", background:"rgba(196,30,30,0.08)", borderRadius:"8px", fontSize:"13px", color:"#8B0000", fontStyle:"italic" }}>
              {feedback}
            </div>
          )}
        </div>

        {/* AI Feedback */}
        {isDone && feedback && (
          <div style={{
            background:"#FFF8F0",
            borderLeft:`5px solid ${dynasty.deepColor}`,
            borderRadius:"0 12px 12px 0",
            padding:"16px 20px",
            marginBottom:"24px",
            boxShadow:"3px 4px 0 rgba(60,30,10,0.12)",
            animation:"fadeUp 0.5s ease 0.2s both",
          }}>
            <p style={{ margin:0, color:"#3A2D1A", fontSize:"14px", lineHeight:1.75, fontStyle:"italic" }}>
              {feedback}
            </p>
          </div>
        )}

        {/* Mic button / Next button */}
        <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease 0.25s both" }}>
          {!isDone ? (
            <button
              className={isListening || isProcessing ? "" : "mic-idle"}
              onClick={isListening || isProcessing ? undefined : startListening}
              disabled={isListening || isProcessing}
              style={{
                width:"88px",
                height:"88px",
                borderRadius:"50%",
                border:`3px solid ${dynasty.deepColor}`,
                background: isListening ? dynasty.deepColor : isProcessing ? "#F5E8C8" : "#FFF8F0",
                cursor: isListening || isProcessing ? "default" : "pointer",
                display:"inline-flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:"36px",
                boxShadow:"0 4px 14px rgba(60,30,10,0.2)",
                transition:"all 0.2s ease",
                animation: isListening ? "pulse 1.2s ease-in-out infinite" : "none",
              }}
              aria-label={isListening ? "Listening..." : "Tap to speak"}
            >
              {isProcessing ? (
                <span style={{ width:"28px", height:"28px", border:`3px solid ${dynasty.deepColor}`, borderTopColor:"transparent", borderRadius:"50%", display:"block", animation:"spin 0.8s linear infinite" }}/>
              ) : isListening ? (
                "🔴"
              ) : (
                "🎙️"
              )}
            </button>
          ) : (
            <button
              className="next-btn"
              onClick={nextWord}
              style={{
                background:`linear-gradient(180deg, #E5C158 0%, #D4AF37 60%, #B8932A 100%)`,
                color:"#3A2A0A",
                border:"2px solid #8B6914",
                borderRadius:"999px",
                padding:"16px 48px",
                fontSize:"17px",
                fontWeight:700,
                fontFamily:"'Playfair Display',serif",
                letterSpacing:"0.06em",
                cursor:"pointer",
                boxShadow:"0 5px 14px rgba(139,0,0,0.22)",
                transition:"transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {currentIndex + 1 >= totalWords ? "See Results →" : "Next Character →"}
            </button>
          )}

          {/* Tap hint */}
          {!isDone && !isListening && !isProcessing && (
            <p style={{ marginTop:"14px", fontSize:"12px", color:"#8A7B5C", fontStyle:"italic" }}>
              Tap the mic, say <span style={{ fontFamily:"'Noto Serif SC',serif" }}>{currentWord.hanzi}</span>, then stop speaking
            </p>
          )}
          {isListening && (
            <p style={{ marginTop:"14px", fontSize:"12px", color:dynasty.deepColor, fontStyle:"italic" }}>
              Say <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"15px" }}>{currentWord.hanzi}</span> now...
            </p>
          )}
        </div>

        {/* Word counter */}
        <p style={{ textAlign:"center", marginTop:"32px", fontSize:"12px", color:"rgba(139,0,0,0.4)", letterSpacing:"0.15em" }}>
          {currentIndex + 1} of {totalWords} · {dynasty.english} Dynasty
        </p>

      </div>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#F5E8C8", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>练</span>
      </main>
    }>
      <PracticeContent />
    </Suspense>
  );
}
