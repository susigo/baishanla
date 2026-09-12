export function HillsArt({ height = 200, label }: { height?: number; label?: string }) {
  return (
    <div className="art" style={{ height }}>
      <svg viewBox="0 0 350 200" className="absolute inset-0 w-full h-full opacity-90" fill="none">
        <circle cx="260" cy="56" r="28" fill="#E7B8B0" opacity="0.75" />
        <path d="M0 150 C60 110 110 120 160 135 C210 150 250 100 350 120 L350 200 L0 200 Z" fill="#7BAF9E" opacity="0.55" />
        <path d="M0 165 C80 140 140 155 200 160 C260 165 300 140 350 150 L350 200 L0 200 Z" fill="#5F9483" opacity="0.7" />
        <path d="M48 148 c0-10 6-16 12-16 s12 6 12 16 v18 h-24 z" fill="#E7B8B0" opacity="0.85" />
      </svg>
      {label ? <span className="relative z-10">{label}</span> : null}
    </div>
  )
}
