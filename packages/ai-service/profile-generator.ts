// FMD Profile Generator — MusicProfile generation with retry logic

import { buildProfileSystemPrompt, buildProfileUserMessage } from './prompt-builder'
import { validateProfileSchema } from './validator'
import type { GenerateOptions, MusicProfile } from './types'

const MAX_RETRIES = 3

export async function generateMusicProfile(
  options: GenerateOptions,
  apiKey: string,
  model: string = 'gpt-4o',
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<MusicProfile> {
  const system = buildProfileSystemPrompt()
  const userMessage = buildProfileUserMessage(options.input, options.options)

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callLLM({
        system,
        userMessage,
        apiKey,
        model,
        provider,
        jsonMode: true,
        temperature: 0.3,
        maxTokens: 1024,
      })

      const parsed = JSON.parse(raw)

      if (!validateProfileSchema(parsed)) {
        throw new Error('MusicProfile schema validation failed')
      }

      return parsed as MusicProfile
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.warn(\`Profile generation attempt \${attempt} failed: \${lastError.message}\`)

      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt) // exponential backoff
      }
    }
  }

  throw new Error(\`MusicProfile generation failed after \${MAX_RETRIES} attempts: \${lastError?.message}\`)
}

interface LLMCallOptions {
  system: string
  userMessage: string
  apiKey: string
  model: string
  provider: 'openai' | 'anthropic'
  jsonMode: boolean
  temperature: number
  maxTokens: number
}

async function callLLM(opts: LLMCallOptions): Promise<string> {
  if (opts.provider === 'openai') {
    return callOpenAI(opts)
  } else {
    return callAnthropic(opts)
  }
}

async function callOpenAI(opts: LLMCallOptions): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${opts.apiKey}\`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: 'system', content: opts.system },
        { role: 'user', content: opts.userMessage },
      ],
      temperature: opts.temperature,
      max_tokens: opts.maxTokens,
      response_format: opts.jsonMode ? { type: 'json_object' } : undefined,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(\`OpenAI API error \${response.status}: \${JSON.stringify(error)}\`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

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

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(\`Anthropic API error \${response.status}: \${JSON.stringify(error)}\`)
  }

  const data = await response.json()
  return data.content[0].text
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
