import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const FEATURES = [
  {
    icon: '✦',
    title: '감정 & 무드 분석',
    desc: '추상적인 감정 표현을 구체적인 음악 키워드로 변환합니다',
    iconColor: '#2563eb',
    iconBg: 'rgba(37,99,235,0.1)',
    cardClass: 'feature-card feature-card--purple',
  },
  {
    icon: '♪',
    title: '장르 & 편곡 방향',
    desc: '어울리는 장르, 악기 구성, 사운드 프로덕션 방향을 제시합니다',
    iconColor: '#14b8a6',
    iconBg: 'rgba(20,184,166,0.1)',
    cardClass: 'feature-card feature-card--teal',
  },
  {
    icon: '◎',
    title: '비주얼 무드 도출',
    desc: '앨범 커버, 뮤직비디오, 콘텐츠에 활용할 비주얼 방향을 제안합니다',
    iconColor: '#f43f5e',
    iconBg: 'rgba(244,63,94,0.1)',
    cardClass: 'feature-card feature-card--rose',
  },
  {
    icon: '↗',
    title: '콘텐츠 활용 전략',
    desc: '음악의 SNS 활용 방향과 타겟 청취 맥락을 구체화합니다',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.1)',
    cardClass: 'feature-card feature-card--amber',
  },
]

const EXAMPLES = [
  {
    input: '비 오는 밤에 혼자 듣는 감성적인 기타 음악 느낌',
    genre: 'indie rock', energy: 'low', tempo: 'slow',
    summary: '빗소리와 어우러지는 잔잔한 기타 선율로 혼자만의 감성적 밤을 그려내는 인디 팝 방향',
    accent: '#2563eb', accentBg: 'rgba(37,99,235,0.08)', accentBorder: 'rgba(37,99,235,0.2)',
  },
  {
    input: '관중 앞에서 폭발하는 펑크 라이브 공연 에너지',
    genre: 'punk rock', energy: 'high', tempo: 'fast',
    summary: '라이브 현장의 날 것 에너지를 담은 강렬하고 직접적인 펑크 록 사운드 방향',
    accent: '#f43f5e', accentBg: 'rgba(244,63,94,0.08)', accentBorder: 'rgba(244,63,94,0.2)',
  },
  {
    input: '우주를 유영하는 듯한 광활하고 몽환적인 전자음악',
    genre: 'ambient', energy: 'low', tempo: 'slow',
    summary: '우주의 광활함을 전자음향으로 표현한 몽환적이고 침잠하는 앰비언트 방향',
    accent: '#14b8a6', accentBg: 'rgba(20,184,166,0.08)', accentBorder: 'rgba(20,184,166,0.2)',
  },
]

