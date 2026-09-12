import { HillsArt } from './HillsArt'
import { Link } from 'react-router-dom'

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}) {
  return (
    <div className="text-center py-10 px-4">
      <div className="mx-auto max-w-[240px] mb-4">
        <HillsArt height={120} />
      </div>
      <p className="font-semibold text-ink text-[15px]">{title}</p>
      {description ? (
        <p className="text-ink2 text-[13px] mt-1.5 leading-relaxed max-w-[260px] mx-auto">
          {description}
        </p>
      ) : null}
      {actionTo && actionLabel ? (
        <Link to={actionTo} className="btn-primary inline-flex w-auto px-8 mt-5 h-11 text-sm">
          {actionLabel}
        </Link>
      ) : null}
      {onAction && actionLabel && !actionTo ? (
        <button type="button" className="btn-primary inline-flex w-auto px-8 mt-5 h-11 text-sm" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export function SproutDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mt-4" aria-hidden>
      <span className="h-px w-14 bg-blush/80" />
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M9 14 V6" stroke="#7BAF9E" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 8 C5 5 3 4 4 2.5 C6 4 7.5 6 9 8 Z" fill="#7BAF9E" />
        <path d="M9 7 C13 4 15 3 14 1.5 C12 3 10.5 5 9 7 Z" fill="#5F9483" />
      </svg>
      <span className="h-px w-14 bg-blush/80" />
    </div>
  )
}

export function SoftDecor({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute -right-8 -top-10 w-40 h-40 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #E7B8B0 0%, transparent 70%)' }}
      />
      <div
        className="absolute -left-10 top-6 w-36 h-36 rounded-full opacity-35"
        style={{ background: 'radial-gradient(circle, #C9DFD4 0%, transparent 70%)' }}
      />
    </div>
  )
}
