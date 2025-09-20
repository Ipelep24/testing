'use client'
import {
    ILocalVideoTrack,
    IRemoteVideoTrack,
    ILocalAudioTrack,
    IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { useEffect, useRef } from 'react'

interface Props {
    uid: string | number
    isLocal: boolean
    videoTrack?: ILocalVideoTrack | IRemoteVideoTrack
    audioTrack?: ILocalAudioTrack | IRemoteAudioTrack
    localRef?: React.RefObject<HTMLDivElement | null>
}

export default function ParticipantTile({ uid, isLocal, videoTrack, audioTrack, localRef }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!isLocal && videoTrack && containerRef.current) {
            videoTrack.play(containerRef.current)
        }
    }, [videoTrack])

    return (
        <div className="flex-1 min-w-[150px] basis-[calc(100%/5-0.5rem)] min-h-[120px] flex items-center justify-center bg-green-100 rounded-md relative">
            <div
                id={isLocal ? 'local-video' : `remote-${uid}`}
                className="absolute inset-0"
                ref={isLocal ? localRef : undefined}
            />
            {!videoTrack && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                    Camera Off
                </div>
            )}
            {!audioTrack && (
                <div className="absolute top-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                    Mic Off
                </div>
            )}
            <div className="absolute bottom-2 left-2 text-white text-sm">
                {isLocal ? `Local user ${uid}` : `Remote user ${uid}`}
            </div>
        </div>
    )
}