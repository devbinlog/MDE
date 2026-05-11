/**
 * FMD Shared Types
 * Shared between frontend and backend (TypeScript definitions)
 */

export type EnergyLevel = "very_low" | "low" | "medium" | "high" | "very_high";

export type TempoFeel =
  | "crawling"
  | "slow_drifting"
  | "walking"
  | "steady_groove"
  | "driving"
  | "rushing"
  | "frantic";

export type ContentGoal =
  | "emotional_release"
  | "motivation"
  | "relaxation"
  | "focus"
  | "storytelling"
  | "celebration"
  | "social_connection"
  | "artistic_expression"
  | "commercial";

export interface MusicProfile {
  emotion: string[];
  energy: EnergyLevel;
  tempo_feel: TempoFeel;
  genre: string[];
  instrumentation: string[];
  atmosphere: string[];
  visual_association: string[];
  listener_context: string;
  content_goal: ContentGoal;
}

export interface DirectionOutput {
  session_id: string;
  profile: MusicProfile;
  music_direction: string | null;
  visual_direction: string | null;
  content_direction: string | null;
}

export interface GenerateRequest {
  input: string;
  language?: "ko" | "en";
  options?: {
    include_visual?: boolean;
    include_content?: boolean;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    detail?: unknown;
  };
  meta: {
    request_id: string;
    duration_ms?: number;
    model_used?: string;
  };
}

export type GenerateResponse = APIResponse<DirectionOutput>;
