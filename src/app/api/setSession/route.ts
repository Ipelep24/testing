import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(req: Request) {
  const { token } = await req.json()

  const cookieName = '__session'
  const cookieKey = process.env.COOKIE_SIGNATURE_KEY_CURRENT!
  const maxAge = 60 * 60 * 24 * 5 // 5 days

  const signed = await new SignJWT({ sub: token }) // embed token in payload
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(new TextEncoder().encode(cookieKey))

  const response = NextResponse.json({ success: true })
  response.cookies.set(cookieName, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  })

  return response
}