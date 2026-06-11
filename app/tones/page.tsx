"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ExampleWord = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

type DynastyTone = {
  id: string;
  english: string;
  chinese: string;
  period: string;
  color: string;
  deepColor: string;
  toneNumber: string;
  toneName: string;
  toneMark: string;
  description: string;
  howTo: string;
  curvePath: string;
  startDot: { x: number; y: number };
  endDot: { x: number; y: number };
  story: string;
  storyTitle: string;
  examples: ExampleWord[];
};

const DYNASTIES: Record<string, DynastyTone> = {
  tang: {
    id: "tang", english: "Tang", chinese: "唐朝", period: "618 – 907",
    color: "#E8E4B8", deepColor: "#8A7B2D",
    toneNumber: "1st", toneName: "First Tone", toneMark: "ā",
    description: "High and level",
    howTo: "Hold your voice high and steady, like singing one flat note. It does not rise or fall. Pretend you are at the doctor saying \"aaah\".",
    curvePath: "M 40 35 L 260 35",
    startDot: { x: 40, y: 35 }, endDot: { x: 260, y: 35 },
    storyTitle: "The Golden Age",
    story: "The Tang dynasty was China's golden age of poetry. Poets like Li Bai wrote verses that people still memorize 1,300 years later. The Tang held its empire high and steady for nearly three centuries — just like the First Tone holds its pitch high and level, never wavering.",
    examples: [
      { hanzi: "妈", pinyin: "mā", meaning: "mom" },
      { hanzi: "天", pinyin: "tiān", meaning: "sky" },
      { hanzi: "高", pinyin: "gāo", meaning: "tall" },
    ],
  },
  han: {
    id: "han", english: "Han", chinese: "汉朝", period: "206 BC – 220 AD",
    color: "#D4A832", deepColor: "#8A6A14",
    toneNumber: "2nd", toneName: "Second Tone", toneMark: "á",
    description: "Rising sharply",
    howTo: "Start in the middle of your voice and slide up, like asking a surprised question in English: \"What?\" Your pitch climbs from middle to high.",
    curvePath: "M 40 95 Q 150 85 260 30",
    startDot: { x: 40, y: 95 }, endDot: { x: 260, y: 30 },
    storyTitle: "The Rising Empire",
    story: "The Han dynasty rose from civil war to become one of history's great empires, opening the Silk Road and stretching China's reach across Asia. Chinese people still call themselves 汉人 — \"Han people\" — today. The Second Tone rises just like the Han did: starting from the middle and climbing high.",
    examples: [
      { hanzi: "麻", pinyin: "má", meaning: "hemp" },
      { hanzi: "人", pinyin: "rén", meaning: "person" },
      { hanzi: "来", pinyin: "lái", meaning: "to come" },
    ],
  },
  ming: {
    id: "ming", english: "Ming", chinese: "明朝", period: "1368 – 1644",
    color: "#E8654A", deepColor: "#9E3520",
    toneNumber: "3rd", toneName: "Third Tone", toneMark: "ǎ",
    description: "Dipping then rising",
    howTo: "Start in the middle, dip down low, then bounce back up. It feels like a little valley in your voice — like a doubtful \"well...\" in English.",
    curvePath: "M 40 80 Q 110 145 160 130 Q 220 110 260 55",
    startDot: { x: 40, y: 80 }, endDot: { x: 260, y: 55 },
    storyTitle: "The Great Comeback",
    story: "Before the Ming, China had dipped under a century of Mongol rule. Then a peasant rebel rose to found the Ming dynasty, rebuilding the Great Wall and sending treasure fleets across the ocean. The Third Tone follows the same shape — it dips down low before rising back up.",
    examples: [
      { hanzi: "马", pinyin: "mǎ", meaning: "horse" },
      { hanzi: "好", pinyin: "hǎo", meaning: "good" },
      { hanzi: "水", pinyin: "shuǐ", meaning: "water" },
    ],
  },
  qing: {
    id: "qing", english: "Qing", chinese: "清朝", period: "1644 – 1912",
    color: "#C41E1E", deepColor: "#8B0000",
    toneNumber: "4th", toneName: "Fourth Tone", toneMark: "à",
    description: "Falling sharply",
    howTo: "Start high and drop fast, like firmly saying \"No!\" in English. The pitch falls from the top of your voice straight to the bottom.",
    curvePath: "M 40 30 L 260 130",
    startDot: { x: 40, y: 30 }, endDot: { x: 260, y: 130 },
    storyTitle: "The Decisive Conquest",
    story: "The Qing swept down from the north in 1644 and took Beijing in a single decisive campaign, founding China's last imperial dynasty. The Fourth Tone moves the same way — it starts at the very top and falls sharply, quick and commanding, leaving no doubt.",
    examples: [
      { hanzi: "骂", pinyin: "mà", meaning: "to scold" },
      { hanzi: "大", pinyin: "dà", meaning: "big" },
      { hanzi: "是", pinyin: "shì", meaning: "to be" },
    ],
  },
  song: {
    id: "song", english: "Song", chinese: "宋朝", period: "960 – 1279",
    color: "#D4849A", deepColor: "#9C4660",
    toneNumber: "5th", toneName: "Neutral Tone", toneMark: "a",
    description: "Neutral and light",
    howTo: "Say it short, soft, and quick — with no shape at all. It is the lightest touch, like the unstressed \"a\" at the end of \"sofa\".",
    curvePath: "M 130 85 L 170 85",
    startDot: { x: 130, y: 85 }, endDot: { x: 170, y: 85 },
    storyTitle: "The Quiet Refinement",
    story: "The Song dynasty conquered with brush and ink rather than sword. It perfected porcelain, landscape painting, and printed books, prizing subtlety above grandeur. The Neutral Tone shares that spirit — light, brief, and understated, the gentlest sound in Mandarin.",
    examples: [
      { hanzi: "吗", pinyin: "ma", meaning: "question word" },
      { hanzi: "的", pinyin: "de", meaning: "'s (possessive)" },
      { hanzi: "了", pinyin: "le", meaning: "done (particle)" },
    ],
  },
};

