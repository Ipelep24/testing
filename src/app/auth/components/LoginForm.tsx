'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import TextInput from './TextInput'
import PasswordInput from './PasswordInput'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  mode: 'signin' | 'signup'
}

const LoginForm = ({ mode }: Props) => {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    setEmailTouched(true)
    setPasswordTouched(true)
    setEmailError(false)
    setPasswordError(false)

    const isEmailValid = loginEmail.trim() !== ""
    const isPasswordValid = loginPassword.length >= 8

    requestAnimationFrame(() => {
      setEmailError(!isEmailValid)
      setPasswordError(!isPasswordValid)
    })

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false)
      return
    }

    try {
      await toast.promise(
        (async () => {
          const { user } = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
          if (!user.emailVerified) {
            throw new Error("unverified")
          }

          const idToken = await user.getIdToken()
          await fetch('/api/setSession', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
          })

          const welcomeMessage = `Welcome, ${user.displayName || 'User'}!`
          localStorage.setItem('welcomeToast', welcomeMessage)
          router.push('/')
        })(),
        {
          loading: "Signing you in...",
          error: (err: any) =>
            err.message === "unverified"
              ? "Please verify your email first."
              : "Login failed: " + err.message,
        }
      )
    } catch {
      // no need to handle here — toast.promise already did
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'signin') {
      setLoginEmail("")
      setLoginPassword("")
      setRememberMe(false)
      setEmailTouched(false)
      setPasswordTouched(false)
      setEmailError(false)
      setPasswordError(false)
    }
  }, [mode])

  return (
    <div className='w-3/5 mt-5'>
      <form className='flex flex-col items-center' onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          name="loginEmail"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          touched={emailTouched}
          error={emailError}
          errorMessage=""
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          name="loginPassword"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          touched={passwordTouched}
          error={passwordError}
          errorMessage=""
          autoComplete='current-password'
        />

        <div className='flex flex-col items-start xs:items-center xs:flex-row justify-between w-full'>
          <label className='truncate flex text-xs items-center leading-none gap-2 text-[#64717E] cursor-pointer'>
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> Remember me
          </label>
          <Link href="#" className='text-xs text-[#1281E9] truncate'>Forgot Password?</Link>
        </div>

        <input
          type='submit'
          value="Sign In"
          name='loginSubmit'
          disabled={loading}
          className='text-white font-semibold bg-[#384959] w-1/2 my-5 p-1 rounded-2xl cursor-pointer'
        />
      </form>
    </div>
  )
}

export default LoginForm
