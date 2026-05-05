'use client'

import { useEffect, useState } from 'react'
import { ANALYSIS_STEPS } from '@/types/music-profile'

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timings = [800, 1800, 2900, 4000]
    const timers = timings.map((delay, idx) =>
      setTimeout(() => setCurrentStep(idx + 1), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // 경과 시간 카운터 (1초마다)
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const allDone = currentStep >= ANALYSIS_STEPS.length

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '56px 0' }}>
      {/* 아이콘 */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px' }}>
          <div
            className="animate-pulse-ring"
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(124,92,252,0.12)',
            }}
          />
          <div
            style={{
              position: 'relative', width: '80px', height: '80px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #7c5cfc, #f472b6)',
              boxShadow: '0 8px 32px -4px rgba(124,92,252,0.35)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
            </svg>
          </div>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f0f14', marginBottom: '8px' }}>
          음악 방향성 분석 중
        </h2>
        <p style={{ fontSize: '14px', color: '#6b6b8a' }}>
          AI가 당신의 음악 아이디어를 구조화하고 있습니다
        </p>
      </div>

      {/* 스텝 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ANALYSIS_STEPS.map((step, idx) => {
          const status = idx < currentStep ? 'done' : idx === currentStep ? 'active' : 'pending'
          return (
            <div
              key={step.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 18px', borderRadius: '12px',
                background: status === 'active' ? 'rgba(124,92,252,0.06)' : '#ffffff',
                border: status === 'active'
                  ? '1px solid rgba(124,92,252,0.2)'
                  : '1px solid #e8e8f0',
                boxShadow: status === 'active' ? '0 2px 12px rgba(124,92,252,0.08)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                {status === 'done' ? (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                ) : status === 'active' ? (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: '2px solid #7c5cfc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div
                      className="animate-pulse"
                      style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c5cfc' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: '1px solid #e8e8f0',
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '14px', fontWeight: 500,
                color: status === 'done' ? '#059669' : status === 'active' ? '#0f0f14' : '#c0c0d0',
                transition: 'color 0.3s',
              }}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 모든 스텝 완료 후 대기 메시지 */}
      {allDone && (
        <div style={{
          marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
          background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.15)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <svg
            style={{ width: '16px', height: '16px', flexShrink: 0, animation: 'spin 1.2s linear infinite', color: '#7c5cfc' }}
            viewBox="0 0 24 24" fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#7c5cfc', marginBottom: '2px' }}>
              AI 응답 마무리 중...
            </p>
            <p style={{ fontSize: '11px', color: '#9898b0' }}>
              로컬 AI 처리 시간이 걸릴 수 있습니다 ({elapsed}초)
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
