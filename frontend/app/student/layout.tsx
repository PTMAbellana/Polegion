"use client"

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useStudentRoomStore } from "@/store/studentRoomStore";
import styles from '@/styles/navbar.module.css';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, userProfile } = useAuthStore();
  const { fetchJoinedRooms } = useStudentRoomStore();

  useEffect(() => {
    // Auto-fetch joined rooms when user is logged in as student
    if (
      isLoggedIn 
      && (userProfile?.role === 'student' || userProfile?.role === 'admin')
    ) {
      fetchJoinedRooms();
    }
  }, [isLoggedIn, userProfile?.role, fetchJoinedRooms]);

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