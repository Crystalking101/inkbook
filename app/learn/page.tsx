"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const MODULES = [
  {
    id: "tones",
    icon: "🏯",
    chinese: "声调",
    title: "Dynasty Tones",
    description: "Master the 5 Mandarin tones through imperial dynasties",
    route: "/dynasty",
    color: "#E8E4B8",
    deepColor: "#8A7B2D",
    built: true,
  },
  {
    id: "pinyin",
    icon: "拼",
    chinese: "拼音",
    title: "Pinyin",
    description: "Initials, finals, and the sounds that trip everyone up",
    route: "/pinyin",
    color: "#D4849A",
    deepColor: "#9C4660",
    built: true,
  },
  {
    id: "greetings",
    icon: "👋",
    chinese: "问候",
    title: "Greetings",
    description: "你好, 谢谢, 再见 — your first real conversations",
    route: "/greetings",
    color: "#7BA888",
    deepColor: "#3D6B4F",
    built: true,
  },
  {
    id: "numbers",
    icon: "🔢",
    chinese: "数字",
    title: "Numbers",
    description: "一二三 plus dates, time, and a matching mini-game",
    route: "/numbers",
    color: "#E8654A",
    deepColor: "#9E3520",
    built: true,
  },
  {
    id: "pronouns",
    icon: "👤",
    chinese: "代词",
    title: "Pronouns",
    description: "我 你 他 她 — build your first sentences",
    route: "/pronouns",
    color: "#C41E1E",
    deepColor: "#8B0000",
    built: false,
  },
  {
    id: "verbs",
    icon: "🗣️",
    chinese: "动词",
    title: "Common Verbs",
    description: "是 有 去 喜欢 想 — say what you mean",
    route: "/verbs",
    color: "#D4A832",
    deepColor: "#8A6A14",
    built: false,
  },
  {
    id: "questions",
    icon: "❓",
    chinese: "疑问",
    title: "Question Words",
    description: "什么 谁 哪儿 为什么 怎么",
    route: "/questions",
    color: "#B8A9C9",
    deepColor: "#6B5B8A",
    built: false,
  },
];

function LearnContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("inkbook_completed");
      if (saved) setCompleted(JSON.parse(saved));
    } catch {}
  }, []);

  function goToModule(mod: typeof MODULES[0]) {
    if (!mod.built) return;
    router.push(`${mod.route}?name=${encodeURIComponent(chineseName)}&english=${encodeURIComponent(englishName)}`);
  }

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalBuilt = MODULES.filter(m => m.built).length;

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#FFF8F0",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(139,0,0,0.06) 27px, rgba(139,0,0,0.06) 28px)",
      padding: "44px 20px 80px",
      fontFamily: "'Playfair Display', serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stampIn { from { opacity:0; transform:scale(1.3); } to { opacity:1; transform:scale(1); } }
        .module-card:hover { transform: translateY(-3px); }
        .module-card-built:hover { box-shadow: 0 8px 24px rgba(60,30,10,0.18) !important; }
      `}</style>

      {/* Decorative doodles */}
      <svg style={{ position:"absolute", top:"10px", left:"10px", pointerEvents:"none" }} width="100" height="140" viewBox="0 0 100 140" opacity="0.4">
        <path d="M10,55 L10,35 L22,45 L32,25 L42,45 L52,25 L62,45 L72,35 L72,55 Z" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="10" y1="55" x2="72" y2="55" stroke="#8B0000" strokeWidth="1.5"/>
        <circle cx="32" cy="25" r="3" fill="#8B0000"/>
        <circle cx="52" cy="25" r="3" fill="#8B0000"/>
        <ellipse cx="40" cy="51" rx="7" ry="4" fill="#E8E4B8" stroke="#8B0000" strokeWidth="1"/>
        <line x1="20" y1="75" x2="55" y2="130" stroke="#8B0000" strokeWidth="1.5" strokeLinecap="round"/>
        {[0,60,120,180,240,300].map((r,i) => (
          <ellipse key={i} cx="20" cy="67" rx="3" ry="5" fill={i%2===0?'#D4849A':'#8B0000'} transform={`rotate(${r},20,75)`} opacity="0.7"/>
        ))}
      </svg>

      <svg style={{ position:"absolute", top:"10px", right:"10px", pointerEvents:"none" }} width="100" height="140" viewBox="0 0 100 140" opacity="0.4">
        <circle cx="65" cy="55" r="32" fill="none" stroke="#8B0000" strokeWidth="8" opacity="0.2"/>
        <circle cx="65" cy="55" r="32" fill="none" stroke="#7BA888" strokeWidth="5" opacity="0.4"/>
        <circle cx="65" cy="55" r="32" fill="none" stroke="#8B0000" strokeWidth="1.5"/>
        <text x="65" y="60" fontFamily="'Noto Serif SC',serif" fontSize="11" fill="#8B0000" textAnchor="middle" opacity="0.5">玉</text>
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={10 + i*10} cy={118 + (i%2)*7} r="4" fill="#FFF8F0" stroke="#8B0000" strokeWidth="1" opacity="0.7"/>
        ))}
      </svg>

      {/* Palace silhouette */}
      <svg style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} width="600" height="70" viewBox="0 0 600 70" opacity="0.06">
        <path d="M200,70 L200,35 Q300,12 400,35 L400,70Z" fill="#8B0000"/>
        <path d="M100,70 L100,45 Q150,28 200,45 L200,70Z" fill="#8B0000"/>
        <path d="M400,70 L400,45 Q450,28 500,45 L500,70Z" fill="#8B0000"/>
        <path d="M295,12 Q300,2 305,12" fill="#8B0000"/>
        <path d="M245,35 Q250,25 255,35" fill="#8B0000"/>
        <path d="M445,35 Q450,25 455,35" fill="#8B0000"/>
      </svg>

      <div style={{ maxWidth:"600px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"32px", animation:"fadeUp 0.5s ease both" }}>
          {chineseName && (
            <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"15px", color:"rgba(139,0,0,0.6)", letterSpacing:"4px", marginBottom:"8px" }}>
              {chineseName} {englishName ? `· ${englishName}` : ""}
            </p>
          )}

          {/* Ransom title */}
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"12px" }}>
            {["Y","O","U","R"," ","J","O","U","R","N","E","Y"].map((ch, i) => {
              const colors = [
                { bg:"#8B0000", c:"#FFF8F0" },
                { bg:"#E8E4B8", c:"#5A3A1A" },
                { bg:"#7BA888", c:"#FFF8F0" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#E8654A", c:"#FFF8F0" },
                { bg:"#FFF8F0", c:"#8B0000" },
              ];
              if (ch === " ") return <span key={i} style={{ width:"14px" }}/>;
              const s = colors[i % colors.length];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(26px,6vw,40px)",
                  padding:"3px 10px",
                  background: s.bg, color: s.c,
                  transform:`rotate(${i%2===0?-2:2}deg)`,
                  boxShadow:"2px 3px 0 rgba(60,30,10,0.18)",
                  borderRadius:"2px",
                }}>{ch}</span>
              );
            })}
          </div>

          <p style={{ fontStyle:"italic", color:"rgba(90,58,26,0.6)", fontSize:"14px", lineHeight:1.6 }}>
            Each module brings you closer to fluency. Begin anywhere.
          </p>

          {/* Progress bar */}
          <div style={{ marginTop:"16px", background:"rgba(139,0,0,0.08)", borderRadius:"999px", height:"8px", maxWidth:"300px", margin:"16px auto 0" }}>
            <div style={{
              height:"8px", borderRadius:"999px",
              background:"linear-gradient(90deg, #8B0000, #D4849A)",
              width:`${totalBuilt > 0 ? (completedCount / totalBuilt) * 100 : 0}%`,
              transition:"width 0.8s ease",
            }}/>
          </div>
          <p style={{ fontSize:"11px", color:"rgba(139,0,0,0.4)", marginTop:"6px", letterSpacing:"0.1em" }}>
            {completedCount} of {totalBuilt} modules completed
          </p>
        </div>

        {/* Module cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {MODULES.map((mod, i) => (
            <div
              key={mod.id}
              className={`module-card ${mod.built ? "module-card-built" : ""}`}
              onClick={() => goToModule(mod)}
              style={{
                background: mod.built ? "#FFF8F0" : "rgba(255,248,240,0.5)",
                border: `2px solid ${mod.built ? mod.deepColor : "rgba(139,0,0,0.15)"}`,
                borderRadius:"14px",
                padding:"18px 20px",
                display:"flex",
                alignItems:"center",
                gap:"16px",
                cursor: mod.built ? "pointer" : "default",
                boxShadow: mod.built ? `3px 4px 0 ${mod.color}` : "none",
                transition:"transform 0.2s ease, box-shadow 0.2s ease",
                opacity: mod.built ? 1 : 0.5,
                animation:`fadeUp 0.5s ease ${0.1 + i * 0.08}s both`,
                position:"relative",
              }}
            >
              {/* Icon */}
              <div style={{
                width:"54px", height:"54px", borderRadius:"12px",
                background: mod.built ? mod.color : "rgba(139,0,0,0.06)",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
                border:`1.5px solid ${mod.built ? mod.deepColor : "rgba(139,0,0,0.1)"}`,
              }}>
                <span style={{
                  fontFamily: mod.icon.length > 2 ? "'Noto Serif SC',serif" : "inherit",
                  fontSize: mod.icon.length > 2 ? "22px" : "26px",
                  color: mod.built ? mod.deepColor : "rgba(139,0,0,0.3)",
                  fontWeight:700,
                }}>{mod.icon}</span>
              </div>

              {/* Text */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color: mod.built ? mod.deepColor : "rgba(139,0,0,0.3)" }}>{mod.chinese}</span>
                  {!mod.built && <span style={{ fontSize:"11px", background:"rgba(139,0,0,0.08)", color:"rgba(139,0,0,0.4)", padding:"1px 8px", borderRadius:"999px", letterSpacing:"0.05em" }}>Coming Soon</span>}
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"16px", color: mod.built ? "#3A2A1A" : "rgba(60,40,20,0.35)", margin:"0 0 3px" }}>{mod.title}</p>
                <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"13px", color: mod.built ? "#6B5B3E" : "rgba(107,91,62,0.4)", margin:0 }}>{mod.description}</p>
              </div>

              {/* Right side — checkmark or arrow or lock */}
              <div style={{ flexShrink:0 }}>
                {completed[mod.id] ? (
                  <div style={{
                    width:"32px", height:"32px", borderRadius:"50%",
                    background:"#2D8B50", display:"flex", alignItems:"center", justifyContent:"center",
                    animation:"stampIn 0.4s ease both",
                  }}>
                    <span style={{ color:"#FFF8F0", fontSize:"16px", fontWeight:700 }}>✓</span>
                  </div>
                ) : mod.built ? (
                  <span style={{ fontSize:"18px", color: mod.deepColor, opacity:0.6 }}>→</span>
                ) : (
                  <span style={{ fontSize:"18px", opacity:0.3 }}>🔒</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back to book */}
        <div style={{ textAlign:"center", marginTop:"32px" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              background:"none", border:"none",
              fontFamily:"'Playfair Display',serif", fontSize:"13px",
              color:"rgba(139,0,0,0.45)", fontStyle:"italic",
              cursor:"pointer", letterSpacing:"0.05em",
            }}
          >
            ← Back to the book cover
          </button>
        </div>

      </div>
    </main>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>学</span>
      </main>
    }>
      <LearnContent />
    </Suspense>
  );
}
