import { useEffect, useState } from 'react'
import { authService } from '../core/services/auth.service'
import { AuthContext } from './auth.context'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [sessionError, setSessionError] = useState(null)
  async function retry() {
    setChecking(true); setSessionError(null)
    try { setUser(await authService.me()) }
    catch (error) { setUser(null); if (error.status !== 401) setSessionError(error.message) }
    finally { setChecking(false) }
  }
  useEffect(() => {
    let active = true
    authService.me().then(currentUser => {
      if (active) setUser(currentUser)
    }).catch(error => {
      if (active && error.status !== 401) setSessionError(error.message)
    }).finally(() => { if (active) setChecking(false) })
    return () => { active = false }
  }, [])
  async function login(values) { setUser(await authService.login(values)); setSessionError(null) }
  async function logout() {
    try { await authService.logout() } catch (error) { if (error.status !== 401) throw error }
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, checking, sessionError, login, logout, retry }}>{children}</AuthContext.Provider>
}
