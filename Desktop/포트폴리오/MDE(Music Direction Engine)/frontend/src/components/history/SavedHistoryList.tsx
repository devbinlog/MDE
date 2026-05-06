'use client'

import { useState, useEffect } from 'react'
import { HistoryItem } from '@/types/music-profile'
import { loadHistory, deleteHistoryItem } from '@/lib/history'
import { useRouter } from 'next/navigation'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function SavedHistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const router = useRouter()

  useEffect(() => {
    setItems(loadHistory())
  }, [])

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteHistoryItem(id)
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handleOpen = (item: HistoryItem) => {
    sessionStorage.setItem('mde_result', JSON.stringify(item.result))
    router.push(`/result/${item.id}`)
  }

  /* ── 빈 상태 ─────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 100%)',
        border: '1px solid #ece8f8',
        borderRadius: '20px',
        padding: '64px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '72px', height: '72px', margin: '0 auto 24px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(244,114,182,0.12))',
          border: '1px solid rgba(37,99,235,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
          </svg>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f0f14', marginBottom: '10px' }}>
          저장된 분석이 없습니다
        </h3>
        <p style={{ fontSize: '14px', color: '#6b6b8a', marginBottom: '28px', lineHeight: 1.6 }}>
          음악 방향성을 분석하고 결과를 저장하면<br />여기에서 다시 확인할 수 있습니다.
        </p>

        <a
          href="/analyze"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff', fontSize: '14px', fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 6px 20px -4px rgba(37,99,235,0.45)',
          }}
        >
          분석 시작하기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          textAlign: 'left',
        }}>
          {[
            { icon: '💡', text: '분석 결과 페이지에서 "저장" 버튼을 누르세요' },
            { icon: '🔒', text: '로컬 스토리지에 저장되어 로그인 없이도 유지됩니다' },
            { icon: '🗂️', text: '저장된 결과를 클릭하면 상세 페이지로 이동합니다' },
          ].map(h => (
            <div
              key={h.text}
              style={{
                background: '#ffffff', border: '1px solid #e8e8f0',
                borderRadius: '10px', padding: '14px',
                display: 'flex', gap: '10px',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{h.icon}</span>
              <p style={{ fontSize: '12px', color: '#6b6b8a', lineHeight: 1.5 }}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── 히스토리 목록 ──────────────────────────────────────────────── */
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#b0b0c8', marginBottom: '20px' }}>
        총 {items.length}개의 분석 결과
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => handleOpen(item)}
            style={{
              background: '#ffffff', border: '1px solid #e8e8f0',
              borderRadius: '14px', padding: '20px',
              cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '16px',
              transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(37,99,235,0.3)'
              el.style.boxShadow = '0 4px 20px rgba(37,99,235,0.08)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = '#e8e8f0'
              el.style.boxShadow = 'none'
              el.style.transform = 'translateY(0)'
            }}
          >
            {/* 번호 배지 */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#2563eb', flexShrink: 0,
            }}>
              {items.length - i}
            </div>

            {/* 내용 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '15px', fontWeight: 600, color: '#0f0f14', marginBottom: '6px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.input}
              </p>
              <p style={{
                fontSize: '13px', color: '#6b6b8a', marginBottom: '10px', lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {item.summary}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.result.isMock && (
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                    borderRadius: '100px', background: 'rgba(37,99,235,0.08)',
                    color: '#2563eb', border: '1px solid rgba(37,99,235,0.18)',
                  }}>데모</span>
                )}
                <span style={{ fontSize: '12px', color: '#b0b0c8' }}>
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>

            {/* 우측 액션 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button
                onClick={e => handleDelete(e, item.id)}
                title="삭제"
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#c0c0d0', transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#ef4444'
                  e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#c0c0d0'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </button>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0c0d0" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
