"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { appLoading, authLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (appLoading || authLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}