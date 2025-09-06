export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
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

export async function middleware(req: NextRequest) {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('__session')?.value
    const protectedPaths = ['/records', '/', '/conference']
    const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

    if (!cookie && isProtected) {
        return NextResponse.redirect(new URL('/auth', req.url))
    }

    try {
        // ✅ Verify your signed cookie
        const { payload } = await jwtVerify(cookie!, new TextEncoder().encode(process.env.COOKIE_SIGNATURE_KEY_CURRENT!))
        const firebaseToken = payload.sub as string

        // ✅ Verify the Firebase token
        const decodedToken = await getAuth(app).verifyIdToken(firebaseToken)

        // Optionally attach user info to request here
        return NextResponse.next()
    } catch (err) {
        if (isProtected) {
            return NextResponse.redirect(new URL('/auth', req.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/records/:path*', '/', '/conference/:path*'],
}
