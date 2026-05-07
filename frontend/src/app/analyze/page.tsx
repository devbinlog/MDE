'use client'

import { useState, useCallback, useEffect } from 'react'
import { MusicIdeaInput } from '@/components/music-input/MusicIdeaInput'
import { ExamplePromptList } from '@/components/music-input/ExamplePromptList'
import { AnalysisLoading } from '@/components/analysis-result/AnalysisLoading'
import { MusicProfileCard } from '@/components/music-profile/MusicProfileCard'
import { MusicDirectionSummary } from '@/components/analysis-result/MusicDirectionSummary'
import { ResultActions } from '@/components/analysis-result/ResultActions'
import { AlbumMockup } from '@/components/analysis-result/AlbumMockup'
import { EXAMPLE_PROMPTS } from '@/types/music-profile'
import { useAnalyze } from '@/lib/hooks/useAnalyze'
import { saveToHistory } from '@/lib/history'

type Stage = 'input' | 'loading' | 'result'

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: '뮤직 프로파일',
    desc: 'BPM, 키, 장르, 에너지 레벨, 무드 등 음악적 파라미터를 수치화합니다',
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.06)',
    border: 'rgba(37,99,235,0.15)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: '방향성 가이드',
    desc: '레퍼런스 아티스트, 프로덕션 기법, 악기 편성 제안을 제공합니다',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.06)',
    border: 'rgba(14,165,233,0.15)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: '비주얼 콘셉트',
    desc: '앨범 커버 무드, 색상 팔레트, 아트워크 방향성을 함께 생성합니다',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.06)',
    border: 'rgba(99,102,241,0.15)',
  },
]

