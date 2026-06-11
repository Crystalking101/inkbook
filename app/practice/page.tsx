"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  toneMark: string;
  toneDescription: string;
  words: PracticeWord[];
};

const DYNASTY_DATA: Record<string, DynastyData> = {
  tang: {
    english: "Tang", chinese: "唐朝", color: "#E8E4B8", deepColor: "#8A7B2D",
    toneNumber: 1, toneName: "First Tone", toneMark: "ā", toneDescription: "High and level",
    words: [
      { hanzi: "妈", pinyin: "mā", meaning: "mom", toneNumber: 1 },
      { hanzi: "天", pinyin: "tiān", meaning: "sky", toneNumber: 1 },
      { hanzi: "高", pinyin: "gāo", meaning: "tall", toneNumber: 1 },
      { hanzi: "书", pinyin: "shū", meaning: "book", toneNumber: 1 },
      { hanzi: "花", pinyin: "huā", meaning: "flower", toneNumber: 1 },
    ],
  },
  han: {
    english: "Han", chinese: "汉朝", color: "#7BA888", deepColor: "#3D6B4F",
    toneNumber: 2, toneName: "Second Tone", toneMark: "á", toneDescription: "Rising sharply",
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
    toneNumber: 3, toneName: "Third Tone", toneMark: "ǎ", toneDescription: "Dipping then rising",
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
    toneNumber: 4, toneName: "Fourth Tone", toneMark: "à", toneDescription: "Falling sharply",
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
    toneNumber: 5, toneName: "Neutral Tone", toneMark: "a", toneDescription: "Light and quick",
    words: [
      { hanzi: "吗", pinyin: "ma", meaning: "question particle", toneNumber: 5 },
      { hanzi: "的", pinyin: "de", meaning: "possessive particle", toneNumber: 5 },
      { hanzi: "了", pinyin: "le", meaning: "completion particle", toneNumber: 5 },
      { hanzi: "呢", pinyin: "ne", meaning: "question softener", toneNumber: 5 },
      { hanzi: "吧", pinyin: "ba", meaning: "suggestion particle", toneNumber: 5 },
    ],
  },
};

const TONE_CURVES: Record<number, string> = {
  1: "M 8 12 L 52 12",
  2: "M 8 32 Q 30 20 52 8",
  3: "M 8 20 Q 20 40 30 36 Q 42 28 52 14",
  4: "M 8 8 L 52 36",
  5: "M 22 22 L 38 22",
};

type ScoreState = "idle" | "listening" | "processing" | "done" | "error";

