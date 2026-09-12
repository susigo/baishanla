import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useDB } from '../lib/useDB'
import { currentFamily, familySchedules, getGrave } from '../lib/store'

export function Schedules() {
  useDB()
  const family = currentFamily()!
  const schedules = familySchedules(family.id)

  return (
    <div className="px-5 pt-2">
      <PageHeader
        title="排程"
        right={
          <Link to="/schedules/new" className="text-sage-dark">
            新建
          </Link>
        }
      />
      <div className="space-y-2 mt-2">
        {schedules.map((s) => {
          const g = s.graveId ? getGrave(s.graveId) : undefined
          return (
            <div key={s.id} className="card">
              <div className="font-semibold">
                {s.type} · {s.date}
              </div>
              <div className="text-ink2 text-[13px] mt-1">
                {g?.name ?? '家庭级'} · 负责人 {s.assignee}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {s.remindDays.map((d) => (
                  <span key={d} className="chip">
                    提前 {d} 天
                  </span>
                ))}
                <span className="chip">{s.rule === 'yearly' ? '每年' : '一次'}</span>
              </div>
            </div>
          )
        })}
        {!schedules.length ? <p className="text-ink2 text-center py-8">暂无排程</p> : null}
      </div>
    </div>
  )
}
