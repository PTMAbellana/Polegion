// ============================================================================
// CASTLE 6 - POSTTEST ASSESSMENT
// ============================================================================

"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import styles from '@/styles/castle6-adventure.module.css'

export default function Castle6Page() {
  const router = useRouter()
  const { userProfile } = useAuthStore()

  useEffect(() => {
    // Redirect directly to the posttest chapter
    if (userProfile?.id) {
      router.push('/student/worldmap/castle6/chapter1')
    }
  }, [userProfile?.id, router])

  return (
    <div className={styles.loading_container}>
      <Loader />
      <p>Loading Posttest Assessment...</p>
    </div>
  )
}
