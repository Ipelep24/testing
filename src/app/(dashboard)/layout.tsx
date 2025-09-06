import Sidebar from '../components/Sidebar';
import SidebarSkeleton from '../skeletons/SidebarSkeleton';
import Wrapper from './Wrapper';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex fullscreen-section">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>

      <main className="flex-1 overflow-y-auto">
        <Toaster position="top-center" reverseOrder={false} />
        <Wrapper>{children}</Wrapper>
      </main>
    </div>
  );
}
