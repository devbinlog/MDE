import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cookie = req.cookies.get('mde_session')?.value

  const upstream = await fetch(`${BACKEND_URL}/analyze/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': req.headers.get('x-forwarded-for') || '127.0.0.1',
      ...(cookie ? { Cookie: `mde_session=${cookie}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
