import { NextResponse } from 'next/server'

const EXAMPLES = [
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
  {
    id: 'morning-coffee',
    label: '아침 카페 재즈',
    text: '맑은 아침 카페에서 커피 한 잔과 함께하는 따뜻한 재즈 사운드',
    tags: ['jazz', 'warm', 'morning'],
  },
  {
    id: 'late-night-drive',
    label: '심야 드라이브',
    text: '도시의 불빛 속 새벽 드라이브, 약간의 쓸쓸함과 자유로움이 공존하는',
    tags: ['synth-pop', 'nocturnal', 'drive'],
  },
]

export async function GET() {
  return NextResponse.json({ success: true, data: EXAMPLES })
}
