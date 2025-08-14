import React from 'react'

const NotFound = () => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-3'>
      <h1 className='text-2xl'>404 not found</h1>
      <h1 className='text-xl md:text-2xl font-extrabold'>HOW DID YOU GET HERE?!</h1>
      <h2 className='text-lg font-bold'>You&apos;ve found Oui-Iau Cat!!🐈</h2>
        <video
          src="/ouicat.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-1/2 h-auto object-contain rounded-2xl shadow-2xl"
          controls={false}
        />
    </div>
  )
}

export default NotFound
