"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { AuthProtection } from '@/context/AuthProtection'
import Loader from '@/components/Loader'
import CastleIntro from '@/components/world/CastleIntro'
import CastleHeader from '@/components/world/CastleHeader'
import ChapterList from '@/components/world/ChapterList'
import CastleCard from '@/components/world/CastleCard'
import CastleActionButton from '@/components/world/CastleActionButton'
import ParticleEffect from '@/components/world/ParticleEffect'
import styles from '@/styles/castle2-adventure.module.css'
import { initializeCastleProgress } from '@/api/castles'
import type { 
  ChapterWithProgress, 
  CastleInitializeResponse,
  CastleData,
  CastleProgress
} from '@/types/common'

const CASTLE_ROUTE = 'castle2'

export default function CastlePage() {
  const router = useRouter()
  const { userProfile } = useAuthStore()
  const { isLoading: authLoading } = AuthProtection()

  const [loading, setLoading] = useState(true)
  const [navigating, setNavigating] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  const [showIntro, setShowIntro] = useState(false)
  const [castleData, setCastleData] = useState<CastleData | null>(null)
  const [castleProgress, setCastleProgress] = useState<CastleProgress | null>(null)
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([])
  const [error, setError] = useState<string | null>(null)

  // Check if user has seen castle intro - user-specific key
  useEffect(() => {
    if (userProfile?.id) {
      const introKey = `hasSeenCastle2Intro_${userProfile.id}`
      const hasSeenIntro = localStorage.getItem(introKey)
      
      if (!hasSeenIntro) {
        setShowIntro(true)
        // Hide intro after 3 seconds and mark as seen
        const timer = setTimeout(() => {
          setShowIntro(false)
          localStorage.setItem(introKey, 'true')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [userProfile?.id])

  useEffect(() => {
    if (!authLoading && userProfile?.id) {
      initializeCastle()
    }
  }, [authLoading, userProfile?.id])

  // Note: Removed auto-reload on focus to prevent unnecessary page reloads
  // Data will be fresh on navigation since component remounts

  const initializeCastle = async () => {
    try {
      setLoading(true)
      setError(null)
      const userId = userProfile?.id
      if (!userId) throw new Error('User not authenticated')
      
      console.log('[CastlePage] Calling initializeCastleProgress with:', { userId, CASTLE_ROUTE })
      const response = await initializeCastleProgress(userId, CASTLE_ROUTE) as CastleInitializeResponse
      console.log('[CastlePage] Initialize response:', response)
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to initialize castle')
      }
      
      const { castle, castleProgress: progress, chapters: chapterData } = response.data
      
      if (!castle || !progress) {
        throw new Error('Invalid response: missing castle or progress data')
      }
      
      setCastleData(castle)
      setCastleProgress(progress)
      setChapters(chapterData || [])
      
      // Select first available chapter (unlocked but not completed)
      const firstAvailable = chapterData?.find((c) => c.progress?.unlocked && !c.progress?.completed) || chapterData?.[0]
      if (firstAvailable) setSelectedChapter(firstAvailable.chapter_number)
      
    } catch (error: any) {
      console.error('[CastlePage] Error:', error)
      console.error('[CastlePage] Error details:', error.response?.data || error.message)
      setError(error.response?.data?.error || error.message || 'Failed to load castle data')
    } finally {
      setLoading(false)
    }
  }

  const handleChapterSelect = (chapterNumber: number) => {
    const chapter = chapters.find(c => c.chapter_number === chapterNumber)
    if (chapter?.progress?.unlocked) setSelectedChapter(chapterNumber)
  }

  const handleStartChapter = () => {
    const chapter = chapters.find(c => c.chapter_number === selectedChapter)
    if (chapter?.progress?.unlocked && castleData) {
      setNavigating(true)
      router.push(`/student/worldmap/${CASTLE_ROUTE}/chapter${chapter.chapter_number}`)
    }
  }

  const getChapterButtonText = () => {
    if (!selectedChapterData) return 'Select a Chapter'
    if (!selectedChapterData.progress?.unlocked) return 'Locked'
    if (selectedChapterData.progress?.completed) return 'Replay Chapter'
    return 'Start Chapter'
  }

  const handleBackToWorldMap = () => router.push('/student/worldmap')

  if (authLoading || loading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading {castleData?.name || 'Castle'}...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error_container}>
        <h2>Error Loading Castle</h2>
        <p>{error}</p>
        <button onClick={handleBackToWorldMap} className={styles.errorButton}>Return to World Map</button>
      </div>
    )
  }

  if (!userProfile || !castleData) {
    return (
      <div className={styles.error_container}>
        <h2>Access Denied</h2>
        <p>Please log in to access this castle.</p>
        <button onClick={() => router.push('/auth/login')} className={styles.errorButton}>Go to Login</button>
      </div>
    )
  }

  const completedChaptersCount = chapters.filter(c => c.progress?.completed).length
  const overallProgress = chapters.length > 0 ? Math.round((completedChaptersCount / chapters.length) * 100) : 0
  const totalXpEarned = chapters.reduce((sum, c) => sum + (c.progress?.xp_earned || 0), 0)
  const selectedChapterData = chapters.find(c => c.chapter_number === selectedChapter)

  return (
    <div className={styles.chapterSelectionContainer}>
      {/* Navigation Loading Overlay */}
      {navigating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          gap: '1.5rem'
        }}>
          <Loader />
          <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '500' }}>
            Loading Chapter...
          </p>
        </div>
      )}
      
      <div className={styles.backgroundOverlay}></div>
      <CastleIntro show={showIntro} castleName={castleData.name} description={castleData.description} styleModule={styles} />
      <CastleHeader castleName={castleData.name} region={castleData.region} description={castleData.description} completedChapters={completedChaptersCount} totalChapters={chapters.length} overallProgress={overallProgress} onBack={handleBackToWorldMap} styleModule={styles} isLoading={loading} />
      <div className={styles.mainContent}>
        <ChapterList chapters={chapters} selectedChapter={selectedChapter} hoveredChapter={hoveredChapter} onChapterSelect={handleChapterSelect} onHoverEnter={setHoveredChapter} onHoverLeave={() => setHoveredChapter(null)} styleModule={styles} />
        <CastleCard castleName={castleData.name} description={castleData.description} imageNumber={castleData.image_number} totalXpEarned={totalXpEarned} chaptersRemaining={chapters.length - completedChaptersCount} styleModule={styles} />
      </div>
      <CastleActionButton selectedChapter={selectedChapter} isUnlocked={selectedChapterData?.progress?.unlocked || false} isCompleted={selectedChapterData?.progress?.completed || false} onStart={handleStartChapter} styleModule={styles} />
      <ParticleEffect styleModule={styles} count={15} />
    </div>
  )
}
