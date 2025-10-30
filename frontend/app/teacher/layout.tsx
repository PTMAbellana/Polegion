"use client"

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useTeacherRoomStore } from "@/store/teacherRoomStore";
import styles from '@/styles/navbar.module.css';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, userProfile } = useAuthStore();
  const { fetchCreatedRooms } = useTeacherRoomStore();

  useEffect(() => {
    // Auto-fetch created rooms when user is logged in as teacher
    if (
      isLoggedIn 
      && (userProfile?.role === 'teacher' || userProfile?.role === 'admin')
    ) {
      fetchCreatedRooms();
    }
  }, [isLoggedIn, userProfile?.role, fetchCreatedRooms]);

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