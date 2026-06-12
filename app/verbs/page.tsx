"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const VERBS = [
  {
    chinese: "是", pinyin: "shì", english: "to be", color: "#E8E4B8", deepColor: "#8A7B2D",
    sentences: [
      { chinese:"我是学生。", pinyin:"Wǒ shì xuésheng.", english:"I am a student." },
      { chinese:"她是老师。", pinyin:"Tā shì lǎoshī.", english:"She is a teacher." },
      { chinese:"这是书。", pinyin:"Zhè shì shū.", english:"This is a book." },
    ],
    tip: "是 connects a subject to a noun. Unlike English, adjectives use 很 instead of 是.",
  },
  {
    chinese: "有", pinyin: "yǒu", english: "to have", color: "#D4849A", deepColor: "#9C4660",
    sentences: [
      { chinese:"我有一本书。", pinyin:"Wǒ yǒu yī běn shū.", english:"I have a book." },
      { chinese:"你有时间吗？", pinyin:"Nǐ yǒu shíjiān ma?", english:"Do you have time?" },
      { chinese:"他没有钱。", pinyin:"Tā méiyǒu qián.", english:"He has no money." },
    ],
    tip: "没有 (méiyǒu) is the negative form — means 'don't have' or 'there isn't'.",
  },
  {
    chinese: "去", pinyin: "qù", english: "to go", color: "#7BA888", deepColor: "#3D6B4F",
    sentences: [
      { chinese:"我去学校。", pinyin:"Wǒ qù xuéxiào.", english:"I go to school." },
      { chinese:"你去哪儿？", pinyin:"Nǐ qù nǎr?", english:"Where are you going?" },
      { chinese:"我们去吃饭。", pinyin:"Wǒmen qù chīfàn.", english:"We are going to eat." },
    ],
    tip: "Place 去 before a location or activity. 去吃饭 literally means 'go eat rice' — i.e. go have a meal.",
  },
  {
    chinese: "喜欢", pinyin: "xǐhuān", english: "to like", color: "#E8654A", deepColor: "#9E3520",
    sentences: [
      { chinese:"我喜欢咖啡。", pinyin:"Wǒ xǐhuān kāfēi.", english:"I like coffee." },
      { chinese:"她喜欢音乐。", pinyin:"Tā xǐhuān yīnyuè.", english:"She likes music." },
      { chinese:"你喜欢什么？", pinyin:"Nǐ xǐhuān shénme?", english:"What do you like?" },
    ],
    tip: "喜欢 can be followed by nouns or verbs. 我喜欢看电影 means 'I like watching movies'.",
  },
  {
    chinese: "想", pinyin: "xiǎng", english: "to want / to think", color: "#C41E1E", deepColor: "#8B0000",
    sentences: [
      { chinese:"我想吃饭。", pinyin:"Wǒ xiǎng chīfàn.", english:"I want to eat." },
      { chinese:"你想什么？", pinyin:"Nǐ xiǎng shénme?", english:"What are you thinking?" },
      { chinese:"我不想去。", pinyin:"Wǒ bù xiǎng qù.", english:"I don't want to go." },
    ],
    tip: "想 before a verb means 'want to'. 想 before a noun means 'miss' or 'think about'.",
  },
  {
    chinese: "吃", pinyin: "chī", english: "to eat", color: "#E8E4B8", deepColor: "#8A7B2D",
    sentences: [
      { chinese:"我吃饭。", pinyin:"Wǒ chīfàn.", english:"I eat / I'm eating." },
      { chinese:"你吃什么？", pinyin:"Nǐ chī shénme?", english:"What are you eating?" },
      { chinese:"我喜欢吃饺子。", pinyin:"Wǒ xǐhuān chī jiǎozi.", english:"I like eating dumplings." },
    ],
    tip: "吃饭 literally means 'eat rice' but is used to mean 'eat a meal' in general.",
  },
  {
    chinese: "说", pinyin: "shuō", english: "to speak / to say", color: "#D4849A", deepColor: "#9C4660",
    sentences: [
      { chinese:"你说中文吗？", pinyin:"Nǐ shuō zhōngwén ma?", english:"Do you speak Chinese?" },
      { chinese:"他说得很好。", pinyin:"Tā shuō de hěn hǎo.", english:"He speaks very well." },
      { chinese:"请慢点说。", pinyin:"Qǐng màn diǎn shuō.", english:"Please speak more slowly." },
    ],
    tip: "说 + language = speak that language. 说中文 = speak Chinese. 说英文 = speak English.",
  },
  {
    chinese: "来", pinyin: "lái", english: "to come", color: "#7BA888", deepColor: "#3D6B4F",
    sentences: [
      { chinese:"请进来。", pinyin:"Qǐng jìnlái.", english:"Please come in." },
      { chinese:"他来了。", pinyin:"Tā lái le.", english:"He has come / He's here." },
      { chinese:"你从哪儿来？", pinyin:"Nǐ cóng nǎr lái?", english:"Where do you come from?" },
    ],
    tip: "来 vs 去: 来 means coming toward you, 去 means going away from you.",
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

function VerbsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const chineseName = params.get("name") ?? "";
  const englishName = params.get("english") ?? "";
  const [activeVerb, setActiveVerb] = useState<string | null>(null);

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
        .verb-card:hover { transform:translateY(-2px); }
      `}</style>

      <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"min(70vw,500px)", fontFamily:"'Noto Serif SC',serif", color:"rgba(139,0,0,0.03)", userSelect:"none", pointerEvents:"none", lineHeight:1 }}>动</div>

      {/* Doodles */}
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
          <ellipse key={i} cx="55" cy="30" rx="5" ry="9" fill={i%2===0?'#E8654A':'#9E3520'} transform={`rotate(${r},55,42)`} opacity="0.6"/>
        ))}
        <circle cx="55" cy="42" r="5" fill="#9E3520" opacity="0.4"/>
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
            {chineseName || "学生"} · Common Verbs
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", marginBottom:"10px" }}>
            {["V","E","R","B","S"].map((ch, i) => {
              const colors = [
                { bg:"#8B0000", c:"#FFF8F0" },
                { bg:"#E8654A", c:"#FFF8F0" },
                { bg:"#FFF8F0", c:"#8B0000" },
                { bg:"#D4849A", c:"#FFF8F0" },
                { bg:"#7BA888", c:"#FFF8F0" },
              ];
              const s = colors[i % colors.length];
              return (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  fontSize:"clamp(28px,7vw,46px)",
                  padding:"3px 14px",
                  background: s.bg, color: s.c,
                  transform:`rotate(${i%2===0?-2:2}deg)`,
                  boxShadow:"2px 3px 0 rgba(60,30,10,0.18)",
                  borderRadius:"2px",
                }}>{ch}</span>
              );
            })}
          </div>
          <p style={{ fontStyle:"italic", color:"rgba(90,58,26,0.6)", fontSize:"14px" }}>
            Tap a verb to see example sentences and a usage tip.
          </p>
        </div>

        {/* Verb cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {VERBS.map((verb, i) => {
            const isActive = activeVerb === verb.chinese;
            return (
              <div key={verb.chinese} className="verb-card"
                onClick={() => setActiveVerb(isActive ? null : verb.chinese)}
                style={{
                  background: isActive ? verb.color : "#FFF8F0",
                  border:`2px solid ${verb.deepColor}`,
                  borderRadius:"14px",
                  padding:"16px 20px",
                  cursor:"pointer",
                  boxShadow:`3px 4px 0 ${verb.color}`,
                  transition:"all 0.2s ease",
                  animation:`fadeUp 0.4s ease ${i*0.06}s both`,
                }}>

                {/* Verb header */}
                <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"44px", color:verb.deepColor, lineHeight:1, flexShrink:0 }}>{verb.chinese}</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"18px", color:verb.deepColor, display:"block" }}>{verb.pinyin}</span>
                    <span style={{ fontSize:"14px", color:"#6B5B3E" }}>{verb.english}</span>
                  </div>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                    <button onClick={e => { e.stopPropagation(); speak(verb.chinese); }}
                      style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer" }}>🔊</button>
                    <span style={{ fontSize:"16px", color:verb.deepColor, opacity:0.6 }}>{isActive ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isActive && (
                  <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:`1px solid ${verb.deepColor}25` }}
                    onClick={e => e.stopPropagation()}>

                    {/* Usage tip */}
                    <div style={{ background:"rgba(255,248,240,0.8)", borderRadius:"8px", padding:"10px 14px", marginBottom:"14px", border:`1px solid ${verb.deepColor}20` }}>
                      <p style={{ margin:0, fontSize:"13px", color:verb.deepColor, fontStyle:"italic", lineHeight:1.6 }}>
                        💡 {verb.tip}
                      </p>
                    </div>

                    {/* Example sentences */}
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                      {verb.sentences.map(s => (
                        <div key={s.chinese} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background:"rgba(255,248,240,0.9)", borderRadius:"10px", border:`1px solid ${verb.deepColor}15` }}>
                          <div style={{ flex:1 }}>
                            <p style={{ margin:0, fontFamily:"'Noto Serif SC',serif", fontSize:"20px", color:verb.deepColor }}>{s.chinese}</p>
                            <p style={{ margin:"2px 0 0", fontStyle:"italic", fontSize:"15px", color:"#6B5B3E" }}>{s.pinyin}</p>
                            <p style={{ margin:"1px 0 0", fontSize:"14px", color:"#8A7B5C" }}>{s.english}</p>
                          </div>
                          <button onClick={() => speak(s.chinese)}
                            style={{ background:verb.deepColor, color:"#FFF8F0", border:"none", borderRadius:"999px", padding:"6px 14px", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
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

        {/* Quick reference */}
        <div style={{ marginTop:"24px", background:"#FFF8F0", border:"2px solid #8B0000", borderLeft:"6px solid #8B0000", borderRadius:"0 14px 14px 0", padding:"18px 22px", boxShadow:"3px 4px 0 #E8E4B8" }}>
          <p style={{ margin:"0 0 10px", color:"#8B0000", fontWeight:700, fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase" }}>Quick Reference</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(100px,1fr))", gap:"8px" }}>
            {VERBS.map(v => (
              <div key={v.chinese} onClick={() => speak(v.chinese)} style={{ textAlign:"center", padding:"8px", background:v.color, borderRadius:"8px", cursor:"pointer", border:`1px solid ${v.deepColor}` }}>
                <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"22px", color:v.deepColor, display:"block" }}>{v.chinese}</span>
                <span style={{ fontSize:"11px", color:v.deepColor, fontStyle:"italic" }}>{v.english}</span>
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

export default function VerbsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight:"100vh", backgroundColor:"#FFF8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:"48px", color:"#8B0000" }}>动</span>
      </main>
    }>
      <VerbsContent />
    </Suspense>
  );
}
