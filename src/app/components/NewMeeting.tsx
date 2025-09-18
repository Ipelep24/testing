'use client'
import React from 'react'
import { Video } from 'lucide-react'

const NewMeeting = () => {
  return (
    <div className='w-fit whitespace-nowrap flex items-center py-2 gap-3 bg-[#384959] tracking-wide text-white px-4 rounded-md'>
        <Video />
        <p className='text-md'>New Meeting</p>
    </div>
  )
}

export default NewMeeting
