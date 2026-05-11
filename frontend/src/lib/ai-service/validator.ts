// FMD Validator — Schema validation for MusicProfile

const VALID_ENERGY = new Set(['low', 'medium', 'high'])
const VALID_TEMPO = new Set(['slow', 'mid', 'fast'])
const VALID_CONTENT_GOAL = new Set([
  'album_cover', 'live_performance', 'demo_planning', 'playlist_mood', 'concept_planning'
])

export function validateProfileSchema(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>

  // Required array fields
  const arrayFields = ['emotion', 'genre', 'instrumentation', 'sound_direction', 'atmosphere', 'visual_association']
  for (const field of arrayFields) {
    if (!Array.isArray(d[field]) || (d[field] as unknown[]).length === 0) {
      console.warn(`Validation failed: ${field} must be non-empty array`)
      return false
    }
  }

  // Enum fields
  if (!VALID_ENERGY.has(d.energy as string)) {
    console.warn(`Validation failed: energy must be low/medium/high, got: ${d.energy}`)
    return false
  }
  if (!VALID_TEMPO.has(d.tempo_feel as string)) {
    console.warn(`Validation failed: tempo_feel must be slow/mid/fast, got: ${d.tempo_feel}`)
    return false
  }
  if (!VALID_CONTENT_GOAL.has(d.content_goal as string)) {
    console.warn(`Validation failed: content_goal invalid, got: ${d.content_goal}`)
    return false
  }

  // String fields
  if (typeof d.listener_context !== 'string' || d.listener_context.length === 0) return false
  if (typeof d.summary !== 'string' || d.summary.length === 0) return false

  return true
}

export function sanitizeInput(input: string): string {
  const trimmed = input.trim()
  if (trimmed.length < 10) throw new Error('입력이 너무 짧습니다. 10자 이상 입력해주세요.')
  if (trimmed.length > 500) throw new Error('입력이 너무 깁니다. 500자 이내로 입력해주세요.')
  return trimmed
}
