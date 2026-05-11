'use client'

import { useState } from 'react'
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
      'MDE 분석 결과',
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

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
    padding: '10px 16px', borderRadius: '10px',
    fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', border: 'none',
    transition: 'opacity 0.15s, background 0.15s',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px', borderTop: '1px solid #e8e8f0' }}>
      {/* 공유 URL 표시 */}
      {shareState === 'done' && shareUrl && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 14px', borderRadius: '10px',
          background: '#f5f9ff', border: '1px solid rgba(37,99,235,0.18)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          <span style={{ fontSize: '12px', color: '#374151', fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shareUrl}
          </span>
          <button
            onClick={handleCopyShareUrl}
            style={{
              ...btnBase,
              padding: '6px 12px', fontSize: '12px',
              background: 'rgba(37,99,235,0.08)', color: '#2563eb',
              border: '1px solid rgba(37,99,235,0.2)',
            }}
          >
            {shareCopied ? '복사됨' : '복사'}
          </button>
        </div>
      )}

      {/* 버튼 그룹 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {/* 전체 복사 */}
        <button
          onClick={handleCopyAll}
          style={{
            ...btnBase,
            background: copied ? 'rgba(16,185,129,0.08)' : '#f5f5f8',
            color: copied ? '#059669' : '#374151',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : '#e8e8f0'}`,
          }}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
          {copied ? '복사됨' : '전체 복사'}
        </button>

        {/* 결과 저장 */}
        <button
          onClick={onSave}
          disabled={saved}
          style={{
            ...btnBase,
            background: saved ? 'rgba(16,185,129,0.08)' : '#ffffff',
            color: saved ? '#059669' : '#374151',
            border: `1px solid ${saved ? 'rgba(16,185,129,0.25)' : '#e8e8f0'}`,
            opacity: saved ? 1 : undefined,
            boxShadow: saved ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {saved ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )}
          {saved ? '저장됨' : '결과 저장'}
        </button>

        {/* 공유 링크 */}
        <button
          onClick={shareState === 'idle' ? handleShare : undefined}
          disabled={shareState === 'loading' || shareState === 'done'}
          style={{
            ...btnBase,
            background: shareState === 'done' ? 'rgba(16,185,129,0.08)' : '#ffffff',
            color: shareState === 'done' ? '#059669' : '#374151',
            border: `1px solid ${shareState === 'done' ? 'rgba(16,185,129,0.25)' : '#e8e8f0'}`,
            boxShadow: shareState !== 'done' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            opacity: shareState === 'loading' ? 0.6 : 1,
          }}
        >
          {shareState === 'loading' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : shareState === 'done' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          )}
          {shareState === 'loading' ? '생성 중' : shareState === 'done' ? '링크 생성됨' : '공유 링크'}
        </button>
      </div>

      {/* 다시 분석 - 별도 행 */}
      <button
        onClick={onRegenerate}
        disabled={regenerating}
        style={{
          ...btnBase,
          width: '100%',
          padding: '12px 20px',
          fontSize: '14px',
          background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
          color: '#ffffff',
          boxShadow: '0 4px 14px -2px rgba(37,99,235,0.35)',
          opacity: regenerating ? 0.7 : 1,
        }}
      >
        {regenerating ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        )}
        {regenerating ? '분석 중...' : '다시 분석'}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
