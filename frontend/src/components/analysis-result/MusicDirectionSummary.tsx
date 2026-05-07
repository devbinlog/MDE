'use client'

import { useState } from 'react'
import type { DirectionExplanation } from '@/types/music-profile'

interface MusicDirectionSummaryProps {
  explanation: DirectionExplanation
}

function IconMusic() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function IconSliders() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

type SectionKey = keyof DirectionExplanation

interface Section {
  key: SectionKey
  Icon: () => JSX.Element
  title: string
  color: string
  bg: string
  border: string
}

const SECTIONS: Section[] = [
  {
    key: 'music_direction',
    Icon: IconMusic,
    title: '음악 방향',
    color: '#2563eb', bg: 'rgba(37,99,235,0.07)', border: 'rgba(37,99,235,0.18)',
  },
  {
    key: 'sound_direction',
    Icon: IconSliders,
    title: '사운드 편곡',
    color: '#0284c7', bg: 'rgba(2,132,199,0.07)', border: 'rgba(2,132,199,0.18)',
  },
  {
    key: 'visual_direction',
    Icon: IconEye,
    title: '비주얼 무드',
    color: '#e11d48', bg: 'rgba(225,29,72,0.07)', border: 'rgba(225,29,72,0.18)',
  },
  {
    key: 'content_usage',
    Icon: IconShare,
    title: '콘텐츠 활용',
    color: '#059669', bg: 'rgba(5,150,105,0.07)', border: 'rgba(5,150,105,0.18)',
  },
]

export function MusicDirectionSummary({ explanation }: MusicDirectionSummaryProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {SECTIONS.map(s => {
        const text = explanation[s.key] || ''
        return (
          <div
            key={s.key}
            style={{
              borderRadius: '12px', padding: '16px 18px',
              background: '#ffffff',
              border: `1px solid ${s.border}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 왼쪽 컬러 라인 */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
              background: s.color, borderRadius: '3px 0 0 3px',
            }} />

            <div style={{ paddingLeft: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{
                    width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                    background: s.bg, color: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <s.Icon />
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {s.title}
                  </span>
                </div>
                {/* 내용 */}
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.7, margin: 0 }}>
                  {text}
                </p>
              </div>

              {/* 복사 버튼 */}
              <button
                onClick={() => handleCopy(s.key, text)}
                title="복사"
                style={{
                  flexShrink: 0, marginTop: '2px',
                  width: '28px', height: '28px', borderRadius: '7px',
                  border: '1px solid #e8e8f0', background: '#fafaf9',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: copiedKey === s.key ? '#10b981' : '#b0b0c8',
                  transition: 'color 0.15s',
                }}
              >
                {copiedKey === s.key ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
