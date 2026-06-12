"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const QUESTION_WORDS = [
  {
    chinese: "什么", pinyin: "shénme", english: "What", color: "#E8E4B8", deepColor: "#8A7B2D",
    examples: [
      { chinese:"你叫什么名字？", pinyin:"Nǐ jiào shénme míngzi?", english:"What is your name?" },
      { chinese:"这是什么？", pinyin:"Zhè shì shénme?", english:"What is this?" },
      { chinese:"你想吃什么？", pinyin:"Nǐ xiǎng chī shénme?", english:"What do you want to eat?" },
    ],
    tip: "什么 goes where the answer would go. 你叫什么名字 = You are called WHAT name?",
  },
  {
    chinese: "谁", pinyin: "shéi", english: "Who", color: "#D4849A", deepColor: "#9C4660",
    examples: [
      { chinese:"你是谁？", pinyin:"Nǐ shì shéi?", english:"Who are you?" },
      { chinese:"谁是老师？", pinyin:"Shéi shì lǎoshī?", english:"Who is the teacher?" },
      { chinese:"他是谁？", pinyin:"Tā shì shéi?", english:"Who is he?" },
    ],
    tip: "谁 can appear at the beginning or end of a sentence, wherever the person fits.",
  },
  {
    chinese: "哪儿", pinyin: "nǎr", english: "Where", color: "#7BA888", deepColor: "#3D6B4F",
    examples: [
      { chinese:"你去哪儿？", pinyin:"Nǐ qù nǎr?", english:"Where are you going?" },
      { chinese:"你在哪儿？", pinyin:"Nǐ zài nǎr?", english:"Where are you?" },
      { chinese:"洗手间在哪儿？", pinyin:"Xǐshǒujiān zài nǎr?", english:"Where is the bathroom?" },
    ],
    tip: "哪儿 is the northern dialect form. In the south you may hear 哪里 (nǎlǐ) — same meaning.",
  },
  {
    chinese: "为什么", pinyin: "wèishénme", english: "Why", color: "#E8654A", deepColor: "#9E3520",
    examples: [
      { chinese:"你为什么学中文？", pinyin:"Nǐ wèishénme xué zhōngwén?", english:"Why do you study Chinese?" },
      { chinese:"为什么不去？", pinyin:"Wèishénme bù qù?", english:"Why not go?" },
      { chinese:"你为什么哭？", pinyin:"Nǐ wèishénme kū?", english:"Why are you crying?" },
    ],
    tip: "为什么 usually comes before the verb, or at the very start of the sentence.",
  },
  {
    chinese: "怎么", pinyin: "zěnme", english: "How", color: "#C41E1E", deepColor: "#8B0000",
    examples: [
      { chinese:"你怎么去？", pinyin:"Nǐ zěnme qù?", english:"How are you going?" },
      { chinese:"这个怎么说？", pinyin:"Zhège zěnme shuō?", english:"How do you say this?" },
      { chinese:"你怎么了？", pinyin:"Nǐ zěnme le?", english:"What's wrong with you?" },
    ],
    tip: "怎么 + verb = how to do something. 怎么了 is a fixed phrase meaning 'what happened?'",
  },
  {
    chinese: "几", pinyin: "jǐ", english: "How many (small numbers)", color: "#E8E4B8", deepColor: "#8A7B2D",
    examples: [
      { chinese:"你有几个朋友？", pinyin:"Nǐ yǒu jǐ gè péngyǒu?", english:"How many friends do you have?" },
      { chinese:"现在几点？", pinyin:"Xiànzài jǐ diǎn?", english:"What time is it now?" },
      { chinese:"你几岁？", pinyin:"Nǐ jǐ suì?", english:"How old are you?" },
    ],
    tip: "几 is for small numbers (usually under 10). For large unknown quantities use 多少 (duōshǎo).",
  },
  {
    chinese: "哪", pinyin: "nǎ", english: "Which", color: "#D4849A", deepColor: "#9C4660",
    examples: [
      { chinese:"你是哪国人？", pinyin:"Nǐ shì nǎ guó rén?", english:"Which country are you from?" },
      { chinese:"你喜欢哪个？", pinyin:"Nǐ xǐhuān nǎ gè?", english:"Which one do you like?" },
      { chinese:"哪个是你的？", pinyin:"Nǎ gè shì nǐ de?", english:"Which one is yours?" },
    ],
    tip: "哪 + measure word + noun = which [noun]. Always needs a measure word like 个, 本, 种 between 哪 and the noun.",
  },
  {
    chinese: "多少", pinyin: "duōshǎo", english: "How much / How many", color: "#7BA888", deepColor: "#3D6B4F",
    examples: [
      { chinese:"这个多少钱？", pinyin:"Zhège duōshǎo qián?", english:"How much does this cost?" },
      { chinese:"你有多少朋友？", pinyin:"Nǐ yǒu duōshǎo péngyǒu?", english:"How many friends do you have?" },
      { chinese:"多少人？", pinyin:"Duōshǎo rén?", english:"How many people?" },
    ],
    tip: "多少钱 (how much money) is the most common shopping phrase you will ever use in China.",
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

function QuestionsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [activeWord, setActiveWord] = useState<string | null>(null);

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
        .q-card:hover { transform:translateY(-2px); }
      `}</style>

      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>问</div>

      {/* Doodles */}
      <svg style={{ position:"absolute", top:"10px", left:"10px", pointerEvents:"none" }} width="90" height="120" viewBox="0 0 90 120" opacity="0.4">
        <path d="M10,50 L10,30 L20,40 L30,20 L40,40 L50,20 L60,40 L70,30 L70,50 Z" fill="none" stroke="#6B5B8A" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="10" y1="50" x2="70" y2="50" stroke="#6B5B8A" strokeWidth="1.5"/>
        <ellipse cx="38" cy="46" rx="6" ry="4" fill="#B8A9C9" stroke="#6B5B8A" strokeWidth="1"/>
        {[0,60,120,180,240,300].map((r,i) => (
          <ellipse key={i} cx="20" cy="70" rx="3" ry="5" fill={i%2===0?'#B8A9C9':'#6B5B8A'} transform={`rotate(${r},20,78)`} opacity="0.7"/>
        ))}
      </svg>
      <svg style={{ position:"absolute", top:"10px", right:"10px", pointerEvents:"none" }} width="90" height="120" viewBox="0 0 90 120" opacity="0.4">
        {[0,72,144,216,288].map((r,i) => (
          <ellipse key={i} cx="55" cy="30" rx="5" ry="9" fill={i%2===0?'#B8A9C9':'#6B5B8A'} transform={`rotate(${r},55,42)`} opacity="0.6"/>
        ))}
        <circle cx="55" cy="42" r="5" fill="#6B5B8A" opacity="0.4"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} width="600" height="70" viewBox="0 0 600 70" opacity="0.06">
        <path d="M200,70 L200,35 Q300,12 400,35 L400,70Z" fill="#6B5B8A"/>
        <path d="M100,70 L100,45 Q150,28 200,45 L200,70Z" fill="#6B5B8A"/>
        <path d="M400,70 L400,45 Q450,28 500,45 L500,70Z" fill="#6B5B8A"/>
        <path d="M295,12 Q300,2 305,12" fill="#6B5B8A"/>
      </svg>

      <div style={{ maxWidth:"620px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"24px", animation:"fadeUp 0.5s ease both" }}>
          <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color:"rgba(107,91,138,0.7)", letterSpacing:"4px", marginBottom:"8px" }}>
            {chineseName || "学生"} · Question Words
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"10px" }}>
            {["Q","U","E","S","T","I","O","N","S"].map((ch, i) => {
              const colors = [
                { bg:"#6B5B8A", c:"#FFF8F0" },
                { bg:"#B8A9C9", c:"#3A2A5A" },
                { bg:"#FFF8F0", c:"#6B5B8A" },
                { bg:"#8B0000", c:"#FFF8F0" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#7BA888", c:"#FFF8F0" },
                { bg:"#E8654A", c:"#FFF8F0" },
                { bg:"#E8E4B8", c:"#5A3A1A" },
                { bg:"#6B5B8A", c:"#FFF8F0" },
              ];
              const s = colors[i % colors.length];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(20px,4vw,32px)",
                  padding:"3px 9px",
                  background: s.bg, color: s.c,
                  transform:`rotate(${i%2===0?-2:2}deg)`,
                  boxShadow:"2px 3px 0 rgba(60,30,10,0.18)",
                  borderRadius:"2px",
                }}>{ch}</span>
              );
            })}
          </div>
          <p style={{ fontStyle:"italic", color:"rgba(90,58,26,0.6)", fontSize:"14px" }}>
            Tap a card to see example sentences. These unlock real conversations.
          </p>
        </div>

        {/* Quick reference bar */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center", marginBottom:"24px", animation:"fadeUp 0.4s ease 0.1s both" }}>
          {QUESTION_WORDS.map(q => (
            <button key={q.chinese} onClick={() => { setActiveWord(activeWord === q.chinese ? null : q.chinese); speak(q.chinese); }}
              style={{
                background: activeWord === q.chinese ? q.deepColor : q.color,
                color: activeWord === q.chinese ? "#FFF8F0" : q.deepColor,
                border:`2px solid ${q.deepColor}`,
                borderRadius:"999px", padding:"6px 16px",
                fontFamily:"'Noto Serif SC',serif", fontSize:"16px",
                fontWeight:700, cursor:"pointer",
                transition:"all 0.2s ease",
              }}>
              {q.chinese}
            </button>
          ))}
        </div>

        {/* Question word cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {QUESTION_WORDS.map((q, i) => {
            const isActive = activeWord === q.chinese;
            return (
              <div key={q.chinese} className="q-card"
                onClick={() => setActiveWord(isActive ? null : q.chinese)}
                style={{
                  background: isActive ? q.color : "#FFF8F0",
                  border:`2px solid ${q.deepColor}`,
                  borderRadius:"14px",
                  padding:"16px 20px",
                  cursor:"pointer",
                  boxShadow:`3px 4px 0 ${q.color}`,
                  transition:"all 0.2s ease",
                  animation:`fadeUp 0.4s ease ${i*0.05}s both`,
                }}>

                <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"40px", color:q.deepColor, lineHeight:1, flexShrink:0 }}>{q.chinese}</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"17px", color:q.deepColor, display:"block" }}>{q.pinyin}</span>
                    <span style={{ fontSize:"14px", color:"#6B5B3E", fontWeight:700 }}>{q.english}</span>
                  </div>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                    <button onClick={e => { e.stopPropagation(); speak(q.chinese); }}
                      style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer" }}>🔊</button>
                    <span style={{ fontSize:"16px", color:q.deepColor, opacity:0.6 }}>{isActive ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isActive && (
                  <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:`1px solid ${q.deepColor}25` }}
                    onClick={e => e.stopPropagation()}>
                    <div style={{ background:"rgba(255,248,240,0.8)", borderRadius:"8px", padding:"10px 14px", marginBottom:"14px", border:`1px solid ${q.deepColor}20` }}>
                      <p style={{ margin:0, fontSize:"13px", color:q.deepColor, fontStyle:"italic", lineHeight:1.6 }}>💡 {q.tip}</p>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                      {q.examples.map(ex => (
                        <div key={ex.chinese} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background:"rgba(255,248,240,0.9)", borderRadius:"10px", border:`1px solid ${q.deepColor}15` }}>
                          <div style={{ flex:1 }}>
                            <p style={{ margin:0, fontFamily:"'Noto Serif SC',serif", fontSize:"17px", color:q.deepColor }}>{ex.chinese}</p>
                            <p style={{ margin:"2px 0 0", fontStyle:"italic", fontSize:"12px", color:"#6B5B3E" }}>{ex.pinyin}</p>
                            <p style={{ margin:"1px 0 0", fontSize:"12px", color:"#8A7B5C" }}>{ex.english}</p>
                          </div>
                          <button onClick={() => speak(ex.chinese)}
                            style={{ background:q.deepColor, color:"#FFF8F0", border:"none", borderRadius:"999px", padding:"6px 14px", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
                            🔊
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conversation starter callout */}
        <div style={{ marginTop:"24px", background:"#FFF8F0", border:"2px solid #6B5B8A", borderLeft:"6px solid #6B5B8A", borderRadius:"0 14px 14px 0", padding:"18px 22px", boxShadow:"3px 4px 0 #B8A9C9" }}>
          <p style={{ margin:"0 0 10px", color:"#6B5B8A", fontWeight:700, fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase" }}>Start a Conversation</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {[
              { chinese:"你叫什么名字？", english:"What is your name?" },
              { chinese:"你是哪国人？", english:"Where are you from?" },
              { chinese:"你学中文多久了？", english:"How long have you studied Chinese?" },
            ].map(s => (
              <div key={s.chinese} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }}>
                <div>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"16px", color:"#6B5B8A", cursor:"pointer" }} onClick={() => speak(s.chinese)}>{s.chinese}</span>
                  <span style={{ display:"block", fontSize:"12px", color:"#8A7B5C", fontStyle:"italic" }}>{s.english}</span>
                </div>
                <button onClick={() => speak(s.chinese)} style={{ background:"#6B5B8A", color:"#FFF8F0", border:"none", borderRadius:"999px", padding:"5px 12px", fontSize:"13px", cursor:"pointer", flexShrink:0 }}>🔊</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push(`/learn?name=${encodeURIComponent(chineseName)}&english=${encodeURIComponent(englishName)}`)}
        style={{
          position:"fixed", bottom:"28px", left:"24px",
          background:"rgba(255,248,240,0.92)",
          border:"1.5px solid #6B5B8A",
          borderRadius:"999px", padding:"10px 20px",
          fontFamily:"'Playfair Display',serif", fontSize:"13px",
          color:"#6B5B8A", cursor:"pointer",
          letterSpacing:"0.05em", backdropFilter:"blur(4px)",
        }}
      >
        ← Back
      </button>
    </main>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#6B5B8A" }}>问</span>
      </main>
    }>
      <QuestionsContent />
    </Suspense>
  );
}
