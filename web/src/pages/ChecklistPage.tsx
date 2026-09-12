import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RotateCcw, Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useDB } from '../lib/useDB'
import {
  currentUser,
  getChecklist,
  getGrave,
  resetChecklistFromTemplate,
  toggleChecklistItem,
  updateChecklistItems,
} from '../lib/store'
import { uid } from '../lib/ids'

export function ChecklistPage() {
  useDB()
  const { id } = useParams()
  const list = id ? getChecklist(id) : undefined
  const user = currentUser()!
  const [editing, setEditing] = useState(false)

  if (!list) {
    return (
      <div className="px-5 pt-4">
        <PageHeader title="清单" />
        <p className="text-ink2">未找到</p>
      </div>
    )
  }

  const grave = list.graveId ? getGrave(list.graveId) : undefined

  return (
    <div className="px-5 pt-2 safe-bottom min-h-dvh flex flex-col">
      <PageHeader
        title=""
        right={
          <button type="button" className="text-sage-dark" onClick={() => setEditing((e) => !e)}>
            {editing ? '完成' : '编辑'}
          </button>
        }
      />
      <h1 className="text-[20px] font-semibold">{list.title}</h1>
      <p className="text-ink2 text-[13px] mt-1">
        {list.fromTemplate ? '来自模板' : '本次'} · {grave?.name ?? '家庭'}
      </p>

      <div className="mt-4 flex-1">
        {list.items.map((item) => (
          <div key={item.id} className="flex gap-3 py-3.5 border-b border-border items-start">
            <button
              type="button"
              className={`check mt-0.5 ${item.checked ? 'on' : ''}`}
              onClick={() => toggleChecklistItem(list.id, item.id, user.nickname)}
              aria-label="勾选"
            />
            <div className="flex-1">
              {editing ? (
                <input
                  className="field mb-1"
                  value={item.name}
                  onChange={(e) => {
                    updateChecklistItems(
                      list.id,
                      list.items.map((i) =>
                        i.id === item.id ? { ...i, name: e.target.value } : i,
                      ),
                    )
                  }}
                />
              ) : (
                <div className={`font-semibold ${item.checked ? 'text-ink2' : ''}`}>
                  {item.name}
                </div>
              )}
              <div className="text-ink2 text-[13px] mt-0.5">
                ×{item.qty}
                {item.unit ? ` ${item.unit}` : ''}
                {item.required ? ' · 必备' : ''}
                {item.checked && item.checkedBy ? ` · ${item.checkedBy} 已勾` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <button
          type="button"
          className="btn-secondary mt-4 mb-2 gap-2"
          onClick={() => {
            updateChecklistItems(list.id, [
              ...list.items,
              {
                id: uid('i'),
                name: '新物品',
                qty: 1,
                unit: '',
                required: false,
                checked: false,
              },
            ])
          }}
        >
          <Plus size={16} strokeWidth={2.25} aria-hidden />
          添加一项
        </button>
      ) : null}

      <button
        type="button"
        className="btn-secondary mt-4 mb-2 gap-2"
        onClick={() => resetChecklistFromTemplate(list.id)}
      >
        <RotateCcw size={16} strokeWidth={2} aria-hidden />
        从模板重置
      </button>
    </div>
  )
}
