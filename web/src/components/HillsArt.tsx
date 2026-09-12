/** Spring Qingming landscape — hills + sprout + soft sun. No tombstones. */
export function HillsArt({
  height = 200,
  label,
  variant = 0,
  className = '',
}: {
  height?: number
  label?: string
  variant?: number
  className?: string
}) {
  const v = variant % 3
  const sunX = v === 1 ? 80 : v === 2 ? 280 : 250
  const sproutX = v === 1 ? 240 : v === 2 ? 70 : 52

  return (
    <div className={`art ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 350 200"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`sky-${v}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8F2EC" />
            <stop offset="55%" stopColor="#F3F7F1" />
            <stop offset="100%" stopColor="#F7F3EA" />
          </linearGradient>
          <radialGradient id={`sun-${v}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F3D0C8" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#E7B8B0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E7B8B0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="350" height="200" fill={`url(#sky-${v})`} />
        <circle cx={sunX} cy="58" r="36" fill={`url(#sun-${v})`} />
        <circle cx={sunX} cy="58" r="18" fill="#E7B8B0" opacity="0.72" />

        {/* distant hills */}
        <path
          d="M0 138 C55 108 95 128 145 118 C195 108 230 95 280 112 C320 124 340 118 350 112 L350 200 L0 200 Z"
          fill="#C9DFD4"
          opacity="0.9"
        />
        <path
          d="M0 158 C70 128 115 165 175 138 C230 114 275 148 350 132 L350 200 L0 200 Z"
          fill="#B7D0C4"
          opacity="0.95"
        />
        <path
          d="M0 172 C90 152 140 178 200 162 C255 148 300 168 350 158 L350 200 L0 200 Z"
          fill="#7BAF9E"
          opacity="0.45"
        />

        {/* sprout — stem + two leaves + blush bud */}
        <g transform={`translate(${sproutX} 0)`}>
          <path
            d="M18 148 C18 118 18 98 18 88"
            stroke="#5F9483"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M18 108 C6 100 0 92 4 84 C10 92 14 100 18 108 Z"
            fill="#7BAF9E"
          />
          <path
            d="M18 100 C30 92 38 84 34 76 C26 84 22 92 18 100 Z"
            fill="#5F9483"
          />
          <circle cx="18" cy="78" r="6.5" fill="#E7B8B0" />
          <circle cx="16" cy="76" r="2" fill="#F7F3EA" opacity="0.7" />
        </g>

        {/* tiny floral dots */}
        <circle cx="120" cy="150" r="2.2" fill="#E7B8B0" opacity="0.7" />
        <circle cx="300" cy="145" r="2" fill="#E7B8B0" opacity="0.55" />
        <circle cx="210" cy="160" r="1.6" fill="#7BAF9E" opacity="0.5" />
      </svg>
      {label ? (
        <span className="relative z-10 text-sage-dark text-[13px] font-medium tracking-wide drop-shadow-sm">
          {label}
        </span>
      ) : null}
    </div>
  )
}

/** Compact cover used on grave cards / visit thumbs */
export function CoverThumb({
  size = 72,
  motif = 'hills',
}: {
  size?: number
  motif?: 'hills' | 'floral' | 'sage' | 'blush'
}) {
  if (motif === 'sage') {
    return (
      <div
        className="rounded-xl shrink-0 overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(145deg, #D7E8DF, #F0F5F1)',
        }}
      />
    )
  }
  if (motif === 'blush') {
    return (
      <div
        className="rounded-xl shrink-0 overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(145deg, #F0D5CF, #F7F3EA)',
        }}
      />
    )
  }
  if (motif === 'floral') {
    return (
      <div
        className="rounded-xl shrink-0 overflow-hidden relative"
        style={{
          width: size,
          height: size,
          background:
            'radial-gradient(circle at 30% 35%, rgba(231,184,176,0.55), transparent 50%), linear-gradient(160deg, #E8F2EC, #F7F3EA)',
        }}
      >
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full" aria-hidden>
          <circle cx="40" cy="22" r="8" fill="#E7B8B0" opacity="0.75" />
          <path d="M18 48 C22 34 30 30 32 44" stroke="#7BAF9E" strokeWidth="2" fill="none" />
          <ellipse cx="26" cy="36" rx="5" ry="3.5" fill="#7BAF9E" opacity="0.85" transform="rotate(-25 26 36)" />
          <ellipse cx="34" cy="34" rx="5" ry="3.5" fill="#5F9483" opacity="0.8" transform="rotate(20 34 34)" />
        </svg>
      </div>
    )
  }
  return (
    <div
      className="rounded-xl shrink-0 overflow-hidden relative"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(180deg, #E8F2EC, #F7F3EA)',
      }}
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full" aria-hidden>
        <circle cx="46" cy="16" r="8" fill="#E7B8B0" opacity="0.7" />
        <path d="M0 40 C16 30 28 42 40 34 C50 28 58 34 64 30 L64 64 L0 64 Z" fill="#C9DFD4" />
        <path d="M0 48 C18 40 30 52 44 44 C54 38 60 46 64 42 L64 64 L0 64 Z" fill="#7BAF9E" opacity="0.55" />
      </svg>
    </div>
  )
}
