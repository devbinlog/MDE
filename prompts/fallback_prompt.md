# Fallback 처리 전략

## Fallback 발생 상황

| 상황 | 처리 방식 |
|------|---------|
| Gemini API 429 (quota 초과) | HTTP 429 반환 + 한국어 안내 메시지 |
| Gemini API 5xx (서버 오류) | HTTP 502 반환 + "AI 서비스 일시적 오류" 메시지 |
| JSON 파싱 실패 (비정형 응답) | GeminiServiceError → HTTP 502 |
| 방향성 설명 생성 실패 | `_make_fallback_explanation()` 호출 (분석 결과는 반환) |

## 에러 메시지 (사용자 표시)

```python
# Gemini quota 초과
"오늘의 무료 AI 분석 한도를 초과했습니다. 내일 다시 시도해주세요. (Gemini 무료: 1,500회/일)"

# 이미지 분석 quota 초과
"AI 분석 한도를 초과했습니다. 잠시 후 다시 시도해주세요."

# Gemini 서버 오류
"AI 서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

# 입력 너무 짧음
"입력이 너무 짧습니다. 최소 10자 이상 입력해주세요."

# 입력 너무 긺
"입력이 너무 깁니다. 최대 500자까지 입력 가능합니다."
```

## Fallback 설명 예시

genre=['indie pop'], emotion=['melancholic', 'nostalgic'] 기준:

```json
{
  "music_direction": "indie pop 장르의 melancholic, nostalgic 분위기를 담은 음악입니다.",
  "sound_direction": "사운드 방향은 프로파일을 참고해 주세요.",
  "visual_direction": "비주얼 방향은 프로파일을 참고해 주세요.",
  "content_usage": "다양한 콘텐츠에 활용 가능합니다."
}
```
