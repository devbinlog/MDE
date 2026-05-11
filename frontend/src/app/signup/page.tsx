import { Suspense } from 'react'
import { AuthForms } from '@/components/auth/AuthForms'

export const metadata = { title: '회원가입 — MDE' }

export default function SignupPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 24px 64px',
        background: '#fafaf9',
      }}
    >
      <div style={{ width: '100%', maxWidth: '60rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f0f14', marginBottom: '8px' }}>
            MDE 계정
          </h1>
          <p style={{ fontSize: '14px', color: '#6b6b8a' }}>
            로그인하거나 새 계정을 만드세요
          </p>
        </div>

        <Suspense>
          <AuthForms defaultTab="signup" />
        </Suspense>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#c0c0d0', marginTop: '32px' }}>
          MDE — Music Direction Engine
        </p>
      </div>
    </div>
  )
}