const RANSOM_STYLES = [
  { fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#8B0000", transform: "rotate(-4deg)", background: "#FFF8F0" },
  { fontFamily: "'Noto Serif SC', serif", fontWeight: 700, color: "#FFF8F0", transform: "rotate(3deg)", background: "#8B0000" },
  { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: "italic" as const, color: "#8B0000", transform: "rotate(2deg)", background: "#D4AF37" },
  { fontFamily: "'Noto Serif SC', serif", fontWeight: 900, color: "#D4AF37", transform: "rotate(-2deg)", background: "#3A2A1A" },
];

function RansomTitle({ text }: { text: string }) {
  return (
    <h1 style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", margin: 0 }}>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} style={{ width: "16px" }} />
        ) : (
          <span key={i} style={{
            ...RANSOM_STYLES[i % RANSOM_STYLES.length],
            fontSize: "clamp(26px, 6vw, 44px)",
            padding: "2px 10px",
            lineHeight: 1.2,
            boxShadow: "2px 3px 0 rgba(60,30,10,0.25)",
            display: "inline-block",
          }}>{ch}</span>
        )
      )}
    </h1>
  );
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = 0.8;
  const zhVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("zh"));
  if (zhVoice) utter.voice = zhVoice;
  window.speechSynthesis.speak(utter);
}

