// app/page.tsx - InkBook Opening Screen FULL VERSION
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const nameMap: Record<string, { chinese: string; pinyin: string; meaning: string }> = {
  crystal: { chinese: '克里丝托', pinyin: 'Kè lǐ sī tuō', meaning: 'Clear and brilliant, like crystal jade' },
  jessica: { chinese: '杰西卡', pinyin: 'Jié xī kǎ', meaning: 'Outstanding and triumphant' },
  ashley: { chinese: '阿什利', pinyin: 'Ā shí lì', meaning: 'Graceful and powerful' },
  taylor: { chinese: '泰勒', pinyin: 'Tài lè', meaning: 'Great joy and harmony' },
  morgan: { chinese: '摩根', pinyin: 'Mó gēn', meaning: 'Deep roots, steadfast spirit' },
  emma: { chinese: '艾玛', pinyin: 'Ài mǎ', meaning: 'Beloved and noble' },
  sophia: { chinese: '索菲亚', pinyin: 'Suǒ fēi yà', meaning: 'Wisdom that illuminates' },
  olivia: { chinese: '奥利维亚', pinyin: 'Ào lì wéi yà', meaning: 'Proud and full of life' },
  sarah: { chinese: '莎拉', pinyin: 'Shā lā', meaning: 'Elegant as flowing silk' },
  grace: { chinese: '格蕾丝', pinyin: 'Gé léi sī', meaning: 'Refined grace, pure virtue' },
  luna: { chinese: '露娜', pinyin: 'Lù nà', meaning: 'Moonlight on still water' },
  jade: { chinese: '玉', pinyin: 'Yù', meaning: 'Precious jade, eternal beauty' },
  lily: { chinese: '丽丽', pinyin: 'Lì lì', meaning: 'Beautiful and radiant' },
  rose: { chinese: '洛丝', pinyin: 'Luò sī', meaning: 'Gentle as morning dew' },
  mei: { chinese: '美', pinyin: 'Měi', meaning: 'Beautiful as a spring blossom' },
};

