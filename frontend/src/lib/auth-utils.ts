// FMD Auth Utils — JWT sign/verify via jose
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mde_fallback_secret_dev'
)

const COOKIE_NAME = 'mde_session'
const EXPIRES_IN = 60 * 60 * 24 * 7 // 7일

export interface JWTPayload {
  sub: string      // user id
  email: string
  role: 'user' | 'admin'
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export { COOKIE_NAME, EXPIRES_IN }
