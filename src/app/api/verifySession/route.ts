import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'

const app = getApps().length === 0
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  : getApp()

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    const decodedToken = await getAuth(app).verifyIdToken(token)

    return NextResponse.json({ uid: decodedToken.uid, email: decodedToken.email })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}