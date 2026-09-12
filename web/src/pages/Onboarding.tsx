import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { createFamily, joinFamily } from '../lib/store'

export function Onboarding() {
  const nav = useNavigate()
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    setErr('')
    if (mode === 'create') {
      if (!name.trim()) {
        setErr('请输入家庭名称')
        return
      }
      createFamily(name.trim())
      nav('/', { replace: true })
    } else {
      const f = joinFamily(token)
      if (!f) {
        setErr('邀请码无效（演示可用 INVITE-XIAOLIN）')
        return
      }
      nav('/', { replace: true })
    }
  }

  return (
    <div className="px-5 pt-2 safe-bottom min-h-dvh">
      <PageHeader title="家庭空间" back={false} />
      <p className="text-ink2 text-sm mb-4">先创建一个家庭，或加入已有家庭。</p>
      <div className="flex gap-2 mb-5">
        <button
          type="button"
          className={mode === 'create' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setMode('create')}
        >
          创建家庭
        </button>
        <button
          type="button"
          className={mode === 'join' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setMode('join')}
        >
          加入家庭
        </button>
      </div>
      {mode === 'create' ? (
        <input
          className="field mb-3"
          placeholder="家庭名称，如：小林家"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <input
          className="field mb-3"
          placeholder="粘贴邀请码"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      )}
      {err ? <p className="text-blush text-sm mb-2">{err}</p> : null}
      <button type="button" className="btn-primary" onClick={submit}>
        {mode === 'create' ? '创建并进入' : '加入并进入'}
      </button>
    </div>
  )
}
