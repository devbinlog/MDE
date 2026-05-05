'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const navItems = isLoggedIn
    ? BASE_NAV
    : [...BASE_NAV, { href: '/login', label: '로그인' }, { href: '/signup', label: '회원가입' }]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 로고 */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c5cfc, #f472b6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>M</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontWeight: 700, color: '#0f0f14', fontSize: '14px', letterSpacing: '-0.01em' }}>MDE</span>
            <span style={{ fontSize: '12px', color: '#b0b0c8' }}>Music Direction Engine</span>
          </div>
        </Link>

        {/* 네비 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 14px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#7c5cfc' : '#6b6b8a',
                  background: 'transparent',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
              >
                {item.label}
              </Link>
            )
          })}

          {/* 로그인 상태: 아바타 + 로그아웃 */}
          {isLoggedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c5cfc, #f472b6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {userEmail?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 12px', fontSize: '13px', fontWeight: 500,
                  color: '#6b6b8a', background: 'transparent',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
