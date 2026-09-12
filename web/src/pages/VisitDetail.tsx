import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useDB } from '../lib/useDB'
import { getGrave, getVisit } from '../lib/store'

export function VisitDetail() {
  useDB()
  const { id } = useParams()
  const visit = id ? getVisit(id) : undefined
  if (!visit) {
    return (
      <div className="px-5 pt-4">
        <PageHeader title="记录" />
        <p className="text-ink2">未找到</p>
      </div>
    )
  }
  const grave = getGrave(visit.graveId)

  return (
    <div className="px-5 pt-2 safe-bottom">
      <PageHeader title="记录详情" />
      <h1 className="text-[22px] font-semibold">{visit.title || '看望'}</h1>
      <p className="text-ink2 text-sm mt-2">
        {visit.date} · {grave?.name} · {visit.authorName}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap">{visit.body || '（无正文）'}</p>
      {visit.photos.length ? (
        <div className="grid grid-cols-2 gap-2 mt-5">
          {visit.photos.map((src, i) => (
            <img key={i} src={src} alt="" className="rounded-xl w-full aspect-square object-cover" />
          ))}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="aspect-video rounded-xl bg-sage/30" />
          <div className="aspect-video rounded-xl bg-blush/40" />
        </div>
      )}
    </div>
  )
}
