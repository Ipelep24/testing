import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    const { token } = await req.json()

    const cookieName = '__session'
    const cookieKey = process.env.COOKIE_SIGNATURE_KEY_CURRENT!
    const maxAge = 60 * 60 * 24 * 5 // 5 days

    // ✅ Sign the Firebase token as the JWT subject
    const signed = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${maxAge}s`)
        .setSubject(token) // Firebase token goes here
        .sign(new TextEncoder().encode(process.env.COOKIE_SIGNATURE_KEY_CURRENT!))


    const response = NextResponse.json({ success: true })
    response.cookies.set(cookieName, signed, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge,
    })

    return response
}
