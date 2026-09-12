import { Outlet } from 'react-router-dom'
import { BottomTabs } from './BottomTabs'

export function AppShell({ withTabs = false }: { withTabs?: boolean }) {
  return (
    <div className="app-shell">
      <div className={withTabs ? 'pb-tab' : ''}>
        <Outlet />
      </div>
      {withTabs ? <BottomTabs /> : null}
    </div>
  )
}
