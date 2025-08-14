'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import DashboardSkeleton from '../skeletons/DashboardSkeleton';
import RecordsSkeleton from '../skeletons/RecordsSkeleton';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let fallback = null;

  if (pathname === '/') {
    fallback = <DashboardSkeleton />;
  } else if (pathname === '/records') {
    fallback = <RecordsSkeleton />
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
}
