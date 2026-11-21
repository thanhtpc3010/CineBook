import { useState } from 'react'
export default function FormField({ label, name, error, type = 'text', ...props }) {
  const [visible, setVisible] = useState(false)
  const password = type === 'password'
  return <div className="form-field">
    <label htmlFor={name}>{label}{props.required && <span className="required-mark" aria-hidden="true"> *</span>}</label>
    <div className="input-wrap">
      {error && <div className="film-tooltip" id={`${name}-error`} role="alert">
        <svg className="film-reel" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="18" r="2" fill="currentColor"/><circle cx="18" cy="9" r="4" fill="currentColor"/><circle cx="27" cy="18" r="4" fill="currentColor"/><circle cx="18" cy="27" r="4" fill="currentColor"/><circle cx="9" cy="18" r="4" fill="currentColor"/><path d="M24 32c5 1 5 5 12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <span><strong>Khoan, còn thiếu một cảnh!</strong><span>{Array.isArray(error) ? error[0] : error}</span></span>
      </div>}
      <input id={name} name={name} type={password && visible ? 'text' : type} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} {...props} />
      {password && <button className="password-toggle" type="button" aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Ẩn' : 'Hiện'}</button>}
    </div>
  </div>
}
