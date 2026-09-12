import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { currentFamily, getGrave, saveGrave } from '../lib/store'
import { useDB } from '../lib/useDB'

export function GraveForm({ mode }: { mode: 'new' | 'edit' }) {
  useDB()
  const { id } = useParams()
  const existing = mode === 'edit' && id ? getGrave(id) : undefined
  const family = currentFamily()!
  const nav = useNavigate()

  const [name, setName] = useState(existing?.name ?? '')
  const [memorialFor, setMemorialFor] = useState(existing?.memorialFor ?? '')
  const [address, setAddress] = useState(existing?.address ?? '')
  const [note, setNote] = useState(existing?.note ?? '')
  const [lat, setLat] = useState(existing?.lat != null ? String(existing.lat) : '30.2741')
  const [lng, setLng] = useState(existing?.lng != null ? String(existing.lng) : '120.1551')

  const save = () => {
    if (!name.trim()) return
    const g = saveGrave({
      id: existing?.id,
      familyId: family.id,
      name: name.trim(),
      memorialFor: memorialFor.trim(),
      address: address.trim(),
      note: note.trim(),
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      coverLabel: existing?.coverLabel || '春山封面',
    })
    nav(`/graves/${g.id}`, { replace: true })
  }

  return (
    <div className="px-5 pt-2 safe-bottom min-h-dvh">
      <PageHeader
        title={mode === 'new' ? '新建墓地' : '编辑墓地'}
        right={
          <button type="button" onClick={save}>
            保存
          </button>
        }
      />
      <input className="field mb-3" placeholder="名称，如：青山公墓 A区" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="field mb-3" placeholder="纪念对象，如：祖父 祖母" value={memorialFor} onChange={(e) => setMemorialFor(e.target.value)} />
      <input className="field mb-3" placeholder="地址文案" value={address} onChange={(e) => setAddress(e.target.value)} />
      <textarea className="field field-area mb-3" placeholder="备注：走哪条路、哪座碑…" value={note} onChange={(e) => setNote(e.target.value)} />

      <div className="text-ink2 text-[13px] mb-2">地图定位（占位）</div>
      <div className="map-placeholder mb-3">
        <div className="map-pin" />
      </div>
      <div className="flex gap-2 mb-3">
        <input className="field" placeholder="纬度" value={lat} onChange={(e) => setLat(e.target.value)} />
        <input className="field" placeholder="经度" value={lng} onChange={(e) => setLng(e.target.value)} />
      </div>
      <p className="text-ink2 text-xs mb-4">点击地图选点为演示占位，可手动改经纬度。</p>
      <button type="button" className="btn-primary" onClick={save}>
        保存
      </button>
    </div>
  )
}
