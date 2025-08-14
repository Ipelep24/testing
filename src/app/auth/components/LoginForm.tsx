'use client'
import { Eye, EyeClosed } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

interface Props {
  mode: 'signin' | 'signup'
}

const LoginForm = ({ mode }: Props) => {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (mode === 'signin') {
      setLoginEmail("")
      setLoginPassword("")
      setRememberMe(false)
    }
  }, [mode])

  return (
    <div className='w-3/5'>
      <form className='flex flex-col items-center'>
        <div className='flex flex-col text-[#64717E] w-full my-2'>
          <label htmlFor='loginEmail' className='text-sm'>Email</label>
          <input
            className='border border-black p-1 rounded-sm text-sm w-full text-black focus:outline-2 outline-[#384959]'
            type="email"
            name='loginEmail'
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            autoComplete='email'
            required />
        </div>
        <div className='flex flex-col text-[#64717E] w-full my-2'>
          <label htmlFor='loginPassword' className='text-sm'>Password</label>
          <div className='relative'>
            <input
              className='border border-black p-1 rounded-sm text-sm w-full text-black focus:outline-2 outline-[#384959]'
              type={showPassword ? 'text' : 'password'}
              name="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              autoComplete="current-password"
              required />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#384959] hover:text-[#1281E9]"
            >
              {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>
        </div>
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
          className='text-white font-semibold bg-[#384959] w-1/2 my-5 p-1 rounded-2xl cursor-pointer'
        />
      </form>
    </div>
  )
}

export default LoginForm
