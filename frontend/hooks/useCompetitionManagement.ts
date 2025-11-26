import { useState, useCallback } from 'react'
import {
  createCompe,
  getAllCompe,
  getCompeById,
  startCompetition,
  nextProblem,
  pauseCompetition,
  resumeCompetition
} from '@/api/competitions'
import {
  addCompeProblem,
  removeCompeProblem,
  getCompeProblems,
  updateTimer
} from '@/api/problems'
import { getAllParticipants } from '@/api/participants'
import { Competition, CompetitionProblem, CompetitionParticipant, Problem } from '@/types/common/competition'

interface CompetitionManagementState {
  competitions: Competition[]
  currentCompetition: Competition | null
  participants: CompetitionParticipant[]
  availableProblems: Problem[]
  addedProblems: CompetitionProblem[]
  loading: boolean
  error: string | null
}

export function useCompetitionManagement(roomId: string | number) {
  const [state, setState] = useState<CompetitionManagementState>({
    competitions: [],
    currentCompetition: null,
    participants: [],
    availableProblems: [],
    addedProblems: [],
    loading: false,
    error: null
  })

  // Fetch all competitions for a room
  const fetchCompetitions = useCallback(async () => {
    console.log('🔍 fetchCompetitions - roomId:', roomId)
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await getAllCompe(roomId, 'admin')
      console.log('📦 getAllCompe response:', response)
      
      if (response.success) {
        console.log('✅ Competitions fetched:', response.data?.length || 0, 'competitions')
        setState(prev => ({ ...prev, competitions: response.data || [], loading: false }))
      } else {
        console.log('⚠️ Competitions fetch failed:', response.message)
        setState(prev => ({ ...prev, error: response.message, competitions: [], loading: false }))
      }
    } catch (error) {
      console.error('❌ fetchCompetitions error:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch competitions', 
        loading: false 
      }))
    }
  }, [roomId])

  // Create new competition
  const createCompetition = useCallback(async (title: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await createCompe(roomId, title)
      // Always refetch to ensure we have the latest data
      await fetchCompetitions()
      return { success: true, data: result?.data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create competition'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [roomId, fetchCompetitions])

  // Fetch specific competition details
  const fetchCompetitionDetails = useCallback(async (competitionId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const [competition, participantsResponse, problems] = await Promise.all([
        getCompeById(roomId, competitionId, 'creator'),
        getAllParticipants(roomId, 'creator', true, competitionId),
        getCompeProblems(competitionId)
      ])

      // Handle different response formats for participants
      let participants = []
      if (participantsResponse && participantsResponse.data) {
        participants = participantsResponse.data.participants || participantsResponse.data || []
      } else if (Array.isArray(participantsResponse)) {
        participants = participantsResponse
      }

      setState(prev => ({
        ...prev,
        currentCompetition: competition,
        participants: participants,
        addedProblems: problems || [],
        loading: false
      }))
    } catch (error) {
      console.error('Error fetching competition details:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch competition details',
        loading: false
      }))
    }
  }, [roomId])

  // Start competition
  const handleStartCompetition = useCallback(async (competitionId: number, problems: CompetitionProblem[]) => {
    if (problems.length === 0) {
      setState(prev => ({ ...prev, error: 'Cannot start competition without problems' }))
      return { success: false, error: 'Cannot start competition without problems' }
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await startCompetition(competitionId, problems)
      
      // Optimistically update local state
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? {
              ...prev.currentCompetition,
              status: 'ONGOING',
              gameplay_indicator: 'PLAY', // Match backend value
              current_problem_id: Number(problems[0]?.problem?.id || problems[0]?.id),
              current_problem_index: 0,
              timer_started_at: new Date().toISOString(),
              timer_duration: problems[0]?.timer || 30 // Use seconds, not minutes
            }
          : null,
        loading: false
      }))

      // Fetch fresh data after a short delay
      setTimeout(() => fetchCompetitionDetails(competitionId), 1000)

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start competition'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [fetchCompetitionDetails])

  // Move to next problem
  const handleNextProblem = useCallback(async (
    competitionId: number,
    problems: CompetitionProblem[],
    currentIndex: number
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await nextProblem(competitionId, problems, currentIndex)
      
      const nextIndex = currentIndex + 1

      if (result.competition_finished) {
        setState(prev => ({
          ...prev,
          currentCompetition: prev.currentCompetition
            ? {
                ...prev.currentCompetition,
                status: 'DONE',
                gameplay_indicator: 'FINISHED',
                current_problem_id: undefined,
                current_problem_index: problems.length,
                timer_started_at: null,
                timer_duration: null
              }
            : null,
          loading: false
        }))
      } else {
        const nextProblemData = problems[nextIndex]
        setState(prev => ({
          ...prev,
          currentCompetition: prev.currentCompetition
            ? {
                ...prev.currentCompetition,
                current_problem_id: Number(nextProblemData?.problem?.id || nextProblemData?.id),
                current_problem_index: nextIndex,
                timer_started_at: new Date().toISOString(),
                timer_duration: nextProblemData?.timer || 30, // Use seconds
                gameplay_indicator: 'PLAY' // Match backend value
              }
            : null,
          loading: false
        }))
      }

      // Fetch fresh data
      setTimeout(() => fetchCompetitionDetails(competitionId), 1000)

      return { success: true, finished: result.competition_finished }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to move to next problem'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [fetchCompetitionDetails])

  // Pause competition
  const handlePauseCompetition = useCallback(async (competitionId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await pauseCompetition(competitionId)
      
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, gameplay_indicator: 'PAUSE' }
          : null,
        loading: false
      }))

      setTimeout(() => fetchCompetitionDetails(competitionId), 500)

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pause competition'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [fetchCompetitionDetails])

  // Resume competition
  const handleResumeCompetition = useCallback(async (competitionId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await resumeCompetition(competitionId)
      
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, gameplay_indicator: 'PLAY' } // Match backend value
          : null,
        loading: false
      }))

      setTimeout(() => fetchCompetitionDetails(competitionId), 500)

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resume competition'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [fetchCompetitionDetails])

  // Add problem to competition
  const addProblemToCompetition = useCallback(async (problemId: string, competitionId: number) => {
    try {
      await addCompeProblem(problemId, competitionId)
      const updatedProblems = await getCompeProblems(competitionId)
      setState(prev => ({ ...prev, addedProblems: updatedProblems || [] }))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add problem'
      setState(prev => ({ ...prev, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Remove problem from competition
  const removeProblemFromCompetition = useCallback(async (problemId: string, competitionId: number) => {
    try {
      await removeCompeProblem(problemId, competitionId)
      const updatedProblems = await getCompeProblems(competitionId)
      setState(prev => ({ ...prev, addedProblems: updatedProblems || [] }))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove problem'
      setState(prev => ({ ...prev, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Update problem timer
  const updateProblemTimer = useCallback(async (problemId: string, timer: number) => {
    try {
      await updateTimer(problemId, timer)
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update timer'
      setState(prev => ({ ...prev, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    fetchCompetitions,
    createCompetition,
    fetchCompetitionDetails,
    handleStartCompetition,
    handleNextProblem,
    handlePauseCompetition,
    handleResumeCompetition,
    addProblemToCompetition,
    removeProblemFromCompetition,
    updateProblemTimer,
    clearError
  }
}
