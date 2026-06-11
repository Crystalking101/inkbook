"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type DynastyResult = {
  english: string;
  chinese: string;
  color: string;
  deepColor: string;
  toneName: string;
  rankTitle: string[];
  rankPoem: string[];
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
    english: "Han", chinese: "汉朝", color: "#7BA888", deepColor: "#3D6B4F",
    toneName: "Second Tone",
    rankTitle: ["Silk Road Master", "Imperial Envoy", "Young Traveler"],
    rankPoem: [
      "Your rising tone could carry a message across the empire.",
      "The Han traders would trust your voice on the road.",
      "The Silk Road stretches far. Keep walking.",
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
      "Your neutral tone flows like ink on silk.",
      "The Song painters would appreciate your subtle touch.",
      "Subtlety takes practice. You are on the right path.",
    ],
  },
};

function Fireworks({ color }: { color: string }) {
  return (
    <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {[
        { x:15, y:20, color:"#D4AF37", delay:0 },
        { x:80, y:15, color:"#CC0000", delay:0.3 },
        { x:50, y:10, color:"#2D8B50", delay:0.6 },
        { x:25, y:40, color:"#D4849A", delay:0.2 },
        { x:75, y:35, color, delay:0.5 },
        { x:60, y:25, color:"#8B0000", delay:0.8 },
      ].map((f, i) => (
        <div key={i} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%` }}>
          {[0,45,90,135,180,225,270,315].map((angle, j) => (
            <div key={j} style={{
              position:"absolute", width:"4px", height:"4px", borderRadius:"50%",
              background: f.color,
              transform:`rotate(${angle}deg) translateY(-20px)`,
              opacity:0,
              animation:`burst 1.4s ease-out ${f.delay + j*0.05}s both`,
            }}/>
          ))}
        </div>
      ))}
      <style>{`@keyframes burst { 0% { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); } 100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-32px); } }`}</style>
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  useEffect(() => { const t = setTimeout(() => setProgress(score), 300); return () => clearTimeout(t); }, [score]);
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(139,0,0,0.08)" strokeWidth="12"/>
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 70 70)"
        style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}/>
      <text x="70" y="64" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="30" fontWeight="700" fill={color}>{score}%</text>
      <text x="70" y="82" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="11" fill="rgba(139,0,0,0.45)" letterSpacing="1">TONE SCORE</text>
    </svg>
  );
}

function FeminineDecorations({ dynasty }: { dynasty: DynastyResult }) {
  const c = dynasty.deepColor;
  const light = dynasty.color;
  return (
    <>
      <svg style={{ position:"absolute", top:"10px", left:"10px", pointerEvents:"none" }} width="110" height="150" viewBox="0 0 110 150" opacity="0.45">
        <path d="M10,60 L10,40 L25,50 L35,30 L45,50 L55,30 L65,50 L75,40 L75,60 Z" fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="10" y1="60" x2="75" y2="60" stroke={c} strokeWidth="1.5"/>
        <circle cx="35" cy="30" r="3" fill={c}/><circle cx="55" cy="30" r="3" fill={c}/>
        <ellipse cx="42" cy="56" rx="7" ry="4" fill={light} stroke={c} strokeWidth="1"/>
        <line x1="20" y1="80" x2="60" y2="140" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        {[0,60,120,180,240,300].map((r,i) => (
          <ellipse key={i} cx="20" cy="72" rx="3" ry="5" fill={i%2===0?light:c} transform={`rotate(${r},20,80)`} opacity="0.7"/>
        ))}
      </svg>
      <svg style={{ position:"absolute", top:"10px", right:"10px", pointerEvents:"none" }} width="110" height="150" viewBox="0 0 110 150" opacity="0.45">
        <circle cx="75" cy="55" r="32" fill="none" stroke={c} strokeWidth="8" opacity="0.2"/>
        <circle cx="75" cy="55" r="32" fill="none" stroke={light} strokeWidth="5" opacity="0.4"/>
        <circle cx="75" cy="55" r="32" fill="none" stroke={c} strokeWidth="1.5"/>
        <text x="75" y="60" fontFamily="'Noto Serif SC',serif" fontSize="11" fill={c} textAnchor="middle" opacity="0.5">玉</text>
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={15 + i*10} cy={120 + (i%2)*7} r="4" fill="#FFF8F0" stroke={c} strokeWidth="1" opacity="0.7"/>
        ))}
      </svg>
      <svg style={{ position:"absolute", bottom:"80px", left:"10px", pointerEvents:"none" }} width="110" height="130" viewBox="0 0 110 130" opacity="0.4">
        {[0,72,144,216,288].map((r,i) => (
          <ellipse key={i} cx="40" cy="30" rx="5" ry="9" fill={i%2===0?light:c} transform={`rotate(${r},40,42)`} opacity="0.6"/>
        ))}
        <circle cx="40" cy="42" r="6" fill={c} opacity="0.4"/>
        <path d="M70,70 Q58,53 64,46 Q76,40 82,52 Q76,58 70,70Z" fill={light} stroke={c} strokeWidth="1" opacity="0.7"/>
        <path d="M70,70 Q82,53 76,46 Q64,40 58,52 Q64,58 70,70Z" fill={light} stroke={c} strokeWidth="1" opacity="0.7"/>
      </svg>
      <svg style={{ position:"absolute", bottom:"80px", right:"10px", pointerEvents:"none" }} width="110" height="130" viewBox="0 0 110 130" opacity="0.4">
        <ellipse cx="70" cy="50" rx="30" ry="16" fill="none" stroke={c} strokeWidth="5" opacity="0.25"/>
        <ellipse cx="70" cy="50" rx="30" ry="16" fill="none" stroke={light} strokeWidth="3" opacity="0.4"/>
        <ellipse cx="70" cy="50" rx="30" ry="16" fill="none" stroke={c} strokeWidth="1.2"/>
        {[0,60,120,180,240,300].map((a,i) => {
          const x = 70 + 30*Math.cos(a*Math.PI/180);
          const y = 50 + 16*Math.sin(a*Math.PI/180);
          return <circle key={i} cx={x} cy={y} r="3" fill={i%2===0?c:light} stroke={c} strokeWidth="0.8"/>;
        })}
        {[[20,95],[45,110],[70,100],[90,115]].map(([x,y],i) => (
          <polygon key={i} points={`${x},${y-6} ${x+2},${y-2} ${x+6},${y-2} ${x+3},${y+1} ${x+4},${y+5} ${x},${y+3} ${x-4},${y+5} ${x-3},${y+1} ${x-6},${y-2} ${x-2},${y-2}`}
            fill={i%2===0?c:light} stroke={c} strokeWidth="0.5" opacity="0.7"/>
        ))}
      </svg>
      {/* Palace silhouette */}
      <svg style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} width="600" height="70" viewBox="0 0 600 70" opacity="0.06">
        <path d="M200,70 L200,35 Q300,12 400,35 L400,70Z" fill={c}/>
        <path d="M100,70 L100,45 Q150,28 200,45 L200,70Z" fill={c}/>
        <path d="M400,70 L400,45 Q450,28 500,45 L500,70Z" fill={c}/>
        <path d="M295,12 Q300,2 305,12" fill={c}/>
        <path d="M245,35 Q250,25 255,35" fill={c}/>
        <path d="M445,35 Q450,25 455,35" fill={c}/>
        <rect x="250" y="62" width="100" height="4" fill={c} opacity="0.5"/>
      </svg>
    </>
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

  const RANSOM = [
    { bg:"#8B0000", color:"#FFF8F0", rotate:"-3deg" },
    { bg: dynasty.color, color: dynasty.deepColor, rotate:"2deg" },
    { bg:"#FFF8F0", color:"#8B0000", rotate:"-1deg" },
    { bg: dynasty.deepColor, color:"#FFF8F0", rotate:"3deg" },
  ];

  return (
    <main style={{
      minHeight:"100vh",
      backgroundColor:"#FFF8F0",
      backgroundImage:"repeating-linear-gradient(transparent, transparent 27px, rgba(139,0,0,0.06) 27px, rgba(139,0,0,0.06) 28px)",
      padding:"44px 20px 100px",
      fontFamily:"'Playfair Display', serif",
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stampIn { from { opacity:0; transform:scale(1.4) rotate(-8deg); } to { opacity:1; transform:scale(1) rotate(-6deg); } }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(60,30,10,0.25); }
        .btn-secondary:hover { transform:translateY(-2px); }
      `}</style>

      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>成</div>

      {isExcellent && <Fireworks color={dynasty.deepColor}/>}
      <FeminineDecorations dynasty={dynasty}/>

      <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative" }}>

        {/* Eyebrow */}
        <p style={{ textAlign:"center", color:dynasty.deepColor, letterSpacing:"0.2em", textTransform:"uppercase", fontSize:"12px", marginBottom:"12px", animation:"fadeUp 0.5s ease both" }}>
          {chineseName && <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"16px" }}>{chineseName}</span>}
          {chineseName && " · "}
          {dynasty.english} Dynasty · {dynasty.toneName}
        </p>

        {/* Ransom title */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"28px", animation:"fadeUp 0.5s ease 0.1s both" }}>
          {"RESULTS".split("").map((ch, i) => (
            <span key={i} style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Playfair Display',serif", fontWeight:700,
              fontSize:"clamp(30px,7vw,46px)",
              padding:"3px 12px",
              background: RANSOM[i % RANSOM.length].bg,
              color: RANSOM[i % RANSOM.length].color,
              transform:`rotate(${RANSOM[i % RANSOM.length].rotate})`,
              boxShadow:"2px 3px 0 rgba(60,30,10,0.18)",
              borderRadius:"2px",
            }}>{ch}</span>
          ))}
        </div>

        {/* Score card */}
        <div style={{
          background:"#FFF8F0", border:`2px solid ${dynasty.deepColor}`,
          borderRadius:"18px", boxShadow:`5px 7px 0 ${dynasty.color}`,
          padding:"28px 24px", marginBottom:"20px", textAlign:"center",
          animation:"fadeUp 0.5s ease 0.2s both", position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"6px", background:dynasty.color, borderRadius:"16px 16px 0 0" }}/>
          <div style={{
            position:"absolute", top:"16px", right:"16px",
            width:"58px", height:"58px", borderRadius:"50%",
            background:`radial-gradient(circle, ${dynasty.color}, ${dynasty.deepColor})`,
            border:`2px solid ${dynasty.deepColor}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
            animation:"stampIn 0.6s ease 0.8s both", opacity:0,
          }}>
            <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"20px", color:"#FFF8F0", lineHeight:1 }}>
              {isExcellent ? "优" : tier === 1 ? "良" : "加"}
            </span>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}>
            <ScoreRing score={score} color={getScoreColor(score)}/>
          </div>
          <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"22px", color:dynasty.deepColor, letterSpacing:"2px", marginBottom:"10px" }}>{title}</div>
          <p style={{ fontStyle:"italic", color:"#5A3A1A", fontSize:"15px", lineHeight:1.75, maxWidth:"360px", margin:"0 auto" }}>{poem}</p>
        </div>

        {/* Achievement banner */}
        <div style={{
          background: dynasty.color, border:`2px solid ${dynasty.deepColor}`,
          borderRadius:"12px", padding:"16px 20px", marginBottom:"22px",
          display:"flex", alignItems:"center", gap:"14px",
          boxShadow:`3px 4px 0 rgba(60,30,10,0.10)`,
          animation:"fadeUp 0.5s ease 0.35s both",
        }}>
          <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"36px", lineHeight:1, color:dynasty.deepColor }}>
            {isExcellent ? "🏆" : tier === 1 ? "📜" : "🖌️"}
          </span>
          <div>
            <p style={{ margin:0, fontWeight:700, fontSize:"14px", color:dynasty.deepColor, letterSpacing:"0.05em" }}>
              {isExcellent ? "Achievement Unlocked" : tier === 1 ? "Progress Recorded" : "Keep Practicing"}
            </p>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#5A3A1A", fontStyle:"italic" }}>
              {isExcellent
                ? `You have mastered the ${dynasty.toneName} in the ${dynasty.english} Dynasty`
                : tier === 1
                ? `Solid foundation in the ${dynasty.toneName}. Keep going`
                : `The ${dynasty.toneName} takes practice. You are building muscle memory`}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px", animation:"fadeUp 0.5s ease 0.45s both" }}>
          <button className="btn-primary"
            onClick={() => router.push(`/practice?dynasty=${dynastyId}&name=${encodeURIComponent(chineseName)}`)}
            style={{
              background: dynasty.deepColor, color:"#FFF8F0",
              border:`2px solid ${dynasty.deepColor}`, borderRadius:"999px",
              padding:"16px", fontSize:"16px", fontWeight:700,
              fontFamily:"'Playfair Display',serif", letterSpacing:"0.05em",
              cursor:"pointer", boxShadow:`0 5px 14px rgba(60,30,10,0.18)`,
              transition:"transform 0.15s ease, box-shadow 0.15s ease", width:"100%",
            }}>
            Practice Again →
          </button>
          <button className="btn-secondary"
            onClick={() => router.push(`/dynasty?name=${encodeURIComponent(chineseName)}`)}
            style={{
              background:"#FFF8F0", color:dynasty.deepColor,
              border:`2px solid ${dynasty.deepColor}`, borderRadius:"999px",
              padding:"14px", fontSize:"15px", fontFamily:"'Playfair Display',serif",
              letterSpacing:"0.05em", cursor:"pointer",
              boxShadow:"0 3px 8px rgba(60,30,10,0.10)",
              transition:"transform 0.15s ease", width:"100%",
            }}>
            Try a Different Dynasty
          </button>
          <button onClick={() => router.push("/")} style={{
            background:"none", border:"none", color:"rgba(139,0,0,0.45)",
            fontFamily:"'Playfair Display',serif", fontSize:"13px",
            fontStyle:"italic", letterSpacing:"0.05em", cursor:"pointer", padding:"8px",
          }}>
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
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>成</span>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
