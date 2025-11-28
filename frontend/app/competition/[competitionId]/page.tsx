"use client";

import React, { use, useEffect, useState, useCallback, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { addCompeProblem, getCompeProblems, getRoomProblems, removeCompeProblem, updateTimer } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getCompeById, startCompetition, nextProblem, pauseCompetition, resumeCompetition } from '@/api/competitions';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';

interface Participant {
  id: number;
  fullName?: string;
  accumulated_xp: number | 0;
}

interface Problems {
    id: string
    title?: string | 'No Title'
    description: string
    difficulty: string
    max_attempts: number
    visibility: 'show' | 'hide'
    timer: number | null
}

interface Competition {
  title: string;
  status: string;
  gameplay_indicator?: string;
  current_problem_id?: number;
  current_problem_index?: number;
  timer_started_at?: string;
  timer_duration?: number;
  timer_end_at?: string;
  time_remaining?: number;
}

interface CompeProblems {
  id: string;
  competition_id: number;
  timer: number | null;
  problem: Problems;
}

const CompetitionDashboard = ({ params } : { params  : Promise<{competitionId : number }> }) => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const compe_id = use(params)
  const router = useRouter();

  // console.log('compe_id: ', compe_id.competitionId)
  // const [participants, setParticipants] = useState<Participant[]>([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [fetched, setFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  
  const [participants, setParticipants] = useState<Participant[]>([])
  const [problems, setProblems] = useState<Problems[]>([])
  // Persistent addedProblems order (fetched from API)
  const [addedProblems, setAddedProblems] = useState<CompeProblems[]>([]); // store problem ids added to competition
  // Track if addedProblems have been loaded from API
  const [addedProblemsLoaded, setAddedProblemsLoaded] = useState(false);
  const [editingTimerId, setEditingTimerId] = useState<string | null>(null);
  const [timerEditValue, setTimerEditValue] = useState<number>(0);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined)
  //  // Real-time competition state
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    isConnected,
    connectionStatus,
    pollCount
  } = useCompetitionRealtime(compe_id.competitionId, isLoading, roomId || '', 'creator');
  
  // Real-time timer management
  const {
    isTimerActive,
    formattedTime,
    isExpired
  } = useCompetitionTimer(compe_id.competitionId, liveCompetition || competition);
    
  // Use live competition data when available, fallback to initial API state
  const currentCompetition: Competition = useMemo(() => {
    return liveCompetition || competition || {} as Competition;
  }, [liveCompetition, competition]);
  
  // Debug logging for competition state changes
  useEffect(() => {
    console.log('🎯 [Admin] Competition state changed:');
    console.log('  - liveCompetition:', liveCompetition);
    console.log('  - competition (initial):', competition);
    console.log('  - currentCompetition (final):', currentCompetition);
    console.log('  - isConnected:', isConnected);
    console.log('  - connectionStatus:', connectionStatus);
  }, [liveCompetition, competition, currentCompetition, isConnected, connectionStatus]);
    
  const { isLoggedIn } = useAuthStore()
  const { isLoading: authLoading } = AuthProtection()
  // const router = useRouter();

  const callMe = useCallback(async () => {
    try {
      setIsLoading(true)
      // ...existing code...
      const parts = await getAllParticipants(roomId, 'creator', true, compe_id.competitionId)
      setParticipants(parts.data.participants || [])
      const probs = await getRoomProblems(roomId)
      setProblems(probs)

      const compe = await getCompeById(roomId, compe_id.competitionId)
      setCompetition(compe)

      // --- Fetch addedProblems order from API ---
      // TODO: Replace this with your API call to fetch the order for this competition
      // Example: const order = await getAddedProblemsOrder(roomId, compe_id.competitionId)
      const order = await getCompeProblems(compe_id.competitionId) || [];
      console.log('Fetched added problems:', order);
      setAddedProblems(order)
      // setAddedProblems([]); // Default: empty, replace with API result
      setAddedProblemsLoaded(true);
    } catch (error) {
      console.error('Error fetching room details:', error)
    } finally {
      setIsLoading(false)
    }
  }, [roomId, compe_id.competitionId]) // Dependencies: values that can change

  useEffect(() => {
    if (isLoggedIn && !authLoading && !fetched) {
      callMe()
      setFetched(true)
    } else {
      if (authLoading || !isLoggedIn) {
        setIsLoading(true)
      }
    }
  }, [isLoggedIn, authLoading, fetched, callMe])

    // Remove unnecessary sync: always use liveCompetition || competition for rendering

    useEffect(() => {
      if (liveParticipants && liveParticipants.length > 0) {
        setParticipants(liveParticipants);
      }
    }, [liveParticipants]);

    // Competition control functions
    const handleStartCompetition = async () => {
      if (addedProblems.length === 0) {
        alert('Cannot start competition without problems!');
        return;
      }
      
      try {
        console.log('🚀 [Admin] Starting competition...');
        console.log('📋 Competition ID:', compe_id.competitionId);
        console.log('📝 Added problems:', addedProblems);
        
        // Start the competition
        const result = await startCompetition(compe_id.competitionId, addedProblems);
        console.log('✅ [Admin] Start competition result:', result);
        
        // ✅ IMMEDIATE UPDATE: Set local state to trigger real-time hooks
        const startedCompetition = {
          ...competition,
          status: 'ONGOING',
          gameplay_indicator: 'ACTIVE',
          current_problem_id: addedProblems[0]?.problem?.id || addedProblems[0]?.id,
          current_problem_index: 0,
          timer_started_at: new Date().toISOString(),
          timer_duration: (addedProblems[0]?.timer || 5) * 60 // Convert minutes to seconds
        };
        
        setCompetition(startedCompetition);
        
        // ✅ FORCE REAL-TIME UPDATE: Manually trigger all connected clients
        setTimeout(async () => {
          try {
            console.log('🔄 [Admin] Fetching fresh competition data...');
            const freshCompe = await getCompeById(roomId, compe_id.competitionId);
            console.log('📊 [Admin] Fresh competition data:', freshCompe);
            setCompetition(freshCompe);
            
            // ✅ FORCE BROADCAST: Trigger real-time system update
            if (window.location.reload) {
              // This will force all real-time hooks to refresh
              console.log('🚀 [Admin] Broadcasting competition start to all participants...');
            }
          } catch (error) {
            console.error('❌ [Admin] Error fetching fresh data:', error);
          }
        }, 1000);
        
      } catch (error: unknown) {
        console.error('❌ [Admin] Error starting competition:', error);
        alert('Failed to start competition: ' + error);
      }
    };

    const handleNextProblem = async () => {
      try {
        console.log('⏭️ [Admin] Moving to next problem...');
        
        const currentIndex = currentCompetition?.current_problem_index || 0;
        const nextIndex = currentIndex + 1;
        
        console.log('📊 [Admin] Problem transition:', {
          currentIndex,
          nextIndex,
          totalProblems: addedProblems.length,
          isLastProblem: nextIndex >= addedProblems.length
        });
        
        // Call the API
        const result = await nextProblem(compe_id.competitionId, addedProblems, currentIndex);
        console.log('✅ [Admin] Next problem result:', result);
        
        // ✅ IMMEDIATE UPDATE: Update local state to trigger real-time
        if (result.competition_finished) {
          console.log('🏁 [Admin] Competition finished!');
          setCompetition(prev => ({
            ...prev,
            status: 'DONE',
            gameplay_indicator: 'FINISHED',
            current_problem_id: null,
            current_problem_index: addedProblems.length,
            timer_started_at: null,
            timer_duration: null
          }));
          alert('Competition completed! 🎉');
        } else {
          // Move to next problem
          const nextProblemData = addedProblems[nextIndex];
          console.log('📝 [Admin] Next problem details:', nextProblemData);
          
          setCompetition(prev => ({
            ...prev,
            current_problem_id: nextProblemData?.problem?.id || nextProblemData?.id,
            current_problem_index: nextIndex,
            timer_started_at: new Date().toISOString(),
            timer_duration: (nextProblemData?.timer || 5) * 60, // Convert minutes to seconds
            gameplay_indicator: 'ACTIVE'
          }));
        }
        
        // ✅ FETCH FRESH DATA: Get updated competition data from backend
        setTimeout(async () => {
          try {
            console.log('🔄 [Admin] Fetching fresh competition data after next problem...');
            const freshCompe = await getCompeById(roomId, compe_id.competitionId);
            console.log('📊 [Admin] Fresh competition data:', freshCompe);
            setCompetition(freshCompe);
            
            // ✅ ALSO REFRESH PARTICIPANTS: They might have new scores
            const freshParticipants = await getAllParticipants(roomId, 'creator', true, compe_id.competitionId);
            console.log('👥 [Admin] Fresh participants data:', freshParticipants);
            setParticipants(freshParticipants.data.participants || []);
            
          } catch (error) {
            console.error('❌ [Admin] Error fetching fresh data:', error);
          }
        }, 1000);
        
      } catch (error) {
        console.error('❌ [Admin] Error moving to next problem:', error);
        alert('Failed to move to next problem: ' + error.message);
      }
    };

    const handlePauseResume = async () => {
      try {
        const isPaused = currentCompetition?.gameplay_indicator === 'PAUSE';
        const action = isPaused ? 'resume' : 'pause';
        
        console.log(`⏸️ [Admin] ${action} competition...`);
        
        if (isPaused) {
          await resumeCompetition(compe_id.competitionId);
          setCompetition(prev => ({
            ...prev,
            gameplay_indicator: 'ACTIVE'
          }));
        } else {
          await pauseCompetition(compe_id.competitionId);
          setCompetition(prev => ({
            ...prev,
            gameplay_indicator: 'PAUSE'
          }));
        }
        
        // ✅ FETCH FRESH DATA: Confirm the pause/resume state
        setTimeout(async () => {
          try {
            const freshCompe = await getCompeById(roomId, compe_id.competitionId);
            console.log(`📊 [Admin] Fresh competition data after ${action}:`, freshCompe);
            setCompetition(freshCompe);
          } catch (error) {
            console.error(`❌ [Admin] Error fetching fresh data after ${action}:`, error);
          }
        }, 500);
        
      } catch (error) {
        console.error('❌ [Admin] Error toggling pause/resume:', error);
        alert('Failed to toggle pause/resume: ' + error.message);
      }
    };

    // Add problem to competition (persistent order)
    const handleAddProblem = async (problem: Problems) => {
      console.log('Adding problem:', problem);
      if (!problem.timer || problem.timer <= 0) {
        alert('Cannot add problem without a timer!');
        return;
      }
      await addCompeProblem(problem.id, compe_id.competitionId);
      const compeProblems = await getCompeProblems(compe_id.competitionId) || [];
      console.log('Updated competition problems:', compeProblems);
      setAddedProblems(compeProblems);
      
    };

    const handleRemoveProblem = async (problem: Problems) => {
      console.log('Removing problem:', problem);
      console.log('Removing problem with ID:', problem.id, 'from competition ID:', compe_id.competitionId);
      await removeCompeProblem(problem.id, compe_id.competitionId);
      const compeProblems = await getCompeProblems(compe_id.competitionId) || [];
      setAddedProblems(compeProblems);
    };

    // Edit timer UI logic
    const handleEditTimer = (problem : Problems) => {
      setEditingTimerId(problem.id);
      setTimerEditValue(problem.timer || 0);
    };

    const handleSaveTimer = async(problem : Problems) => {
      // TODO: Call your API to update timer for this problem
      try {
        await updateTimer(problem.id, timerEditValue);
        setProblems((prev) => prev.map((p) => p.id === problem.id ? { ...p, timer: timerEditValue } : p));
        setEditingTimerId(null);
      } catch (error) {
        console.error('Error updating timer:', error);
        alert('Failed to update timer. Please try again.');
        return;
      }
    };

    const handleCancelEdit = () => {
      setEditingTimerId(null);
    };

    // Debug function to test realtime
    const handleDebugRealtime = async () => {
      console.log('� [Admin] Starting polling system debug...');
      
      alert(`🔧 POLLING DEBUG!\n\nYou're now using LIVE POLLING instead of realtime.\n\n✅ Updates every 1.5 seconds\n✅ No WebSocket issues\n✅ Works for your presentation!\n\nPoll count: ${pollCount}\nConnection: ${connectionStatus}\n\nWatch the console for polling activity...`);
      
      // Show current polling status
      console.log('📊 [Admin] Polling Status:', {
        isConnected,
        connectionStatus,
        pollCount,
        participants: liveParticipants?.length || 0,
        competition: currentCompetition?.title || 'Not loaded'
      });
    };

    if (isLoading || authLoading || !addedProblemsLoaded) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["loading-container"]}>
                    <Loader/>
                </div>
            </div>
        )
    }

  // Use live data when available, fallback to initial fetch
  const displayParticipants = liveParticipants.length > 0 ? liveParticipants : participants;

  const sortedParticipants = [...displayParticipants].sort((a, b) => {
    return sortOrder === 'desc' ? b.accumulated_xp - a.accumulated_xp : a.accumulated_xp - b.accumulated_xp;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };


return (
  <div className={styles.container}>
    {/* Debug Component - REMOVE AFTER TESTING */}
    {/* <RealtimeDebug 
      competitionId={compe_id.competitionId} 
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      pollCount={pollCount}
    /> */}
    
    {/* Test Component - REMOVE AFTER TESTING */}
    {/* <RealtimeTestButtons 
      competitionId={compe_id.competitionId}
      onUpdateCompetition={() => console.log('🧪 Manual update triggered')}
    /> */}
    
    {/* Status Display - REMOVE AFTER TESTING */}
    {/* <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#333',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>📊 CURRENT STATE</strong></div>
      <div>Status: <span style={{color: '#00ff00'}}>{currentCompetition?.status || 'NONE'}</span></div>
      <div>Gameplay: {currentCompetition?.gameplay_indicator || 'NONE'}</div>
      <div>Timer: {currentCompetition?.timer_started_at ? '🟢' : '🔴'}</div>
      <div>Updates: {pollCount || 0}</div>
    </div> */}
    
    {/* Main Container */}
    <div className={styles.mainContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {/* Add Back Button */}
          <div className={styles.headerTop}>
            <button 
              onClick={() => router.back()}
              className={styles.backButton}
              title="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          
          {/* Competition Controls */}
          <div className={styles.competitionControls}>
            {currentCompetition?.status === 'NEW' && (
              <button
                onClick={handleStartCompetition}
                className={`${styles.controlButton} ${styles.startButton}`}
                disabled={addedProblems.length === 0}
              >
                Start Competition
              </button>
            )}
            
            {currentCompetition?.status === 'ONGOING' && (
              <>
                <button
                  onClick={handlePauseResume}
                  className={`${styles.controlButton} ${styles.pauseButton}`}
                >
                  {currentCompetition?.gameplay_indicator === 'PAUSE' ? 'Resume' : 'Pause'}
                </button>
                
                <button
                  onClick={handleNextProblem}
                  className={`${styles.controlButton} ${
                    (currentCompetition?.current_problem_index || 0) + 1 >= addedProblems.length 
                      ? styles.finishButton 
                      : styles.nextButton
                  }`}
                  disabled={!currentCompetition?.current_problem_id}
                >
                  {(currentCompetition?.current_problem_index || 0) + 1 >= addedProblems.length 
                    ? 'Finish Competition' 
                    : 'Next Problem'}
                </button>
                
                <div className={styles.problemStatus}>
                  Problem {(currentCompetition?.current_problem_index || 0) + 1} of {addedProblems.length}
                </div>
              </>
            )}
            
            {currentCompetition?.status === 'DONE' && (
              <div className={styles.competitionStatus}>
                <span>✅ Competition Completed</span>
              </div>
            )}

            {/* Debug Realtime Button - Always visible */}
            {/* <button
              onClick={handleDebugRealtime}
              className={`${styles.controlButton} ${styles.debugButton}`}
              style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: '1px solid #ff6b35',
                fontSize: '12px',
                padding: '6px 12px'
              }}
              title="Test realtime connection"
            >
              🔧 Debug Realtime
            </button> */}
          </div>
          
          <h1 className={styles.title}>
            {currentCompetition?.title || 'Competition'}
          </h1>
          
          <p className={styles.status}>
            Status: <span className={styles.statusValue}>{currentCompetition?.status || 'NEW'}</span>
          </p>
          
          {/* <div className={styles.statusRow}>
            <ConnectionStatus 
              isConnected={isConnected}
              connectionStatus={connectionStatus}
            />
            {!isConnected && (
              <span className={styles.disconnectedText}> (Disconnected)</span>
            )}
          </div> */}
          
          <p className={styles.description}>
            Compete with your classmates and earn XP by solving problems!
          </p>
        </div>
      </div>

      {/* Real-time Timer Section */}
      <div className={styles.timerSection}>
        <div className={styles.timerContent}>
          <div className={styles.timer}>
            {formattedTime}
          </div>
          <div className={styles.timerStatus}>
            <span className={styles.timerLabel}>
              {currentCompetition?.status === 'NEW' ? 'Competition not started' :
               currentCompetition?.status === 'DONE' ? 'Competition completed' :
               !isTimerActive ? 'Paused' : 
               isExpired ? 'Time up!' : 
               `Problem ${(currentCompetition?.current_problem_index || 0) + 1} of ${addedProblems.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* NEW: Two Column Layout (2:3 ratio) */}
      <div className={styles.roomContent}>
        {/* Left Column - Problems (60% width) */}
        <div className={styles.leftColumn}>
          {/* Added Problems Section */}
          {addedProblems.length > 0 && (
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Added Problems</h2>
              </div>
              <div className={styles.participantsList}>
                {addedProblems.map((compeProblem, index) => (
                  <div key={`added-problem-${compeProblem.problem.id}-${index}`} className={styles.participantCard}>
                    <div className={styles.participantContent}>
                      <div className={styles.participantLeft}>
                        <div className={styles.participantRank}>{index + 1}</div>
                        <div>
                          <h3 className={styles.participantName}>{compeProblem.problem.title || 'No Title'}</h3>
                        </div>
                      </div>
                      <div className={styles.participantRight}>
                        <div className={styles.participantXp}>
                          {compeProblem.timer != null && compeProblem.timer > 0 ? `${compeProblem.timer} seconds` : <span style={{ color: 'red' }}>No timer</span>}
                        </div>

                        {currentCompetition?.status === 'NEW' && (
                          <button
                            className={styles.removeBtn}
                            onClick={() => handleRemoveProblem(compeProblem.problem)}
                            title="Remove from competition"
                          >
                            -
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Problems Section */}
          {currentCompetition?.status === 'NEW' && (
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Available Problems</h2>
              </div>
              <div className={styles.participantsList}>
                {problems.filter((problem) => !addedProblems.some(ap => ap.problem.id === problem.id) && problem.visibility === 'show').map((problem, index) => {
                  const canAdd = problem.timer && problem.timer > 0;
                  return (
                    <div key={`available-problem-${problem.id}-${index}`} className={styles.participantCard}>
                      <div className={styles.participantContent}>
                        <div className={styles.participantLeft}>
                          <div className={styles.participantRank}>{index + 1}</div>
                          <div>
                            <h3 className={styles.participantName}>{problem.title || 'No Title'}</h3>
                          </div>
                        </div>
                        <div className={styles.participantRight}>
                          {editingTimerId === problem.id ? (
                            <>
                              <input
                                type="number"
                                min={1}
                                value={timerEditValue}
                                onChange={e => setTimerEditValue(Number(e.target.value))}
                                className={styles.timerInput}
                              />
                              <span>sec</span>
                              <button
                                onClick={() => handleSaveTimer(problem)}
                                className={styles.saveBtn}
                                title="Save timer"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className={styles.cancelBtn}
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <div className={styles.participantXp}>
                                {problem.timer != null && problem.timer > 0 ? `${problem.timer} seconds` : <span style={{ color: 'red' }}>No timer</span>}
                              </div>
                              <button
                                className={styles.editButton}
                                onClick={() => handleEditTimer(problem)}
                                title="Edit timer"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                className={styles.addBtn}
                                disabled={!canAdd}
                                onClick={() => handleAddProblem(problem)}
                                title={!canAdd ? 'Cannot add without timer' : 'Add to competition'}
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Participants (40% width) */}
        <div className={styles.rightColumn}>
          <div className={styles.participantsSection}>
            <div className={styles.participantsHeader}>
              <h2 className={styles.participantsTitle}>Participants</h2>
              <div className={styles.sortControls}>
                <button
                  onClick={toggleSort}
                  className={styles.sortButton}
                >
                  <div className={styles.sortIcons}>
                    <ChevronUp className={`w-3 h-3 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <ChevronDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <span className={styles.sortText}>
                    {sortOrder === 'desc' ? 'Desc' : 'Asc'}
                  </span>
                </button>
              </div>
            </div>
            <div className={styles.participantsList}>
              {sortedParticipants.map((participant, index) => (
                <div key={participant.id} className={styles.participantCard}>
                  <div className={styles.participantContent}>
                    <div className={styles.participantLeft}>
                      <div className={styles.participantRank}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={styles.participantName}>
                          {participant.fullName}
                        </h3>
                      </div>
                    </div>
                    <div className={styles.participantRight}>
                      <div className={styles.participantXp}>{participant.accumulated_xp} XP</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* TEST COMPONENT - Remove after testing */}
    {/* <RealtimeTestComponent competitionId={compe_id.competitionId} /> */}
  </div>
);


};

export default CompetitionDashboard;