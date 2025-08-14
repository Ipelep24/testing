import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown } from 'lucide-react'
import React from 'react'

const RecordsSkeleton = () => {
    return (
        <div className='font-futura px-4 h-screen'>
            <header className='w-full h-1/10 flex items-center justify-between'>
                <Skeleton className='w-50 h-10'/>
                <Skeleton className='w-20 h-7'/>
            </header>
            <main className='w-full h-9/10 py-3 flex gap-4'>
                <Skeleton className='flex flex-col justify-center w-full xs:w-1/2 lg:w-1/3 h-full rounded-lg'/>
                <div className='w-full h-full flex flex-col gap-4'>
                    <Skeleton className='w-full h-1/2 rounded-lg'/>
                    <Skeleton className="w-full h-1/2 rounded-lg"/>
                </div>
            </main>
        </div>
    )
}

export default RecordsSkeleton
