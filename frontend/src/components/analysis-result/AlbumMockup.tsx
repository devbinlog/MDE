'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { buildPollinationsUrl, buildImagePrompt } from '@/lib/ai-service/image-prompt-builder'
import type { MusicProfile } from '@/types/music-profile'

interface AlbumMockupProps {
  profile: MusicProfile
  imageUrl?: string | null
}

type LoadState = 'idle' | 'loading' | 'done' | 'error'

function preloadImage(url: string, onDone: () => void) {
  const img = new window.Image()
  img.onload = onDone
  img.src = url
}

export function AlbumMockup({ profile, imageUrl: initialUrl }: AlbumMockupProps) {
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [src, setSrc] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Slot A: image user is about to see (or currently seeing)
  const slotA = useRef({ url: initialUrl ?? '', ready: false })
  // Slot B: next image (pre-generated while A is displayed)
  const slotB = useRef({ url: '', ready: false })

  // On mount: fill slot A and start preloading
  useEffect(() => {
    const url = initialUrl || buildPollinationsUrl(profile)
    slotA.current = { url, ready: false }
    preloadImage(url, () => { slotA.current.ready = true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startTimer = () => {
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
  }
  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }
  useEffect(() => () => {
    stopTimer()
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
  }, [])

  const startPreloadingNext = useCallback(() => {
    const nextUrl = buildPollinationsUrl(profile)
    slotB.current = { url: nextUrl, ready: false }
    preloadImage(nextUrl, () => { slotB.current.ready = true })
  }, [profile])

  const showUrl = useCallback((url: string, alreadyReady: boolean) => {
    retryRef.current = 0
    setSrc(url)
    setPrompt(buildImagePrompt(profile))
    setLoadState('loading')
    if (!alreadyReady) startTimer()
  }, [profile])

  const handleGenerate = useCallback(() => {
    showUrl(slotA.current.url, slotA.current.ready)
  }, [showUrl])

  const handleLoad = useCallback(() => {
    stopTimer()
    setLoadState('done')
    startPreloadingNext()
  }, [startPreloadingNext])

  const handleError = useCallback(() => {
    stopTimer()
    if (retryRef.current < 3) {
      retryRef.current += 1
      const delay = retryRef.current * 4000
      retryTimerRef.current = setTimeout(() => {
        // New URL on each retry (fresh seed avoids cached error)
        const newUrl = buildPollinationsUrl(profile)
        slotA.current = { url: newUrl, ready: false }
        setSrc(newUrl)
        startTimer()
      }, delay)
    } else {
      retryRef.current = 0
      setLoadState('error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const handleRegenerate = useCallback(() => {
    // Promote slot B → slot A, start filling slot B again
    slotA.current = { ...slotB.current }
    slotB.current = { url: '', ready: false }
    showUrl(slotA.current.url || buildPollinationsUrl(profile), slotA.current.ready)
  }, [showUrl, profile])

  const GENRE_COLORS: Record<string, { from: string; to: string }> = {
    'punk rock':    { from: '#f43f5e', to: '#fb923c' },
    'indie rock':   { from: '#4f46e5', to: '#818cf8' },
    'ambient':      { from: '#06b6d4', to: '#6ee7b7' },
    'electronic':   { from: '#3b82f6', to: '#8b5cf6' },
    'lo-fi hip hop':{ from: '#f59e0b', to: '#f97316' },
    'dream pop':    { from: '#ec4899', to: '#a855f7' },
    'jazz':         { from: '#d97706', to: '#ca8a04' },
  }
  const firstGenre = profile.genre?.[0]?.toLowerCase() ?? ''
  const colors = GENRE_COLORS[firstGenre] ?? { from: '#2563eb', to: '#6366f1' }

  return (
    <div style={{ border: '1px solid #e8e8f0', borderRadius: '20px', overflow: 'hidden', background: '#ffffff' }}>
      {/* 헤더 */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f0f14' }}>앨범 커버 목업</p>
            <p style={{ fontSize: '11px', color: '#9898b0' }}>AI 비주얼 방향 검증</p>
          </div>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(37,99,235,0.07)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.15)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Flux AI
        </span>
      </div>

      <div style={{ padding: '24px' }}>
        {/* idle */}
        {loadState === 'idle' && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '12px', flexShrink: 0, background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}22)`, border: `1px solid ${colors.from}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.from} strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{ fontSize: '10px', color: colors.from, fontWeight: 600, opacity: 0.7 }}>{firstGenre || 'cover'}</span>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f0f14', marginBottom: '6px' }}>앨범 커버 목업 생성</p>
              <p style={{ fontSize: '12px', color: '#6b6b8a', lineHeight: 1.6, marginBottom: '14px' }}>
                {profile.visual_association?.slice(0, 3).join(', ')} 등의 비주얼 연상어를 바탕으로 Flux AI가 이미지를 생성합니다.
              </p>
              <button onClick={handleGenerate} style={{ padding: '9px 18px', borderRadius: '9px', background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, color: '#ffffff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: `0 4px 14px -2px ${colors.from}55` }}>
                목업 생성하기
              </button>
            </div>
          </div>
        )}

        {/* loading / done */}
        {(loadState === 'loading' || loadState === 'done') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ maxWidth: '280px', width: '100%', margin: '0 auto', position: 'relative' }}>
              <div style={{ aspectRatio: '1', width: '100%', borderRadius: '14px', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${colors.from}18, ${colors.to}18)`, border: loadState === 'done' ? '1px solid #e8e8f0' : `1px solid ${colors.from}33`, boxShadow: loadState === 'done' ? '0 8px 30px rgba(0,0,0,0.1)' : 'none', transition: 'box-shadow 0.4s ease' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="앨범 커버 목업" referrerPolicy="no-referrer" onLoad={handleLoad} onError={handleError} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loadState === 'done' ? 1 : 0, transition: 'opacity 0.4s ease' }} />
                {loadState === 'loading' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(${colors.from}40 1px, transparent 1px)`, backgroundSize: '18px 18px' }} />
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `3px solid ${colors.from}30`, borderTopColor: colors.from, animation: 'spin 1s linear infinite', position: 'relative' }} />
                    <div style={{ textAlign: 'center', position: 'relative' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: colors.from }}>
                        {retryRef.current > 0 ? `재시도 중 (${retryRef.current}/3)...` : '생성 중...'}
                      </p>
                      <p style={{ fontSize: '11px', color: '#9898b0', marginTop: '2px' }}>{elapsed}초</p>
                    </div>
                  </div>
                )}
              </div>
              {loadState === 'done' && (
                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.4)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
              )}
            </div>

            {loadState === 'done' && (
              <>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#f9f9fb', border: '1px solid #ebebf0' }}>
                  <p style={{ fontSize: '10px', color: '#b0b0c8', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>생성 프롬프트</p>
                  <p style={{ fontSize: '11px', color: '#6b6b8a', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prompt}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleRegenerate} style={{ flex: 1, padding: '9px', borderRadius: '9px', background: '#f5f5f8', border: '1px solid #e8e8f0', fontSize: '12px', fontWeight: 600, color: '#6b6b8a', cursor: 'pointer' }}>
                    다시 생성
                  </button>
                  <a href={src} download="album-mockup.jpg" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '9px', borderRadius: '9px', background: `linear-gradient(135deg, ${colors.from}15, ${colors.to}15)`, border: `1px solid ${colors.from}30`, fontSize: '12px', fontWeight: 600, color: colors.from, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    저장
                  </a>
                </div>
              </>
            )}
            {loadState === 'loading' && (
              <p style={{ fontSize: '11px', color: '#b0b0c8', textAlign: 'center' }}>Pollinations.ai Flux Schnell 모델로 생성 중입니다</p>
            )}
          </div>
        )}

        {/* error */}
        {loadState === 'error' && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', flexShrink: 0, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f0f14', marginBottom: '4px' }}>이미지 생성 실패</p>
              <p style={{ fontSize: '12px', color: '#9898b0', marginBottom: '12px' }}>Pollinations.ai 서버가 혼잡합니다. 잠시 후 다시 시도해보세요.</p>
              <button onClick={handleRegenerate} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f5f5f8', border: '1px solid #e8e8f0', fontSize: '12px', fontWeight: 600, color: '#6b6b8a', cursor: 'pointer' }}>
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
