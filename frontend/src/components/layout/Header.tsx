'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { loadHistory } from '@/lib/history'
import type { HistoryItem } from '@/types/music-profile'

interface HeaderProps {
  isLoggedIn: boolean
  userEmail: string | null
}

const BASE_NAV = [
  { href: '/', label: '홈' },
  { href: '/analyze', label: '시작하기' },
  { href: '/history', label: '히스토리' },
]

export function Header({ isLoggedIn, userEmail }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const dropRef = useRef<HTMLDivElement>(null)

  // Load local history when dropdown opens
  useEffect(() => {
    if (open) {
      setHistory(loadHistory().slice(0, 5))
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  const initial = userEmail?.[0]?.toUpperCase() ?? 'U'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
    }}>
      <div style={{
        maxWidth: '72rem', margin: '0 auto', padding: '0 24px',
        height: '60px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* 로고 */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>M</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontWeight: 700, color: '#0f0f14', fontSize: '14px', letterSpacing: '-0.01em' }}>MDE</span>
            <span style={{ fontSize: '12px', color: '#c0c0d0' }}>Music Direction Engine</span>
          </div>
        </Link>

        {/* 오른쪽 영역 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {/* 네비 링크 */}
          {BASE_NAV.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '7px 13px', fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563eb' : '#6b6b8a',
                  textDecoration: 'none', borderRadius: '8px',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Link>
            )
          })}

          {/* 미로그인: 로그인/회원가입 */}
          {!isLoggedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
              <Link href="/login" style={{
                padding: '7px 13px', fontSize: '14px', fontWeight: 500,
                color: '#6b6b8a', textDecoration: 'none', borderRadius: '8px',
              }}>
                로그인
              </Link>
              <Link href="/signup" style={{
                padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                color: '#2563eb', textDecoration: 'none', borderRadius: '8px',
                background: 'rgba(37,99,235,0.07)',
                border: '1px solid rgba(37,99,235,0.2)',
              }}>
                회원가입
              </Link>
            </div>
          )}

          {/* 로그인 상태: 사용자 드롭다운 */}
          {isLoggedIn && (
            <div ref={dropRef} style={{ position: 'relative', marginLeft: '12px' }}>
              <button
                onClick={() => setOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px 5px 5px', borderRadius: '100px',
                  background: open ? 'rgba(37,99,235,0.07)' : '#f5f5f8',
                  border: open ? '1px solid rgba(37,99,235,0.22)' : '1px solid #e8e8f0',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initial}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0f0f14', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userEmail?.split('@')[0] ?? '사용자'}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#9898b0" strokeWidth="2.5"
                  style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* 드롭다운 패널 */}
              {open && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: '280px',
                  background: '#ffffff',
                  border: '1px solid #e8e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  zIndex: 100,
                }}>
                  {/* 사용자 정보 */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}>
                        {initial}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f0f14', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {userEmail?.split('@')[0]}
                        </p>
                        <p style={{ fontSize: '11px', color: '#9898b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 최근 분석 */}
                  <div style={{ padding: '12px 0' }}>
                    <p style={{
                      fontSize: '10px', fontWeight: 700, color: '#b0b0c8',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      padding: '0 16px', marginBottom: '6px',
                    }}>
                      최근 분석
                    </p>
                    {history.length === 0 ? (
                      <p style={{ fontSize: '12px', color: '#c0c0d0', padding: '8px 16px' }}>
                        아직 분석 기록이 없습니다
                      </p>
                    ) : (
                      history.map(item => (
                        <Link
                          key={item.id}
                          href={`/result/${item.id}`}
                          onClick={() => setOpen(false)}
                          style={{
                            display: 'block', padding: '8px 16px',
                            textDecoration: 'none',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f9f9fb')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <p style={{
                            fontSize: '12px', fontWeight: 500, color: '#0f0f14',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            marginBottom: '2px',
                          }}>
                            {item.input}
                          </p>
                          <p style={{ fontSize: '11px', color: '#b0b0c8' }}>
                            {item.summary?.slice(0, 30)}{item.summary?.length > 30 ? '...' : ''}
                          </p>
                        </Link>
                      ))
                    )}

                    <Link
                      href="/history"
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', fontSize: '12px', fontWeight: 600,
                        color: '#2563eb', textDecoration: 'none',
                        borderTop: '1px solid #f0f0f5', marginTop: '4px',
                      }}
                    >
                      전체 히스토리 보기
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* 하단 액션 */}
                  <div style={{ borderTop: '1px solid #f0f0f5', padding: '8px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', padding: '9px', borderRadius: '9px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 500, color: '#9898b0',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'background 0.1s, color 0.1s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f8'; e.currentTarget.style.color = '#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9898b0' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
