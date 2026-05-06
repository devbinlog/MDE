# MDE — Music Direction Engine

자연어·이미지 입력을 받아 음악 제작 방향성을 구조화된 데이터로 변환하는 AI 방향성 엔진

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [문제 정의](#2-문제-정의)
3. [해결 접근](#3-해결-접근)
4. [핵심 개념 — MusicProfile](#4-핵심-개념--musicprofile)
5. [시스템 아키텍처](#5-시스템-아키텍처)
6. [AI 시스템 설계](#6-ai-시스템-설계)
7. [성능 및 엔지니어링 결정](#7-성능-및-엔지니어링-결정)
8. [주요 기능](#8-주요-기능)
9. [기술 스택 및 선택 이유](#9-기술-스택-및-선택-이유)
10. [예시 시나리오](#10-예시-시나리오)
11. [배포 구성](#11-배포-구성)
12. [프로젝트 구조](#12-프로젝트-구조)
13. [로컬 실행](#13-로컬-실행)
14. [배운 것](#14-배운-것)

---

## 1. 프로젝트 개요

MDE(Music Direction Engine)는 음악 크리에이터가 가진 "감각적 아이디어"를 실제 제작에 쓸 수 있는 구조화된 방향성 데이터로 변환하는 AI 엔진이다.

음악을 추천하거나 직접 생성하는 서비스가 아니다. "어떤 음악을 만들어야 하는가"에 대한 방향을 구조적으로 도출한다는 점에서 기존 서비스와 범주가 다르다.

한 줄 정의:
> 텍스트·이미지 입력 → LLM 구조화 엔진 → MusicProfile(9필드) + 4방향 크리에이티브 디렉션

---

## 2. 문제 정의

### 아이디어와 제작 사이의 구조적 단절

음악 프로듀서, 작곡가, 밴드가 곡 작업을 시작할 때 가장 먼저 하는 일은 방향성을 잡는 것이다. "이 곡은 이런 느낌이었으면 좋겠다"는 감각이 먼저 있고, 그것을 구체적인 제작 언어로 변환해야 작업이 시작된다.

이 변환 과정에서 두 가지 문제가 발생한다.

첫째, 자연어는 음악 제작 언어가 아니다. "쓸쓸한 느낌", "새벽 감성", "비 오는 날 분위기" 같은 표현은 감정 정보를 담고 있지만, 실제 제작에 필요한 정보인 BPM 범위, 악기 구성, 리버브 공간감, 코드 진행 밀도로 변환되지 않는다. 장르, 음압 처리 방향, 믹스 폭 같은 프로덕션 결정은 자연어만으로 유도되지 않는다.

둘째, 기존 도구들은 이 간극을 채우지 못한다.

- 음악 추천 서비스(Spotify, Apple Music 등)는 이미 만들어진 음악을 찾아주지만, 만들어야 할 음악의 방향을 잡아주지 않는다.
- 레퍼런스 수집 방식은 방향을 탐색하는 데는 유용하지만, 여러 레퍼런스를 수집하고 나면 오히려 방향이 흐려지는 경우가 많다. 레퍼런스와 "내가 만들고 싶은 것" 사이의 간극을 좁히는 작업이 별도로 필요하다.
- AI 음악 생성 서비스(Suno, Udio 등)는 음악을 직접 만들어주지만, 크리에이터 본인이 음악을 만들고 싶을 때는 이 서비스들이 제작 방향을 대신 결정해버린다. 크리에이터의 아이디어를 구체화해주는 것이 아니라 대체해버리는 구조다.
- 아티스트와 프로듀서 간 협업에서는 두 사람이 서로 다른 언어를 사용하는 경우가 많다. 아티스트는 감정과 이미지로 아이디어를 설명하고, 프로듀서는 악기·사운드·믹스 언어로 결정을 내린다. 이 언어 불일치를 해소하는 구조화된 도구가 없다.

### 핵심 문제

"나는 이런 느낌의 음악을 만들고 싶다"는 생각을 실제 제작 결정으로 연결하는 중간 레이어가 존재하지 않는다.

MDE는 이 중간 레이어를 구현한다.

---

## 3. 해결 접근

### MusicProfile의 존재 이유

감각적 아이디어를 제작 언어로 변환하려면 중간 표현이 필요하다. 이 중간 표현은 두 가지 조건을 동시에 만족해야 한다.

1. 사람이 자연어로 표현할 수 있는 감각 정보를 담을 수 있어야 한다.
2. 음악 제작 현장에서 실제로 사용되는 의사결정 단위들로 구성되어야 한다.

MDE는 이를 MusicProfile이라는 구조화된 JSON 스키마로 정의했다. 감정(emotion), 에너지(energy), 장르(genre), 악기 구성(instrumentation), 사운드 방향(sound_direction), 분위기(atmosphere) 등 9개의 필드는 자연어 입력에서 추출 가능하면서 동시에 제작 결정에 직접 대응하는 단위들이다.

### 왜 구조화된 JSON이 필요한가

자연어 출력으로는 이 문제를 해결할 수 없다. 이유는 세 가지다.

첫째, 자연어 출력은 일관성을 보장할 수 없다. 같은 입력에 대해 매번 다른 표현이 나오면 이를 프론트엔드에서 해석하고 시각화하기 어렵다.

둘째, 자연어 출력은 필드 단위로 접근할 수 없다. emotion만 따로 쓰거나, instrumentation만 공유 링크에 포함시키는 것이 불가능하다.

셋째, 후속 처리가 어렵다. MusicProfile에서 이미지 생성 프롬프트를 만들거나, 방향성 설명을 생성할 때 입력으로 JSON을 넘기는 것이 훨씬 정확하다.

### LLM을 구조화 엔진으로 사용하는 이유

LLM이 이 시스템에서 맡은 역할은 챗봇이 아니라 구조화 변환기다.

입력: 자연어 또는 이미지에서 추출된 텍스트 설명
출력: MusicProfile JSON (스키마가 고정되어 있음)

규칙 기반이나 분류 모델로는 이 변환을 할 수 없다. 자연어 입력의 다양성이 너무 크고, "새벽 드라이브"와 "빈 체육관"에서 각각 어떤 악기 구성과 분위기가 도출되어야 하는지를 명시적 규칙으로 정의할 수 없다.

LLM은 이 모호한 의미론적 변환을 가능하게 한다. 시스템 프롬프트에서 JSON 스키마를 엄격하게 정의하고, temperature를 낮춰 일관성을 확보함으로써 LLM을 결정론적 구조화 엔진에 가깝게 동작시킨다.

---

## 4. 핵심 개념 — MusicProfile

### 왜 9개 필드인가

각 필드는 음악 제작 과정에서 독립적으로 결정이 필요한 단위에 대응한다.

| 필드 | 실제 제작에서의 역할 |
|------|-------------------|
| `emotion` | 보컬 디렉션, 멜로디 윤곽, 코드 텐션의 기준점 |
| `energy` | 드럼 레이어 밀도, 마스터링 레벨, 편곡 복잡도 |
| `tempo_feel` | BPM 범위 결정, 그루브 패턴 선택 |
| `genre` | 악기 조합, 사운드 레퍼런스, 믹싱 관습의 출발점 |
| `instrumentation` | 세션 구성, 소프트웨어 악기 선택, 레코딩 방식 |
| `sound_direction` | 리버브 길이, 스테레오 폭, 컴프레서 설정 방향 |
| `atmosphere` | 앨범 커버 콘셉트, 뮤직비디오 배경, 무드 설명의 근거 |
| `visual_association` | 커버 아트 시안, 색상 팔레트, 포토그래피 방향 |
| `listener_context` | SNS 배포 전략, 플레이리스트 배치, 가사 세계관 |
| `content_goal` | 최종 결과물 형태(앨범 커버·라이브·데모 등) 설정 |

summary 필드는 위 9개 필드를 한국어 한 문장으로 압축한 것으로, 협업 커뮤니케이션이나 공유 링크에서 빠른 맥락 전달에 사용된다.

### MusicProfile 예시

```json
{
  "emotion": ["melancholic", "nostalgic"],
  "energy": "low",
  "tempo_feel": "slow",
  "genre": ["indie pop", "dream pop"],
  "instrumentation": ["acoustic guitar", "piano", "soft kick", "bass", "vocal"],
  "sound_direction": ["heavy reverb", "warm compression", "intimate room sound"],
  "atmosphere": ["rainy night", "foggy morning", "empty street"],
  "visual_association": ["neon reflections", "empty roads", "rain on glass"],
  "listener_context": "새벽 혼자만의 드라이브",
  "content_goal": "album_cover",
  "summary": "비 내리는 새벽 도로 위, 몽환적이고 쓸쓸한 인디팝 방향"
}
```

---

## 5. 시스템 아키텍처

```
┌───────────────────────────────────┐
│   Next.js 15 Frontend (Vercel)    │
│   텍스트·이미지 입력 UI            │
│   결과 시각화 / 히스토리 / 공유    │
└──────────────┬────────────────────┘
               │ API Route (프록시)
               │ /api/analyze → FastAPI
┌──────────────▼────────────────────┐
│   FastAPI Backend (Railway)       │
│   JWT 인증 (HTTP-only 쿠키)        │
│   slowapi 율 제한 (IP 기반)        │
│   분석 / 세션 / 공유 API           │
└──────────────┬────────────────────┘
               │
       ┌───────┴──────┐
       │              │
┌──────▼──────┐ ┌─────▼──────────────┐
│ Gemini 2.0  │ │ SQLite / PostgreSQL │
│ Flash API   │ │ 세션, 공유, 사용자  │
└─────────────┘ └────────────────────┘
```

### 왜 프론트엔드와 백엔드를 분리했는가

분리의 이유는 단순히 구조적 청결함이 아니다.

Gemini API 키는 클라이언트에 노출되어서는 안 된다. API 키가 브라우저 환경에 있으면 누구나 네트워크 탭에서 추출할 수 있다. LLM API 키를 보호하려면 서버 레이어가 반드시 필요하다.

또한 율 제한(rate limiting)은 클라이언트에서 구현할 수 없다. IP 기반의 요청 제한은 서버에서만 신뢰할 수 있게 적용된다.

인증 세션도 마찬가지다. JWT를 HTTP-only 쿠키에 저장하는 구조는 JavaScript에서 토큰에 접근할 수 없도록 설계된 것으로, 서버가 없으면 구현 불가능하다.

### 왜 API 프록시 패턴을 사용했는가

Next.js API Route가 FastAPI로 요청을 중계하는 구조를 선택했다. 이유는 두 가지다.

첫째, 브라우저는 FastAPI 서버에 직접 요청을 보낼 때 CORS 문제가 발생한다. 프론트엔드가 Vercel에, 백엔드가 Railway에 배포되면 도메인이 다르다. 프록시를 두면 CORS 설정을 클라이언트가 아닌 서버 간 통신으로 처리할 수 있다.

둘째, 클라이언트의 실제 IP를 백엔드 율 제한에 전달할 수 있다. Vercel 환경에서는 모든 요청이 Vercel 서버 IP에서 오는 것처럼 보인다. Next.js 프록시가 `X-Forwarded-For` 헤더에 실제 클라이언트 IP를 넣어 전달하고, FastAPI는 이 헤더를 읽어 사용자별 율 제한을 적용한다.

```typescript
// frontend/src/app/api/analyze/route.ts
const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'

await fetch(`${BACKEND_URL}/analyze`, {
  headers: {
    'X-Forwarded-For': clientIp,
    // ...
  },
})
```

### 왜 DB가 필요한가

분석 결과를 클라이언트 로컬스토리지에만 저장하면 두 가지 기능이 불가능하다.

첫째, 공유 링크. `/shared/{id}` URL이 동작하려면 서버가 결과를 영구적으로 보관해야 한다.
둘째, 멀티 기기 히스토리. 로그인한 사용자의 분석 이력을 다른 기기에서도 볼 수 있으려면 DB가 필요하다.

### 왜 FastAPI를 선택했는가

FastAPI는 Python 기반 비동기 웹 프레임워크로, 이 프로젝트의 특성에 맞는 선택이다. LLM API 호출은 IO 바운드 작업이다. asyncio 기반의 FastAPI는 요청 하나가 LLM 응답을 기다리는 동안 다른 요청을 처리할 수 있다. Flask나 Django 동기 뷰와 달리 스레드 풀을 낭비하지 않는다.

---

## 6. AI 시스템 설계

이 시스템에서 LLM은 챗봇 방식으로 동작하지 않는다. 출력이 미리 정의된 JSON 스키마를 따르도록 프롬프트와 파라미터가 설계되어 있다.

### 입력에서 MusicProfile까지의 흐름

```
사용자 입력 (텍스트 혹은 이미지)
  ↓
[이미지인 경우] Gemini Vision API
  → 이미지를 음악 분석에 적합한 한국어 텍스트 설명으로 변환
  → temperature=0.3, maxOutputTokens=200
  ↓
Gemini API (프로필 생성)
  → 시스템 프롬프트: MusicProfile 스키마 + 엄격한 JSON 출력 규칙
  → temperature=0.3, maxOutputTokens=1024
  → 출력: MusicProfile JSON
  ↓
Gemini API (방향성 설명 생성)
  → 입력: MusicProfile JSON
  → 시스템 프롬프트: 4개 필드(music/sound/visual/content) 한국어 설명
  → temperature=0.7, maxOutputTokens=1024
  → 출력: DirectionExplanation JSON
  ↓
Pollinations.ai
  → MusicProfile에서 이미지 생성 프롬프트 빌드
  → 앨범 커버 이미지 URL 생성
  ↓
DB 저장 + 결과 반환
```

### 왜 JSON 스키마를 강제하는가

시스템 프롬프트에 출력 형식을 엄격하게 지정한다. "Return ONLY a valid JSON object. No explanation, no markdown." 이 구조가 없으면 LLM은 설명 텍스트를 함께 출력하거나, 필드명을 임의로 변경하거나, 중첩 구조를 바꾸는 경우가 있다.

백엔드에는 JSON 파싱 시 마크다운 코드 블록 제거, 정규식 기반 JSON 객체 추출 등 방어 레이어도 존재한다.

```python
# backend/app/services/gemini_service.py
def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # 마크다운 코드 블록 제거
    clean = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass
    # JSON 객체만 추출
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return json.loads(match.group())
    raise ValueError(f"Could not extract JSON from response")
```

### 왜 temperature를 낮게 설정하는가

프로필 생성 단계에서 temperature=0.3을 사용한다. 이유는 일관성이다.

MusicProfile은 구조적 분류 작업이다. "새벽 드라이브"라는 입력에서 emotion이 매번 다른 값으로 나오면 시스템의 신뢰성이 떨어진다. temperature를 낮추면 LLM은 창의적인 해석보다 해당 입력에 가장 전형적으로 대응하는 값을 출력하는 경향이 강해진다.

방향성 설명 생성에서는 temperature=0.7을 사용한다. 이 단계는 이미 고정된 MusicProfile JSON을 읽어 한국어 문장을 생성하는 작업이다. 이미 구조는 확정되었으므로, 표현의 풍부함이 중요하다.

### 왜 프로필과 설명을 순차적으로 생성하는가

프로필 생성과 설명 생성을 병렬로 처리할 수 없다. 설명 생성의 입력이 프로필 출력이기 때문이다. 설명 프롬프트는 MusicProfile JSON을 직접 받아 처리한다.

```python
# backend/app/services/direction_service.py
# Step 1: 프로필 생성
profile_raw = await call_gemini(PROFILE_SYSTEM_PROMPT, profile_msg, temperature=0.3)
music_profile = extract_json(profile_raw)

# Step 2: 프로필을 입력으로 설명 생성
explanation_msg = json.dumps(music_profile, ensure_ascii=False, indent=2)
expl_raw = await call_gemini(EXPLANATION_SYSTEM_PROMPT, explanation_msg, temperature=0.7)
explanation = extract_json(expl_raw)
```

데이터 의존성이 있는 두 LLM 호출을 억지로 병렬화하면 오히려 구조가 복잡해진다. 순차 처리가 이 경우의 올바른 설계다.

---

## 7. 성능 및 엔지니어링 결정

### 비동기 IO 처리

FastAPI와 asyncio를 사용하는 이유는 LLM API 호출이 I/O 바운드 작업이기 때문이다. Gemini API 응답에는 수 초가 걸린다. 동기 방식이라면 하나의 요청이 응답을 기다리는 동안 서버 스레드가 블로킹된다. 비동기 방식에서는 해당 시간 동안 다른 요청을 처리할 수 있다.

httpx의 AsyncClient를 사용해 Gemini API를 비동기로 호출하고, FastAPI의 async def 라우터에서 await로 처리한다.

### 율 제한을 IP 기반으로 적용하는 이유

Gemini 무료 티어는 분당 호출 수에 제한이 있다. 이 제한을 넘으면 API가 429를 반환한다. 서버 레벨에서 IP당 분당 200회(텍스트), 10회(이미지) 제한을 걸어둔 것은 단일 사용자가 API 한도를 소진하는 것을 방지하기 위해서다.

프록시를 통한 실제 IP 전달이 없으면, 모든 요청이 Vercel IP에서 오는 것으로 인식되어 IP 기반 율 제한이 의미를 잃는다. Next.js 프록시에서 `X-Forwarded-For` 헤더를 전달하고, FastAPI에서 이를 읽어 key_func으로 사용하는 이유가 여기에 있다.

### 목(Mock) 모드가 존재하는 이유

개발·데모 환경에서 매번 Gemini API를 호출하면 개발 속도가 느려지고 API 한도가 소비된다. 프론트엔드에 미리 정의된 mock 응답을 두면 API 키 없이도 전체 UI 흐름을 테스트할 수 있다.

```typescript
// frontend/src/lib/ai-service/mock.ts
export function getMockResult(input: string): AnalysisResult {
  if (input.includes('비') || input.includes('rain')) {
    return RAINY_RESULT  // 비 관련 입력에 대응하는 미리 정의된 프로필
  }
  return MOCK_RESULTS.default
}
```

목 모드는 기능 구현이 완성된 후에도 CI 환경, 포트폴리오 데모, UI 컴포넌트 개발에서 계속 유용하다.

### 설명 생성 실패 시 폴백

방향성 설명 생성은 프로필 생성보다 중요도가 낮다. 프로필만 있어도 실질적인 정보 전달은 가능하다. 설명 생성에 실패하면 프로필의 genre와 emotion 값에서 기계적으로 조합한 최소 폴백을 반환한다. 전체 요청이 실패하지 않는다.

```python
def _make_fallback_explanation(profile: dict) -> dict:
    genre = ", ".join(profile.get("genre", ["음악"]))
    emotion = ", ".join(profile.get("emotion", ["감성적"]))
    return {
        "music_direction": f"{genre} 장르의 {emotion} 분위기를 담은 음악입니다.",
        # ...
    }
```

---

## 8. 주요 기능

### 분석 (Analyze)

텍스트 또는 이미지를 입력하면 MusicProfile과 4방향 디렉션을 반환한다. 텍스트는 최소 10자, 최대 500자로 제한하며, 이미지는 JPEG·PNG·WebP·GIF, 최대 10MB를 지원한다. 이미지는 Gemini Vision으로 먼저 텍스트 설명으로 변환된 뒤 동일한 파이프라인을 거친다.

### 히스토리 (History)

로그인 사용자의 분석 결과는 DB에 저장되고, 히스토리 페이지에서 조회·삭제할 수 있다. 비로그인 사용자는 로컬스토리지 기반으로 히스토리가 관리된다.

### 공유 (Share)

분석 결과에 영구 공유 링크를 발급할 수 있다. `/shared/{id}` 경로는 로그인 없이 접근 가능하며, 결과가 DB에 저장된 상태에서만 작동한다. 클라이언트 로컬스토리지만 있는 결과는 공유할 수 없다.

### 관리자 (Admin)

`/admin` 경로는 JWT에서 role이 `admin`인 사용자만 접근 가능하다. Next.js 미들웨어에서 토큰 검증 후 리다이렉트를 처리한다. 전체 분석 수, 사용자 수, 오늘 요청 수 등 통계를 확인할 수 있다.

---

## 9. 기술 스택 및 선택 이유

### Next.js 15

React 기반의 풀스택 프레임워크를 선택한 이유는 API Route 기능 때문이다. Vercel 배포 환경에서 서버리스 함수로 동작하는 API Route는 별도 서버 없이 프록시 레이어를 구현할 수 있다. App Router의 서버 컴포넌트를 활용해 인증 상태에 따른 라우팅 처리를 서버 사이드에서 처리한다.

### FastAPI

Python 비동기 웹 프레임워크다. LLM API 호출이 주 작업인 이 서비스에서 비동기 처리는 선택이 아니라 요구사항이다. Pydantic 기반의 요청/응답 검증, 자동 OpenAPI 문서 생성, SQLAlchemy async와의 통합이 개발 생산성을 높인다.

### Gemini 2.0 Flash

구조화 출력과 멀티모달(Vision)을 동시에 지원하는 모델이다. 이미지 설명과 텍스트 분석을 동일한 API 엔드포인트에서 처리할 수 있어, 별도 Vision 서비스를 운영할 필요가 없다. Flash 모델은 Pro 모델 대비 응답 속도가 빠르고, 이 서비스의 구조화 출력 작업에서 품질 차이가 크지 않다.

### SQLite → PostgreSQL 전환 가능 설계

개발 환경에서는 SQLite를 사용한다. 파일 기반으로 별도 DB 서버 설정 없이 로컬 개발이 가능하다. SQLAlchemy의 async 드라이버(aiosqlite → asyncpg)와 DATABASE_URL 환경 변수만 교체하면 PostgreSQL로 전환된다. ORM 레이어를 통해 DB 종류에 의존하지 않는 쿼리를 유지하는 것이 이 전환을 가능하게 한다.

---

## 10. 예시 시나리오

### 사용자 입력

```
비 오는 새벽 혼자 운전하는 느낌
```

### 생성된 MusicProfile

```json
{
  "emotion": ["melancholic", "nostalgic", "lonely"],
  "energy": "low",
  "tempo_feel": "slow",
  "genre": ["indie pop", "dream pop"],
  "instrumentation": ["acoustic guitar", "piano", "soft kick", "bass", "vocal"],
  "sound_direction": ["heavy reverb", "warm compression", "intimate room sound", "tape saturation"],
  "atmosphere": ["rainy night", "foggy morning", "empty roads"],
  "visual_association": ["rain on glass", "neon reflections", "single lamp", "wet pavement"],
  "listener_context": "새벽 혼자만의 드라이브",
  "content_goal": "album_cover",
  "summary": "빗소리와 어우러지는 몽환적인 인디팝, 혼자 달리는 새벽 도로의 감성"
}
```

### 생성된 방향성 설명

```json
{
  "music_direction": "느리고 감성적인 4/4박자를 기반으로, 클린 기타의 아르페지오가 멜로디를 이끌어갑니다. BPM 60-70 범위에서 천천히 호흡하는 구조로, 어쿠스틱과 피아노가 레이어를 이루며 따뜻하지만 쓸쓸한 감정선을 만들어냅니다. 브리지에서 현악기를 얇게 올려 감정적 고조를 유도할 수 있습니다.",

  "sound_direction": "리버브를 적극 활용해 공간감을 크게 열어줍니다. 보컬은 소프트하고 가까운 마이킹으로 친밀감을 강조하고, 드럼은 브러시 스네어로 존재감을 최소화합니다. 테이프 새처레이션으로 약간의 빈티지 온기를 더해주세요.",

  "visual_direction": "어두운 블루-그레이 계열에 단일 조명이 만드는 하이라이트를 중심으로 구성합니다. 빗물이 맺힌 유리창, 흐릿한 네온 반사 등 습기 있는 텍스처를 활용한 저채도 사진 스타일을 권장합니다. 필름 그레인 질감이 이 무드와 잘 맞습니다.",

  "content_usage": "심야 시간대 스트리밍 플레이리스트에 최적화된 방향입니다. '새벽감성', '비오는날', '드라이브' 태그와 함께 배포하면 효과적입니다. 짧은 루프 영상과 함께 Reels 배경음악으로 활용할 수 있으며, 앨범 커버는 빗속 도로 원경 사진에 어두운 색 오버레이를 얹는 방향이 어울립니다."
}
```

---

## 11. 배포 구성

### Vercel + Railway를 선택한 이유

GitHub Pages나 Netlify만으로는 이 서비스를 배포할 수 없다. FastAPI 백엔드가 별도 서버 환경을 필요로 하기 때문이다.

Vercel은 Next.js에 최적화된 배포 플랫폼으로, App Router의 서버 컴포넌트, API Route, 엣지 미들웨어를 별도 설정 없이 지원한다. Railway는 Python 프로세스를 지속적으로 실행할 수 있는 컨테이너 기반 플랫폼으로, FastAPI + uvicorn 조합의 배포가 간단하다.

두 플랫폼 모두 GitHub 연동 자동 배포를 지원하며, 환경 변수 관리가 별도 인프라 없이 가능하다.

### 환경 변수 분리

프론트엔드와 백엔드의 환경 변수는 완전히 분리된다.

```
프론트엔드(Vercel): BACKEND_URL
백엔드(Railway): LLM_API_KEY, DATABASE_URL, JWT_SECRET, FRONTEND_URL
```

Gemini API 키는 Railway 환경 변수에만 존재하며 클라이언트에 노출되지 않는다.

---

## 12. 프로젝트 구조

```
MDE/
├── frontend/                   # Next.js 15 프론트엔드
│   └── src/
│       ├── app/                # App Router 페이지
│       │   ├── page.tsx        # 홈
│       │   ├── analyze/        # 분석 입력
│       │   ├── result/[id]/    # 분석 결과
│       │   ├── history/        # 히스토리
│       │   ├── shared/[id]/    # 공유 결과 (비로그인 접근 가능)
│       │   ├── admin/          # 관리자 대시보드
│       │   ├── api/            # Next.js API Route (FastAPI 프록시)
│       │   ├── login/
│       │   └── signup/
│       ├── components/         # UI 컴포넌트
│       ├── lib/
│       │   ├── ai-service/     # MusicProfile 타입, 목 모드, 유틸
│       │   ├── hooks/          # React hooks
│       │   └── auth-utils.ts   # JWT 검증
│       ├── types/
│       │   └── music-profile.ts  # 핵심 타입 정의
│       └── middleware.ts        # 관리자 경로 보호
├── backend/
│   └── app/
│       ├── api/                # FastAPI 라우터
│       │   ├── analyze.py      # 텍스트·이미지 분석 엔드포인트
│       │   ├── sessions.py     # 히스토리 CRUD
│       │   ├── share.py        # 공유 링크 생성·조회
│       │   ├── auth.py         # 회원가입·로그인·로그아웃
│       │   └── admin.py        # 통계 API
│       ├── core/
│       │   ├── config.py       # 환경 변수 (pydantic-settings)
│       │   ├── database.py     # SQLAlchemy async 세션
│       │   └── security.py     # JWT 발급·검증
│       ├── models/             # SQLAlchemy ORM 모델
│       ├── schemas/            # Pydantic 요청·응답 스키마
│       └── services/
│           ├── gemini_service.py    # Gemini API 호출, JSON 추출
│           ├── direction_service.py # 프로필·설명 생성 파이프라인
│           └── image_service.py    # Pollinations.ai URL 생성
└── docs/
```

---

## 13. 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/devbinlog/MDE.git
cd MDE

# 백엔드 의존성
cd backend
pip install -r requirements.txt

# 환경 변수 설정
# backend/.env 파일 생성
echo "LLM_API_KEY=your_gemini_api_key" > .env

# 백엔드 실행
python3 -m uvicorn app.main:app --port 8000 --host 127.0.0.1

# 프론트엔드 의존성 (새 터미널)
cd ../frontend
pnpm install

# 프론트엔드 실행
pnpm dev
```

- 프론트엔드: http://localhost:3000
- 백엔드 API 문서: http://localhost:8000/docs

Gemini API 키 없이 UI만 테스트하려면 프론트엔드의 목 모드를 사용할 수 있다. 목 모드에서는 API 키가 불필요하며, 미리 정의된 MusicProfile이 반환된다.

---

## 14. 배운 것

### LLM을 구조화 엔진으로 설계하는 방법

LLM에 자유로운 텍스트 생성을 맡기면 결과물을 프로그래밍으로 다루기 어렵다. 출력 스키마를 시스템 프롬프트에 명시하고 temperature를 낮추면 LLM을 결정론적 변환기처럼 사용할 수 있다. 단, LLM은 항상 스키마를 완벽하게 따르지 않기 때문에 JSON 파싱 방어 레이어는 반드시 필요하다. 파싱 실패를 처리하는 여러 전략(마크다운 제거, 정규식 추출, 폴백 반환)을 레이어로 쌓는 것이 실용적인 접근이었다.

### 서비스 레이어와 API 레이어의 분리

FastAPI 라우터에 비즈니스 로직을 직접 넣지 않고, services 디렉토리에 분리했다. 이 분리는 테스트 작성, 로직 재사용, 의존성 역전 모두를 쉽게 만든다. `direction_service.py`는 FastAPI에 의존하지 않아, 독립적으로 테스트하거나 다른 인터페이스에서 재사용할 수 있다.

### 프록시 패턴이 실제로 해결하는 문제들

API 프록시는 단순히 요청을 중계하는 것 이상의 역할을 한다. CORS 처리, 클라이언트 IP 전달, API 키 보호, 쿠키 포워딩이 모두 이 레이어에서 처리된다. 이 중 하나라도 누락되면 율 제한이 무력화되거나 인증이 깨진다. 프록시 설계 시 이 흐름 전체를 고려하는 것이 중요하다.

---

*MDE — Music Direction Engine | Gemini 2.0 Flash + FastAPI + Next.js 15*
