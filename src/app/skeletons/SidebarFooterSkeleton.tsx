import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const SidebarFooterSkeleton = () => {
    return (
        <Skeleton className='p-2 flex items-center w-50 justify-center md:gap-2 h-1/8
      bg-slate-400 rounded-md'>
            <Skeleton
                className='border border-gray-300 h-8 w-8 rounded-full'
            />
            <div className='flex-col hidden md:flex gap-1'>
                <Skeleton className='w-30 h-4' />
                <Skeleton className='w-10 h-4' />
            </div>
        </Skeleton>
    )
}

export default SidebarFooterSkeleton
