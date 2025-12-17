"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import styles from "@/styles/teacher-handbook.module.css"
import { FaInfoCircle, FaMapMarkedAlt, FaClipboardList, FaArrowRight } from "react-icons/fa"

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

  const openCastleContent = () => {
    router.push('/teacher/castle-content')
  }

  return (
    <div className={styles.handbookContainer}>
      <div className={styles.teacherBanner}>
        <FaInfoCircle className={styles.bannerIcon} />
        <div className={styles.bannerContent}>
          <strong>Teacher Handbook - World Map Update</strong>
          <p>The interactive world map preview for teachers has been retired in favor of the Castle Reviewer experience.</p>
        </div>
      </div>

      <div className={styles.handbookContent}>
        <section className={styles.removalCard}>
          <div className={styles.removalHeading}>
            <FaMapMarkedAlt className={styles.removalIcon} />
            <div>
              <h2>Castle Reviewer replaces the World Map preview</h2>
              <p>Use the new reviewer to study castle narratives, chapter pacing, and lesson goals without switching into the student interface.</p>
            </div>
          </div>
          <ul className={styles.removalList}>
            <li>
              <FaClipboardList />
              <span>See every castle and chapter in one place with clear descriptions.</span>
            </li>
            <li>
              <FaClipboardList />
              <span>Plan lessons faster with the XP rewards and objectives highlighted per chapter.</span>
            </li>
            <li>
              <FaClipboardList />
              <span>Open the student chapter view in a new tab only when you need the full experience.</span>
            </li>
          </ul>
          <button className={styles.ctaButton} onClick={openCastleContent}>
            Open Castle Reviewer <FaArrowRight />
          </button>
        </section>
      </div>
    </div>
  )
}
