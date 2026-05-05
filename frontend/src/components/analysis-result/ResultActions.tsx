'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { AnalysisResult } from '@/types/music-profile'

interface ResultActionsProps {
  result: AnalysisResult
  onRegenerate: () => void
  onSave: () => void
  saved?: boolean
  regenerating?: boolean
}

export function ResultActions({ result, onRegenerate, onSave, saved, regenerating }: ResultActionsProps) {
  const [copied, setCopied] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [shareUrl, setShareUrl] = useState('')
  const [shareCopied, setShareCopied] = useState(false)

  const handleShare = async () => {
    setShareState('loading')
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      })
      const data = await res.json()
      if (data.success) {
        setShareUrl(data.url)
        setShareState('done')
      } else {
        setShareState('idle')
      }
    } catch {
      setShareState('idle')
    }
  }

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  const handleCopyAll = () => {
    const text = [
      'FMD 분석 결과',
      `입력: ${result.input}`,
      '',
      '[ 음악 요약 ]',
      result.musicProfile.summary,
      '',
      '[ 음악 방향 ]',
      result.explanation.music_direction,
      '',
      '[ 사운드 편곡 ]',
      result.explanation.sound_direction,
      '',
      '[ 비주얼 무드 ]',
      result.explanation.visual_direction,
      '',
      '[ 콘텐츠 활용 ]',
      result.explanation.content_usage,
    ].join('\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px', borderTop: '1px solid #e8e8f0' }}>
      {/* 공유 URL */}
      {shareState === 'done' && shareUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: '#fafaf9', border: '1px solid #e8e8f0' }}>
          <svg className="w-4 h-4 text-fmd-purple flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          <span style={{ fontSize: '12px', color: '#0f0f14', fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareUrl}</span>
          <button
            onClick={handleCopyShareUrl}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 font-medium"
            style={{
              background: 'rgba(124,92,252,0.1)',
              color: '#7c5cfc',
              border: '1px solid rgba(124,92,252,0.2)',
            }}
          >
            {shareCopied ? '복사됨!' : '복사'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        {/* 전체 복사 */}
        <Button variant="ghost" size="sm" onClick={handleCopyAll}>
          {copied ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              복사됨
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              전체 복사
            </>
          )}
        </Button>

        {/* 결과 저장 */}
        <Button variant="secondary" size="sm" onClick={onSave} disabled={saved}>
          {saved ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              저장됨
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              결과 저장
            </>
          )}
        </Button>

        {/* 공유 링크 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          loading={shareState === 'loading'}
          disabled={shareState === 'done'}
        >
          {shareState === 'done' ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              링크 생성됨
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              공유 링크
            </>
          )}
        </Button>

        {/* 다시 분석 */}
        <Button variant="primary" size="sm" onClick={onRegenerate} loading={regenerating} className="ml-auto">
          {!regenerating && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          )}
          다시 분석
        </Button>
      </div>
    </div>
  )
}
