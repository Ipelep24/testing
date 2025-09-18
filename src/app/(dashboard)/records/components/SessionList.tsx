'use client'
import React from 'react'

type Session = {
  name: string
  date: string
}

interface SessionListProps {
  sessions: Session[]
  selectedSession: string | null
  onSelect: (sessionName: string) => void
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  selectedSession,
  onSelect
}) => {
  return (
    <div className='flex flex-col justify-center w-full xs:w-1/2 lg:w-1/3 h-full shadow-md bg-white rounded-lg overflow-clip'>
      <div className='flex justify-center items-center bg-[#384959] text-white w-full h-1/12'>
        <h1 className='text-xl'>Session List</h1>
      </div>
      <div className='flex flex-col h-11/12 w-full overflow-y-auto'>
        {sessions.map((session) => (
          <div
            key={session.name}
            className={`border-b border-gray-400 w-full p-2 cursor-pointer hover:bg-gray-100 ${
              selectedSession === session.name ? 'bg-gray-100 hover:bg-gray-200' : ''
            }`}
            onClick={() => onSelect(session.name)}
          >
            <p className='truncate sm:overflow-visible max-w-25'>{session.name}</p>
            <p className='text-sm text-gray-400'>{session.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SessionList
