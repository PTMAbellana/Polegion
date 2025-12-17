"use client"

import { use, useEffect, useState, Suspense, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCompetitionManagement } from '@/hooks/useCompetitionManagement'
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime'
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer'
import { useParticipantHeartbeat } from '@/hooks/useParticipantHeartbeat'
import { useSubmissionViewer } from '@/hooks/useSubmissionViewer'
import { getRoomProblems } from '@/api/problems'
import { Problem } from '@/types/common/competition'
import PageHeader from '@/components/PageHeader'
import {
  CompetitionControls,
  ProblemsManagement,
  ParticipantsLeaderboard
} from '@/components/competition'
import SubmissionFilters from '@/components/competition/teacher/SubmissionFilters'
import SubmissionDisplay from '@/components/competition/teacher/SubmissionDisplay'
import LoadingOverlay from '@/components/LoadingOverlay'
import dashboardStyles from '@/styles/dashboard-wow.module.css'
import styles from '@/styles/competition-teacher.module.css'

// Inner component that uses useSearchParams
function TeacherCompetitionContent({ competitionId }: { competitionId: number }) {
  const searchParams = useSearchParams()
  const roomId = searchParams.get("room")
  const router = useRouter()
  const { isLoggedIn, appLoading, userProfile } = useAuthStore()
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([])
  const [fetched, setFetched] = useState(false)
  const [localAddedProblems, setLocalAddedProblems] = useState<any[]>([])
  const [initialLoading, setInitialLoading] = useState(true) // Separate state for initial load

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

  // Sync hook state to local state on initial load
  useEffect(() => {
    if (addedProblems.length > 0 && localAddedProblems.length === 0) {
      setLocalAddedProblems(addedProblems)
    }
  }, [addedProblems, localAddedProblems.length])

  // Real-time updates - pass false to always allow connection (don't block on initialLoading)
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    activeParticipants
  } = useCompetitionRealtime(competitionId, false, roomId || '', 'creator')

  // Send heartbeat to track teacher's active status (enabled: false since teachers shouldn't be tracked)
  // But we keep it here commented out in case we want to track teacher presence in the future
  // useParticipantHeartbeat(roomId || '', {
  //   isInCompetition: false,
  //   competitionId: null,
  //   enabled: false
  // });

  console.log('📊 [Teacher Page] Real-time hook returned:', {
    liveCompetition: !!liveCompetition,
    liveParticipantsCount: liveParticipants.length,
    activeParticipantsCount: activeParticipants?.length || 0,
    activeParticipantsRaw: activeParticipants
  });

  // Mark initial loading as complete once we have data OR the fetch has completed
  useEffect(() => {
    if (currentCompetition || liveCompetition || (!loading && fetched)) {
      setInitialLoading(false)
    }
  }, [currentCompetition, liveCompetition, loading, fetched])

  // Timer management - use the competition with the most recent timer data
  const competitionForTimer = (() => {
    // Prefer liveCompetition if it has timer data, otherwise use currentCompetition
    if (liveCompetition?.timer_started_at) return liveCompetition;
    if (currentCompetition?.timer_started_at) return currentCompetition;
    return liveCompetition || currentCompetition;
  })();
  
  const {
    formattedTime
  } = useCompetitionTimer(competitionId, competitionForTimer || undefined)

  // Use live data when available, prefer the most recent gameplay_indicator
  // liveCompetition from realtime updates, currentCompetition from management hook
  const displayCompetition = (() => {
    if (!liveCompetition && !currentCompetition) return null
    
    // If both exist, merge them intelligently
    if (liveCompetition && currentCompetition) {
      // Merge with preference for optimistic updates (currentCompetition) for status/gameplay
      // but use timer data from whichever has it
      return {
        ...liveCompetition,
        ...currentCompetition,
        // Prefer currentCompetition's status/gameplay since it has optimistic updates
        status: currentCompetition.status || liveCompetition.status,
        gameplay_indicator: currentCompetition.gameplay_indicator || liveCompetition.gameplay_indicator,
        // For timer data, prefer the one that actually has values
        timer_started_at: currentCompetition.timer_started_at || liveCompetition.timer_started_at,
        timer_duration: currentCompetition.timer_duration || liveCompetition.timer_duration,
        current_problem_index: currentCompetition.current_problem_index ?? liveCompetition.current_problem_index
      }
    }
    
    return liveCompetition || currentCompetition
  })()
  const displayParticipants = liveParticipants.length > 0 ? liveParticipants : participants
  
  // Keep track of the last known active participants to prevent flickering to 0
  const lastKnownActiveRef = useRef<any[]>([]);
  
  // Filter out teachers from active participants count
  // Only show students (role === 'student' or they're in participants list)
  const displayActiveParticipants = (() => {
    const allActive = activeParticipants || [];
    
    console.log('🔍 [Teacher Filter] Active participants RAW:', allActive);
    console.log('🔍 [Teacher Filter] Active count:', allActive.length);
    console.log('🔍 [Teacher Filter] Participants list:', displayParticipants);
    console.log('🔍 [Teacher Filter] Competition ID:', competitionId);
    console.log('🔍 [Teacher Filter] Room ID:', roomId);
    
    // Get participant IDs (students who joined the competition)
    const participantIds = new Set(displayParticipants.map((p: any) => p.user_id || p.id));
    
    const filtered = allActive.filter((ap: { id: string; role?: string }) => {
      // If role is explicitly 'teacher', exclude them
      if (ap.role === 'teacher') {
        console.log('🚫 [Teacher Filter] Excluding teacher:', ap);
        return false;
      }
      // If role is 'student', include them
      if (ap.role === 'student') {
        console.log('✅ [Teacher Filter] Including student:', ap);
        return true;
      }
      // If role is undefined (old presence data), check if they're in participants list
      if (!ap.role && participantIds.size > 0) {
        const isParticipant = participantIds.has(ap.id);
        console.log(`🔍 [Teacher Filter] No role for ${ap.id}, isParticipant: ${isParticipant}`, ap);
        return isParticipant;
      }
      // Default: include if we can't determine
      console.log('❓ [Teacher Filter] Unknown role, including by default:', ap);
      return true;
    });
    
    console.log('✅ [Teacher Filter] Filtered active participants:', filtered);
    
    // If we have filtered results, update the last known ref
    if (filtered.length > 0) {
      lastKnownActiveRef.current = filtered;
      return filtered;
    }
    
    // If filtered is empty but we had known active users, keep showing them
    // This prevents the count from dropping to 0 during page transitions
    if (lastKnownActiveRef.current.length > 0 && allActive.length === 0) {
      console.log('⚠️ [Teacher Filter] Using last known active participants to prevent flicker');
      return lastKnownActiveRef.current;
    }
    
    return filtered;
  })()

  // Use submission viewer hook for shared state between columns
  const submissionViewerState = useSubmissionViewer(
    localAddedProblems,
    displayParticipants
  );

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
    await handleStartCompetition(competitionId, localAddedProblems)
  }

  const handlePause = async () => {
    await handlePauseCompetition(competitionId)
  }

  const handleResume = async () => {
    await handleResumeCompetition(competitionId)
  }

  const handleNext = async () => {
    const currentIndex = displayCompetition?.current_problem_index || 0
    await handleNextProblem(competitionId, localAddedProblems, currentIndex)
  }

  const handleAddProblem = async (problem: Problem) => {
    // Instantly update local state
    const newProblem = {
      id: `temp-${Date.now()}`,
      competition_id: competitionId,
      problem_id: problem.id,
      timer: problem.timer || null,
      sequence_order: localAddedProblems.length,
      problem: problem
    }
    setLocalAddedProblems(prev => [...prev, newProblem])
    
    // Send to backend in background
    await addProblemToCompetition(problem.id, competitionId, problem)
  }

  const handleRemoveProblem = async (problem: Problem) => {
    // Instantly update local state
    setLocalAddedProblems(prev => 
      prev.filter(p => p.problem_id !== problem.id && p.problem?.id !== problem.id)
    )
    
    // Send to backend in background
    await removeProblemFromCompetition(problem.id, competitionId)
  }

  const handleUpdateTimer = async (problemId: string, timer: number) => {
    // Optimistically update UI immediately
    setAvailableProblems(prev => 
      prev.map(p => p.id === problemId ? { ...p, timer } : p)
    )
    
    // Update backend
    const result = await updateProblemTimer(problemId, timer)
    
    // If update failed, revert by refetching
    if (!result.success) {
      await fetchAvailableProblems()
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handlePrintResults = () => {
    // Generate CSV data
    const problems = localAddedProblems.map(cp => cp.problem);
    const participants = displayParticipants;
    
    // CSV Headers: Student Name, Problem 1, Problem 2, ..., Total XP
    const headers = ['Student Name', ...problems.map((p, idx) => `Problem ${idx + 1}: ${p.title}`), 'Total XP'];
    
    // CSV Rows: Each row is a student with their scores per problem
    const rows = participants.map(participant => {
      const row = [participant.fullName || 'Unknown'];
      
      // Add scores for each problem (if available from submissions)
      problems.forEach((problem, idx) => {
        // For now, show problem XP or empty if not submitted
        // You can enhance this with actual submission data if available
        const submitted = idx < (displayCompetition.current_problem_index || 0);
        row.push(submitted ? problem.expected_xp.toString() : '');
      });
      
      // Add total XP
      row.push((participant.accumulated_xp || 0).toString());
      
      return row;
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `competition_${displayCompetition.title.replace(/[^a-z0-9]/gi, '_')}_results.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Only show full loading overlay for initial load, not for action loading (pause/resume/etc)
  if (appLoading || !isLoggedIn || initialLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (error && !displayCompetition) {
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

  if (!displayCompetition) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={dashboardStyles["dashboard-container"]}>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {/* Header */}
          <PageHeader
            title={displayCompetition.title}
            subtitle={
              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Timer</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2C514C', fontFamily: 'monospace' }}>{formattedTime}</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Participants</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2C514C', fontFamily: 'monospace' }}>{displayParticipants.length}</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Active</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981', fontFamily: 'monospace' }}>{[...new Set(displayActiveParticipants.filter((ap: any) => ap.role !== 'teacher' && ap.id !== userProfile?.id).map((ap: any) => ap.id))].length}</span>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: displayCompetition.status === 'NEW' ? 'rgba(6, 182, 212, 0.1)' : 
                             displayCompetition.status === 'ONGOING' ? 'rgba(16, 185, 129, 0.1)' : 
                             'rgba(107, 114, 128, 0.1)',
                  borderRadius: '0.5rem',
                  border: `1px solid ${displayCompetition.status === 'NEW' ? 'rgba(6, 182, 212, 0.3)' : 
                             displayCompetition.status === 'ONGOING' ? 'rgba(16, 185, 129, 0.3)' : 
                             'rgba(107, 114, 128, 0.3)'}`,
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  color: displayCompetition.status === 'NEW' ? '#06b6d4' : 
                         displayCompetition.status === 'ONGOING' ? '#10b981' : 
                         '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  {displayCompetition.status}
                </div>
              </div>
            }
            showAvatar={false}
            actionButton={
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                <button 
                  onClick={handlePrintResults}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#16a34a',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    height: '44px'
                  }}
                >
                  📊 Print Results
                </button>
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
                    fontSize: '14px',
                    height: '44px'
                  }}
                >
                  Back
                </button>
              </div>
            }
          />

        {/* Scrollable Content */}
        <div className={styles.scrollableContent}>
          {/* Main Content */}
          <div className={styles.roomContent}>
            {/* Added Problems / Filter Column - First Column */}
            <div className={styles.leftColumn}>
              {displayCompetition.status === 'NEW' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Added Problems</h2>
                    <span className={styles.badge}>{localAddedProblems.length}</span>
                  </div>
                  
                  {localAddedProblems.length > 0 ? (
                    <div className={styles.problemsList}>
                      {localAddedProblems.map((compeProblem, index) => (
                        <div key={`added-${compeProblem.problem.id}-${index}`} className={styles.problemCard}>
                          <div className={styles.problemContent}>
                            <div className={styles.problemLeft}>
                              <div className={styles.problemRank}>{index + 1}</div>
                              <div className={styles.problemInfo}>
                                <h3 className={styles.problemTitle}>
                                  {compeProblem.problem.title || 'Untitled Problem'}
                                </h3>
                                <div className={styles.problemMeta}>
                                  <span 
                                    className={styles.problemDifficulty}
                                    data-difficulty={compeProblem.problem.difficulty}
                                  >
                                    {compeProblem.problem.difficulty}
                                  </span>
                                  <span className={styles.problemXp}>
                                    {compeProblem.problem.expected_xp} XP
                                  </span>
                                  <span 
                                    className={styles.visibilityBadge}
                                    data-visibility={compeProblem.problem.visibility}
                                  >
                                    {compeProblem.problem.visibility === 'public' ? 'Public' : 'Private'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className={styles.problemRight}>
                              <div className={styles.problemTimer}>
                                {compeProblem.timer != null && compeProblem.timer > 0 
                                  ? `${compeProblem.timer}s` 
                                  : <span className={styles.noTimer}>No timer</span>
                                }
                              </div>

                              {displayCompetition.status === 'NEW' && (
                                <button
                                  className={styles.removeButton}
                                  onClick={() => handleRemoveProblem(compeProblem.problem)}
                                  title="Remove from competition"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '0.875rem'
                    }}>
                      No problems added yet. Add problems from the available list.
                    </div>
                  )}
                </div>
              )}
              
              {/* Show filters during ONGOING and DONE */}
              {(displayCompetition.status === 'ONGOING' || displayCompetition.status === 'DONE') && (
                <SubmissionFilters
                  problems={submissionViewerState.problems}
                  participants={submissionViewerState.participants}
                  selectedProblem={submissionViewerState.selectedProblem}
                  selectedParticipant={submissionViewerState.selectedParticipant}
                  onSelectProblem={(problem) => {
                    submissionViewerState.setSelectedProblem(problem);
                    submissionViewerState.setSelectedParticipant(null);
                  }}
                  onSelectParticipant={submissionViewerState.setSelectedParticipant}
                />
              )}
            </div>

            {/* Available Problems / Submission Display - Second Column */}
            <div className={styles.middleColumn}>
              {displayCompetition.status === 'NEW' && (
                <>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Available Problems</h2>
                    <span className={styles.badge}>
                      {availableProblems.filter(p => 
                        !localAddedProblems.some(ap => ap.problem.id === p.id)
                      ).length}
                    </span>
                  </div>
                  
                  <div className={styles.problemsList}>
                    {availableProblems
                      .filter(problem => 
                        !localAddedProblems.some(ap => ap.problem.id === problem.id)
                      )
                      .map((problem, index) => {
                        const canAdd = problem.timer && problem.timer > 0
                        return (
                          <div key={`available-${problem.id}-${index}`} className={styles.problemCard}>
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
                                    <span 
                                      className={styles.visibilityBadge}
                                      data-visibility={problem.visibility}
                                    >
                                      {problem.visibility === 'public' ? 'Public' : 'Private'}
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
                                <button
                                  className={styles.addButton}
                                  disabled={!canAdd}
                                  onClick={() => handleAddProblem(problem)}
                                  title={!canAdd ? 'Set timer first' : 'Add to competition'}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </>
              )}
              
              {/* Show submission display during ONGOING and DONE */}
              {(displayCompetition.status === 'ONGOING' || displayCompetition.status === 'DONE') && (
                <SubmissionDisplay
                  selectedProblem={submissionViewerState.selectedProblem}
                  selectedParticipant={submissionViewerState.selectedParticipant}
                  submission={submissionViewerState.submission}
                  loading={submissionViewerState.loading}
                  competitionId={competitionId}
                  roomId={roomId || ''}
                />
              )}
            </div>

            {/* Participants - Third Column */}
            <div className={styles.rightColumn}>
              <ParticipantsLeaderboard 
                participants={displayParticipants} 
                activeParticipants={displayActiveParticipants}
                currentProblemIndex={displayCompetition.current_problem_index}
                competitionStatus={displayCompetition.status}
                currentUserId={userProfile?.id}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

// Main page component wraps content in Suspense
export default function TeacherCompetitionManagementPage({ 
  params 
}: { 
  params: Promise<{ competitionId: number }> 
}) {
  const { competitionId } = use(params)

  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <TeacherCompetitionContent competitionId={competitionId} />
    </Suspense>
  )
}
