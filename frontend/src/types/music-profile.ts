// FMD MusicProfile Schema — Core Type Definitions

export type EnergyLevel = 'low' | 'medium' | 'high'
export type TempoFeel = 'slow' | 'mid' | 'fast'
export type ContentGoal =
  | 'album_cover'
  | 'live_performance'
  | 'demo_planning'
  | 'playlist_mood'
  | 'concept_planning'

export interface MusicProfile {
  emotion: string[]          // 감정 키워드 (melancholic, nostalgic, excited ...)
  energy: EnergyLevel        // 에너지 레벨
  tempo_feel: TempoFeel      // 체감 템포
  genre: string[]            // 장르 후보 (indie rock, ambient ...)
  instrumentation: string[]  // 악기 구성
  sound_direction: string[]  // 사운드 프로덕션 방향
  atmosphere: string[]       // 환경/감각적 무드
  visual_association: string[] // 시각 연상 키워드
  listener_context: string   // 청취 상황/맥락
  content_goal: ContentGoal  // 콘텐츠 활용 목적
  summary: string            // 전체 방향 한 줄 요약 (한국어)
}

export interface AnalysisOptions {
  emotion?: string[]
  genre?: string[]
  content_goal?: ContentGoal
}

export interface AnalyzeRequest {
  input: string
  options?: AnalysisOptions
}

export interface DirectionExplanation {
  music_direction: string    // 음악 제작 방향
  sound_direction: string    // 사운드 편곡 방향
  visual_direction: string   // 비주얼 무드 방향
  content_usage: string      // 콘텐츠 활용 방향
}

export interface AnalysisResult {
  id: string
  input: string
  musicProfile: MusicProfile
  explanation: DirectionExplanation
  createdAt: string
  isMock?: boolean           // 목 모드 여부
}

export interface AnalyzeResponse {
  success: boolean
  data?: AnalysisResult
  error?: string
}

// 로컬 스토리지 히스토리
export interface HistoryItem {
  id: string
  input: string
  summary: string
  createdAt: string
  result: AnalysisResult
}

// 예시 프롬프트
export interface ExamplePrompt {
  id: string
  label: string
  text: string
  tags: string[]
}

// 분석 단계 (로딩 UI)
export interface AnalysisStep {
  id: number
  label: string
  status: 'pending' | 'active' | 'done'
}

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: 1, label: '감정과 분위기 분석', status: 'pending' },
  { id: 2, label: '음악 구조 생성', status: 'pending' },
  { id: 3, label: '사운드 방향 정리', status: 'pending' },
  { id: 4, label: '비주얼 무드 도출', status: 'pending' },
]

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: 'rainy-night',
    label: '비 오는 밤 감성',
    text: '비 오는 밤에 혼자 듣는 감성적인 기타 음악 느낌',
    tags: ['indie', 'melancholic', 'guitar'],
  },
  {
    id: 'punk-live',
    label: '라이브 에너지',
    text: '관중 앞에서 폭발하는 펑크 라이브 공연 같은 에너지',
    tags: ['punk', 'energetic', 'live'],
  },
  {
    id: 'space-ambient',
    label: '우주적 앰비언트',
    text: '우주를 유영하는 듯한 광활하고 몽환적인 전자음악',
    tags: ['ambient', 'electronic', 'space'],
  },
]

// 검증 함수
export function validateMusicProfile(data: unknown): data is MusicProfile {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return (
    Array.isArray(d.emotion) && d.emotion.length > 0 &&
    ['low', 'medium', 'high'].includes(d.energy as string) &&
    ['slow', 'mid', 'fast'].includes(d.tempo_feel as string) &&
    Array.isArray(d.genre) && d.genre.length > 0 &&
    Array.isArray(d.instrumentation) &&
    Array.isArray(d.sound_direction) &&
    Array.isArray(d.atmosphere) &&
    Array.isArray(d.visual_association) &&
    typeof d.listener_context === 'string' &&
    typeof d.content_goal === 'string' &&
    typeof d.summary === 'string' && d.summary.length > 0
  )
}
