'use client'

import Image from 'next/image'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, db } from '@/lib/firebase/firebase'
import { useState } from 'react'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

interface Props {
    mode: 'signin' | 'signup'
    setMode: (mode: 'signin' | 'signup') => void
}

export default function AuthLayout({ mode, setMode }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        if (loading) return
        setLoading(true)

        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (userDoc.exists()) {
                const { fullName } = userDoc.data()
                const needsUpdate = fullName && user.displayName !== fullName

                if (needsUpdate) {
                    await updateProfile(user, { displayName: fullName })

                    const linkedProviders = user.providerData.map(p => p.providerId)
                    const isLinked = linkedProviders.includes('google.com') && linkedProviders.length > 1

                    if (isLinked || user.displayName === fullName) {
                        await deleteDoc(doc(db, 'users', user.uid))
                    }
                }
            }

            const idToken = await user.getIdToken()
            const response = await fetch('/api/setSession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            })

            if (!response.ok) {
                throw new Error('Session setup failed')
            }

            localStorage.setItem('welcomeToast', `Welcome, ${user.displayName || 'User'}!`)
            router.push('/')
        } catch (error: unknown) {
            if (error && typeof error === 'object' && ('code' in error || 'message' in error)) {
                toast.error("Google sign-in failed. Please try again.")
            }
        } finally {
            setLoading(false)
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
                    <div className='relative w-full h-full lg:w-1/2 flex items-center justify-center'>
                        <div className='flex flex-col items-center w-full'>
                            <h1 className='text-3xl font-bold text-[#64717E]'>Sign In</h1>
                            <button
                                suppressHydrationWarning
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="flex items-center justify-center gap-5 font-semibold outline-2 outline-[#384959] w-fit my-5 py-1 px-2 rounded-2xl cursor-pointer"
                            >
                                <Image src="/google.png" alt="google" width={20} height={20} />
                                Continue with Google
                            </button>
                            <div className='flex items-center justify-center gap-2 w-3/5'>
                                <span className='w-full h-0 border border-[#64717E]'></span>
                                <span className='text-[#64717E] font-light'>OR</span>
                                <span className='w-full h-0 border border-[#64717E]'></span>
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
                    <div className='relative w-full h-full lg:w-1/2 flex items-center justify-center'>
                        <div className='flex flex-col items-center w-full'>
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
