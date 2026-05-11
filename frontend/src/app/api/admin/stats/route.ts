import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('mde_session')?.value

  const upstream = await fetch(`${BACKEND_URL}/admin/stats`, {
    headers: cookie ? { Cookie: `mde_session=${cookie}` } : {},
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
