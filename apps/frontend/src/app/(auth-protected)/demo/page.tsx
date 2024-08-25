'use client';

import React from 'react';

import { useAuth } from '@/providers/auth';

export default function Page() {
  const auth = useAuth();
  return <div>{auth.user.email}</div>;
}
