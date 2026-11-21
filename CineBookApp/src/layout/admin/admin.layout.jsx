import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { modules } from '../../core/models/modules'
import { useAuth } from '../../auth/auth.context'
import './admin.css'

export default function AdminLayout() {
  const location = useLocation()
  const current = modules.find(([key]) => location.pathname.includes(key)) || modules[1]
  const [logoutError, setLogoutError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try { await logout(); navigate('/login') }
    catch (error) { setLogoutError(error.message) }
    finally { setLoggingOut(false) }
  }
  return <div className="admin-shell">
    <header className="workspace-header">
      <div className="header-inner">
        <Link className="admin-brand" to="/dashboard"><span className="admin-logo"><Icon name="film" size={23} /></span>CINEBOOK<span className="logo-period">.</span><span className="brand-caption">CINEMA WORKSPACE</span></Link>
        <div className="workspace-user"><span className="preview-pill">Bản trải nghiệm</span><span className="user-avatar">CB</span><div><strong>{user?.fullName || user?.email || 'Khách trải nghiệm'}</strong><small>{user ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</small></div>{user ? <button className="header-account" disabled={loggingOut} onClick={handleLogout}>{loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}</button> : <Link className="header-account" to="/login">Đăng nhập<Icon name="arrow" size={15} /></Link>}</div>
      </div>
      <nav className="module-taskbar" aria-label="Module quản lý"><div className="taskbar-inner">{modules.map(([key, label, icon]) => <NavLink key={key} to={`/dashboard/${key}`} className={({ isActive }) => `module-link ${isActive ? 'active' : ''}`}><Icon name={icon} size={18} /><span>{label}</span>{key === 'master-data' && <span className="nav-count">7</span>}</NavLink>)}</div></nav>
    </header>
    <div className="admin-main">
      <div className="admin-topbar"><div className="topbar-left"><span className="breadcrumb-home">Workspace</span><Icon name="chevron" size={12} /><strong>{current[1]}</strong></div><span className="workspace-caption">THE SHOW STARTS HERE</span></div>
      {logoutError && <p className="admin-alert" role="alert">{logoutError}<button className="icon-button" onClick={() => setLogoutError('')} aria-label="Đóng lỗi"><Icon name="close" size={16} /></button></p>}
      <div className="admin-content"><Outlet /></div>
      <footer className="admin-footer"><span>CINEBOOK · CINEMA WORKSPACE</span><span>Dữ liệu minh họa · Chỉ lưu trên trình duyệt này</span></footer>
    </div>
  </div>
}
