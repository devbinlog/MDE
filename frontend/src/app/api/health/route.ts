import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function GET() {
  try {
    const upstream = await fetch(`${BACKEND_URL}/health`, { cache: 'no-store' })
    const data = await upstream.json()
    return NextResponse.json(data, { status: upstream.status })
  } catch {
    // Backend not reachable — return degraded status
    return NextResponse.json(
      { status: 'degraded', error: 'Backend unreachable' },
      { status: 503 }
    )
  }
}
