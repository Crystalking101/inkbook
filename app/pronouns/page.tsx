"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PRONOUNS = [
  { chinese:"我", pinyin:"wǒ", english:"I / Me", color:"#E8E4B8", deepColor:"#8A7B2D", example:"我是学生。", examplePinyin:"Wǒ shì xuésheng.", exampleEnglish:"I am a student." },
  { chinese:"你", pinyin:"nǐ", english:"You", color:"#D4849A", deepColor:"#9C4660", example:"你好吗？", examplePinyin:"Nǐ hǎo ma?", exampleEnglish:"How are you?" },
  { chinese:"他", pinyin:"tā", english:"He / Him", color:"#7BA888", deepColor:"#3D6B4F", example:"他是老师。", examplePinyin:"Tā shì lǎoshī.", exampleEnglish:"He is a teacher." },
  { chinese:"她", pinyin:"tā", english:"She / Her", color:"#E8654A", deepColor:"#9E3520", example:"她很漂亮。", examplePinyin:"Tā hěn piàoliang.", exampleEnglish:"She is very beautiful." },
  { chinese:"我们", pinyin:"wǒmen", english:"We / Us", color:"#C41E1E", deepColor:"#8B0000", example:"我们是朋友。", examplePinyin:"Wǒmen shì péngyǒu.", exampleEnglish:"We are friends." },
  { chinese:"你们", pinyin:"nǐmen", english:"You (plural)", color:"#E8E4B8", deepColor:"#8A7B2D", example:"你们好！", examplePinyin:"Nǐmen hǎo!", exampleEnglish:"Hello everyone!" },
  { chinese:"他们", pinyin:"tāmen", english:"They / Them", color:"#D4849A", deepColor:"#9C4660", example:"他们是学生。", examplePinyin:"Tāmen shì xuésheng.", exampleEnglish:"They are students." },
  { chinese:"它", pinyin:"tā", english:"It (objects/animals)", color:"#7BA888", deepColor:"#3D6B4F", example:"它很可爱。", examplePinyin:"Tā hěn kě'ài.", exampleEnglish:"It is very cute." },
];

