"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PinyinSection = {
  id: string;
  title: string;
  chinese: string;
  color: string;
  deepColor: string;
  description: string;
  items: { symbol: string; example: string; meaning: string; tip?: string }[];
};

const PINYIN_SECTIONS: PinyinSection[] = [
  {
    id: "initials",
    title: "Initials",
    chinese: "声母",
    color: "#E8E4B8",
    deepColor: "#8A7B2D",
    description: "The consonant sounds that start a syllable",
    items: [
      { symbol: "b", example: "bā", meaning: "eight", tip: "Like English 'b' but unaspirated" },
      { symbol: "p", example: "pá", meaning: "climb", tip: "Like English 'p' with a puff of air" },
      { symbol: "m", example: "māo", meaning: "cat", tip: "Same as English 'm'" },
      { symbol: "f", example: "fēi", meaning: "fly", tip: "Same as English 'f'" },
      { symbol: "d", example: "dà", meaning: "big", tip: "Like English 'd' but unaspirated" },
      { symbol: "t", example: "tā", meaning: "he/she", tip: "Like English 't' with a puff of air" },
      { symbol: "n", example: "nǐ", meaning: "you", tip: "Same as English 'n'" },
      { symbol: "l", example: "lái", meaning: "come", tip: "Same as English 'l'" },
      { symbol: "g", example: "gāo", meaning: "tall", tip: "Like English 'g' but unaspirated" },
      { symbol: "k", example: "kāi", meaning: "open", tip: "Like English 'k' with a puff of air" },
      { symbol: "h", example: "hǎo", meaning: "good", tip: "Slightly raspier than English 'h'" },
    ],
  },
  {
    id: "tricky",
    title: "Tricky Sounds",
    chinese: "难音",
    color: "#D4849A",
    deepColor: "#9C4660",
    description: "The sounds that confuse most English speakers",
    items: [
      { symbol: "q", example: "qī", meaning: "seven", tip: "Tongue tip behind lower teeth, blow air — like 'ch' but lighter" },
      { symbol: "ch", example: "chī", meaning: "eat", tip: "Tongue curled back, stronger than 'q'" },
      { symbol: "x", example: "xǐ", meaning: "wash", tip: "Tongue tip behind lower teeth — like 'sh' but lighter" },
      { symbol: "sh", example: "shū", meaning: "book", tip: "Tongue curled back — stronger than 'x'" },
      { symbol: "z", example: "zài", meaning: "again", tip: "Like 'ds' in 'beds' — keep tongue forward" },
      { symbol: "zh", example: "zhōng", meaning: "middle", tip: "Tongue curled back — like 'j' in 'judge'" },
      { symbol: "c", example: "cài", meaning: "vegetable", tip: "Like 'ts' in 'its' — keep tongue forward" },
      { symbol: "r", example: "rén", meaning: "person", tip: "Tongue curled back — between English 'r' and 'zh'" },
    ],
  },
  {
    id: "finals",
    title: "Finals",
    chinese: "韵母",
    color: "#7BA888",
    deepColor: "#3D6B4F",
    description: "The vowel sounds that end a syllable",
    items: [
      { symbol: "a", example: "bā", meaning: "eight", tip: "Open mouth wide — like 'ah'" },
      { symbol: "ai", example: "māi", meaning: "buy", tip: "Like 'eye' in English" },
      { symbol: "ao", example: "hǎo", meaning: "good", tip: "Like 'ow' in 'cow'" },
      { symbol: "an", example: "fàn", meaning: "rice", tip: "Like 'ahn'" },
      { symbol: "ang", example: "máng", meaning: "busy", tip: "Nasal 'ahng'" },
      { symbol: "e", example: "hē", meaning: "drink", tip: "Like 'uh' in 'the'" },
      { symbol: "ei", example: "měi", meaning: "beautiful", tip: "Like 'ay' in 'say'" },
      { symbol: "en", example: "mén", meaning: "door", tip: "Like 'un' in 'fun'" },
      { symbol: "i", example: "nǐ", meaning: "you", tip: "Like 'ee' in 'see'" },
      { symbol: "o", example: "wǒ", meaning: "I/me", tip: "Like 'aw' with lips rounded" },
      { symbol: "ou", example: "gǒu", meaning: "dog", tip: "Like 'oh'" },
      { symbol: "u", example: "shū", meaning: "book", tip: "Like 'oo' in 'too'" },
      { symbol: "ü", example: "lǘ", meaning: "donkey", tip: "Say 'ee' then round your lips" },
    ],
  },
];

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = 0.7;
  const zhVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith("zh"));
  if (zhVoice) utter.voice = zhVoice;
  window.speechSynthesis.speak(utter);
}

function PinyinContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [activeSection, setActiveSection] = useState("initials");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const section = PINYIN_SECTIONS.find(s => s.id === activeSection) ?? PINYIN_SECTIONS[0];

  function toggleFlip(symbol: string) {
    setFlipped(prev => ({ ...prev, [symbol]: !prev[symbol] }));
  }

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#FFF8F0",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(139,0,0,0.06) 27px, rgba(139,0,0,0.06) 28px)",
      padding: "40px 20px 100px",
      fontFamily: "'Playfair Display', serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flipCard { from { transform: rotateY(0deg); } to { transform: rotateY(180deg); } }
        .card-flip:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(60,30,10,0.15) !important; }
      `}</style>

      {/* Watermark */}
      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>拼</div>

      <div style={{ maxWidth:"680px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"28px", animation:"fadeUp 0.5s ease both" }}>
          <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color:"rgba(139,0,0,0.5)", letterSpacing:"4px", marginBottom:"8px" }}>
            {chineseName || "学生"} · Pinyin Guide
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"8px" }}>
            {["P","I","N","Y","I","N"].map((ch, i) => {
              const colors = [
                { bg:"#8B0000", c:"#FFF8F0" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#7BA888", c:"#FFF8F0" },
                { bg:"#E8E4B8", c:"#5A3A1A" },
                { bg:"#E8654A", c:"#FFF8F0" },
                { bg:"#FFF8F0", c:"#8B0000" },
              ];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(28px,7vw,44px)",
                  padding:"3px 12px",
                  background: colors[i].bg, color: colors[i].c,
                  transform:`rotate(${i%2===0?-3:2}deg)`,
                  boxShadow:"2px 3px 0 rgba(60,30,10,0.2)",
                  borderRadius:"2px",
                }}>{ch}</span>
              );
            })}
          </div>
          <p style={{ fontStyle:"italic", color:"rgba(90,58,26,0.6)", fontSize:"14px" }}>
            Tap any card to see the pronunciation tip. Tap 🔊 to hear it.
          </p>
        </div>

        {/* Section tabs */}
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", marginBottom:"28px", flexWrap:"wrap", animation:"fadeUp 0.5s ease 0.1s both" }}>
          {PINYIN_SECTIONS.map(s => (
            <button key={s.id} onClick={() => { setActiveSection(s.id); setFlipped({}); }}
              style={{
                background: activeSection === s.id ? s.deepColor : "#FFF8F0",
                color: activeSection === s.id ? "#FFF8F0" : s.deepColor,
                border: `2px solid ${s.deepColor}`,
                borderRadius:"999px", padding:"8px 20px",
                fontFamily:"'Playfair Display',serif", fontSize:"13px",
                fontWeight:700, cursor:"pointer",
                boxShadow: activeSection === s.id ? `0 4px 12px rgba(60,30,10,0.2)` : "none",
                transition:"all 0.2s ease",
              }}>
              <span style={{ fontFamily:"'Noto Serif SC',serif", marginRight:"6px" }}>{s.chinese}</span>
              {s.title}
            </button>
          ))}
        </div>

        {/* Section description */}
        <div style={{
          background:"#FFF8F0", border:`2px solid ${section.deepColor}`,
          borderRadius:"12px", padding:"14px 20px", marginBottom:"22px",
          boxShadow:`3px 4px 0 ${section.color}`,
          animation:"fadeUp 0.4s ease both",
        }}>
          <p style={{ margin:0, color:section.deepColor, fontSize:"15px", fontStyle:"italic" }}>
            <span style={{ fontFamily:"'Noto Serif SC',serif", marginRight:"8px" }}>{section.chinese}</span>
            {section.description}
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",
          gap:"14px",
          animation:"fadeUp 0.4s ease 0.15s both",
        }}>
          {section.items.map((item) => (
            <div
              key={item.symbol}
              className="card-flip"
              onClick={() => toggleFlip(item.symbol)}
              style={{
                background: flipped[item.symbol] ? section.color : "#FFF8F0",
                border:`2px solid ${section.deepColor}`,
                borderRadius:"14px",
                padding:"16px 12px",
                cursor:"pointer",
                boxShadow:`3px 4px 0 ${section.color}`,
                transition:"all 0.2s ease",
                minHeight:"120px",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                textAlign:"center",
                gap:"6px",
                position:"relative",
              }}
            >
              {!flipped[item.symbol] ? (
                <>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"36px", fontWeight:700, color:section.deepColor, lineHeight:1 }}>{item.symbol}</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"16px", color:section.deepColor }}>{item.example}</span>
                  <span style={{ fontSize:"12px", color:"#6B5B3E" }}>{item.meaning}</span>
                  <button
                    onClick={e => { e.stopPropagation(); speak(item.example); }}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:"18px", marginTop:"2px" }}
                  >🔊</button>
                </>
              ) : (
                <>
                  <span style={{ fontSize:"22px" }}>💡</span>
                  <p style={{ margin:0, fontSize:"12px", color:section.deepColor, lineHeight:1.6, fontStyle:"italic" }}>{item.tip}</p>
                  <span style={{ fontSize:"11px", color:"rgba(139,0,0,0.4)", marginTop:"4px" }}>tap to flip back</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Difficult sounds callout */}
        {activeSection === "tricky" && (
          <div style={{
            marginTop:"24px",
            background:"#FFF8F0",
            border:`2px solid ${section.deepColor}`,
            borderLeft:`6px solid ${section.deepColor}`,
            borderRadius:"0 12px 12px 0",
            padding:"18px 22px",
            boxShadow:`3px 4px 0 ${section.color}`,
            animation:"fadeUp 0.4s ease both",
          }}>
            <p style={{ margin:"0 0 8px", color:section.deepColor, fontWeight:700, fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              The Golden Rule
            </p>
            <p style={{ margin:0, color:"#3A2D1A", fontSize:"14px", lineHeight:1.75, fontStyle:"italic" }}>
              q/x have the tongue tip behind the lower front teeth. zh/ch/sh/r have the tongue curled back. z/c/s keep the tongue forward and flat. Practice the pairs together and the difference will click.
            </p>
          </div>
        )}

      </div>

      {/* Back button */}
      <button
        onClick={() => router.push(`/learn?name=${encodeURIComponent(chineseName)}&english=${encodeURIComponent(englishName)}`)}
        style={{
          position:"fixed", bottom:"28px", left:"24px",
          background:"rgba(255,248,240,0.92)",
          border:`1.5px solid ${section.deepColor}`,
          borderRadius:"999px", padding:"10px 20px",
          fontFamily:"'Playfair Display',serif", fontSize:"13px",
          color:section.deepColor, cursor:"pointer",
          letterSpacing:"0.05em", backdropFilter:"blur(4px)",
        }}
      >
        ← Back
      </button>
    </main>
  );
}

export default function PinyinPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>拼</span>
      </main>
    }>
      <PinyinContent />
    </Suspense>
  );
}
