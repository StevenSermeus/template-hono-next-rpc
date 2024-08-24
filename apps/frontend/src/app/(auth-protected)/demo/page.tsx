'use client';
import { useAuth } from '@/providers/auth';
import React from 'react';

export default function Page() {
  const auth = useAuth();
  return <div>{auth.user.email}</div>;
}
