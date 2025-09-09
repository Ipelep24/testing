'use client'

import { useUI } from '@/app/context/UIContext'
import { useEffect } from 'react'

export default function SettingsModal() {
  const { showSettings, setShowSettings } = useUI()

  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showSettings])

  if (!showSettings) return null // ✅ Don't render if hidden

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-xl w-[400px] h-[90vh] p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          {/* Add your settings form here */}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setShowSettings(false)}
            className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Save logic here
              setShowSettings(false)
            }}
            className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}