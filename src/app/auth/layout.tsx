import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen w-screen min-h-[550px]">
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </div>
  )
}
