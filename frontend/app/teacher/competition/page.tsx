"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import PageHeader from '@/components/PageHeader'
import {
  CreateCompetitionForm,
  CompetitionList
} from '@/components/competition'
import { FaUsers } from 'react-icons/fa'
import LoadingOverlay from '@/components/LoadingOverlay'
import dashboardStyles from '@/styles/dashboard-wow.module.css'
import styles from '@/styles/competition-teacher.module.css'

export default function TeacherCompetitionPage() {
  const router = useRouter()
  const { isLoggedIn, appLoading } = useAuthStore()
  const { currentRoom, fetchRoomDetails, addCompetitionToRoom, createdRooms, fetchCreatedRooms, roomLoading } = useTeacherRoomStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  
  // Get roomCode from URL params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const roomCode = searchParams.get('roomCode')
  const roomId = currentRoom?.id

  console.log('🏠 TeacherCompetitionPage - roomCode:', roomCode, 'roomId:', roomId, 'currentRoom:', currentRoom, 'createdRooms:', createdRooms?.length)

  // Get competitions, problems and participants from currentRoom (already fetched by teacherRoomStore)
  const competitions = currentRoom?.competitions || []
  // Show all problems (both public and private) for competition use
  const visibleProblems = currentRoom?.problems || []
  const participants = currentRoom?.participants || []

  // Improved loading state logic
  const isDataLoading = roomLoading || 
    (roomCode && !initialDataLoaded) || 
    (roomCode && createdRooms.length === 0) || 
    (roomCode && !currentRoom) ||
    (roomCode && currentRoom && !Array.isArray(currentRoom.competitions))

  console.log('📊 Available data - Competitions:', competitions.length, 'Problems:', visibleProblems.length, 'Participants:', participants.length, 'isDataLoading:', isDataLoading)

  // First, ensure createdRooms are loaded
  useEffect(() => {
    if (isLoggedIn && !appLoading && createdRooms.length === 0) {
      console.log('🔄 Fetching created rooms first...')
      fetchCreatedRooms()
    }
  }, [isLoggedIn, appLoading, createdRooms.length, fetchCreatedRooms])

  // Then fetch room details once we have createdRooms
  useEffect(() => {
    if (isLoggedIn && !appLoading && roomCode && createdRooms.length > 0) {
      // Check if we need to fetch - either no currentRoom, different room, or data not complete
      const needsFetch = !currentRoom || 
                        currentRoom.code !== roomCode || 
                        !Array.isArray(currentRoom.participants) ||
                        !Array.isArray(currentRoom.competitions) ||
                        !Array.isArray(currentRoom.problems)
      
      if (needsFetch) {
        console.log('🔄 Fetching room details for roomCode:', roomCode)
        setInitialDataLoaded(false)
        fetchRoomDetails(roomCode, true).then(() => {
          console.log('✅ Room details loaded, setting initialDataLoaded to true')
          setInitialDataLoaded(true)
        })
      } else {
        console.log('✅ Room data already complete, setting initialDataLoaded to true')
        setInitialDataLoaded(true)
      }
    }
  }, [isLoggedIn, appLoading, roomCode, createdRooms.length, currentRoom?.code])

  // Handle create competition
  const handleCreateCompetition = async (title: string) => {
    setLoading(true)
    setError(null)
    const result = await addCompetitionToRoom(title)
    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Failed to create competition')
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

  // Redirect if no roomCode in URL
  if (!roomCode && !appLoading && isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            maxWidth: '500px',
            margin: '2rem auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#3b82f6'
            }}>🏠</div>
            <h2 style={{ 
              color: '#1a202c', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>No Room Selected</h2>
            <p style={{ 
              color: '#4a5568',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>Please access the competition dashboard from a virtual room.</p>
            <button 
              onClick={() => router.push('/teacher/virtual-rooms')} 
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Go to Virtual Rooms
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (appLoading || !isLoggedIn || loading || isDataLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            maxWidth: '500px',
            margin: '2rem auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#ef4444'
            }}>⚠️</div>
            <h2 style={{ 
              color: '#1a202c', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>Error</h2>
            <p style={{ 
              color: '#4a5568',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>{error}</p>
            <button 
              onClick={() => router.back()} 
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={dashboardStyles["dashboard-container"]}>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
        {/* Header */}
        <PageHeader
          title="Competition Dashboard"
          subtitle={`${participants.length} participants in room`}
          showAvatar={false}
          actionButton={
            <button 
              onClick={handleBack}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
            >
              Back
            </button>
          }
        />

        {/* Scrollable Content */}
        <div className={styles.scrollableContent}>
          {/* Main Content - 3 Column Layout */}
          <div className={styles.roomContent}>
            {/* Left Column - Create Competition + Room Competitions */}
            <div className={styles.leftColumn}>
              {/* Create Competition Form */}
              <CreateCompetitionForm
                onSubmit={handleCreateCompetition}
                loading={loading}
              />

              {/* Competitions List */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Room Competitions</h2>
                  <span className={styles.badge}>{competitions.length}</span>
                </div>
                
                {competitions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                      No competitions yet. Create your first competition above!
                    </p>
                  </div>
                ) : (
                  <CompetitionList
                    competitions={competitions as any}
                    onManage={handleManageCompetition}
                  />
                )}
              </div>
            </div>
            {/* End Left Column */}

            {/* Middle Column - Available Problems */}
            <div className={styles.middleColumn}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Available Problems</h2>
                  <span className={styles.badge}>
                    {visibleProblems.length}
                  </span>
                </div>
                
                <div className={styles.problemsList}>
                  {visibleProblems.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p className={styles.emptyText}>
                        No visible problems found. Create problems in your room first!
                      </p>
                    </div>
                  ) : (
                    visibleProblems.map((problem, index) => (
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
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* End Middle Column */}

            {/* Right Column - Participants */}
            <div className={styles.rightColumn}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <FaUsers style={{ marginRight: '0.5rem' }} />
                    Students
                  </h2>
                  <span className={styles.badge}>{participants.length}</span>
                </div>
                
                <div className={styles.participantsList}>
                {participants.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                      No participants yet. Invite students to your room!
                    </p>
                  </div>
                ) : (
                  participants.map((participant, index) => (
                    <div key={participant.participant_id || index} className={styles.participantCard}>
                      <div className={styles.participantAvatar}>
                        {participant.profile_pic ? (
                          <img
                            src={participant.profile_pic}
                            alt={`${participant.first_name} ${participant.last_name}`}
                            className={styles.avatarImage}
                          />
                        ) : (
                          participant.first_name?.charAt(0)?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className={styles.participantInfo}>
                        <h3 className={styles.participantName}>
                          {participant.first_name} {participant.last_name}
                        </h3>
                        {participant.role && (
                          <span className={styles.participantRole}>
                            {participant.role === 'student' ? 'Student' : 'Teacher'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}
