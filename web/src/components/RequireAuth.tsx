import { Navigate, useLocation } from 'react-router-dom'
import { currentFamily, currentUser } from '../lib/store'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  const user = currentUser()
  if (!user) return <Navigate to="/welcome" replace state={{ from: loc }} />
  if (!currentFamily() && !loc.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />
  }
  return <>{children}</>
}
