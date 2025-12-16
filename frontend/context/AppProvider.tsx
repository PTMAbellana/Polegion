"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTeacherRoomStore } from '@/store/teacherRoomStore';
import { useStudentRoomStore } from '@/store/studentRoomStore';
import { useCastleStore } from '@/store/castleStore';
import Loader from '@/components/Loader';
import { ROUTES, PUBLIC_ROUTES, STUDENT_ROUTES, TEACHER_ROUTES } from '@/constants/routes';
import { supabase } from '@/lib/supabaseClient';

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

  // ✅ NEW: Monitor Supabase auth state changes and auto-refresh
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Supabase auth event:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('✅ Token auto-refreshed by Supabase');
        // Update localStorage with new tokens
        if (session) {
          localStorage.setItem('access_token', session.access_token);
          localStorage.setItem('refresh_token', session.refresh_token);
          localStorage.setItem('expires_at', session.expires_at?.toString() || '');
          
          // Trigger token refresh event for other parts of the app
          window.dispatchEvent(new Event('token-refreshed'));
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out');
        localStorage.clear();
        router.push(ROUTES.HOME);
      }
      
      if (event === 'USER_UPDATED') {
        console.log('👤 User data updated');
        syncAuthToken();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, syncAuthToken]);

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
          switch (userProfile?.role) {
            case 'student':
              router.replace(STUDENT_ROUTES.DASHBOARD);
              break;
            case 'teacher':
            case 'admin':
              router.replace(TEACHER_ROUTES.DASHBOARD);
              break;
            default:
              router.replace(STUDENT_ROUTES.DASHBOARD);
          }
          return;
        }

        // Fetch user data when authenticated and on protected routes
        if (isLoggedIn && userProfile && !PUBLIC_ROUTES.includes(pathname)) {
          if (userProfile.role === 'teacher' || userProfile.role === 'admin') {
            // Teachers and admins can access teacher routes
            if (pathname.startsWith('/teacher')) {
              fetchCreatedRooms();
            }
            // Admins can also access student routes
            if (userProfile.role === 'admin' && pathname.startsWith('/student')) {
              fetchJoinedRooms();
              if (userProfile.id) {
                fetchCastles(userProfile.id);
              }
            }
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