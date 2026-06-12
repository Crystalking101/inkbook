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

        /* MOBILE — hide left journal page, scale book to fit screen */
        @media (max-width: 600px) {
          .book-inner-page { display: none !important; }
          .book-cover { transform-origin: right center !important; }
          .book-wrap { transform: scale(0.88) !important; transform-origin: top center !important; }
          .chain-left { display: none !important; }
          .bottom-charm { transform: scale(0.8) !important; transform-origin: top center !important; }
        }
      `}</style>

      <div style={{ width:'100%', minHeight:'100vh', background:'#FFF8F0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px 80px', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(139,0,0,0.06) 27px,rgba(139,0,0,0.06) 28px)' }}>

        {/* Logo */}
        <div style={{ marginBottom:'20px', textAlign:'center', transition:'opacity 0.3s', opacity: isOpen ? 0 : 1 }}>
          <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'22px', color:'#8B0000', letterSpacing:'6px', display:'block' }}>墨 书</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.45)', letterSpacing:'3px', display:'block', marginTop:'3px' }}>I N K B O O K</span>
        </div>

        {/* BOOK WRAPPER — no paddingLeft needed anymore */}
        <div className="book-wrap" style={{ position:'relative', paddingBottom:'70px' }}>

          {/* BOOK */}
          <div style={{ position:'relative', width:'340px', height:'420px', perspective:'1200px' }}>

            {/* CHAIN CONNECTOR BAR — horizontal rod linking both chain tops */}
            <div style={{
              position:'absolute',
              left:'-46px',
              top:'14px',
              width:'48px',
              height:'14px',
              zIndex:31,
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }}>
              <svg width="48" height="14" viewBox="0 0 48 14">
                {/* rod */}
                <rect x="2" y="5" width="44" height="3" rx="1.5" fill="#C4A030"/>
                {/* decorative ring in center */}
                <circle cx="24" cy="6.5" r="4" fill="none" stroke="#C4A030" strokeWidth="1.5"/>
                <circle cx="24" cy="6.5" r="1.5" fill="#D4AF37"/>
                {/* end knots */}
                <circle cx="4"  cy="6.5" r="3" fill="#D4AF37" stroke="#8B6010" strokeWidth="1"/>
                <circle cx="44" cy="6.5" r="3" fill="#D4AF37" stroke="#8B6010" strokeWidth="1"/>
                {/* short drops down to chain 1 (right side) and chain 2 (left side) */}
                <line x1="44" y1="9" x2="44" y2="14" stroke="#C4A030" strokeWidth="1.5"/>
                <line x1="22" y1="9" x2="22" y2="14" stroke="#B8952A" strokeWidth="1.5"/>
              </svg>
            </div>

            {/* SPINE CHARM CHAIN 1 — gold coin, red lantern, jade bead, key */}
            <div style={{
              position:'absolute',
              left:'-22px',
              top:'20px',
              width:'24px',
              zIndex:30,
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: isOpen ? 'none' : 'auto',
            }}>
              <svg width="24" height="420" viewBox="0 0 24 420">
                <line x1="20" y1="0" x2="20" y2="420" stroke="#C4A030" strokeWidth="1.5" strokeDasharray="4,3"/>
                {[60,120,180,240,300,360].map(y => <ellipse key={y} cx="20" cy={y} rx="5" ry="3" fill="none" stroke="#C4A030" strokeWidth="1.5"/>)}
                {/* Charm 1 — gold coin with 福 */}
                <line x1="20" y1="80" x2="10" y2="96" stroke="#C4A030" strokeWidth="1"/>
                <circle cx="10" cy="107" r="11" fill="#D4AF37" stroke="#8B6010" strokeWidth="1"/>
                <rect x="5" y="102" width="10" height="10" fill="#B8952A"/>
                <text x="10" y="111" fontFamily="serif" fontSize="9" fill="#4A2800" textAnchor="middle">福</text>
                {/* Charm 2 — red lantern */}
                <line x1="20" y1="150" x2="10" y2="164" stroke="#C4A030" strokeWidth="1"/>
                <line x1="10" y1="164" x2="10" y2="170" stroke="#8B4513" strokeWidth="2"/>
                <ellipse cx="10" cy="184" rx="8" ry="12" fill="#CC0000" stroke="#880000" strokeWidth="1"/>
                <text x="10" y="188" fontFamily="serif" fontSize="8" fill="#FFD700" textAnchor="middle">福</text>
                <line x1="7" y1="196" x2="5" y2="204" stroke="#D4AF37" strokeWidth="1"/>
                <line x1="10" y1="196" x2="10" y2="205" stroke="#CC0000" strokeWidth="1"/>
                <line x1="13" y1="196" x2="15" y2="204" stroke="#D4AF37" strokeWidth="1"/>
                {/* Charm 3 — jade bead */}
                <line x1="20" y1="220" x2="10" y2="235" stroke="#C4A030" strokeWidth="1"/>
                <ellipse cx="10" cy="245" rx="5" ry="7" fill="#2D8B50" stroke="#1A5A30" strokeWidth="1" opacity="0.9"/>
                <ellipse cx="9" cy="243" rx="2" ry="2" fill="rgba(255,255,255,0.4)"/>
                {/* Charm 4 — key */}
                <line x1="20" y1="300" x2="10" y2="316" stroke="#C4A030" strokeWidth="1"/>
                <circle cx="10" cy="324" r="5" fill="none" stroke="#C4A030" strokeWidth="1.5"/>
                <circle cx="10" cy="324" r="2" fill="#C4A030"/>
                <line x1="10" y1="329" x2="10" y2="345" stroke="#C4A030" strokeWidth="1.5"/>
                <line x1="10" y1="337" x2="14" y2="341" stroke="#C4A030" strokeWidth="1.5"/>
                <line x1="10" y1="342" x2="14" y2="346" stroke="#C4A030" strokeWidth="1.5"/>
              </svg>
            </div>

            {/* SPINE CHARM CHAIN 2 — yin-yang, star, tassel knot, red envelope */}
            <div style={{
              position:'absolute',
              left:'-44px',
              top:'28px',
              width:'24px',
              zIndex:29,
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.4s ease 0.05s',
              pointerEvents: isOpen ? 'none' : 'auto',
            }}>
              <svg width="24" height="420" viewBox="0 0 24 420">
                <line x1="20" y1="0" x2="20" y2="420" stroke="#B8952A" strokeWidth="1.5" strokeDasharray="3,4"/>
                {[70,140,200,270,330].map(y => <ellipse key={y} cx="20" cy={y} rx="5" ry="3" fill="none" stroke="#B8952A" strokeWidth="1.5"/>)}
                {/* Charm 1 — yin-yang */}
                <line x1="20" y1="90" x2="10" y2="104" stroke="#B8952A" strokeWidth="1"/>
                <circle cx="10" cy="115" r="11" fill="#F5E8C8" stroke="#8B6010" strokeWidth="1"/>
                <path d="M10,104 A11,11 0 0 0 10,126 A5.5,5.5 0 0 0 10,115 A5.5,5.5 0 0 1 10,104 Z" fill="#2A2A2A"/>
                <circle cx="10" cy="109" r="2" fill="#F5E8C8"/>
                <circle cx="10" cy="121" r="2" fill="#2A2A2A"/>
                {/* Charm 2 — gold star */}
                <line x1="20" y1="160" x2="10" y2="174" stroke="#B8952A" strokeWidth="1"/>
                <polygon
                  points="10,164 12,170 18,170 13,174 15,180 10,176 5,180 7,174 2,170 8,170"
                  fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8"
                  transform="translate(0,10)"
                />
                {/* Charm 3 — Chinese tassel knot */}
                <line x1="20" y1="220" x2="10" y2="234" stroke="#B8952A" strokeWidth="1"/>
                <circle cx="10" cy="240" r="7" fill="none" stroke="#CC0000" strokeWidth="2"/>
                <circle cx="10" cy="240" r="3" fill="#CC0000"/>
                <path d="M3,240 Q0,232 3,228 Q6,224 10,227" fill="none" stroke="#CC0000" strokeWidth="1.5"/>
                <path d="M17,240 Q20,232 17,228 Q14,224 10,227" fill="none" stroke="#CC0000" strokeWidth="1.5"/>
                <line x1="8"  y1="247" x2="6"  y2="262" stroke="#CC0000" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="10" y1="247" x2="10" y2="264" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="12" y1="247" x2="14" y2="262" stroke="#CC0000" strokeWidth="1.2" strokeLinecap="round"/>
                {/* Charm 4 — red envelope */}
                <line x1="20" y1="300" x2="10" y2="314" stroke="#B8952A" strokeWidth="1"/>
                <rect x="3" y="314" width="14" height="10" rx="1.5" fill="#CC0000" stroke="#880000" strokeWidth="1"/>
                <path d="M3,314 L10,320 L17,314" fill="none" stroke="#FFD700" strokeWidth="1"/>
                <text x="10" y="322" fontFamily="serif" fontSize="7" fill="#FFD700" textAnchor="middle" fontWeight="700">福</text>
              </svg>
            </div>

            {/* JOURNAL CLIP — top right corner, Chinese theme charms */}
            <div style={{
              position:'absolute',
              right:'-12px',
              top:'-52px',
              width:'44px',
              zIndex:35,
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }}>
              <svg width="44" height="130" viewBox="0 0 44 130">
                {/* paperclip outer loop */}
                <path
                  d="M28,4 C36,4 40,10 40,18 L40,72 C40,76 37,78 34,78 L34,30 C34,24 30,20 24,20 C18,20 14,24 14,30 L14,80 C14,86 18,90 24,90 C30,90 34,86 34,80"
                  fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round"
                />
                {/* clip shine */}
                <path
                  d="M30,4 C36,5 39,11 39,18"
                  fill="none" stroke="rgba(255,240,180,0.6)" strokeWidth="1.2" strokeLinecap="round"
                />
                {/* ring at bottom of clip */}
                <circle cx="24" cy="90" r="4" fill="none" stroke="#D4AF37" strokeWidth="2"/>
                {/* charm drop line */}
                <line x1="24" y1="94" x2="24" y2="100" stroke="#D4AF37" strokeWidth="1.5"/>
                {/* CHARM 1 — red heart with 爱 */}
                <path d="M18,102 C18,99 21,97 24,100 C27,97 30,99 30,102 C30,107 24,112 24,112 C24,112 18,107 18,102 Z" fill="#CC0000" stroke="#880000" strokeWidth="0.8"/>
                <text x="24" y="107" fontFamily="serif" fontSize="6" fill="#FFD700" textAnchor="middle" fontWeight="700">爱</text>
                {/* chain link to charm 2 */}
                <line x1="20" y1="112" x2="18" y2="118" stroke="#D4AF37" strokeWidth="1"/>
                {/* CHARM 2 — jade green gem */}
                <polygon points="18,118 14,122 18,128 22,122" fill="#2D8B50" stroke="#1A5A30" strokeWidth="0.8"/>
                <polygon points="16,121 18,119 20,121 18,124" fill="rgba(255,255,255,0.3)"/>
                {/* chain link to charm 3 */}
                <line x1="28" y1="112" x2="30" y2="118" stroke="#D4AF37" strokeWidth="1"/>
                {/* CHARM 3 — pink cherry blossom */}
                {[0,72,144,216,288].map((r,i) => (
                  <ellipse key={i} cx="30" cy="118" rx="3.5" ry="5"
                    fill={i%2===0?'#F4A7B9':'#F2C4CE'}
                    transform={`rotate(${r},30,124)`} opacity="0.95"
                  />
                ))}
                <circle cx="30" cy="124" r="2.5" fill="#FFD700"/>
              </svg>
            </div>

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
            <div className="book-inner-page" style={{ position:'absolute', left:0, top:0, width:'340px', height:'420px', background:'#F5E8C8', borderRadius:'3px 6px 6px 3px', overflow:'hidden', zIndex:2 }}>
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
                  <button onClick={e => { e.stopPropagation(); router.push(`/learn?name=${encodeURIComponent(result.chinese)}&english=${encodeURIComponent(nameInput)}`); }} style={{ background:'#D4AF37', color:'#3A2010', border:'none', padding:'8px 16px', fontFamily:"'Playfair Display',serif", fontSize:'9px', letterSpacing:'1.5px', cursor:'pointer', width:'100%', marginTop:'8px', fontWeight:700 }}>
                    🖌️ Enter the Study Hall →
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

              {/* BACK of cover — Full junk journal left page */}
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#F0E0B8,#EDD9A8,#E8D09A)', borderRadius:'3px 6px 6px 3px', backfaceVisibility:'hidden', transform:'rotateY(180deg)', overflow:'hidden' }}>
                {/* Lined paper */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(139,0,0,0.06) 19px,rgba(139,0,0,0.06) 20px)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', top:0, bottom:0, left:'28px', width:'1px', background:'rgba(196,30,30,0.18)' }}/>

                {/* BIG INK STAINS */}
                <svg style={{ position:'absolute', inset:0, pointerEvents:'none', width:'100%', height:'100%' }} viewBox="0 0 340 420" preserveAspectRatio="none">
                  <ellipse cx="60" cy="80" rx="42" ry="30" fill="rgba(10,5,0,0.08)" transform="rotate(-12,60,80)"/>
                  <ellipse cx="45" cy="65" rx="20" ry="13" fill="rgba(10,5,0,0.06)" transform="rotate(8,45,65)"/>
                  <circle cx="95" cy="58" r="7" fill="rgba(10,5,0,0.05)"/>
                  <circle cx="30" cy="98" r="5" fill="rgba(10,5,0,0.04)"/>
                  <path d="M60,108 Q59,122 61,135" fill="none" stroke="rgba(10,5,0,0.05)" strokeWidth="3.5" strokeLinecap="round"/>
                  <ellipse cx="270" cy="160" rx="32" ry="24" fill="rgba(10,5,0,0.07)" transform="rotate(18,270,160)"/>
                  <circle cx="250" cy="150" r="6" fill="rgba(10,5,0,0.05)"/>
                  <circle cx="295" cy="172" r="5" fill="rgba(10,5,0,0.04)"/>
                  <ellipse cx="155" cy="315" rx="48" ry="34" fill="rgba(10,5,0,0.07)" transform="rotate(4,155,315)"/>
                  <circle cx="190" cy="300" r="9" fill="rgba(10,5,0,0.05)"/>
                  <circle cx="125" cy="328" r="5" fill="rgba(10,5,0,0.04)"/>
                  <path d="M8,205 Q38,190 68,200 Q88,206 78,216" fill="none" stroke="rgba(10,5,0,0.09)" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M255,240 Q285,228 318,235" fill="none" stroke="rgba(10,5,0,0.08)" strokeWidth="3" strokeLinecap="round"/>
                </svg>

                {/* HANFU GIRL */}
                <svg style={{ position:'absolute', right:'-2px', bottom:'80px', pointerEvents:'none' }} width="100" height="180" viewBox="0 0 100 180">
                  <ellipse cx="50" cy="175" rx="22" ry="5" fill="rgba(0,0,0,0.1)"/>
                  <path d="M30,95 Q15,120 10,155 Q20,160 50,162 Q80,160 90,155 Q85,120 70,95Z" fill="#D4849A"/>
                  <path d="M35,95 Q22,118 18,148 Q30,155 50,156 Q70,155 82,148 Q78,118 65,95Z" fill="#E8A0B4" opacity="0.6"/>
                  <rect x="35" y="90" width="30" height="8" rx="3" fill="#8B0000"/>
                  <path d="M45,98 Q50,108 55,98" fill="none" stroke="#8B0000" strokeWidth="2"/>
                  <path d="M32,68 Q10,75 5,90 Q15,95 30,85 Q34,78 36,72Z" fill="#D4849A"/>
                  <path d="M68,68 Q90,75 95,90 Q85,95 70,85 Q66,78 64,72Z" fill="#D4849A"/>
                  <path d="M38,65 Q50,72 62,65 Q58,58 50,55 Q42,58 38,65Z" fill="#FFF8F0" stroke="#E0C8B0" strokeWidth="0.8"/>
                  <path d="M36,55 Q36,90 38,95 Q44,98 50,98 Q56,98 62,95 Q64,90 64,55Z" fill="#E8A0B4"/>
                  <rect x="45" y="45" width="10" height="12" rx="5" fill="#FDDBB4"/>
                  <ellipse cx="50" cy="36" rx="14" ry="16" fill="#FDDBB4"/>
                  <ellipse cx="44" cy="34" rx="2.5" ry="3" fill="#4A2800" opacity="0.85"/>
                  <ellipse cx="56" cy="34" rx="2.5" ry="3" fill="#4A2800" opacity="0.85"/>
                  <circle cx="44.5" cy="33" r="1" fill="white" opacity="0.6"/>
                  <circle cx="56.5" cy="33" r="1" fill="white" opacity="0.6"/>
                  <path d="M41,29 Q44,27 47,29" fill="none" stroke="#4A2800" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M53,29 Q56,27 59,29" fill="none" stroke="#4A2800" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M48,38 Q50,40 52,38" fill="none" stroke="#C4906A" strokeWidth="0.8"/>
                  <path d="M45,43 Q50,46 55,43" fill="#E87A7A" strokeWidth="0"/>
                  <path d="M46,43 Q50,41 54,43" fill="none" stroke="#C45A5A" strokeWidth="0.8"/>
                  <ellipse cx="41" cy="40" rx="4" ry="2.5" fill="#FFB0A0" opacity="0.4"/>
                  <ellipse cx="59" cy="40" rx="4" ry="2.5" fill="#FFB0A0" opacity="0.4"/>
                  <path d="M36,30 Q35,15 50,12 Q65,15 64,30 Q62,20 50,18 Q38,20 36,30Z" fill="#1A0A00"/>
                  <path d="M38,20 Q50,10 62,20 Q58,8 50,6 Q42,8 38,20Z" fill="#1A0A00"/>
                  <ellipse cx="50" cy="12" rx="10" ry="7" fill="#1A0A00"/>
                  <ellipse cx="50" cy="10" rx="7" ry="5" fill="#2A1000"/>
                  <circle cx="38" cy="14" r="4" fill="#F4A0B0"/>
                  <circle cx="36" cy="12" r="3" fill="#F4C0C8"/>
                  <circle cx="40" cy="10" r="3" fill="#F4A0B0"/>
                  <circle cx="38" cy="14" r="1.5" fill="#FFD700"/>
                  <circle cx="58" cy="10" r="2.5" fill="white" stroke="#D4AF37" strokeWidth="0.5"/>
                  <circle cx="62" cy="14" r="2" fill="white" stroke="#D4AF37" strokeWidth="0.5"/>
                  <line x1="42" y1="16" x2="36" y2="28" stroke="#D4AF37" strokeWidth="1"/>
                  <circle cx="36" cy="30" r="2.5" fill="#D4AF37"/>
                  <line x1="36" y1="32" x2="33" y2="42" stroke="#8B0000" strokeWidth="1"/>
                  <line x1="36" y1="32" x2="36" y2="43" stroke="#D4AF37" strokeWidth="1"/>
                  <line x1="36" y1="32" x2="39" y2="42" stroke="#8B0000" strokeWidth="1"/>
                </svg>

                {/* BUTTERFLIES */}
                <svg style={{ position:'absolute', top:'22px', right:'22px', pointerEvents:'none', transform:'rotate(15deg)' }} width="28" height="22" viewBox="0 0 28 22">
                  <path d="M14,11 Q4,2 2,8 Q0,14 14,11Z" fill="#F4A7B9" stroke="#D4849A" strokeWidth="0.8" opacity="0.85"/>
                  <path d="M14,11 Q24,2 26,8 Q28,14 14,11Z" fill="#F4C0C8" stroke="#D4849A" strokeWidth="0.8" opacity="0.85"/>
                  <path d="M14,11 Q5,16 4,20 Q8,22 14,11Z" fill="#D4849A" stroke="#B8607A" strokeWidth="0.8"/>
                  <path d="M14,11 Q23,16 24,20 Q20,22 14,11Z" fill="#D4849A" stroke="#B8607A" strokeWidth="0.8"/>
                  <line x1="14" y1="9" x2="11" y2="5" stroke="#5A2A2A" strokeWidth="0.8"/>
                  <line x1="14" y1="9" x2="17" y2="5" stroke="#5A2A2A" strokeWidth="0.8"/>
                </svg>
                <svg style={{ position:'absolute', top:'175px', left:'32px', pointerEvents:'none', transform:'rotate(-10deg)' }} width="24" height="18" viewBox="0 0 24 18">
                  <path d="M12,9 Q3,1 1,6 Q0,12 12,9Z" fill="#D4AF37" stroke="#B8952A" strokeWidth="0.8" opacity="0.8"/>
                  <path d="M12,9 Q21,1 23,6 Q24,12 12,9Z" fill="#E8C840" stroke="#B8952A" strokeWidth="0.8" opacity="0.8"/>
                  <path d="M12,9 Q4,13 3,17 Q7,18 12,9Z" fill="#C4A030" stroke="#B8952A" strokeWidth="0.7"/>
                  <path d="M12,9 Q20,13 21,17 Q17,18 12,9Z" fill="#C4A030" stroke="#B8952A" strokeWidth="0.7"/>
                  <line x1="12" y1="7" x2="10" y2="3" stroke="#5A3A00" strokeWidth="0.7"/>
                  <line x1="12" y1="7" x2="14" y2="3" stroke="#5A3A00" strokeWidth="0.7"/>
                </svg>
                <svg style={{ position:'absolute', bottom:'185px', right:'88px', pointerEvents:'none', transform:'rotate(20deg)' }} width="20" height="16" viewBox="0 0 20 16">
                  <path d="M10,8 Q2,1 1,5 Q0,10 10,8Z" fill="#C8A0D4" stroke="#9A70B0" strokeWidth="0.7" opacity="0.8"/>
                  <path d="M10,8 Q18,1 19,5 Q20,10 10,8Z" fill="#D4B0E0" stroke="#9A70B0" strokeWidth="0.7" opacity="0.8"/>
                  <path d="M10,8 Q3,11 3,15 Q6,16 10,8Z" fill="#9A70B0" stroke="#7A50A0" strokeWidth="0.6"/>
                  <path d="M10,8 Q17,11 17,15 Q14,16 10,8Z" fill="#9A70B0" stroke="#7A50A0" strokeWidth="0.6"/>
                  <line x1="10" y1="6" x2="8" y2="2" stroke="#3A1A4A" strokeWidth="0.6"/>
                  <line x1="10" y1="6" x2="12" y2="2" stroke="#3A1A4A" strokeWidth="0.6"/>
                </svg>

                {/* WAX SEAL */}
                <svg style={{ position:'absolute', top:'10px', left:'34px', pointerEvents:'none' }} width="44" height="44" viewBox="0 0 44 44" opacity="0.88">
                  <path d="M22,2 C28,0 37,4 41,11 C45,18 44,30 40,36 C36,42 27,46 19,44 C10,42 3,34 1,24 C-1,14 3,5 9,2 C13,0 16,4 22,2Z" fill="#8B0000"/>
                  <circle cx="21" cy="22" r="14" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="1.2"/>
                  <text x="21" y="27" fontFamily="serif" fontSize="14" fill="#D4AF37" textAnchor="middle" fontWeight="700">福</text>
                </svg>

                {/* STICKY NOTE 1 — 你好 */}
                <div style={{ position:'absolute', top:'62px', left:'32px', transform:'rotate(-3deg)' }}>
                  <div style={{ position:'absolute', top:'-7px', left:'8px', width:'44px', height:'9px', background:'repeating-linear-gradient(90deg,rgba(212,175,55,0.6) 0px,rgba(212,175,55,0.6) 8px,rgba(180,140,20,0.45) 8px,rgba(180,140,20,0.45) 16px)', borderRadius:'1px', zIndex:2 }}/>
                  <div style={{ background:'#FEFBD0', padding:'9px 11px 11px', boxShadow:'2px 3px 6px rgba(0,0,0,0.2)', minWidth:'72px' }}>
                    <p style={{ fontFamily:"serif", fontSize:'16px', color:'#3A2A1A', margin:0, lineHeight:1.3, textAlign:'center' }}>你好！</p>
                    <p style={{ fontFamily:"serif", fontSize:'8px', color:'rgba(90,58,26,0.6)', margin:'3px 0 0', textAlign:'center', fontStyle:'italic' }}>Hello!</p>
                  </div>
                </div>

                {/* STICKY NOTE 2 — 加油 */}
                <div style={{ position:'absolute', top:'148px', right:'106px', transform:'rotate(4deg)' }}>
                  <div style={{ position:'absolute', top:'-7px', left:'8px', width:'38px', height:'9px', background:'repeating-linear-gradient(90deg,rgba(196,30,30,0.5) 0px,rgba(196,30,30,0.5) 7px,rgba(160,0,0,0.35) 7px,rgba(160,0,0,0.35) 14px)', borderRadius:'1px', zIndex:2 }}/>
                  <div style={{ background:'#FFD6D6', padding:'9px 11px 11px', boxShadow:'2px 3px 6px rgba(0,0,0,0.2)', minWidth:'68px' }}>
                    <p style={{ fontFamily:"serif", fontSize:'16px', color:'#8B0000', margin:0, lineHeight:1.3, textAlign:'center' }}>加油！</p>
                    <p style={{ fontFamily:"serif", fontSize:'8px', color:'rgba(139,0,0,0.6)', margin:'3px 0 0', textAlign:'center', fontStyle:'italic' }}>Keep going!</p>
                  </div>
                </div>

                {/* STICKY NOTE 3 — 美丽 */}
                <div style={{ position:'absolute', top:'230px', left:'32px', transform:'rotate(2deg)' }}>
                  <div style={{ position:'absolute', top:'-7px', left:'10px', width:'36px', height:'9px', background:'repeating-linear-gradient(90deg,rgba(61,107,79,0.55) 0px,rgba(61,107,79,0.55) 7px,rgba(45,80,58,0.4) 7px,rgba(45,80,58,0.4) 14px)', borderRadius:'1px', zIndex:2 }}/>
                  <div style={{ background:'#D4EDD8', padding:'9px 11px 11px', boxShadow:'2px 3px 6px rgba(0,0,0,0.2)', minWidth:'66px' }}>
                    <p style={{ fontFamily:"serif", fontSize:'16px', color:'#2D5A3A', margin:0, lineHeight:1.3, textAlign:'center' }}>美丽</p>
                    <p style={{ fontFamily:"serif", fontSize:'8px', color:'rgba(45,90,58,0.6)', margin:'3px 0 0', textAlign:'center', fontStyle:'italic' }}>Beautiful</p>
                  </div>
                </div>

                {/* STICKY NOTE 4 — 谢谢 torn */}
                <div style={{ position:'absolute', top:'82px', left:'148px', transform:'rotate(-5deg)' }}>
                  <div style={{ position:'absolute', top:'-7px', left:'6px', width:'42px', height:'9px', background:'repeating-linear-gradient(90deg,rgba(107,91,138,0.5) 0px,rgba(107,91,138,0.5) 7px,rgba(80,65,110,0.35) 7px,rgba(80,65,110,0.35) 14px)', borderRadius:'1px', zIndex:2 }}/>
                  <div style={{ background:'#E8E0F4', padding:'9px 11px 0px', boxShadow:'2px 3px 6px rgba(0,0,0,0.2)', minWidth:'66px' }}>
                    <p style={{ fontFamily:"serif", fontSize:'16px', color:'#4A3A6A', margin:0, lineHeight:1.3, textAlign:'center' }}>谢谢</p>
                    <p style={{ fontFamily:"serif", fontSize:'8px', color:'rgba(74,58,106,0.6)', margin:'3px 0 6px', textAlign:'center', fontStyle:'italic' }}>Thank you</p>
                    <div style={{ height:'8px', background:'linear-gradient(180deg,#E8E0F4,transparent)', clipPath:'polygon(0% 0%,5% 100%,10% 30%,15% 100%,20% 20%,25% 100%,30% 40%,35% 100%,40% 10%,45% 100%,50% 30%,55% 100%,60% 20%,65% 100%,70% 50%,75% 100%,80% 30%,85% 100%,90% 20%,95% 100%,100% 0%)' }}/>
                  </div>
                </div>

                {/* STICKY NOTE 5 — 好运 */}
                <div style={{ position:'absolute', top:'310px', left:'38px', transform:'rotate(-4deg)' }}>
                  <div style={{ position:'absolute', top:'-7px', left:'8px', width:'40px', height:'9px', background:'repeating-linear-gradient(90deg,rgba(212,175,55,0.55) 0px,rgba(212,175,55,0.55) 8px,rgba(180,140,20,0.4) 8px,rgba(180,140,20,0.4) 16px)', borderRadius:'1px', zIndex:2 }}/>
                  <div style={{ background:'#FFF5CC', padding:'9px 11px 11px', boxShadow:'2px 3px 6px rgba(0,0,0,0.2)', minWidth:'66px' }}>
                    <p style={{ fontFamily:"serif", fontSize:'16px', color:'#8A6A00', margin:0, lineHeight:1.3, textAlign:'center' }}>好运</p>
                    <p style={{ fontFamily:"serif", fontSize:'8px', color:'rgba(138,106,0,0.6)', margin:'3px 0 0', textAlign:'center', fontStyle:'italic' }}>Good luck!</p>
                  </div>
                </div>

                {/* 墨书 TAG */}
                <div style={{ position:'absolute', top:'168px', left:'50px', transform:'rotate(-8deg)' }}>
                  <svg width="6" height="16" viewBox="0 0 6 16" style={{ display:'block', margin:'0 auto' }}>
                    <line x1="3" y1="0" x2="3" y2="16" stroke="#8B4513" strokeWidth="1" strokeDasharray="2,2"/>
                  </svg>
                  <div style={{ background:'#FFF8F0', border:'1.5px solid rgba(139,0,0,0.35)', padding:'4px 9px', borderRadius:'3px', boxShadow:'1px 2px 4px rgba(0,0,0,0.15)', textAlign:'center' }}>
                    <p style={{ fontFamily:"serif", fontSize:'12px', color:'#8B0000', margin:0, letterSpacing:'2px' }}>墨书</p>
                    <p style={{ fontFamily:"serif", fontSize:'6px', color:'rgba(139,0,0,0.5)', margin:'1px 0 0', letterSpacing:'1px' }}>INKBOOK</p>
                  </div>
                </div>

                {/* PRACTICE TICKET */}
                <div style={{ position:'absolute', top:'275px', left:'130px', transform:'rotate(3deg)' }}>
                  <div style={{ background:'#FFF8F0', border:'1px dashed rgba(139,0,0,0.3)', padding:'5px 8px', boxShadow:'1px 2px 4px rgba(0,0,0,0.12)' }}>
                    <p style={{ fontFamily:"serif", fontSize:'6px', color:'rgba(139,0,0,0.5)', margin:'0 0 3px', letterSpacing:'1px', textTransform:'uppercase' }}>Practice</p>
                    <p style={{ fontFamily:"serif", fontSize:'14px', color:'#3A2A1A', margin:0, letterSpacing:'4px' }}>一二三四五</p>
                  </div>
                </div>

                {/* PAPER CLIP */}
                <svg style={{ position:'absolute', top:'72px', left:'200px', pointerEvents:'none', transform:'rotate(-5deg)' }} width="16" height="30" viewBox="0 0 16 30">
                  <path d="M8,2 C12,2 14,5 14,9 L14,22 C14,26 11,28 8,28 C5,28 2,26 2,22 L2,7 C2,4 4,2 7,2 C10,2 12,4 12,7 L12,22 C12,24 10,25 8,25 C6,25 4,24 4,22 L4,9" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
                </svg>

                {/* GOLD STARS */}
                {[[148,52],[200,142],[88,350],[250,308],[170,392]].map(([x,y],i) => (
                  <svg key={i} style={{ position:'absolute', left:`${x}px`, top:`${y}px`, pointerEvents:'none' }} width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,10.5 6,8.5 2.5,10.5 3.5,7 1,4.5 4.5,4.5" fill="#D4AF37" opacity="0.7"/>
                  </svg>
                ))}

                {/* WASHI TAPE STRIP */}
                <div style={{ position:'absolute', top:'210px', left:0, right:0, height:'14px', background:'repeating-linear-gradient(90deg,rgba(139,0,0,0.15) 0px,rgba(139,0,0,0.15) 2px,transparent 2px,transparent 8px)', transform:'rotate(-0.5deg)' }}/>
                <div style={{ position:'absolute', top:'212px', left:0, right:0, height:'10px', background:'rgba(212,175,55,0.12)', transform:'rotate(-0.5deg)' }}/>

                {/* LANTERN POLAROID */}
                <div style={{ position:'absolute', bottom:'18px', left:'50%', transform:'translateX(-50%) rotate(2deg)', background:'#FFF8F0', padding:'5px 5px 20px 5px', boxShadow:'2px 4px 10px rgba(0,0,0,0.25)', width:'104px', zIndex:3 }}>
                  <div style={{ position:'absolute', top:'-6px', left:'26px', width:'46px', height:'9px', background:'repeating-linear-gradient(90deg,rgba(27,75,122,0.5) 0px,rgba(27,75,122,0.5) 8px,rgba(20,55,100,0.35) 8px,rgba(20,55,100,0.35) 16px)', borderRadius:'1px' }}/>
                  <div style={{ width:'94px', height:'70px', overflow:'hidden' }}>
                    <svg width="94" height="70" viewBox="0 0 94 70">
                      <rect x="0" y="0" width="94" height="70" fill="#1A0A2A"/>
                      {[[18,22,'#CC0000'],[47,16,'#D4AF37'],[76,24,'#CC0000'],[32,44,'#D4849A'],[63,40,'#CC0000']].map(([x,y,c],i) => (
                        <g key={i}>
                          <line x1={x as number} y1={0} x2={x as number} y2={(y as number)-8} stroke="#C4A030" strokeWidth="0.8"/>
                          <ellipse cx={x as number} cy={(y as number)+10} rx="9" ry="13" fill={c as string} opacity="0.9"/>
                          <ellipse cx={x as number} cy={(y as number)+2} rx="5" ry="3.5" fill="rgba(255,220,0,0.35)"/>
                          <line x1={(x as number)-4} y1={(y as number)+23} x2={(x as number)-3} y2={(y as number)+32} stroke={c as string} strokeWidth="1"/>
                          <line x1={x as number} y1={(y as number)+23} x2={x as number} y2={(y as number)+33} stroke="#D4AF37" strokeWidth="1"/>
                          <line x1={(x as number)+4} y1={(y as number)+23} x2={(x as number)+3} y2={(y as number)+32} stroke={c as string} strokeWidth="1"/>
                        </g>
                      ))}
                      {[[8,5],[24,3],[52,7],[72,4],[88,11],[3,16],[44,2]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r="1" fill="white" opacity="0.7"/>
                      ))}
                    </svg>
                  </div>
                  <p style={{ fontFamily:"serif", fontSize:'7px', color:'#5A3A1A', textAlign:'center', margin:'4px 0 0', letterSpacing:'1px' }}>灯节</p>
                </div>

              </div>

            </div>{/* end cover */}

            {/* BOTTOM CHARM CHAIN */}
            <div style={{ position:'absolute', bottom:'-65px', left:'10px', right:'10px', zIndex:30 }}>
              <svg width="300" height="70" viewBox="0 0 300 70">
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

          </div>{/* end book div */}
        </div>{/* end book wrapper */}

        <p style={{ marginTop:'70px', fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.45)', fontStyle:'italic', letterSpacing:'1px', textAlign:'center' }}>
          {isOpen ? 'tap to close · begin your journey' : 'tap to open · tap again to close'}
        </p>

      </div>
    </>
  );
}
