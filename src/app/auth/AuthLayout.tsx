'use client'

import Image from 'next/image'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import { useRouter } from 'next/navigation'
import { fetchSignInMethodsForEmail, GoogleAuthProvider, linkWithPopup, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    mode: 'signin' | 'signup'
    setMode: (mode: 'signin' | 'signup') => void
}

export default function AuthLayout({ mode, setMode }: Props) {
    const router = useRouter()
    const [googleLoading, setGoogleLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        if (googleLoading) return
        setGoogleLoading(true)

        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const email = result.user.email

            if (!email || !credential) throw new Error('Google sign-in failed to return email or credential.')

            const methods = await fetchSignInMethodsForEmail(auth, email)

            if (methods.includes('password') && !methods.includes('google.com')) {
                // 🚫 Prevent Google sign-in to avoid collision
                toast.error('This email is already registered with a password. Please sign in using email/password.')
                await auth.signOut()
                return
            }

            // ✅ Safe to proceed with Google sign-in
            const idToken = await result.user.getIdToken()
            await fetch('/api/setSession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            })

            toast.success(`Welcome, ${result.user.displayName || 'User'}!`)
            router.push('/')
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') {
                console.warn('Google sign-in popup was closed by the user.')
            } else {
                console.error('Google sign-in error:', err)
                toast.error('Google sign-in failed')
            }
        } finally {
            setGoogleLoading(false)
        }
    }

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
                        <div className='flex flex-col items-center mt-20'>
                            <h1 className='text-3xl font-bold m-2 text-[#64717E]'>Sign In</h1>
                            <LoginForm mode={mode}/>
                            <h6 className='text-xs truncate'>
                                Don&apos;t have an account?{' '}
                                <span className='text-[#1281E9] cursor-pointer' onClick={() => setMode('signup')}>
                                    Sign Up
                                </span>
                            </h6>
                        </div>
                    </div>
                    <div className='relative w-full h-full lg:w-1/2 hidden lg:block'>
                        <Image src="/right.jpg" alt="Image" fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className='object-cover' />
                    </div>
                </div>

                {/* Sign Up */}
                <div className={`absolute inset-0 flex transition-all duration-500 ease-in-out
          ${mode === 'signup' ? 'translate-y-0 opacity-100 z-10' : 'translate-y-full opacity-0 z-0 pointer-events-none'}`}>
                    <div className='relative w-full h-full lg:w-1/2 hidden lg:block'>
                        <Image src="/left.png" alt="Image" fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className='object-cover' />
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
