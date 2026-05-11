# 방향성 설명 프롬프트 설계 노트

## 목적

MusicProfile JSON을 입력받아 4개 필드의 한국어 창의적 방향성 설명 생성.

## 핵심 설계 결정

### 1. Profile을 입력으로 사용
직접 사용자 텍스트를 받지 않고, 1단계에서 생성된 MusicProfile JSON을 입력.
→ LLM이 이미 구조화된 데이터를 기반으로 설명하므로 일관성 향상.

### 2. temperature=0.7
MusicProfile 생성(0.3)보다 높은 온도.
각 설명 필드는 창의적이고 읽기 좋은 텍스트여야 하므로 다양성 허용.

### 3. 4개 필드 독립성
각 필드(`music_direction`, `sound_direction`, `visual_direction`, `content_usage`)는
독립적으로 활용 가능해야 함. 같은 표현 반복 금지.

### 4. Fallback 처리
설명 생성 실패 시 MusicProfile에서 genre, emotion을 추출해 기본 텍스트 생성.
분석 전체가 실패하지 않도록 graceful degradation.

```python
def _make_fallback_explanation(profile: dict) -> dict:
    genre = ", ".join(profile.get("genre", ["음악"]))
    emotion = ", ".join(profile.get("emotion", ["감성적"]))
    return {
        "music_direction": f"{genre} 장르의 {emotion} 분위기를 담은 음악입니다.",
        "sound_direction": "사운드 방향은 프로파일을 참고해 주세요.",
        "visual_direction": "비주얼 방향은 프로파일을 참고해 주세요.",
        "content_usage": "다양한 콘텐츠에 활용 가능합니다.",
    }
```
