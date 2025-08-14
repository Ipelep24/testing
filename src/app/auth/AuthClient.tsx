// auth/AuthClient.tsx
'use client'

import { useState } from 'react'
import AuthLayout from './AuthLayout'

export default function AuthClient() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return <AuthLayout mode={mode} setMode={setMode} />
}
