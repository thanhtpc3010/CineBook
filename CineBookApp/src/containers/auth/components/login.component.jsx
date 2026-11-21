import { Link } from 'react-router-dom'
import FormField from '../../../components/FormField'
export default function LoginComponent({ onSubmit, busy, error, errors, notice }) {
  return <>
    <div className="form-heading"><span className="eyebrow">CHÀO MỪNG TRỞ LẠI</span><h1>Đăng nhập</h1><p>Tiếp tục hành trình điện ảnh của bạn.</p></div>
    {notice && <p className="notice success" role="status">{notice}</p>}
    {error && <p className="notice" role="alert">{error}</p>}
    <form onSubmit={onSubmit} noValidate><fieldset disabled={busy}>
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="ban@example.com" required maxLength={150} error={errors.email} />
      <FormField label="Mật khẩu" name="password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu của bạn" required error={errors.password} />
      <button className="primary-button" type="submit">{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}<span aria-hidden="true">↗</span></button>
    </fieldset></form>
    <p className="switch-form">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
  </>
}
