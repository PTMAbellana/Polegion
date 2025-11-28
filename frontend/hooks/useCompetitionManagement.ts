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
  const fetchCompetitionDetails = useCallback(async (competitionId: number, forceRefreshProblems = false) => {
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
        // Only update addedProblems if forced or if it's empty (initial load)
        addedProblems: forceRefreshProblems || prev.addedProblems.length === 0 ? (problems || []) : prev.addedProblems,
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

    // Optimistic update FIRST - immediate UI feedback
    const now = new Date().toISOString()
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      currentCompetition: prev.currentCompetition
        ? {
            ...prev.currentCompetition,
            status: 'ONGOING',
            gameplay_indicator: 'PLAY',
            current_problem_id: Number(problems[0]?.problem?.id || problems[0]?.id),
            current_problem_index: 0,
            timer_started_at: now,
            timer_duration: problems[0]?.timer || 30
          }
        : null
    }))
    
    try {
      const result = await startCompetition(competitionId, problems)
      
      console.log('🚀 [StartCompetition] API result:', result);
      console.log('🚀 [StartCompetition] Timer data:', {
        timer_started_at: result?.timer_started_at,
        timer_duration: result?.timer_duration
      });
      
      // Update with actual server response
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, ...result }
          : null,
        loading: false
      }))

      return { success: true }
    } catch (error) {
      // Revert optimistic update on error
      const errorMessage = error instanceof Error ? error.message : 'Failed to start competition'
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, status: 'NEW', gameplay_indicator: null }
          : null,
        error: errorMessage,
        loading: false
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Move to next problem
  const handleNextProblem = useCallback(async (
    competitionId: number,
    problems: CompetitionProblem[],
    currentIndex: number
  ) => {
    const nextIndex = currentIndex + 1
    const isLastProblem = nextIndex >= problems.length
    const now = new Date().toISOString()
    
    // Optimistic update FIRST - immediate UI feedback
    if (isLastProblem) {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
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
          : null
      }))
    } else {
      const nextProblemData = problems[nextIndex]
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        currentCompetition: prev.currentCompetition
          ? {
              ...prev.currentCompetition,
              current_problem_id: Number(nextProblemData?.problem?.id || nextProblemData?.id),
              current_problem_index: nextIndex,
              timer_started_at: now,
              timer_duration: nextProblemData?.timer || 30,
              gameplay_indicator: 'PLAY'
            }
          : null
      }))
    }
    
    try {
      const result = await nextProblem(competitionId, problems, currentIndex)
      
      // Update with actual server response
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, ...result }
          : null,
        loading: false
      }))

      return { success: true, finished: result.competition_finished }
    } catch (error) {
      // Revert optimistic update on error - go back to previous state
      const errorMessage = error instanceof Error ? error.message : 'Failed to move to next problem'
      const currentProblemData = problems[currentIndex]
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? {
              ...prev.currentCompetition,
              status: 'ONGOING',
              gameplay_indicator: 'PLAY',
              current_problem_index: currentIndex,
              current_problem_id: Number(currentProblemData?.problem?.id || currentProblemData?.id)
            }
          : null,
        error: errorMessage,
        loading: false
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Pause competition
  const handlePauseCompetition = useCallback(async (competitionId: number) => {
    // Optimistic update FIRST - immediate UI feedback
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      currentCompetition: prev.currentCompetition
        ? { ...prev.currentCompetition, gameplay_indicator: 'PAUSE' }
        : null
    }))
    
    try {
      const result = await pauseCompetition(competitionId)
      
      // Update with server response
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, ...result, gameplay_indicator: 'PAUSE' }
          : null,
        loading: false
      }))

      return { success: true }
    } catch (error) {
      // Revert optimistic update on error
      const errorMessage = error instanceof Error ? error.message : 'Failed to pause competition'
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, gameplay_indicator: 'PLAY' }
          : null,
        error: errorMessage,
        loading: false
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Resume competition
  const handleResumeCompetition = useCallback(async (competitionId: number) => {
    // Optimistic update FIRST - immediate UI feedback
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      currentCompetition: prev.currentCompetition
        ? { ...prev.currentCompetition, gameplay_indicator: 'PLAY' }
        : null
    }))
    
    try {
      const result = await resumeCompetition(competitionId)
      
      // Update with server response
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, ...result, gameplay_indicator: 'PLAY' }
          : null,
        loading: false
      }))

      return { success: true }
    } catch (error) {
      // Revert optimistic update on error
      const errorMessage = error instanceof Error ? error.message : 'Failed to resume competition'
      setState(prev => ({
        ...prev,
        currentCompetition: prev.currentCompetition
          ? { ...prev.currentCompetition, gameplay_indicator: 'PAUSE' }
          : null,
        error: errorMessage,
        loading: false
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Add problem to competition
  const addProblemToCompetition = useCallback(async (problemId: string, competitionId: number, problemData?: any) => {
    try {
      // Optimistically add if we have problem data
      if (problemData) {
        const optimisticProblem = {
          id: `temp-${Date.now()}`,
          competition_id: competitionId,
          problem_id: problemId,
          timer: problemData.timer || null,
          sequence_order: state.addedProblems.length,
          problem: problemData
        }
        setState(prev => ({ 
          ...prev, 
          addedProblems: [...prev.addedProblems, optimisticProblem] 
        }))
      }
      
      // Send to backend (but don't refetch - trust optimistic update)
      await addCompeProblem(problemId, competitionId)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add problem'
      // On error, revert by refetching
      try {
        const updatedProblems = await getCompeProblems(competitionId)
        setState(prev => ({ ...prev, addedProblems: updatedProblems || [], error: errorMessage }))
      } catch {
        setState(prev => ({ ...prev, error: errorMessage }))
      }
      return { success: false, error: errorMessage }
    }
  }, [state.addedProblems])

  // Remove problem from competition
  const removeProblemFromCompetition = useCallback(async (problemId: string, competitionId: number) => {
    try {
      // Optimistically remove from UI
      setState(prev => ({ 
        ...prev, 
        addedProblems: prev.addedProblems.filter(p => p.problem_id !== problemId && p.problem.id !== problemId) 
      }))
      
      // Send to backend (but don't refetch - trust optimistic update)
      await removeCompeProblem(problemId, competitionId)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove problem'
      // On error, revert by refetching
      try {
        const updatedProblems = await getCompeProblems(competitionId)
        setState(prev => ({ ...prev, addedProblems: updatedProblems || [], error: errorMessage }))
      } catch {
        setState(prev => ({ ...prev, error: errorMessage }))
      }
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
