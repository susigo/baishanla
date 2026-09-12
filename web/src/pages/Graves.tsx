import { Link } from 'react-router-dom'
import { useDB } from '../lib/useDB'
import { currentFamily, familyGraves, familySchedules } from '../lib/store'
import { HillsArt } from '../components/HillsArt'

export function Graves() {
  useDB()
  const family = currentFamily()!
  const graves = familyGraves(family.id)
  const schedules = familySchedules(family.id)

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold">墓地</h1>
        <Link to="/graves/new" className="btn-ghost h-9">
          新建
        </Link>
      </div>
      <div className="space-y-3">
        {graves.map((g) => {
          const next = schedules.find((s) => s.graveId === g.id)
          return (
            <Link key={g.id} to={`/graves/${g.id}`} className="card block overflow-hidden p-0">
              <div className="p-3 pb-0">
                <HillsArt height={100} label={g.coverLabel} />
              </div>
              <div className="p-4 pt-3">
                <div className="font-semibold text-[16px]">{g.name}</div>
                <div className="text-ink2 text-[13px] mt-1">{g.memorialFor}</div>
                {next ? (
                  <div className="text-sage-dark text-xs mt-2">下次 · {next.type} {next.date}</div>
                ) : null}
              </div>
            </Link>
          )
        })}
        {!graves.length ? (
          <div className="text-center py-12 text-ink2">
            <p className="mb-4">还没有墓地档案</p>
            <Link to="/graves/new" className="btn-primary inline-flex w-auto px-8">
              添加第一座
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
