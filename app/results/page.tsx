"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// InkBook 墨书 — Screen 5: Results
// Route: /results?dynasty={id}&name={chineseName}&score={avg}
// ─────────────────────────────────────────────────────────────

type DynastyResult = {
  english: string;
  chinese: string;
  color: string;
  deepColor: string;
  toneName: string;
  rankTitle: string[];   // [excellent, good, tryAgain]
  rankPoem: string[];    // short dynasty-themed line per tier
};

const DYNASTY_RESULTS: Record<string, DynastyResult> = {
  tang: {
    english: "Tang", chinese: "唐朝", color: "#E8E4B8", deepColor: "#8A7B2D",
    toneName: "First Tone",
    rankTitle: ["Tang Dynasty Poet", "Court Scholar", "Apprentice Scribe"],
    rankPoem: [
      "Your voice holds steady like the Golden Age itself.",
      "The poets of Chang'an would nod with approval.",
      "Every great poet began with a single brushstroke.",
    ],
  },
  han: {
    english: "Han", chinese: "汉朝", color: "#D4A832", deepColor: "#8A6A14",
    toneName: "Second Tone",
    rankTitle: ["Silk Road Master", "Imperial Envoy", "Young Traveler"],
    rankPoem: [
      "Your rising tone could carry a message across the empire.",
      "The Han traders would trust your voice on the road.",
      "The Silk Road stretches far — keep walking.",
    ],
  },
  ming: {
    english: "Ming", chinese: "明朝", color: "#E8654A", deepColor: "#9E3520",
    toneName: "Third Tone",
    rankTitle: ["Ming Porcelain Master", "Palace Craftsman", "Workshop Apprentice"],
    rankPoem: [
      "Your tone dips and rises like a masterwork glaze.",
      "The Ming craftsmen would admire your careful form.",
      "Even the finest porcelain was fired more than once.",
    ],
  },
  qing: {
    english: "Qing", chinese: "清朝", color: "#C41E1E", deepColor: "#8B0000",
    toneName: "Fourth Tone",
    rankTitle: ["Imperial Commander", "Palace Guard", "New Recruit"],
    rankPoem: [
      "Your falling tone commands the room like an imperial decree.",
      "The Qing generals would hear your conviction.",
      "Every commander started with their first order.",
    ],
  },
  song: {
    english: "Song", chinese: "宋朝", color: "#D4849A", deepColor: "#9C4660",
    toneName: "Neutral Tone",
    rankTitle: ["Song Dynasty Painter", "Ink Wash Artist", "Brush Student"],
    rankPoem: [
      "Your neutral tone flows like ink on silk — effortless.",
      "The Song painters would appreciate your subtle touch.",
      "Subtlety takes practice — you are on the right path.",
    ],
  },
};

