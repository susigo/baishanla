import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useDB } from '../lib/useDB'
import { currentFamily, familyGraves, saveSchedule } from '../lib/store'

export function ScheduleNew() {
  useDB()
  const family = currentFamily()!
  const graves = familyGraves(family.id)
  const nav = useNavigate()
  const [type, setType] = useState('清明')
  const [date, setDate] = useState('2026-04-04')
  const [graveId, setGraveId] = useState(graves[0]?.id ?? '')
  const [assignee, setAssignee] = useState('妈妈')
  const [rule, setRule] = useState<'yearly' | 'once'>('yearly')

  const save = () => {
    saveSchedule({
      familyId: family.id,
      graveId: graveId || null,
      type,
      title: type,
      date,
      rule,
      remindDays: [7, 3, 1],
      assignee,
    })
    nav('/schedules', { replace: true })
  }

  return (
    <div className="px-5 pt-2 safe-bottom">
      <PageHeader title="新建排程" right={<button onClick={save}>保存</button>} />
      <select className="field mb-3" value={type} onChange={(e) => setType(e.target.value)}>
        {['清明', '重阳', '忌日', '自定义'].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input className="field mb-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select className="field mb-3" value={graveId} onChange={(e) => setGraveId(e.target.value)}>
        <option value="">家庭级（不绑定墓地）</option>
        {graves.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
      <input className="field mb-3" placeholder="负责人" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
      <select className="field mb-4" value={rule} onChange={(e) => setRule(e.target.value as 'yearly' | 'once')}>
        <option value="yearly">每年</option>
        <option value="once">一次</option>
      </select>
      <button type="button" className="btn-primary" onClick={save}>
        保存
      </button>
    </div>
  )
}
