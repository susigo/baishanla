import { Link } from 'react-router-dom'
import { useDB } from '../lib/useDB'
import {
  currentFamily,
  familyChecklists,
  familyMembers,
  familyVisits,
  getGrave,
  nextSchedule,
} from '../lib/store'

export function Home() {
  useDB()
  const family = currentFamily()!
  const members = familyMembers(family.id)
  const next = nextSchedule(family.id)
  const grave = next?.graveId ? getGrave(next.graveId) : undefined
  const lists = familyChecklists(family.id)
  const list = lists[0]
  const checked = list ? list.items.filter((i) => i.checked).length : 0
  const total = list ? list.items.length : 0
  const recent = familyVisits(family.id).slice(0, 3)

  const dateLabel = next
    ? `${next.type} · ${Number(next.date.slice(5, 7))}月${Number(next.date.slice(8, 10))}日`
    : '暂无排程'

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-[16px]">
          {family.name} <span className="text-ink2 text-xs">▾</span>
        </div>
        <Link to="/me/members" className="chip">
          成员 {members.length}
        </Link>
      </div>

      <div className="card-sage mb-3">
        <div className="text-ink2 text-[13px]">下一场拜山</div>
        <div className="text-[20px] font-semibold mt-1.5 mb-1">{dateLabel}</div>
        <div className="text-ink2 text-[13px]">
          {grave?.name ?? '家庭'} · 负责人 {next?.assignee ?? '—'}
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {next?.remindDays?.[0] != null ? (
            <span className="chip">提前 {next.remindDays[0]} 天</span>
          ) : null}
          <Link to="/schedules" className="chip">
            看排程
          </Link>
        </div>
      </div>

      <Link to="/visits/new" className="btn-primary mb-3">
        记一笔
      </Link>

      {list ? (
        <Link to={`/checklists/${list.id}`} className="card mb-4 block">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{list.title.replace('2026 ', '').replace('清单', '物资')}</span>
            <span className="text-ink2 text-sm">
              {checked}/{total}
            </span>
          </div>
          <div className="progress">
            <i style={{ width: total ? `${(checked / total) * 100}%` : '0%' }} />
          </div>
        </Link>
      ) : null}

      <div className="text-ink2 text-[13px] mb-2">最近记录</div>
      <div className="space-y-2">
        {recent.map((v) => {
          const g = getGrave(v.graveId)
          return (
            <Link key={v.id} to={`/visits/${v.id}`} className="card flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-blush shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold truncate">{v.title || '看望'}</span>
                  <span className="text-ink2 text-xs shrink-0">{g?.name?.slice(0, 2) ?? ''}</span>
                </div>
                {v.body ? (
                  <p className="text-ink2 text-[13px] mt-0.5 truncate">{v.body}</p>
                ) : null}
              </div>
            </Link>
          )
        })}
        {!recent.length ? <p className="text-ink2 text-sm py-4 text-center">还没有记录</p> : null}
      </div>
    </div>
  )
}
