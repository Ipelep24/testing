'use client'
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CirclePlus, SquareLibrary } from 'lucide-react'

const SidebarMenu = () => {
  const navItems = [
    { title: 'Create/Join', href: '/', icon: CirclePlus },
    { title: 'Records', href: '/records', icon: SquareLibrary },
  ]

  const pathname = usePathname()
  const router = useRouter()
  const [activeHref, setActiveHref] = useState(pathname)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setActiveHref(pathname)
    setIsNavigating(false) // unlock after route change
  }, [pathname])

  const handleClick = (href: string) => {
    if (isNavigating || href === pathname) return

    setActiveHref(href)       // immediate visual feedback
    setIsNavigating(true)     // lock further clicks
    router.push(href)         // trigger navigation
  }

  return (
    <div className='w-full h-6/8 py-2'>
      <ul className="space-y-2">
        {navItems.map(({ title, href, icon: Icon }) => {
          const isActive = activeHref === href

          return (
            <li key={title}>
              <button
                onClick={() => handleClick(href)}
                disabled={isNavigating}
                className={`w-full flex items-center justify-center md:justify-start md:gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#384959] text-white font-semibold'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className='hidden md:block'>{title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SidebarMenu