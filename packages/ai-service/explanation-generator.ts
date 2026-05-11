// FMD Explanation Generator — Human-readable direction text

import { buildExplanationSystemPrompt, buildExplanationUserMessage } from './prompt-builder'
import type { MusicProfile, DirectionExplanation } from './types'

export async function generateExplanation(
  profile: MusicProfile,
  apiKey: string,
  model: string = 'gpt-4o-mini',
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<DirectionExplanation> {
  const system = buildExplanationSystemPrompt()
  const userMessage = buildExplanationUserMessage(profile)

  try {
    const raw = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: provider === 'openai' ? model : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    })

    if (!raw.ok) throw new Error(\`API error \${raw.status}\`)

    const data = await raw.json()
    const parsed = JSON.parse(data.choices[0].message.content)

    return {
      music_direction: parsed.music_direction || '',
      sound_direction: parsed.sound_direction || '',
      visual_direction: parsed.visual_direction || '',
      content_usage: parsed.content_usage || '',
    }
  } catch (err) {
    // Return fallback explanation
    return {
      music_direction: \`\${profile.genre.join(', ')} 장르 기반의 \${profile.energy} 에너지 음악입니다. \${profile.summary}\`,
      sound_direction: \`\${profile.sound_direction.join(', ')} 방향으로 프로덕션하세요.\`,
      visual_direction: \`\${profile.visual_association.join(', ')} 키워드를 중심으로 비주얼을 구성하세요.\`,
      content_usage: \`\${profile.listener_context} 상황에 어울리는 방향입니다.\`,
    }
  }
}
