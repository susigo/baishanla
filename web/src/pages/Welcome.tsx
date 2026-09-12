import { Link, Navigate, useNavigate } from 'react-router-dom'
import { HillsArt } from '../components/HillsArt'
import { SproutDivider } from '../components/EmptyState'
import { currentFamily, currentUser, enterDemo } from '../lib/store'

export function Welcome() {
  const nav = useNavigate()
  if (currentUser() && currentFamily()) return <Navigate to="/" replace />

  return (
    <div className="px-7 pt-6 safe-bottom flex flex-col min-h-dvh">
      <div className="mt-6">
        <HillsArt height={200} />
      </div>
      <div className="text-center mt-6">
        <h1 className="text-[32px] font-semibold tracking-wide text-sage-dark">拜山啦</h1>
        <p className="text-ink mt-2 text-[15px]">把看望，轻轻记下来</p>
        <SproutDivider />
      </div>
      <div className="mt-auto space-y-3 pb-4 pt-10">
        <Link to="/login" className="btn-primary">
          开始
        </Link>
        <Link to="/login" className="btn-secondary">
          已有账号登录
        </Link>
        <button
          type="button"
          className="w-full text-center text-ink2 text-sm py-2"
          onClick={() => {
            enterDemo()
            nav('/')
          }}
        >
          进入演示 · 小林家
        </button>
      </div>
    </div>
  )
}
