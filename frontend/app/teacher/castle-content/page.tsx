"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { getCastles } from "@/api/castles"
import PageHeader from "@/components/PageHeader"
import LoadingOverlay from "@/components/LoadingOverlay"
import styles from "@/styles/dashboard-wow.module.css"
import castleStyles from "@/styles/teacher-castle-viewer.module.css"
import { FaLock, FaUnlock, FaBook, FaChevronDown, FaChevronUp } from "react-icons/fa"

interface Castle {
  id: number
  name: string
  description: string
  castle_number: number
  route: string
  image_url?: string
}

interface Chapter {
  id: number
  chapter_number: number
  title: string
  description: string
  xp_reward: number
}

export default function TeacherCastleContentPage() {
  const router = useRouter()
  const { userProfile, appLoading } = useAuthStore()
  const [castles, setCastles] = useState<Castle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCastle, setExpandedCastle] = useState<number | null>(null)
  const [castleChapters, setCastleChapters] = useState<{ [key: number]: Chapter[] }>({})

  // Debug logging
  useEffect(() => {
    console.log('[CastleContent] Component mounted')
    console.log('[CastleContent] userProfile:', userProfile)
    console.log('[CastleContent] appLoading:', appLoading)
    
    // PREVENT any automatic navigation
    const preventNavigation = (e: PopStateEvent) => {
      console.log('[CastleContent] Navigation prevented')
      e.preventDefault()
    }
    
    return () => {
      console.log('[CastleContent] Component unmounting')
    }
  }, [])

  useEffect(() => {
    if (!appLoading && userProfile?.id) {
      console.log('[CastleContent] Fetching castles for user:', userProfile.id, 'role:', userProfile.role)
      fetchCastles()
    }
  }, [appLoading, userProfile])

  const fetchCastles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the existing getCastles API but without userId to get all castles
      const response = await getCastles()
      
      if (response.success && response.data) {
        // Sort by castle number
        const sortedCastles = response.data.sort((a: Castle, b: Castle) => 
          a.castle_number - b.castle_number
        )
        setCastles(sortedCastles)
      } else {
        setError("Failed to load castles")
      }
    } catch (err: any) {
      console.error("Error fetching castles:", err)
      setError(err.message || "Failed to load castle data")
    } finally {
      setLoading(false)
    }
  }

  const toggleCastle = async (castleId: number) => {
    if (expandedCastle === castleId) {
      setExpandedCastle(null)
    } else {
      setExpandedCastle(castleId)
      // Fetch chapters if not already loaded
      if (!castleChapters[castleId]) {
        await fetchChapters(castleId)
      }
    }
  }

  const fetchChapters = async (castleId: number) => {
    try {
      // Import the chapters API
      const { getChaptersByCastle } = await import("@/api/chapters")
      const response = await getChaptersByCastle(castleId)
      
      if (response.success && response.data) {
        setCastleChapters(prev => ({
          ...prev,
          [castleId]: response.data.sort((a: Chapter, b: Chapter) => 
            a.chapter_number - b.chapter_number
          )
        }))
      }
    } catch (err) {
      console.error("Error fetching chapters:", err)
    }
  }

  const handleViewChapter = (castleRoute: string, chapterNumber: number) => {
    console.log('[CastleContent] handleViewChapter called:', { castleRoute, chapterNumber })
    console.trace('[CastleContent] Stack trace:')
    
    // Open in new tab so teachers can view without leaving the castle content page
    window.open(`/student/worldmap/${castleRoute}/chapter${chapterNumber}`, '_blank')
  }

  if (appLoading || loading) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={styles["dashboard-container"]}>
      <PageHeader
        title="Castle Content Viewer"
        subtitle="Browse all castle chapters and content that students learn"
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'T'}
      />

      <div className={styles["scrollable-content"]}>
        {error && (
          <div className={castleStyles.errorMessage}>
            <p>{error}</p>
            <button onClick={fetchCastles} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {!error && castles.length === 0 && (
          <div className={castleStyles.emptyState}>
            <FaBook size={64} color="#6b7280" />
            <h3>No Castles Available</h3>
            <p>Castle content will appear here once configured.</p>
          </div>
        )}

        {!error && castles.length > 0 && (
          <div className={castleStyles.castleGrid}>
            {castles.map((castle) => (
              <div key={castle.id} className={castleStyles.castleCard}>
                <div 
                  className={castleStyles.castleHeader}
                  onClick={() => toggleCastle(castle.id)}
                >
                  <div className={castleStyles.castleInfo}>
                    <div className={castleStyles.castleNumber}>
                      Castle {castle.castle_number}
                    </div>
                    <h3 className={castleStyles.castleName}>{castle.name}</h3>
                    <p className={castleStyles.castleDescription}>
                      {castle.description}
                    </p>
                  </div>
                  <div className={castleStyles.expandIcon}>
                    {expandedCastle === castle.id ? (
                      <FaChevronUp size={20} />
                    ) : (
                      <FaChevronDown size={20} />
                    )}
                  </div>
                </div>

                {expandedCastle === castle.id && (
                  <div className={castleStyles.chaptersSection}>
                    {!castleChapters[castle.id] ? (
                      <div className={castleStyles.loadingChapters}>
                        <p>Loading chapters...</p>
                      </div>
                    ) : castleChapters[castle.id].length === 0 ? (
                      <div className={castleStyles.noChapters}>
                        <p>No chapters available for this castle.</p>
                      </div>
                    ) : (
                      <div className={castleStyles.chapterList}>
                        {castleChapters[castle.id].map((chapter) => (
                          <div 
                            key={chapter.id} 
                            className={castleStyles.chapterItem}
                          >
                            <div className={castleStyles.chapterInfo}>
                              <div className={castleStyles.chapterNumber}>
                                Chapter {chapter.chapter_number}
                              </div>
                              <h4 className={castleStyles.chapterTitle}>
                                {chapter.title}
                              </h4>
                              <p className={castleStyles.chapterDescription}>
                                {chapter.description}
                              </p>
                              <div className={castleStyles.chapterXp}>
                                ⭐ {chapter.xp_reward} XP
                              </div>
                            </div>
                            <button
                              onClick={() => handleViewChapter(castle.route, chapter.chapter_number)}
                              className={castleStyles.viewChapterBtn}
                            >
                              View Content
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={castleStyles.infoBox}>
          <h4>📚 About Castle Content</h4>
          <p>
            This page allows you to browse all castle chapters and their content 
            without needing a student account. Click on any castle to expand and 
            view its chapters, then click "View Content" to see what students learn.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <strong>Note:</strong> You can view all content regardless of unlock status. 
            Students must complete chapters in order to progress.
          </p>
        </div>
      </div>
    </div>
  )
}
