"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const NUMBERS = [
  { chinese:"零", pinyin:"líng", arabic:"0", color:"#E8E4B8", deepColor:"#8A7B2D" },
  { chinese:"一", pinyin:"yī", arabic:"1", color:"#D4849A", deepColor:"#9C4660" },
  { chinese:"二", pinyin:"èr", arabic:"2", color:"#7BA888", deepColor:"#3D6B4F" },
  { chinese:"三", pinyin:"sān", arabic:"3", color:"#E8654A", deepColor:"#9E3520" },
  { chinese:"四", pinyin:"sì", arabic:"4", color:"#C41E1E", deepColor:"#8B0000" },
  { chinese:"五", pinyin:"wǔ", arabic:"5", color:"#E8E4B8", deepColor:"#8A7B2D" },
  { chinese:"六", pinyin:"liù", arabic:"6", color:"#D4849A", deepColor:"#9C4660" },
  { chinese:"七", pinyin:"qī", arabic:"7", color:"#7BA888", deepColor:"#3D6B4F" },
  { chinese:"八", pinyin:"bā", arabic:"8", color:"#E8654A", deepColor:"#9E3520" },
  { chinese:"九", pinyin:"jiǔ", arabic:"9", color:"#C41E1E", deepColor:"#8B0000" },
  { chinese:"十", pinyin:"shí", arabic:"10", color:"#E8E4B8", deepColor:"#8A7B2D" },
  { chinese:"百", pinyin:"bǎi", arabic:"100", color:"#D4849A", deepColor:"#9C4660" },
  { chinese:"千", pinyin:"qiān", arabic:"1,000", color:"#7BA888", deepColor:"#3D6B4F" },
  { chinese:"万", pinyin:"wàn", arabic:"10,000", color:"#E8654A", deepColor:"#9E3520" },
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

type GameState = "idle" | "playing" | "correct" | "wrong" | "complete";

function NumbersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [activeTab, setActiveTab] = useState<"learn" | "game">("learn");

  // Game state
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffled, setShuffled] = useState<typeof NUMBERS>([]);
  const [options, setOptions] = useState<typeof NUMBERS>([]);

  function startGame() {
    const s = [...NUMBERS].sort(() => Math.random() - 0.5).slice(0, 8);
    setShuffled(s);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setGameState("playing");
    generateOptions(s, 0);
  }

  function generateOptions(questions: typeof NUMBERS, idx: number) {
    const correct = questions[idx];
    const others = NUMBERS.filter(n => n.arabic !== correct.arabic)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    setOptions([...others, correct].sort(() => Math.random() - 0.5));
  }

  function handleAnswer(num: typeof NUMBERS[0]) {
    if (selected) return;
    setSelected(num.arabic);
    const correct = shuffled[currentQ];
    if (num.arabic === correct.arabic) {
      setGameState("correct");
      setScore(s => s + 1);
    } else {
      setGameState("wrong");
    }
    setTimeout(() => {
      const next = currentQ + 1;
      if (next >= shuffled.length) {
        setGameState("complete");
      } else {
        setCurrentQ(next);
        setSelected(null);
        setGameState("playing");
        generateOptions(shuffled, next);
      }
    }, 1200);
  }

  const question = gameState === "playing" || gameState === "correct" || gameState === "wrong"
    ? shuffled[currentQ] : null;

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
        @keyframes pop { 0% { transform:scale(1); } 50% { transform:scale(1.08); } 100% { transform:scale(1); } }
        .num-card:hover { transform:translateY(-2px); }
        .opt-btn:hover { transform:scale(1.03); }
      `}</style>

      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>数</div>

      <div style={{ maxWidth:"600px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"24px", animation:"fadeUp 0.5s ease both" }}>
          <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color:"rgba(139,0,0,0.5)", letterSpacing:"4px", marginBottom:"8px" }}>
            {chineseName || "学生"} · Numbers
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"10px" }}>
            {["N","U","M","B","E","R","S"].map((ch, i) => {
              const colors = [
                { bg:"#9E3520", c:"#FFF8F0" },
                { bg:"#E8654A", c:"#FFF8F0" },
                { bg:"#FFF8F0", c:"#9E3520" },
                { bg:"#E8E4B8", c:"#5A3A1A" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#7BA888", c:"#FFF8F0" },
                { bg:"#9E3520", c:"#FFF8F0" },
              ];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(24px,5vw,38px)",
                  padding:"3px 10px",
                  background: colors[i].bg, color: colors[i].c,
                  transform:`rotate(${i%2===0?-2:2}deg)`,
                  boxShadow:"2px 3px 0 rgba(60,30,10,0.18)",
                  borderRadius:"2px",
                }}>{ch}</span>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", marginBottom:"24px" }}>
          {[
            { id:"learn", label:"Learn", chinese:"学" },
            { id:"game", label:"Mini-Game", chinese:"游" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? "#9E3520" : "#FFF8F0",
                color: activeTab === tab.id ? "#FFF8F0" : "#9E3520",
                border:"2px solid #9E3520",
                borderRadius:"999px", padding:"8px 24px",
                fontFamily:"'Playfair Display',serif", fontSize:"14px",
                fontWeight:700, cursor:"pointer",
                transition:"all 0.2s ease",
              }}>
              <span style={{ fontFamily:"'Noto Serif SC',serif", marginRight:"6px" }}>{tab.chinese}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* LEARN TAB */}
        {activeTab === "learn" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(120px, 1fr))", gap:"12px", animation:"fadeUp 0.4s ease both" }}>
              {NUMBERS.map((num, i) => (
                <div key={num.chinese} className="num-card"
                  onClick={() => speak(num.chinese)}
                  style={{
                    background:"#FFF8F0",
                    border:`2px solid ${num.deepColor}`,
                    borderRadius:"14px", padding:"16px 10px",
                    cursor:"pointer",
                    boxShadow:`3px 4px 0 ${num.color}`,
                    transition:"all 0.2s ease",
                    textAlign:"center",
                    animation:`fadeUp 0.4s ease ${i*0.05}s both`,
                  }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"44px", color:num.deepColor, display:"block", lineHeight:1.1 }}>{num.chinese}</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"15px", color:num.deepColor, display:"block", marginTop:"4px" }}>{num.pinyin}</span>
                  <span style={{ fontSize:"18px", fontWeight:700, color:"#3A2A1A", display:"block", marginTop:"2px" }}>{num.arabic}</span>
                  <span style={{ fontSize:"16px", marginTop:"4px", display:"block" }}>🔊</span>
                </div>
              ))}
            </div>

            {/* Useful patterns */}
            <div style={{
              marginTop:"24px",
              background:"#FFF8F0", border:"2px solid #9E3520",
              borderLeft:"6px solid #9E3520",
              borderRadius:"0 14px 14px 0", padding:"18px 22px",
              boxShadow:"3px 4px 0 #E8654A",
            }}>
              <p style={{ margin:"0 0 10px", color:"#9E3520", fontWeight:700, fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                Quick Patterns
              </p>
              {[
                { expr:"十一", value:"11 (10+1)" },
                { expr:"二十", value:"20 (2×10)" },
                { expr:"三十五", value:"35 (3×10+5)" },
                { expr:"一百", value:"100" },
                { expr:"两千", value:"2,000 (use 两 not 二 for amounts)" },
              ].map(p => (
                <div key={p.expr} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(158,53,32,0.1)" }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"18px", color:"#9E3520", cursor:"pointer" }}
                    onClick={() => speak(p.expr)}>
                    {p.expr} 🔊
                  </span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"14px", color:"#6B5B3E", fontStyle:"italic" }}>{p.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* GAME TAB */}
        {activeTab === "game" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            {gameState === "idle" && (
              <div style={{ textAlign:"center" }}>
                <div style={{
                  background:"#FFF8F0", border:"2px solid #9E3520",
                  borderRadius:"18px", padding:"32px 24px",
                  boxShadow:"4px 6px 0 #E8654A", marginBottom:"24px",
                }}>
                  <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#9E3520", margin:"0 0 12px" }}>🎮</p>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"18px", color:"#3A2A1A", margin:"0 0 8px" }}>Number Match Game</p>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"14px", color:"#6B5B3E", margin:0 }}>
                    A Chinese number appears. Pick the matching Arabic number. 8 rounds.
                  </p>
                </div>
                <button onClick={startGame} style={{
                  background:"#9E3520", color:"#FFF8F0",
                  border:"none", borderRadius:"999px",
                  padding:"16px 48px", fontSize:"17px",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  cursor:"pointer", boxShadow:"0 5px 14px rgba(158,53,32,0.3)",
                }}>
                  Start Game →
                </button>
              </div>
            )}

            {(gameState === "playing" || gameState === "correct" || gameState === "wrong") && question && (
              <div>
                {/* Progress */}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"16px", fontSize:"13px", color:"rgba(139,0,0,0.5)" }}>
                  <span>Question {currentQ + 1} of {shuffled.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div style={{ background:"rgba(158,53,32,0.08)", borderRadius:"999px", height:"6px", marginBottom:"24px" }}>
                  <div style={{ height:"6px", borderRadius:"999px", background:"#9E3520", width:`${((currentQ) / shuffled.length) * 100}%`, transition:"width 0.3s ease" }}/>
                </div>

                {/* Question card */}
                <div style={{
                  background: gameState === "correct" ? "#E8F5E9" : gameState === "wrong" ? "#FFEBEE" : "#FFF8F0",
                  border:`2px solid ${gameState === "correct" ? "#2D8B50" : gameState === "wrong" ? "#C41E1E" : question.deepColor}`,
                  borderRadius:"18px", padding:"32px 24px",
                  textAlign:"center", marginBottom:"24px",
                  boxShadow:`4px 6px 0 ${question.color}`,
                  transition:"all 0.3s ease",
                }}>
                  <p style={{ margin:"0 0 8px", fontSize:"13px", color:"rgba(139,0,0,0.5)", letterSpacing:"0.15em", textTransform:"uppercase" }}>
                    What number is this?
                  </p>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"96px", color:question.deepColor, display:"block", lineHeight:1 }}>{question.chinese}</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"20px", color:question.deepColor }}>{question.pinyin}</span>
                  {gameState === "correct" && <p style={{ color:"#2D8B50", fontWeight:700, fontSize:"16px", margin:"8px 0 0" }}>✓ Correct!</p>}
                  {gameState === "wrong" && <p style={{ color:"#C41E1E", fontWeight:700, fontSize:"16px", margin:"8px 0 0" }}>The answer was {question.arabic}</p>}
                </div>

                {/* Options */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  {options.map(opt => {
                    const isCorrect = opt.arabic === question.arabic;
                    const isSelected = selected === opt.arabic;
                    let bg = "#FFF8F0";
                    let border = `2px solid ${opt.deepColor}`;
                    if (isSelected && isCorrect) { bg = "#E8F5E9"; border = "2px solid #2D8B50"; }
                    else if (isSelected && !isCorrect) { bg = "#FFEBEE"; border = "2px solid #C41E1E"; }
                    else if (selected && isCorrect) { bg = "#E8F5E9"; border = "2px solid #2D8B50"; }
                    return (
                      <button key={opt.arabic} className="opt-btn"
                        onClick={() => handleAnswer(opt)}
                        style={{
                          background:bg, border,
                          borderRadius:"14px", padding:"16px",
                          fontSize:"24px", fontWeight:700,
                          fontFamily:"'Playfair Display',serif",
                          color:"#3A2A1A", cursor: selected ? "default" : "pointer",
                          boxShadow:`3px 4px 0 ${opt.color}`,
                          transition:"all 0.2s ease",
                        }}>
                        {opt.arabic}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {gameState === "complete" && (
              <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease both" }}>
                <div style={{
                  background:"#FFF8F0", border:"2px solid #9E3520",
                  borderRadius:"18px", padding:"32px 24px",
                  boxShadow:"4px 6px 0 #E8654A",
                }}>
                  <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#9E3520", margin:"0 0 12px" }}>
                    {score >= 7 ? "🏆" : score >= 5 ? "⭐" : "🎯"}
                  </p>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"22px", color:"#3A2A1A", margin:"0 0 8px" }}>
                    {score} / {shuffled.length}
                  </p>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"15px", color:"#6B5B3E", margin:"0 0 24px" }}>
                    {score >= 7 ? "Outstanding! You know your numbers!" : score >= 5 ? "Good work! Keep practicing." : "Keep going — practice makes perfect!"}
                  </p>
                  <button onClick={startGame} style={{
                    background:"#9E3520", color:"#FFF8F0",
                    border:"none", borderRadius:"999px",
                    padding:"14px 36px", fontSize:"16px",
                    fontFamily:"'Playfair Display',serif", fontWeight:700,
                    cursor:"pointer",
                  }}>
                    Play Again →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push(`/learn?name=${encodeURIComponent(chineseName)}&english=${encodeURIComponent(englishName)}`)}
        style={{
          position:"fixed", bottom:"28px", left:"24px",
          background:"rgba(255,248,240,0.92)",
          border:"1.5px solid #9E3520",
          borderRadius:"999px", padding:"10px 20px",
          fontFamily:"'Playfair Display',serif", fontSize:"13px",
          color:"#9E3520", cursor:"pointer",
          letterSpacing:"0.05em", backdropFilter:"blur(4px)",
        }}
      >
        ← Back
      </button>
    </main>
  );
}

export default function NumbersPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#9E3520" }}>数</span>
      </main>
    }>
      <NumbersContent />
    </Suspense>
  );
}
