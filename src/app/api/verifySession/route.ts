import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

const app = getApps().length === 0
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\n/g, '\n'),
      }),
    })
  : getApp()

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    const decodedToken = await getAuth(app).verifyIdToken(token)

    const jwt = await new SignJWT({ sub: decodedToken.uid })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.COOKIE_SIGNATURE_KEY_CURRENT!))

    ;(await cookies()).set('__session', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })

    return NextResponse.json({ uid: decodedToken.uid, email: decodedToken.email })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}