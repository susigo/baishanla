import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useDB } from '../lib/useDB'
import { currentFamily, familyMembers } from '../lib/store'

export function Members() {
  useDB()
  const family = currentFamily()!
  const members = familyMembers(family.id)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const text = family.inviteToken
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const roleLabel = { owner: '所有者', editor: '编辑', viewer: '查看' } as const

  return (
    <div className="px-5 pt-2 safe-bottom">
      <PageHeader title="成员与邀请" />
      <div className="card mb-4">
        <div className="text-ink2 text-[13px] mb-1">邀请码</div>
        <div className="font-semibold tracking-wide">{family.inviteToken}</div>
        <button type="button" className="btn-primary mt-3 h-11 text-sm" onClick={copy}>
          {copied ? '已复制' : '复制邀请码'}
        </button>
      </div>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.userId} className="card flex justify-between items-center">
            <div>
              <div className="font-semibold">{m.nickname}</div>
              <div className="text-ink2 text-xs mt-0.5">加入于 {m.joinedAt}</div>
            </div>
            <span className="chip">{roleLabel[m.role]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
