import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'


const SidebarSkeleton = () => {
  return (
    <nav className="w-fit h-screen p-2 mr-2">
      <div className='w-full h-1/8'>
        <div className='flex items-center justify-center gap-2'>
          <Skeleton className='w-10 h-10 rounded-full ' />
          <Skeleton className='hidden md:block h-10 w-30 gap-2 p-2' />
        </div>
      </div>
      <div className='w-full h-6/8 py-2'>
        <ul className="space-y-2">
          <Skeleton className='w-full h-10 rounded-md' />
          <Skeleton className='w-full h-10 rounded-md' />
        </ul>
      </div>
      <Skeleton className='p-4 flex items-center w-full justify-center md:gap-2 h-1/8
      bg-slate-400 rounded-md'>
        <Skeleton
          className='border border-gray-300 h-8 w-8 rounded-full'
        />
        <div className='flex-col hidden md:flex gap-1'>
          <Skeleton className='w-30 h-4' />
          <Skeleton className='w-10 h-4' />
        </div>
      </Skeleton>
    </nav>
  )
}


export default SidebarSkeleton
