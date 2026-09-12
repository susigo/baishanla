import { Link, useParams } from 'react-router-dom'
import { MoreHorizontal, Navigation, PenLine, ListChecks, CalendarDays } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { HillsArt } from '../components/HillsArt'
import { useDB } from '../lib/useDB'
import {
  familyChecklists,
  familySchedules,
  familyVisits,
  getGrave,
  mapsNavigateUrl,
} from '../lib/store'

export function GraveDetail() {
  useDB()
  const { id } = useParams()
  const grave = id ? getGrave(id) : undefined
  if (!grave) {
    return (
      <div className="px-5 pt-4">
        <PageHeader title="墓地" />
        <p className="text-ink2">未找到</p>
      </div>
    )
  }

  const visits = familyVisits(grave.familyId).filter((v) => v.graveId === grave.id)
  const schedules = familySchedules(grave.familyId).filter((s) => s.graveId === grave.id)
  const lists = familyChecklists(grave.familyId).filter((c) => c.graveId === grave.id)
  const recentLabel = visits
    .slice(0, 2)
    .map((v) => v.title)
    .join(' · ')

  return (
    <div className="px-5 pt-2">
      <PageHeader
        title=""
        right={
          <Link to={`/graves/${grave.id}/edit`} className="w-10 h-10 flex items-center justify-center text-ink">
            <MoreHorizontal size={22} />
          </Link>
        }
      />
      <HillsArt height={140} label={grave.coverLabel} />
      <h1 className="text-[20px] font-semibold mt-3">{grave.name}</h1>
      <p className="text-ink2 text-[13px] mt-1">
        {grave.memorialFor}
        {grave.note ? ` · ${grave.note.slice(0, 24)}` : ''}
      </p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <a
          className="btn-ghost gap-1.5"
          href={mapsNavigateUrl(grave)}
          target="_blank"
          rel="noreferrer"
        >
          <Navigation size={16} strokeWidth={2} />
          导航
        </a>
        <Link to={`/visits/new?graveId=${grave.id}`} className="btn-primary h-10 text-sm gap-1.5 shadow-none">
          <PenLine size={16} strokeWidth={2} />
          记一笔
        </Link>
        <Link
          to={lists[0] ? `/checklists/${lists[0].id}` : '/schedules'}
          className="btn-dashed gap-1.5"
        >
          <ListChecks size={16} strokeWidth={2} />
          清单
        </Link>
        <Link to="/schedules" className="btn-dashed gap-1.5">
          <CalendarDays size={16} strokeWidth={2} />
          排程
        </Link>
      </div>

      <div className="card mt-4">
        <div className="font-semibold mb-1">近期记录</div>
        <div className="text-ink2 text-[13px]">{recentLabel || '暂无记录'}</div>
      </div>

      <div className="card mt-3 border border-dashed border-sage/70 bg-transparent shadow-none">
        {grave.lat != null ? '定位已保存 · 打开地图可微调' : '尚未定位 · 编辑时可添加'}
      </div>

      {schedules.length ? (
        <div className="card mt-3">
          <div className="font-semibold mb-1">绑定排程</div>
          {schedules.map((s) => (
            <div key={s.id} className="text-ink2 text-[13px]">
              {s.type} · {s.date} · {s.assignee}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
