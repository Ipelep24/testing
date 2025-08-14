'use client';

import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useRef, useState } from 'react';

const APP_ID = '95d6859d38f7424cbec2c797b66df617';
const CHANNEL = 'test';
const TEMP_TOKEN = '007eJxTYMgI8qnq6F358Nm2oCCpkHtzftRb6Obscvl9fpfNj529zlkKDJamKWYWppYpxhZp5iZGJslJqclGyeaW5klmZilpZobmndVzMxoCGRl03xswMEIhiM/CUJJaXMLAAADC1iDt';
const UID = String(Math.floor(Math.random() * 10000));

export default function VideoChat() {
    const [joined, setJoined] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [micTrack, setMicTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [camTrack, setCamTrack] = useState<ICameraVideoTrack | null>(null);

    const localRef = useRef<HTMLDivElement>(null);
    const client = useRef<any>(null); // Delay creation until client-side

    useEffect(() => {
        client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        return () => {
            handleLeave();
        };
    }, []);

    const handleJoin = async () => {
        if (joined || !client.current) return;

        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setMicTrack(audioTrack);
        setCamTrack(videoTrack);

        audioTrack.play();
        videoTrack.play(localRef.current!);
        await client.current.join(APP_ID, CHANNEL, TEMP_TOKEN, UID);
        await client.current.publish([audioTrack, videoTrack]);
        setJoined(true);
    };


    const handleToggleMic = () => {
        if (!micTrack) return;
        micOn ? micTrack.setEnabled(false) : micTrack.setEnabled(true);
        setMicOn(!micOn);
    };

    const handleToggleCam = () => {
        if (!camTrack) return;
        camOn ? camTrack.setEnabled(false) : camTrack.setEnabled(true);
        setCamOn(!camOn);
    };


    const handleLeave = async () => {
        if (micTrack) {
            micTrack.stop();
            micTrack.close();
            setMicTrack(null);
        }
        if (camTrack) {
            camTrack.stop();
            camTrack.close();
            setCamTrack(null);
        }
        await client.current?.leave();
        setJoined(false);
    };

    return (
        <div className="space-y-4">
            <div ref={localRef} className="w-full h-64 bg-black" />
            {!joined ? (
                <button onClick={handleJoin}>Join Call</button>
            ) : (
                <>
                    <button onClick={handleToggleMic}>{micOn ? 'Mute Mic' : 'Unmute Mic'}</button>
                    <button onClick={handleToggleCam}>{camOn ? 'Turn Off Cam' : 'Turn On Cam'}</button>
                    <button onClick={handleLeave}>End Call</button>
                </>
            )}
        </div>
    );
}
