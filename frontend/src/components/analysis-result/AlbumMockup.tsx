'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { buildPollinationsUrl, buildImagePrompt } from '@/lib/ai-service/image-prompt-builder'
import type { MusicProfile } from '@/types/music-profile'

interface AlbumMockupProps {
  profile: MusicProfile
}

type State = 'idle' | 'loading' | 'done' | 'error'

export function AlbumMockup({ profile }: AlbumMockupProps) {
  const [state, setState] = useState<State>('idle')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')

  const handleGenerate = useCallback(() => {
    const url = buildPollinationsUrl(profile)
    const p = buildImagePrompt(profile)
    setImageUrl(url)
    setPrompt(p)
    setState('loading')
  }, [profile])

  const handleRegenerate = useCallback(() => {
    const url = buildPollinationsUrl(profile)
    setImageUrl(url)
    setState('loading')
  }, [profile])

  return (
    <div className="border border-fmd-border rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-fmd-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-fmd-text text-sm">앨범 커버 목업</h3>
          <p className="text-xs text-fmd-muted mt-0.5">visual_association 기반 시각적 검증</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-lg bg-fmd-purple/10 text-fmd-purple border border-fmd-purple/20">
          보조 기능
        </span>
      </div>

      <div className="p-6">
        {/* idle 상태 */}
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-fmd-surface border border-fmd-border flex items-center justify-center">
              <svg className="w-7 h-7 text-fmd-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-fmd-text mb-1">앨범 커버 목업 생성</p>
              <p className="text-xs text-fmd-muted">
                {profile.visual_association.slice(0, 3).join(' · ')}
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 rounded-xl bg-fmd-purple text-white text-sm font-medium hover:bg-fmd-purple-light transition-colors"
            >
              목업 생성하기
            </button>
          </div>
        )}

        {/* 로딩 */}
        {state === 'loading' && (
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-xs mx-auto rounded-xl bg-fmd-surface border border-fmd-border overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-fmd-purple border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-fmd-muted">Flux 모델 생성 중...</p>
              </div>
              {/* 실제 이미지 — 로드 완료 시 done으로 전환 */}
              <Image
                src={imageUrl}
                alt="album mockup"
                width={512}
                height={512}
                unoptimized
                className="w-full h-full object-cover opacity-0"
                onLoad={() => setState('done')}
                onError={() => setState('error')}
              />
            </div>
          </div>
        )}

        {/* 완료 */}
        {state === 'done' && (
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-fmd-border">
              <Image
                src={imageUrl}
                alt="album cover mockup"
                width={512}
                height={512}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>

            {/* 프롬프트 */}
            <div className="rounded-xl bg-fmd-surface border border-fmd-border p-3">
              <p className="text-xs text-fmd-muted mb-1">생성 프롬프트</p>
              <p className="text-xs text-fmd-text leading-relaxed line-clamp-2">{prompt}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                className="flex-1 px-4 py-2 rounded-xl border border-fmd-border text-fmd-muted hover:text-fmd-text hover:border-fmd-border-hover text-xs transition-colors"
              >
                다시 생성
              </button>
              <a
                href={imageUrl}
                download="album-mockup.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 rounded-xl border border-fmd-purple/30 text-fmd-purple hover:bg-fmd-purple/10 text-xs text-center transition-colors"
              >
                이미지 저장
              </a>
            </div>

            <p className="text-xs text-fmd-muted text-center">
              이 이미지는 방향성 검증용 목업입니다 · Powered by Pollinations.ai
            </p>
          </div>
        )}

        {/* 에러 */}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-red-400">이미지 생성에 실패했습니다</p>
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 rounded-xl border border-fmd-border text-fmd-muted hover:text-fmd-text text-sm transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
