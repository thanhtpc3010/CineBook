export function validateAuth(values, mode) {
  const errors = {}
  if (mode === 'register' && !values.fullName?.trim()) errors.fullName = 'Vui lòng nhập họ và tên.'
  if (!values.email?.trim()) errors.email = 'Vui lòng nhập email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Vui lòng nhập email hợp lệ.'
  else if (values.email.length > 150) errors.email = 'Email không được vượt quá 150 ký tự.'
  if (mode === 'register') {
    if ((values.fullName || '').length > 150) errors.fullName = 'Họ và tên không được vượt quá 150 ký tự.'
    if (!values.phoneNumber?.trim()) errors.phoneNumber = 'Vui lòng nhập số điện thoại.'
    else if (!/^\+?[0-9]{9,15}$/.test(values.phoneNumber)) errors.phoneNumber = 'Nhập 9–15 chữ số, có thể bắt đầu bằng dấu +.'
  }
  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu.'
  else if (mode === 'register' && values.password.length < 8) errors.password = 'Mật khẩu cần có ít nhất 8 ký tự.'
  else if (mode === 'register' && values.password.length > 128) errors.password = 'Mật khẩu không được vượt quá 128 ký tự.'
  if (mode === 'register') {
    if (!values.passwordConfirmation) errors.passwordConfirmation = 'Vui lòng nhập lại mật khẩu.'
    else if (values.password !== values.passwordConfirmation) errors.passwordConfirmation = 'Mật khẩu xác nhận chưa khớp.'
  }
  return errors
}
