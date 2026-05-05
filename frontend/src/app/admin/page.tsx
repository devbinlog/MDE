'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Share {
  id: string
  viewCount: number
  createdAt: string
  preview: string
}

interface Stats {
  totalShares: number
  totalViews: number
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  const fetchData = useCallback(async () => {
    const [statsRes, meRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/auth/me'),
    ])

    if (statsRes.status === 403) {
      router.push('/login?from=admin')
      return
    }

    const statsData = await statsRes.json()
    const meData = await meRes.json()

    setStats(statsData.stats)
    setShares(statsData.recentShares)
    setUserEmail(meData.user?.email || '')
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleDeleteShare(id: string) {
    if (!confirm('이 공유 링크를 삭제하시겠습니까?')) return
    await fetch(`/api/share/${id}`, { method: 'DELETE' })
    setShares(prev => prev.filter(s => s.id !== id))
    setStats(prev => prev ? { ...prev, totalShares: prev.totalShares - 1 } : null)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ height: '32px', background: '#f0f0f5', borderRadius: '12px', width: '192px' }} />
          <div style={{ height: '16px', background: '#f0f0f5', borderRadius: '12px', width: '256px' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '48px 24px' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-lg bg-fmd-purple/10 text-fmd-purple border border-fmd-purple/20">
              관리자
            </span>
          </div>
          <h1 className="text-2xl font-bold text-fmd-text">FMD 관리자</h1>
          <p className="text-sm text-fmd-muted mt-1">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl border border-fmd-border text-fmd-muted hover:text-fmd-text hover:border-fmd-border-hover text-sm transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-fmd-surface border border-fmd-border rounded-2xl p-6">
          <p className="text-xs text-fmd-muted mb-2">총 공유 링크</p>
          <p className="text-3xl font-bold text-fmd-text">{stats?.totalShares ?? 0}</p>
        </div>
        <div className="bg-fmd-surface border border-fmd-border rounded-2xl p-6">
          <p className="text-xs text-fmd-muted mb-2">총 조회수</p>
          <p className="text-3xl font-bold text-fmd-text">{stats?.totalViews ?? 0}</p>
        </div>
      </div>

      {/* 공유 링크 목록 */}
      <div>
        <h2 className="text-lg font-semibold text-fmd-text mb-4">최근 공유 링크</h2>

        {shares.length === 0 ? (
          <div className="text-center py-12 text-fmd-muted text-sm">
            아직 공유된 분석이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {shares.map(share => (
              <div
                key={share.id}
                className="bg-fmd-surface border border-fmd-border rounded-xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-fmd-text truncate mb-1">
                    {share.preview || '(입력 없음)'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-fmd-muted">
                    <span>ID: {share.id}</span>
                    <span>조회 {share.viewCount}회</span>
                    <span>{new Date(share.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/shared/${share.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg border border-fmd-border text-fmd-muted hover:text-fmd-text transition-colors"
                  >
                    보기
                  </a>
                  <button
                    onClick={() => handleDeleteShare(share.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
