"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import WorldMapPage from "@/app/student/worldmap/page"
import styles from "@/styles/teacher-handbook.module.css"
import { FaInfoCircle } from "react-icons/fa"

/**
 * Teacher Handbook - World Map
 * Allows teachers to experience the student's world map interface
 * This helps teachers understand what students see and do
 */
export default function TeacherWorldMapHandbook() {
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
          <strong>Teacher Handbook - World Map</strong>
          <p>You're viewing the student's world map interface. This is exactly what students see when they navigate to their World Map.</p>
        </div>
      </div>

      {/* Render Student World Map */}
      <div className={styles.studentInterfaceWrapper}>
        <WorldMapPage />
      </div>
    </div>
  )
}