function ToneCurve({ dynasty }: { dynasty: DynastyTone }) {
  const gridLevels = [5, 4, 3, 2, 1];
  return (
    <svg viewBox="0 0 300 160" style={{ width: "100%", maxWidth: "440px", display: "block", margin: "0 auto" }}
      role="img" aria-label={`Pitch curve for the ${dynasty.toneName}: ${dynasty.description}`}>
      {gridLevels.map((level, i) => {
        const y = 20 + i * 30;
        return (
          <g key={level}>
            <line x1="40" y1={y} x2="260" y2={y} stroke="#C9A45C" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.6" />
            <text x="26" y={y + 4} fontSize="11" fill="#8A7B5C" fontFamily="'Playfair Display', serif" textAnchor="middle">{level}</text>
          </g>
        );
      })}
      <path d={dynasty.curvePath} fill="none" stroke="#1A1A1A" strokeWidth="13" strokeLinecap="round" opacity="0.08" />
      <path d={dynasty.curvePath} fill="none" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round"
        style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: "inkDraw 1.4s ease-out 0.4s forwards" }} />
      <circle cx={dynasty.startDot.x} cy={dynasty.startDot.y} r="6" fill={dynasty.deepColor}
        style={{ opacity: 0, animation: "dotIn 0.4s ease-out 0.4s forwards" }} />
      <circle cx={dynasty.endDot.x} cy={dynasty.endDot.y} r="6" fill={dynasty.deepColor}
        style={{ opacity: 0, animation: "dotIn 0.4s ease-out 1.8s forwards" }} />
    </svg>
  );
}

