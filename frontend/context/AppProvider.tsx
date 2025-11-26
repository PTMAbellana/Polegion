"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTeacherRoomStore } from '@/store/teacherRoomStore';
import { useStudentRoomStore } from '@/store/studentRoomStore';
import { useCastleStore } from '@/store/castleStore';
import Loader from '@/components/Loader';
import { ROUTES, PUBLIC_ROUTES, STUDENT_ROUTES } from '@/constants/routes';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { 
    appLoading, 
    authLoading, 
    isLoggedIn, 
    userProfile,
    authToken,
    initialize,
    syncAuthToken
  } = useAuthStore();
  
  const { fetchCreatedRooms } = useTeacherRoomStore();
  const { fetchJoinedRooms } = useStudentRoomStore();
  const { fetchCastles } = useCastleStore();
  
  const [localLoading, setLocalLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize app
  useEffect(() => {
    initialize();
  }, [initialize]);

  // ✅ FIX #2: Listen for token refresh events
  useEffect(() => {
    const handleTokenRefresh = () => {
      const authStore = useAuthStore.getState();
      console.log('🔄 Token refresh event detected, syncing store...');
      authStore.syncAuthToken();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('token-refreshed', handleTokenRefresh);
      return () => window.removeEventListener('token-refreshed', handleTokenRefresh);
    }
  }, [syncAuthToken]);

  // Handle route protection and data fetching
  useEffect(() => {
    const globalLoading = authLoading || appLoading;
    
    if (globalLoading) {
      setLocalLoading(true);
      return;
    }

    const handleRouteProtection = () => {
      setLocalLoading(true);
      
      try {
        // Redirect to home if not authenticated and route is protected
        if (!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
          router.replace(ROUTES.HOME);
          return;
        }

        // Redirect to dashboard if authenticated and on public routes
        if (isLoggedIn && PUBLIC_ROUTES.includes(pathname)) {
          router.replace(STUDENT_ROUTES.DASHBOARD);
          return;
        }

        // Fetch user data when authenticated and on protected routes
        if (isLoggedIn && userProfile && !PUBLIC_ROUTES.includes(pathname)) {
          if (userProfile.role === 'teacher') {
            fetchCreatedRooms();
          } else if (userProfile.role === 'student') {
            fetchJoinedRooms();
            // Fetch castles for students
            if (userProfile.id) {
              fetchCastles(userProfile.id);
            }
          }
        }
      } catch (error) {
        console.error('Auth protection error:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    const timer = setTimeout(handleRouteProtection, 100);
    return () => clearTimeout(timer);
  }, [
    pathname, 
    router, 
    isLoggedIn, 
    userProfile,
    appLoading,
    authLoading,
    authToken,
    fetchCreatedRooms,
    fetchJoinedRooms,
    fetchCastles
  ]);

  const isLoading = appLoading || authLoading || localLoading;

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}