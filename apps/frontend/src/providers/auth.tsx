'use client';
import React, { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { InferResponseType } from 'hono/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Infer the full response type from the API
type FullResponseType = InferResponseType<typeof api.user.auth.me.$get>;

// Extract only the successful response type where `user` is present
type SuccessfulResponseType = Extract<FullResponseType, { user: { email: string; id: number } }>;

// Create a context with the successful response type or `null`
const AuthContext = React.createContext<SuccessfulResponseType>({
  user: {
    email: '',
    id: 0,
  },
});

export default function AuthProvider({ children }: AuthProviderProps) {
  const query = useSuspenseQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.user.auth.me.$get();
      return await res.json();
    },
  });

  if ('error' in query.data) {
    return <p>{query.data.error} error error</p>;
  }
  return <AuthContext.Provider value={query.data}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
