# MDE — Music Direction Engine

LLM 기반 음악 방향성 구조화 시스템

> "추상적인 음악적 상상을 재사용 가능한 창작 방향 데이터로 변환합니다."

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [문제 정의](#2-문제-정의)
3. [핵심 솔루션](#3-핵심-솔루션)
4. [MusicProfile 설계](#4-musicprofile-설계)
5. [AI 시스템 설계](#5-ai-시스템-설계)
6. [시스템 아키텍처](#6-시스템-아키텍처)
7. [성능 및 운영 설계](#7-성능-및-운영-설계)
8. [주요 기능](#8-주요-기능)
9. [예시 시나리오](#9-예시-시나리오)
10. [기술 스택](#10-기술-스택)
11. [배포 구조](#11-배포-구조)
12. [프로젝트 구조](#12-프로젝트-구조)
13. [배운 것](#13-배운-것)

---

## 테스트 비디오 및 프로젝트 이미지

### 비디오

1.
<video src="https://raw.githubusercontent.com/devbinlog/MDE/main/docs/videos/demo1.mp4" controls width="100%"></video>

2.
<video src="https://raw.githubusercontent.com/devbinlog/MDE/main/docs/videos/demo2.mp4" controls width="100%"></video>

---

## 프로젝트 이미지
1. 메인 페이지
<img width="1439" height="726" alt="MDE메인1" src="https://github.com/user-attachments/assets/2f2e23d9-7088-4e7f-b6a3-b27e8ed2257d" />
<img width="1439" height="726" alt="MDE메인2" src="https://github.com/user-attachments/assets/72d62c1e-b0e3-4501-ba3c-b4a0ce90964b" />
<img width="1439" height="726" alt="MDE메인3" src="https://github.com/user-attachments/assets/dd601331-c5f2-4d42-84c9-1ea55703ba77" />
<img width="1439" height="726" alt="MDE메인4" src="https://github.com/user-attachments/assets/ea625512-5f23-4ab6-a0a0-8ecf38084f8f" />

2. 분석 페이지, 입력 및 결과 페이지
<img width="1439" height="726" alt="분석페이지1" src="https://github.com/user-attachments/assets/b0955c58-1a8c-4327-bb15-1ba3e69c1371" />
<img width="1439" height="726" alt="분석페이지2" src="https://github.com/user-attachments/assets/2123781d-04e5-473c-8b3b-d2965383111a" />
<img width="1439" height="726" alt="분석페이지입력" src="https://github.com/user-attachments/assets/9dc546d2-81be-4173-96dc-2d80d95d843d" />
<img width="1439" height="726" alt="분석중1" src="https://github.com/user-attachments/assets/57121c8d-acb3-4d73-85eb-3786163f3d00" />
<img width="1439" height="726" alt="분석결과1" src="https://github.com/user-attachments/assets/8f58e236-4175-4f43-86a2-d71de343edd1" />
<img width="1439" height="726" alt="분석결과2" src="https://github.com/user-attachments/assets/c54d15dc-d64d-406b-81c4-a88709890ca1" />
<img width="1439" height="726" alt="분석결과3" src="https://github.com/user-attachments/assets/d4d991e2-29e3-4871-8bb5-3686542ca861" />
<img width="1439" height="726" alt="분석결과4" src="https://github.com/user-attachments/assets/26d41aad-6026-40b4-842b-1a4f26a3f700" />
<img width="1439" height="726" alt="분석이미지생성1" src="https://github.com/user-attachments/assets/05d6c9e7-1518-4154-ba76-3d9caa911d00" />
<img width="1439" height="726" alt="분석이미지생성2" src="https://github.com/user-attachments/assets/9b5b9da5-1ae6-4536-bb62-37293b0df2c9" />
<img width="1439" height="726" alt="분석이미지생성3" src="https://github.com/user-attachments/assets/ab60058b-2f54-4f4a-902c-d0cc73040ede" />


3. 분석 히스토리 페이지
<img width="1439" height="726" alt="분석히스토리1" src="https://github.com/user-attachments/assets/c4ad29f3-a5fe-46ae-b0ac-cffcbc994a7f" />
<img width="1439" height="726" alt="분석히스토리2" src="https://github.com/user-attachments/assets/062344fa-8a12-4dc0-af35-76fff88176a7" />

---

## 1. 프로젝트 개요

MDE(Music Direction Engine)는 음악 크리에이터가 느낌으로만 갖고 있는 음악적 아이디어를 구조화된 창작 방향 데이터로 변환하는 LLM 기반 파이프라인입니다.

MDE는 음악을 추천하지 않습니다. 음악을 생성하지도 않습니다. 앨범 커버를 만드는 도구가 아닙니다.

MDE가 하는 일은 하나입니다. 창작자가 "이런 느낌의 음악을 만들고 싶다"는 막연한 언어를 입력하면, 그것을 음악 제작에 실제로 사용할 수 있는 구조화된 JSON 데이터로 변환합니다. 이 데이터는 프로듀서와의 협업 지시서가 될 수 있고, SNS 콘텐츠 전략의 기반이 될 수 있으며, 앨범 아트워크 방향의 출발점이 될 수 있습니다.

감정 언어를 음악 생산 언어로 번역하는 구조화 엔진. 그것이 MDE입니다.

---

## 2. 문제 정의

### 창작 전 단계에서 발생하는 구조적 공백

음악 제작의 가장 어려운 단계는 악기를 연주하거나 믹싱하는 순간이 아닙니다. 아무것도 없는 상태에서 "어떤 음악을 만들 것인가"를 결정하는 순간입니다.

창작자는 대부분 감정으로 시작합니다. "새벽에 혼자 운전하는 느낌", "무너지기 직전인데 버티는 느낌", "폭발하고 싶은 에너지". 
이 언어들은 진짜 감정을 담고 있지만 음악 제작에 직접 쓸 수 있는 형태가 아닙니다. 
BPM이 몇인지, 어떤 악기 구성이 필요한지, 어떤 장르 레퍼런스를 가져와야 하는지 말해주지 않습니다.

### 레퍼런스 기반 워크플로의 한계

현재 대부분의 창작자는 레퍼런스 트랙을 수집하는 방식으로 이 공백을 메웁니다. 플레이리스트를 만들고, 유사한 아티스트의 곡을 모아 프로듀서에게 전달합니다. 그러나 이 방식은 근본적인 문제를 해결하지 못합니다.

레퍼런스는 "무엇이 나오면 좋겠다"는 결과물의 집합이지, 방향성의 언어가 아닙니다. 프로듀서는 레퍼런스 10개를 받아도 창작자가 실제로 원하는 바를 추론해야 합니다. 아티스트-프로듀서 간 언어 불일치가 여기서 발생합니다. 창작자는 "이 느낌"을 원하지만 프로듀서가 들은 것은 "이 곡들"입니다.

### 기존 AI 음악 시스템의 방향 오류

Suno, Udio 같은 AI 음악 생성 도구는 다른 문제를 해결합니다. 이들은 결과물(음악 파일)을 만드는 생성 시스템입니다. 창작자 자신이 음악을 직접 제작하려는 경우, 이 도구들은 방향성을 제공하지 않습니다. 완성된 결과물을 만들어줄 뿐입니다.

창작 방향성 문제는 생성(generation)으로 해결되지 않습니다. 구조화(structuring)가 필요한 문제입니다.

음악 추천 시스템도 이 문제를 해결하지 못합니다. Spotify의 Discover Weekly는 사용자가 좋아할 음악을 추천하지, 사용자가 만들어야 할 음악의 방향을 알려주지 않습니다.

MDE는 이 공백, 즉 창작 전 단계에서 발생하는 방향성 부재 문제에 집중합니다.

---

## 3. 핵심 솔루션

### 구조화 엔진으로서의 LLM

LLM은 언어를 이해하는 능력과 도메인 지식을 동시에 갖고 있습니다. 음악 이론, 장르 특성, 사운드 디자인 관행에 대한 방대한 지식을 학습한 LLM은 감정 언어를 음악 생산 파라미터로 번역할 수 있는 최적의 도구입니다.

MDE는 LLM을 대화 상대로 사용하지 않습니다. 스키마 기반 구조화 엔진으로 사용합니다.

입력은 자연어입니다. 출력은 JSON 스키마를 준수하는 MusicProfile 객체입니다. LLM은 이 변환의 중간 처리 레이어입니다.

### 변환 파이프라인

```
자연어 입력 (또는 이미지)
    │
    ▼
[Stage 1] LLM → MusicProfile JSON 생성
    │
    │  emotion, energy, tempo_feel, genre,
    │  instrumentation, atmosphere,
    │  visual_association, listener_context,
    │  content_goal, summary
    │
    ▼
[Stage 2] LLM → DirectionExplanation JSON 생성
    │
    │  music_direction, sound_direction,
    │  visual_direction, content_usage
    │
    ▼
구조화된 방향성 데이터 (재사용 가능)
```

이 두 단계의 출력은 독립적인 JSON 객체입니다. 프론트엔드 UI에서 시각화되는 데이터이자, 데이터베이스에 저장되어 재사용 가능한 창작 레퍼런스 데이터이기도 합니다.

### 왜 구조화된 JSON이 중요한가

감정 언어를 단순히 텍스트로 설명해주는 것과, 구조화된 JSON으로 출력하는 것의 차이는 큽니다.

텍스트 답변은 소비되고 사라집니다. JSON 스키마는 다운스트림 파이프라인에서 재사용됩니다. 앨범 커버 이미지 생성 프롬프트를 자동으로 구성할 수 있고, 향후 DAW 플러그인과 연동할 수 있으며, 여러 세션의 MusicProfile을 비교 분석하는 데이터 레이어로 활용할 수 있습니다. 구조화가 재사용성을 만듭니다.

---

## 4. MusicProfile 설계

MusicProfile은 MDE의 핵심 데이터 구조입니다. 각 필드는 음악 제작 현장에서 실제로 필요한 파라미터를 기반으로 설계됐습니다.

```json
{
  "summary": "새벽 도심의 고독과 긴장감을 담은 다크 신스팝 방향",
  "emotion": ["고독", "긴장", "결의"],
  "energy": "medium",
  "tempo_feel": "mid",
  "genre": ["dark synth-pop", "post-punk"],
  "instrumentation": ["신시사이저", "드럼 머신", "베이스 기타"],
  "atmosphere": ["어둡고 차가운", "도시적", "몽환적"],
  "visual_association": ["네온사인", "빗속 도로", "새벽 3시"],
  "listener_context": "혼자 야간 드라이브 중",
  "content_goal": "playlist_mood"
}
```

### 필드별 설계 근거

summary: 전체 방향성을 하나의 문장으로 압축합니다. 프로듀서에게 전달할 수 있는 최소 단위의 방향 지시문입니다.

emotion: 배열 형태로 복수의 감정을 허용합니다. 음악은 단일 감정이 아닌 복합 감정을 담는 경우가 대부분이기 때문입니다. 믹싱 엔지니어와 소통할 때 이 필드는 다이나믹 레인지 결정의 기준이 됩니다.

energy: 낮음/보통/높음 세 단계로 인코딩합니다. 에너지 레벨은 BPM, 사운드 압축, 악기 레이어링 밀도에 직접적으로 연결되는 파라미터입니다.

tempo_feel: 실제 BPM 수치가 아닌 체감 템포를 기술합니다. BPM 120이라도 16분음표 위주의 드럼 패턴이면 빠르게 느껴지고, 긴 노트 위주의 편곡이면 느리게 느껴집니다. 수치보다 체감이 음악 방향 소통에 더 유용합니다.

genre: 복수 장르를 허용합니다. 현대 음악에서 단일 장르로 분류 가능한 곡은 드뭅니다. 장르 레이블은 레퍼런스 아티스트 탐색의 출발점으로 사용됩니다.

instrumentation: 어떤 악기 구성이 이 방향에 어울리는지 제안합니다. 프로듀서와의 협업 초기 세션에서 DAW 세션 템플릿 구성의 기준이 됩니다.

atmosphere: 장르나 악기로는 설명되지 않는 질감을 담는 필드입니다. "차갑고 습한 느낌", "유리 같은 투명함" 같은 사운드 텍스처 언어는 믹싱 엔지니어와 소통할 때 특히 유효합니다.

visual_association: 음악이 연상시키는 시각적 이미지입니다. 뮤직비디오 방향, 앨범 아트워크 컨셉, SNS 썸네일 무드의 기반 데이터로 사용됩니다. 이 필드의 값이 Pollinations.ai 이미지 생성 프롬프트의 핵심 인자가 됩니다.

listener_context: 이 음악을 어디서 어떤 상황에 듣는지 기술합니다. 스트리밍 플랫폼의 플레이리스트 배치 전략, 타겟 청취자 설정, SNS 광고 타겟팅의 기준이 됩니다.

content_goal: 이 음악이 어떤 용도의 콘텐츠로 활용될지 정의합니다. 앨범 커버 아트, 라이브 공연, 데모 기획, 플레이리스트 무드 등 용도에 따라 이후 방향성 가이드의 우선순위가 달라집니다.

---

## 5. AI 시스템 설계

### 현재 AI 스택

| 구성 요소 | 사용 기술 |
|-----------|-----------|
| LLM 제공자 | OpenRouter |
| LLM 모델 | openai/gpt-4o-mini |
| 이미지 생성 | Pollinations.ai (기본 모델) |
| 모델 실행 위치 | 백엔드 (FastAPI, Railway) |

### 전체 AI 파이프라인 흐름

```
사용자 입력 (텍스트 or 이미지)
    │
    ▼
Next.js API Route (프록시)
    │  mde_session 쿠키 포함
    ▼
FastAPI Backend (Railway)
    │
    ├─ [이미지 입력인 경우]
    │      LLM Vision → 텍스트 변환
    │
    ├─ [단일 LLM 호출] OpenRouter → gpt-4o-mini
    │      MusicProfile + DirectionExplanation 동시 생성
    │
    ├─ JSON 파싱 + 스키마 검증
    ├─ SQLite/PostgreSQL 저장
    ├─ Pollinations.ai 이미지 URL 생성
    │
    ▼
구조화된 분석 결과 반환 (~5–10초)
```

### 단일 LLM 호출로 통합한 이유

초기 설계에서는 MusicProfile 생성과 DirectionExplanation 생성을 별도의 LLM 호출로 분리했습니다. 그러나 실측 응답 시간이 호출당 약 25초에 달해 총 50초가 소요됐습니다.

gpt-4o-mini처럼 instruction following이 안정적인 모델은 단일 프롬프트에서 두 구조를 동시에 정확하게 생성할 수 있습니다. 중첩 스키마 (`musicProfile`, `explanation` 두 키)를 하나의 JSON으로 반환하도록 프롬프트를 재설계해 API 왕복을 2회에서 1회로 줄였고, 응답 시간이 5–10초로 단축됐습니다.

### JSON 스키마 강제와 파싱 전략

LLM은 지시를 따르지만 100% 신뢰할 수 없습니다. 특히 추론 과정을 외부에 출력하는 reasoning 모델은 실제 JSON 앞에 사고 과정 텍스트를 출력합니다.

이를 처리하기 위해 `extract_json()` 함수는 단계적 파싱 전략을 사용합니다.

```python
def extract_json(text: str) -> dict:
    # 1단계: 직접 파싱 시도
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2단계: 마크다운 코드 블록 제거 후 재시도
    clean = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass

    # 3단계: 모든 '{' 위치에서 JSON 후보 추출 시도 (reasoning 모델 대응)
    for match in re.finditer(r"\{", text):
        start = match.start()
        depth = 0
        for i, ch in enumerate(text[start:]):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    candidate = text[start: start + i + 1]
                    try:
                        return json.loads(candidate)
                    except json.JSONDecodeError:
                        break

    raise ValueError(f"JSON 추출 실패: {text[:200]}")
```

이 전략은 정상적인 instruction 모델, 마크다운 포맷을 추가하는 모델, 앞에 reasoning 텍스트를 출력하는 모델을 모두 처리합니다.

### LLM은 챗봇이 아닙니다

MDE에서 LLM은 사용자와 대화하지 않습니다. 사용자의 입력을 받는 것은 프론트엔드 UI이고, LLM은 백엔드 파이프라인 내부에서만 실행됩니다.

LLM의 역할은 순수하게 두 가지입니다.

```
역할 1: 자연어 → 구조화된 MusicProfile JSON
역할 2: MusicProfile → 방향성 설명 텍스트 JSON
```

사용자는 LLM과 직접 상호작용하지 않습니다. LLM은 창작 방향 데이터를 생성하는 처리 레이어입니다.

### 모델 추상화 설계

백엔드는 OpenRouter를 통해 LLM을 호출합니다. OpenRouter는 수십 개의 모델에 동일한 OpenAI 호환 API로 접근할 수 있는 라우팅 레이어입니다.

환경 변수 두 개로 모델을 교체할 수 있도록 설계했습니다.

```
LLM_PROVIDER=openrouter
LLM_MODEL=openai/gpt-oss-20b:free
```

이 설계는 모델 종속성을 제거합니다. gpt-oss-20b를 Claude나 Llama로 교체할 때 코드를 수정할 필요가 없습니다. 파이프라인 자체의 스키마 강제 로직이 모델 독립적으로 동작합니다.

---

## 6. 시스템 아키텍처

### 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────┐
│              사용자 브라우저                       │
└────────────────────┬────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────┐
│         Next.js 15 Frontend (Vercel)            │
│                                                 │
│  app/page.tsx          ← 홈 (서버 컴포넌트)       │
│  app/analyze/page.tsx  ← 분석 입력/결과 UI        │
│  app/history/page.tsx  ← 히스토리                │
│  app/admin/page.tsx    ← 관리자 대시보드           │
│                                                 │
│  app/api/analyze/      ← 백엔드 프록시 레이어      │
│  app/api/sessions/     ← 세션 프록시              │
│  app/api/auth/         ← 인증 프록시              │
│  app/api/share/        ← 공유 프록시              │
└────────────────────┬────────────────────────────┘
                     │ REST (쿠키 포함 프록시)
┌────────────────────▼────────────────────────────┐
│         FastAPI Backend (Railway)               │
│                                                 │
│  POST /api/analyze     ← LLM 파이프라인 실행      │
│  GET  /api/sessions    ← 세션 목록               │
│  POST /api/auth/login  ← JWT 쿠키 발급           │
│  POST /api/share       ← 공유 링크 생성           │
│  GET  /api/admin/stats ← 통계                   │
│                                                 │
│  services/direction_service.py    ← 핵심 파이프라인  │
│  services/openrouter_service.py   ← LLM 어댑터      │
│  database.py                    ← SQLite/Postgres │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
┌────────▼───────┐    ┌──────────▼──────────┐
│   OpenRouter   │    │  Pollinations.ai     │
│  gpt-4o-mini   │    │  이미지 생성          │
└────────────────┘    └─────────────────────┘
```

### 프론트엔드-백엔드 분리의 이유

초기 설계에서는 LLM 호출을 Next.js API Route에서 직접 처리하는 방식을 고려했습니다. 그러나 이 방식에는 구조적 문제가 있습니다.

첫째, API 키가 Vercel 환경 변수에 저장됩니다. Vercel의 환경 변수는 빌드 시 프론트엔드 번들에 포함될 위험이 있고, 클라이언트 사이드에서 노출될 가능성이 생깁니다.

둘째, 인증과 세션 관리를 프론트엔드에서 처리하면 Vercel의 서버리스 함수 특성상 상태 유지가 어렵습니다. 각 API Route 호출은 독립적인 실행 환경이기 때문에 데이터베이스 커넥션 풀링이나 장기 세션 관리에 적합하지 않습니다.

셋째, 비즈니스 로직(JSON 파싱, 스키마 검증, 데이터베이스 저장)이 프론트엔드 레이어에 혼재하면 테스트와 유지보수가 어려워집니다.

FastAPI 백엔드를 분리함으로써 API 키는 Railway 환경에 격리되고, 인증 로직은 독립적으로 테스트 가능해지며, LLM 파이프라인 로직이 백엔드 서비스 계층에 명확하게 분리됩니다.

프론트엔드 API Route는 쿠키를 포함한 요청을 백엔드로 중계하는 프록시 레이어 역할만 수행합니다.

### 데이터베이스 선택

개발 환경에서는 SQLite를 사용합니다. 파일 기반이기 때문에 별도의 데이터베이스 서버 없이 Railway에 단일 컨테이너로 배포할 수 있습니다.

프로덕션 확장을 위해 PostgreSQL 마이그레이션 경로를 준비해뒀습니다. SQLAlchemy ORM을 사용하기 때문에 `DATABASE_URL` 환경 변수만 변경하면 드라이버 교체 없이 마이그레이션됩니다.

---

## 7. 성능 및 운영 설계

### 단일 LLM 호출 최적화

MusicProfile과 DirectionExplanation을 단일 LLM 호출로 통합 생성합니다. 두 구조체를 하나의 중첩 JSON 스키마로 묶어 반환하도록 프롬프트를 설계했습니다.

```python
raw = await call_gemini(COMBINED_SYSTEM_PROMPT, user_msg, temperature=0.4, max_tokens=2000)
result = extract_json(raw)
music_profile = result["musicProfile"]
explanation = result["explanation"]
```

gpt-4o-mini 기준 평균 응답 시간은 약 5–10초입니다. 이전 2회 호출 구조(~50초) 대비 80% 단축됐습니다.

### 데모 모드와 목 데이터

LLM API 호출이 실패하거나 응답 시간이 너무 길 경우를 대비해 사전 정의된 목 데이터 세트를 내장하고 있습니다. 백엔드 `/api/health` 엔드포인트가 현재 모드(demo/production)와 사용 중인 모델을 반환하고, 프론트엔드는 이 정보를 UI에 표시합니다.

데모 모드는 두 가지 목적으로 존재합니다. 포트폴리오 시연 시 API 지연 없이 결과를 즉시 보여줄 수 있고, LLM 서비스 장애 시 서비스 자체가 완전히 중단되는 것을 막는 폴백 경로로 기능합니다.

### 레이트 리미팅

동일 IP에서의 과도한 LLM 호출은 OpenRouter 계정의 레이트 리밋을 소진할 수 있습니다. FastAPI 미들웨어에서 IP 기반 요청 빈도를 추적하고 임계값 초과 시 429를 반환합니다. 프론트엔드 API Route는 클라이언트 IP를 `X-Forwarded-For` 헤더로 백엔드에 전달합니다.

### 이미지 생성의 분리 및 프리로딩

앨범 커버 목업 이미지는 Pollinations.ai를 통해 생성됩니다. 이미지 생성 요청은 URL 파라미터 방식으로 이루어지며, 백엔드는 이미지 URL만 생성하고 실제 이미지 데이터는 브라우저가 직접 fetch합니다. 이미지 바이너리가 백엔드를 경유하지 않아 서버 메모리와 대역폭을 절약합니다.

분석 결과가 도착하는 즉시 브라우저 백그라운드에서 이미지를 미리 로딩합니다. 사용자가 분석 결과를 읽는 동안 이미지가 준비되어, "목업 생성하기" 버튼 클릭 시 즉시 표시됩니다. 이미지 완료 후에는 다음 이미지를 백그라운드에서 미리 생성해두어 "다시 생성" 버튼도 빠르게 동작합니다.

서버 혼잡으로 이미지 로딩 실패 시 자동으로 최대 3회 재시도하며(4초, 8초, 12초 간격), 3회 모두 실패할 때만 에러 메시지를 표시합니다.

Pollinations.ai는 `Referer` 헤더가 포함된 요청을 차단하는 정책이 있습니다. 프론트엔드 img 태그에 `referrerPolicy="no-referrer"`를 적용해 이 문제를 해결했습니다.

### 세션 기반 히스토리

로그인 사용자의 분석 결과는 백엔드 데이터베이스에 자동 저장됩니다. 비로그인 사용자의 경우 "결과 저장" 버튼을 통해 localStorage에 저장됩니다. 히스토리 페이지는 로그인 상태를 감지해 백엔드 세션 API 또는 localStorage 중 적절한 소스를 선택합니다.

---

## 8. 주요 기능

텍스트 분석: 자연어 입력 → MusicProfile + DirectionExplanation JSON 구조화 생성

이미지 분석: 이미지 업로드 → LLM Vision으로 음악적 특성 추출 → 텍스트 분석과 동일한 파이프라인 처리

MusicProfile 시각화: 에너지 바, 템포 배지, 감정/장르/악기/분위기/비주얼 연상 태그 카드로 시각화

히스토리: 로그인 시 백엔드 DB 세션 자동 저장 및 조회. 비로그인 시 localStorage 기반 저장

공유: 분석 결과에 고유 공유 URL 발급. 링크 접근자는 읽기 전용 결과 페이지 조회 가능

관리자 대시보드: 전체 유저 수, 분석 세션 수, 공유 링크 수, 조회 수 통계. 세션 목록 및 공유 링크 관리

앨범 커버 목업: MusicProfile의 visual_association 필드 기반으로 Flux 프롬프트 자동 구성 및 이미지 생성

[이미지 삽입: 분석 입력]
[이미지 삽입: 분석 결과]
[이미지 삽입: JSON 결과]
[이미지 삽입: 히스토리]
[이미지 삽입: 공유 화면]
[이미지 삽입: 관리자 화면]

---

## 9. 예시 시나리오

입력:

```
"우울한 날을 이겨내줄 폭발적인 펑크 락 사운드"
```

### 생성된 MusicProfile

```json
{
  "summary": "우울함을 돌파하는 공격적 에너지의 DIY 펑크 사운드 방향",
  "emotion": ["분노", "해방감", "저항"],
  "energy": "high",
  "tempo_feel": "fast",
  "genre": ["punk rock", "hardcore punk"],
  "instrumentation": ["일렉 기타 (디스토션)", "드럼 (빠른 비트)", "베이스 기타", "보컬 (거친 질감)"],
  "atmosphere": ["거칠고 날 것의", "압도적인", "카타르시스적"],
  "visual_association": ["부서진 앰프", "땀에 젖은 무대", "구겨진 포스터"],
  "listener_context": "혼자 방에서 감정을 분출하고 싶을 때",
  "content_goal": "live_performance"
}
```

### 생성된 방향성 가이드

음악 방향:

```
4/4박자 고속 비트(BPM 160–180)에 파워 코드 중심의 기타 리프를 기반으로 합니다.
브릿지에서 반 박자 느려지는 긴장감 구간을 삽입하고, 코러스에서 다시 폭발하는
전통적인 펑크 구조를 따릅니다. 보컬은 멜로디보다 발음의 직접성을 우선합니다.
```

사운드 편곡:

```
기타는 마샬 계열 앰프 드라이브를 최대로 올린 거친 디스토션을 사용합니다.
드럼은 하이햇을 닫고 스네어를 강하게 치는 펑크 그루브.
믹스는 중역대를 강조하고 저역을 의도적으로 얇게 처리해 날 것의 느낌을 살립니다.
리버브는 최소화합니다. 공간감이 없는 건조한 사운드가 이 방향의 정체성입니다.
```

비주얼 무드:

```
흑백 또는 채도가 낮은 붉은 계열 톤. 앨범 커버는 라이브 사진이나 손으로
직접 그린 듯한 텍스처를 활용합니다. DIY 지하 공연장의 거친 미학.
그래피티나 찢어진 스티커 질감의 타이포그래피가 어울립니다.
```

콘텐츠 활용:

```
라이브 공연 비디오에 적합합니다. 편집 컷을 빠르게 가져가고
핸드헬드 카메라 흔들림을 의도적으로 살립니다.
SNS 클립은 코러스 진입 직전 2–3초 정지 후 폭발하는 구간을 사용합니다.
```

### 앨범 커버 목업 생성 프롬프트 (자동 구성)

```
punk rock album cover, distorted electric guitar, sweaty live stage,
broken amplifier, crumpled posters, gritty monochrome with red tones,
DIY aesthetic, raw energy, hand-drawn texture, underground venue
```

---

## 10. 기술 스택

### Next.js 15 (App Router)

App Router의 서버 컴포넌트를 사용해 레이아웃 수준에서 쿠키를 읽고 인증 상태를 처리합니다. 클라이언트 컴포넌트와 서버 컴포넌트의 경계를 명확히 분리하고, 민감한 세션 처리는 서버 측에서만 실행되도록 설계했습니다.

API Route는 백엔드 프록시로만 사용합니다. 비즈니스 로직은 모두 FastAPI에 위임합니다.

### FastAPI

Python 비동기 프레임워크 중 OpenAPI 스키마 자동 생성과 타입 기반 유효성 검사를 기본 제공하는 FastAPI를 선택했습니다. `asyncio`와의 자연스러운 통합으로 LLM 병렬 호출 구현이 간결합니다.

SQLAlchemy + aiosqlite 조합으로 비동기 ORM을 구성했습니다.

### OpenRouter

여러 LLM 제공자를 단일 OpenAI 호환 API로 추상화하는 라우팅 레이어입니다. 모델을 교체할 때 API 엔드포인트나 인증 방식을 변경할 필요가 없습니다. 현재 무료 티어 모델을 사용 중이며, 유료 모델로 전환해도 환경 변수 하나만 바꾸면 됩니다.

### openai/gpt-4o-mini

OpenRouter를 통해 접근하는 OpenAI의 경량 모델입니다. instruction following이 안정적이고 평균 응답 시간이 5–10초로 빠릅니다. 이전에 사용하던 120B 무료 모델 대비 응답 속도가 5배 이상 개선됐습니다.

`extract_json()` 파싱 로직은 gpt-4o-mini뿐 아니라 reasoning 모델도 처리할 수 있도록 설계되어 있어 모델 교체에 유연합니다.

### Pollinations.ai (Flux)

앨범 커버 이미지 생성에 사용합니다. URL 파라미터 방식의 무인증 API를 제공해 별도의 API 키 없이 이미지 생성이 가능합니다. 백엔드는 visual_association 필드와 genre 필드를 기반으로 Flux 프롬프트를 자동 구성하고 URL만 반환합니다. 실제 이미지 로딩은 브라우저가 직접 처리합니다.

### Railway + Vercel

FastAPI 백엔드는 Docker 컨테이너로 Railway에 배포합니다. Railway는 GitHub 연동 자동 배포와 환경 변수 관리, 도메인 발급을 단순하게 처리합니다.

프론트엔드는 Vercel에 배포합니다. Next.js를 직접 지원하는 플랫폼이기 때문에 App Router, 서버 컴포넌트, Edge Function 최적화가 자동으로 적용됩니다.

GitHub Pages 같은 정적 호스팅은 이 아키텍처에 적합하지 않습니다. LLM API 키를 안전하게 보관할 서버 실행 환경이 필요하고, 세션 쿠키 기반 인증을 처리하려면 서버 측 실행 컨텍스트가 필요합니다.

### SQLite (개발) / PostgreSQL (프로덕션 준비)

SQLite는 외부 데이터베이스 서버 없이 Railway 컨테이너 내에서 파일로 동작합니다. 개발 사이클을 단순하게 유지하기 위해 선택했습니다. SQLAlchemy를 통한 ORM 사용으로 PostgreSQL 전환 시 `DATABASE_URL` 환경 변수만 변경하면 됩니다.

---

## 11. 배포 구조

```
GitHub
  │
  ├── Vercel (자동 배포, main 브랜치)
  │     Next.js 15 프론트엔드
  │     환경 변수: BACKEND_URL, JWT_SECRET
  │
  └── Railway (자동 배포, main 브랜치)
        FastAPI 백엔드
        환경 변수: LLM_PROVIDER, LLM_API_KEY, LLM_MODEL,
                   JWT_SECRET, DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD
```

### 환경 변수 분리

| 변수 | 위치 | 설명 |
|------|------|------|
| LLM_API_KEY | Railway only | OpenRouter API 키. 브라우저에 절대 노출되지 않음 |
| JWT_SECRET | Railway + Vercel | 쿠키 토큰 서명 키 |
| BACKEND_URL | Vercel | Next.js가 프록시할 FastAPI 주소 |
| DATABASE_URL | Railway | SQLite 파일 경로 또는 PostgreSQL URL |
| ADMIN_EMAIL / ADMIN_PASSWORD | Railway | 관리자 계정 초기값 |

### 보안 설계

LLM API 키는 Railway 환경에만 존재합니다. 프론트엔드 빌드 산출물이나 브라우저 네트워크 요청에서 노출되지 않습니다. 인증은 HttpOnly 쿠키 기반으로 처리해 XSS를 통한 토큰 탈취를 방지합니다.

---

## 12. 프로젝트 구조

```
MDE(Music Direction Engine)/
├── frontend/                      # Next.js 15 프론트엔드
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # 홈 (서버 컴포넌트)
│       │   ├── analyze/           # 분석 입력/결과 UI
│       │   ├── history/           # 분석 히스토리
│       │   ├── result/[id]/       # 결과 상세 페이지
│       │   ├── admin/             # 관리자 대시보드
│       │   ├── shared/[id]/       # 공유 결과 페이지
│       │   └── api/               # 백엔드 프록시 레이어
│       │       ├── analyze/
│       │       ├── sessions/
│       │       ├── auth/
│       │       └── share/
│       ├── components/
│       │   ├── music-profile/     # MusicProfileCard
│       │   ├── analysis-result/   # MusicDirectionSummary, AlbumMockup, ResultActions
│       │   ├── music-input/       # MusicIdeaInput, ExamplePromptList
│       │   ├── history/           # SavedHistoryList
│       │   ├── layout/            # Header, Footer
│       │   └── ui/                # 공통 UI 컴포넌트
│       ├── lib/
│       │   ├── ai-service/        # 이미지 프롬프트 빌더, 목 데이터
│       │   ├── hooks/             # useAnalyze
│       │   ├── history.ts         # localStorage + 백엔드 세션 헬퍼
│       │   └── auth-utils.ts      # JWT 검증 유틸
│       └── types/
│           └── music-profile.ts   # MusicProfile, DirectionExplanation 타입
│
├── backend/                       # FastAPI 백엔드
│   └── app/
│       ├── main.py                # FastAPI 앱 진입점, CORS, 미들웨어
│       ├── database.py            # SQLAlchemy 비동기 엔진
│       ├── models.py              # ORM 모델 (User, Session, SharedLink)
│       ├── auth.py                # JWT 발급/검증
│       └── services/
│           ├── direction_service.py     # 핵심 LLM 파이프라인 (단일 통합 호출)
│           ├── openrouter_service.py    # LLM 어댑터 (OpenRouter 호출, JSON 파싱)
│           └── image_service.py         # Pollinations.ai 이미지 URL 빌더
│
└── README.md
```

---

## 13. 배운 것

### LLM을 구조화 엔진으로 사용하는 방법

LLM은 대화 상대로도 쓸 수 있지만, 스키마 기반 데이터 변환 엔진으로 사용할 때 훨씬 강력합니다. 프롬프트가 지시문이 아니라 스키마 계약이 되는 순간, LLM 출력이 다운스트림 파이프라인의 입력 데이터가 됩니다. 이 관점의 전환이 MDE 설계의 핵심이었습니다.

### JSON 파싱의 신뢰성 문제

LLM이 JSON을 반환한다고 해서 항상 파싱 가능한 JSON이 오는 것은 아닙니다. 마크다운 코드 블록으로 감싸는 모델, 앞에 설명 텍스트를 붙이는 모델, reasoning 텍스트를 출력하는 모델을 모두 경험했습니다. 다단계 파싱 전략과 폴백 로직은 프로덕션 LLM 시스템에서 필수 요소임을 직접 확인했습니다.

### 모델 선택과 속도의 트레이드오프

처음에는 무료 120B 모델(gpt-oss-120b:free)을 사용했습니다. 무료이지만 공유 서버 큐잉으로 응답 시간이 호출당 약 25초에 달했고, 2회 순차 호출 구조로 총 50초가 소요됐습니다. gpt-4o-mini로 교체하고 호출을 1회로 통합하자 5–10초로 단축됐습니다. 모델 파라미터 크기, 무료/유료 여부, 호출 횟수 모두 응답 시간에 영향을 미치며 실제 서비스에서 반드시 고려해야 하는 요소입니다.

### 백엔드 분리의 시점

프론트엔드 레이어에서 LLM 호출을 직접 처리하면 초기 개발은 빠르지만 보안, 테스트, 유지보수 측면에서 문제가 생깁니다. API 키 노출 위험, 비즈니스 로직과 UI 로직의 혼재, 데이터베이스 직접 접근 등이 복잡성을 빠르게 높입니다. 백엔드 분리는 프로젝트 초기에 결정하는 것이 나중에 리팩토링하는 것보다 훨씬 저렴합니다.

### 스키마 기반 출력 시스템의 재사용성

MusicProfile JSON은 단순히 UI에 표시하기 위한 데이터가 아닙니다. 동일한 데이터가 이미지 생성 프롬프트 구성, 히스토리 검색, 관리자 통계, 공유 페이지에 재사용됩니다. 출력을 구조화된 스키마로 설계하면 기능 확장이 새로운 파이프라인 추가로 이루어지고, 기존 코드를 수정할 필요가 없습니다.

### 운영 관점의 설계 사고

데모 모드, 레이트 리미팅, 에러 폴백, 모드 표시 배지처럼 기능과 무관해 보이는 요소들이 실제 서비스에서는 필수적입니다. "동작하는 코드"와 "운영 가능한 서비스" 사이의 간격을 좁히는 것은 기능 구현만큼 중요한 작업입니다.

---

## 로컬 실행

```bash
# 백엔드
cd backend
pip install -r requirements.txt
cp .env.example .env  # LLM_API_KEY 등 환경 변수 설정
uvicorn app.main:app --reload --port 8000

# 프론트엔드
cd frontend
pnpm install
cp .env.example .env.local  # BACKEND_URL 설정
pnpm dev
```

브라우저에서 http://localhost:3000 접속

---

> MDE는 AI가 음악을 만드는 시스템이 아닙니다.
> 창작자가 음악의 방향을 잡을 수 있도록, 막연한 감정을 구조화된 창작 언어로 번역하는 시스템입니다.
