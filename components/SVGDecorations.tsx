// SVG Components for InkBook decorations
export function FanSVG() {
  return (
    <svg viewBox="0 0 200 240" className="w-40 h-48 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Fan segments */}
      <g id="fan-segments">
        {/* Segment 1 - Red with 龍 */}
        <path d="M100,50 L140,120 A60,60 0 0,0 100,50" fill="#8B0000" />
        <text x="115" y="90" fontSize="20" fontWeight="bold" fill="gold" fontFamily="Noto Serif SC">龍</text>

        {/* Segment 2 - Gold with 福 */}
        <path d="M100,50 L100,50 A60,60 0 0,0 60,120" fill="#D4AF37" />
        <text x="75" y="90" fontSize="20" fontWeight="bold" fill="white" fontFamily="Noto Serif SC">福</text>

        {/* Segment 3 - Red with 春 */}
        <path d="M100,50 L80,50 A60,60 0 0,1 140,120" fill="#8B0000" stroke="gold" strokeWidth="2" />
        <text x="100" y="75" fontSize="20" fontWeight="bold" fill="gold" fontFamily="Noto Serif SC" textAnchor="middle">春</text>
      </g>

      {/* Fan handle */}
      <rect x="95" y="140" width="10" height="50" fill="#8B0000" />

      {/* Tassel */}
      <circle cx="100" cy="195" r="8" fill="gold" />
      <line x1="100" y1="203" x2="95" y2="215" stroke="#8B0000" strokeWidth="2" />
      <line x1="100" y1="203" x2="100" y2="220" stroke="gold" strokeWidth="2" />
      <line x1="100" y1="203" x2="105" y2="215" stroke="#8B0000" strokeWidth="2" />

      {/* Pivot point */}
      <circle cx="100" cy="140" r="5" fill="#1A1A1A" />
    </svg>
  );
}

export function FishLanternSVG() {
  return (
    <svg viewBox="0 0 180 160" className="w-32 h-28 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Fish body - red with scales */}
      <ellipse cx="90" cy="60" rx="50" ry="35" fill="#8B0000" />

      {/* Scales pattern */}
      <g fill="gold" opacity="0.6">
        <circle cx="70" cy="50" r="6" />
        <circle cx="80" cy="45" r="6" />
        <circle cx="90" cy="43" r="6" />
        <circle cx="100" cy="45" r="6" />
        <circle cx="110" cy="50" r="6" />

        <circle cx="65" cy="65" r="6" />
        <circle cx="75" cy="70" r="6" />
        <circle cx="90" cy="72" r="6" />
        <circle cx="105" cy="70" r="6" />
        <circle cx="115" cy="65" r="6" />
      </g>

      {/* Eye */}
      <circle cx="50" cy="50" r="5" fill="white" />
      <circle cx="51" cy="50" r="3" fill="black" />

      {/* 福 character on body */}
      <text x="90" y="70" fontSize="18" fontWeight="bold" fill="gold" fontFamily="Noto Serif SC" textAnchor="middle">福</text>

      {/* Tail fins */}
      <path d="M140,50 L160,30 L155,60 L160,90 L140,70 Z" fill="#D4AF37" />

      {/* Top and bottom fins */}
      <ellipse cx="90" cy="30" rx="15" ry="8" fill="#D4AF37" opacity="0.8" />
      <ellipse cx="90" cy="90" rx="15" ry="8" fill="#D4AF37" opacity="0.8" />

      {/* Gold fringe at bottom */}
      <g stroke="gold" strokeWidth="2" opacity="0.7">
        <line x1="65" y1="95" x2="65" y2="120" />
        <line x1="80" y1="98" x2="80" y2="125" />
        <line x1="95" y1="100" x2="95" y2="130" />
        <line x1="110" y1="98" x2="110" y2="125" />
        <line x1="125" y1="95" x2="125" y2="120" />
      </g>
    </svg>
  );
}

export function PeonyFlowerSVG() {
  return (
    <svg viewBox="0 0 120 140" className="w-24 h-32 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Petals - pink layers */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 60 70)`}>
          <ellipse cx="60" cy="30" rx="18" ry="25" fill="#E8A0B8" opacity="0.9" />
        </g>
      ))}

      {/* Inner petals - darker pink */}
      {[36, 108, 180, 252, 324].map((angle) => (
        <g key={`inner-${angle}`} transform={`rotate(${angle} 60 70)`}>
          <ellipse cx="60" cy="35" rx="14" ry="20" fill="#D9759F" opacity="0.85" />
        </g>
      ))}

      {/* Center - gold stamens */}
      <circle cx="60" cy="70" r="12" fill="#D4AF37" />
      <g fill="#8B0000" opacity="0.7">
        <circle cx="55" cy="65" r="2" />
        <circle cx="60" cy="62" r="2" />
        <circle cx="65" cy="65" r="2" />
        <circle cx="60" cy="75" r="2" />
      </g>

      {/* Stem */}
      <line x1="60" y1="100" x2="60" y2="130" stroke="#2D5016" strokeWidth="3" />

      {/* Leaves */}
      <ellipse cx="45" cy="110" rx="10" ry="15" fill="#2D5016" transform="rotate(-30 45 110)" />
      <ellipse cx="75" cy="110" rx="10" ry="15" fill="#2D5016" transform="rotate(30 75 110)" />
    </svg>
  );
}

