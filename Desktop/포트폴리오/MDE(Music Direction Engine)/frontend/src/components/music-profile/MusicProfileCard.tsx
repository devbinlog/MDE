'use client'

import { useState } from 'react'
import type { MusicProfile } from '@/types/music-profile'

interface MusicProfileCardProps {
  profile: MusicProfile
}

const ENERGY_LABEL: Record<string, string> = { low: '낮음', medium: '보통', high: '높음' }
const TEMPO_LABEL: Record<string, string> = { slow: '느림', mid: '중간', fast: '빠름' }
const CONTENT_LABEL: Record<string, string> = {
  album_cover: '앨범 커버',
  live_performance: '라이브',
  demo_planning: '데모 기획',
  playlist_mood: '음악 방향성',
  concept_planning: '컨셉 기획',
}
const ENERGY_PCT: Record<string, string> = { low: '33%', medium: '66%', high: '100%' }

// compact tag
function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: '11px', fontWeight: 600,
      padding: '3px 9px', borderRadius: '6px',
      background: `${color}12`, color,
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  )
}

const SECTION_COLORS = {
  emotion: '#6366f1',
  genre: '#0d9488',
  instrumentation: '#2563eb',
  atmosphere: '#e11d48',
  visual_association: '#d97706',
}

export function MusicProfileCard({ profile }: MusicProfileCardProps) {
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* 요약 카드 */}
      <div style={{
        padding: '18px 20px', borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(99,102,241,0.04) 100%)',
        border: '1px solid rgba(37,99,235,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>음악 방향 요약</span>
        </div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f0f14', lineHeight: 1.55 }}>{profile.summary}</p>
      </div>

      {/* 2-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

        {/* 에너지 & 템포 */}
        <div style={{ padding: '16px 18px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9898b0" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>에너지 & 템포</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* 에너지 바 */}
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#9898b0' }}>에너지</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f0f14' }}>{ENERGY_LABEL[profile.energy]}</span>
              </div>
              <div style={{ height: '4px', borderRadius: '4px', background: '#f0f0f5', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '4px',
                  width: ENERGY_PCT[profile.energy] ?? '50%',
                  background: 'linear-gradient(90deg, #2563eb, #6366f1)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
            {/* 템포 */}
            <div style={{ flexShrink: 0 }}>
              <span style={{ fontSize: '11px', color: '#9898b0', marginRight: '6px' }}>템포</span>
              <span style={{
                fontSize: '12px', fontWeight: 700, color: '#0f0f14',
                padding: '3px 10px', borderRadius: '6px',
                background: '#f5f5f8', border: '1px solid #e8e8f0',
              }}>
                {TEMPO_LABEL[profile.tempo_feel]}
              </span>
            </div>
          </div>
        </div>

        {/* 감정 */}
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: SECTION_COLORS.emotion, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>감정</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {profile.emotion.map(v => <Tag key={v} label={v} color={SECTION_COLORS.emotion} />)}
          </div>
        </div>

        {/* 장르 */}
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: SECTION_COLORS.genre, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>장르</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {profile.genre.map(v => <Tag key={v} label={v} color={SECTION_COLORS.genre} />)}
          </div>
        </div>

        {/* 악기 구성 */}
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: SECTION_COLORS.instrumentation, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>악기 구성</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {profile.instrumentation.map(v => <Tag key={v} label={v} color={SECTION_COLORS.instrumentation} />)}
          </div>
        </div>

        {/* 분위기 */}
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: SECTION_COLORS.atmosphere, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>분위기</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {profile.atmosphere.map(v => <Tag key={v} label={v} color={SECTION_COLORS.atmosphere} />)}
          </div>
        </div>

        {/* 비주얼 연상 */}
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: SECTION_COLORS.visual_association, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>비주얼 연상</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {profile.visual_association.map(v => <Tag key={v} label={v} color={SECTION_COLORS.visual_association} />)}
          </div>
        </div>

        {/* 청취 맥락 + 목적 */}
        <div style={{ gridColumn: '1 / -1', padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e8e8f0', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>듣는 상황</p>
            <p style={{ fontSize: '13px', color: '#0f0f14', fontWeight: 500 }}>{profile.listener_context}</p>
          </div>
          <div style={{ borderLeft: '1px solid #e8e8f0', paddingLeft: '20px', flexShrink: 0 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#9898b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>콘텐츠 목적</p>
            <span style={{
              fontSize: '12px', fontWeight: 700, color: '#2563eb',
              padding: '4px 10px', borderRadius: '7px',
              background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)',
            }}>
              {CONTENT_LABEL[profile.content_goal as keyof typeof CONTENT_LABEL] || profile.content_goal}
            </span>
          </div>
        </div>
      </div>

      {/* JSON 토글 */}
      <div>
        <button
          onClick={() => setShowJson(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', color: '#9898b0', fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: showJson ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
          {showJson ? 'JSON 숨기기' : 'JSON으로 보기'}
        </button>
        {showJson && (
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                position: 'absolute', top: '10px', right: '10px', zIndex: 1,
                fontSize: '11px', color: '#9898b0', background: '#ffffff',
                border: '1px solid #e8e8f0', borderRadius: '6px',
                padding: '4px 10px', cursor: 'pointer', fontWeight: 600,
              }}
            >
              {copied ? '복사됨 ✓' : '복사'}
            </button>
            <pre style={{
              background: '#f9f9fb', border: '1px solid #e8e8f0',
              borderRadius: '10px', padding: '16px 16px 16px 16px',
              paddingRight: '80px',
              fontSize: '11px', color: '#6b6b8a',
              overflowX: 'auto', lineHeight: 1.7,
              margin: 0,
            }}>
              <code>{JSON.stringify(profile, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
