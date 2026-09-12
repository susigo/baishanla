import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { loginWithPhone, currentFamily } from '../lib/store'

export function Login() {
  const nav = useNavigate()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const sendCode = () => {
    if (!/^1\d{10}$/.test(phone) && phone.length < 6) {
      setErr('请输入手机号')
      return
    }
    setErr('')
    setSent(true)
  }

  const submit = () => {
    if (code !== '123456') {
      setErr('验证码错误（演示：123456）')
      return
    }
    loginWithPhone(phone)
    nav(currentFamily() ? '/' : '/onboarding', { replace: true })
  }

  return (
    <div className="px-5 pt-2 safe-bottom min-h-dvh flex flex-col">
      <PageHeader title="登录" />
      <p className="text-ink2 text-sm mb-6 px-1">手机号验证码登录 · 演示码 123456</p>
      <label className="text-xs text-ink2 mb-1 px-1">手机号</label>
      <input
        className="field mb-3"
        inputMode="tel"
        placeholder="请输入手机号"
        value={phone}
        onChange={(e) => setPhone(e.target.value.trim())}
      />
      <label className="text-xs text-ink2 mb-1 px-1">验证码</label>
      <div className="flex gap-2 mb-2">
        <input
          className="field flex-1"
          inputMode="numeric"
          placeholder="6 位验证码"
          value={code}
          onChange={(e) => setCode(e.target.value.trim())}
        />
        <button type="button" className="btn-ghost shrink-0" onClick={sendCode}>
          {sent ? '已发送' : '获取验证码'}
        </button>
      </div>
      {err ? <p className="text-blush text-sm mb-2">{err}</p> : null}
      {sent ? <p className="text-sage-dark text-xs mb-4">已发送（演示）：123456</p> : null}
      <button type="button" className="btn-primary mt-4" onClick={submit}>
        登录
      </button>
    </div>
  )
}
