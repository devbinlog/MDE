import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cookie = req.cookies.get('mde_session')?.value

  // Forward real client IP so backend rate limiter is per-user, not per-proxy
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'

  const upstream = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': clientIp,
      ...(cookie ? { Cookie: `mde_session=${cookie}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
