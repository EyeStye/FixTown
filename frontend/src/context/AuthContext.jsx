import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true) // true on first load while we verify token

  /* ── Verify stored token on mount ── */
  useEffect(() => {
    const token = localStorage.getItem('ft_token')
    if (!token) { setLoading(false); return }

    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => localStorage.removeItem('ft_token'))
      .finally(() => setLoading(false))
  }, [])

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('ft_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  /* ── Register ── */
  const register = useCallback(async (name, email, password, role = 'citizen') => {
    const res = await api.post('/auth/register', { name, email, password, role })
    localStorage.setItem('ft_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem('ft_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}