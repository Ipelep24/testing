import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
  const cookieStore = cookies()
  const cookie = (await cookieStore).get('__session')?.value
  const protectedPaths = ['/records', '/', '/conference']
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

  if (!cookie && isProtected) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  try {
    const { payload } = await jwtVerify(
      cookie!,
      new TextEncoder().encode(process.env.COOKIE_SIGNATURE_KEY_CURRENT!)
    )

    // Optionally attach UID to headers
    const uid = payload.sub as string
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', uid)

    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    if (isProtected) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/records/:path*', '/', '/conference/:path*'],
}