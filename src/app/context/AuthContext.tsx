'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  setSkipNextAuthChange: (skip: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setSkipNextAuthChange: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [skipNextAuthChange, setSkipNextAuthChange] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!skipNextAuthChange) {
        setUser(firebaseUser)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [skipNextAuthChange])

  return (
    <AuthContext.Provider value={{ user, loading, setSkipNextAuthChange }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
