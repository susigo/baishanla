import { Link } from 'react-router-dom'
import { useDB } from '../lib/useDB'
import { currentFamily, familyVisits, getGrave } from '../lib/store'

export function Visits() {
  useDB()
  const family = currentFamily()!
  const visits = familyVisits(family.id)
  const byYear = visits.reduce<Record<string, typeof visits>>((acc, v) => {
    const y = v.date.slice(0, 4)
    ;(acc[y] ||= []).push(v)
    return acc
  }, {})

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold">记录</h1>
        <Link to="/visits/new" className="btn-ghost h-9">
          记一笔
        </Link>
      </div>
      {Object.keys(byYear)
        .sort((a, b) => b.localeCompare(a))
        .map((year) => (
          <div key={year} className="mb-4">
            <div className="text-ink2 text-[13px] mb-2">{year}</div>
            <div className="space-y-2">
              {byYear[year].map((v) => {
                const g = getGrave(v.graveId)
                return (
                  <Link key={v.id} to={`/visits/${v.id}`} className="card flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-blush shrink-0" />
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
      {!visits.length ? <p className="text-center text-ink2 py-10">还没有拜山记录</p> : null}
    </div>
  )
}