// Firework particle component
function Fireworks() {
  return (
    <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {[
        { x:15, y:20, color:"#D4AF37", delay:0 },
        { x:80, y:15, color:"#CC0000", delay:0.3 },
        { x:50, y:10, color:"#2D8B50", delay:0.6 },
        { x:25, y:40, color:"#D4849A", delay:0.2 },
        { x:75, y:35, color:"#D4A832", delay:0.5 },
        { x:60, y:25, color:"#8B0000", delay:0.8 },
      ].map((f, i) => (
        <div key={i} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%` }}>
          {[0,45,90,135,180,225,270,315].map((angle, j) => (
            <div key={j} style={{
              position:"absolute",
              width:"3px",
              height:"3px",
              borderRadius:"50%",
              background: f.color,
              transform:`rotate(${angle}deg) translateY(-18px)`,
              opacity:0,
              animation:`burst 1.2s ease-out ${f.delay + j * 0.04}s both`,
            }}/>
          ))}
        </div>
      ))}
      <style>{`
        @keyframes burst {
          0% { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
          100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-28px); }
        }
      `}</style>
    </div>
  );
}

// Animated score ring
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circ - (progress / 100) * circ;

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      {/* Track */}
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(139,0,0,0.1)" strokeWidth="10"/>
      {/* Progress */}
      <circle
        cx="65" cy="65" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 65 65)"
        style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
      {/* Score text */}
      <text x="65" y="60" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="28" fontWeight="700" fill={color}>
        {score}%
      </text>
      <text x="65" y="78" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="11" fill="rgba(139,0,0,0.5)" letterSpacing="1">
        TONE SCORE
      </text>
    </svg>
  );
}

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const dynastyId = params.get("dynasty") ?? "tang";
  const chineseName = params.get("name") ?? "";
  const score = parseInt(params.get("score") ?? "0", 10);
  const dynasty = DYNASTY_RESULTS[dynastyId] ?? DYNASTY_RESULTS.tang;

  const tier = score >= 85 ? 0 : score >= 60 ? 1 : 2;
  const title = dynasty.rankTitle[tier];
  const poem = dynasty.rankPoem[tier];
  const isExcellent = tier === 0;

  function getScoreColor(s: number) {
    if (s >= 85) return "#2D8B50";
    if (s >= 60) return "#C4A030";
    return "#C41E1E";
  }

  // Ransom-style letters matching existing design system
  const RANSOM = [
    { bg:"#8B0000", color:"#FFF8F0", rotate:"-3deg" },
    { bg:"#D4AF37", color:"#3A2A0A", rotate:"2deg" },
    { bg:"#FFF8F0", color:"#8B0000", rotate:"-1deg" },
    { bg:"#2D5016", color:"#FFF8F0", rotate:"3deg" },
  ];

  return (
    <main style={{
      minHeight:"100vh",
      backgroundColor:"#F5E8C8",
      backgroundImage:"repeating-linear-gradient(transparent, transparent 38px, rgba(139,0,0,0.10) 38px, rgba(139,0,0,0.10) 39px)",
      padding:"44px 20px 80px",
      fontFamily:"'Playfair Display', serif",
      position:"relative",
      overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stampIn { from { opacity:0; transform:scale(1.4) rotate(-8deg); } to { opacity:1; transform:scale(1) rotate(-6deg); } }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(139,0,0,0.3); }
        .btn-secondary:hover { transform:translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { * { animation-duration:0.01ms !important; } }
      `}</style>

      {/* Large watermark */}
      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.04)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>成</div>

      {/* Fireworks for excellent score */}
      {isExcellent && <Fireworks />}

      {/* Corner doodles */}
      <div aria-hidden="true" style={{ position:"absolute", top:"16px", left:"16px", fontSize:"30px", opacity:0.45, transform:"rotate(-8deg)" }}>🎋</div>
      <div aria-hidden="true" style={{ position:"absolute", top:"16px", right:"16px", fontSize:"30px", opacity:0.45, transform:"rotate(10deg)" }}>🌸</div>

      <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative" }}>

        {/* Eyebrow */}
        <p style={{ textAlign:"center", color:"#8B0000", letterSpacing:"0.2em", textTransform:"uppercase", fontSize:"11px", marginBottom:"12px", animation:"fadeUp 0.5s ease both" }}>
          {chineseName && <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"15px" }}>{chineseName}</span>}
          {chineseName && " · "}
          {dynasty.english} Dynasty · {dynasty.toneName}
        </p>

        {/* Ransom title */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"28px", animation:"fadeUp 0.5s ease 0.1s both" }}>
          {"RESULTS".split("").map((ch, i) => (
            <span key={i} style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Playfair Display',serif", fontWeight:700,
              fontSize:"clamp(28px,7vw,42px)",
              padding:"3px 10px",
              background: RANSOM[i % RANSOM.length].bg,
              color: RANSOM[i % RANSOM.length].color,
              transform:`rotate(${RANSOM[i % RANSOM.length].rotate})`,
              boxShadow:"2px 3px 0 rgba(60,30,10,0.2)",
              borderRadius:"2px",
            }}>{ch}</span>
          ))}
        </div>

        {/* Score card */}
        <div style={{
          background:"#FFF8F0",
          border:`2px solid ${dynasty.deepColor}`,
          borderRadius:"18px",
          boxShadow:"5px 7px 0 rgba(60,30,10,0.15)",
          padding:"28px 24px",
          marginBottom:"22px",
          textAlign:"center",
          animation:"fadeUp 0.5s ease 0.2s both",
          position:"relative",
          overflow:"hidden",
        }}>
          {/* Dynasty color top bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"6px", background:dynasty.color, borderRadius:"16px 16px 0 0" }}/>

          {/* Wax seal style rank stamp */}
          <div style={{
            position:"absolute", top:"16px", right:"16px",
            width:"56px", height:"56px",
            borderRadius:"50%",
            background:`radial-gradient(circle, ${dynasty.color}, ${dynasty.deepColor})`,
            border:`2px solid ${dynasty.deepColor}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexDirection:"column",
            animation:"stampIn 0.6s ease 0.8s both",
            opacity:0,
          }}>
            <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"18px", color:"#FFF8F0", lineHeight:1 }}>
              {isExcellent ? "优" : tier === 1 ? "良" : "加"}
            </span>
            <span style={{ fontSize:"7px", color:"rgba(255,248,240,0.8)", letterSpacing:"0.5px" }}>
              {isExcellent ? "EXCEL" : tier === 1 ? "GOOD" : "OIL"}
            </span>
          </div>

          {/* Score ring */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}>
            <ScoreRing score={score} color={getScoreColor(score)} />
          </div>

          {/* Rank title */}
          <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"22px", color:dynasty.deepColor, letterSpacing:"2px", marginBottom:"8px" }}>
            {title}
          </div>

          {/* Poem */}
          <p style={{ fontStyle:"italic", color:"#5A3A1A", fontSize:"14px", lineHeight:1.7, maxWidth:"360px", margin:"0 auto" }}>
            {poem}
          </p>
        </div>

        {/* Cultural achievement banner */}
        <div style={{
          background: dynasty.color,
          border:`2px solid ${dynasty.deepColor}`,
          borderRadius:"12px",
          padding:"16px 20px",
          marginBottom:"22px",
          display:"flex",
          alignItems:"center",
          gap:"14px",
          boxShadow:"3px 4px 0 rgba(60,30,10,0.12)",
          animation:"fadeUp 0.5s ease 0.35s both",
        }}>
          <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"36px", lineHeight:1, color:dynasty.deepColor }}>
            {isExcellent ? "🏆" : tier === 1 ? "📜" : "🖌️"}
          </span>
          <div>
            <p style={{ margin:0, fontWeight:700, fontSize:"13px", color:dynasty.deepColor, letterSpacing:"0.05em" }}>
              {isExcellent ? "Achievement Unlocked" : tier === 1 ? "Progress Recorded" : "Keep Practicing"}
            </p>
            <p style={{ margin:"3px 0 0", fontSize:"12px", color:"#5A3A1A", fontStyle:"italic" }}>
              {isExcellent
                ? `You've mastered the ${dynasty.toneName} in the ${dynasty.english} Dynasty`
                : tier === 1
                ? `Solid foundation in the ${dynasty.toneName} — keep going`
                : `The ${dynasty.toneName} takes practice — you're building muscle memory`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px", animation:"fadeUp 0.5s ease 0.45s both" }}>
          {/* Practice again */}
          <button
            className="btn-primary"
            onClick={() => router.push(`/practice?dynasty=${dynastyId}&name=${encodeURIComponent(chineseName)}`)}
            style={{
              background:"linear-gradient(180deg, #E5C158 0%, #D4AF37 60%, #B8932A 100%)",
              color:"#3A2A0A",
              border:"2px solid #8B6914",
              borderRadius:"999px",
              padding:"16px",
              fontSize:"16px",
              fontWeight:700,
              fontFamily:"'Playfair Display',serif",
              letterSpacing:"0.05em",
              cursor:"pointer",
              boxShadow:"0 5px 14px rgba(139,0,0,0.2)",
              transition:"transform 0.15s ease, box-shadow 0.15s ease",
              width:"100%",
            }}
          >
            Practice Again →
          </button>

          {/* Try a different dynasty */}
          <button
            className="btn-secondary"
            onClick={() => router.push(`/dynasty?name=${encodeURIComponent(chineseName)}`)}
            style={{
              background:"#FFF8F0",
              color:"#8B0000",
              border:`2px solid ${dynasty.deepColor}`,
              borderRadius:"999px",
              padding:"14px",
              fontSize:"15px",
              fontFamily:"'Playfair Display',serif",
              letterSpacing:"0.05em",
              cursor:"pointer",
              boxShadow:"0 3px 8px rgba(60,30,10,0.12)",
              transition:"transform 0.15s ease",
              width:"100%",
            }}
          >
            Try a Different Dynasty
          </button>

          {/* Start over */}
          <button
            onClick={() => router.push("/")}
            style={{
              background:"none",
              border:"none",
              color:"rgba(139,0,0,0.45)",
              fontFamily:"'Playfair Display',serif",
              fontSize:"13px",
              fontStyle:"italic",
              letterSpacing:"0.05em",
              cursor:"pointer",
              padding:"8px",
            }}
          >
            ← Back to the beginning
          </button>
        </div>

      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#F5E8C8", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>成</span>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
