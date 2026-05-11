import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const upstream = await fetch(`${BACKEND_URL}/share/${id}`)
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookie = req.cookies.get('mde_session')?.value

  const upstream = await fetch(`${BACKEND_URL}/share/${id}`, {
    method: 'DELETE',
    headers: cookie ? { Cookie: `mde_session=${cookie}` } : {},
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
