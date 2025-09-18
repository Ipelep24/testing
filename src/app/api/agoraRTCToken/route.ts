// app/api/agoraToken/route.ts
import { RtcTokenBuilder, RtcRole } from 'agora-token'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { channel, uid } = body

    if (!channel || uid === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID
    const appCertificate = process.env.AGORA_APP_CERTIFICATE

    if (!appId || !appCertificate) {
      return NextResponse.json({ error: 'Missing Agora credentials' }, { status: 500 })
    }

    const expirationTime = 3600

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channel,
      uid,
      RtcRole.PUBLISHER,
      expirationTime,
      expirationTime
    )

    return NextResponse.json({ token })
  } catch (err) {
    console.error('Token route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}