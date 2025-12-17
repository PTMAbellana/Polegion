"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { getCastles } from "@/api/castles"
import { getChaptersByCastle } from "@/api/chapters"
import PageHeader from "@/components/PageHeader"
import LoadingOverlay from "@/components/LoadingOverlay"
import styles from "@/styles/dashboard-wow.module.css"
import castleStyles from "@/styles/teacher-castle-viewer.module.css"
import { FaBook, FaGraduationCap, FaListAlt, FaChalkboardTeacher } from "react-icons/fa"

// Import chapter constants to extract topics
import * as C1C1 from "@/constants/chapters/castle1/chapter1"
import * as C1C2 from "@/constants/chapters/castle1/chapter2"
import * as C1C3 from "@/constants/chapters/castle1/chapter3"
import * as C2C1 from "@/constants/chapters/castle2/chapter1"
import * as C2C2 from "@/constants/chapters/castle2/chapter2"
import * as C2C3 from "@/constants/chapters/castle2/chapter3"
import * as C2C4 from "@/constants/chapters/castle2/chapter4"
import * as C3C1 from "@/constants/chapters/castle3/chapter1"
import * as C3C2 from "@/constants/chapters/castle3/chapter2"
import * as C3C3 from "@/constants/chapters/castle3/chapter3"
import * as C4C1 from "@/constants/chapters/castle4/chapter1"
import * as C4C2 from "@/constants/chapters/castle4/chapter2"
import * as C4C3 from "@/constants/chapters/castle4/chapter3"
import * as C4C4 from "@/constants/chapters/castle4/chapter4"
import * as C5C1 from "@/constants/chapters/castle5/chapter1"
import * as C5C2 from "@/constants/chapters/castle5/chapter2"
import * as C5C3 from "@/constants/chapters/castle5/chapter3"
import * as C5C4 from "@/constants/chapters/castle5/chapter4"

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

interface ChapterConcept {
  key: string
  title: string
  summary?: string
  description: string
  image?: string
  taskId?: string
}

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame'
  text: string
  key?: string
  taskId?: string
}

// Map castle_number + chapter_number to chapter constants
const CHAPTER_CONSTANTS_MAP: Record<string, any> = {
  '1-1': C1C1, '1-2': C1C2, '1-3': C1C3,
  '2-1': C2C1, '2-2': C2C2, '2-3': C2C3, '2-4': C2C4,
  '3-1': C3C1, '3-2': C3C2, '3-3': C3C3,
  '4-1': C4C1, '4-2': C4C2, '4-3': C4C3, '4-4': C4C4,
  '5-1': C5C1, '5-2': C5C2, '5-3': C5C3, '5-4': C5C4,
}

