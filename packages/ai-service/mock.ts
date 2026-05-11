// FMD Mock — Sample responses for demo mode (no API key required)

import type { AnalysisResult } from './types'

const MOCK_RESULTS: Record<string, AnalysisResult> = {
  default: {
    id: 'mock_default',
    input: '사용자 입력',
    musicProfile: {
      emotion: ['contemplative', 'nostalgic'],
      energy: 'medium',
      tempo_feel: 'mid',
      genre: ['indie rock', 'alternative'],
      instrumentation: ['clean guitar', 'acoustic guitar', 'live drums', 'bass', 'vocal'],
      sound_direction: ['moderate reverb', 'warm mix', 'balanced stereo', 'natural dynamics'],
      atmosphere: ['intimate room', 'quiet street', 'golden hour'],
      visual_association: ['soft light', 'film grain', 'empty space', 'muted colors'],
      listener_context: '일상의 전환점, 혼자만의 시간',
      content_goal: 'playlist_mood',
      summary: '따뜻하지만 약간 쓸쓸한 감성의 인디 록 기반 음악 방향',
    },
    explanation: {
      music_direction: '중간 템포의 인디 록 구조를 기반으로, 클린 기타와 어쿠스틱이 함께 온기를 만들어냅니다. 복잡하지 않은 코드 진행 위에서 감정이 자연스럽게 흐르도록 구성합니다.',
      sound_direction: '과도한 효과보다는 자연스러운 다이나믹을 살리는 방향입니다. 미드레인지 중심의 따뜻한 믹스에 약간의 룸 리버브를 더해 공간감을 만들어주세요.',
      visual_direction: '채도를 낮춘 따뜻한 톤의 사진 스타일이 어울립니다. 필름 그레인 질감과 자연광을 활용한 조용한 일상 장면이 이 음악의 정서를 잘 표현합니다.',
      content_usage: '일상 브이로그, 감성 플레이리스트 삽입에 적합합니다. 포근한 분위기의 SNS 콘텐츠 배경음악으로도 활용할 수 있으며, 다양한 일상 장면과 자연스럽게 어울립니다.',
    },
    createdAt: new Date().toISOString(),
    isMock: true,
  },
}

const RAINY_RESULT: AnalysisResult = {
  id: 'mock_rainy',
  input: '비 오는 밤에 혼자 듣는 감성적인 기타 음악',
  musicProfile: {
    emotion: ['melancholic', 'nostalgic', 'lonely'],
    energy: 'low',
    tempo_feel: 'slow',
    genre: ['indie rock', 'dream pop'],
    instrumentation: ['clean guitar', 'acoustic guitar', 'soft kick', 'bass', 'vocal'],
    sound_direction: ['heavy reverb', 'warm compression', 'intimate room sound', 'tape saturation'],
    atmosphere: ['rainy night', 'intimate room', 'foggy street'],
    visual_association: ['rain on glass', 'single lamp', 'empty cafe', 'wet pavement'],
    listener_context: '새벽 혼자 방에서, 비 내리는 소리와 함께',
    content_goal: 'playlist_mood',
    summary: '빗소리와 어우러지는 잔잔한 기타 선율로 혼자만의 감성적 밤을 그려내는 인디 팝 방향',
  },
  explanation: {
    music_direction: '느리고 감성적인 4/4박자를 기반으로, 클린 기타의 아르페지오가 곡을 이끌어갑니다. BPM 60-75 범위에서 천천히 호흡하는 구조로, 어쿠스틱과 일렉트릭 기타가 레이어를 이루며 따뜻하지만 쓸쓸한 감정선을 만들어냅니다.',
    sound_direction: '리버브를 적극 활용해 공간감을 크게 열어줍니다. 보컬은 소프트하고 가까운 마이킹으로 친밀감을 강조하고, 드럼은 브러시 스네어로 존재감을 최소화합니다.',
    visual_direction: '어두운 블루-그레이 계열에 단일 조명이 만드는 하이라이트를 중심으로 구성합니다. 빗물이 맺힌 유리창, 흐릿한 네온 반사 등 습기 있는 텍스처를 활용한 저채도 사진 스타일을 권장합니다.',
    content_usage: '심야 시간대 스트리밍 플레이리스트에 최적화된 방향입니다. 새벽감성, 비오는날 플레이리스트 태그와 함께 활용하면 효과적이며, 짧은 루프 영상과 함께 Reels 배경음악으로도 적합합니다.',
  },
  createdAt: new Date().toISOString(),
  isMock: true,
}

export function getMockResult(input: string): AnalysisResult {
  // 입력에 따라 적절한 목 결과 반환
  const lower = input.toLowerCase()
  if (lower.includes('비') || lower.includes('rain') || lower.includes('감성')) {
    return { ...RAINY_RESULT, input, id: \`mock_\${Date.now()}\`, createdAt: new Date().toISOString() }
  }

  // 기본 결과
  return {
    ...MOCK_RESULTS.default,
    input,
    id: \`mock_\${Date.now()}\`,
    createdAt: new Date().toISOString(),
  }
}
