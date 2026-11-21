import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import AuthContainer from '../../containers/auth/auth.container'
import AdminLayout from '../../layout/admin/admin.layout'
import DashboardContainer from '../../containers/dashboard/dashboard.container'
import MasterDataContainer from '../../containers/master-data/master-data.database.container'
function GuestRoute({ mode }) {
  const { user, checking } = useAuth()
  if (checking) return <div className="route-status" role="status">Đang kiểm tra phiên đăng nhập…</div>
  return user ? <Navigate to="/dashboard" replace /> : <AuthContainer key={mode} mode={mode} />
}
export default function AppRouter() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<GuestRoute mode="login" />} />
    <Route path="/register" element={<GuestRoute mode="register" />} />
    {/* Temporary public workspace. Add backend RBAC and route guards when auth is ready. */}
    <Route path="/dashboard" element={<AdminLayout />}>
      <Route index element={<Navigate to="master-data/theaters" replace />} />
      <Route path="master-data" element={<Navigate to="theaters" replace />} />
      <Route path="master-data/:catalog" element={<MasterDataContainer />} />
      <Route path=":module" element={<DashboardContainer />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter>
}