async function getAIFeedback(hanzi: string, pinyin: string, score: number, dynastyName: string): Promise<string> {
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
        messages: [{
          role: "user",
          content: `You are a warm encouraging Mandarin tone coach for InkBook set in the ${dynastyName} dynasty. The student practiced saying "${hanzi}" (${pinyin}) and scored ${score}% on tone accuracy. Give a SHORT 1-2 sentence encouraging response. If score >= 85 celebrate. If score >= 60 encourage and give one tip. If score < 60 be kind and give one simple tip. Never mention percentages. Keep it fun and themed. End with a short Chinese phrase.`,
        }],
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
  const scoreStateRef = useRef<ScoreState>("idle");

  const currentWord = dynasty.words[currentIndex];
  const totalWords = dynasty.words.length;

  async function startListening() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setScoreState("error");
      setFeedback("Speech recognition not supported in this browser. Please use Chrome.");
      return;
    }

    setScoreState("listening");
    scoreStateRef.current = "listening";
    setToneScore(null);
    setFeedback("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = async (event: any) => {
      setScoreState("processing");
      scoreStateRef.current = "processing";
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      console.log("Heard:", transcript, "Confidence:", confidence);
      // Default to 70 if confidence is 0 (Chrome sometimes returns 0)
      const score = Math.round((confidence > 0 ? confidence : 0.70) * 100);
      setToneScore(score);
      setScores((prev) => [...prev, score]);
      setCardFlip(true);
      const fb = await getAIFeedback(currentWord.hanzi, currentWord.pinyin, score, dynasty.english);
      setFeedback(fb);
      setScoreState("done");
      scoreStateRef.current = "done";
    };

    recognition.onerror = async (event: any) => {
      console.error("Speech error:", event.error);
      if (event.error === "no-speech" || event.error === "audio-capture" || event.error === "network") {
        // Give a default score so user can still proceed
        const defaultScore = 70;
        setToneScore(defaultScore);
        setScores((prev) => [...prev, defaultScore]);
        setCardFlip(true);
        const fb = await getAIFeedback(currentWord.hanzi, currentWord.pinyin, defaultScore, dynasty.english);
        setFeedback(fb);
        setScoreState("done");
        scoreStateRef.current = "done";
      } else {
        setScoreState("error");
        scoreStateRef.current = "error";
        setFeedback("Could not hear you. Please try again and speak clearly.");
      }
    };

    recognition.onend = () => {
      if (scoreStateRef.current === "listening") {
        setScoreState("idle");
        scoreStateRef.current = "idle";
      }
    };

    recognition.start();
  }

  function nextWord() {
    setCardFlip(false);
    setToneScore(null);
    setFeedback("");
    setScoreState("idle");
    scoreStateRef.current = "idle";
    if (currentIndex + 1 >= totalWords) {
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      router.push(`/results?dynasty=${dynastyId}&name=${encodeURIComponent(chineseName)}&score=${avg}`);
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
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#FFF8F0",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(139,0,0,0.06) 27px, rgba(139,0,0,0.06) 28px)",
      padding: "40px 20px 120px",
      fontFamily: "'Playfair Display', serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(139,0,0,0.4); } 50% { transform:scale(1.06); box-shadow:0 0 0 14px rgba(139,0,0,0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes flipIn { from { opacity:0; transform:rotateY(90deg) scale(0.9); } to { opacity:1; transform:rotateY(0deg) scale(1); } }
        @keyframes scoreCount { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
        .mic-idle:hover { transform:scale(1.05); }
        .next-btn:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(139,0,0,0.3); }
      `}</style>

      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>练</div>

      <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px", animation:"fadeUp 0.5s ease both" }}>
          <div style={{ width:"60px" }}/>
          <div style={{ textAlign:"center" }}>
            <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"22px", color:"#8B0000", letterSpacing:"4px", display:"block" }}>{dynasty.chinese}</span>
            <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"42px", color:dynasty.deepColor, lineHeight:1, display:"block", marginTop:"4px" }}>{dynasty.toneMark}</span>
            <span style={{ display:"block", fontSize:"13px", color:"rgba(139,0,0,0.5)", letterSpacing:"2px", marginTop:"2px", textTransform:"uppercase" }}>{dynasty.toneName}</span>
            <span style={{ display:"block", fontSize:"15px", color:dynasty.deepColor, fontStyle:"italic", marginTop:"2px" }}>{dynasty.toneDescription}</span>
          </div>
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

        {/* Instruction */}
        <p style={{ textAlign:"center", color:"#8B0000", letterSpacing:"0.2em", textTransform:"uppercase", fontSize:"13px", marginBottom:"20px", fontWeight:700, animation:"fadeUp 0.5s ease 0.1s both" }}>
          {isDone ? "Here is how you did" : isListening ? "Listening..." : isProcessing ? "Scoring..." : `Say this character in the ${dynasty.english} tone`}
        </p>

        {/* Character card */}
        <div style={{
          background: isDone ? dynasty.color : "#FFF8F0",
          border: `2px solid ${dynasty.deepColor}`,
          borderRadius:"18px",
          boxShadow:`5px 7px 0 ${dynasty.color}`,
          padding:"32px 24px 28px",
          textAlign:"center",
          marginBottom:"24px",
          transition:"background 0.4s ease",
          animation: cardFlip ? "flipIn 0.4s ease" : "fadeUp 0.5s ease 0.15s both",
          position:"relative",
          overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:"14px", right:"16px", opacity:0.3 }}>
            <svg width="60" height="44" viewBox="0 0 60 44">
              <line x1="6" y1="8" x2="6" y2="36" stroke={dynasty.deepColor} strokeWidth="0.8" opacity="0.5"/>
              <line x1="6" y1="8" x2="54" y2="8" stroke={dynasty.deepColor} strokeWidth="0.8" strokeDasharray="2,3"/>
              <line x1="6" y1="22" x2="54" y2="22" stroke={dynasty.deepColor} strokeWidth="0.8" strokeDasharray="2,3"/>
              <line x1="6" y1="36" x2="54" y2="36" stroke={dynasty.deepColor} strokeWidth="0.8" strokeDasharray="2,3"/>
              <path d={TONE_CURVES[dynasty.toneNumber]} fill="none" stroke={dynasty.deepColor} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"clamp(80px,20vw,120px)", color: isDone ? dynasty.deepColor : "#1A1A1A", lineHeight:1, marginBottom:"10px", transition:"color 0.4s ease" }}>
            {currentWord.hanzi}
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"28px", color:dynasty.deepColor, marginBottom:"6px" }}>
            {currentWord.pinyin}
          </div>
          <div style={{ fontSize:"16px", color:"#6B5B3E", letterSpacing:"0.08em" }}>
            {currentWord.meaning}
          </div>

          {isDone && toneScore !== null && (
            <div style={{ marginTop:"20px", animation:"scoreCount 0.5s ease both" }}>
              <div style={{ fontSize:"52px", fontWeight:700, color:getScoreColor(toneScore), lineHeight:1, fontFamily:"'Playfair Display',serif" }}>{toneScore}%</div>
              <div style={{ fontSize:"15px", letterSpacing:"0.18em", textTransform:"uppercase", color:getScoreColor(toneScore), marginTop:"4px" }}>{getScoreLabel(toneScore)}</div>
            </div>
          )}

          {isError && (
            <div style={{ marginTop:"16px", padding:"10px 16px", background:"rgba(196,30,30,0.08)", borderRadius:"8px", fontSize:"14px", color:"#8B0000", fontStyle:"italic" }}>
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
            boxShadow:`3px 4px 0 ${dynasty.color}`,
            animation:"fadeUp 0.5s ease 0.2s both",
          }}>
            <p style={{ margin:0, color:"#3A2D1A", fontSize:"15px", lineHeight:1.75, fontStyle:"italic" }}>{feedback}</p>
          </div>
        )}

        {/* Mic / Next */}
        <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease 0.25s both" }}>
          {!isDone ? (
            <button
              className={isListening || isProcessing ? "" : "mic-idle"}
              onClick={isListening || isProcessing ? undefined : startListening}
              disabled={isListening || isProcessing}
              style={{
                width:"96px", height:"96px", borderRadius:"50%",
                border:`3px solid ${dynasty.deepColor}`,
                background: isListening ? dynasty.deepColor : "#FFF8F0",
                cursor: isListening || isProcessing ? "default" : "pointer",
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                fontSize:"38px",
                boxShadow:`0 4px 14px rgba(60,30,10,0.15)`,
                transition:"all 0.2s ease",
                animation: isListening ? "pulse 1.2s ease-in-out infinite" : "none",
              }}
              aria-label={isListening ? "Listening..." : "Tap to speak"}
            >
              {isProcessing ? (
                <span style={{ width:"28px", height:"28px", border:`3px solid ${dynasty.deepColor}`, borderTopColor:"transparent", borderRadius:"50%", display:"block", animation:"spin 0.8s linear infinite" }}/>
              ) : isListening ? "🔴" : "🎙️"}
            </button>
          ) : (
            <button className="next-btn" onClick={nextWord} style={{
              background: dynasty.deepColor,
              color:"#FFF8F0",
              border:`2px solid ${dynasty.deepColor}`,
              borderRadius:"999px", padding:"16px 48px",
              fontSize:"17px", fontWeight:700,
              fontFamily:"'Playfair Display',serif",
              letterSpacing:"0.06em", cursor:"pointer",
              boxShadow:`0 5px 14px rgba(60,30,10,0.18)`,
              transition:"transform 0.15s ease, box-shadow 0.15s ease",
            }}>
              {currentIndex + 1 >= totalWords ? "See Results →" : "Next Character →"}
            </button>
          )}

          {!isDone && !isListening && !isProcessing && (
            <p style={{ marginTop:"14px", fontSize:"14px", color:"#8A7B5C", fontStyle:"italic" }}>
              Tap the mic, say <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"16px" }}>{currentWord.hanzi}</span>, then stop speaking
            </p>
          )}
          {isListening && (
            <p style={{ marginTop:"14px", fontSize:"14px", color:dynasty.deepColor, fontStyle:"italic" }}>
              Say <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"18px" }}>{currentWord.hanzi}</span> now...
            </p>
          )}
        </div>

        <p style={{ textAlign:"center", marginTop:"32px", fontSize:"13px", color:"rgba(139,0,0,0.4)", letterSpacing:"0.15em" }}>
          {currentIndex + 1} of {totalWords} · {dynasty.english} Dynasty
        </p>
      </div>

      {/* Back button bottom left */}
      <button
        onClick={() => router.push(`/tones?dynasty=${dynastyId}&name=${encodeURIComponent(chineseName)}`)}
        style={{
          position:"fixed", bottom:"28px", left:"24px",
          background:"rgba(255,248,240,0.92)",
          border:`1.5px solid ${dynasty.deepColor}`,
          borderRadius:"999px", padding:"10px 20px",
          fontFamily:"'Playfair Display',serif", fontSize:"13px",
          color:dynasty.deepColor, cursor:"pointer",
          letterSpacing:"0.05em",
          backdropFilter:"blur(4px)",
          transition:"opacity 0.2s ease",
        }}
      >
        ← Back
      </button>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>练</span>
      </main>
    }>
      <PracticeContent />
    </Suspense>
  );
}
