'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid #e8e8f0',
  background: '#ffffff',
  color: '#0f0f14',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#6b6b8a',
  marginBottom: '6px',
}

const errorBoxStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'rgba(239,68,68,0.07)',
  border: '1px solid rgba(239,68,68,0.18)',
  color: '#dc2626',
  fontSize: '13px',
}

const successBoxStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'rgba(16,185,129,0.07)',
  border: '1px solid rgba(16,185,129,0.18)',
  color: '#059669',
  fontSize: '13px',
}

// ─── 로그인 폼 ────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || data.error || '로그인에 실패했습니다.'); return }
      router.push(from === 'admin' || data.role === 'admin' ? '/admin' : '/analyze')
      router.refresh()
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>이메일</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          required placeholder="you@example.com" style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#7c5cfc' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e8e8f0' }}
        />
      </div>
      <div>
        <label style={labelStyle}>비밀번호</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          required placeholder="••••••••" style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#7c5cfc' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e8e8f0' }}
        />
      </div>
      {error && <div style={errorBoxStyle}>{error}</div>}
      <button
        type="submit" disabled={loading}
        style={{
          width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
          fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #7c5cfc, #9373fd)',
          color: '#ffffff', opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s',
        }}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

// ─── 회원가입 폼 ──────────────────────────────────────────────
function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || data.error || '회원가입에 실패했습니다.'); return }
      setSuccess('계정이 생성되었습니다. 이동합니다...')
      setTimeout(() => { router.push('/analyze'); router.refresh() }, 1200)
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>이메일</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          required placeholder="you@example.com" style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#f472b6' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e8e8f0' }}
        />
      </div>
      <div>
        <label style={labelStyle}>
          비밀번호 <span style={{ fontWeight: 400, color: '#b0b0c8' }}>(6자 이상)</span>
        </label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          required minLength={6} placeholder="••••••••" style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#f472b6' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e8e8f0' }}
        />
      </div>
      <div>
        <label style={labelStyle}>비밀번호 확인</label>
        <input
          type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          required placeholder="••••••••" style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#f472b6' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e8e8f0' }}
        />
      </div>
      {error && <div style={errorBoxStyle}>{error}</div>}
      {success && <div style={successBoxStyle}>{success}</div>}
      <button
        type="submit" disabled={loading}
        style={{
          width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
          fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #f472b6, #e879f9)',
          color: '#ffffff', opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s',
        }}
      >
        {loading ? '처리 중...' : '회원가입'}
      </button>
    </form>
  )
}

// ─── 탭 + 2열 레이아웃 ────────────────────────────────────────
export function AuthForms({ defaultTab = 'login' }: { defaultTab?: 'login' | 'signup' }) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab)

  const tabBtn = (id: 'login' | 'signup', label: string, accent: string): React.CSSProperties => ({
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: tab === id ? 600 : 500,
    color: tab === id ? accent : '#6b6b8a',
    background: tab === id ? (id === 'login' ? 'rgba(124,92,252,0.07)' : 'rgba(244,114,182,0.07)') : 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  return (
    <div>
      {/* 모바일: 탭 전환 */}
      <div
        style={{
          display: 'none',
          justifyContent: 'center',
          gap: '4px',
          marginBottom: '24px',
          background: '#f4f4f7',
          borderRadius: '10px',
          padding: '4px',
        }}
        className="auth-tabs-mobile"
      >
        <button onClick={() => setTab('login')} style={tabBtn('login', '로그인', '#7c5cfc')}>로그인</button>
        <button onClick={() => setTab('signup')} style={tabBtn('signup', '회원가입', '#f472b6')}>회원가입</button>
      </div>

      {/* 데스크탑: 2열 나란히 / 모바일: 탭 선택된 것만 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* 로그인 카드 */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#7c5cfc', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Login
            </p>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f0f14', marginBottom: '4px' }}>로그인</h2>
            <p style={{ fontSize: '13px', color: '#6b6b8a' }}>기존 계정으로 접속하세요</p>
          </div>
          <LoginForm />
        </div>

        {/* 회원가입 카드 */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#f472b6', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Sign up
            </p>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f0f14', marginBottom: '4px' }}>회원가입</h2>
            <p style={{ fontSize: '13px', color: '#6b6b8a' }}>새 계정을 만들어 시작하세요</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
