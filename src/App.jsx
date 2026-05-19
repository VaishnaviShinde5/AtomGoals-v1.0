import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import LoginPage from './pages/LoginPage'
import AppShell from './components/shared/AppShell'
import EmployeeDashboard from './pages/employee/Dashboard'
import MyGoals from './pages/employee/MyGoals'
import AddGoal from './pages/employee/AddGoal'
import CheckIn from './pages/employee/CheckIn'
import ManagerDashboard from './pages/manager/Dashboard'
import TeamGoals from './pages/manager/TeamGoals'
import Approvals from './pages/manager/Approvals'
import MgrCheckIn from './pages/manager/CheckIn'
import PushGoal from './pages/manager/PushGoal'
import AdminDashboard from './pages/admin/Dashboard'
import Analytics from './pages/admin/Analytics'
import AuditLog from './pages/admin/AuditLog'
import Escalations from './pages/admin/Escalations'
import CycleConfig from './pages/admin/CycleConfig'
import ExportPage from './pages/admin/Export'

function ProtectedRoute({ children, roles }) {
  const currentUser = useStore(s => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

function RoleHome() {
  const currentUser = useStore(s => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role === 'employee') return <Navigate to="/employee/dashboard" replace />
  if (currentUser.role === 'manager') return <Navigate to="/manager/dashboard" replace />
  return <Navigate to="/admin/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RoleHome />} />

      {/* Employee */}
      <Route path="/employee" element={<ProtectedRoute roles={['employee']}><AppShell /></ProtectedRoute>}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="goals" element={<MyGoals />} />
        <Route path="add-goal" element={<AddGoal />} />
        <Route path="checkin" element={<CheckIn />} />
      </Route>

      {/* Manager */}
      <Route path="/manager" element={<ProtectedRoute roles={['manager']}><AppShell /></ProtectedRoute>}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="team-goals" element={<TeamGoals />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="checkin" element={<MgrCheckIn />} />
        <Route path="push-goal" element={<PushGoal />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AppShell /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="escalations" element={<Escalations />} />
        <Route path="cycle" element={<CycleConfig />} />
        <Route path="export" element={<ExportPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
