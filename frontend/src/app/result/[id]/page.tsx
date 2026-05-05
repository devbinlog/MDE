'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MusicProfileCard } from '@/components/music-profile/MusicProfileCard'
import { MusicDirectionSummary } from '@/components/analysis-result/MusicDirectionSummary'
import { AlbumMockup } from '@/components/analysis-result/AlbumMockup'
import { getHistoryItem } from '@/lib/history'
import type { AnalysisResult } from '@/types/music-profile'
import { formatDate } from '@/lib/utils'

export default function ResultDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const id = params.id as string

    const sessionData = sessionStorage.getItem('mde_result')
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData) as AnalysisResult
        if (parsed.id === id || id.startsWith('mock_') || id.startsWith('analysis_')) {
          setResult(parsed)
          return
        }
      } catch {}
    }

    const historyItem = getHistoryItem(id)
    if (historyItem) {
      setResult(historyItem.result)
    } else {
      setNotFound(true)
    }
  }, [params.id])

  if (notFound) {
    return (
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: '#f5f5f8', border: '1px solid #e8e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9898b0" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f0f14', marginBottom: '10px' }}>결과를 찾을 수 없습니다</h2>
        <p style={{ fontSize: '14px', color: '#6b6b8a', marginBottom: '32px' }}>삭제되었거나 만료된 분석 결과입니다.</p>
        <button
          onClick={() => router.push('/analyze')}
          style={{
            padding: '10px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c5cfc, #9373fd)',
            color: '#ffffff', fontSize: '14px', fontWeight: 600,
            border: 'none', cursor: 'pointer',
          }}
        >
          새 분석 시작
        </button>
      </div>
    )
  }

  if (!result) {
    return (
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '32px 24px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ height: '24px', background: '#f0f0f5', borderRadius: '12px', width: '224px', margin: '0 auto' }} />
          <div style={{ height: '16px', background: '#f0f0f5', borderRadius: '12px', width: '288px', margin: '0 auto' }} />
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
        padding: '24px',
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => router.back()}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: '#6b6b8a',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 10px 6px 6px', borderRadius: '8px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              뒤로
            </button>
            {result.isMock && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '100px', background: 'rgba(245,158,11,0.1)',
                color: '#d97706', border: '1px solid rgba(245,158,11,0.25)',
              }}>데모</span>
            )}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(124,92,252,0.05) 0%, rgba(244,114,182,0.03) 100%)',
            border: '1px solid rgba(124,92,252,0.12)',
            borderRadius: '14px', padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9898b0" strokeWidth="2">
                <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
              </svg>
              <span style={{ fontSize: '11px', color: '#9898b0', fontWeight: 500 }}>입력</span>
            </div>
            <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#0f0f14', lineHeight: 1.4, marginBottom: '8px' }}>
              {result.input}
            </h1>
            <p style={{ fontSize: '12px', color: '#9898b0' }}>{formatDate(result.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>뮤직 프로파일</p>
          <MusicProfileCard profile={result.musicProfile} />
        </div>

        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>방향성 가이드</p>
          <MusicDirectionSummary explanation={result.explanation} />
        </div>

        <AlbumMockup profile={result.musicProfile} />

        {/* 액션 버튼 */}
        <div style={{
          display: 'flex', gap: '10px', paddingTop: '24px',
          borderTop: '1px solid #e8e8f0', flexWrap: 'wrap',
        }}>
          <button
            onClick={() => router.push('/analyze')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c5cfc, #9373fd)',
              color: '#ffffff', fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px -2px rgba(124,92,252,0.4)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            새 분석 시작
          </button>
          <button
            onClick={() => router.push('/history')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px',
              background: '#ffffff', color: '#0f0f14',
              fontSize: '14px', fontWeight: 500,
              border: '1px solid #e8e8f0', cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            히스토리 보기
          </button>
        </div>
      </div>
    </div>
  )
}
