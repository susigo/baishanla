import { Link } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import { useDB } from '../lib/useDB'
import { currentFamily, familyVisits, getGrave } from '../lib/store'
import { CoverThumb } from '../components/HillsArt'
import { EmptyState } from '../components/EmptyState'

export function Visits() {
  useDB()
  const family = currentFamily()!
  const visits = familyVisits(family.id)
  const byYear = visits.reduce<Record<string, typeof visits>>((acc, v) => {
    const y = v.date.slice(0, 4)
    ;(acc[y] ||= []).push(v)
    return acc
  }, {})

  const motifs = ['floral', 'hills', 'sage', 'blush'] as const

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold">记录</h1>
        <Link to="/visits/new" className="btn-ghost h-9 gap-1">
          <PenLine size={16} strokeWidth={2.25} />
          记一笔
        </Link>
      </div>
      {Object.keys(byYear)
        .sort((a, b) => b.localeCompare(a))
        .map((year) => (
          <div key={year} className="mb-4">
            <div className="text-ink2 text-[13px] mb-2">{year}</div>
            <div className="space-y-2">
              {byYear[year].map((v, i) => {
                const g = getGrave(v.graveId)
                return (
                  <Link key={v.id} to={`/visits/${v.id}`} className="card flex gap-3 items-center">
                    <CoverThumb size={44} motif={motifs[i % motifs.length]} />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="font-semibold">{v.title || '看望'}</span>
                        <span className="text-xs text-ink2">{v.date.slice(5)}</span>
                      </div>
                      <div className="text-ink2 text-[13px] truncate">
                        {g?.name} · {v.body || '无正文'}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      {!visits.length ? (
        <EmptyState
          title="还没有拜山记录"
          description="天气、同行的人、路上的小事，都可以轻轻写下来。"
          actionLabel="记一笔"
          actionTo="/visits/new"
        />
      ) : null}
    </div>
  )
}
