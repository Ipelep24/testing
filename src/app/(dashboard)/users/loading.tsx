import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
    return (
        <div className='flex flex-col gap-3'>
            <Skeleton className='w-15 h-6 rounded-3xl' />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-25 rounded " />
            ))}
        </div>
    )
}

export default loading
