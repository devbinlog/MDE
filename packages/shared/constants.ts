/**
 * FMD Shared Constants
 */

export const ENERGY_LEVELS: Record<string, string> = {
  very_low: "매우 낮음",
  low: "낮음",
  medium: "보통",
  high: "높음",
  very_high: "매우 높음",
};

export const TEMPO_FEELS: Record<string, string> = {
  crawling: "극도로 느린",
  slow_drifting: "천천히 흐르는",
  walking: "걷는 속도",
  steady_groove: "그루브감 있는",
  driving: "앞으로 나아가는",
  rushing: "빠르고 급박한",
  frantic: "혼돈, 통제 불가",
};

export const CONTENT_GOALS: Record<string, string> = {
  emotional_release: "감정 해소",
  motivation: "동기부여",
  relaxation: "긴장 완화",
  focus: "집중력 향상",
  storytelling: "이야기 전달",
  celebration: "축하",
  social_connection: "관계 강화",
  artistic_expression: "예술적 표현",
  commercial: "광고/브랜드",
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const MAX_INPUT_LENGTH = 500;
export const MIN_INPUT_LENGTH = 10;
