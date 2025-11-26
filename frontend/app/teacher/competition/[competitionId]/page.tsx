"use client"

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCompetitionManagement } from '@/hooks/useCompetitionManagement'
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime'
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer'
import { getRoomProblems } from '@/api/problems'
import { Problem } from '@/types/common/competition'
import {
  CompetitionHeader,
  CompetitionControls,
  ProblemsManagement,
  ParticipantsLeaderboard
} from '@/components/competition'
import Loader from '@/components/Loader'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/competition-teacher.module.css'

export default function TeacherCompetitionManagementPage({ 
  params 
}: { 
  params: Promise<{ competitionId: number }> 
}) {
  const { competitionId } = use(params)
  const searchParams = useSearchParams()
  const roomId = searchParams.get("room")
  const router = useRouter()
  const { isLoggedIn, appLoading } = useAuthStore()
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([])
  const [fetched, setFetched] = useState(false)

  const {
    currentCompetition,
    participants,
    addedProblems,
    loading,
    error,
    fetchCompetitionDetails,
    handleStartCompetition,
    handleNextProblem,
    handlePauseCompetition,
    handleResumeCompetition,
    addProblemToCompetition,
    removeProblemFromCompetition,
    updateProblemTimer
  } = useCompetitionManagement(roomId || '')

  // Real-time updates
  const {
    competition: liveCompetition,
    participants: liveParticipants
  } = useCompetitionRealtime(competitionId, loading)

  // Timer management
  const {
    formattedTime
  } = useCompetitionTimer(competitionId, liveCompetition || currentCompetition || undefined)

  // Use live data when available
  const displayCompetition = liveCompetition || currentCompetition
  const displayParticipants = liveParticipants.length > 0 ? liveParticipants : participants

  // Fetch available problems
  const fetchAvailableProblems = async () => {
    if (!roomId) return
    try {
      const response = await getRoomProblems(roomId)
      if (response.success && response.data) {
        setAvailableProblems(response.data)
      } else if (Array.isArray(response)) {
        setAvailableProblems(response)
      }
    } catch (error) {
      console.error('Error fetching problems:', error)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (isLoggedIn && !appLoading && !fetched && roomId && competitionId) {
      fetchCompetitionDetails(competitionId)
      fetchAvailableProblems()
      setFetched(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, appLoading, fetched, roomId, competitionId])

  // Handle control actions
  const handleStart = async () => {
    await handleStartCompetition(competitionId, addedProblems)
  }

  const handlePause = async () => {
    await handlePauseCompetition(competitionId)
  }

  const handleResume = async () => {
    await handleResumeCompetition(competitionId)
  }

  const handleNext = async () => {
    const currentIndex = displayCompetition?.current_problem_index || 0
    await handleNextProblem(competitionId, addedProblems, currentIndex)
  }

  const handleAddProblem = async (problem: Problem) => {
    await addProblemToCompetition(problem.id, competitionId)
  }

  const handleRemoveProblem = async (problem: Problem) => {
    await removeProblemFromCompetition(problem.id, competitionId)
  }

  const handleUpdateTimer = async (problemId: string, timer: number) => {
    await updateProblemTimer(problemId, timer)
    await fetchAvailableProblems()
  }

  const handleBack = () => {
    router.back()
  }

  if (appLoading || !isLoggedIn || loading) {
    return <LoadingOverlay isLoading={true}><Loader /></LoadingOverlay>
  }

  if (error && !displayCompetition) {
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

  if (!displayCompetition) {
    return <LoadingOverlay isLoading={true}><Loader /></LoadingOverlay>
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Header */}
        <CompetitionHeader
          title={displayCompetition.title}
          description={`Status: ${displayCompetition.status} | Timer: ${formattedTime}`}
          onBack={handleBack}
        />

        {/* Competition Controls */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <CompetitionControls
              competition={displayCompetition}
              addedProblems={addedProblems}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onNext={handleNext}
              loading={loading}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.roomContent}>
          {/* Problems Management */}
          <ProblemsManagement
            availableProblems={availableProblems}
            addedProblems={addedProblems}
            competitionStatus={displayCompetition.status}
            onAddProblem={handleAddProblem}
            onRemoveProblem={handleRemoveProblem}
            onUpdateTimer={handleUpdateTimer}
          />

          {/* Participants Leaderboard */}
          <ParticipantsLeaderboard participants={displayParticipants} />
        </div>
      </div>
    </div>
  )
}   
