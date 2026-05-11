'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Stats {
  totalUsers: number
  totalSessions: number
  totalShares: number
  totalViews: number
}

interface Share {
  id: string
  viewCount: number
  createdAt: string
  preview: string
}

interface Session {
  id: string
  userId: string | null
  inputText: string
  isMock: boolean
  createdAt: string
}

type Tab = 'overview' | 'sessions' | 'shares'

const STAT_CARDS = (s: Stats) => [
  {
    label: '총 사용자', value: s.totalUsers,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    color: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)',
  },
  {
    label: '총 분석', value: s.totalSessions,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
      </svg>
    ),
    color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)',
  },
  {
    label: '공유 링크', value: s.totalShares,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    ),
    color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
  },
  {
    label: '총 조회수', value: s.totalViews,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [shares, setShares] = useState<Share[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [tab, setTab] = useState<Tab>('overview')

  const fetchData = useCallback(async () => {
    const [statsRes, meRes, sessionsRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/auth/me'),
      fetch('/api/admin/sessions'),
    ])

    if (statsRes.status === 403) {
      router.push('/login?from=admin')
      return
    }

    const [statsData, meData, sessionsData] = await Promise.all([
      statsRes.json(),
      meRes.json(),
      sessionsRes.ok ? sessionsRes.json() : [],
    ])

    setStats(statsData.stats)
    setShares(statsData.recentShares ?? [])
    setSessions(Array.isArray(sessionsData) ? sessionsData : [])
    setUserEmail(meData.user?.email || '')
    setLoading(false)
  }, [router])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleDeleteShare(id: string) {
    if (!confirm('공유 링크를 삭제하시겠습니까?')) return
    await fetch(`/api/share/${id}`, { method: 'DELETE' })
    setShares(prev => prev.filter(s => s.id !== id))
    setStats(prev => prev ? { ...prev, totalShares: prev.totalShares - 1 } : null)
  }

  const fmtDate = (s: string) => s ? new Date(s).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

  if (loading) {
    return (
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[200, 160, 120].map(w => (
            <div key={w} style={{ height: '20px', background: '#f0f0f5', borderRadius: '10px', width: `${w}px` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fafaf9', minHeight: 'calc(100vh - 60px)' }}>

      {/* 헤더 배너 */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e8e8f0',
        padding: '28px 24px',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f0f14', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              대시보드
            </h1>
            <p style={{ fontSize: '13px', color: '#9898b0' }}>{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '9px',
              background: '#ffffff', border: '1px solid #e8e8f0',
              fontSize: '13px', fontWeight: 500, color: '#9898b0', cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            로그아웃
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* 통계 카드 */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '14px',
            marginBottom: '32px',
          }}>
            {STAT_CARDS(stats).map(card => (
              <div key={card.label} style={{
                background: '#ffffff',
                border: `1px solid ${card.border}`,
                borderRadius: '16px',
                padding: '20px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: card.bg, color: card.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '14px',
                }}>
                  {card.icon}
                </div>
                <p style={{ fontSize: '11px', color: '#9898b0', fontWeight: 500, marginBottom: '4px' }}>{card.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#0f0f14', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {card.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 탭 */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '24px',
          background: '#f0f0f5', borderRadius: '10px', padding: '4px',
          width: 'fit-content',
        }}>
          {([
            { key: 'overview', label: '개요' },
            { key: 'sessions', label: `분석 세션 (${sessions.length})` },
            { key: 'shares', label: `공유 링크 (${shares.length})` },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '7px 16px', borderRadius: '7px', fontSize: '13px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: tab === t.key ? '#ffffff' : 'transparent',
                color: tab === t.key ? '#0f0f14' : '#6b6b8a',
                boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 개요 탭 */}
        {tab === 'overview' && (
          <div style={{
            background: '#ffffff', border: '1px solid #e8e8f0',
            borderRadius: '16px', padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f0f14', marginBottom: '20px' }}>
              최근 분석 세션
            </h2>
            {sessions.slice(0, 10).length === 0 ? (
              <p style={{ fontSize: '14px', color: '#b0b0c8', textAlign: 'center', padding: '32px 0' }}>
                분석 기록이 없습니다
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sessions.slice(0, 10).map(s => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '10px',
                    background: '#fafaf9', border: '1px solid #f0f0f5',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      background: s.userId ? 'rgba(37,99,235,0.1)' : 'rgba(0,0,0,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.userId ? '#2563eb' : '#b0b0c8'} strokeWidth="2">
                        <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2zM21 16c0 1.1-.9 2-2 2s-2-.9-2-2z" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', color: '#0f0f14', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.inputText}
                      </p>
                      <p style={{ fontSize: '11px', color: '#b0b0c8', marginTop: '2px' }}>
                        {fmtDate(s.createdAt)} {s.userId ? '· 회원' : '· 비회원'}
                      </p>
                    </div>
                    {s.isMock && (
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '5px', background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.2)', flexShrink: 0 }}>
                        데모
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 세션 탭 */}
        {tab === 'sessions' && (
          <div style={{ background: '#ffffff', border: '1px solid #e8e8f0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f5' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f0f14' }}>전체 분석 세션</p>
              <p style={{ fontSize: '12px', color: '#9898b0', marginTop: '2px' }}>최근 100개</p>
            </div>
            {sessions.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#b0b0c8', textAlign: 'center', padding: '40px' }}>분석 기록이 없습니다</p>
            ) : (
              <div>
                {/* 테이블 헤더 */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 120px 80px 80px',
                  padding: '10px 20px', borderBottom: '1px solid #f0f0f5',
                  fontSize: '11px', fontWeight: 600, color: '#b0b0c8',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  <span>입력</span><span>날짜</span><span>유형</span><span>상태</span>
                </div>
                {sessions.map((s, i) => (
                  <div key={s.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 120px 80px 80px',
                    padding: '12px 20px', borderBottom: i < sessions.length - 1 ? '1px solid #f9f9fb' : 'none',
                    alignItems: 'center',
                  }}>
                    <p style={{ fontSize: '13px', color: '#0f0f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                      {s.inputText}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9898b0' }}>{fmtDate(s.createdAt)}</p>
                    <span style={{ fontSize: '11px', color: s.userId ? '#2563eb' : '#9898b0' }}>
                      {s.userId ? '회원' : '비회원'}
                    </span>
                    <span style={{
                      display: 'inline-block', fontSize: '10px', padding: '2px 7px',
                      borderRadius: '5px', fontWeight: 600,
                      background: s.isMock ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: s.isMock ? '#d97706' : '#059669',
                    }}>
                      {s.isMock ? '데모' : '실제'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 공유 링크 탭 */}
        {tab === 'shares' && (
          <div style={{ background: '#ffffff', border: '1px solid #e8e8f0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f5' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f0f14' }}>공유 링크 목록</p>
            </div>
            {shares.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#b0b0c8', textAlign: 'center', padding: '40px' }}>공유된 분석이 없습니다</p>
            ) : (
              <div>
                {shares.map((share, i) => (
                  <div key={share.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 20px',
                    borderBottom: i < shares.length - 1 ? '1px solid #f9f9fb' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#0f0f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                        {share.preview || '(입력 없음)'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#b0b0c8' }}>
                        <span>ID: {share.id.slice(0, 8)}...</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                          {share.viewCount}회
                        </span>
                        <span>{fmtDate(share.createdAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <a
                        href={`/shared/${share.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 12px', borderRadius: '7px',
                          border: '1px solid #e8e8f0', fontSize: '12px', fontWeight: 500,
                          color: '#6b6b8a', textDecoration: 'none',
                        }}
                      >
                        보기
                      </a>
                      <button
                        onClick={() => handleDeleteShare(share.id)}
                        style={{
                          padding: '6px 12px', borderRadius: '7px',
                          border: '1px solid rgba(239,68,68,0.25)',
                          background: 'rgba(239,68,68,0.05)',
                          fontSize: '12px', fontWeight: 500, color: '#ef4444', cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