type AIMode = { mode: 'demo' | 'production'; provider: string; model: string } | null

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>('input')
  const [inputText, setInputText] = useState('')
  const [saved, setSaved] = useState(false)
  const [aiMode, setAiMode] = useState<AIMode>(null)
  const { result, loading, error, analyze } = useAnalyze()

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setAiMode({ mode: d.mode, provider: d.provider, model: d.model }))
      .catch(() => {})
  }, [])

  const handleSubmit = useCallback(async (input: string) => {
    setInputText(input)
    setStage('loading')
    setSaved(false)
    const analysisResult = await analyze({ input })
    if (analysisResult) {
      sessionStorage.setItem('mde_result', JSON.stringify(analysisResult))
      setStage('result')
    } else {
      setStage('input')
    }
  }, [analyze])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageResult = useCallback((payload: { input: string; data: any }) => {
    if (!payload.data) return
    const analysisResult = {
      id: payload.data.id,
      input: payload.input,
      musicProfile: payload.data.musicProfile,
      explanation: payload.data.explanation,
      createdAt: payload.data.createdAt,
      isMock: false,
    }
    sessionStorage.setItem('mde_result', JSON.stringify(analysisResult))
    setInputText(payload.input)
    setStage('result')
  }, [])

  const handleExampleSelect = (text: string) => setInputText(text)
  const handleSave = () => { if (result) { saveToHistory(result); setSaved(true) } }
  const handleRegenerate = () => { if (inputText) handleSubmit(inputText) }
  const handleNewAnalysis = () => { setStage('input'); setInputText(''); setSaved(false) }

  return (
    <div style={{ background: '#fafaf9', minHeight: 'calc(100vh - 60px)' }}>

      {/* ══ 입력 단계 ══════════════════════════════════════════════════════ */}
      {stage === 'input' && (
        <>
          {/* 페이지 헤더 배너 */}
          <div style={{
            background: 'linear-gradient(160deg, #f5f3ff 0%, #fdf4ff 50%, #fafaf9 100%)',
            borderBottom: '1px solid #ece8f8',
            padding: '44px 24px 40px',
          }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#2563eb',
                }}>Music Direction Engine</span>
                {aiMode && (
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                    borderRadius: '100px',
                    background: aiMode.mode === 'demo' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                    color: aiMode.mode === 'demo' ? '#d97706' : '#059669',
                    border: `1px solid ${aiMode.mode === 'demo' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                  }}>
                    {aiMode.mode === 'demo' ? '데모 모드' : aiMode.provider === 'ollama' ? `Ollama · ${aiMode.model}` : aiMode.provider}
                  </span>
                )}
              </div>
              <h1 style={{
                fontSize: '32px', fontWeight: 800, color: '#0f0f14',
                marginBottom: '10px', letterSpacing: '-0.025em', lineHeight: 1.2,
              }}>
                음악 방향성 분석
              </h1>
              <p style={{ fontSize: '15px', color: '#6b6b8a', lineHeight: 1.65, maxWidth: '38rem' }}>
                만들고 싶은 음악의 느낌, 분위기, 상황을 자유롭게 설명하세요.
                AI가 구조화된 뮤직 프로파일과 창작 방향성을 생성합니다.
              </p>
            </div>
          </div>

          {/* 입력 폼 영역 */}
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '36px 24px 0' }}>
            <MusicIdeaInput
              onSubmit={handleSubmit}
              onImageAnalyze={handleImageResult}
              loading={loading}
              initialValue={inputText}
            />
            <div style={{ marginTop: '16px' }}>
              <ExamplePromptList
                examples={EXAMPLE_PROMPTS}
                onSelect={handleExampleSelect}
                disabled={loading}
              />
            </div>
            {error && (
              <div style={{
                marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                color: '#dc2626', fontSize: '13px',
              }}>{error}</div>
            )}
          </div>

          {/* Feature 카드 3열 */}
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '40px 24px 56px' }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, color: '#b0b0c8',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px',
            }}>
              분석 결과에 포함되는 항목
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
            }}>
              {FEATURES.map(f => (
                <div
                  key={f.title}
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${f.border}`,
                    borderRadius: '14px',
                    padding: '22px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: f.bg, color: f.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: '14px',
                  }}>
                    {f.icon}
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f0f14', marginBottom: '6px' }}>{f.title}</p>
                  <p style={{ fontSize: '13px', color: '#6b6b8a', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={{
              marginTop: '32px',
              background: '#ffffff',
              border: '1px solid #e8e8f0',
              borderRadius: '14px',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '0',
            }}>
              {[
                { step: '01', label: '자연어 입력', desc: '느낌과 분위기를 자유롭게 작성' },
                { step: '02', label: 'AI 분석', desc: 'LLM이 음악적 파라미터로 구조화' },
                { step: '03', label: '방향성 도출', desc: '뮤직 프로파일 + 가이드 생성' },
              ].map((s, i) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', marginBottom: '4px' }}>{s.step}</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f0f14', marginBottom: '2px' }}>{s.label}</p>
                    <p style={{ fontSize: '12px', color: '#6b6b8a' }}>{s.desc}</p>
                  </div>
                  {i < 2 && (
                    <svg style={{ width: '20px', height: '20px', color: '#d0d0e0', flexShrink: 0, margin: '0 12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══ 로딩 단계 ═══════════════════════════════════════════════════════ */}
      {stage === 'loading' && (
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '32px 24px' }}>
          <AnalysisLoading />
        </div>
      )}

      {/* ══ 결과 단계 ═══════════════════════════════════════════════════════ */}
      {stage === 'result' && result && (
        <>
          {/* 결과 배너 */}
          <div style={{
            background: 'linear-gradient(160deg, #f0fdf4 0%, #fafaf9 100%)',
            borderBottom: '1px solid #d1fae5',
            padding: '28px 24px',
          }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>분석 완료</span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b6b8a', maxWidth: '40rem' }}>
                  "{inputText.length > 80 ? inputText.slice(0, 80) + '...' : inputText}"
                </p>
              </div>
              <button
                onClick={handleNewAnalysis}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 16px', borderRadius: '8px',
                  background: '#ffffff', border: '1px solid #e8e8f0',
                  fontSize: '13px', fontWeight: 500, color: '#6b6b8a',
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                새 분석
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 결과 컨텐츠 */}
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>뮤직 프로파일</p>
              <MusicProfileCard profile={result.musicProfile} />
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>방향성 가이드</p>
              <MusicDirectionSummary explanation={result.explanation} />
            </div>
            <AlbumMockup profile={result.musicProfile} imageUrl={result.imageUrl} />
            <ResultActions
              result={result}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
              saved={saved}
              regenerating={loading}
            />
          </div>
        </>
      )}
    </div>
  )
}
