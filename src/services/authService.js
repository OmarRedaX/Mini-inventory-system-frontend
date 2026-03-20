import api from './api.js'
import { setToken, removeToken } from '../utils/auth.js'

// POST /auth/signup  → { email, password, confirmPassword }
export async function signup({ email, password, confirmPassword }) {
  const res = await api.post('/auth/signup', { email, password, confirmPassword })
  return res.data // { message, data: { user: email } }
}

// POST /auth/login → { email, password }
// Response: { message, data: { accessToken, refreshToken } }
export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  const { accessToken } = res.data.data
  setToken(accessToken)
  return res.data
}

export function logout() {
  removeToken()
  window.location.href = '/login'
}
