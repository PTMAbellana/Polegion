"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';
import { AuthProtection } from '@/context/AuthProtection';

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {

    const { initialize, appLoading } = useAuthStore();
  const { isLoading } = AuthProtection();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (appLoading || isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}