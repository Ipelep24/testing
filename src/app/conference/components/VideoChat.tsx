'use client'

import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'

const CHANNEL = process.env.NEXT_PUBLIC_AGORA_CHANNEL!
const UID = Math.floor(Math.random() * 10000)
const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!
const { RTM } = AgoraRTM

export default function ConferenceRTC() {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [joined, setJoined] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [rtmMembers, setRtmMembers] = useState<string[]>([])
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [side, setSide] = useState(false)
  const [share, setShare] = useState(false)
  const [maxTiles, setMaxTiles] = useState(15)

  const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null)
  const localVideoTrack = useRef<ICameraVideoTrack | null>(null)
  const localRef = useRef<HTMLDivElement>(null)
  const ferInterval = useRef<NodeJS.Timeout | null>(null)
  const participantRef = useRef<HTMLDivElement>(null)

  const getResponsiveMaxTiles = (width: number) => {
    if (!share && !side) {
      if (width < 768) return 8
      if (width < 1024) return 12
      return 15
    }
    if (share && !side) {
      if (width < 300) return 4
      if (width < 500) return 8
      return 12
    }
    if (!share && side) {
      if (width < 300) return 4
      if (width < 768) return 8
      return 12
    }
    return 15
  }

  const waitForContainer = (id: string): Promise<HTMLElement> =>
    new Promise((resolve) => {
      const container = document.getElementById(id)
      if (container) return resolve(container)

      const observer = new MutationObserver(() => {
        const el = document.getElementById(id)
        if (el) {
          observer.disconnect()
          resolve(el)
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })
    })

  useEffect(() => {
    const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    setClient(rtcClient)

    rtcClient.on('user-published', async (user, mediaType) => {
      await rtcClient.subscribe(user, mediaType)

      setRemoteUsers((prev) => {
        const exists = prev.find((u) => u.uid === user.uid)
        return exists ? prev : [...prev, user]
      })

      if (mediaType === 'video') {
        waitForContainer(`remote-${user.uid}`).then((container) => {
          user.videoTrack?.play(container)
        })
      }

      if (mediaType === 'audio') user.audioTrack?.play()
    })

    rtcClient.on('token-privilege-will-expire', async () => {
      try {
        const response = await fetch('/api/agoraRTCToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: CHANNEL, uid: UID }),
        })
        const { token: newToken } = await response.json()
        await rtcClient.renewToken(newToken)
        console.log('Token renewed')
      } catch (err) {
        console.error('Token renewal failed:', err)
      }
    })

    rtcClient.on('user-joined', (user) => {
      setRemoteUsers((prev) => {
        const exists = prev.find((u) => u.uid === user.uid)
        return exists ? prev : [...prev, user]
      })
    })

    rtcClient.on('user-unpublished', (user) => {
      setRemoteUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? { ...u, audioTrack: undefined, videoTrack: undefined }
            : u
        )
      )
    })

    rtcClient.on('user-left', (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid))
    })

    const updateMaxTiles = () => {
      const width = participantRef.current?.offsetWidth ?? window.innerWidth
      setMaxTiles(getResponsiveMaxTiles(width))
    }

    updateMaxTiles()
    const observer = new ResizeObserver(() => updateMaxTiles())
    if (participantRef.current) observer.observe(participantRef.current)

    const initRTM = async () => {
      const rtmClient = new RTM(APP_ID, String(UID))

      const response = await fetch('/api/agoraRtmToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: UID }),
      })
      const { token } = await response.json()

      await rtmClient.login({ token })
      await rtmClient.subscribe(CHANNEL)

      const channel = rtmClient.createStreamChannel(CHANNEL)
      await channel.join()

      const activeMembers = new Set<string>()
      activeMembers.add(String(UID)) // Add self

      channel.on('MemberJoined', (id) => {
        activeMembers.add(id)
        setRtmMembers(Array.from(activeMembers))
      })

      channel.on('MemberLeft', (id) => {
        activeMembers.delete(id)
        setRtmMembers(Array.from(activeMembers))
      })

      rtmClient.addEventListener("presence", (event) => {
        console.log("Presence event:", event)
      })

      rtmClient.addEventListener("status", (event) => {
        console.log("Connection status changed:", event.state, event.reason)
      })
    }

    initRTM()

    return () => {
      rtcClient.removeAllListeners()
      stopFER()
      observer.disconnect()
    }
  }, [share, side])

  const startFER = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ferInterval.current = setInterval(async () => {
      if (!localRef.current || !ctx) return

      const videoEl = localRef.current.querySelector('video')
      if (!videoEl) return

      canvas.width = videoEl.videoWidth
      canvas.height = videoEl.videoHeight
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)

      const imageData = canvas.toDataURL('image/jpeg')

      try {
        const response = await fetch('/api/fer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imageData.replace(/^data:image\/\w+;base64,/, ''),
          }),
        })

        const result = await response.json()
        const emotion = result.faces?.[0]?.attributes?.emotion
        if (emotion) console.log('Detected emotion:', emotion)
      } catch (err) {
        console.error('FER Error:', err)
      }
    }, 3000)
  }

  const stopFER = () => {
    if (ferInterval.current) {
      clearInterval(ferInterval.current)
      ferInterval.current = null
    }
  }

  const joinChannel = async () => {
    if (!client) return

    const fetchToken = async () => {
      const response = await fetch('/api/agoraRTCToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: CHANNEL, uid: UID }),
      })
      const { token } = await response.json()
      return token
    }

    try {
      const token = await fetchToken()
      await client.join(APP_ID, CHANNEL, token, UID)

      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack()
      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack()

      await client.publish([localAudioTrack.current, localVideoTrack.current])

      if (localRef.current) {
        localVideoTrack.current.play(localRef.current)
      }

      startFER()
      setJoined(true)
    } catch (error) {
      console.error('Join failed:', error)
    }
  }

  const leaveChannel = async () => {
    if (!client) return

    stopFER()

    localAudioTrack.current?.stop()
    localAudioTrack.current?.close()
    localAudioTrack.current = null

    localVideoTrack.current?.stop()
    localVideoTrack.current?.close()
    localVideoTrack.current = null

    await client.leave()
    setRemoteUsers([])
    setJoined(false)
  }

  const toggleMic = () => {
    if (!localAudioTrack.current) return
    const nextState = !micOn
    localAudioTrack.current.setEnabled(nextState)
    setMicOn(nextState)
  }

  const toggleCam = () => {
    if (!localVideoTrack.current || !localRef.current) return
    const nextState = !camOn
    localVideoTrack.current.setEnabled(nextState)
    setCamOn(nextState)
    if (nextState) {
      localVideoTrack.current.play(localRef.current)
    }
  }

  const renderParticipants = () => {
    const allUIDs = new Set([
      ...remoteUsers.map((u) => u.uid),
      ...(joined ? [UID] : []),
      ...rtmMembers.map((id) => Number(id)),
    ])

    const count = allUIDs.size
    const isOverflow = count > maxTiles
    const visibleUsers = isOverflow ? maxTiles - 1 : count
    const overflow = isOverflow ? count - visibleUsers : 0

    const usersToRender = Array.from(allUIDs).map((uid) => {
      const isLocal = uid === UID
      const user = remoteUsers.find((u) => u.uid === uid)
      return {
        uid,
        isLocal,
        videoTrack: user?.videoTrack,
        audioTrack: user?.audioTrack,
      }
    })

    return (
      <div className="w-full h-full flex flex-wrap gap-2 overflow-hidden justify-center">
        {usersToRender.slice(0, visibleUsers).map((user: any) => (
          <div
            key={user.uid}
            className="flex-1 min-w-[150px] basis-[calc(100%/5-0.5rem)] min-h-[120px] flex items-center justify-center bg-green-100 rounded-md relative"
          >
            <div
              id={user.isLocal ? 'local-video' : `remote-${user.uid}`}
              className="absolute inset-0"
              ref={user.isLocal ? localRef : undefined}
            />
            {!user.videoTrack && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                Camera Off
              </div>
            )}
            {!user.audioTrack && (
              <div className="absolute top-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                Mic Off
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-white text-sm">
              {user.isLocal ? `Local user ${UID}` : `Remote user ${user.uid}`}
            </div>
          </div>
        ))}
        {isOverflow && (
          <div className="flex-1 min-w-[150px] basis-[calc(100%/5-0.5rem)] min-h-[120px] flex items-center justify-center bg-green-100 rounded-md font-semibold text-green-700">
            +{overflow} more
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-screen p-1 gap-2 flex flex-col">
      <div className="flex w-full flex-grow gap-2 overflow-hidden">
        <div className="rounded-2xl p-2 grow flex gap-2 h-full">
          {share && (
            <div className="w-[70%] min-w-[150px] h-full bg-yellow-200 rounded-md flex items-center justify-center text-xl font-bold text-yellow-700">
              Shared Content
            </div>
          )}

          <div
            ref={participantRef}
            className={`${share ? 'w-[30%]' : side ? 'w-[70%]' : 'w-full'} h-full`}
          >
            {renderParticipants()}
          </div>

          {side && (
            <div className="w-[30%] min-w-[170px] h-full rounded-md bg-purple-100 p-2 overflow-y-auto">
              <div className="text-lg font-semibold mb-2">Sidebar Panel</div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="p-2 border border-purple-300 rounded-md bg-white shadow-sm mb-2"
                >
                  Chat message {i + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="h-[15%] rounded-xl flex items-center justify-between px-4 bg-blue-100">
        <div className="space-x-2">
          {!joined ? (
            <button
              onClick={joinChannel}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Join
            </button>
          ) : (
            <>
              <button
                onClick={toggleMic}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                {micOn ? 'Mute Mic' : 'Unmute Mic'}
              </button>
              <button
                onClick={toggleCam}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                {camOn ? 'Turn Off Cam' : 'Turn On Cam'}
              </button>
              <button
                onClick={leaveChannel}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Leave
              </button>
            </>
          )}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setSide((prev) => !prev)}
            className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            {side ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <button
            onClick={() => setShare((prev) => !prev)}
            className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
          >
            {share ? 'Stop Sharing' : 'Start Sharing'}
          </button>
        </div>
      </div>
    </div>
  )
}