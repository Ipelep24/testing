import { RtmTokenBuilder } from 'agora-token'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uid } = body
    console.log('Received UID:', uid)

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID
    const useSecondary = process.env.USE_SECONDARY_CERT === 'true'
    const appCertificate = useSecondary
      ? process.env.AGORA_SECONDARY_CERTIFICATE
      : process.env.AGORA_PRIMARY_CERTIFICATE

    console.log('App ID:', appId)
    console.log('App Certificate:', appCertificate ? '[REDACTED]' : 'Missing')

    if (!uid || !appId || !appCertificate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const expirationTimeInSeconds = 3600
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    const token = RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
      String(uid), // ✅ RTM requires string UID
      privilegeExpiredTs
    )

    console.log('Generated RTM token:', token)
    return NextResponse.json({ token })
  } catch (err) {
    console.error('RTM Token route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}