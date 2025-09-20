import React from 'react'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import ParticipantTile from './ParticipantTile'

interface Props {
  remoteUsers: IAgoraRTCRemoteUser[]
  rtmMembers: string[]
  joined: boolean
  UID: string | number
  maxTiles: number
  localRef: React.RefObject<HTMLDivElement | null>
}

export default function ParticipantGrid({ remoteUsers, rtmMembers, joined, UID, maxTiles, localRef }: Props) {
  const allUIDs = new Set([
  ...remoteUsers.map((u) => String(u.uid)),
  ...(joined ? [UID] : []),
  ...rtmMembers,
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
      {usersToRender.slice(0, visibleUsers).map((user) => (
        <ParticipantTile key={user.uid} {...user} localRef={localRef} />
      ))}
      {isOverflow && (
        <div className="flex-1 min-w-[150px] basis-[calc(100%/5-0.5rem)] min-h-[120px] flex items-center justify-center bg-green-100 rounded-md font-semibold text-green-700">
          +{overflow} more
        </div>
      )}
    </div>
  )
}