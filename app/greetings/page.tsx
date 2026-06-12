"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GREETINGS = [
  {
    chinese: "你好",
    pinyin: "Nǐ hǎo",
    english: "Hello",
    usage: "The standard greeting for anyone, anytime.",
    color: "#E8E4B8",
    deepColor: "#8A7B2D",
    emoji: "👋",
  },
  {
    chinese: "你好吗",
    pinyin: "Nǐ hǎo ma",
    english: "How are you?",
    usage: "Add 吗 to any statement to make it a question.",
    color: "#D4849A",
    deepColor: "#9C4660",
    emoji: "🤔",
  },
  {
    chinese: "谢谢",
    pinyin: "Xièxiè",
    english: "Thank you",
    usage: "Say it twice for extra warmth. 谢谢你 means thank you (to you).",
    color: "#7BA888",
    deepColor: "#3D6B4F",
    emoji: "🙏",
  },
  {
    chinese: "不客气",
    pinyin: "Bù kèqì",
    english: "You're welcome",
    usage: "Literally 'don't be polite.' The natural response to 谢谢.",
    color: "#E8E4B8",
    deepColor: "#8A7B2D",
    emoji: "😊",
  },
  {
    chinese: "再见",
    pinyin: "Zàijiàn",
    english: "Goodbye",
    usage: "Literally 'see you again.' Use when parting from someone.",
    color: "#E8654A",
    deepColor: "#9E3520",
    emoji: "👋",
  },
  {
    chinese: "对不起",
    pinyin: "Duìbuqǐ",
    english: "Sorry / Excuse me",
    usage: "For genuine apologies. For bumping into someone, use 不好意思.",
    color: "#C41E1E",
    deepColor: "#8B0000",
    emoji: "😔",
  },
  {
    chinese: "没关系",
    pinyin: "Méi guānxi",
    english: "No problem / It's okay",
    usage: "The natural response to 对不起. Literally 'no relationship/matter.'",
    color: "#7BA888",
    deepColor: "#3D6B4F",
    emoji: "🤝",
  },
  {
    chinese: "请",
    pinyin: "Qǐng",
    english: "Please",
    usage: "Add before a request to be polite. 请坐 means 'please sit down.'",
    color: "#D4849A",
    deepColor: "#9C4660",
    emoji: "🌸",
  },
  {
    chinese: "好的",
    pinyin: "Hǎo de",
    english: "Okay / Alright",
    usage: "Casual agreement. 好 alone also works in informal settings.",
    color: "#E8E4B8",
    deepColor: "#8A7B2D",
    emoji: "✅",
  },
  {
    chinese: "我不懂",
    pinyin: "Wǒ bù dǒng",
    english: "I don't understand",
    usage: "Essential for learners! 请再说一遍 means 'please say it again.'",
    color: "#E8654A",
    deepColor: "#9E3520",
    emoji: "😅",
  },
];

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = 0.75;
  const zhVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith("zh"));
  if (zhVoice) utter.voice = zhVoice;
  window.speechSynthesis.speak(utter);
}

function GreetingsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [practiced, setPracticed] = useState<Record<string, boolean>>({});

  function markPracticed(chinese: string) {
    setPracticed(prev => ({ ...prev, [chinese]: true }));
  }

  const practicedCount = Object.values(practiced).filter(Boolean).length;

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
        @keyframes slideDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:200px; } }
        .greeting-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* Watermark */}
      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>好</div>

      {/* Doodles */}
      <svg style={{ position:"absolute", top:"10px", left:"10px", pointerEvents:"none" }} width="90" height="120" viewBox="0 0 90 120" opacity="0.4">
        <path d="M10,50 L10,30 L20,40 L30,20 L40,40 L50,20 L60,40 L70,30 L70,50 Z" fill="none" stroke="#3D6B4F" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="10" y1="50" x2="70" y2="50" stroke="#3D6B4F" strokeWidth="1.5"/>
        <ellipse cx="38" cy="46" rx="6" ry="4" fill="#7BA888" stroke="#3D6B4F" strokeWidth="1"/>
        {[0,60,120,180,240,300].map((r,i) => (
          <ellipse key={i} cx="20" cy="65" rx="3" ry="5" fill={i%2===0?'#7BA888':'#3D6B4F'} transform={`rotate(${r},20,73)`} opacity="0.7"/>
        ))}
      </svg>
      <svg style={{ position:"absolute", top:"10px", right:"10px", pointerEvents:"none" }} width="90" height="120" viewBox="0 0 90 120" opacity="0.4">
        {[0,72,144,216,288].map((r,i) => (
          <ellipse key={i} cx="55" cy="30" rx="5" ry="9" fill={i%2===0?'#D4849A':'#9C4660'} transform={`rotate(${r},55,42)`} opacity="0.6"/>
        ))}
        <circle cx="55" cy="42" r="5" fill="#9C4660" opacity="0.4"/>
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={10 + i*10} cy={100 + (i%2)*6} r="4" fill="#FFF8F0" stroke="#9C4660" strokeWidth="1" opacity="0.7"/>
        ))}
      </svg>

      <div style={{ maxWidth:"600px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"28px", animation:"fadeUp 0.5s ease both" }}>
          <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color:"rgba(139,0,0,0.5)", letterSpacing:"4px", marginBottom:"8px" }}>
            {chineseName || "学生"} · Essential Greetings
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"10px" }}>
            {["G","R","E","E","T","I","N","G","S"].map((ch, i) => {
              const colors = [
                { bg:"#3D6B4F", c:"#FFF8F0" },
                { bg:"#7BA888", c:"#FFF8F0" },
                { bg:"#FFF8F0", c:"#3D6B4F" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#9C4660", c:"#FFF8F0" },
                { bg:"#E8E4B8", c:"#5A3A1A" },
              ];
              const s = colors[i % colors.length];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(24px,5vw,38px)",
                  padding:"3px 10px",
                  background: s.bg, color: s.c,
                  transform:`rotate(${i%2===0?-2:2}deg)`,
                  boxShadow:"2px 3px 0 rgba(60,30,10,0.18)",
                  borderRadius:"2px",
                }}>{ch}</span>
              );
            })}
          </div>
          <p style={{ fontStyle:"italic", color:"rgba(90,58,26,0.6)", fontSize:"14px" }}>
            Tap a card to expand it. Press 🔊 to hear it. Press Got it! to track progress.
          </p>

          {/* Progress */}
          <div style={{ marginTop:"14px", background:"rgba(61,107,79,0.1)", borderRadius:"999px", height:"7px", maxWidth:"260px", margin:"14px auto 0" }}>
            <div style={{
              height:"7px", borderRadius:"999px",
              background:"linear-gradient(90deg, #3D6B4F, #7BA888)",
              width:`${(practicedCount / GREETINGS.length) * 100}%`,
              transition:"width 0.6s ease",
            }}/>
          </div>
          <p style={{ fontSize:"11px", color:"rgba(61,107,79,0.6)", marginTop:"5px" }}>
            {practicedCount} of {GREETINGS.length} practiced
          </p>
        </div>

        {/* Greeting cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {GREETINGS.map((g, i) => {
            const isActive = activeCard === g.chinese;
            const isDone = practiced[g.chinese];
            return (
              <div
                key={g.chinese}
                className="greeting-card"
                onClick={() => setActiveCard(isActive ? null : g.chinese)}
                style={{
                  background: isDone ? g.color : "#FFF8F0",
                  border:`2px solid ${g.deepColor}`,
                  borderRadius:"14px",
                  padding:"16px 18px",
                  cursor:"pointer",
                  boxShadow:`3px 4px 0 ${g.color}`,
                  transition:"all 0.2s ease",
                  animation:`fadeUp 0.5s ease ${0.1 + i*0.06}s both`,
                }}
              >
                {/* Card header */}
                <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                  <span style={{ fontSize:"28px", flexShrink:0 }}>{g.emoji}</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"28px", color:g.deepColor, fontWeight:700, display:"block", lineHeight:1.1 }}>{g.chinese}</span>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"16px", color:g.deepColor }}>{g.pinyin}</span>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"14px", fontWeight:700, color:g.deepColor, display:"block" }}>{g.english}</span>
                    <span style={{ fontSize:"16px" }}>{isActive ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isActive && (
                  <div style={{ marginTop:"14px", paddingTop:"14px", borderTop:`1px solid ${g.deepColor}30` }}
                    onClick={e => e.stopPropagation()}>
                    <p style={{ margin:"0 0 14px", color:"#3A2D1A", fontSize:"14px", lineHeight:1.7, fontStyle:"italic" }}>{g.usage}</p>
                    <div style={{ display:"flex", gap:"10px" }}>
                      <button
                        onClick={() => speak(g.chinese)}
                        style={{
                          background:g.deepColor, color:"#FFF8F0",
                          border:"none", borderRadius:"999px",
                          padding:"8px 18px", fontSize:"13px",
                          fontFamily:"'Playfair Display',serif",
                          cursor:"pointer", flex:1,
                        }}
                      >
                        🔊 Hear it
                      </button>
                      {!isDone && (
                        <button
                          onClick={() => { markPracticed(g.chinese); setActiveCard(null); }}
                          style={{
                            background:"#2D8B50", color:"#FFF8F0",
                            border:"none", borderRadius:"999px",
                            padding:"8px 18px", fontSize:"13px",
                            fontFamily:"'Playfair Display',serif",
                            cursor:"pointer", flex:1,
                          }}
                        >
                          ✓ Got it!
                        </button>
                      )}
                      {isDone && (
                        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                          <span style={{ color:"#2D8B50", fontWeight:700, fontSize:"14px" }}>✓ Practiced!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion message */}
        {practicedCount === GREETINGS.length && (
          <div style={{
            marginTop:"24px", textAlign:"center",
            background:"#FFF8F0", border:"2px solid #2D8B50",
            borderRadius:"14px", padding:"20px",
            boxShadow:"3px 4px 0 #7BA888",
            animation:"fadeUp 0.5s ease both",
          }}>
            <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"28px", color:"#2D8B50", margin:"0 0 8px" }}>🎉 恭喜！</p>
            <p style={{ fontStyle:"italic", color:"#3A2D1A", fontSize:"14px", margin:0 }}>
              Congratulations! You have practiced all essential greetings.
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
          border:"1.5px solid #3D6B4F",
          borderRadius:"999px", padding:"10px 20px",
          fontFamily:"'Playfair Display',serif", fontSize:"13px",
          color:"#3D6B4F", cursor:"pointer",
          letterSpacing:"0.05em", backdropFilter:"blur(4px)",
        }}
      >
        ← Back
      </button>
    </main>
  );
}

export default function GreetingsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#3D6B4F" }}>好</span>
      </main>
    }>
      <GreetingsContent />
    </Suspense>
  );
}
