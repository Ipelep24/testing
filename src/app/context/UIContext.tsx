'use client'
import { createContext, useContext, useState } from 'react'

interface UIContextType {
  showSettings: boolean
  setShowSettings: (value: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <UIContext.Provider value={{ showSettings, setShowSettings }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within a UIProvider')
  return context
}