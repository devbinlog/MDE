// MDE Profile Generator — MusicProfile generation with retry logic

import { buildProfileSystemPrompt, buildProfileUserMessage } from './prompt-builder'
import { validateProfileSchema } from './validator'
import type { GenerateOptions, MusicProfile } from './types'

export type LLMProvider = 'openai' | 'anthropic' | 'groq' | 'gemini' | 'ollama'

const MAX_RETRIES = 3

/** 무료 한도 초과 전용 에러 — 재시도 없이 즉시 사용자에게 전달 */
export class RateLimitError extends Error {
  constructor() {
    super('RATE_LIMIT_EXCEEDED')
    this.name = 'RateLimitError'
  }
}

function extractJSON(raw: string): string {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  return match ? match[1].trim() : raw.trim()
}

export async function generateMusicProfile(
  options: GenerateOptions,
  apiKey: string,
  model: string = 'gemini-2.0-flash',
  provider: LLMProvider = 'gemini'
): Promise<MusicProfile> {
  const system = buildProfileSystemPrompt()
  const userMessage = buildProfileUserMessage(options.input, options.options)

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callLLM({ system, userMessage, apiKey, model, provider, temperature: 0.3, maxTokens: 1024 })
      const parsed = JSON.parse(extractJSON(raw))

      if (!validateProfileSchema(parsed)) {
        throw new Error('MusicProfile schema validation failed')
      }

      return parsed as MusicProfile
    } catch (err) {
      // 한도 초과는 재시도 없이 즉시 throw
      if (err instanceof RateLimitError) throw err

      lastError = err instanceof Error ? err : new Error(String(err))
      console.warn(`Profile generation attempt ${attempt} failed: ${lastError.message}`)
      if (attempt < MAX_RETRIES) await sleep(1000 * attempt)
    }
  }

  throw new Error(`MusicProfile generation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`)
}

interface LLMCallOptions {
  system: string
  userMessage: string
  apiKey: string
  model: string
  provider: LLMProvider
  temperature: number
  maxTokens: number
}

async function callLLM(opts: LLMCallOptions): Promise<string> {
  switch (opts.provider) {
    case 'gemini':   return callGemini(opts)
    case 'anthropic': return callAnthropic(opts)
    default:         return callOpenAICompatible(opts) // openai, groq
  }
}

// ── Gemini ─────────────────────────────────────────────────────────────
async function callGemini(opts: LLMCallOptions): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: 'user', parts: [{ text: opts.userMessage }] }],
      generationConfig: {
        temperature: opts.temperature,
        maxOutputTokens: opts.maxTokens,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (response.status === 429) throw new RateLimitError()

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Gemini API error ${response.status}: ${JSON.stringify(error)}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// ── OpenAI / Groq (호환 포맷) ───────────────────────────────────────
async function callOpenAICompatible(opts: LLMCallOptions): Promise<string> {
  const BASE: Record<string, string> = {
    openai:  'https://api.openai.com/v1/chat/completions',
    groq:    'https://api.groq.com/openai/v1/chat/completions',
    ollama:  'http://localhost:11434/v1/chat/completions',
  }
  const url = BASE[opts.provider]

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: 'system', content: opts.system },
        { role: 'user', content: opts.userMessage },
      ],
      temperature: opts.temperature,
      max_tokens: opts.maxTokens,
      response_format: { type: 'json_object' },
    }),
  })

  if (response.status === 429) throw new RateLimitError()

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`${opts.provider} API error ${response.status}: ${JSON.stringify(error)}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// ── Anthropic ──────────────────────────────────────────────────────
async function callAnthropic(opts: LLMCallOptions): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model,
      system: opts.system,
      messages: [{ role: 'user', content: opts.userMessage }],
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
    }),
  })

  if (response.status === 429) throw new RateLimitError()

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Anthropic API error ${response.status}: ${JSON.stringify(error)}`)
  }

  const data = await response.json()
  return data.content[0].text
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
