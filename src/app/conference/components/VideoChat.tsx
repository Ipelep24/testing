'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const CHANNEL = process.env.NEXT_PUBLIC_AGORA_CHANNEL!;
const TOKEN = process.env.NEXT_PUBLIC_AGORA_TOKEN!;
const UID = Math.floor(Math.random() * 10000);

export default function VideoChat() {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rtcClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    setClient(rtcClient);

    rtcClient.on('user-published', async (user, mediaType) => {
      await rtcClient.subscribe(user, mediaType);

      setRemoteUsers((prev) => {
        const exists = prev.find((u) => u.uid === user.uid);
        return exists ? prev : [...prev, user];
      });

      let retries = 0;
      const tryPlay = () => {
        const container = document.getElementById(`remote-${user.uid}`);
        if (container) {
          user.videoTrack?.play(container);
        } else if (retries < 10) {
          retries++;
          setTimeout(tryPlay, 100);
        }
      };

      if (mediaType === 'video') tryPlay();
      if (mediaType === 'audio') user.audioTrack?.play();
    });

    rtcClient.on('user-unpublished', (user) => {
      setRemoteUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? { ...u, audioTrack: undefined, videoTrack: undefined }
            : u
        )
      );
    });

    rtcClient.on('user-left', (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    return () => {
      rtcClient.removeAllListeners();
    };
  }, []);

  const joinChannel = async () => {
    if (!client) return;

    await client.join(APP_ID, CHANNEL, TOKEN, UID);

    const existingUsers = client.remoteUsers;
    const isFirstUser = existingUsers.length === 0;
    setIsHost(isFirstUser);

    if (isFirstUser) {
      client.setClientRole('host');
    } else {
      client.setClientRole('audience', { level: 1 });
    }

    localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
    localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

    if (isFirstUser) {
      await client.publish([localAudioTrack.current, localVideoTrack.current]);
    }

    if (localRef.current) {
      localVideoTrack.current.play(localRef.current);
    }

    setJoined(true);
  };

  const leaveChannel = async () => {
    if (!client) return;

    if (localAudioTrack.current) {
      localAudioTrack.current.stop();
      localAudioTrack.current.close();
      localAudioTrack.current = null;
    }

    if (localVideoTrack.current) {
      localVideoTrack.current.stop();
      localVideoTrack.current.close();
      localVideoTrack.current = null;
    }

    await client.leave();
    setRemoteUsers([]);
    setJoined(false);
    setIsHost(false);
  };

  const toggleMic = () => {
    if (!localAudioTrack.current) return;
    const nextState = !micOn;
    localAudioTrack.current.setEnabled(nextState);
    setMicOn(nextState);
  };

  const toggleCam = () => {
    if (!localVideoTrack.current || !localRef.current) return;
    const nextState = !camOn;
    localVideoTrack.current.setEnabled(nextState);
    setCamOn(nextState);
    if (nextState) {
      localVideoTrack.current.play(localRef.current);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-64 bg-black relative">
        <div ref={localRef} className="absolute inset-0" />
        {!camOn && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Camera Off
          </div>
        )}
        {joined && (
          <div className="absolute bottom-2 left-2 text-white text-sm">Local user {UID}</div>
        )}
      </div>

      <div className="grid gap-4">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="w-full h-64 bg-gray-800 relative">
            <div id={`remote-${user.uid}`} className="absolute inset-0" />
            {!user.videoTrack && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                Camera Off
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-white text-sm">Remote user {user.uid}</div>
          </div>
        ))}
      </div>

      {!joined ? (
        <button onClick={joinChannel}>Join</button>
      ) : (
        <div className="space-x-2">
          <button onClick={toggleMic}>{micOn ? 'Mute Mic' : 'Unmute Mic'}</button>
          <button onClick={toggleCam}>{camOn ? 'Turn Off Cam' : 'Turn On Cam'}</button>
          <button onClick={leaveChannel}>Leave</button>
        </div>
      )}
    </div>
  );
}
