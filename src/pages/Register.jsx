import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { signup } from '../services/authService.js'
import { isLoggedIn } from '../utils/auth.js'

export default function Register() {
  const [form, setForm]     = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (isLoggedIn()) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      await signup(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-sky-500 items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
            <span className="text-white font-bold text-lg">MI</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Register to Mini Inventory</p>
        </div>

        <div className="card p-6 shadow-2xl">
          {success ? (
            <div className="text-center py-4">
              <p className="text-emerald-400 font-medium text-sm">✓ Account created successfully!</p>
              <p className="text-slate-500 text-xs mt-1">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input
                  type="email" value={form.email} placeholder="you@example.com"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input" required autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <input
                  type="password" value={form.password} placeholder="Min 8 chars, upper, lower, number"
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input" required
                />
                <p className="text-xs text-slate-500 mt-1">Must contain uppercase, lowercase, and a number.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password</label>
                <input
                  type="password" value={form.confirmPassword} placeholder="••••••••"
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="input" required
                />
              </div>

              {error && (
                <div className="bg-red-950/60 border border-red-800 rounded-lg px-3 py-2.5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
                {loading
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Creating...</>
                  : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
