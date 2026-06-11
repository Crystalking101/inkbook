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
    deepColor: '#8A7B2D',
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
    bg: '#7BA888',
    text: '#FFF8F0',
    deepColor: '#3D6B4F',
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
    deepColor: '#9E3520',
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
    deepColor: '#8B0000',
    period: '1644–1912 AD',
  },
  {
    id: 'song',
    name: 'Song Dynasty',
    chinese: '宋朝',
    tone: 'Tone 5',
    toneChar: 'ma',
    toneDesc: 'Neutral and light',
    description: 'Soft and unstressed, like a whisper between old friends.',
    bg: '#D4849A',
    text: '#FFF8F0',
    deepColor: '#9C4660',
    period: '960–1279 AD',
  },
];

// Ransom letters — bigger, using dynasty palette
const RANSOM = [
  { bg:'#8B0000', c:'#FFF8F0', r:'-3deg' },
  { bg:'#E8E4B8', c:'#5A3A1A', r:'2deg' },
  { bg:'#7BA888', c:'#FFF8F0', r:'-2deg' },
  { bg:'#FFF8F0', c:'#8B0000', r:'3deg' },
  { bg:'#C41E1E', c:'#FFF8F0', r:'-1deg' },
  { bg:'#D4849A', c:'#FFF8F0', r:'2deg' },
  { bg:'#E8654A', c:'#FFF8F0', r:'-3deg' },
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

      <div style={{
        width:'100%', minHeight:'100vh',
        background:'#FFF8F0',
        backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(139,0,0,0.06) 27px,rgba(139,0,0,0.06) 28px)',
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'40px 20px 80px', position:'relative', overflow:'hidden'
      }}>

        {/* TOP LEFT — crown + hairpin doodle */}
        <svg style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }} width="160" height="200" viewBox="0 0 160 200" opacity="0.45">
          <path d="M15,75 L15,50 L32,62 L45,38 L58,62 L72,38 L85,62 L98,50 L98,75 Z" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeLinejoin="round"/>
          <line x1="15" y1="75" x2="98" y2="75" stroke="#8B0000" strokeWidth="1.5"/>
          <circle cx="45" cy="38" r="4" fill="#8B0000"/>
          <circle cx="72" cy="38" r="4" fill="#8B0000"/>
          <circle cx="15" cy="50" r="3" fill="#D4849A"/>
          <circle cx="98" cy="50" r="3" fill="#D4849A"/>
          <ellipse cx="56" cy="70" rx="8" ry="5" fill="#E8E4B8" stroke="#8B0000" strokeWidth="1"/>
          <line x1="25" y1="100" x2="75" y2="160" stroke="#8B0000" strokeWidth="1.5" strokeLinecap="round"/>
          {[0,60,120,180,240,300].map((r,i) => (
            <ellipse key={i} cx="25" cy="90" rx="4" ry="6" fill={i%2===0?'#D4849A':'#8B0000'} transform={`rotate(${r},25,100)`} opacity="0.7"/>
          ))}
          <path d="M110,110 Q98,93 104,86 Q116,80 122,92 Q116,98 110,110Z" fill="#E8E4B8" stroke="#8B0000" strokeWidth="1" opacity="0.7"/>
          <path d="M110,110 Q122,93 116,86 Q104,80 98,92 Q104,98 110,110Z" fill="#E8E4B8" stroke="#8B0000" strokeWidth="1" opacity="0.7"/>
          <line x1="110" y1="108" x2="107" y2="128" stroke="#8B0000" strokeWidth="0.8"/>
          <line x1="110" y1="108" x2="113" y2="128" stroke="#8B0000" strokeWidth="0.8"/>
        </svg>

        {/* TOP RIGHT — jade bangle + pearls */}
        <svg style={{ position:'absolute', top:0, right:0, pointerEvents:'none' }} width="160" height="200" viewBox="0 0 160 200" opacity="0.45">
          <circle cx="100" cy="70" r="42" fill="none" stroke="#8B0000" strokeWidth="10" opacity="0.2"/>
          <circle cx="100" cy="70" r="42" fill="none" stroke="#7BA888" strokeWidth="6" opacity="0.4"/>
          <circle cx="100" cy="70" r="42" fill="none" stroke="#8B0000" strokeWidth="1.5"/>
          <circle cx="100" cy="70" r="32" fill="none" stroke="#8B0000" strokeWidth="1"/>
          <text x="100" y="75" fontFamily="'Noto Serif SC',serif" fontSize="13" fill="#8B0000" textAnchor="middle" opacity="0.5">玉</text>
          {[0,1,2,3,4,5,6].map(i => (
            <circle key={i} cx={20 + i*10} cy={148 + (i%2)*8} r="5" fill="#FFF8F0" stroke="#8B0000" strokeWidth="1" opacity="0.7"/>
          ))}
          <path d="M20,148 Q55,138 90,156" fill="none" stroke="#8B0000" strokeWidth="0.8" opacity="0.4"/>
          <path d="M25,170 Q40,158 55,170 Q70,182 85,170" fill="none" stroke="#D4849A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        </svg>

        {/* BOTTOM LEFT — fan */}
        <svg style={{ position:'absolute', bottom:0, left:0, pointerEvents:'none' }} width="160" height="180" viewBox="0 0 160 180" opacity="0.4">
          <g transform="translate(60,175)">
            {[[-55,-90],[-30,-100],[0,-105],[30,-100],[55,-90]].map(([x,y],i) => (
              <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#8B0000" strokeWidth="1.2" strokeLinecap="round"/>
            ))}
            <path d="M-55,-90 A105 105 0 0 1 55,-90" fill="none" stroke="#8B0000" strokeWidth="1"/>
            <path d="M-55,-90 A105 105 0 0 1 -30,-100 L0,0Z" fill="#E8E4B8" opacity="0.5"/>
            <path d="M-30,-100 A105 105 0 0 1 0,-105 L0,0Z" fill="#D4849A" opacity="0.3"/>
            <path d="M0,-105 A105 105 0 0 1 30,-100 L0,0Z" fill="#E8E4B8" opacity="0.5"/>
            <path d="M30,-100 A105 105 0 0 1 55,-90 L0,0Z" fill="#D4849A" opacity="0.3"/>
            <circle cx="0" cy="0" r="5" fill="#8B0000"/>
          </g>
        </svg>

        {/* BOTTOM RIGHT — stars + flowers */}
        <svg style={{ position:'absolute', bottom:0, right:0, pointerEvents:'none' }} width="160" height="180" viewBox="0 0 160 180" opacity="0.4">
          {[[120,40],[140,80],[110,110],[130,140],[100,160]].map(([x,y],i) => (
            <polygon key={i} points={`${x},${y-8} ${x+3},${y-3} ${x+8},${y-3} ${x+4},${y+1} ${x+5},${y+7} ${x},${y+4} ${x-5},${y+7} ${x-4},${y+1} ${x-8},${y-3} ${x-3},${y-3}`}
              fill={i%2===0?'#8B0000':'#D4849A'} opacity="0.7"/>
          ))}
          {[0,72,144,216,288].map((r,i) => (
            <ellipse key={i} cx="50" cy="50" rx="6" ry="10" fill={i%2===0?'#D4849A':'#E8E4B8'} transform={`rotate(${r},50,62)`} opacity="0.6"/>
          ))}
          <circle cx="50" cy="62" r="6" fill="#8B0000" opacity="0.5"/>
        </svg>

        {/* Imperial palace bottom */}
        <svg style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', pointerEvents:'none' }} width="700" height="90" viewBox="0 0 700 90" opacity="0.07">
          <path d="M250,90 L250,45 Q350,18 450,45 L450,90Z" fill="#8B0000"/>
          <path d="M260,45 Q350,20 440,45" fill="none" stroke="#8B0000" strokeWidth="1"/>
          <path d="M120,90 L120,58 Q185,38 250,58 L250,90Z" fill="#8B0000"/>
          <path d="M450,90 L450,58 Q515,38 580,58 L580,90Z" fill="#8B0000"/>
          <path d="M245,45 Q250,33 255,45" fill="#8B0000"/>
          <path d="M345,18 Q350,6 355,18" fill="#8B0000"/>
          <path d="M445,45 Q450,33 455,45" fill="#8B0000"/>
          <path d="M115,58 Q120,46 125,58" fill="#8B0000"/>
          <path d="M575,58 Q580,46 585,58" fill="#8B0000"/>
          <rect x="290" y="80" width="120" height="5" fill="#8B0000" opacity="0.5"/>
          <rect x="300" y="75" width="100" height="5" fill="#8B0000" opacity="0.4"/>
          <path d="M80,22 Q92,12 104,22 Q110,10 122,20 Q126,28 114,32 Q100,36 86,30 Q78,28 80,22Z" fill="#8B0000" opacity="0.5"/>
          <path d="M560,18 Q572,8 584,18 Q590,6 602,16 Q606,24 594,28 Q578,32 566,26 Q558,24 560,18Z" fill="#8B0000" opacity="0.5"/>
        </svg>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'24px', position:'relative', zIndex:2 }}>
          <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'15px', color:'rgba(139,0,0,0.6)', letterSpacing:'4px', display:'block', marginBottom:'14px' }}>欢迎，{chineseName}</span>

          {/* CHOOSE — bigger ransom letters */}
          <div style={{ display:'flex', gap:'5px', alignItems:'center', justifyContent:'center', flexWrap:'wrap', marginBottom:'6px' }}>
            {'CHOOSE'.split('').map((ch, i) => (
              <span key={i} style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Playfair Display',serif", fontWeight:700,
                fontSize:'clamp(24px,5vw,36px)',
                padding:'3px 10px', background:RANSOM[i%RANSOM.length].bg,
                color:RANSOM[i%RANSOM.length].c,
                transform:`rotate(${RANSOM[i%RANSOM.length].r})`,
                boxShadow:'2px 2px 0 rgba(0,0,0,0.15)', borderRadius:'2px',
              }}>{ch}</span>
            ))}
          </div>

          {/* YOUR DYNASTY — bigger */}
          <div style={{ display:'flex', gap:'5px', alignItems:'center', justifyContent:'center', flexWrap:'wrap', marginBottom:'16px' }}>
            {'YOUR DYNASTY'.split('').map((ch, i) => (
              ch === ' ' ? <span key={i} style={{ width:'12px' }}/> :
              <span key={i} style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Playfair Display',serif", fontWeight:700,
                fontSize:'clamp(28px,6vw,44px)',
                padding:'3px 10px', background:RANSOM[(i+2)%RANSOM.length].bg,
                color:RANSOM[(i+2)%RANSOM.length].c,
                transform:`rotate(${RANSOM[(i+1)%RANSOM.length].r})`,
                boxShadow:'2px 2px 0 rgba(0,0,0,0.15)', borderRadius:'2px',
              }}>{ch}</span>
            ))}
          </div>

          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'14px', color:'rgba(90,58,26,0.65)', fontStyle:'italic', lineHeight:1.7 }}>
            Each dynasty unlocks a different tone.<br/>Your journey begins with your choice.
          </p>
        </div>

        {/* Dynasty Cards */}
        <div style={{ width:'100%', maxWidth:'520px', position:'relative', zIndex:2 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px', marginBottom:'16px' }}>
            {dynasties.slice(0,4).map((d, i) => (
              <div key={d.id} className={`c${i+1}`}
                onClick={() => selectDynasty(d.id)}
                onMouseEnter={() => setHoveredId(d.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background:d.bg, borderRadius:'12px', padding:'20px 16px',
                  cursor:'pointer',
                  transition:'transform 0.2s ease, box-shadow 0.2s ease',
                  transform:selected===d.id?'scale(1.05)':hoveredId===d.id?'scale(1.02)':'scale(1)',
                  boxShadow:selected===d.id?`0 8px 30px rgba(0,0,0,0.25)`:hoveredId===d.id?'0 6px 20px rgba(0,0,0,0.15)':'0 3px 12px rgba(0,0,0,0.10)',
                  position:'relative', overflow:'hidden',
                  border:`2px solid ${selected===d.id?'rgba(0,0,0,0.25)':'rgba(255,255,255,0.4)'}`,
                }}>
                <div style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.25)', borderRadius:'20px', padding:'3px 10px' }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'#FFF8F0', letterSpacing:'1px', fontWeight:700 }}>{d.tone}</span>
                </div>
                <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'32px', color:d.text, marginBottom:'4px', fontWeight:700, lineHeight:1 }}>{d.chinese}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'14px', color:d.text, fontWeight:700, marginBottom:'2px' }}>{d.name}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:d.text, opacity:0.65, marginBottom:'10px' }}>{d.period}</div>
                <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:'6px', padding:'6px 12px', marginBottom:'8px', display:'inline-block' }}>
                  <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'20px', color:d.text, letterSpacing:'2px', fontWeight:700 }}>{d.toneChar}</span>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:d.text, opacity:0.75, marginBottom:'8px', fontStyle:'italic' }}>{d.toneDesc}</div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:d.text, fontStyle:'italic', lineHeight:1.6, marginBottom:'14px', opacity:0.9 }}>{d.description}</p>
                <div style={{ background:'#FFF8F0', padding:'9px 14px', borderRadius:'6px', fontFamily:"'Playfair Display',serif", fontSize:'10px', letterSpacing:'1.5px', textAlign:'center', color:d.deepColor, fontWeight:700 }}>
                  {selected===d.id?'✦ ENTERING DYNASTY... ✦':'SELECT THIS DYNASTY'}
                </div>
              </div>
            ))}
          </div>

          {/* Song Dynasty centered */}
          <div style={{ display:'flex', justifyContent:'center' }}>
            <div className="c5"
              onClick={() => selectDynasty('song')}
              onMouseEnter={() => setHoveredId('song')}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background:'#D4849A', borderRadius:'12px', padding:'20px 16px',
                cursor:'pointer',
                transition:'transform 0.2s ease, box-shadow 0.2s ease',
                transform:selected==='song'?'scale(1.05)':hoveredId==='song'?'scale(1.02)':'scale(1)',
                boxShadow:selected==='song'?'0 8px 30px rgba(0,0,0,0.25)':hoveredId==='song'?'0 6px 20px rgba(0,0,0,0.15)':'0 3px 12px rgba(0,0,0,0.10)',
                position:'relative', overflow:'hidden',
                border:`2px solid ${selected==='song'?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.4)'}`,
                width:'100%', maxWidth:'248px',
              }}>
              <div style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.25)', borderRadius:'20px', padding:'3px 10px' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'#FFF8F0', letterSpacing:'1px', fontWeight:700 }}>Tone 5</span>
              </div>
              <div style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'32px', color:'#FFF8F0', marginBottom:'4px', fontWeight:700, lineHeight:1 }}>宋朝</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'14px', color:'#FFF8F0', fontWeight:700, marginBottom:'2px' }}>Song Dynasty</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'10px', color:'#FFF8F0', opacity:0.65, marginBottom:'10px' }}>960–1279 AD</div>
              <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:'6px', padding:'6px 12px', marginBottom:'8px', display:'inline-block' }}>
                <span style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'20px', color:'#FFF8F0', letterSpacing:'2px', fontWeight:700 }}>ma</span>
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'#FFF8F0', opacity:0.75, marginBottom:'8px', fontStyle:'italic' }}>Neutral and light</div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'#FFF8F0', fontStyle:'italic', lineHeight:1.6, marginBottom:'14px', opacity:0.9 }}>Soft and unstressed, like a whisper between old friends.</p>
              <div style={{ background:'#FFF8F0', padding:'9px 14px', borderRadius:'6px', fontFamily:"'Playfair Display',serif", fontSize:'10px', letterSpacing:'1.5px', textAlign:'center', color:'#9C4660', fontWeight:700 }}>
                {selected==='song'?'✦ ENTERING DYNASTY... ✦':'SELECT THIS DYNASTY'}
              </div>
            </div>
          </div>
        </div>

        <p style={{ marginTop:'24px', fontFamily:"'Playfair Display',serif", fontSize:'12px', color:'rgba(139,0,0,0.4)', fontStyle:'italic', letterSpacing:'1px', textAlign:'center', position:'relative', zIndex:2 }}>
          Your dynasty shapes your learning journey
        </p>
        <button onClick={() => router.back()} style={{ marginTop:'10px', background:'transparent', border:'none', fontFamily:"'Playfair Display',serif", fontSize:'11px', color:'rgba(139,0,0,0.4)', cursor:'pointer', fontStyle:'italic', letterSpacing:'1px', position:'relative', zIndex:2 }}>
          ← back to your name
        </button>
      </div>
    </>
  );
}

export default function DynastyPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#FFF8F0',fontFamily:'serif',color:'#8B0000',fontSize:'14px',letterSpacing:'2px'}}>Loading...</div>}>
      <DynastyContent />
    </Suspense>
  );
}
