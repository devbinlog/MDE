'use client'

import { useState, useCallback } from 'react'
import { AnalysisResult, AnalyzeRequest } from '@/types/music-profile'

interface UseAnalyzeState {
  result: AnalysisResult | null
  loading: boolean
  error: string | null
}

export function useAnalyze() {
  const [state, setState] = useState<UseAnalyzeState>({
    result: null,
    loading: false,
    error: null,
  })

  const analyze = useCallback(async (request: AnalyzeRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.detail || data.error || '분석에 실패했습니다.')
      }

      setState({ result: data.data, loading: false, error: null })
      return data.data as AnalysisResult
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ result: null, loading: false, error: null })
  }, [])

  return { ...state, analyze, reset }
}
