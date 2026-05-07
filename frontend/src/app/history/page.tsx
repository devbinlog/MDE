import { SavedHistoryList } from '@/components/history/SavedHistoryList'

export const metadata = {
  title: '분석 히스토리 — MDE',
}

export default function HistoryPage() {
  return (
    <div style={{ background: '#fafaf9', minHeight: 'calc(100vh - 60px)' }}>

      {/* 페이지 헤더 배너 */}
      <div style={{
        background: 'linear-gradient(160deg, #f5f3ff 0%, #fdf4ff 50%, #fafaf9 100%)',
        borderBottom: '1px solid #ece8f8',
        padding: '44px 24px 40px',
      }}>
        <div style={{
          maxWidth: '56rem', margin: '0 auto',
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#2563eb', marginBottom: '14px',
            }}>History</p>
            <h1 style={{
              fontSize: '32px', fontWeight: 800, color: '#0f0f14',
              marginBottom: '10px', letterSpacing: '-0.025em',
            }}>분석 히스토리</h1>
            <p style={{ fontSize: '15px', color: '#6b6b8a' }}>
              저장한 음악 방향성 분석 결과입니다. 기기 내 로컬에 저장됩니다.
            </p>
          </div>
          <a
            href="/analyze"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '11px 20px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#ffffff', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', flexShrink: 0,
              boxShadow: '0 4px 16px -2px rgba(37,99,235,0.4)',
            }}
          >
            새 분석 시작
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '36px 24px 64px' }}>
        <SavedHistoryList />
      </div>
    </div>
  )
}
