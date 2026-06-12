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
    howTo: "Hold your voice high and steady, like singing one flat note. It does not rise or fall. Pretend you are at the doctor saying aaah.",
    curvePath: "M 40 35 L 260 35",
    startDot: { x: 40, y: 35 }, endDot: { x: 260, y: 35 },
    storyTitle: "The Golden Age",
    story: "The Tang dynasty was China's golden age of poetry. Poets like Li Bai wrote verses that people still memorize 1,300 years later. The Tang held its empire high and steady for nearly three centuries, just like the First Tone holds its pitch high and level, never wavering.",
    examples: [
      { hanzi: "妈", pinyin: "mā", meaning: "mom" },
      { hanzi: "天", pinyin: "tiān", meaning: "sky" },
      { hanzi: "高", pinyin: "gāo", meaning: "tall" },
    ],
  },
  han: {
    id: "han", english: "Han", chinese: "汉朝", period: "206 BC – 220 AD",
    color: "#7BA888", deepColor: "#3D6B4F",
    toneNumber: "2nd", toneName: "Second Tone", toneMark: "á",
    description: "Rising sharply",
    howTo: "Start in the middle of your voice and slide up, like asking a surprised question in English. Your pitch climbs from middle to high.",
    curvePath: "M 40 95 Q 150 85 260 30",
    startDot: { x: 40, y: 95 }, endDot: { x: 260, y: 30 },
    storyTitle: "The Rising Empire",
    story: "The Han dynasty rose from civil war to become one of history's great empires, opening the Silk Road and stretching China's reach across Asia. Chinese people still call themselves 汉人 today. The Second Tone rises just like the Han did, starting from the middle and climbing high.",
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
    howTo: "Start in the middle, dip down low, then bounce back up. It feels like a little valley in your voice, like a doubtful well in English.",
    curvePath: "M 40 80 Q 110 145 160 130 Q 220 110 260 55",
    startDot: { x: 40, y: 80 }, endDot: { x: 260, y: 55 },
    storyTitle: "The Great Comeback",
    story: "Before the Ming, China had dipped under a century of Mongol rule. Then a peasant rebel rose to found the Ming dynasty, rebuilding the Great Wall and sending treasure fleets across the ocean. The Third Tone follows the same shape, dipping down low before rising back up.",
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
    howTo: "Start high and drop fast, like firmly saying No in English. The pitch falls from the top of your voice straight to the bottom.",
    curvePath: "M 40 30 L 260 130",
    startDot: { x: 40, y: 30 }, endDot: { x: 260, y: 130 },
    storyTitle: "The Decisive Conquest",
    story: "The Qing swept down from the north in 1644 and took Beijing in a single decisive campaign, founding China's last imperial dynasty. The Fourth Tone moves the same way, starting at the very top and falling sharply, quick and commanding, leaving no doubt.",
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
    howTo: "Say it short, soft, and quick with no shape at all. It is the lightest touch, like the unstressed a at the end of sofa.",
    curvePath: "M 130 85 L 170 85",
    startDot: { x: 130, y: 85 }, endDot: { x: 170, y: 85 },
    storyTitle: "The Quiet Refinement",
    story: "The Song dynasty conquered with brush and ink rather than sword. It perfected porcelain, landscape painting, and printed books, prizing subtlety above grandeur. The Neutral Tone shares that spirit, light, brief, and understated, the gentlest sound in Mandarin.",
    examples: [
      { hanzi: "吗", pinyin: "ma", meaning: "question word" },
      { hanzi: "的", pinyin: "de", meaning: "possessive particle" },
      { hanzi: "了", pinyin: "le", meaning: "completion particle" },
    ],
  },
};

