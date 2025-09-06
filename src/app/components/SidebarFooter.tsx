'use client'

import { auth } from '@/lib/firebase/firebase'
import { signOut } from 'firebase/auth'
import { ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../AuthContext'
import SidebarFooterSkeleton from '../skeletons/SidebarFooterSkeleton'

const SidebarFooter = () => {
    const [openProfile, setOpenProfile] = useState(false)
    const router = useRouter()
    const { user, loading, setSkipNextAuthChange } = useAuth()

    const handleLogout = async () => {
        setSkipNextAuthChange(true)
        await signOut(auth)
        await fetch('/api/logout', { method: 'POST' })
        localStorage.setItem('welcomeToast', 'Logged Out') // ✅ defer toast
        window.location.href = '/auth' // ✅ full reload
    }

    console.log('Current Firebase user:', auth.currentUser)

    return loading ? <SidebarFooterSkeleton /> : (
        <div
            className='relative px-2 flex items-center w-full justify-center md:gap-2 h-1/8
    md:bg-[#384959] rounded-md'
            onClick={() => setOpenProfile(prev => !prev)}
        >
            <Image
                src='/logo.png'
                alt='Profile'
                width={100}
                height={100}
                className='border border-gray-300 h-8 w-8 rounded-full'
            />
            <div className='flex-col hidden md:flex'>
                <p className='truncate max-w-[120px] overflow-ellipsis text-white text-sm whitespace-nowrap'>
                    {user?.displayName}
                </p>
                <p className='truncate max-w-[120px] overflow-ellipsis text-xs text-gray-400' title={user?.email ?? undefined}>
                    {user?.email}
                </p>
            </div>
            <div>
                <ChevronsUpDown className='hidden text-white md:block w-4 h-4' />
            </div>
            {openProfile && (
                <div className='z-1000 space-y-2 w-fit h-fit p-3 md:text-sm border-2 border-white bg-[#384959] text-white absolute -right-24 rounded-md bottom-0'>
                    <p>Settings</p>
                    <p onClick={handleLogout} className='cursor-pointer'>Logout</p>
                </div>
            )}
        </div>
    )
}

export default SidebarFooter
