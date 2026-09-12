import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
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
          <Link to="/schedules/new" className="text-sage-dark flex items-center gap-1">
            <Plus size={14} strokeWidth={2.25} aria-hidden />
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
        {!schedules.length ? (
          <EmptyState
            title="暂无排程"
            description="把清明、忌日记下来，到时候轻轻提醒家人。"
            actionLabel="新建排程"
            actionTo="/schedules/new"
          />
        ) : null}
      </div>
    </div>
  )
}
