'use client'
import React from 'react'
import dynamic from 'next/dynamic';

const VideoChat = dynamic(() => import('./components/VideoChat'), { ssr: false });

const Conference = () => {
  return (
    <main className='h-screen w-full'>
      <VideoChat />
    </main>
  )
}

export default Conference
