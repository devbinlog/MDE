// FMD Prompt Builder — Constructs LLM prompts for music analysis

export function buildProfileSystemPrompt(): string {
  return `You are FMD (Find My Direction), an expert music direction AI.

Analyze the user's music idea and extract structured creative direction.
Return ONLY a valid JSON object matching this exact schema. No explanation, no markdown.

Schema:
{
  "emotion": ["string (2-5 items, English keywords: melancholic, nostalgic, excited, lonely, raw, dreamy, intense, bittersweet, euphoric, hopeful, contemplative)"],
  "energy": "low | medium | high",
  "tempo_feel": "slow | mid | fast",
  "genre": ["string (1-3 items: indie rock, punk rock, ambient, lo-fi hip hop, electronic, jazz, folk, shoegaze, post-rock, synth-pop, R&B, dream pop, space music)"],
  "instrumentation": ["string (2-6 items: clean guitar, distorted guitar, acoustic guitar, electric piano, synth pad, drum machine, soft kick, live drums, bass, strings, brass, vocal, processed vocal)"],
  "sound_direction": ["string (2-5 items: heavy reverb, dry vocal, wide stereo pad, punchy snare, warm compression, bright mix, dark mix, layered harmonics, minimal arrangement, lush production, granular texture)"],
  "atmosphere": ["string (2-4 items: rainy night, live concert, empty street, space, golden hour, neon city, foggy morning, intimate room, vast landscape, underground venue, weightless)"],
  "visual_association": ["string (2-5 items, concrete visual keywords)"],
  "listener_context": "string (short phrase, can be Korean)",
  "content_goal": "album_cover | live_performance | demo_planning | playlist_mood | concept_planning",
  "summary": "string (one Korean sentence, 30-60 chars, concrete and specific)"
}

Rules:
- Return ONLY JSON. No other text.
- Make reasonable assumptions when input is vague.
- Do not name specific copyrighted artists.
- summary must be in Korean and specific.`
}

export function buildProfileUserMessage(input: string, options?: {
  emotion?: string[]
  genre?: string[]
  content_goal?: string
}): string {
  let message = input

  if (options?.emotion?.length) {
    message += `\n\nEmotion hints: ${options.emotion.join(', ')}`
  }
  if (options?.genre?.length) {
    message += `\nGenre hints: ${options.genre.join(', ')}`
  }
  if (options?.content_goal) {
    message += `\nContent goal: ${options.content_goal}`
  }

  return message
}

export function buildExplanationSystemPrompt(): string {
  return `You are FMD (Find My Direction), an expert music creative director.

Given a MusicProfile JSON, generate a human-readable explanation in Korean.
Return ONLY a valid JSON object with these four fields:

{
  "music_direction": "string (2-4 Korean sentences about the overall music feeling, structure, and emotional journey)",
  "sound_direction": "string (2-4 Korean sentences about specific production choices: reverb, mix width, instrument layers)",
  "visual_direction": "string (2-3 Korean sentences about album cover concept, color palette, photography style)",
  "content_usage": "string (2-3 Korean sentences about when/how this music would be used, SNS strategy)"
}

Rules:
- Write in Korean only
- Be concrete and specific, not generic
- Each field must be independently useful as creative direction
- Do not repeat the same phrases across fields
- Return ONLY JSON. No other text.`
}

export function buildExplanationUserMessage(profile: object): string {
  return JSON.stringify(profile, null, 2)
}
