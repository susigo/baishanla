import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { CoverPlaceholder } from '../components/CoverPlaceholder'
import { useDB } from '../lib/useDB'
import {
  currentFamily,
  currentUser,
  familyGraves,
  saveVisit,
} from '../lib/store'
import { todayISO } from '../lib/ids'

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function VisitNew() {
  useDB()
  const family = currentFamily()!
  const user = currentUser()!
  const graves = familyGraves(family.id)
  const [params] = useSearchParams()
  const nav = useNavigate()

  const defaultGrave = params.get('graveId') || graves[0]?.id || ''
  const [graveId, setGraveId] = useState(defaultGrave)
  const [date, setDate] = useState(todayISO())
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [openList, setOpenList] = useState(false)

  const dateLabel = useMemo(() => {
    if (date === todayISO()) return '今天'
    return date
  }, [date])

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    const next: string[] = []
    for (const f of Array.from(files).slice(0, 6 - photos.length)) {
      if (f.size > 800_000) {
        next.push(URL.createObjectURL(f))
      } else {
        next.push(await fileToDataUrl(f))
      }
    }
    setPhotos((p) => [...p, ...next].slice(0, 6))
  }

  const publish = () => {
    if (!graveId) return
    const v = saveVisit({
      familyId: family.id,
      graveId,
      date,
      title: title.trim() || dateLabel,
      body: body.trim(),
      tags: [],
      photos,
      authorName: user.nickname,
    })
    if (openList) {
      nav(`/checklists/c-qingming`)
    } else {
      nav(`/visits/${v.id}`, { replace: true })
    }
  }

  return (
    <div className="px-5 pt-2 safe-bottom min-h-dvh flex flex-col">
      <PageHeader
        title=""
        right={
          <button type="button" className="text-sage-dark" onClick={publish}>
            发布
          </button>
        }
      />
      <h1 className="text-[20px] font-semibold mb-3">记一笔</h1>

      <select className="field mb-3" value={graveId} onChange={(e) => setGraveId(e.target.value)}>
        {graves.map((g) => (
          <option key={g.id} value={g.id}>
            墓地 · {g.name}
          </option>
        ))}
      </select>

      <input
        className="field mb-3"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        aria-label={`日期 · ${dateLabel}`}
      />

      <input
        className="field mb-3"
        placeholder="标题（可选）"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="field field-area mb-3"
        placeholder="写几句想记下来的..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="text-ink2 text-[13px] mb-2">照片 / 视频</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <label className="aspect-square rounded-xl border border-dashed border-sage/50 bg-muted-surface flex items-center justify-center text-2xl text-sage-dark cursor-pointer">
          +
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {photos.map((src, i) => (
          <div key={i} className="aspect-square rounded-xl overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {!photos.length ? (
          <>
            <CoverPlaceholder variant="photo" tone="sage" />
            <CoverPlaceholder variant="photo" tone="blush" />
          </>
        ) : null}
      </div>

      <button
        type="button"
        className="card flex items-center gap-3 mb-6"
        onClick={() => setOpenList((v) => !v)}
      >
        <span className={`check ${openList ? 'on' : ''}`} />
        <span className="text-sm">同时打开本次物资清单</span>
      </button>

      <button type="button" className="btn-primary mt-auto" onClick={publish}>
        发布
      </button>
    </div>
  )
}
