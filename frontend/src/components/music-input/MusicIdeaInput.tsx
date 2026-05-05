'use client'

import { useState, useRef, useCallback } from 'react'

interface MusicIdeaInputProps {
  onSubmit: (input: string) => void
  onImageAnalyze?: (result: { input: string; data: unknown }) => void
  loading?: boolean
  initialValue?: string
}

const MAX_LENGTH = 500
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif'

export function MusicIdeaInput({ onSubmit, onImageAnalyze, loading, initialValue = '' }: MusicIdeaInputProps) {
  const [value, setValue] = useState(initialValue)
  const [focused, setFocused] = useState(false)
  const [imageState, setImageState] = useState<'idle' | 'reading' | 'analyzing' | 'done' | 'error'>('idle')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed.length < 10 || loading) return
    onSubmit(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleImageSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('이미지 파일만 업로드 가능합니다.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError('10MB 이하의 이미지만 업로드 가능합니다.')
      return
    }

    setImageError(null)
    setImageState('reading')

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)

      // dataUrl = "data:image/jpeg;base64,<data>"
      const [header, base64Data] = dataUrl.split(',')
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type

      setImageState('analyzing')

      try {
        const res = await fetch('/api/analyze/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mime_type: mimeType, data: base64Data }),
        })

        const json = await res.json()

        if (!json.success) {
          throw new Error(json.detail || json.error || '이미지 분석에 실패했습니다.')
        }

        setImageState('done')

        // Populate textarea with the image description
        const desc = json.data?.imageDescription || json.data?.input || ''
        setValue(desc)
        setTimeout(() => textareaRef.current?.focus(), 100)

        // If parent wants the full result immediately
        if (onImageAnalyze) {
          onImageAnalyze({ input: desc, data: json.data })
        }
      } catch (err) {
        setImageState('error')
        setImageError(err instanceof Error ? err.message : '이미지 분석에 실패했습니다.')
      }
    }
    reader.readAsDataURL(file)
  }, [onImageAnalyze])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImageSelect(file)
  }, [handleImageSelect])

  const clearImage = () => {
    setImagePreview(null)
    setImageState('idle')
    setImageError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const charCount = value.length
  const isValid = charCount >= 10
  const isFull = charCount > MAX_LENGTH * 0.9
  const isAnalyzingImage = imageState === 'reading' || imageState === 'analyzing'

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {/* Image preview strip */}
      {imagePreview && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 14px',
          background: imageState === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(124,92,252,0.05)',
          border: `1px solid ${imageState === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(124,92,252,0.15)'}`,
          borderRadius: '12px',
          marginBottom: '8px',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt="preview" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {isAnalyzingImage && (
              <p style={{ fontSize: 13, color: '#7c5cfc', margin: 0 }}>
                {imageState === 'reading' ? '이미지 읽는 중...' : 'Gemini Vision으로 분석 중...'}
              </p>
            )}
            {imageState === 'done' && (
              <p style={{ fontSize: 13, color: '#059669', margin: 0 }}>이미지 분석 완료 — 아래 텍스트를 확인하고 분석을 시작하세요</p>
            )}
            {imageState === 'error' && (
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{imageError}</p>
            )}
          </div>
          <button type="button" onClick={clearImage} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#b0b0c8', fontSize: 18, lineHeight: 1, flexShrink: 0,
          }}>×</button>
        </div>
      )}

      <div
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '14px',
          border: focused || value.length > 0
            ? '1.5px solid rgba(124,92,252,0.5)'
            : '1.5px solid #e8e8f0',
          boxShadow: focused || value.length > 0
            ? '0 4px 24px -4px rgba(124,92,252,0.15)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={MAX_LENGTH}
          rows={5}
          placeholder={'만들고 싶은 음악의 느낌을 자유롭게 설명해보세요...\n\n예: 비 오는 밤에 혼자 듣는 감성적인 기타 음악 느낌\n또는 이미지를 드래그하거나 📷 버튼으로 업로드하세요'}
          disabled={loading || isAnalyzingImage}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#0f0f14',
            resize: 'none',
            padding: '20px 20px 64px',
            fontSize: '15px',
            lineHeight: 1.7,
            outline: 'none',
            border: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleImageSelect(file)
          }}
        />

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid #f0f0f5',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: isFull ? '#f59e0b' : '#c0c0d0' }}>
              {charCount} / {MAX_LENGTH}
            </span>

            {/* Image upload button */}
            <button
              type="button"
              disabled={loading || isAnalyzingImage}
              onClick={() => fileInputRef.current?.click()}
              title="이미지로 분석 (JPEG, PNG, WebP)"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 7, border: '1px solid #e8e8f0',
                background: isAnalyzingImage ? 'rgba(124,92,252,0.08)' : '#ffffff',
                cursor: loading || isAnalyzingImage ? 'not-allowed' : 'pointer',
                color: isAnalyzingImage ? '#7c5cfc' : '#b0b0c8',
                transition: 'all 0.15s',
                fontSize: 15,
              }}
            >
              {isAnalyzingImage ? '⏳' : '📷'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#c0c0d0' }}>⌘ + Enter</span>
            <button
              type="submit"
              disabled={!isValid || !!loading || isAnalyzingImage}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                fontSize: '13px', fontWeight: 600,
                background: isValid && !loading && !isAnalyzingImage
                  ? 'linear-gradient(135deg, #7c5cfc, #9373fd)'
                  : '#e8e8f0',
                color: isValid && !loading && !isAnalyzingImage ? '#ffffff' : '#b0b0c8',
                cursor: isValid && !loading && !isAnalyzingImage ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              {loading ? '분석 중...' : isAnalyzingImage ? '이미지 분석 중...' : '방향성 분석'}
              {!loading && !isAnalyzingImage && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