// Ransom letters using dynasty card colors
function RansomTitle({ text, dynasty }: { text: string; dynasty: DynastyTone }) {
  const colors = [
    { bg: dynasty.color, color: dynasty.deepColor },
    { bg: dynasty.deepColor, color: "#FFF8F0" },
    { bg: "#FFF8F0", color: dynasty.deepColor },
    { bg: "#8B0000", color: "#FFF8F0" },
    { bg: dynasty.color, color: "#3A2A1A" },
  ];
  // Split into words to prevent awkward wrapping
  const words = text.split(" ");
  return (
    <h1 style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px", margin: 0, rowGap: "8px" }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "flex", gap: "4px" }}>
          {word.split("").map((ch, i) => {
            const idx = words.slice(0, wi).join("").length + i;
            return (
              <span key={i} style={{
                fontFamily: idx % 2 === 0 ? "'Playfair Display', serif" : "'Noto Serif SC', serif",
                fontWeight: 900,
                fontSize: "clamp(28px, 6vw, 44px)",
                padding: "3px 10px",
                lineHeight: 1.2,
                background: colors[idx % colors.length].bg,
                color: colors[idx % colors.length].color,
                transform: `rotate(${idx % 2 === 0 ? -3 : 2}deg)`,
                boxShadow: "2px 3px 0 rgba(60,30,10,0.22)",
                display: "inline-block",
                borderRadius: "2px",
              }}>{ch}</span>
            );
          })}
        </span>
      ))}
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
  return (
    <svg viewBox="0 0 300 160" style={{ width: "100%", maxWidth: "440px", display: "block", margin: "0 auto" }}>
      {[5, 4, 3, 2, 1].map((level, i) => {
        const y = 20 + i * 30;
        return (
          <g key={level}>
            <line x1="40" y1={y} x2="260" y2={y} stroke="#C9A45C" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.5" />
            <text x="26" y={y + 4} fontSize="11" fill="#8A7B5C" fontFamily="'Playfair Display', serif" textAnchor="middle">{level}</text>
          </g>
        );
      })}
      <path d={dynasty.curvePath} fill="none" stroke="#1A1A1A" strokeWidth="13" strokeLinecap="round" opacity="0.07" />
      <path d={dynasty.curvePath} fill="none" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round"
        style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: "inkDraw 1.4s ease-out 0.4s forwards" }} />
      <circle cx={dynasty.startDot.x} cy={dynasty.startDot.y} r="6" fill={dynasty.deepColor}
        style={{ opacity: 0, animation: "dotIn 0.4s ease-out 0.4s forwards" }} />
      <circle cx={dynasty.endDot.x} cy={dynasty.endDot.y} r="6" fill={dynasty.deepColor}
        style={{ opacity: 0, animation: "dotIn 0.4s ease-out 1.8s forwards" }} />
    </svg>
  );
}