export default function InkBookHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [result, setResult] = useState<{ chinese: string; pinyin: string; meaning: string } | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function toggleBook() {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(prev => !prev);
    setTimeout(() => setIsAnimating(false), 700);
  }

  async function generateName() {
    if (!nameInput.trim()) return;
    setIsLoading(true);
    const lower = nameInput.trim().toLowerCase();
    if (nameMap[lower]) {
      setTimeout(() => { setResult(nameMap[lower]); setIsLoading(false); }, 600);
      return;
    }
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://inkbook.vercel.app',
          'X-Title': 'InkBook',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct',
          messages: [{ role: 'user', content: `Generate a culturally appropriate Mandarin Chinese name for someone named "${nameInput}". Return ONLY a JSON object with keys: chinese, pinyin, meaning. No other text.` }]
        })
      });
      const data = await res.json();
      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, '').trim();
      setResult(JSON.parse(clean));
    } catch {
      setResult({ chinese: '美丽', pinyin: 'Měi lì', meaning: 'Beautiful and radiant soul' });
    }
    setIsLoading(false);
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Playfair Display', serif; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .result-fade { animation: fadeIn 0.5s ease forwards; }
        input:focus { outline: none; }
        input::placeholder { color: rgba(90,58,26,0.35); font-style:italic; font-size:11px; font-family:'Playfair Display',serif; }
      `}</style>

      <div style={{ width:'100%', minHeight:'100vh', background:'#FFF8F0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px 80px', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(139,0,0,0.06) 27px,rgba(139,0,0,0.06) 28px)' }}>

        {/* Logo */}
        <div style={{ marginBottom:'20px', textAlign:'center', transition:'opacity 0.3s', opacity: isOpen ? 0 : 1 }}>
          <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'22px', color:'#8B0000', letterSpacing:'6px', display:'block' }}>墨 书</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.45)', letterSpacing:'3px', display:'block', marginTop:'3px' }}>I N K B O O K</span>
        </div>

        {/* BOOK WRAPPER */}
        <div style={{ position:'relative' }}>

          {/* SPINE CHARM CHAIN */}
          <div style={{ position:'absolute', left:'-28px', top:'20px', width:'20px', zIndex:30 }}>
            <svg width="20" height="420" viewBox="0 0 20 420">
              <line x1="10" y1="0" x2="10" y2="420" stroke="#C4A030" strokeWidth="1.5" strokeDasharray="4,3"/>
              {[60,120,180,240,300,360].map(y => <ellipse key={y} cx="10" cy={y} rx="5" ry="3" fill="none" stroke="#C4A030" strokeWidth="1.5"/>)}
              <line x1="10" y1="80" x2="2" y2="96" stroke="#C4A030" strokeWidth="1"/>
              <circle cx="2" cy="106" r="11" fill="#D4AF37" stroke="#8B6010" strokeWidth="1"/>
              <rect x="-3" y="101" width="10" height="10" fill="#B8952A"/>
              <text x="2" y="110" fontFamily="serif" fontSize="9" fill="#4A2800" textAnchor="middle">福</text>
              <line x1="10" y1="150" x2="3" y2="164" stroke="#C4A030" strokeWidth="1"/>
              <line x1="3" y1="164" x2="3" y2="170" stroke="#8B4513" strokeWidth="2"/>
              <ellipse cx="3" cy="184" rx="8" ry="12" fill="#CC0000" stroke="#880000" strokeWidth="1"/>
              <text x="3" y="188" fontFamily="serif" fontSize="8" fill="#FFD700" textAnchor="middle">福</text>
              <line x1="0" y1="196" x2="-2" y2="206" stroke="#D4AF37" strokeWidth="1"/>
              <line x1="3" y1="196" x2="3" y2="207" stroke="#CC0000" strokeWidth="1"/>
              <line x1="6" y1="196" x2="8" y2="206" stroke="#D4AF37" strokeWidth="1"/>
              <line x1="10" y1="220" x2="3" y2="235" stroke="#C4A030" strokeWidth="1"/>
              <ellipse cx="3" cy="245" rx="5" ry="7" fill="#2D8B50" stroke="#1A5A30" strokeWidth="1" opacity="0.9"/>
              <ellipse cx="2" cy="243" rx="2" ry="2" fill="rgba(255,255,255,0.4)"/>
              <line x1="10" y1="300" x2="3" y2="316" stroke="#C4A030" strokeWidth="1"/>
              <circle cx="3" cy="324" r="5" fill="none" stroke="#C4A030" strokeWidth="1.5"/>
              <circle cx="3" cy="324" r="2" fill="#C4A030"/>
              <line x1="3" y1="329" x2="3" y2="345" stroke="#C4A030" strokeWidth="1.5"/>
              <line x1="3" y1="337" x2="7" y2="341" stroke="#C4A030" strokeWidth="1.5"/>
              <line x1="3" y1="342" x2="7" y2="346" stroke="#C4A030" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* BOOK */}
          <div style={{ position:'relative', width:'340px', height:'420px', perspective:'1200px' }}>

            <div style={{ position:'absolute', bottom:'-14px', left:'50%', transform:'translateX(-50%)', width:'340px', height:'14px', background:'rgba(0,0,0,0.12)', borderRadius:'50%', filter:'blur(5px)', zIndex:0 }}/>
            <div style={{ position:'absolute', right:'-10px', top:'3px', width:'22px', height:'414px', background:'repeating-linear-gradient(90deg,#F0E0C0 0px,#F0E0C0 1px,#DDD0A8 1px,#DDD0A8 2px,#EEE0BE 2px,#EEE0BE 3px,#C8B080 3px,#C8B080 4px)', borderRadius:'0 4px 4px 0', boxShadow:'3px 0 8px rgba(0,0,0,0.18)', zIndex:1 }}/>

            {/* Mixed tabs */}
            <div style={{ position:'absolute', right:'-36px', top:0, width:'28px', height:'420px', zIndex:2 }}>
              <div style={{ position:'absolute', top:'30px', right:0, width:'26px', height:'34px', background:'#F2C4CE', clipPath:'polygon(0 0,100% 8%,100% 92%,0 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'8px', color:'#8B0000', writingMode:'vertical-rl' }}>唐</span>
              </div>
              <div style={{ position:'absolute', top:'90px', right:0, width:'14px', height:'38px', background:'#8B0000', borderRadius:'0 0 6px 6px' }}/>
              <div style={{ position:'absolute', top:'152px', right:0, width:'24px', height:'20px', background:'repeating-linear-gradient(90deg,rgba(212,175,55,0.8) 0px,rgba(212,175,55,0.8) 6px,rgba(180,140,20,0.6) 6px,rgba(180,140,20,0.6) 12px)' }}/>
              <div style={{ position:'absolute', top:'198px', right:0, width:'22px', height:'36px', background:'#2D5016', borderRadius:'0 0 10px 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'8px', color:'#D4AF37', writingMode:'vertical-rl' }}>明</span>
              </div>
              <div style={{ position:'absolute', top:'258px', right:0, width:'18px', height:'30px', background:'linear-gradient(180deg,#1B4B7A,#0D2D50)', borderRadius:'0 3px 3px 0' }}/>
              <div style={{ position:'absolute', top:'308px', right:0, width:'24px', height:'28px', background:'#FAD4A6', clipPath:'polygon(0 5%,100% 0,100% 100%,0 95%)' }}/>
              <div style={{ position:'absolute', top:'356px', right:0, width:'18px', height:'32px', background:'#F4A7B9', borderRadius:'0 4px 4px 0', borderRight:'1px dashed rgba(139,0,0,0.3)' }}/>
              <div style={{ position:'absolute', top:'400px', right:'5px', width:'2px', height:'18px', background:'rgba(180,140,60,0.6)' }}>
                <div style={{ position:'absolute', bottom:'-8px', left:'-5px', width:'12px', height:'12px', borderRadius:'50%', background:'#D4AF37', border:'1px solid #B8952A' }}/>
              </div>
            </div>

            {/* String binding */}
            <div style={{ position:'absolute', left:'-5px', top:0, zIndex:20, height:'420px', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'30px 0' }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#E8D0A0', border:'1px solid rgba(180,140,60,0.5)' }}/>)}
            </div>

            {/* Ribbons */}
            <div style={{ position:'absolute', top:'-2px', right:'30px', width:'11px', height:'40px', background:'linear-gradient(180deg,#CC0000,#990000)', opacity:0.85, borderRadius:'0 0 3px 3px', zIndex:15 }}/>
            <div style={{ position:'absolute', top:'-2px', right:'50px', width:'8px', height:'28px', background:'linear-gradient(180deg,#D4AF37,#B8952A)', opacity:0.7, borderRadius:'0 0 3px 3px', zIndex:15 }}/>
            <div style={{ position:'absolute', top:'-2px', right:'65px', width:'6px', height:'22px', background:'linear-gradient(180deg,#F4A7B9,#D4849A)', opacity:0.6, borderRadius:'0 0 3px 3px', zIndex:15 }}/>

            {/* INNER PAGE */}
            <div style={{ position:'absolute', left:0, top:0, width:'340px', height:'420px', background:'#F5E8C8', borderRadius:'3px 6px 6px 3px', overflow:'hidden', zIndex:2 }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 15% 15%,rgba(180,130,60,0.1) 0%,transparent 50%),radial-gradient(#F5E8C8,#EDD9A8)' }}/>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'14px', background:'linear-gradient(180deg,rgba(80,45,10,0.3) 0%,transparent 100%)', clipPath:'polygon(0% 0%,7% 100%,14% 35%,21% 100%,29% 20%,37% 100%,44% 50%,51% 100%,59% 25%,66% 100%,74% 40%,81% 100%,89% 30%,95% 100%,100% 0%)' }}/>
              <div style={{ position:'absolute', top:'22px', right:'14px', width:'32px', height:'32px', border:'1.5px solid rgba(139,0,0,0.22)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Noto Serif SC',serif", fontSize:'13px', color:'rgba(139,0,0,0.28)', transform:'rotate(-12deg)' }}>墨</div>
              <div style={{ position:'absolute', bottom:'14px', left:'50%', transform:'translateX(-50%)', fontFamily:"'Noto Serif SC',serif", fontSize:'56px', color:'rgba(139,0,0,0.03)', whiteSpace:'nowrap', pointerEvents:'none' }}>墨书</div>
              <div style={{ position:'absolute', inset:'28px 18px 18px 20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity: isOpen ? 1 : 0, transition:'opacity 0.5s ease 0.5s' }}>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'13px', color:'#5A3A1A', textAlign:'center', lineHeight:1.7, marginBottom:'16px', fontStyle:'italic' }}>Every language journey<br/>begins with a name.</p>
                {result && (
                  <div className="result-fade" style={{ textAlign:'center', marginBottom:'12px' }}>
                    <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'32px', color:'#8B0000', letterSpacing:'4px', marginBottom:'4px' }}>{result.chinese}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.6)', fontStyle:'italic', marginBottom:'4px' }}>{result.pinyin}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'rgba(90,58,26,0.7)', fontStyle:'italic' }}>{result.meaning}</div>
                  </div>
                )}
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateName()} onClick={e => e.stopPropagation()} placeholder="enter your name here..." style={{ width:'100%', background:'transparent', border:'none', borderBottom:'1px solid rgba(90,58,26,0.35)', padding:'6px 4px', fontFamily:"'Playfair Display',serif", fontSize:'12px', color:'#3A2010', textAlign:'center', marginBottom:'14px' }}/>
                <button onClick={e => { e.stopPropagation(); generateName(); }} style={{ background:'#8B0000', color:'#F5E8C8', border:'none', padding:'8px 16px', fontFamily:"'Playfair Display',serif", fontSize:'9px', letterSpacing:'1.5px', cursor:'pointer', width:'100%', position:'relative' }}>
                  {isLoading ? '✦ WRITING YOUR NAME... ✦' : '✦ GENERATE MY CHINESE NAME ✦'}
                </button>
                {result && (
                <button
                onClick={e => { e.stopPropagation(); router.push(`/dynasty?name=${encodeURIComponent(result.chinese)}`); }}
                style={{ background:'#D4AF37', color:'#3A2010', border:'none', padding:'8px 16px', fontFamily:"'Playfair Display',serif", fontSize:'9px', letterSpacing:'1.5px', cursor:'pointer', width:'100%', marginTop:'8px', fontWeight:700 }}
                >
                Choose Your Dynasty →
                </button>
           )}
              </div>
              </div>

            {/* COVER */}
            <div onClick={toggleBook} style={{ position:'absolute', left:0, top:0, width:'340px', height:'420px', borderRadius:'3px 6px 6px 3px', zIndex:8, cursor:'pointer', transformOrigin:'left center', transformStyle:'preserve-3d', transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)', transition:'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}>

              {/* FRONT */}
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg,#F2C4CE,#E8A0B8,#D4849A)', borderRadius:'3px 6px 6px 3px', backfaceVisibility:'hidden', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:'8px', border:'1.5px solid rgba(255,255,255,0.5)', borderRadius:'2px', pointerEvents:'none', zIndex:2 }}/>

                {/* Washi tapes */}
                <div style={{ position:'absolute', top:'48px', left:'-6px', right:'-6px', height:'22px', background:'repeating-linear-gradient(90deg,rgba(212,175,55,0.6) 0px,rgba(212,175,55,0.6) 14px,rgba(180,140,20,0.45) 14px,rgba(180,140,20,0.45) 28px)', transform:'rotate(-2deg)', zIndex:3 }}/>
                <div style={{ position:'absolute', top:'205px', left:'-6px', right:'-6px', height:'18px', background:'repeating-linear-gradient(90deg,rgba(139,0,0,0.5) 0px,rgba(139,0,0,0.5) 10px,rgba(180,0,0,0.35) 10px,rgba(180,0,0,0.35) 20px)', transform:'rotate(1.5deg)', zIndex:3 }}/>
                <div style={{ position:'absolute', top:'335px', left:'-6px', right:'-6px', height:'16px', background:'repeating-linear-gradient(90deg,rgba(27,75,122,0.45) 0px,rgba(27,75,122,0.45) 8px,rgba(20,55,100,0.3) 8px,rgba(20,55,100,0.3) 16px)', transform:'rotate(-1deg)', zIndex:3 }}/>

                {/* HERO FAN */}
                <div style={{ position:'absolute', top:'-8px', left:'50%', transform:'translateX(-50%)', zIndex:4 }}>
                  <svg width="200" height="140" viewBox="0 0 200 140">
                    <g transform="translate(100,140)">
                      {[[-90,-115],[-62,-125],[-30,-130],[0,-132],[30,-130],[62,-125],[90,-115]].map(([x,y],i) => (
                        <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
                      ))}
                      <path d="M-90,-115 A138 138 0 0 1 -62,-125 L0,0 Z" fill="rgba(200,40,40,0.65)"/>
                      <path d="M-62,-125 A138 138 0 0 1 -30,-130 L0,0 Z" fill="rgba(212,175,55,0.7)"/>
                      <path d="M-30,-130 A138 138 0 0 1 0,-132 L0,0 Z" fill="rgba(200,40,40,0.65)"/>
                      <path d="M0,-132 A138 138 0 0 1 30,-130 L0,0 Z" fill="rgba(212,175,55,0.7)"/>
                      <path d="M30,-130 A138 138 0 0 1 62,-125 L0,0 Z" fill="rgba(200,40,40,0.65)"/>
                      <path d="M62,-125 A138 138 0 0 1 90,-115 L0,0 Z" fill="rgba(212,175,55,0.7)"/>
                      <path d="M-90,-115 A138 138 0 0 1 90,-115" fill="none" stroke="#8B0000" strokeWidth="2"/>
                      <text x="-42" y="-80" fontFamily="'Noto Serif SC',serif" fontSize="13" fill="rgba(139,0,0,0.85)" transform="rotate(22,-42,-80)">龍</text>
                      <text x="0" y="-84" fontFamily="'Noto Serif SC',serif" fontSize="14" fill="rgba(139,0,0,0.85)" textAnchor="middle">福</text>
                      <text x="28" y="-78" fontFamily="'Noto Serif SC',serif" fontSize="13" fill="rgba(139,0,0,0.85)" transform="rotate(-22,28,-78)">春</text>
                      <circle cx="0" cy="0" r="6" fill="#C4A030" stroke="#8B4513" strokeWidth="1"/>
                      <line x1="-8" y1="2" x2="-10" y2="18" stroke="#8B0000" strokeWidth="1.5"/>
                      <line x1="0" y1="2" x2="0" y2="20" stroke="#D4AF37" strokeWidth="1.5"/>
                      <line x1="8" y1="2" x2="10" y2="18" stroke="#8B0000" strokeWidth="1.5"/>
                    </g>
                  </svg>
                </div>

                {/* Fish lantern */}
                <div style={{ position:'absolute', top:'55px', right:'10px', transform:'rotate(5deg)', zIndex:4 }}>
                  <svg width="68" height="115" viewBox="0 0 68 115">
                    <line x1="34" y1="0" x2="34" y2="11" stroke="#8B4513" strokeWidth="1.5"/>
                    <ellipse cx="34" cy="50" rx="21" ry="30" fill="#CC0000" stroke="#880000" strokeWidth="1.5"/>
                    <ellipse cx="27" cy="42" rx="7" ry="5" fill="none" stroke="rgba(255,180,0,0.5)" strokeWidth="1"/>
                    <ellipse cx="41" cy="42" rx="7" ry="5" fill="none" stroke="rgba(255,180,0,0.5)" strokeWidth="1"/>
                    <ellipse cx="34" cy="54" rx="7" ry="5" fill="none" stroke="rgba(255,180,0,0.5)" strokeWidth="1"/>
                    <circle cx="40" cy="36" r="4" fill="#FFD700" stroke="#8B0000" strokeWidth="1"/>
                    <circle cx="41" cy="35" r="1.5" fill="#1A1A1A"/>
                    <path d="M27 46 Q24 50 27 52" fill="none" stroke="#880000" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M34 80 Q18 92 12 104 Q28 96 34 88 Q40 96 56 104 Q50 92 34 80Z" fill="#CC0000" stroke="#880000" strokeWidth="1"/>
                    <path d="M24 26 Q34 12 44 26" fill="rgba(200,20,20,0.7)" stroke="#880000" strokeWidth="1"/>
                    <path d="M13 50 Q7 58 13 66" fill="rgba(200,20,20,0.6)" stroke="#880000" strokeWidth="1"/>
                    <text x="34" y="56" fontFamily="'Noto Serif SC',serif" fontSize="15" fill="#FFD700" textAnchor="middle" fontWeight="700">福</text>
                    {[-10,-5,0,5,10].map((x,i) => <line key={i} x1={34+x} y1="79" x2={34+x+(i%2===0?2:-2)} y2="93" stroke={i%2===0?'#D4AF37':'#CC0000'} strokeWidth="1.5"/>)}
                  </svg>
                </div>

                {/* Peony */}
                <div style={{ position:'absolute', top:'100px', left:'8px', transform:'rotate(-12deg)', zIndex:4 }}>
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    {[0,45,90,135,180,225,270,315].map((r,i) => <ellipse key={i} cx="26" cy="9" rx="7" ry="11" fill={i%2===0?'#E8869A':'#F4A7B9'} transform={`rotate(${r},26,26)`} opacity="0.9"/>)}
                    <circle cx="26" cy="26" r="8" fill="#FFD700" opacity="0.85"/>
                    <circle cx="26" cy="26" r="4" fill="#F5A800"/>
                  </svg>
                </div>

                {/* Plum blossom */}
                <div style={{ position:'absolute', top:'158px', left:'6px', transform:'rotate(8deg)', zIndex:4 }}>
                  <svg width="42" height="42" viewBox="0 0 42 42">
                    {[{cx:21,cy:9},{cx:33,cy:17},{cx:31,cy:31},{cx:11,cy:33},{cx:9,cy:17}].map((p,i) => <circle key={i} cx={p.cx} cy={p.cy} r="8" fill={i%2===0?'#F2C4CE':'#EDA8BC'} opacity="0.9"/>)}
                    <circle cx="21" cy="21" r="6" fill="#FFD700" opacity="0.85"/>
                  </svg>
                </div>

                {/* Cherry blossom */}
                <div style={{ position:'absolute', top:'18px', right:'80px', transform:'rotate(-5deg)', zIndex:4 }}>
                  <svg width="34" height="34" viewBox="0 0 34 34">
                    {[{cx:17,cy:7},{cx:27,cy:13},{cx:25,cy:25},{cx:9,cy:25},{cx:7,cy:13}].map((p,i) => <circle key={i} cx={p.cx} cy={p.cy} r="6" fill={i%2===0?'#F9D0DC':'#F4B8C8'} opacity="0.9"/>)}
                    <circle cx="17" cy="17" r="5" fill="#FFD700" opacity="0.8"/>
                  </svg>
                </div>

                {/* Small flower */}
                <div style={{ position:'absolute', top:'245px', left:'55px', transform:'rotate(6deg)', zIndex:4 }}>
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    {[0,72,144,216,288].map((r,i) => <ellipse key={i} cx="14" cy="5" rx="4" ry="7" fill={i%2===0?'#F2C4CE':'#EDA8BC'} transform={`rotate(${r},14,14)`} opacity="0.9"/>)}
                    <circle cx="14" cy="14" r="4" fill="#FFD700"/>
                  </svg>
                </div>

                {/* Rose */}
                <div style={{ position:'absolute', bottom:'108px', left:'50%', transform:'translateX(-50%) rotate(3deg)', zIndex:4 }}>
                  <svg width="36" height="36" viewBox="0 0 36 36">
                    <ellipse cx="18" cy="26" rx="12" ry="8" fill="#C84060" opacity="0.8"/>
                    <ellipse cx="18" cy="20" rx="10" ry="7" fill="#D45070" opacity="0.85"/>
                    <ellipse cx="18" cy="14" rx="8" ry="6" fill="#E06080" opacity="0.9"/>
                    <ellipse cx="18" cy="10" rx="5" ry="5" fill="#E87090"/>
                    <circle cx="18" cy="8" r="3" fill="#F090A8"/>
                  </svg>
                </div>

                {/* Gold ingot */}
                <div style={{ position:'absolute', top:'66px', left:'12px', transform:'rotate(-8deg)', zIndex:4 }}>
                  <div style={{ position:'relative', width:'50px', height:'30px' }}>
                    <div style={{ position:'absolute', top:'3px', left:'3px', width:'46px', height:'26px', background:'#D4B840', borderRadius:'2px' }}/>
                    <div style={{ position:'absolute', top:0, left:0, width:'46px', height:'26px', background:'linear-gradient(135deg,#F5D860,#D4AF37)', border:'1px solid #C4A030', borderRadius:'2px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'1px 1px 4px rgba(0,0,0,0.2)' }}>
                      <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'11px', color:'#8B4500', fontWeight:700 }}>元宝</span>
                    </div>
                  </div>
                </div>

                {/* Paper money */}
                <div style={{ position:'absolute', bottom:'180px', left:'10px', transform:'rotate(7deg)', zIndex:4 }}>
                  <div style={{ width:'58px', height:'28px', background:'linear-gradient(135deg,#2A7A2A,#1A5A1A)', border:'1px solid rgba(212,175,55,0.5)', borderRadius:'2px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <div style={{ position:'absolute', inset:'2px', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'1px' }}/>
                    <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'9px', color:'#D4AF37', textAlign:'center', lineHeight:1.3 }}>人民<br/>幸运</span>
                  </div>
                </div>

                {/* Wax seal */}
                <div style={{ position:'absolute', top:'230px', right:'18px', transform:'rotate(-4deg)', zIndex:4 }}>
                  <svg width="64" height="68" viewBox="0 0 64 68">
                    <path d="M32,4 C40,2 52,6 58,16 C64,26 64,40 58,50 C52,60 40,66 30,64 C18,62 8,54 4,42 C0,30 4,16 12,10 C18,4 24,6 32,4 Z" fill="#C47820" stroke="rgba(140,80,0,0.3)" strokeWidth="1"/>
                    <circle cx="31" cy="34" r="22" fill="none" stroke="rgba(100,50,0,0.3)" strokeWidth="2"/>
                    <circle cx="31" cy="34" r="18" fill="none" stroke="rgba(100,50,0,0.2)" strokeWidth="1"/>
                    <text x="31" y="40" fontFamily="'Noto Serif SC',serif" fontSize="20" fill="rgba(80,40,0,0.65)" textAnchor="middle" fontWeight="700">福</text>
                    <line x1="13" y1="34" x2="20" y2="34" stroke="rgba(100,50,0,0.3)" strokeWidth="1"/>
                    <line x1="42" y1="34" x2="49" y2="34" stroke="rgba(100,50,0,0.3)" strokeWidth="1"/>
                    <line x1="31" y1="16" x2="31" y2="23" stroke="rgba(100,50,0,0.3)" strokeWidth="1"/>
                    <line x1="31" y1="45" x2="31" y2="52" stroke="rgba(100,50,0,0.3)" strokeWidth="1"/>
                  </svg>
                </div>

                {/* Dumplings */}
                <div style={{ position:'absolute', top:'20px', left:'16px', transform:'rotate(-8deg)', zIndex:4 }}>
                  <svg width="52" height="36" viewBox="0 0 52 36">
                    <ellipse cx="12" cy="22" rx="11" ry="8" fill="#FFF0DC" stroke="#D4A060" strokeWidth="1"/>
                    <path d="M2,22 C4,14 10,10 12,10 C14,10 20,14 22,22" fill="none" stroke="#D4A060" strokeWidth="1"/>
                    <path d="M4,18 C6,16 8,15 10,16" fill="none" stroke="#D4A060" strokeWidth="0.8"/>
                    <ellipse cx="26" cy="20" rx="11" ry="8" fill="#FFF0DC" stroke="#D4A060" strokeWidth="1"/>
                    <path d="M16,20 C18,12 24,8 26,8 C28,8 34,12 36,20" fill="none" stroke="#D4A060" strokeWidth="1"/>
                    <path d="M18,16 C20,14 22,13 24,14" fill="none" stroke="#D4A060" strokeWidth="0.8"/>
                    <ellipse cx="40" cy="22" rx="11" ry="8" fill="#FFF0DC" stroke="#D4A060" strokeWidth="1"/>
                    <path d="M30,22 C32,14 38,10 40,10 C42,10 48,14 50,22" fill="none" stroke="#D4A060" strokeWidth="1"/>
                  </svg>
                </div>

                {/* Teacup */}
                <div style={{ position:'absolute', top:'162px', right:'16px', transform:'rotate(5deg)', zIndex:4 }}>
                  <svg width="44" height="48" viewBox="0 0 44 48">
                    <path d="M6,12 C4,28 6,38 12,42 L32,42 C38,38 40,28 38,12 Z" fill="#F5E8C8" stroke="#C4A030" strokeWidth="1.2"/>
                    <path d="M6,12 L38,12" stroke="#C4A030" strokeWidth="1.2"/>
                    <path d="M8,16 C7,26 8,34 12,38 L32,38 C36,34 37,26 36,16" fill="rgba(200,100,50,0.15)"/>
                    <path d="M38,18 C44,18 46,26 40,28" fill="none" stroke="#C4A030" strokeWidth="1.2" strokeLinecap="round"/>
                    <ellipse cx="22" cy="12" rx="16" ry="4" fill="#D4AF37" stroke="#B8952A" strokeWidth="1"/>
                    <text x="22" y="30" fontFamily="serif" fontSize="11" fill="#8B4500" textAnchor="middle">茶</text>
                    <path d="M16,4 C16,0 20,0 20,4" fill="none" stroke="rgba(180,180,180,0.6)" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M22,2 C22,-2 26,-2 26,2" fill="none" stroke="rgba(180,180,180,0.5)" strokeWidth="1" strokeLinecap="round"/>
                    <rect x="4" y="42" width="36" height="4" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                  </svg>
                </div>

                {/* Chopsticks */}
                <div style={{ position:'absolute', top:'108px', left:'60px', transform:'rotate(25deg)', zIndex:4 }}>
                  <svg width="14" height="80" viewBox="0 0 14 80">
                    <rect x="2" y="0" width="4" height="72" rx="2" fill="#C4832A" stroke="#8B5500" strokeWidth="0.8"/>
                    <rect x="2" y="68" width="4" height="6" rx="1" fill="#8B5500"/>
                    <rect x="8" y="4" width="4" height="72" rx="2" fill="#C4832A" stroke="#8B5500" strokeWidth="0.8"/>
                    <rect x="8" y="72" width="4" height="6" rx="1" fill="#8B5500"/>
                    <rect x="2" y="0" width="4" height="8" rx="2" fill="#D4AF37"/>
                    <rect x="8" y="4" width="4" height="8" rx="2" fill="#D4AF37"/>
                  </svg>
                </div>

                {/* CENTER TITLE */}
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
                  <div style={{ display:'flex', gap:'4px' }}>
                    {[{ch:'墨',bg:'#F2C4CE'},{ch:'书',bg:'#FAD4A6'}].map(({ch,bg},i) => (
                      <span key={i} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:"'Noto Serif SC',serif", fontWeight:700, fontSize:'28px', padding:'4px 6px', background:bg, borderRadius:'2px', boxShadow:'1px 1px 3px rgba(0,0,0,0.2)', color:'#1A1A1A' }}>{ch}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:'4px' }}>
                    {[{ch:'I',bg:'#F4A7B9',r:-3},{ch:'N',bg:'#FAD4A6',r:2},{ch:'K',bg:'#F2C4CE',r:-1}].map(({ch,bg,r},i) => (
                      <span key={i} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'45px', padding:'4px 6px', background:bg, borderRadius:'2px', boxShadow:'1px 1px 3px rgba(0,0,0,0.2)', transform:`rotate(${r}deg)`, color:'#1A1A1A' }}>{ch}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:'4px' }}>
                    {[{ch:'B',bg:'#CC0000',c:'#FAD4A6',r:2},{ch:'O',bg:'#D4AF37',c:'#1A1A1A',r:-2},{ch:'O',bg:'#2D5016',c:'#FAD4A6',r:3},{ch:'K',bg:'#1B4B7A',c:'#FAD4A6',r:-1}].map(({ch,bg,c,r},i) => (
                      <span key={i} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'35px', padding:'4px 6px', background:bg, borderRadius:'2px', boxShadow:'1px 1px 3px rgba(0,0,0,0.2)', transform:`rotate(${r}deg)`, color:c }}>{ch}</span>
                    ))}
                  </div>
                </div>

                {/* Red envelope */}
                <div style={{ position:'absolute', bottom:'130px', left:'14px', transform:'rotate(-10deg)', zIndex:4, width:'50px', height:'36px', background:'linear-gradient(135deg,#CC0000,#880000)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'2px 2px 6px rgba(0,0,0,0.3)' }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'20px', color:'#D4AF37' }}>福</span>
                </div>

                {/* Postage stamp */}
                <div style={{ position:'absolute', bottom:'82px', right:'14px', transform:'rotate(6deg)', zIndex:4 }}>
                  <div style={{ width:'42px', height:'50px', background:'#FFF8F0', border:'2px solid #D4AF37', padding:'2px', boxShadow:'1px 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ width:'100%', height:'100%', background:'#8B0000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px' }}>
                      <span style={{ fontSize:'14px' }}>🏯</span>
                      <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'6px', color:'#D4AF37', letterSpacing:'1px' }}>中国</span>
                    </div>
                  </div>
                </div>

                {/* Fortune tag */}
                <div style={{ position:'absolute', bottom:'18px', right:'14px', transform:'rotate(8deg)', zIndex:4, background:'#FFF8F0', border:'1px solid rgba(139,0,0,0.25)', padding:'4px 6px', fontFamily:"'Playfair Display',serif", fontSize:'7px', color:'#8B0000', textAlign:'center', lineHeight:1.5, boxShadow:'1px 1px 3px rgba(0,0,0,0.15)' }}>
                  好运<br/>GOOD<br/>LUCK
                </div>

                {/* THREE LANTERNS */}
                <div style={{ position:'absolute', bottom:'-45px', left:'50%', transform:'translateX(-50%)', zIndex:4 }}>
                  <svg width="320" height="170" viewBox="0 0 320 170">
                    <defs>
                      <linearGradient id="ln1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'#8B0000'}}/>
                        <stop offset="40%" style={{stopColor:'#CC0000'}}/>
                        <stop offset="100%" style={{stopColor:'#8B0000'}}/>
                      </linearGradient>
                      <linearGradient id="ln2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'#990000'}}/>
                        <stop offset="40%" style={{stopColor:'#DD0000'}}/>
                        <stop offset="100%" style={{stopColor:'#990000'}}/>
                      </linearGradient>
                      <linearGradient id="gw" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#FFD700',stopOpacity:0.3}}/>
                        <stop offset="100%" style={{stopColor:'#FF8C00',stopOpacity:0.05}}/>
                      </linearGradient>
                    </defs>
                    <path d="M40,6 C80,10 120,8 160,6 C200,4 240,6 280,8" fill="none" stroke="#C4A030" strokeWidth="1.5"/>
                    <rect x="123" y="8" width="34" height="7" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <ellipse cx="140" cy="15" rx="18" ry="4" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <path d="M122,17 C105,25 103,46 105,62 C107,78 112,88 122,93 L158,93 C168,88 173,78 175,62 C177,46 175,25 158,17 Z" fill="url(#ln1)" stroke="#8B0000" strokeWidth="1"/>
                    <path d="M127,22 C114,30 112,50 114,64 C116,78 120,86 128,90 L152,90 C160,86 164,78 166,64 C168,50 166,30 153,22 Z" fill="url(#gw)"/>
                    <line x1="122" y1="17" x2="118" y2="93" stroke="rgba(180,0,0,0.3)" strokeWidth="0.7"/>
                    <line x1="131" y1="17" x2="127" y2="93" stroke="rgba(180,0,0,0.3)" strokeWidth="0.7"/>
                    <line x1="140" y1="17" x2="137" y2="93" stroke="rgba(180,0,0,0.3)" strokeWidth="0.7"/>
                    <line x1="149" y1="17" x2="147" y2="93" stroke="rgba(180,0,0,0.3)" strokeWidth="0.7"/>
                    <line x1="158" y1="17" x2="158" y2="93" stroke="rgba(180,0,0,0.3)" strokeWidth="0.7"/>
                    <text x="140" y="64" fontFamily="serif" fontSize="34" fill="#D4AF37" textAnchor="middle" fontWeight="700">福</text>
                    <ellipse cx="140" cy="93" rx="18" ry="4" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <rect x="123" y="93" width="34" height="7" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <line x1="140" y1="100" x2="140" y2="112" stroke="#D4AF37" strokeWidth="2"/>
                    <circle cx="140" cy="114" r="4" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <line x1="128" y1="117" x2="124" y2="138" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="132" y1="117" x2="129" y2="140" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="136" y1="117" x2="134" y2="141" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="140" y1="118" x2="140" y2="142" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="144" y1="117" x2="146" y2="141" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="148" y1="117" x2="151" y2="140" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="152" y1="117" x2="156" y2="138" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <ellipse cx="140" cy="143" rx="14" ry="5" fill="#D4AF37" opacity="0.5"/>
                    <rect x="28" y="14" width="28" height="6" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <ellipse cx="42" cy="20" rx="15" ry="3" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <path d="M27,22 C13,29 11,47 13,61 C15,75 20,83 29,88 L55,88 C64,83 69,75 71,61 C73,47 71,29 57,22 Z" fill="url(#ln2)" stroke="#8B0000" strokeWidth="1"/>
                    <path d="M32,27 C20,33 18,50 20,63 C22,76 26,82 33,86 L51,86 C58,82 62,76 64,63 C66,50 64,33 52,27 Z" fill="url(#gw)"/>
                    <text x="42" y="61" fontFamily="serif" fontSize="28" fill="#D4AF37" textAnchor="middle" fontWeight="700">喜</text>
                    <ellipse cx="42" cy="88" rx="15" ry="3" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <rect x="28" y="88" width="28" height="6" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <line x1="42" y1="94" x2="42" y2="104" stroke="#D4AF37" strokeWidth="1.5"/>
                    <circle cx="42" cy="106" r="3" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <line x1="34" y1="108" x2="30" y2="126" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="38" y1="108" x2="35" y2="128" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="42" y1="109" x2="42" y2="129" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="46" y1="108" x2="49" y2="128" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="50" y1="108" x2="54" y2="126" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <ellipse cx="42" cy="130" rx="11" ry="4" fill="#D4AF37" opacity="0.5"/>
                    <rect x="244" y="14" width="28" height="6" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <ellipse cx="258" cy="20" rx="15" ry="3" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <path d="M243,22 C229,29 227,47 229,61 C231,75 236,83 245,88 L271,88 C280,83 285,75 287,61 C289,47 287,29 273,22 Z" fill="url(#ln2)" stroke="#8B0000" strokeWidth="1"/>
                    <path d="M248,27 C236,33 234,50 236,63 C238,76 242,82 249,86 L267,86 C274,82 278,76 280,63 C282,50 280,33 268,27 Z" fill="url(#gw)"/>
                    <text x="258" y="61" fontFamily="serif" fontSize="28" fill="#D4AF37" textAnchor="middle" fontWeight="700">壽</text>
                    <ellipse cx="258" cy="88" rx="15" ry="3" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <rect x="244" y="88" width="28" height="6" rx="2" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <line x1="258" y1="94" x2="258" y2="104" stroke="#D4AF37" strokeWidth="1.5"/>
                    <circle cx="258" cy="106" r="3" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
                    <line x1="250" y1="108" x2="246" y2="126" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="254" y1="108" x2="251" y2="128" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="258" y1="109" x2="258" y2="129" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="262" y1="108" x2="265" y2="128" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="266" y1="108" x2="270" y2="126" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
                    <ellipse cx="258" cy="130" rx="11" ry="4" fill="#D4AF37" opacity="0.5"/>
                    <ellipse cx="140" cy="160" rx="90" ry="8" fill="rgba(255,200,0,0.12)"/>
                  </svg>
                </div>

              </div>{/* end front */}

              {/* BACK of cover */}
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg,#EDD9A8,#F5E8C8)', borderRadius:'3px 6px 6px 3px', backfaceVisibility:'hidden', transform:'rotateY(180deg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'48px', color:'rgba(139,0,0,0.08)' }}>墨书</div>
              </div>

            </div>{/* end cover */}

            {/* BOTTOM CHARM CHAIN */}
            <div style={{ position:'absolute', bottom:'-50px', left:'20px', right:'20px', zIndex:30 }}>
              <svg width="300" height="60" viewBox="0 0 300 60">
                <line x1="0" y1="8" x2="300" y2="8" stroke="#C4A030" strokeWidth="1.5" strokeDasharray="4,3"/>
                {[40,90,140,190,240].map(x => <ellipse key={x} cx={x} cy="8" rx="3" ry="5" fill="none" stroke="#C4A030" strokeWidth="1.5"/>)}
                <line x1="30" y1="8" x2="30" y2="18" stroke="#C4A030" strokeWidth="1"/>
                <ellipse cx="30" cy="26" rx="10" ry="7" fill="#C84060" opacity="0.85"/>
                <ellipse cx="30" cy="20" rx="8" ry="6" fill="#D45070" opacity="0.9"/>
                <ellipse cx="30" cy="15" rx="5" ry="5" fill="#E87090"/>
                <line x1="80" y1="8" x2="80" y2="18" stroke="#C4A030" strokeWidth="1"/>
                <circle cx="80" cy="30" r="11" fill="#D4AF37" stroke="#8B6010" strokeWidth="1"/>
                <path d="M80,19 A11,11 0 0 1 80,41 A5.5,5.5 0 0 0 80,30 A5.5,5.5 0 0 1 80,19 Z" fill="#2A2A2A" opacity="0.5"/>
                <circle cx="80" cy="24" r="2" fill="#D4AF37"/>
                <circle cx="80" cy="36" r="2" fill="#2A2A2A" opacity="0.7"/>
                <line x1="130" y1="8" x2="130" y2="16" stroke="#C4A030" strokeWidth="1"/>
                <line x1="130" y1="16" x2="130" y2="20" stroke="#8B4513" strokeWidth="2"/>
                <ellipse cx="130" cy="32" rx="9" ry="12" fill="#CC0000" stroke="#880000" strokeWidth="1"/>
                <text x="130" y="36" fontFamily="serif" fontSize="9" fill="#FFD700" textAnchor="middle">福</text>
                <line x1="126" y1="44" x2="124" y2="52" stroke="#D4AF37" strokeWidth="1"/>
                <line x1="130" y1="44" x2="130" y2="53" stroke="#CC0000" strokeWidth="1"/>
                <line x1="134" y1="44" x2="136" y2="52" stroke="#D4AF37" strokeWidth="1"/>
                <line x1="180" y1="8" x2="180" y2="18" stroke="#C4A030" strokeWidth="1"/>
                <circle cx="180" cy="30" r="10" fill="#2D8B50" stroke="#1A5A30" strokeWidth="1" opacity="0.9"/>
                <text x="180" y="34" fontFamily="serif" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle">玉</text>
                <line x1="230" y1="8" x2="230" y2="16" stroke="#C4A030" strokeWidth="1"/>
                <polygon points="230,18 233,26 242,26 235,31 238,39 230,34 222,39 225,31 218,26 227,26" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"/>
              </svg>
            </div>

          </div>{/* end book */}
        </div>{/* end book wrapper */}

        <p style={{ marginTop:'70px', fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.45)', fontStyle:'italic', letterSpacing:'1px', textAlign:'center' }}>
          {isOpen ? 'tap to close · begin your journey' : 'tap to open · tap again to close'}
        </p>

      </div>
    </>
  );
}
