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

  const { initialize, appLoading  } = useAuthStore();
  // const { fetchCreatedRooms } = useTeacherRoomStore();
  // const { fetchJoinedRooms } = useStudentRoomStore();
  const { isLoading } = AuthProtection();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Auto-fetch room data when user is authenticated
  // useEffect(() => {
  //   if (isLoggedIn && userProfile && !isLoading) {
  //     if (userProfile.role === 'teacher') {
  //       fetchCreatedRooms();
  //     } else if (userProfile.role === 'student') {
  //       fetchJoinedRooms();
  //     }
  //   }
  // }, [isLoggedIn, userProfile, isLoading, fetchCreatedRooms, fetchJoinedRooms]);

  if (appLoading || isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}