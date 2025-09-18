'use client'

import { auth } from '@/lib/firebase/firebase'
import { signOut } from 'firebase/auth'
import { ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import SidebarFooterSkeleton from '../skeletons/SidebarFooterSkeleton'
import { useUI } from '../context/UIContext'

const SidebarFooter = () => {
  const [openProfile, setOpenProfile] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, loading, setSkipNextAuthChange } = useAuth()
  const { setShowSettings } = useUI()

  const handleLogout = async () => {
    setOpenProfile(false)
    setSkipNextAuthChange(true)

    await toast.promise(
      (async () => {
        await signOut(auth)
        await fetch('/api/logout', { method: 'POST' })
        localStorage.setItem('welcomeToast', 'Logged Out')
        window.location.href = '/auth'
      })(),
      {
        loading: 'Logging out...',
        error: 'Logout failed. Please try again.',
      }
    )
  }

  const handleSettingsClick = () => {
    setOpenProfile(false)
    setShowSettings(true)
  }

  const fallbackSrc = '/logo.png'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const outsideTrigger = triggerRef.current && !triggerRef.current.contains(target)
      const outsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target)

      if (outsideTrigger && outsideDropdown) {
        setOpenProfile(false)
      }
    }

    if (openProfile) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openProfile])

  return loading ? <SidebarFooterSkeleton /> : (
    <div className="relative w-full flex justify-center items-center px-2 md:gap-2 h-1/8 md:bg-[#384959] rounded-md">
      {/* Trigger */}
      <div
        ref={triggerRef}
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpenProfile(prev => !prev)}
      >
        <Image
          src={user?.photoURL || fallbackSrc}
          alt="Profile"
          width={100}
          height={100}
          className="border border-[#384959] h-8 w-8 rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = fallbackSrc
          }}
        />
        <div className="flex-col hidden md:flex">
          <p className="truncate max-w-[120px] text-white text-sm" title={user?.displayName ?? undefined}>
            {user?.displayName}
          </p>
          <p className="truncate max-w-[120px] text-xs text-gray-400" title={user?.email ?? undefined}>
            {user?.email}
          </p>
        </div>
        <ChevronsUpDown className="hidden md:block text-white w-4 h-4" />
      </div>

      {/* Dropdown */}
      {openProfile && (
        <div
          ref={dropdownRef}
          className="absolute bottom-0 -right-50 z-50 bg-[#384959] text-white p-3 rounded-md border shadow-lg space-y-2 w-fit h-fit md:text-sm"
        >
          <div className="flex gap-2 justify-center items-center">
            <Image
              src={user?.photoURL || fallbackSrc}
              alt="Profile"
              width={100}
              height={100}
              className="border border-[#384959] h-8 w-8 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = fallbackSrc
              }}
            />
            <div className="flex-col">
              <p className="truncate max-w-[120px] text-white text-sm" title={user?.displayName ?? undefined}>
                {user?.displayName}
              </p>
              <p className="truncate max-w-[120px] text-xs text-gray-400" title={user?.email ?? undefined}>
                {user?.email}
              </p>
            </div>
          </div>
          <hr className="border-gray-600" />
          <p onClick={handleSettingsClick} className="cursor-pointer hover:text-gray-300">Settings</p>
          <p onClick={handleLogout} className="cursor-pointer hover:text-gray-300">Logout</p>
        </div>
      )}
    </div>
  )
}

export default SidebarFooter