import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const upstream = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  const res = NextResponse.json(data, { status: upstream.status })

  // Forward Set-Cookie from backend so browser stores it on :3000
  const setCookie = upstream.headers.get('set-cookie')
  if (setCookie) {
    res.headers.set('set-cookie', setCookie)
  }

  return res
}