const SENTENCE_PATTERNS = [
  {
    pattern: "我 + 是 + [noun]",
    english: "I am [noun]",
    examples: [
      { chinese:"我是学生。", pinyin:"Wǒ shì xuésheng.", english:"I am a student." },
      { chinese:"我是老师。", pinyin:"Wǒ shì lǎoshī.", english:"I am a teacher." },
      { chinese:"我是 Crystal。", pinyin:"Wǒ shì Crystal.", english:"I am Crystal." },
    ],
    color:"#E8E4B8", deepColor:"#8A7B2D",
  },
  {
    pattern: "你 + 是 + [noun] + 吗？",
    english: "Are you [noun]?",
    examples: [
      { chinese:"你是学生吗？", pinyin:"Nǐ shì xuésheng ma?", english:"Are you a student?" },
      { chinese:"你是老师吗？", pinyin:"Nǐ shì lǎoshī ma?", english:"Are you a teacher?" },
    ],
    color:"#D4849A", deepColor:"#9C4660",
  },
  {
    pattern: "我 + 很 + [adjective]",
    english: "I am very [adjective]",
    examples: [
      { chinese:"我很好。", pinyin:"Wǒ hěn hǎo.", english:"I am very good." },
      { chinese:"我很忙。", pinyin:"Wǒ hěn máng.", english:"I am very busy." },
      { chinese:"我很高兴。", pinyin:"Wǒ hěn gāoxìng.", english:"I am very happy." },
    ],
    color:"#7BA888", deepColor:"#3D6B4F",
  },
  {
    pattern: "[pronoun] + 叫 + [name]",
    english: "[pronoun] is called [name]",
    examples: [
      { chinese:"我叫 Crystal。", pinyin:"Wǒ jiào Crystal.", english:"My name is Crystal." },
      { chinese:"她叫小红。", pinyin:"Tā jiào Xiǎohóng.", english:"Her name is Xiaohong." },
    ],
    color:"#E8654A", deepColor:"#9E3520",
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

function PronounsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [activeTab, setActiveTab] = useState<"pronouns" | "sentences">("pronouns");
  const [activeCard, setActiveCard] = useState<string | null>(null);

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
        .card:hover { transform:translateY(-2px); }
      `}</style>

      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>我</div>

      {/* Corner doodles */}
      <svg style={{ position:"absolute", top:"10px", left:"10px", pointerEvents:"none" }} width="90" height="120" viewBox="0 0 90 120" opacity="0.4">
        <path d="M10,50 L10,30 L20,40 L30,20 L40,40 L50,20 L60,40 L70,30 L70,50 Z" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="10" y1="50" x2="70" y2="50" stroke="#8B0000" strokeWidth="1.5"/>
        <ellipse cx="38" cy="46" rx="6" ry="4" fill="#E8E4B8" stroke="#8B0000" strokeWidth="1"/>
        {[0,60,120,180,240,300].map((r,i) => (
          <ellipse key={i} cx="20" cy="70" rx="3" ry="5" fill={i%2===0?'#D4849A':'#8B0000'} transform={`rotate(${r},20,78)`} opacity="0.7"/>
        ))}
      </svg>
      <svg style={{ position:"absolute", top:"10px", right:"10px", pointerEvents:"none" }} width="90" height="120" viewBox="0 0 90 120" opacity="0.4">
        {[0,72,144,216,288].map((r,i) => (
          <ellipse key={i} cx="55" cy="30" rx="5" ry="9" fill={i%2===0?'#D4849A':'#9C4660'} transform={`rotate(${r},55,42)`} opacity="0.6"/>
        ))}
        <circle cx="55" cy="42" r="5" fill="#9C4660" opacity="0.4"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} width="600" height="70" viewBox="0 0 600 70" opacity="0.06">
        <path d="M200,70 L200,35 Q300,12 400,35 L400,70Z" fill="#8B0000"/>
        <path d="M100,70 L100,45 Q150,28 200,45 L200,70Z" fill="#8B0000"/>
        <path d="M400,70 L400,45 Q450,28 500,45 L500,70Z" fill="#8B0000"/>
        <path d="M295,12 Q300,2 305,12" fill="#8B0000"/>
      </svg>

      <div style={{ maxWidth:"620px", margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"24px", animation:"fadeUp 0.5s ease both" }}>
          <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"13px", color:"rgba(139,0,0,0.5)", letterSpacing:"4px", marginBottom:"8px" }}>
            {chineseName || "学生"} · Pronouns
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"10px" }}>
            {["P","R","O","N","O","U","N","S"].map((ch, i) => {
              const colors = [
                { bg:"#8B0000", c:"#FFF8F0" },
                { bg:"#E8E4B8", c:"#5A3A1A" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#7BA888", c:"#FFF8F0" },
                { bg:"#E8654A", c:"#FFF8F0" },
                { bg:"#FFF8F0", c:"#8B0000" },
              ];
              const s = colors[i % colors.length];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(22px,5vw,36px)",
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
            Tap a card to see an example sentence. Tap 🔊 to hear it.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", marginBottom:"24px" }}>
          {[
            { id:"pronouns", label:"Pronouns", chinese:"代词" },
            { id:"sentences", label:"Sentences", chinese:"句子" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? "#8B0000" : "#FFF8F0",
                color: activeTab === tab.id ? "#FFF8F0" : "#8B0000",
                border:"2px solid #8B0000",
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

        {/* PRONOUNS TAB */}
        {activeTab === "pronouns" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"14px", animation:"fadeUp 0.4s ease both" }}>
            {PRONOUNS.map((p, i) => (
              <div key={p.chinese} className="card"
                onClick={() => setActiveCard(activeCard === p.chinese ? null : p.chinese)}
                style={{
                  background: activeCard === p.chinese ? p.color : "#FFF8F0",
                  border:`2px solid ${p.deepColor}`,
                  borderRadius:"14px", padding:"18px 14px",
                  cursor:"pointer",
                  boxShadow:`3px 4px 0 ${p.color}`,
                  transition:"all 0.2s ease",
                  animation:`fadeUp 0.4s ease ${i*0.06}s both`,
                }}>
                <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:p.deepColor, display:"block", textAlign:"center", lineHeight:1.1 }}>{p.chinese}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"16px", color:p.deepColor, display:"block", textAlign:"center", marginTop:"6px" }}>{p.pinyin}</span>
                <span style={{ fontSize:"13px", color:"#6B5B3E", display:"block", textAlign:"center", marginTop:"3px" }}>{p.english}</span>

                {activeCard === p.chinese && (
                  <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:`1px solid ${p.deepColor}30` }}>
                    <p style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"15px", color:p.deepColor, margin:"0 0 3px", textAlign:"center" }}>{p.example}</p>
                    <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"12px", color:"#6B5B3E", margin:"0 0 3px", textAlign:"center" }}>{p.examplePinyin}</p>
                    <p style={{ fontSize:"12px", color:"#8A7B5C", margin:"0 0 8px", textAlign:"center" }}>{p.exampleEnglish}</p>
                    <button onClick={e => { e.stopPropagation(); speak(p.example); }}
                      style={{ background:p.deepColor, color:"#FFF8F0", border:"none", borderRadius:"999px", padding:"6px 16px", fontSize:"12px", fontFamily:"'Playfair Display',serif", cursor:"pointer", width:"100%" }}>
                      🔊 Hear it
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SENTENCES TAB */}
        {activeTab === "sentences" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px", animation:"fadeUp 0.4s ease both" }}>
            {SENTENCE_PATTERNS.map((pattern, i) => (
              <div key={pattern.pattern} style={{
                background:"#FFF8F0", border:`2px solid ${pattern.deepColor}`,
                borderRadius:"14px", padding:"20px",
                boxShadow:`3px 4px 0 ${pattern.color}`,
                animation:`fadeUp 0.4s ease ${i*0.1}s both`,
              }}>
                {/* Pattern header */}
                <div style={{ background:pattern.color, borderRadius:"8px", padding:"10px 14px", marginBottom:"14px" }}>
                  <p style={{ margin:0, fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"16px", color:pattern.deepColor }}>{pattern.pattern}</p>
                  <p style={{ margin:"3px 0 0", fontStyle:"italic", fontSize:"13px", color:pattern.deepColor, opacity:0.8 }}>{pattern.english}</p>
                </div>

                {/* Examples */}
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {pattern.examples.map(ex => (
                    <div key={ex.chinese} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"8px 12px", background:"rgba(255,248,240,0.8)", borderRadius:"8px", border:`1px solid ${pattern.deepColor}20` }}>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:0, fontFamily:"'Noto Serif SC',serif", fontSize:"20px", color:pattern.deepColor }}>{ex.chinese}</p>
                        <p style={{ margin:"2px 0 0", fontStyle:"italic", fontSize:"15px", color:"#6B5B3E" }}>{ex.pinyin}</p>
                        <p style={{ margin:"1px 0 0", fontSize:"14px", color:"#8A7B5C" }}>{ex.english}</p>
                      </div>
                      <button onClick={() => speak(ex.chinese)}
                        style={{ background:pattern.deepColor, color:"#FFF8F0", border:"none", borderRadius:"999px", padding:"6px 14px", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Try it yourself */}
            <div style={{ background:"#FFF8F0", border:"2px solid #8B0000", borderLeft:"6px solid #8B0000", borderRadius:"0 14px 14px 0", padding:"18px 22px", boxShadow:"3px 4px 0 #E8E4B8" }}>
              <p style={{ margin:"0 0 8px", color:"#8B0000", fontWeight:700, fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase" }}>Try It Yourself</p>
              <p style={{ margin:0, color:"#3A2D1A", fontSize:"14px", lineHeight:1.75, fontStyle:"italic" }}>
                Replace the nouns and adjectives with your own words. Try saying: 我是 [your name]. 你好，我叫 [your name]！
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push(`/learn?name=${encodeURIComponent(chineseName)}&english=${encodeURIComponent(englishName)}`)}
        style={{
          position:"fixed", bottom:"28px", left:"24px",
          background:"rgba(255,248,240,0.92)",
          border:"1.5px solid #8B0000",
          borderRadius:"999px", padding:"10px 20px",
          fontFamily:"'Playfair Display',serif", fontSize:"13px",
          color:"#8B0000", cursor:"pointer",
          letterSpacing:"0.05em", backdropFilter:"blur(4px)",
        }}
      >
        ← Back
      </button>
    </main>
  );
}

export default function PronounsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>我</span>
      </main>
    }>
      <PronounsContent />
    </Suspense>
  );
}
