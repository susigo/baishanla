import { Link, useNavigate } from 'react-router-dom'
import { Users, Info } from 'lucide-react'
import { useDB } from '../lib/useDB'
import {
  currentFamily,
  currentUser,
  familyMembers,
  logout,
  resetDemo,
} from '../lib/store'
import { SoftDecor, SproutDivider } from '../components/EmptyState'

export function Me() {
  useDB()
  const user = currentUser()!
  const family = currentFamily()!
  const members = familyMembers(family.id)
  const nav = useNavigate()

  return (
    <div className="px-5 pt-4 relative overflow-hidden">
      <SoftDecor />
      <div className="relative z-10">
        <h1 className="text-[20px] font-semibold mb-4">我的</h1>
        <div className="card flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-sm"
            style={{ background: user.avatarColor || '#7BAF9E' }}
          >
            {user.nickname.slice(0, 1)}
          </div>
          <div>
            <div className="font-semibold">{user.nickname}</div>
            <div className="text-ink2 text-[13px]">{user.phone}</div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="text-ink2 text-[13px]">当前家庭</div>
          <div className="font-semibold mt-1">{family.name}</div>
          <SproutDivider />
        </div>

        <Link to="/me/members" className="card mb-3 flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Users size={18} className="text-sage" strokeWidth={2} />
            成员与邀请
          </span>
          <span className="text-ink2 text-sm">{members.length} 人 ›</span>
        </Link>

        <div className="card mb-3 text-ink2 text-sm leading-relaxed">
          <div className="font-semibold text-ink mb-1 flex items-center gap-2">
            <Info size={16} className="text-sage" />
            关于拜山啦
          </div>
          把看望，轻轻记下来。MVP 演示版，数据保存在本机 localStorage。
        </div>

        <button
          type="button"
          className="btn-secondary mb-3"
          onClick={() => {
            logout()
            nav('/welcome', { replace: true })
          }}
        >
          退出登录
        </button>
        <button
          type="button"
          className="w-full text-center text-ink2 text-sm py-2"
          onClick={() => {
            resetDemo()
            nav('/welcome', { replace: true })
          }}
        >
          重置演示数据
        </button>
      </div>
    </div>
  )
}
