// ============================================================================
// CASTLE 0 - PRETEST ASSESSMENT
// ============================================================================

"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import styles from '@/styles/castle0-loading.module.css'

export default function Castle0Page() {
  const router = useRouter()
  const { userProfile } = useAuthStore()

  useEffect(() => {
    // Redirect directly to the pretest chapter
    if (userProfile?.id) {
      router.push('/student/worldmap/castle0/chapter1')
    }
  }, [userProfile?.id, router])

  return (
    <div className={styles.loading_container}>
      <Loader />
      <p>Loading Pretest Assessment...</p>
    </div>
  )
}
