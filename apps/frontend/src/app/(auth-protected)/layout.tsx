import LoadingPage from '@/components/loading-page';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const AuthProvider = dynamic(() => import('@/providers/auth'), {
    ssr: false,
    loading: () => <LoadingPage />,
  });
  return <AuthProvider>{children}</AuthProvider>;
}
