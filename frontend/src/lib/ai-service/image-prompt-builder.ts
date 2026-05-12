// FMD Image Prompt Builder — Builds Pollinations.ai prompt from MusicProfile

import type { MusicProfile } from './types'

const STYLE_MAP: Record<string, string> = {
  'indie rock': 'indie aesthetic, film grain, analog',
  'dream pop': 'dreamy, soft bokeh, pastel haze',
  'punk rock': 'raw energy, gritty texture, high contrast',
  'ambient': 'minimal, vast, abstract light',
  'lo-fi hip hop': 'warm grain, vintage, cozy',
  'electronic': 'neon, synthetic, digital glow',
  'jazz': 'smoky, intimate, warm tone',
  'shoegaze': 'washed out, layered blur, ethereal',
  'post-rock': 'cinematic, expansive, emotional',
  'synth-pop': 'retro neon, synthwave, 80s palette',
  'folk': 'organic, earthy, natural light',
  'space music': 'cosmic, deep space, nebula colors',
}

const ENERGY_MAP: Record<string, string> = {
  low: 'quiet, intimate, understated',
  medium: 'balanced, flowing, measured',
  high: 'intense, bold, dynamic',
}

export function buildImagePrompt(profile: MusicProfile): string {
  const visual = profile.visual_association.slice(0, 4).join(', ')
  const atmosphere = profile.atmosphere.slice(0, 2).join(', ')
  const genreStyle = profile.genre
    .map(g => STYLE_MAP[g] || g)
    .slice(0, 2)
    .join(', ')
  const energyDesc = ENERGY_MAP[profile.energy] || ''
  const emotion = profile.emotion.slice(0, 2).join(', ')

  return [
    'album cover art',
    visual,
    atmosphere,
    genreStyle,
    energyDesc,
    emotion,
    'professional photography, square format, no text, no typography',
  ]
    .filter(Boolean)
    .join(', ')
}

export function buildPollinationsUrl(profile: MusicProfile): string {
  const prompt = buildImagePrompt(profile)
  const encoded = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 999999)
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${seed}`
}
