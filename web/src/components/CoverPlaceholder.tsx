import { HillsArt } from './HillsArt'

type Variant = 'cover' | 'thumb' | 'photo'

/** Soft sage/cream cover or thumbnail — never an empty gray box. */
export function CoverPlaceholder({
  height,
  label,
  variant = 'cover',
  className = '',
  tone = 'sage',
}: {
  height?: number
  label?: string
  variant?: Variant
  className?: string
  tone?: 'sage' | 'blush'
}) {
  if (variant === 'thumb') {
    return (
      <div
        className={`shrink-0 rounded-full overflow-hidden relative ${className}`}
        style={{
          width: 28,
          height: 28,
          background:
            tone === 'blush'
              ? 'linear-gradient(145deg, #F0D5CF, #F7F3EA)'
              : 'linear-gradient(145deg, #D7E8DF, #F0F5F1)',
        }}
        aria-hidden
      />
    )
  }

  if (variant === 'photo') {
    return (
      <div
        className={`rounded-xl overflow-hidden relative ${className || 'aspect-square'}`}
        style={{
          background:
            tone === 'blush'
              ? 'radial-gradient(circle at 30% 30%, rgba(231,184,176,0.55), transparent 55%), linear-gradient(160deg, #F3E4D8, #F7F3EA)'
              : 'radial-gradient(circle at 70% 25%, rgba(231,184,176,0.35), transparent 45%), linear-gradient(160deg, #D7E8DF, #F0F5F1)',
        }}
        aria-hidden
      >
        <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full opacity-80" fill="none">
          <circle cx="58" cy="22" r="10" fill="#E7B8B0" opacity="0.65" />
          <path d="M0 52 C18 40 32 56 48 44 C60 36 70 48 80 42 L80 80 L0 80 Z" fill="#B7D0C4" opacity="0.7" />
          <path d="M0 62 C22 52 36 68 52 58 C64 50 72 60 80 56 L80 80 L0 80 Z" fill="#7BAF9E" opacity="0.4" />
        </svg>
      </div>
    )
  }

  return <HillsArt height={height ?? 120} label={label} className={className} />
}
