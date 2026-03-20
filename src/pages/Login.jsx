import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { login } from '../services/authService.js'
import { isLoggedIn } from '../utils/auth.js'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (isLoggedIn()) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Subtle dot grid background */}
      <div className="fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-sky-500 items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
            <span className="text-white font-bold text-lg">MI</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Mini Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email" value={form.email} placeholder="you@example.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input" autoComplete="email" required autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input
                type="password" value={form.password} placeholder="••••••••"
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input" autoComplete="current-password" required
              />
            </div>

            {error && (
              <div className="bg-red-950/60 border border-red-800 rounded-lg px-3 py-2.5 text-xs text-red-300">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Signing in...</>
                : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
