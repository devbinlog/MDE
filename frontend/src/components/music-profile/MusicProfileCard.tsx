'use client'

import { useState } from 'react'
import { MusicProfile } from '@/types/music-profile'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface MusicProfileCardProps {
  profile: MusicProfile
}

const ENERGY_LABELS = { low: '낮음', medium: '보통', high: '높음' }
const TEMPO_LABELS = { slow: '느림', mid: '중간', fast: '빠름' }
const CONTENT_LABELS = {
  album_cover: '앨범 커버',
  live_performance: '라이브 공연',
  demo_planning: '데모 기획',
  playlist_mood: '플레이리스트',
  concept_planning: '컨셉 기획',
}
const ENERGY_WIDTH = { low: 'w-1/3', medium: 'w-2/3', high: 'w-full' }

const PROFILE_CARDS = [
  {
    key: 'emotion',
    icon: '✦',
    iconColor: 'text-fmd-purple',
    iconBg: 'bg-fmd-purple/10',
    title: '감정',
    tagColor: 'purple' as const,
  },
  {
    key: 'genre',
    icon: '♪',
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10',
    title: '장르',
    tagColor: 'teal' as const,
  },
  {
    key: 'instrumentation',
    icon: '🎸',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    title: '악기 구성',
    tagColor: 'blue' as const,
  },
  {
    key: 'atmosphere',
    icon: '◈',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
    title: '분위기',
    tagColor: 'rose' as const,
  },
  {
    key: 'visual_association',
    icon: '◎',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    title: '비주얼 연상',
    tagColor: 'amber' as const,
  },
]

export function MusicProfileCard({ profile }: MusicProfileCardProps) {
  const [showJson, setShowJson] = useState(false)

  return (
    <div className="space-y-4">
      {/* 요약 배너 */}
      <div
        className="rounded-2xl px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, rgba(124,92,252,0.1) 0%, rgba(244,114,182,0.05) 100%)',
          border: '1px solid rgba(124,92,252,0.2)',
        }}
      >
        <p className="text-xs text-fmd-muted mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-fmd-purple" />
          음악 방향 요약
        </p>
        <p className="text-sm font-medium text-fmd-text leading-relaxed">{profile.summary}</p>
      </div>

      {/* 에너지 & 템포 */}
      <div className="bg-fmd-surface border border-fmd-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-base flex-shrink-0">
            ⚡
          </div>
          <p className="text-xs font-semibold text-fmd-muted uppercase tracking-wider">에너지 & 템포</p>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-fmd-muted mb-2">
              <span>에너지</span>
              <span className="text-fmd-text font-semibold">{ENERGY_LABELS[profile.energy]}</span>
            </div>
            <div className="h-1.5 bg-fmd-bg rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', ENERGY_WIDTH[profile.energy])}
                style={{ background: 'linear-gradient(90deg, #7c5cfc, #f472b6)' }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-fmd-muted">템포 감각</span>
            <span className="text-xs font-semibold text-fmd-text bg-fmd-bg border border-fmd-border px-3 py-1.5 rounded-lg">
              {TEMPO_LABELS[profile.tempo_feel]}
            </span>
          </div>
        </div>
      </div>

      {/* 프로파일 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROFILE_CARDS.map(card => {
          const values = profile[card.key as keyof MusicProfile] as string[]
          return (
            <div key={card.key} className="bg-fmd-surface border border-fmd-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} text-base flex-shrink-0`}>
                  {card.icon}
                </div>
                <p className="text-xs font-semibold text-fmd-muted uppercase tracking-wider">{card.title}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {values.map(v => (
                  <Tag key={v} label={v} color={card.tagColor} />
                ))}
              </div>
            </div>
          )
        })}

        {/* 청취 맥락 + 콘텐츠 목적 */}
        <div className="bg-fmd-surface border border-fmd-border rounded-2xl p-5 sm:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-fmd-muted uppercase tracking-wider mb-2">청취 맥락</p>
              <p className="text-sm text-fmd-text leading-relaxed">{profile.listener_context}</p>
            </div>
            <div className="sm:border-l sm:border-fmd-border sm:pl-5 flex-shrink-0">
              <p className="text-xs font-semibold text-fmd-muted uppercase tracking-wider mb-2">콘텐츠 목적</p>
              <span
                className="text-xs font-semibold text-fmd-purple px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)' }}
              >
                {CONTENT_LABELS[profile.content_goal]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JSON 토글 */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowJson(v => !v)}
          className="text-fmd-muted/70"
        >
          <svg
            className={cn('w-4 h-4 transition-transform duration-200', showJson && 'rotate-90')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          {showJson ? 'JSON 숨기기' : 'JSON으로 보기'}
        </Button>
        {showJson && <MusicProfileJsonView profile={profile} />}
      </div>
    </div>
  )
}

function MusicProfileJsonView({ profile }: { profile: MusicProfile }) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(profile, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3 relative">
      <div className="absolute top-3 right-3 z-10">
        <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-fmd-muted">
          {copied ? '복사됨 ✓' : '복사'}
        </Button>
      </div>
      <pre className="bg-fmd-bg border border-fmd-border rounded-xl p-5 pr-20 text-xs text-fmd-muted overflow-x-auto leading-relaxed">
        <code>{json}</code>
      </pre>
    </div>
  )
}
