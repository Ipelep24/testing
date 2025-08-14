'use client'
import { CirclePlus, SquareLibrary } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const SidebarMenu = () => {
    const navItems = [
        { title: 'Create/Join', href: '/', icon: CirclePlus },
        { title: 'Records', href: '/records', icon: SquareLibrary },
    ];

    const pathname = usePathname();

    return (
        <div className='w-full h-6/8 py-2'>
            <ul className="space-y-2">
                {navItems.map(({ title, href, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <li key={title}>
                            <Link
                                href={href}
                                className={`flex items-center justify-center md:justify-start md:gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-[#384959] text-white font-semibold' : 'text-gray-400 hover:text-black'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className='hidden md:block'>{title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default SidebarMenu
