'use client'
import React from 'react'
import { ChevronDown } from 'lucide-react'

type Role = 'host' | 'participant'

interface RoleSwitcherProps {
  role: Role
  onToggle: () => void
}

const Role: React.FC<RoleSwitcherProps> = ({ role, onToggle }) => {
  return (
    <div
      className='flex items-center gap-1 px-4 cursor-pointer select-none'
      onClick={onToggle}
    >
      <h1 className='text-xl capitalize'>{role}</h1>
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-300 ${role === 'participant' ? 'rotate-180' : ''}`}
      />
    </div>
  )
}

export default Role
