"use client"

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useTeacherRoomStore } from "@/store/teacherRoomStore";
import { STUDENT_ROUTES } from "@/constants/routes";
import styles from '@/styles/navbar.module.css';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, userProfile, appLoading } = useAuthStore();
  const { fetchCreatedRooms } = useTeacherRoomStore();

  useEffect(() => {
    console.log('[TeacherLayout] Checking auth:', { isLoggedIn, role: userProfile?.role, pathname })
    
    // ABSOLUTE BLOCK: Redirect students trying to access teacher routes
    if (isLoggedIn && userProfile?.role === 'student') {
      console.log('[TeacherLayout] Student detected, redirecting to student dashboard')
      router.replace(STUDENT_ROUTES.DASHBOARD);
      return;
    }

    // Auto-fetch created rooms when user is logged in as teacher/admin
    if (
      isLoggedIn 
      && (userProfile?.role === 'teacher' || userProfile?.role === 'admin')
    ) {
      console.log('[TeacherLayout] Teacher/Admin detected, fetching created rooms')
      fetchCreatedRooms();
    }
  }, [isLoggedIn, userProfile?.role, pathname, fetchCreatedRooms, router]);

  // Block rendering if student is trying to access teacher routes
  if (isLoggedIn && userProfile?.role === 'student') {
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

  // For protected teacher routes, check role
  if (userProfile?.role !== 'teacher' && userProfile?.role !== 'admin') {
    return (
      <div className={styles['page-layout']}>
        <Sidebar userRole="student" />
        <main className={styles['main-content']}>
          <h1>You are not authorized to access this page.</h1>
        </main>
      </div>
    );
  }

  return (
    <div className={styles['page-layout']}>
      <Sidebar userRole="teacher" />
      <main className={styles['main-content']}>
        {/* <div className={styles['content-area']}> */}
          {children}
        {/* </div> */}
      </main>
    </div>
  );
}