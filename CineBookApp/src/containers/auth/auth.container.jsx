import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import { authService } from '../../core/services/auth.service'
import LoginComponent from './components/login.component'
import RegisterComponent from './components/register.component'
import './auth.css'
import { validateAuth } from './auth.validation'
const currentYear = new Date().getFullYear()
export default function AuthContainer({ mode }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    setError(''); setErrors({})
    const values = Object.fromEntries(new FormData(event.currentTarget))
    values.email = values.email.trim()
    if (mode === 'register') {
      values.fullName = values.fullName.trim()
      values.phoneNumber = values.phoneNumber.trim()
    }
    const validationErrors = validateAuth(values, mode)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      form.elements.namedItem(Object.keys(validationErrors)[0])?.focus()
      return
    }
    setBusy(true)
    try {
      if (mode === 'register') {
        await authService.register(values)
        navigate('/login', { replace: true, state: { notice: 'Đăng ký thành công. Bạn có thể đăng nhập ngay.' } })
      } else { await login(values); navigate('/dashboard', { replace: true }) }
    } catch (failure) {
      setError(failure.message); setErrors(failure.errors || {})
      form.elements.namedItem(Object.keys(failure.errors || {})[0])?.focus()
    }
    finally { setBusy(false) }
  }
  return <main className="auth-page">
    <aside className="cinema-panel">
      <Link className="brand" to="/login" aria-label="CineBook"><span className="brand-symbol" aria-hidden="true">C</span>CINEBOOK<span className="brand-dot">.</span></Link>
      <div className="cinema-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="cinema-ticket"><span>CINEBOOK ORIGINAL</span><strong>YOUR NEXT<br />GREAT STORY.</strong><div className="ticket-line" /><small>ADMIT ONE <span>✦ ✦ ✦</span></small></div><span className="art-star">✦</span></div>
      <div className="cinema-copy"><span className="eyebrow">LIGHTS. CAMERA. YOUR MOMENT.</span><h2>Mỗi tấm vé.<br />Một thế giới mới.</h2><p>Những câu chuyện hay luôn bắt đầu<br />từ một chỗ ngồi dành cho bạn.</p></div>
      <footer>© {currentYear} CineBook<span>ĐIỆN ẢNH KẾT NỐI CHÚNG TA</span></footer>
    </aside>
    <section className="form-panel" aria-label={mode === 'register' ? 'Đăng ký tài khoản' : 'Đăng nhập tài khoản'} onInput={(event) => {
      const name = event.target.name
      if (errors[name]) setErrors(previous => { const next = { ...previous }; delete next[name]; return next })
    }}>
      <div className="mobile-brand">CINEBOOK<span>.</span></div>
      <div className="form-content">{mode === 'register' ? <RegisterComponent onSubmit={submit} busy={busy} error={error} errors={errors} /> : <LoginComponent onSubmit={submit} busy={busy} error={error} errors={errors} notice={location.state?.notice} />}</div>
      <p className="form-footer">BỘ PHIM HAY TIẾP THEO ĐANG CHỜ BẠN</p>
    </section>
  </main>
}
