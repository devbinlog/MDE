// MDE Explanation Generator — Human-readable direction text

import { buildExplanationSystemPrompt, buildExplanationUserMessage } from './prompt-builder'
import { RateLimitError } from './profile-generator'
import type { MusicProfile, DirectionExplanation } from './types'
import type { LLMProvider } from './profile-generator'

function extractJSON(raw: string): string {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  return match ? match[1].trim() : raw.trim()
}

export async function generateExplanation(
  profile: MusicProfile,
  apiKey: string,
  model: string = 'gemini-2.0-flash',
  provider: LLMProvider = 'gemini'
): Promise<DirectionExplanation> {
  const system = buildExplanationSystemPrompt()
  const userMessage = buildExplanationUserMessage(profile)

  try {
    let rawText: string

    switch (provider) {
      case 'gemini':    rawText = await callGemini({ system, userMessage, apiKey, model }); break
      case 'anthropic': rawText = await callAnthropic({ system, userMessage, apiKey, model }); break
      default:          rawText = await callOpenAICompatible({ system, userMessage, apiKey, model, provider }); break
    }

    const parsed = JSON.parse(extractJSON(rawText))

    return {
      music_direction: parsed.music_direction || '',
      sound_direction: parsed.sound_direction || '',
      visual_direction: parsed.visual_direction || '',
      content_usage: parsed.content_usage || '',
    }
  } catch (err) {
    // 한도 초과는 fallback 없이 그대로 re-throw
    if (err instanceof RateLimitError) throw err

    // 그 외 API 오류는 프로파일 기반 fallback
    return {
      music_direction: `${profile.genre.join(', ')} 장르 기반의 ${profile.energy} 에너지 음악입니다. ${profile.summary}`,
      sound_direction: `${profile.sound_direction.join(', ')} 방향으로 프로덕션하세요.`,
      visual_direction: `${profile.visual_association.join(', ')} 키워드를 중심으로 비주얼을 구성하세요.`,
      content_usage: `${profile.listener_context} 상황에 어울리는 방향입니다.`,
    }
  }
}

// ── Gemini ─────────────────────────────────────────────────────────
async function callGemini({ system, userMessage, apiKey, model }: {
  system: string; userMessage: string; apiKey: string; model: string
}): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (response.status === 429) throw new RateLimitError()
  if (!response.ok) throw new Error(`Gemini API error ${response.status}`)

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// ── OpenAI / Groq ──────────────────────────────────────────────────
async function callOpenAICompatible({ system, userMessage, apiKey, model, provider }: {
  system: string; userMessage: string; apiKey: string; model: string; provider: LLMProvider
}): Promise<string> {
  const BASE: Record<string, string> = {
    openai:  'https://api.openai.com/v1/chat/completions',
    groq:    'https://api.groq.com/openai/v1/chat/completions',
    ollama:  'http://localhost:11434/v1/chat/completions',
  }
  const response = await fetch(BASE[provider], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: system }, { role: 'user', content: userMessage }],
      temperature: 0.7, max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  })

  if (response.status === 429) throw new RateLimitError()
  if (!response.ok) throw new Error(`${provider} API error ${response.status}`)

  const data = await response.json()
  return data.choices[0].message.content
}

// ── Anthropic ──────────────────────────────────────────────────────
async function callAnthropic({ system, userMessage, apiKey, model }: {
  system: string; userMessage: string; apiKey: string; model: string
}): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model, system,
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 1024, temperature: 0.7,
    }),
  })

  if (response.status === 429) throw new RateLimitError()
  if (!response.ok) throw new Error(`Anthropic API error ${response.status}`)

  const data = await response.json()
  return data.content[0].text
}
