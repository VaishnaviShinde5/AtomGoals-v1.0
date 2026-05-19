import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, SEED_USERS } from '../store/useStore'
import { Target, LogIn } from 'lucide-react'

const DEMO_CREDENTIALS = [
  { id: 'riya.kapoor',  label: 'Employee',       desc: 'Riya Kapoor · Engineering',   pass: 'emp123',  color: '#3B82F6' },
  { id: 'arjun.mehta',  label: 'Manager (L1)',   desc: 'Arjun Mehta · Engineering',   pass: 'mgr123',  color: '#10B981' },
  { id: 'hr.admin',     label: 'Admin / HR',     desc: 'HR Admin · HR Dept',          pass: 'admin123',color: '#6366F1' },
]

export default function LoginPage() {
  const { login, currentUser } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (currentUser) {
    const path = currentUser.role === 'employee' ? '/employee/dashboard' : currentUser.role === 'manager' ? '/manager/dashboard' : '/admin/dashboard'
    navigate(path, { replace: true })
  }

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = Object.values(SEED_USERS).find(u => u.email === email)
      if (!user) { setError('Email not found.'); setLoading(false); return }
      const demo = DEMO_CREDENTIALS.find(d => d.id === user.id)
      if (!demo || password !== demo.pass) { setError('Invalid password.'); setLoading(false); return }
      login(user.id)
      const path = user.role === 'employee' ? '/employee/dashboard' : user.role === 'manager' ? '/manager/dashboard' : '/admin/dashboard'
      navigate(path, { replace: true })
    }, 400)
  }

  function quickLogin(id) {
    login(id)
    const user = SEED_USERS[id]
    const path = user.role === 'employee' ? '/employee/dashboard' : user.role === 'manager' ? '/manager/dashboard' : '/admin/dashboard'
    navigate(path, { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Target size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>AtomGoals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Goal Setting & Tracking Portal · AtomQuest 1.0</p>
        </div>

        {/* Login form */}
        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Work email</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@atomtech.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 10, textAlign: 'center' }}>Quick access (demo)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_CREDENTIALS.map(d => (
              <button key={d.id} className="btn" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => quickLogin(d.id)}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: d.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                  {SEED_USERS[d.id]?.initials}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{d.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{d.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{d.pass}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 20 }}>
          AtomQuest Hackathon 1.0 · Built with React + Zustand
        </p>
      </div>
    </div>
  )
}