export default function HomePage() {
  return (
    <div style={{ width: '100%' }}>

      {/* ══════════ HERO ══════════ */}
      <section
        className="relative overflow-hidden bg-grid-pattern"
        style={{ paddingTop: '112px', paddingBottom: '96px' }}
      >
        {/* 배경 그라디언트 블롭 */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '-120px', left: '50%',
            transform: 'translateX(-50%)',
            width: '900px', height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '120px', right: '-80px',
            width: '500px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem',
            textAlign: 'center', position: 'relative',
          }}
        >
          {/* 배지 */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold"
            style={{
              padding: '5px 14px 5px 10px',
              borderRadius: '100px',
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.2)',
              color: '#2563eb',
              marginBottom: '28px',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#2563eb', flexShrink: 0,
                animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
              }}
            />
            MDE Music Direction Engine
          </div>

          {/* 헤딩 */}
          <h1
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
              color: '#0f0f14',
            }}
          >
            음악 아이디어를
            <br />
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              방향성으로
            </span>
          </h1>

          {/* 설명 */}
          <p
            style={{
              fontSize: '1.05rem',
              color: '#6b6b8a',
              maxWidth: '500px',
              margin: '0 auto 36px',
              lineHeight: 1.75,
            }}
          >
            막연한 음악 아이디어를 AI가 분석해 장르, 감정, 사운드, 비주얼 방향까지
            구조화된 뮤직 프로파일로 변환합니다
          </p>

          {/* CTA */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', flexWrap: 'wrap',
            }}
          >
            <Link href="/analyze">
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#ffffff',
                  fontSize: '0.9rem', fontWeight: 600,
                  padding: '11px 22px',
                  borderRadius: '8px',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 20px -4px rgba(37,99,235,0.45)',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
              >
                방향성 찾기 시작
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
            <Link href="/history">
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#ffffff',
                  color: '#0f0f14',
                  fontSize: '0.9rem', fontWeight: 600,
                  padding: '11px 22px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.13)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'background 0.15s, transform 0.15s',
                }}
              >
                분석 히스토리
              </button>
            </Link>
          </div>

          {/* 통계 */}
          <div
            style={{
              marginTop: '56px',
              display: 'flex', justifyContent: 'center', gap: '48px',
              flexWrap: 'wrap',
              paddingTop: '40px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {[
              { v: '6+', l: '분석 차원' },
              { v: '12', l: '프로파일 항목' },
              { v: '4개', l: '방향성 가이드' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f0f14', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {s.v}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9898b0', marginTop: '6px', fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 기능 소개 ══════════ */}
      <section
        style={{
          background: '#fafaf9',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '88px 0',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* 섹션 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p
              style={{
                fontSize: '0.7rem', fontWeight: 700, color: '#2563eb',
                letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px',
              }}
            >
              Core Features
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 700, color: '#0f0f14',
                letterSpacing: '-0.02em', marginBottom: '10px',
              }}
            >
              무엇을 분석하나요
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b6b8a' }}>
              하나의 문장으로 전체 음악 방향을 구조화합니다
            </p>
          </div>

          {/* 카드 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {FEATURES.map(f => (
              <div key={f.title} className={f.cardClass}>
                <div
                  style={{
                    width: '44px', height: '44px',
                    borderRadius: '12px',
                    background: f.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', color: f.iconColor,
                    marginBottom: '20px',
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f0f14', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#6b6b8a', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 예시 결과 ══════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p
              style={{
                fontSize: '0.7rem', fontWeight: 700, color: '#2563eb',
                letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px',
              }}
            >
              Examples
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 700, color: '#0f0f14',
                letterSpacing: '-0.02em', marginBottom: '8px',
              }}
            >
              이런 결과가 나옵니다
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b6b8a' }}>실제 분석 결과의 요약 예시입니다</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="example-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                {/* 좌: 입력 */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: ex.accentBg,
                        color: ex.accent,
                        border: `1px solid ${ex.accentBorder}`,
                        fontSize: '10px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#9898b0', fontWeight: 500 }}>입력</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#0f0f14', fontWeight: 600, marginBottom: '12px', lineHeight: 1.5 }}>
                    &ldquo;{ex.input}&rdquo;
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem', padding: '3px 10px', borderRadius: '6px',
                        background: ex.accentBg, color: ex.accent,
                        border: `1px solid ${ex.accentBorder}`, fontWeight: 600,
                      }}
                    >
                      {ex.genre}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '6px', background: '#f5f5f8', color: '#6b6b8a', border: '1px solid #e8e8f0' }}>
                      에너지: {ex.energy}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '6px', background: '#f5f5f8', color: '#6b6b8a', border: '1px solid #e8e8f0' }}>
                      템포: {ex.tempo}
                    </span>
                  </div>
                </div>

                {/* 구분선 */}
                <div style={{ width: '1px', height: '56px', background: '#e8e8f0', flexShrink: 0 }} className="hidden md:block" />

                {/* 우: 분석 요약 */}
                <div
                  style={{
                    minWidth: '200px', width: '280px',
                    background: '#fafaf9',
                    border: '1px solid #e8e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span
                      style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: ex.accent, flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#9898b0', fontWeight: 500 }}>분석 요약</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#0f0f14', lineHeight: 1.65 }}>{ex.summary}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/analyze">
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#ffffff',
                  fontSize: '0.9rem', fontWeight: 600,
                  padding: '11px 22px',
                  borderRadius: '8px',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 20px -4px rgba(37,99,235,0.4)',
                }}
              >
                내 음악 방향 분석하기
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ background: '#fafaf9', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '88px 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div
            style={{
              borderRadius: '24px',
              padding: '72px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, #ffffff 50%, rgba(99,102,241,0.04) 100%)',
              border: '1px solid rgba(37,99,235,0.13)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 8px 40px rgba(37,99,235,0.07)',
            }}
          >
            {/* 배경 글로우 */}
            <div
              aria-hidden
              style={{
                position: 'absolute', top: '-40px', left: '10%',
                width: '320px', height: '320px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent)',
                filter: 'blur(60px)', pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', bottom: '-30px', right: '10%',
                width: '260px', height: '260px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
                filter: 'blur(60px)', pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative' }}>
              <p
                style={{
                  fontSize: '0.7rem', fontWeight: 700, color: '#2563eb',
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px',
                }}
              >
                Get Started
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 800, color: '#0f0f14',
                  letterSpacing: '-0.025em', marginBottom: '16px', lineHeight: 1.15,
                }}
              >
                지금 음악 방향을 찾아보세요
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#6b6b8a', marginBottom: '36px', lineHeight: 1.7 }}>
                아이디어 하나면 충분합니다.<br />AI가 나머지를 구조화합니다.
              </p>
              <Link href="/analyze">
                <button
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                    color: '#ffffff',
                    fontSize: '0.9rem', fontWeight: 600,
                    padding: '11px 22px',
                    borderRadius: '8px',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 6px 20px -4px rgba(37,99,235,0.45)',
                  }}
                >
                  무료로 시작하기
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
