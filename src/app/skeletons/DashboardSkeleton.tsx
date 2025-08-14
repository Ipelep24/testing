import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const DashboardSkeleton = () => {
    return (
        <div className='h-screen font-futura'>
            <header className='w-full h-1/8'>
                <Skeleton className='w-full h-full' />
            </header>
            <main className='w-full h-6/8'>
                <div className='w-full h-full flex'>
                    <div className='w-full lg:w-1/2 h-full space-y-2'>
                        <div className='h-1/6'>
                            <Skeleton className='w-70 h-5 mt-2' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Skeleton className='w-7/8 h-10' />
                            <Skeleton className='w-6/8 h-10' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Skeleton className='w-5/8 h-8'/>
                            <Skeleton className='w-7/8 h-8'/>
                        </div>
                        <div className='flex h-1/6 items-center gap-3'>
                            <Skeleton className='w-40 h-7 rounded-3xl' />
                            <Skeleton className='w-60 h-10' />
                        </div>
                        <Skeleton className='w-45 h-4' />
                    </div>
                    <div className='w-1/2 h-full gap-7 flex-col justify-center items-center hidden lg:flex'>
                        <Skeleton
                            className='w-3/4 h-2/3'
                        />
                        <div className='w-2/3 flex flex-col gap-2 items-center'>
                            <Skeleton className='w-full h-9' />
                            <Skeleton className='w-2/3 h-6' />
                        </div>
                    </div>
                </div>
            </main>
            <footer className="relative w-full h-1/8 hidden sm:block">
                <Skeleton className='w-full h-full' />
            </footer>
        </div>
    )
}

export default DashboardSkeleton
