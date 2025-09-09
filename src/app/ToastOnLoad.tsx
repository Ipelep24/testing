'use client'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ToastOnLoad() {
  useEffect(() => {
    const message = localStorage.getItem('welcomeToast')
    if (message) {
      toast.success(message)
      localStorage.removeItem('welcomeToast') // prevent repeat
    }
  }, [])

  return null
}