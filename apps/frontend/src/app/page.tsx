'use client';

import { Suspense, useRef } from 'react';

import Image from 'next/image';

import { api } from '@/api';
import AuthProvider from '@/providers/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function Home() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const loginMutation = useMutation({
    mutationFn: api.user.auth.login.$post,
    mutationKey: ['auth', 'login'],
  });

  const registerMutation = useMutation({
    mutationFn: api.user.auth.register.$post,
    mutationKey: ['auth', 'register'],
  });

  const logoutMutation = useMutation({
    mutationFn: api.user.auth.logout.$post,
    mutationKey: ['auth', 'logout'],
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* //login form */}
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={e => {
          e.preventDefault();
          loginMutation.mutate({
            json: {
              email: emailRef.current?.value || '',
              password: passwordRef.current?.value || '',
            },
          });
        }}
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          ref={emailRef}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded"
          ref={passwordRef}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Login
        </button>
        <button
          type="button"
          className="p-2 bg-gray-300 text-black rounded"
          onClick={() => {
            registerMutation.mutate({
              json: {
                email: emailRef.current?.value || '',
                password: passwordRef.current?.value || '',
              },
            });
          }}
        >
          Register
        </button>
        <button
          type="button"
          className="p-2 bg-red-500 text-white rounded"
          onClick={() => {
            logoutMutation.mutate({});
          }}
        >
          Logout
        </button>
      </form>
    </main>
  );
}