function ToneIntroContent() {
  const router = useRouter();
  const params = useSearchParams();
  const dynastyId = params.get("dynasty") ?? "tang";
  const chineseName = params.get("name") ?? "";
  const dynasty = DYNASTIES[dynastyId] ?? DYNASTIES.tang;
  const [voicesReady, setVoicesReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => setVoicesReady(true);
    window.speechSynthesis.onvoiceschanged = load;
    if (window.speechSynthesis.getVoices().length > 0) setVoicesReady(true);
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const goToPractice = () => {
    router.push(`/practice?dynasty=${dynasty.id}&name=${encodeURIComponent(chineseName)}`);
  };

  return (
    <main style={{
      minHeight: "100vh", backgroundColor: "#F5E8C8",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 38px, rgba(139,0,0,0.12) 38px, rgba(139,0,0,0.12) 39px)",
      position: "relative", overflow: "hidden", padding: "48px 20px 80px",
      fontFamily: "'Playfair Display', serif",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes inkDraw { to { stroke-dashoffset: 0; } }
        @keyframes dotIn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-delay: 0ms !important; } }
        .ink-speak-btn:hover { transform: scale(1.08); }
        .ink-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(139,0,0,0.35); }
      `}</style>

      <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "min(70vw, 560px)", fontFamily: "'Noto Serif SC', serif", color: "rgba(139,0,0,0.05)", userSelect: "none", pointerEvents: "none", lineHeight: 1 }}>墨</div>
      <div aria-hidden="true" style={{ position: "absolute", top: "16px", left: "16px", fontSize: "34px", opacity: 0.5, transform: "rotate(-8deg)" }}>🎋</div>
      <div aria-hidden="true" style={{ position: "absolute", top: "16px", right: "16px", fontSize: "34px", opacity: 0.5, transform: "rotate(10deg)" }}>🌸</div>
      <div aria-hidden="true" style={{ position: "absolute", bottom: "16px", left: "16px", fontSize: "34px", opacity: 0.5 }}>🏮</div>

      <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
        <p style={{ textAlign: "center", color: "#8B0000", letterSpacing: "0.22em", textTransform: "uppercase", fontSize: "13px", marginBottom: "10px", animation: "fadeUp 0.6s ease-out both" }}>
          {chineseName ? (<>Welcome, <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "17px", letterSpacing: "0.1em" }}>{chineseName}</span> · Scholar of the {dynasty.english}</>) : (<>Scholar of the {dynasty.english} Dynasty</>)}
        </p>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.1s both", marginBottom: "8px" }}>
          <RansomTitle text={`THE ${dynasty.toneNumber.toUpperCase()} TONE`} />
        </div>

        <p style={{ textAlign: "center", fontStyle: "italic", color: "#6B5B3E", fontSize: "17px", marginTop: "10px", marginBottom: "34px", animation: "fadeUp 0.6s ease-out 0.2s both" }}>
          {dynasty.chinese} · {dynasty.period} · {dynasty.description}
        </p>

        {/* Tone curve card */}
        <section style={{ background: "#FFF8F0", border: `2px solid ${dynasty.deepColor}`, borderRadius: "14px", boxShadow: "4px 6px 0 rgba(60,30,10,0.18)", padding: "26px 22px 18px", marginBottom: "26px", animation: "fadeUp 0.6s ease-out 0.3s both" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "14px", marginBottom: "6px" }}>
            <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "56px", color: dynasty.deepColor, lineHeight: 1 }}>{dynasty.toneMark}</span>
            <span style={{ color: "#6B5B3E", fontSize: "15px", fontStyle: "italic" }}>{dynasty.toneName}</span>
          </div>
          <ToneCurve dynasty={dynasty} />
          <p style={{ textAlign: "center", color: "#4A3B26", fontSize: "15px", lineHeight: 1.65, maxWidth: "480px", margin: "12px auto 6px" }}>{dynasty.howTo}</p>
        </section>

        {/* Example words */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "26px", animation: "fadeUp 0.6s ease-out 0.45s both" }}>
          {dynasty.examples.map((word) => (
            <button key={word.hanzi} className="ink-speak-btn" onClick={() => speak(word.hanzi)}
              title={voicesReady ? `Hear ${word.pinyin}` : "Tap to hear"}
              style={{ background: dynasty.color, border: `2px solid ${dynasty.deepColor}`, borderRadius: "12px", padding: "16px 10px 14px", cursor: "pointer", boxShadow: "3px 4px 0 rgba(60,30,10,0.18)", transition: "transform 0.15s ease", textAlign: "center" }}>
              <span style={{ display: "block", fontFamily: "'Noto Serif SC', serif", fontSize: "44px", color: "#2A1A0A", lineHeight: 1.1 }}>{word.hanzi}</span>
              <span style={{ display: "block", fontSize: "17px", fontStyle: "italic", color: dynasty.deepColor, marginTop: "4px" }}>{word.pinyin}</span>
              <span style={{ display: "block", fontSize: "12px", color: "#4A3B26", marginTop: "2px", letterSpacing: "0.04em" }}>{word.meaning} · 🔊</span>
            </button>
          ))}
        </section>

        {/* Cultural context card */}
        <section style={{ background: "#FFF8F0", borderLeft: `6px solid ${dynasty.deepColor}`, borderRadius: "0 12px 12px 0", boxShadow: "4px 6px 0 rgba(60,30,10,0.14)", padding: "20px 24px", marginBottom: "38px", animation: "fadeUp 0.6s ease-out 0.6s both" }}>
          <p style={{ margin: 0, color: dynasty.deepColor, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "12px" }}>{dynasty.storyTitle}</p>
          <p style={{ margin: "10px 0 0", color: "#3A2D1A", fontSize: "15px", lineHeight: 1.75 }}>{dynasty.story}</p>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease-out 0.75s both" }}>
          <button className="ink-cta" onClick={goToPractice} style={{ background: "linear-gradient(180deg, #E5C158 0%, #D4AF37 60%, #B8932A 100%)", color: "#3A2A0A", border: "2px solid #8B6914", borderRadius: "999px", padding: "16px 42px", fontSize: "18px", fontWeight: 700, fontFamily: "'Playfair Display', serif", letterSpacing: "0.06em", cursor: "pointer", boxShadow: "0 6px 16px rgba(139,0,0,0.25)", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
            Start Practicing →
          </button>
          <p style={{ marginTop: "14px", fontSize: "13px", color: "#8A7B5C", fontStyle: "italic" }}>Tap any character above to hear it spoken aloud</p>
        </div>
      </div>
    </main>
  );
}

export default function TonesPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", backgroundColor: "#F5E8C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "48px", color: "#8B0000" }}>墨</span>
      </main>
    }>
      <ToneIntroContent />
    </Suspense>
  );
}
