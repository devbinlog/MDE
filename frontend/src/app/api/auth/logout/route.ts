import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get('mde_session')?.value

  const upstream = await fetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: cookie ? { Cookie: `mde_session=${cookie}` } : {},
  })

  const data = await upstream.json()
  const res = NextResponse.json(data, { status: upstream.status })

  const setCookie = upstream.headers.get('set-cookie')
  if (setCookie) {
    res.headers.set('set-cookie', setCookie)
  }

  return res
}
