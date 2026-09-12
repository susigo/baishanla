import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '首页', end: true },
  { to: '/graves', label: '墓地' },
  { to: '/visits', label: '记录' },
  { to: '/me', label: '我的' },
]

export function BottomTabs() {
  return (
    <nav className="tab-bar">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => `tab-item${isActive ? ' on' : ''}`}
        >
          <span className="tab-icon" />
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
