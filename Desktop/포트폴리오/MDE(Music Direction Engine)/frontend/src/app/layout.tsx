import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { verifyToken } from '@/lib/auth-utils'
import './globals.css'

export const metadata: Metadata = {
  title: 'MDE — Music Direction Engine',
  description: '음악 아이디어를 구조화된 창작 방향으로 변환하는 LLM 기반 뮤직 디렉션 엔진',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('mde_session')?.value
  const user = token ? await verifyToken(token) : null

  return (
    <html lang="ko">
      <body>
        <Header isLoggedIn={!!user} userEmail={user?.email ?? null} />
        <main style={{ paddingTop: '60px', minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
