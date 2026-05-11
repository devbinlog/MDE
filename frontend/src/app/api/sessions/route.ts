import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('mde_session')?.value
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  const url = q
    ? `${BACKEND_URL}/sessions/search?q=${encodeURIComponent(q)}`
    : `${BACKEND_URL}/sessions`

  const upstream = await fetch(url, {
    headers: cookie ? { Cookie: `mde_session=${cookie}` } : {},
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
