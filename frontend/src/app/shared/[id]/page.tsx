import { notFound } from 'next/navigation'
import { MusicProfileCard } from '@/components/music-profile/MusicProfileCard'
import { MusicDirectionSummary } from '@/components/analysis-result/MusicDirectionSummary'
import { AlbumMockup } from '@/components/analysis-result/AlbumMockup'
import type { AnalysisResult } from '@/types/music-profile'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getShare(id: string): Promise<{ data: AnalysisResult; viewCount: number; createdAt: string } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/share/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.success ? { data: json.data, viewCount: json.viewCount, createdAt: json.createdAt } : null
  } catch {
    return null
  }
}

export default async function SharedResultPage({ params }: PageProps) {
  const { id } = await params
  const result = await getShare(id)

  if (!result) notFound()

  const { data, viewCount } = result

  return (
    <div style={{ background: '#fafaf9', minHeight: 'calc(100vh - 60px)' }}>
      {/* 공유 배너 */}
      <div style={{
        background: 'linear-gradient(160deg, #f0fdf4 0%, #fafaf9 100%)',
        borderBottom: '1px solid #d1fae5',
        padding: '28px 24px',
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600, color: '#059669',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            padding: '4px 10px', borderRadius: '100px',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            공유된 분석 결과
          </div>
          <span style={{ fontSize: '12px', color: '#9898b0' }}>조회 {viewCount}회</span>
        </div>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* 입력 요약 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,92,252,0.06) 0%, rgba(244,114,182,0.04) 100%)',
          border: '1px solid rgba(124,92,252,0.15)',
          borderRadius: '16px', padding: '20px 24px', marginBottom: '32px',
        }}>
          <p style={{ fontSize: '11px', color: '#9898b0', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>분석 입력</p>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0f0f14', lineHeight: 1.4, marginBottom: '8px' }}>{data.input}</h1>
          <p style={{ fontSize: '14px', color: '#6b6b8a', lineHeight: 1.6 }}>{data.musicProfile.summary}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>뮤직 프로파일</p>
            <MusicProfileCard profile={data.musicProfile} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>방향성 가이드</p>
            <MusicDirectionSummary explanation={data.explanation} />
          </div>
          <AlbumMockup profile={data.musicProfile} />

          {/* CTA */}
          <div style={{
            borderTop: '1px solid #e8e8f0', paddingTop: '32px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#6b6b8a', marginBottom: '16px' }}>나만의 음악 방향을 찾고 싶다면</p>
            <a
              href="/analyze"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 24px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c5cfc, #9373fd)',
                color: '#ffffff', fontSize: '14px', fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 6px 20px -4px rgba(124,92,252,0.4)',
              }}
            >
              무료로 분석하기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
