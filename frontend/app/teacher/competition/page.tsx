"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { useCompetitionManagement } from '@/hooks/useCompetitionManagement'
import {
  CompetitionHeader,
  CreateCompetitionForm,
  CompetitionList
} from '@/components/competition'
import Loader from '@/components/Loader'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/competition-teacher.module.css'

export default function TeacherCompetitionPage() {
  const router = useRouter()
  const { isLoggedIn, appLoading } = useAuthStore()
  const { currentRoom } = useTeacherRoomStore()
  const [fetched, setFetched] = useState(false)
  const roomId = currentRoom?.id

  console.log('🏠 TeacherCompetitionPage - roomId:', roomId, 'currentRoom:', currentRoom)

  const {
    competitions,
    loading,
    error,
    fetchCompetitions,
    createCompetition
  } = useCompetitionManagement(roomId || '')

  // Get problems and participants from currentRoom (already fetched by teacherRoomStore)
  const visibleProblems = currentRoom?.problems?.filter(p => p.visibility === 'show') || []
  const participants = currentRoom?.participants || []

  console.log('📊 Available data - Problems:', visibleProblems.length, 'Participants:', participants.length)

  // Fetch competitions only
  const fetchAll = useCallback(async () => {
    if (!roomId) return
    
    console.log('🚀 Fetching competitions for room:', roomId)
    try {
      await fetchCompetitions()
      console.log('✅ Competitions fetched successfully')
    } catch (error) {
      console.error('❌ Error fetching competitions:', error)
    }
  }, [roomId, fetchCompetitions])

  useEffect(() => {
    if (isLoggedIn && !appLoading && !fetched && roomId) {
      fetchAll()
      setFetched(true)
    }
  }, [isLoggedIn, appLoading, fetched, roomId, fetchAll])

  // Handle create competition
  const handleCreateCompetition = async (title: string) => {
    const result = await createCompetition(title)
    if (result.success) {
      await fetchCompetitions()
    }
  }

  // Handle manage competition
  const handleManageCompetition = (competitionId: number) => {
    router.push(`/teacher/competition/${competitionId}?room=${roomId}`)
  }

  // Handle back
  const handleBack = () => {
    router.back()
  }

  if (appLoading || !isLoggedIn || loading) {
    return <LoadingOverlay isLoading={true}><Loader /></LoadingOverlay>
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => router.back()} className={styles.backButton}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Header */}
        <CompetitionHeader
          title="Competition Dashboard"
          description="Create and manage competitions for your students. Track their progress and XP earnings."
          onBack={handleBack}
        />

        {/* Main Content */}
        <div className={styles.roomContent}>
          {/* Left Column - Competitions */}
          <div className={styles.leftColumn}>
            {/* Create Competition Form */}
            <CreateCompetitionForm
              onSubmit={handleCreateCompetition}
              loading={loading}
            />

            {/* Competitions List */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🏆 Room Competitions</h2>
                <span className={styles.badge}>{competitions.length}</span>
              </div>
              
              {competitions.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    No competitions yet. Create your first competition above! 🎯
                  </p>
                </div>
              ) : (
                <CompetitionList
                  competitions={competitions}
                  onManage={handleManageCompetition}
                />
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            {/* Problems Preview */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🎯 Available Problems</h2>
                <span className={styles.badge}>
                  {visibleProblems.length}
                </span>
              </div>
              
              <div className={styles.problemsList}>
                {visibleProblems.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                      No visible problems found. Create problems in your room first! 📝
                    </p>
                  </div>
                ) : (
                  <>
                    {visibleProblems.slice(0, 5).map((problem, index) => (
                      <div key={problem.id} className={styles.problemCard}>
                        <div className={styles.problemContent}>
                          <div className={styles.problemLeft}>
                            <div className={styles.problemRank}>{index + 1}</div>
                            <div className={styles.problemInfo}>
                              <h3 className={styles.problemTitle}>
                                {problem.title || 'Untitled Problem'}
                              </h3>
                              <div className={styles.problemMeta}>
                                <span 
                                  className={styles.problemDifficulty}
                                  data-difficulty={problem.difficulty}
                                >
                                  {problem.difficulty}
                                </span>
                                <span className={styles.problemXp}>
                                  {problem.expected_xp} XP
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.problemRight}>
                            <div className={styles.problemTimer}>
                              {problem.timer != null && problem.timer > 0 
                                ? `${problem.timer}s` 
                                : <span className={styles.noTimer}>No timer</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {visibleProblems.length > 5 && (
                      <div className={styles.emptyState}>
                        <p className={styles.emptyText}>
                          +{visibleProblems.length - 5} more problems
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>👥 Room Participants</h2>
                <span className={styles.badge}>{participants.length}</span>
              </div>
              
              <div className={styles.participantsList}>
                {participants.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                      No participants yet. Invite students to your room! 👨‍🎓
                    </p>
                  </div>
                ) : (
                  <>
                    {participants.slice(0, 10).map((participant, index) => (
                      <div key={participant.participant_id || index} className={styles.participantCard}>
                        <div className={styles.participantRank}>{index + 1}</div>
                        <div className={styles.participantInfo}>
                          <h3 className={styles.participantName}>
                            {participant.first_name} {participant.last_name}
                          </h3>
                          {participant.role && (
                            <p className={styles.participantRole}>
                              {participant.role === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {participants.length > 10 && (
                      <div className={styles.emptyState}>
                        <p className={styles.emptyText}>
                          +{participants.length - 10} more participants
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
