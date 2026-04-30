import { Outlet, Navigate, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminLayout() {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activePath={location.pathname} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
