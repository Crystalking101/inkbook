// app/dynasty/page.tsx - Dynasty Selector Screen v4 - 5 dynasties
'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const dynasties = [
  {
    id: 'tang',
    name: 'Tang Dynasty',
    chinese: '唐朝',
    tone: 'Tone 1',
    toneChar: 'mā',
    toneDesc: 'High and level',
    description: 'Calm and steady, like a court lady reading poetry at dawn.',
    bg: '#E8E4B8',
    text: '#5A3A1A',
    period: '618–907 AD',
  },
  {
    id: 'han',
    name: 'Han Dynasty',
    chinese: '汉朝',
    tone: 'Tone 2',
    toneChar: 'má',
    toneDesc: 'Rising sharply',
    description: 'Rising with power, like an empress defending her throne.',
    bg: '#D4A832',
    text: '#3A1A00',
    period: '206 BC–220 AD',
  },
  {
    id: 'ming',
    name: 'Ming Dynasty',
    chinese: '明朝',
    tone: 'Tone 3',
    toneChar: 'mǎ',
    toneDesc: 'Dipping then rising',
    description: 'Dipping then rising, like a secret whispered by candlelight.',
    bg: '#E8654A',
    text: '#FFF8F0',
    period: '1368–1644 AD',
  },
  {
    id: 'qing',
    name: 'Qing Dynasty',
    chinese: '清朝',
    tone: 'Tone 4',
    toneChar: 'mà',
    toneDesc: 'Falling sharply',
    description: 'Falling with authority, like a royal decree from the empress.',
    bg: '#C41E1E',
    text: '#FFF8F0',
    period: '1644–1912 AD',
  },
  {
    id: 'song',
    name: 'Song Dynasty',
    chinese: '宋朝',
    tone: 'Tone 5',
    toneChar: 'ma',
    toneDesc: 'Neutral & light',
    description: 'Soft and unstressed, like a whisper between old friends.',
    bg: '#D4849A',
    text: '#FFF8F0',
    period: '960–1279 AD',
  },
];

function DynastyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chineseName = searchParams.get('name') || '美丽';
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function selectDynasty(id: string) {
    setSelected(id);
    setTimeout(() => { router.push(`/tones?dynasty=${id}&name=${encodeURIComponent(chineseName)}`); }, 600);
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Playfair Display',serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .c1 { animation: fadeUp 0.5s ease 0.1s forwards; opacity:0; }
        .c2 { animation: fadeUp 0.5s ease 0.2s forwards; opacity:0; }
        .c3 { animation: fadeUp 0.5s ease 0.3s forwards; opacity:0; }
        .c4 { animation: fadeUp 0.5s ease 0.4s forwards; opacity:0; }
        .c5 { animation: fadeUp 0.5s ease 0.5s forwards; opacity:0; }
      `}</style>

      <div style={{ width:'100%', minHeight:'100vh', background:'#F5E8C8', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(139,0,0,0.06) 27px,rgba(139,0,0,0.06) 28px)', display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 20px 80px', position:'relative', overflow:'hidden' }}>

        {/* TOP LEFT corner doodles — bamboo */}
        <svg style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }} width="180" height="180" viewBox="0 0 180 180">
          <line x1="20" y1="0" x2="20" y2="120" stroke="rgba(139,90,30,0.12)" strokeWidth="4" strokeLinecap="round"/>
          <line x1="20" y1="30" x2="20" y2="31" stroke="rgba(139,90,30,0.2)" strokeWidth="5"/>
          <line x1="20" y1="65" x2="20" y2="66" stroke="rgba(139,90,30,0.2)" strokeWidth="5"/>
          <line x1="20" y1="95" x2="20" y2="96" stroke="rgba(139,90,30,0.2)" strokeWidth="5"/>
          <line x1="38" y1="0" x2="38" y2="90" stroke="rgba(139,90,30,0.08)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="38" y1="28" x2="38" y2="29" stroke="rgba(139,90,30,0.15)" strokeWidth="4"/>
          <line x1="38" y1="60" x2="38" y2="61" stroke="rgba(139,90,30,0.15)" strokeWidth="4"/>
          <path d="M20,30 C32,20 52,18 56,25" fill="none" stroke="rgba(45,128,22,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M20,65 C36,55 54,54 58,62" fill="none" stroke="rgba(45,128,22,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M38,28 C50,18 66,16 68,24" fill="none" stroke="rgba(45,128,22,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="82" cy="32" r="5" fill="rgba(196,30,30,0.09)"/>
          <circle cx="74" cy="26" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="90" cy="26" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="74" cy="38" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="90" cy="38" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="82" cy="32" r="2" fill="rgba(212,175,55,0.15)"/>
          <path d="M58,80 C72,62 92,46 112,42" fill="none" stroke="rgba(139,90,30,0.1)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="112" cy="42" r="4" fill="rgba(196,30,30,0.08)"/>
          <circle cx="106" cy="37" r="3" fill="rgba(196,30,30,0.08)"/>
          <circle cx="118" cy="37" r="3" fill="rgba(196,30,30,0.08)"/>
          <circle cx="106" cy="47" r="3" fill="rgba(196,30,30,0.08)"/>
          <circle cx="118" cy="47" r="3" fill="rgba(196,30,30,0.08)"/>
        </svg>

        {/* TOP RIGHT — wax seal watermark + blossoms */}
        <svg style={{ position:'absolute', top:0, right:0, pointerEvents:'none' }} width="180" height="180" viewBox="0 0 180 180">
          <circle cx="140" cy="40" r="32" fill="none" stroke="rgba(139,0,0,0.055)" strokeWidth="2"/>
          <circle cx="140" cy="40" r="26" fill="none" stroke="rgba(139,0,0,0.055)" strokeWidth="1"/>
          <text x="140" y="48" fontFamily="serif" fontSize="22" fill="rgba(139,0,0,0.065)" textAnchor="middle" fontWeight="700">福</text>
          <circle cx="58" cy="26" r="5" fill="rgba(196,30,30,0.09)"/>
          <circle cx="50" cy="20" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="66" cy="20" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="50" cy="32" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="66" cy="32" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="58" cy="26" r="2" fill="rgba(212,175,55,0.12)"/>
          <path d="M28,62 C50,42 76,30 96,24" fill="none" stroke="rgba(139,90,30,0.09)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        {/* BOTTOM LEFT blossoms */}
        <svg style={{ position:'absolute', bottom:0, left:0, pointerEvents:'none' }} width="160" height="160" viewBox="0 0 160 160">
          <path d="M10,160 C30,130 22,100 42,80 C58,64 72,70 88,54" fill="none" stroke="rgba(139,90,30,0.1)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="88" cy="54" r="5" fill="rgba(196,30,30,0.1)"/>
          <circle cx="80" cy="48" r="4" fill="rgba(196,30,30,0.1)"/>
          <circle cx="96" cy="48" r="4" fill="rgba(196,30,30,0.1)"/>
          <circle cx="80" cy="60" r="4" fill="rgba(196,30,30,0.1)"/>
          <circle cx="96" cy="60" r="4" fill="rgba(196,30,30,0.1)"/>
          <circle cx="88" cy="54" r="2" fill="rgba(212,175,55,0.15)"/>
          <circle cx="48" cy="112" r="4" fill="rgba(196,30,30,0.08)"/>
          <circle cx="42" cy="107" r="3" fill="rgba(196,30,30,0.08)"/>
          <circle cx="54" cy="107" r="3" fill="rgba(196,30,30,0.08)"/>
          <circle cx="42" cy="117" r="3" fill="rgba(196,30,30,0.08)"/>
          <circle cx="54" cy="117" r="3" fill="rgba(196,30,30,0.08)"/>
        </svg>

        {/* BOTTOM RIGHT — bamboo */}
        <svg style={{ position:'absolute', bottom:0, right:0, pointerEvents:'none' }} width="160" height="160" viewBox="0 0 160 160">
          <line x1="140" y1="160" x2="140" y2="55" stroke="rgba(139,90,30,0.1)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="140" y1="95" x2="140" y2="96" stroke="rgba(139,90,30,0.18)" strokeWidth="4"/>
          <line x1="140" y1="128" x2="140" y2="129" stroke="rgba(139,90,30,0.18)" strokeWidth="4"/>
          <line x1="124" y1="160" x2="124" y2="78" stroke="rgba(139,90,30,0.07)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M140,95 C126,84 110,82 106,90" fill="none" stroke="rgba(45,128,22,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M140,128 C126,118 110,116 106,124" fill="none" stroke="rgba(45,128,22,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="94" cy="78" r="4" fill="rgba(196,30,30,0.09)"/>
          <circle cx="88" cy="73" r="3" fill="rgba(196,30,30,0.09)"/>
          <circle cx="100" cy="73" r="3" fill="rgba(196,30,30,0.09)"/>
          <circle cx="88" cy="83" r="3" fill="rgba(196,30,30,0.09)"/>
          <circle cx="100" cy="83" r="3" fill="rgba(196,30,30,0.09)"/>
        </svg>

        {/* CENTER WATERMARK */}
        <svg style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', opacity:0.032 }} width="300" height="300" viewBox="0 0 300 300">
          <text x="150" y="170" fontFamily="serif" fontSize="180" fill="#8B0000" textAnchor="middle" fontWeight="700">墨</text>
        </svg>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'28px', position:'relative', zIndex:2 }}>
          <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'13px', color:'rgba(139,0,0,0.5)', letterSpacing:'4px', display:'block', marginBottom:'10px' }}>欢迎，{chineseName}</span>
          <div style={{ display:'flex', gap:'4px', alignItems:'center', justifyContent:'center', flexWrap:'wrap', marginBottom:'5px' }}>
            {[{ch:'C',bg:'#F2C4CE'},{ch:'H',bg:'#FAD4A6'},{ch:'O',bg:'#F4A7B9'},{ch:'O',bg:'#F2C4CE'},{ch:'S',bg:'#FAD4A6'},{ch:'E',bg:'#F4A7B9'}].map(({ch,bg},i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'20px', padding:'2px 6px', background:bg, borderRadius:'2px', boxShadow:'1px 1px 3px rgba(0,0,0,0.15)', color:'#1A1A1A', transform:i%2===0?'rotate(-2deg)':'rotate(1.5deg)' }}>{ch}</span>
            ))}
          </div>
          <div style={{ display:'flex', gap:'4px', alignItems:'center', justifyContent:'center', flexWrap:'wrap', marginBottom:'14px' }}>
            {[{ch:'Y',bg:'#CC0000',c:'#FAD4A6'},{ch:'O',bg:'#D4AF37',c:'#1A1A1A'},{ch:'U',bg:'#2D5016',c:'#FAD4A6'},{ch:'R',bg:'#F2C4CE',c:'#1A1A1A'},{ch:'D',bg:'#FAD4A6',c:'#1A1A1A'},{ch:'Y',bg:'#F4A7B9',c:'#1A1A1A'},{ch:'N',bg:'#CC0000',c:'#FAD4A6'},{ch:'A',bg:'#D4AF37',c:'#1A1A1A'},{ch:'S',bg:'#1B4B7A',c:'#FAD4A6'},{ch:'T',bg:'#F2C4CE',c:'#1A1A1A'},{ch:'Y',bg:'#2D5016',c:'#FAD4A6'}].map(({ch,bg,c},i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'20px', padding:'2px 6px', background:bg, borderRadius:'2px', boxShadow:'1px 1px 3px rgba(0,0,0,0.15)', color:c, transform:i%2===0?'rotate(-1.5deg)':'rotate(2deg)' }}>{ch}</span>
            ))}
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'12px', color:'rgba(90,58,26,0.6)', fontStyle:'italic', lineHeight:1.6 }}>Each dynasty unlocks a different tone.<br/>Your journey begins with your choice.</p>
        </div>

        {/* Dynasty Cards — 2x2 grid + 1 centered */}
        <div style={{ width:'100%', maxWidth:'480px', position:'relative', zIndex:2 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px', marginBottom:'16px' }}>
            {dynasties.slice(0,4).map((d, i) => (
              <div key={d.id} className={`c${i+1}`} onClick={() => selectDynasty(d.id)} onMouseEnter={() => setHoveredId(d.id)} onMouseLeave={() => setHoveredId(null)}
                style={{ background:d.bg, borderRadius:'8px', padding:'20px 16px', cursor:'pointer', transition:'transform 0.2s ease, box-shadow 0.2s ease', transform:selected===d.id?'scale(1.05)':hoveredId===d.id?'scale(1.02)':'scale(1)', boxShadow:selected===d.id?'0 8px 30px rgba(0,0,0,0.25)':hoveredId===d.id?'0 6px 20px rgba(0,0,0,0.15)':'0 3px 12px rgba(0,0,0,0.12)', position:'relative', overflow:'hidden', border:selected===d.id?'2px solid rgba(0,0,0,0.2)':'2px solid rgba(255,255,255,0.3)' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.04) 10px,rgba(255,255,255,0.04) 11px)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.3)', borderRadius:'20px', padding:'3px 10px' }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'#FFF8F0', letterSpacing:'1px', fontWeight:700 }}>{d.tone}</span>
                </div>
                <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'30px', color:d.text, marginBottom:'4px', fontWeight:700, lineHeight:1 }}>{d.chinese}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'13px', color:d.text, fontWeight:700, marginBottom:'2px' }}>{d.name}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'9px', color:d.text, opacity:0.65, marginBottom:'10px' }}>{d.period}</div>
                <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:'4px', padding:'5px 10px', marginBottom:'6px', display:'inline-block' }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'18px', color:d.text, letterSpacing:'2px', fontWeight:700 }}>{d.toneChar}</span>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'9px', color:d.text, opacity:0.7, marginBottom:'8px', fontStyle:'italic' }}>{d.toneDesc}</div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:d.text, fontStyle:'italic', lineHeight:1.6, marginBottom:'12px', opacity:0.9 }}>{d.description}</p>
                <div style={{ background:'#D4AF37', padding:'8px 14px', borderRadius:'3px', fontFamily:"'Playfair Display',serif", fontSize:'9px', letterSpacing:'1.5px', textAlign:'center', color:'#3A2010', fontWeight:700 }}>
                  {selected===d.id?'✦ ENTERING DYNASTY... ✦':'SELECT THIS DYNASTY'}
                </div>
              </div>
            ))}
          </div>

          {/* Song Dynasty — centered 5th card */}
          <div style={{ display:'flex', justifyContent:'center' }}>
            <div className="c5" onClick={() => selectDynasty('song')} onMouseEnter={() => setHoveredId('song')} onMouseLeave={() => setHoveredId(null)}
              style={{ background:'#D4849A', borderRadius:'8px', padding:'20px 16px', cursor:'pointer', transition:'transform 0.2s ease, box-shadow 0.2s ease', transform:selected==='song'?'scale(1.05)':hoveredId==='song'?'scale(1.02)':'scale(1)', boxShadow:selected==='song'?'0 8px 30px rgba(0,0,0,0.25)':hoveredId==='song'?'0 6px 20px rgba(0,0,0,0.15)':'0 3px 12px rgba(0,0,0,0.12)', position:'relative', overflow:'hidden', border:selected==='song'?'2px solid rgba(0,0,0,0.2)':'2px solid rgba(255,255,255,0.3)', width:'100%', maxWidth:'232px' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.04) 10px,rgba(255,255,255,0.04) 11px)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.3)', borderRadius:'20px', padding:'3px 10px' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'#FFF8F0', letterSpacing:'1px', fontWeight:700 }}>Tone 5</span>
              </div>
              <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'30px', color:'#FFF8F0', marginBottom:'4px', fontWeight:700, lineHeight:1 }}>宋朝</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'13px', color:'#FFF8F0', fontWeight:700, marginBottom:'2px' }}>Song Dynasty</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'9px', color:'#FFF8F0', opacity:0.65, marginBottom:'10px' }}>960–1279 AD</div>
              <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:'4px', padding:'5px 10px', marginBottom:'6px', display:'inline-block' }}>
                <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'18px', color:'#FFF8F0', letterSpacing:'2px', fontWeight:700 }}>ma</span>
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'9px', color:'#FFF8F0', opacity:0.7, marginBottom:'8px', fontStyle:'italic' }}>Neutral &amp; light</div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'#FFF8F0', fontStyle:'italic', lineHeight:1.6, marginBottom:'12px', opacity:0.9 }}>Soft and unstressed, like a whisper between old friends.</p>
              <div style={{ background:'#D4AF37', padding:'8px 14px', borderRadius:'3px', fontFamily:"'Playfair Display',serif", fontSize:'9px', letterSpacing:'1.5px', textAlign:'center', color:'#3A2010', fontWeight:700 }}>
                {selected==='song'?'✦ ENTERING DYNASTY... ✦':'SELECT THIS DYNASTY'}
              </div>
            </div>
          </div>
        </div>

        <p style={{ marginTop:'28px', fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.4)', fontStyle:'italic', letterSpacing:'1px', textAlign:'center', position:'relative', zIndex:2 }}>
          Your dynasty shapes your learning journey
        </p>
        <button onClick={() => router.back()} style={{ marginTop:'12px', background:'transparent', border:'none', fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'rgba(139,0,0,0.4)', cursor:'pointer', fontStyle:'italic', letterSpacing:'1px', position:'relative', zIndex:2 }}>
          ← back to your name
        </button>

      </div>
    </>
  );
}

export default function DynastyPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#F5E8C8',fontFamily:'serif',color:'#8B0000',fontSize:'14px',letterSpacing:'2px'}}>Loading...</div>}>
      <DynastyContent />
    </Suspense>
  );
}
