"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import PracticePage from "@/app/student/practice/page"
import styles from "@/styles/teacher-handbook.module.css"
import { FaInfoCircle } from "react-icons/fa"

/**
 * Teacher Handbook - Practice
 * Allows teachers to experience the student's practice interface
 * This helps teachers understand what students see and do
 */
export default function TeacherPracticeHandbook() {
  const { userProfile, isLoggedIn, appLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!appLoading && (!isLoggedIn || userProfile?.role !== 'teacher')) {
      router.push('/teacher/auth/login')
    }
  }, [isLoggedIn, userProfile, appLoading, router])

  if (appLoading || !isLoggedIn || userProfile?.role !== 'teacher') {
    return null
  }

  return (
    <div className={styles.handbookContainer}>
      {/* Teacher Info Banner */}
      <div className={styles.teacherBanner}>
        <FaInfoCircle className={styles.bannerIcon} />
        <div className={styles.bannerContent}>
          <strong>Teacher Handbook - Practice</strong>
          <p>You're viewing the student's practice interface. This is exactly what students see when they practice problems.</p>
        </div>
      </div>

      {/* Render Student Practice Interface */}
      <div className={styles.studentInterfaceWrapper}>
        <PracticePage />
      </div>
    </div>
  )
}
