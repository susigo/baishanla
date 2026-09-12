import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Shell'
import { RequireAuth } from './components/RequireAuth'
import { Welcome } from './pages/Welcome'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { Graves } from './pages/Graves'
import { GraveForm } from './pages/GraveForm'
import { GraveDetail } from './pages/GraveDetail'
import { Visits } from './pages/Visits'
import { VisitNew } from './pages/VisitNew'
import { VisitDetail } from './pages/VisitDetail'
import { Schedules } from './pages/Schedules'
import { ScheduleNew } from './pages/ScheduleNew'
import { ChecklistPage } from './pages/ChecklistPage'
import { Me } from './pages/Me'
import { Members } from './pages/Members'

// HashRouter works better on static hosts without SPA rewrite rules
const Router = HashRouter

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <Onboarding />
              </RequireAuth>
            }
          />
          <Route
            path="/graves/new"
            element={
              <RequireAuth>
                <GraveForm mode="new" />
              </RequireAuth>
            }
          />
          <Route
            path="/graves/:id/edit"
            element={
              <RequireAuth>
                <GraveForm mode="edit" />
              </RequireAuth>
            }
          />
          <Route
            path="/graves/:id"
            element={
              <RequireAuth>
                <GraveDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/visits/new"
            element={
              <RequireAuth>
                <VisitNew />
              </RequireAuth>
            }
          />
          <Route
            path="/visits/:id"
            element={
              <RequireAuth>
                <VisitDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/schedules"
            element={
              <RequireAuth>
                <Schedules />
              </RequireAuth>
            }
          />
          <Route
            path="/schedules/new"
            element={
              <RequireAuth>
                <ScheduleNew />
              </RequireAuth>
            }
          />
          <Route
            path="/checklists/:id"
            element={
              <RequireAuth>
                <ChecklistPage />
              </RequireAuth>
            }
          />
          <Route
            path="/me/members"
            element={
              <RequireAuth>
                <Members />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          element={
            <RequireAuth>
              <AppShell withTabs />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/graves" element={<Graves />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/me" element={<Me />} />
        </Route>

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  )
}

// silence unused import if tree-shaken differently
