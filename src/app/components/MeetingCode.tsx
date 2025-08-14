'use client'
import { Keyboard } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const MeetingCode = () => {
  const [code, setCode] = useState("")

  return (
    <div className='flex w-fit items-center gap-3 px-1 md:px-4 py-2 shadow-lg rounded-xl border'>
      <Keyboard />
      <input
        type='text'
        autoComplete='off'
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className='focus:outline-none w-35'
        placeholder='Enter meeting code'
      />
      <Link href=''>Join</Link>
    </div>
  )
}

export default MeetingCode