export default function TeacherCastleContentPage() {
  const { userProfile, appLoading } = useAuthStore()
  const [castles, setCastles] = useState<Castle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedView, setSelectedView] = useState<'handbook' | 'castle'>('handbook')
  const [selectedCastleId, setSelectedCastleId] = useState<number | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null)
  const [castleChapters, setCastleChapters] = useState<{ [key: number]: Chapter[] }>({})

  useEffect(() => {
    if (!appLoading && userProfile?.id) {
      fetchCastles()
    }
  }, [appLoading, userProfile])

  const fetchCastles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getCastles()
      
      if (response.success && response.data) {
        const sortedCastles = response.data.sort((a: Castle, b: Castle) => 
          a.castle_number - b.castle_number
        )
        setCastles(sortedCastles)
        
        // Preload all chapters
        await preloadAllChapters(sortedCastles)
        
        // Don't auto-select castle - start with handbook view
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

  const preloadAllChapters = async (castleList: Castle[]) => {
    const results = await Promise.all(
      castleList.map(async (castle) => {
        try {
          const response = await getChaptersByCastle(castle.id)
          if (response.success && response.data) {
            return {
              castleId: castle.id,
              chapters: response.data.sort((a: Chapter, b: Chapter) => 
                a.chapter_number - b.chapter_number
              )
            }
          }
        } catch (error) {
          console.error(`Error loading chapters for castle ${castle.id}`, error)
        }
        return { castleId: castle.id, chapters: [] as Chapter[] }
      })
    )

    const chaptersMap: { [key: number]: Chapter[] } = {}
    results.forEach(({ castleId, chapters }) => {
      chaptersMap[castleId] = chapters
    })
    setCastleChapters(chaptersMap)
  }

  const getChapterDetails = (castleNumber: number, chapterNumber: number) => {
    const key = `${castleNumber}-${chapterNumber}`
    const chapterConst = CHAPTER_CONSTANTS_MAP[key]
    
    if (!chapterConst) {
      return { concepts: [], dialogue: [], openingDialogue: [] }
    }

    // All chapter constants use CHAPTER1_CONCEPTS naming (not dynamic)
    const concepts: ChapterConcept[] = (
      chapterConst.CHAPTER1_CONCEPTS || []
    ).map((c: any) => ({
      key: c.key || '',
      title: c.title || '',
      summary: c.summary || '',
      description: c.description || '',
      image: c.image
    }))

    const dialogue: ChapterDialogue[] = chapterConst.CHAPTER1_DIALOGUE || []
    const openingDialogue = dialogue.filter((d: ChapterDialogue) => d.scene === 'opening')

    return { concepts, dialogue, openingDialogue }
  }

  const selectedCastle = castles.find(c => c.id === selectedCastleId)
  const currentChapters = selectedCastleId ? (castleChapters[selectedCastleId] || []) : []
  const selectedChapter = currentChapters.find(ch => ch.id === selectedChapterId)

  // Auto-select first chapter when castle changes
  useEffect(() => {
    if (selectedCastleId && currentChapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(currentChapters[0].id)
    }
  }, [selectedCastleId, currentChapters])

  if (appLoading || loading) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={styles["dashboard-container"]}>
      <PageHeader
        title="Castle Content Handbook"
        subtitle="Comprehensive curriculum guide for all geometry learning modules"
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'T'}
      />

      <div className={styles["scrollable-content"]}>
        {error && (
          <div className={castleStyles.errorMessage}>
            <p>{error}</p>
            <button onClick={fetchCastles} className="btn btn-primary">Retry</button>
          </div>
        )}

        {!error && (
          <div className={castleStyles.mainContainer}>
            {/* Main Navigation Tabs - Handbook + All Castles */}
            <div className={castleStyles.mainTabsContainer}>
              <button
                className={`${castleStyles.mainTab} ${selectedView === 'handbook' ? castleStyles.mainTabActive : ''}`}
                onClick={() => {
                  setSelectedView('handbook')
                  setSelectedCastleId(null)
                  setSelectedChapterId(null)
                }}
              >
                <div className={castleStyles.mainTabIcon}>📚</div>
                <div className={castleStyles.mainTabLabel}>Handbook</div>
              </button>
              
              {castles.map((castle) => (
                <button
                  key={castle.id}
                  className={`${castleStyles.mainTab} ${selectedView === 'castle' && selectedCastleId === castle.id ? castleStyles.mainTabActive : ''}`}
                  onClick={() => {
                    setSelectedView('castle')
                    setSelectedCastleId(castle.id)
                    setSelectedChapterId(null)
                  }}
                >
                  <div className={castleStyles.mainTabNumber}>Castle {castle.castle_number}</div>
                  <div className={castleStyles.mainTabLabel}>{castle.name}</div>
                </button>
              ))}
            </div>

            {/* Chapter Tabs - Only show when a castle is selected */}
            {selectedView === 'castle' && selectedCastleId && currentChapters.length > 0 && (
              <div className={castleStyles.chapterTabsRow}>
                {currentChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className={`${castleStyles.chapterTab} ${selectedChapterId === chapter.id ? castleStyles.chapterTabActive : ''}`}
                    onClick={() => setSelectedChapterId(chapter.id)}
                  >
                    <span className={castleStyles.chapterTabNum}>Ch {chapter.chapter_number}</span>
                    <span className={castleStyles.chapterTabName}>{chapter.title}</span>
                    <span className={castleStyles.chapterTabXp}>⭐ {chapter.xp_reward}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Display Area */}
            <div className={castleStyles.contentArea}>
              {selectedView === 'handbook' && (
                <div className={castleStyles.handbookContent}>
                  <div className={castleStyles.handbookHeader}>
                    <FaChalkboardTeacher size={56} className={castleStyles.handbookIcon} />
                    <div>
                      <h1>Teacher's Curriculum Reference</h1>
                      <p className={castleStyles.handbookSubtitle}>
                        A comprehensive overview of the geometry curriculum organized by learning modules (castles) and instructional units (chapters). 
                        Each chapter details mathematical concepts, learning objectives, and pedagogical progression designed to build student understanding from foundational to advanced topics.
                      </p>
                    </div>
                  </div>
                  
                  <div className={castleStyles.handbookGrid}>
                    <div className={castleStyles.handbookCard}>
                      <FaBook size={36} />
                      <h3>Structured Learning Path</h3>
                      <p>Seven progressive modules covering fundamental geometry through advanced spatial reasoning.</p>
                    </div>
                    <div className={castleStyles.handbookCard}>
                      <FaGraduationCap size={36} />
                      <h3>Standards-Aligned Content</h3>
                      <p>Each lesson aligns with geometry learning standards and builds conceptual understanding.</p>
                    </div>
                    <div className={castleStyles.handbookCard}>
                      <FaListAlt size={36} />
                      <h3>Detailed Topic Breakdown</h3>
                      <p>View specific concepts, definitions, and learning outcomes for every instructional unit.</p>
                    </div>
                  </div>

                  <div className={castleStyles.handbookInstructions}>
                    <h2>How to Use This Handbook</h2>
                    <ol>
                      <li>
                        <strong>Select a Castle:</strong> Click on any castle tab above to view its curriculum content and chapters.
                      </li>
                      <li>
                        <strong>Choose a Chapter:</strong> Once a castle is selected, chapter tabs will appear. Click to view detailed lesson content.
                      </li>
                      <li>
                        <strong>Review Topics:</strong> Each chapter displays all mathematical concepts, definitions, and learning objectives in an organized format.
                      </li>
                      <li>
                        <strong>Plan Instruction:</strong> Use this information for lesson planning, intervention strategies, and curriculum alignment.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedView === 'castle' && selectedChapter && selectedCastle && (
                <div className={castleStyles.chapterContent}>
                  {/* Chapter Title */}
                  <div className={castleStyles.chapterTitleSection}>
                    <div className={castleStyles.chapterMeta}>
                      <span className={castleStyles.castleBadge}>Castle {selectedCastle.castle_number}</span>
                      <span className={castleStyles.chapterBadge}>Chapter {selectedChapter.chapter_number}</span>
                    </div>
                    <h1>{selectedChapter.title}</h1>
                    <p className={castleStyles.chapterDesc}>{selectedChapter.description}</p>
                    <div className={castleStyles.xpBadge}>⭐ {selectedChapter.xp_reward} XP</div>
                  </div>

                  {(() => {
                    const { concepts, openingDialogue } = getChapterDetails(
                      selectedCastle.castle_number,
                      selectedChapter.chapter_number
                    )

                    return (
                      <>
                        {/* Concepts/Topics */}
                        {concepts.length > 0 && (
                          <div className={castleStyles.conceptsSection}>
                            <h2>Topics Covered</h2>
                            <div className={castleStyles.conceptsList}>
                              {concepts.map((concept, idx) => (
                                <div key={idx} className={castleStyles.conceptItem}>
                                  <div className={castleStyles.conceptHeader}>
                                    <span className={castleStyles.conceptNumber}>{idx + 1}</span>
                                    <h3>{concept.title}</h3>
                                  </div>
                                  <p className={castleStyles.conceptDescription}>{concept.description}</p>
                                  {concept.summary && concept.summary !== concept.description && (
                                    <p className={castleStyles.conceptSummary}>
                                      <strong>Key Point:</strong> {concept.summary}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chapter Introduction */}
                        {openingDialogue.length > 0 && (
                          <div className={castleStyles.introSection}>
                            <h2>Chapter Introduction</h2>
                            <div className={castleStyles.narrativeBox}>
                              {openingDialogue.map((dialogue, idx) => (
                                <p key={idx}>{dialogue.text}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Learning Objectives */}
                        <div className={castleStyles.objectivesSection}>
                          <h2>Learning Objectives</h2>
                          <ul>
                            {concepts.map((concept, idx) => (
                              <li key={idx}>
                                Understand and apply the concept of <strong>{concept.title}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Prerequisites */}
                        <div className={castleStyles.prerequisitesSection}>
                          <h2>Prerequisites</h2>
                          <p>
                            {(() => {
                              // For chapters after the first in a castle
                              if (selectedChapter.chapter_number > 1) {
                                return `Students should have successfully completed Chapter ${selectedChapter.chapter_number - 1} of this castle.`
                              }
                              
                              // For first chapter of each castle
                              const prerequisites: Record<number, string> = {
                                0: "This is the foundational chapter. No prior geometry knowledge required.",
                                1: "Students should have completed all chapters in Castle 0 (Geometry Fundamentals).",
                                2: "Students should have completed all chapters in Castle 1.",
                                3: "Students should have completed all chapters in Castle 2.",
                                4: "Students should have completed all chapters in Castle 3.",
                                5: "Students should have completed all chapters in Castle 4.",
                              }
                              
                              return prerequisites[selectedCastle.castle_number] || "Students should have completed the previous castle."
                            })()}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              {selectedView === 'castle' && !selectedChapterId && selectedCastleId && currentChapters.length > 0 && (
                <div className={castleStyles.selectPrompt}>
                  <FaBook size={64} color="#94a3b8" />
                  <h2>Select a Chapter</h2>
                  <p>Choose a chapter from the tabs above to view detailed curriculum content.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
