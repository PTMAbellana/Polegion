"use client"

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useStudentRoomStore } from "@/store/studentRoomStore";
import { TEACHER_ROUTES } from "@/constants/routes";
import styles from '@/styles/navbar.module.css';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, userProfile, appLoading } = useAuthStore();
  const { fetchJoinedRooms } = useStudentRoomStore();

  useEffect(() => {
    // Redirect teachers trying to access student routes
    if (isLoggedIn && userProfile?.role === 'teacher') {
      router.replace(TEACHER_ROUTES.DASHBOARD);
      return;
    }

    // Auto-fetch joined rooms when user is logged in as student
    if (
      isLoggedIn 
      && (userProfile?.role === 'student' || userProfile?.role === 'admin')
    ) {
      fetchJoinedRooms();
    }
  }, [isLoggedIn, userProfile?.role, fetchJoinedRooms, router]);

  // Block rendering if teacher is trying to access student routes
  if (isLoggedIn && userProfile?.role === 'teacher') {
    return null;
  }

  // Allow auth routes (login, register) to render without authentication
  const isAuthRoute = pathname?.includes('/auth/');
  
  // Show loading while checking authentication (but not for auth routes)
  if (!isAuthRoute && (appLoading || (!isLoggedIn && !userProfile))) {
    return null;
  }

  // For auth routes, render without sidebar
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // For protected student routes, check role
  if (userProfile?.role !== 'student' && userProfile?.role !== 'admin') {
    return (
      <div className={styles['page-layout']}>
        <Sidebar userRole="teacher" />
        <main className={styles['main-content']}>
          <h1>You are not authorized to access this page.</h1>
        </main>
      </div>
    );
  }

  return (
    <div className={styles['page-layout']}>
      <Sidebar userRole="student" />
      <main className={styles['main-content']}>
        {/* <div className={styles['content-area']}> */}
          {children}
        {/* </div> */}
      </main>
    </div>
  );
}