import { HistoryItem, AnalysisResult } from '@/types/music-profile'

const HISTORY_KEY = 'mde_history'
const MAX_HISTORY = 20

// ── localStorage helpers (used when not logged in) ───────────────────

export function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const items = JSON.parse(raw) as HistoryItem[]
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return []
  }
}

export function saveToHistory(result: AnalysisResult): void {
  if (typeof window === 'undefined') return
  try {
    const current = loadHistory()
    const item: HistoryItem = {
      id: result.id,
      input: result.input,
      summary: result.musicProfile.summary,
      createdAt: result.createdAt,
      result,
    }
    const updated = [item, ...current.filter(h => h.id !== result.id)].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    console.warn('Failed to save history')
  }
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const current = loadHistory()
    const updated = current.filter(item => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    console.warn('Failed to delete history item')
  }
}

export function getHistoryItem(id: string): HistoryItem | null {
  const items = loadHistory()
  return items.find(item => item.id === id) || null
}

// ── Backend session helpers (used when logged in) ────────────────────

export interface BackendSession {
  id: string
  input_text: string
  summary: string
  created_at: string
  is_mock: boolean
}

/**
 * Load history from backend /api/sessions.
 * Call this on the history page when the user is logged in.
 */
export async function loadBackendHistory(): Promise<BackendSession[]> {
  try {
    const res = await fetch('/api/sessions')
    if (!res.ok) return []
    return (await res.json()) as BackendSession[]
  } catch {
    return []
  }
}

/**
 * Load a single session detail from backend.
 */
export async function loadBackendSession(id: string): Promise<AnalysisResult | null> {
  try {
    const res = await fetch(`/api/sessions/${id}`)
    if (!res.ok) return null
    const s = await res.json()
    return {
      id: s.id,
      input: s.input_text,
      musicProfile: s.music_profile,
      explanation: s.explanation,
      createdAt: s.created_at,
      isMock: s.is_mock,
    } as AnalysisResult
  } catch {
    return null
  }
}

/**
 * Delete a session from backend.
 */
export async function deleteBackendSession(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Search sessions on backend.
 */
export async function searchBackendHistory(q: string): Promise<BackendSession[]> {
  try {
    const res = await fetch(`/api/sessions/search?q=${encodeURIComponent(q)}`)
    if (!res.ok) return []
    return (await res.json()) as BackendSession[]
  } catch {
    return []
  }
}
