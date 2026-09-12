import { NavLink } from 'react-router-dom'
import { Home, MapPinned, BookOpen, User } from 'lucide-react'

const tabs = [
  { to: '/', label: '首页', end: true, Icon: Home },
  { to: '/graves', label: '墓地', Icon: MapPinned },
  { to: '/visits', label: '记录', Icon: BookOpen },
  { to: '/me', label: '我的', Icon: User },
]

export function BottomTabs() {
  return (
    <nav className="tab-bar">
      {tabs.map(({ to, label, end, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `tab-item${isActive ? ' on' : ''}`}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
                color={isActive ? '#7BAF9E' : '#6B776F'}
                absoluteStrokeWidth
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
