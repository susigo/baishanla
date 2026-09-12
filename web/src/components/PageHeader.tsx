import { useNavigate } from 'react-router-dom'

export function PageHeader({
  title,
  right,
  back = true,
}: {
  title?: string
  right?: React.ReactNode
  back?: boolean
}) {
  const nav = useNavigate()
  return (
    <div className="flex items-center justify-between py-2 mb-2 min-h-[40px]">
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center text-xl text-ink"
        onClick={() => (back ? nav(-1) : undefined)}
        aria-label="返回"
      >
        {back ? '←' : ''}
      </button>
      <div className="font-semibold text-[17px] text-ink flex-1 text-center">{title}</div>
      <div className="min-w-10 flex justify-end text-sage-dark text-sm font-semibold">{right}</div>
    </div>
  )
}
