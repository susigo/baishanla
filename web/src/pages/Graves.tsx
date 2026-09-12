import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useDB } from '../lib/useDB'
import { currentFamily, familyGraves, familySchedules } from '../lib/store'
import { HillsArt } from '../components/HillsArt'
import { EmptyState } from '../components/EmptyState'

export function Graves() {
  useDB()
  const family = currentFamily()!
  const graves = familyGraves(family.id)
  const schedules = familySchedules(family.id)

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold">墓地</h1>
        <Link to="/graves/new" className="btn-ghost h-9 gap-1">
          <Plus size={16} strokeWidth={2.25} />
          新建
        </Link>
      </div>
      <div className="space-y-3">
        {graves.map((g, i) => {
          const next = schedules.find((s) => s.graveId === g.id)
          return (
            <Link key={g.id} to={`/graves/${g.id}`} className="card block overflow-hidden p-0">
              <div className="p-3 pb-0">
                <HillsArt height={108} label={g.coverLabel} variant={i} />
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
          <EmptyState
            title="还没有墓地档案"
            description="添加第一座墓地，记下地址与走法，家人都能看见。"
            actionLabel="添加第一座"
            actionTo="/graves/new"
          />
        ) : null}
      </div>
    </div>
  )
}