// ── Decorative SVG doodles ──
function FeminineDecorations({ dynasty }: { dynasty: DynastyTone }) {
  const c = dynasty.deepColor;
  const light = dynasty.color;
  return (
    <>
      {/* TOP LEFT — crown + hairpin */}
      <svg style={{ position:"absolute", top:"10px", left:"10px", pointerEvents:"none" }} width="120" height="160" viewBox="0 0 120 160" opacity="0.55">
        {/* Crown */}
        <path d="M10,60 L10,40 L25,50 L35,30 L45,50 L55,30 L65,50 L75,40 L75,60 Z" fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10,60 L75,60" stroke={c} strokeWidth="1.5"/>
        <circle cx="35" cy="30" r="3" fill={c}/>
        <circle cx="55" cy="30" r="3" fill={c}/>
        <circle cx="75" cy="40" r="3" fill={c}/>
        <circle cx="10" cy="40" r="3" fill={c}/>
        {/* Gems on crown */}
        <ellipse cx="42" cy="55" rx="6" ry="4" fill={light} stroke={c} strokeWidth="1"/>
        {/* Hairpin */}
        <line x1="20" y1="80" x2="60" y2="130" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="80" r="5" fill="none" stroke={c} strokeWidth="1.2"/>
        {[0,60,120,180,240,300].map((r,i) => (
          <ellipse key={i} cx="20" cy="72" rx="3" ry="5" fill={i%2===0?light:c} transform={`rotate(${r},20,80)`} opacity="0.8"/>
        ))}
        {/* Small butterfly */}
        <path d="M85,90 Q75,75 80,70 Q90,65 95,75 Q90,80 85,90Z" fill={light} stroke={c} strokeWidth="1" opacity="0.7"/>
        <path d="M85,90 Q95,75 90,70 Q80,65 75,75 Q80,80 85,90Z" fill={light} stroke={c} strokeWidth="1" opacity="0.7"/>
        <line x1="85" y1="88" x2="83" y2="105" stroke={c} strokeWidth="0.8"/>
        <line x1="85" y1="88" x2="87" y2="105" stroke={c} strokeWidth="0.8"/>
      </svg>

      {/* TOP RIGHT — jade bangle + pearls */}
      <svg style={{ position:"absolute", top:"10px", right:"10px", pointerEvents:"none" }} width="120" height="160" viewBox="0 0 120 160" opacity="0.55">
        {/* Jade bangle */}
        <circle cx="75" cy="55" r="32" fill="none" stroke={c} strokeWidth="8" opacity="0.3"/>
        <circle cx="75" cy="55" r="32" fill="none" stroke={light} strokeWidth="5" opacity="0.5"/>
        <circle cx="75" cy="55" r="32" fill="none" stroke={c} strokeWidth="1.5"/>
        <circle cx="75" cy="55" r="24" fill="none" stroke={c} strokeWidth="1"/>
        <text x="75" y="59" fontFamily="'Noto Serif SC',serif" fontSize="10" fill={c} textAnchor="middle" opacity="0.6">玉</text>
        {/* Pearl strand */}
        {[0,1,2,3,4,5].map(i => (
          <circle key={i} cx={20 + i*8} cy={120 + (i%2)*6} r="4" fill="#FFF8F0" stroke={c} strokeWidth="1" opacity="0.8"/>
        ))}
        <path d="M20,120 Q44,114 68,126" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5"/>
        {/* Ribbon */}
        <path d="M30,140 Q40,130 50,140 Q60,150 70,140" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      </svg>

      {/* BOTTOM LEFT — fan + flowers */}
      <svg style={{ position:"absolute", bottom:"60px", left:"10px", pointerEvents:"none" }} width="130" height="160" viewBox="0 0 130 160" opacity="0.5">
        {/* Mini fan */}
        <g transform="translate(50,140)">
          {[[-50,-80],[-30,-90],[0,-95],[30,-90],[50,-80]].map(([x,y],i) => (
            <line key={i} x1="0" y1="0" x2={x} y2={y} stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
          ))}
          <path d="M-50,-80 A95 95 0 0 1 50,-80" fill="none" stroke={c} strokeWidth="1"/>
          <path d="M-50,-80 A95 95 0 0 1 -30,-90 L0,0Z" fill={light} opacity="0.4"/>
          <path d="M-30,-90 A95 95 0 0 1 0,-95 L0,0Z" fill={c} opacity="0.25"/>
          <path d="M0,-95 A95 95 0 0 1 30,-90 L0,0Z" fill={light} opacity="0.4"/>
          <path d="M30,-90 A95 95 0 0 1 50,-80 L0,0Z" fill={c} opacity="0.25"/>
          <circle cx="0" cy="0" r="4" fill={c}/>
        </g>
        {/* Flower */}
        {[0,72,144,216,288].map((r,i) => (
          <ellipse key={i} cx="25" cy="20" rx="5" ry="8" fill={i%2===0?light:c} transform={`rotate(${r},25,30)`} opacity="0.6"/>
        ))}
        <circle cx="25" cy="30" r="5" fill={c} opacity="0.5"/>
      </svg>

      {/* BOTTOM RIGHT — bracelet + stars */}
      <svg style={{ position:"absolute", bottom:"60px", right:"10px", pointerEvents:"none" }} width="130" height="160" viewBox="0 0 130 160" opacity="0.5">
        {/* Bracelet */}
        <ellipse cx="80" cy="60" rx="35" ry="18" fill="none" stroke={c} strokeWidth="6" opacity="0.3"/>
        <ellipse cx="80" cy="60" rx="35" ry="18" fill="none" stroke={light} strokeWidth="4" opacity="0.5"/>
        <ellipse cx="80" cy="60" rx="35" ry="18" fill="none" stroke={c} strokeWidth="1.2"/>
        {[0,60,120,180,240,300].map((a,i) => {
          const x = 80 + 35*Math.cos(a*Math.PI/180);
          const y = 60 + 18*Math.sin(a*Math.PI/180);
          return <circle key={i} cx={x} cy={y} r="3" fill={i%2===0?c:light} stroke={c} strokeWidth="0.8"/>;
        })}
        {/* Stars */}
        {[[30,110],[60,130],[90,115],[110,135]].map(([x,y],i) => (
          <polygon key={i} points={`${x},${y-6} ${x+2},${y-2} ${x+6},${y-2} ${x+3},${y+1} ${x+4},${y+5} ${x},${y+3} ${x-4},${y+5} ${x-3},${y+1} ${x-6},${y-2} ${x-2},${y-2}`}
            fill={i%2===0?c:light} stroke={c} strokeWidth="0.5" opacity="0.7"/>
        ))}
      </svg>

      {/* CENTER LEFT — palace sketch */}
      <svg style={{ position:"absolute", top:"50%", left:"0", transform:"translateY(-50%)", pointerEvents:"none" }} width="60" height="200" viewBox="0 0 60 200" opacity="0.12">
        <line x1="30" y1="0" x2="30" y2="200" stroke={c} strokeWidth="1"/>
        {[40,80,120,160].map(y => (
          <g key={y}>
            <path d={`M20,${y} Q30,${y-12} 40,${y}`} fill="none" stroke={c} strokeWidth="1"/>
            <line x1="20" y1={y} x2="40" y2={y} stroke={c} strokeWidth="0.8"/>
          </g>
        ))}
      </svg>

      {/* Imperial palace silhouette at bottom */}
      <svg style={{ position:"absolute", bottom:"0", left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} width="600" height="80" viewBox="0 0 600 80" opacity="0.07">
        {/* Main hall */}
        <path d="M200,80 L200,40 Q300,15 400,40 L400,80Z" fill={c}/>
        <path d="M210,40 Q300,18 390,40" fill="none" stroke={c} strokeWidth="1"/>
        {/* Left wing */}
        <path d="M100,80 L100,52 Q150,35 200,52 L200,80Z" fill={c}/>
        <path d="M108,52 Q150,37 192,52" fill="none" stroke={c} strokeWidth="0.8"/>
        {/* Right wing */}
        <path d="M400,80 L400,52 Q450,35 500,52 L500,80Z" fill={c}/>
        <path d="M408,52 Q450,37 492,52" fill="none" stroke={c} strokeWidth="0.8"/>
        {/* Roof tips */}
        <path d="M195,40 Q200,30 205,40" fill={c}/>
        <path d="M295,15 Q300,5 305,15" fill={c}/>
        <path d="M395,40 Q400,30 405,40" fill={c}/>
        {/* Steps */}
        <rect x="240" y="72" width="120" height="4" fill={c} opacity="0.5"/>
        <rect x="250" y="68" width="100" height="4" fill={c} opacity="0.5"/>
        {/* Clouds */}
        <path d="M50,20 Q60,12 70,20 Q75,10 85,18 Q90,8 100,16 Q105,22 95,26 Q85,30 65,26 Q55,28 50,20Z" fill={c} opacity="0.5"/>
        <path d="M480,25 Q490,17 500,25 Q505,15 515,23 Q518,30 508,32 Q495,35 483,30 Q476,30 480,25Z" fill={c} opacity="0.5"/>
      </svg>
    </>
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

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#FFF8F0",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(139,0,0,0.06) 27px, rgba(139,0,0,0.06) 28px)",
      position: "relative", overflow: "hidden", padding: "48px 20px 100px",
      fontFamily: "'Playfair Display', serif",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes inkDraw { to { stroke-dashoffset: 0; } }
        @keyframes dotIn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        .speak-btn:hover { transform: scale(1.06); box-shadow: 0 6px 18px rgba(60,30,10,0.2); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(60,30,10,0.25); }
        .back-btn:hover { opacity: 0.7; }
      `}</style>

      <FeminineDecorations dynasty={dynasty} />

      <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>

        {/* Eyebrow */}
        <p style={{ textAlign: "center", color: dynasty.deepColor, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: "13px", marginBottom: "12px", animation: "fadeUp 0.6s ease-out both" }}>
          {chineseName ? (<>Welcome, <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "17px" }}>{chineseName}</span> · Scholar of the {dynasty.english}</>) : (<>Scholar of the {dynasty.english} Dynasty</>)}
        </p>

        {/* Ransom title */}
        <div style={{ animation: "fadeUp 0.6s ease-out 0.1s both", marginBottom: "10px" }}>
          <RansomTitle text={`THE ${dynasty.toneNumber.toUpperCase()} TONE`} dynasty={dynasty} />
        </div>

        {/* Tone mark large */}
        <div style={{ textAlign: "center", marginBottom: "6px", animation: "fadeUp 0.6s ease-out 0.15s both" }}>
          <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "56px", color: dynasty.deepColor, lineHeight: 1 }}>{dynasty.toneMark}</span>
        </div>

        <p style={{ textAlign: "center", fontStyle: "italic", color: "#6B5B3E", fontSize: "18px", marginBottom: "32px", animation: "fadeUp 0.6s ease-out 0.2s both" }}>
          {dynasty.chinese} · {dynasty.period} · {dynasty.description}
        </p>

        {/* Tone curve card */}
        <section style={{
          background: "#FFF8F0", border: `2px solid ${dynasty.deepColor}`,
          borderRadius: "16px", boxShadow: `4px 6px 0 ${dynasty.color}`,
          padding: "26px 22px 18px", marginBottom: "24px",
          animation: "fadeUp 0.6s ease-out 0.3s both"
        }}>
          <p style={{ textAlign: "center", color: "#6B5B3E", fontSize: "15px", fontStyle: "italic", marginBottom: "12px" }}>{dynasty.toneName}</p>
          <ToneCurve dynasty={dynasty} />
          <p style={{ textAlign: "center", color: "#4A3B26", fontSize: "16px", lineHeight: 1.7, maxWidth: "480px", margin: "14px auto 6px" }}>{dynasty.howTo}</p>
        </section>

        {/* Example words */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "24px", animation: "fadeUp 0.6s ease-out 0.45s both" }}>
          {dynasty.examples.map((word) => (
            <button key={word.hanzi} className="speak-btn" onClick={() => speak(word.hanzi)}
              style={{
                background: "#FFF8F0",
                border: `2px solid ${dynasty.deepColor}`,
                borderRadius: "14px", padding: "18px 10px 14px",
                cursor: "pointer",
                boxShadow: `3px 4px 0 ${dynasty.color}`,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                textAlign: "center",
              }}>
              <span style={{ display: "block", fontFamily: "'Noto Serif SC', serif", fontSize: "48px", color: dynasty.deepColor, lineHeight: 1.1 }}>{word.hanzi}</span>
              <span style={{ display: "block", fontSize: "18px", fontStyle: "italic", color: dynasty.deepColor, marginTop: "6px" }}>{word.pinyin}</span>
              <span style={{ display: "block", fontSize: "13px", color: "#6B5B3E", marginTop: "4px" }}>{word.meaning} · 🔊</span>
            </button>
          ))}
        </section>

        {/* Cultural story card */}
        <section style={{
          background: "#FFF8F0",
          borderLeft: `6px solid ${dynasty.deepColor}`,
          borderRadius: "0 14px 14px 0",
          boxShadow: `4px 6px 0 ${dynasty.color}`,
          padding: "20px 24px", marginBottom: "36px",
          animation: "fadeUp 0.6s ease-out 0.6s both"
        }}>
          <p style={{ margin: 0, color: dynasty.deepColor, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "12px" }}>{dynasty.storyTitle}</p>
          <p style={{ margin: "10px 0 0", color: "#3A2D1A", fontSize: "16px", lineHeight: 1.8 }}>{dynasty.story}</p>
        </section>

        {/* CTA button */}
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease-out 0.75s both" }}>
          <button className="cta-btn"
            onClick={() => router.push(`/practice?dynasty=${dynasty.id}&name=${encodeURIComponent(chineseName)}`)}
            style={{
              background: dynasty.deepColor,
              color: "#FFF8F0",
              border: `2px solid ${dynasty.deepColor}`,
              borderRadius: "999px", padding: "18px 48px",
              fontSize: "18px", fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "0.06em", cursor: "pointer",
              boxShadow: `0 6px 16px rgba(60,30,10,0.2)`,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}>
            Start Practicing →
          </button>
          <p style={{ marginTop: "14px", fontSize: "14px", color: "#8A7B5C", fontStyle: "italic" }}>
            Tap any character above to hear it spoken aloud
          </p>
        </div>
      </div>

      {/* Back button */}
      <button className="back-btn"
        onClick={() => router.push(`/dynasty?name=${encodeURIComponent(chineseName)}`)}
        style={{
          position: "fixed", bottom: "28px", left: "24px",
          background: "rgba(255,248,240,0.92)", border: `1.5px solid ${dynasty.deepColor}`,
          borderRadius: "999px", padding: "10px 20px",
          fontFamily: "'Playfair Display',serif", fontSize: "13px",
          color: dynasty.deepColor, cursor: "pointer",
          letterSpacing: "0.05em", backdropFilter: "blur(4px)",
          transition: "opacity 0.2s ease",
        }}>
        ← Dynasty
      </button>
    </main>
  );
}

export default function TonesPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", backgroundColor: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "48px", color: "#8B0000" }}>墨</span>
      </main>
    }>
      <ToneIntroContent />
    </Suspense>
  );
}
