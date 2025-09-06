'use client'

import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng'

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!
const CHANNEL = process.env.NEXT_PUBLIC_AGORA_CHANNEL!
const TOKEN = process.env.NEXT_PUBLIC_AGORA_TOKEN!
const UID = Math.floor(Math.random() * 10000)

export default function VideoChat() {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [joined, setJoined] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
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

  useEffect(() => {
    const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    setClient(rtcClient)

    rtcClient.on('user-published', async (user, mediaType) => {
      await rtcClient.subscribe(user, mediaType)

      setRemoteUsers((prev) => {
        const exists = prev.find((u) => u.uid === user.uid)
        return exists ? prev : [...prev, user]
      })

      let retries = 0
      const tryPlay = () => {
        const container = document.getElementById(`remote-${user.uid}`)
        if (container) {
          user.videoTrack?.play(container)
        } else if (retries < 10) {
          retries++
          setTimeout(tryPlay, 100)
        }
      }

      if (mediaType === 'video') tryPlay()
      if (mediaType === 'audio') user.audioTrack?.play()
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

        if (emotion) {
          console.log('Detected emotion:', emotion)
        } else {
          console.warn('No face detected')
        }
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

    try {
      await client.join(APP_ID, CHANNEL, TOKEN, UID)
    } catch (error) {
      console.error('Join failed:', error)
      return
    }

    localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack()
    localVideoTrack.current = await AgoraRTC.createCameraVideoTrack()

    localVideoTrack.current?.setEncoderConfiguration({
      width: 640,
      height: 360,
      frameRate: 15,
      bitrateMin: 300,
      bitrateMax: 800,
    })

    await client.publish([localAudioTrack.current, localVideoTrack.current])

    if (localRef.current) {
      localVideoTrack.current.play(localRef.current)
    }

    startFER()
    setJoined(true)
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
    const tileMinWidth = share
      ? 'min-w-[120px]'
      : 'min-w-[max(calc((100%-32px)/5),200px)]'
    const tileMinHeight = share ? 'min-h-[100px]' : 'min-h-[100px]'
    const overflowMinHeight = share ? 'min-h-[90px]' : 'min-h-[100px]'

    const count = remoteUsers.length + (joined ? 1 : 0)
    const isOverflow = count > maxTiles
    const visibleUsers = isOverflow ? maxTiles - 1 : count
    const overflow = isOverflow ? count - (maxTiles - 1) : 0

    const usersToRender = [...remoteUsers]
    if (joined) {
      usersToRender.unshift({ uid: UID, isLocal: true } as any)
    }

    return (
      <div className="w-full h-full flex flex-wrap flex-1 gap-2 overflow-y-auto">
        {usersToRender.slice(0, visibleUsers).map((user: any) => (
          <div
            key={user.uid}
            className={`flex-1 flex mx-auto items-center justify-center ${tileMinWidth} ${tileMinHeight} max-w-[500px] border-2 border-green-300 bg-green-100 rounded-md relative`}
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
            <div className="absolute bottom-2 left-2 text-white text-sm">
              {user.isLocal ? `Local user ${UID}` : `Remote user ${user.uid}`}
            </div>
          </div>
        ))}
        {isOverflow && (
          <div
            className={`flex-1 flex mx-auto items-center justify-center ${tileMinWidth} ${overflowMinHeight} max-w-[500px] border-2 border-green-300 bg-green-100 rounded-md`}
          >
            +{overflow} more
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border-2 border-black w-full h-screen p-1 gap-2 flex flex-col">
      <div className="flex w-full h-full gap-2 overflow-hidden">
        <div className="border-2 border-red-400 rounded-2xl p-2 grow flex gap-2 h-full">
          {share && (
            <div className="w-[70%] h-full border-2 border-yellow-400 rounded-md">
              <div className="flex items-center justify-center h-full text-yellow-700 font-semibold">
                Shared Content Area
              </div>
            </div>
          )}

          {!share && !side && (
            <div ref={participantRef} className="w-full h-full">
              {renderParticipants()}
            </div>
          )}
          {!share && side && (
            <div ref={participantRef} className="w-[70%] h-full">
              {renderParticipants()}
            </div>
          )}
          {share && !side && (
            <div ref={participantRef} className="w-[30%] h-full">
              {renderParticipants()}
            </div>
          )}

          {side && (
            <div className="w-[30%] min-w-[170px] h-full border-2 border-purple-400 rounded-md bg-purple-100 p-2 overflow-y-auto">
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

      <div className="border-2 border-blue-400 h-[15%] rounded-xl flex items-center justify-between px-4 bg-blue-100">
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
