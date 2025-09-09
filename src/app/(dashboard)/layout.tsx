import Sidebar from '../components/Sidebar'
import SidebarSkeleton from '../skeletons/SidebarSkeleton'
import Wrapper from './Wrapper'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import SettingsModal from '../components/SettingsModal' // ✅ Client component
import { UIProvider } from '@/app/context/UIContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <div className="flex fullscreen-section">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>

        <main className="flex-1 overflow-y-auto relative">
          <Toaster position="top-center" reverseOrder={false} />
          <Wrapper>{children}</Wrapper>
          <SettingsModal />
        </main>
      </div>
    </UIProvider>
  )
}