'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'

import ParticipantGrid from './ParticipantGrid'
import SharedContent from './SharedContent'
import SidebarPanel from './SidebarPanel'
import FooterControls from './FooterControl'

const CHANNEL = process.env.NEXT_PUBLIC_AGORA_CHANNEL!
const UID = Math.floor(Math.random() * 10000)
const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!
const { RTM } = AgoraRTM

export default function VideoChat() {
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
  const participantRef = useRef<HTMLDivElement>(null)
  const ferInterval = useRef<NodeJS.Timeout | null>(null)

  const getResponsiveMaxTiles = useCallback((width: number) => {
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
  }, [share, side])

  const updateMaxTiles = () => {
    const width = participantRef.current?.offsetWidth ?? window.innerWidth
    setMaxTiles(getResponsiveMaxTiles(width))
  }

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

    try {
      const response = await fetch('/api/agoraRTCToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: CHANNEL, uid: UID }),
      })
      const { token } = await response.json()

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
        const container = document.getElementById(`remote-${user.uid}`)
        if (container) user.videoTrack?.play(container)
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
      activeMembers.add(String(UID))

      channel.on('MemberJoined', (id) => {
        activeMembers.add(id)
        setRtmMembers(Array.from(activeMembers))
      })

      channel.on('MemberLeft', (id) => {
        activeMembers.delete(id)
        setRtmMembers(Array.from(activeMembers))
      })
    }

    initRTM()

    return () => {
      rtcClient.removeAllListeners()
      stopFER()
      observer.disconnect()
    }
  }, [share, side, getResponsiveMaxTiles])

  return (
    <div className="w-full h-screen p-1 gap-2 flex flex-col">
      <div className="flex w-full flex-grow gap-2 overflow-hidden">
        <div className="rounded-2xl p-2 grow flex gap-2 h-full">
          <SharedContent visible={share} />

          <div
            ref={participantRef}
            className={`${share ? 'w-[30%]' : side ? 'w-[70%]' : 'w-full'} h-full`}
          >
            <ParticipantGrid
              remoteUsers={remoteUsers}
              rtmMembers={rtmMembers}
              joined={joined}
              UID={UID}
              maxTiles={maxTiles}
              localRef={localRef}
            />
          </div>

          <SidebarPanel visible={side} />
        </div>
      </div>

      <FooterControls
        joined={joined}
        micOn={micOn}
        camOn={camOn}
        onJoin={joinChannel}
        onLeave={leaveChannel}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleSidebar={() => setSide((prev) => !prev)}
        onToggleShare={() => setShare((prev) => !prev)}
        side={side}
        share={share}
      />
    </div>
  )
}