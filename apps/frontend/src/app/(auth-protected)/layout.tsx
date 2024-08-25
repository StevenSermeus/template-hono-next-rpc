import React, { Suspense } from 'react';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import dynamic from 'next/dynamic';

import LoadingPage from '@/components/loading-page';
import { AuthError } from '@/providers/auth';

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
