import { Link } from 'react-router-dom'
import FormField from '../../../components/FormField'
export default function RegisterComponent({ onSubmit, busy, error, errors }) {
  return <>
    <div className="form-heading"><span className="eyebrow">BẮT ĐẦU HÀNH TRÌNH</span><h1>Tạo tài khoản</h1><p>Một tài khoản, mọi khoảnh khắc điện ảnh.</p></div>
    {error && <p className="notice" role="alert">{error}</p>}
    <form onSubmit={onSubmit} noValidate><fieldset disabled={busy}>
      <FormField label="Họ và tên" name="fullName" autoComplete="name" placeholder="Nguyễn Văn An" required maxLength={150} error={errors.fullName} />
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="ban@example.com" required maxLength={150} error={errors.email} />
      <FormField label="Số điện thoại" name="phoneNumber" type="tel" autoComplete="tel" inputMode="tel" placeholder="0901234567" required maxLength={20} error={errors.phoneNumber} />
      <FormField label="Mật khẩu" name="password" type="password" autoComplete="new-password" placeholder="Tối thiểu 8 ký tự" required minLength={8} maxLength={128} error={errors.password} />
      <FormField label="Xác nhận mật khẩu" name="passwordConfirmation" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" required minLength={8} maxLength={128} error={errors.passwordConfirmation} />
      <button className="primary-button" type="submit">{busy ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}<span aria-hidden="true">↗</span></button>
    </fieldset></form>
    <p className="switch-form">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
  </>
}