export function PlumBlossomSVG() {
  return (
    <svg viewBox="0 0 100 120" className="w-16 h-20 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      {/* Five petals */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <ellipse cx="50" cy="20" rx="8" ry="14" fill="#F4A7B9" />
        </g>
      ))}

      {/* Center stamen */}
      <circle cx="50" cy="50" r="5" fill="#D4AF37" />
      <circle cx="50" cy="50" r="3" fill="#1A1A1A" opacity="0.5" />

      {/* Branch */}
      <path d="M45,70 Q40,90 35,105 Q50,95 60,105" stroke="#8B0000" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function CherryBlossomSVG() {
  return (
    <svg viewBox="0 0 100 120" className="w-16 h-20 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      {/* Five petals - lighter pink */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <ellipse cx="50" cy="25" rx="7" ry="12" fill="#FAD4A6" />
        </g>
      ))}

      {/* Center stamen - gold */}
      <circle cx="50" cy="50" r="4" fill="#D4AF37" />

      {/* Branch - gold */}
      <path d="M45,70 Q40,90 35,105 Q50,95 60,105" stroke="#D4AF37" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function RedEnvelopeSVG() {
  return (
    <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Envelope body */}
      <rect x="10" y="20" width="80" height="50" fill="#8B0000" rx="3" />

      {/* Flap */}
      <path d="M10,20 L50,45 L90,20 L90,25 L50,50 L10,25 Z" fill="#D4AF37" />

      {/* 福 character */}
      <text x="50" y="55" fontSize="28" fontWeight="bold" fill="gold" fontFamily="Noto Serif SC" textAnchor="middle">福</text>
    </svg>
  );
}

export function GoldIngotSVG() {
  return (
    <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Ingot shape */}
      <path d="M20,30 L40,20 L80,20 L60,30 L60,50 L40,60 L20,50 Z" fill="#D4AF37" stroke="#8B0000" strokeWidth="2" />

      {/* Top shine */}
      <ellipse cx="50" cy="25" rx="15" ry="5" fill="white" opacity="0.4" />

      {/* 金 character */}
      <text x="45" y="45" fontSize="20" fontWeight="bold" fill="#8B0000" fontFamily="Noto Serif SC" textAnchor="middle">金</text>
    </svg>
  );
}

export function WaxSealSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Main seal circle */}
      <circle cx="50" cy="50" r="45" fill="#8B0000" stroke="gold" strokeWidth="3" />

      {/* Inner circle */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="gold" strokeWidth="1" opacity="0.6" />

      {/* Character 壽 */}
      <text x="50" y="60" fontSize="32" fontWeight="bold" fill="gold" fontFamily="Noto Serif SC" textAnchor="middle">壽</text>

      {/* Drip effect */}
      <ellipse cx="50" cy="92" rx="6" ry="5" fill="#8B0000" opacity="0.8" />
      <ellipse cx="38" cy="88" rx="4" ry="4" fill="#8B0000" opacity="0.6" />
      <ellipse cx="62" cy="87" rx="4" ry="4" fill="#8B0000" opacity="0.6" />
    </svg>
  );
}

export function PostageStampSVG() {
  return (
    <svg viewBox="0 0 80 100" className="w-12 h-16 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      {/* Stamp background */}
      <rect x="5" y="5" width="70" height="90" fill="#FAD4A6" stroke="#D4AF37" strokeWidth="2" />

      {/* Perforated edges */}
      <g stroke="#D4AF37" strokeWidth="1" fill="none">
        {[15, 25, 35, 45, 55, 65, 75].map((y) => (
          <circle key={`top-${y}`} cx="5" cy={y} r="2" />
        ))}
        {[15, 25, 35, 45, 55, 65, 75].map((y) => (
          <circle key={`bottom-${y}`} cx="75" cy={y} r="2" />
        ))}
        {[15, 25, 35, 45, 55, 65].map((x) => (
          <circle key={`left-${x}`} cx={x} cy="5" r="2" />
        ))}
        {[15, 25, 35, 45, 55, 65].map((x) => (
          <circle key={`right-${x}`} cx={x} cy="95" r="2" />
        ))}
      </g>

      {/* Center text */}
      <text x="40" y="35" fontSize="12" fontWeight="bold" fill="#8B0000" textAnchor="middle">中国</text>
      <text x="40" y="75" fontSize="10" fill="#8B0000" textAnchor="middle">CHINA</text>
    </svg>
  );
}

export function FortuneTagSVG() {
  return (
    <svg viewBox="0 0 60 80" className="w-12 h-16 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      {/* Tag shape */}
      <path d="M15,5 L50,5 L55,15 L50,10 L15,10 Z" fill="#D4AF37" />
      <rect x="15" y="10" width="35" height="55" fill="#FAD4A6" stroke="#D4AF37" strokeWidth="1" rx="2" />

      {/* Character - random fortune */}
      <text x="32" y="50" fontSize="28" fontWeight="bold" fill="#8B0000" fontFamily="Noto Serif SC" textAnchor="middle">吉</text>

      {/* String hole */}
      <circle cx="32" cy="8" r="2" fill="#8B0000" />
    </svg>
  );
}
