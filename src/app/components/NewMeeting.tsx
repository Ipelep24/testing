'use client'
import React from 'react'
import { Video } from 'lucide-react'

const NewMeeting = () => {
  return (
    <div className='w-fit whitespace-nowrap flex items-center gap-3 bg-[#384959] tracking-wide text-white px-4 py-1 rounded-3xl'>
        <Video />
        <p>New Meeting</p>
    </div>
  )
}

export default NewMeeting
