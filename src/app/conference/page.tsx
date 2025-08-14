'use client'
import React from 'react'
import dynamic from 'next/dynamic';

const VideoChat = dynamic(() => import('./components/VideoChat'), { ssr: false });

const Conference = () => {
  return (
    <main className="p-8">
      <h1>Agora Video Test</h1>
      <VideoChat />
    </main>
  )
}

export default Conference
