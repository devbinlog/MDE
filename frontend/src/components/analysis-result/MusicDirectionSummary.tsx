'use client'

import { useState } from 'react'
import { DirectionExplanation } from '@/types/music-profile'

interface MusicDirectionSummaryProps {
  explanation: DirectionExplanation
}

const SECTIONS = [
  {
    key: 'music_direction' as keyof DirectionExplanation,
    icon: '🎵',
    title: '음악 방향',
    accentColor: 'rgba(124,92,252,1)',
    accentBg: 'rgba(124,92,252,0.08)',
    accentBorder: 'rgba(124,92,252,0.2)',
    textColor: '#7c5cfc',
  },
  {
    key: 'sound_direction' as keyof DirectionExplanation,
    icon: '🎛',
    title: '사운드 편곡',
    accentColor: 'rgba(96,165,250,1)',
    accentBg: 'rgba(96,165,250,0.08)',
    accentBorder: 'rgba(96,165,250,0.2)',
    textColor: '#60a5fa',
  },
  {
    key: 'visual_direction' as keyof DirectionExplanation,
    icon: '🎨',
    title: '비주얼 무드',
    accentColor: 'rgba(251,113,133,1)',
    accentBg: 'rgba(251,113,133,0.08)',
    accentBorder: 'rgba(251,113,133,0.2)',
    textColor: '#fb7185',
  },
  {
    key: 'content_usage' as keyof DirectionExplanation,
    icon: '📱',
    title: '콘텐츠 활용',
    accentColor: 'rgba(52,211,153,1)',
    accentBg: 'rgba(52,211,153,0.08)',
    accentBorder: 'rgba(52,211,153,0.2)',
    textColor: '#34d399',
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
    <div className="space-y-3">
      {SECTIONS.map(section => (
        <div
          key={section.key}
          className="relative bg-fmd-surface rounded-2xl p-6 group hover:border-opacity-50 transition-all duration-200"
          style={{ border: `1px solid ${section.accentBorder}` }}
        >
          {/* 좌측 컬러 바 */}
          <div
            className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
            style={{ background: section.accentColor, marginLeft: '-1px' }}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 pl-4">
              {/* 섹션 헤더 */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: section.accentBg }}
                >
                  {section.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: section.textColor }}>
                  {section.title}
                </span>
              </div>

              {/* 내용 */}
              <p className="text-sm text-fmd-text leading-relaxed">
                {explanation[section.key]}
              </p>
            </div>

            {/* 복사 버튼 */}
            <button
              onClick={() => handleCopy(section.key, explanation[section.key])}
              className="flex-shrink-0 mt-1 p-2 rounded-lg text-fmd-muted/50 hover:text-fmd-muted hover:bg-fmd-bg transition-all duration-150"
              title="복사"
            >
              {copiedKey === section.key ? (
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
