import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'

export default function AdminLogin() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast.error(error)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-brown-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center leading-none">
          <span className="font-display text-5xl italic font-semibold tracking-[-0.04em] text-cream">Venky&apos;s</span>
          <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-gold/80">Authentic Organic Spices</span>
        </div>
        <div className="bg-cream rounded-sm shadow-soft p-8">
          <h1 className="font-display text-2xl text-center mb-1">Admin Login</h1>
          <p className="text-sm text-brown-900/50 text-center mb-8">Sign in to manage Venky's</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brown-900/15 rounded-sm px-4 py-3 text-sm outline-none focus:border-maroon transition-colors"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brown-900/15 rounded-sm px-4 py-3 text-sm outline-none focus:border-maroon transition-colors"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
