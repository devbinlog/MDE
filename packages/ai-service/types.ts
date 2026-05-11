import type { MusicProfile, DirectionExplanation, AnalysisResult, AnalyzeRequest } from '../../frontend/src/types/music-profile'

export type { MusicProfile, DirectionExplanation, AnalysisResult, AnalyzeRequest }

export interface AIServiceConfig {
  apiKey: string
  model: string
  provider: 'openai' | 'anthropic'
  mockMode: boolean
}

export interface GenerateOptions {
  input: string
  options?: {
    emotion?: string[]
    genre?: string[]
    content_goal?: string
  }
}
