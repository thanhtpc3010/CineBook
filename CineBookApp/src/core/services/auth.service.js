const base = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')
export class ApiError extends Error {
  constructor(message, status, errors = {}) { super(message); this.status = status; this.errors = errors }
}
async function request(path, options = {}) {
  const token = document.cookie.split('; ').find(value => value.startsWith('XSRF-TOKEN='))?.slice(11)
  let response
  try {
    response = await fetch(`${base}${path}`, {
      credentials: 'include', ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { 'X-XSRF-TOKEN': decodeURIComponent(token) } : {}) },
    })
  } catch { throw new ApiError('Không thể kết nối máy chủ. Vui lòng thử lại sau.', 0) }
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status >= 500 || !payload ? 'Dịch vụ xác thực hiện chưa sẵn sàng. Vui lòng thử lại sau.' : payload.message || 'Yêu cầu không thành công.', response.status, payload?.errors)
  if (response.status !== 204 && !payload) throw new ApiError('Dữ liệu trả về từ máy chủ không hợp lệ.', 502)
  return payload
}
async function me() {
  const payload = await request('/auth/me')
  const user = payload?.data?.user || payload?.data
  if (!user?.email) throw new ApiError('Không nhận được thông tin tài khoản.', 502)
  return user
}
export const authService = {
  me,
  async login(values) { await request('/auth/login', { method: 'POST', body: JSON.stringify(values) }); return me() },
  register(values) { return request('/auth/register', { method: 'POST', body: JSON.stringify(values) }) },
  logout() { return request('/auth/logout', { method: 'POST' }) },
}
