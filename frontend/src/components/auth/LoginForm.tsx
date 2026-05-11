'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function LoginForm() {
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

      if (!res.ok) {
        setError(data.error || '로그인에 실패했습니다.')
        return
      }

      if (from === 'admin' || data.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/analyze')
      }
      router.refresh()
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-fmd-muted mb-1.5">이메일</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="admin@fmd.dev"
          className="w-full px-4 py-3 rounded-xl bg-fmd-bg border border-fmd-border text-fmd-text placeholder:text-fmd-muted/50 focus:outline-none focus:border-fmd-purple transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-fmd-muted mb-1.5">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-fmd-bg border border-fmd-border text-fmd-text placeholder:text-fmd-muted/50 focus:outline-none focus:border-fmd-purple transition-colors"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-fmd-purple text-white font-medium hover:bg-fmd-purple-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
