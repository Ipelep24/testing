// auth/AuthLayout.tsx
'use client'

import Image from 'next/image'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'

interface Props {
    mode: 'signin' | 'signup'
    setMode: (mode: 'signin' | 'signup') => void
}

export default function AuthLayout({ mode, setMode }: Props) {
    return (
        <div className='relative flex w-9/10 sm:w-3/5 h-4/5 border shadow-lg bg-white rounded-3xl overflow-hidden'>
            <div className='flex absolute top-0 left-0 items-center gap-2 w-full h-1/8 p-2 z-20'>
                <Image src="/logo.png" alt="Logo" width={100} height={100} className='w-10 h-auto' />
                <h1 className='text-2xl font-futura hidden md:block font-bold text-[#64717E]'>VirtuSense</h1>
            </div>

            <div className='relative w-full h-full'>
                {/* Sign In */}
                <div className={`absolute inset-0 flex transition-all duration-500 ease-in-out
          ${mode === 'signin' ? 'translate-y-0 opacity-100 z-10' : 'translate-y-full opacity-0 z-0 pointer-events-none'}`}>
                    <div className='relative w-full h-full lg:w-1/2'>
                        <div className='flex flex-col items-center mt-10'>
                            <h1 className='text-3xl font-bold m-2 text-[#64717E]'>Sign In</h1>
                            <div className='flex cursor-pointer items-center gap-3 justify-center truncate w-3/5 h-fit p-1 px-3 m-2 border-2 border-[#384959] rounded-3xl'>
                                <Image src="/google.png" alt="" width={100} height={100} className='w-5 h-auto' />
                                <p className='text-sm'>Continue with Google</p>
                            </div>
                            <div className="flex items-center gap-3 w-3/5 my-2">
                                <div className="w-full border border-[#384959]"></div>
                                <p className='text-sm text-[#384959]'>OR</p>
                                <div className="w-full border border-[#384959]"></div>
                            </div>
                            <LoginForm mode={mode} />
                            <h6 className='text-xs truncate'>
                                Don&apos;t have an account?{' '}
                                <span className='text-[#1281E9] cursor-pointer' onClick={() => setMode('signup')}>
                                    Sign Up
                                </span>
                            </h6>
                        </div>
                    </div>
                    <div className='relative w-full h-full lg:w-1/2 hidden lg:block'>
                        <Image src="/right.png" alt="Image" fill className='object-cover' />
                    </div>
                </div>

                {/* Sign Up */}
                <div className={`absolute inset-0 flex transition-all duration-500 ease-in-out
          ${mode === 'signup' ? 'translate-y-0 opacity-100 z-10' : 'translate-y-full opacity-0 z-0 pointer-events-none'}`}>
                    <div className='relative w-full h-full lg:w-1/2 hidden lg:block'>
                        <Image src="/left.png" alt="Image" fill className='object-cover' />
                    </div>
                    <div className='relative w-full h-full lg:w-1/2'>
                        <div className='flex flex-col items-center mt-2'>
                            <h1 className='text-3xl font-bold m-2 text-[#64717E]'>Sign Up</h1>
                            <SignupForm mode={mode} />
                            <h6 className='text-xs truncate'>
                                Already have an account?{' '}
                                <span className='text-[#1281E9] cursor-pointer' onClick={() => setMode('signin')}>
                                    Sign In
                                </span>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
