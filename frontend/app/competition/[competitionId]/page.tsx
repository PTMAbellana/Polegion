"use client";

import React, { use, useEffect, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Edit3, Pause, Play } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMyApp } from '@/context/AppUtils';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { addCompeProblem, getCompeProblems, getRoomProblems, removeCompeProblem, updateTimer } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getCompeById } from '@/api/competitions';
import { set } from 'react-hook-form';

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
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState(0); // in seconds
  const [fetched, setFetched] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true)
  
  const [ participants, setParticipants ] = useState<Participant[]>([])
  const [problems, setProblems] = useState<Problems[]>([])
  // Persistent addedProblems order (fetched from API)
  const [addedProblems, setAddedProblems] = useState<CompeProblems[]>([]); // store problem ids added to competition
  // Track if addedProblems have been loaded from API
  const [addedProblemsLoaded, setAddedProblemsLoaded] = useState(false);
  const [editingTimerId, setEditingTimerId] = useState<string | null>(null);
  const [timerEditValue, setTimerEditValue] = useState<number>(0);
  const [ competition, setCompetition ] = useState<Competition | undefined>(undefined)
  
  const { isLoggedIn } = useMyApp()
  const { isLoading: authLoading } = AuthProtection()
  // const router = useRouter();

  useEffect(() => {
      if (isLoggedIn && !authLoading && !fetched) {
          callMe()
          setFetched(true)
      } else {
          if (authLoading || !isLoggedIn) {
              setIsLoading(true)
          }
      }
  }, [isLoggedIn, authLoading, fetched])

    const callMe = async () => {
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
            setAddedProblems(order || [])
            // setAddedProblems([]); // Default: empty, replace with API result
            setAddedProblemsLoaded(true);
        } catch (error) {
            console.error('Error fetching room details:', error)
        } finally {
            setIsLoading(false)
        }
    }
    // Calculate total timer (in seconds/minutes) for added problems
    // Use the timer from CompeProblems level, not from the nested problem
    const totalTimerSeconds = addedProblems.reduce((acc, ap) => acc + (ap.timer || 0), 0);
    
    // Timer logic
    useEffect(() => {
      setTimer(totalTimerSeconds);
    }, [totalTimerSeconds]);

    useEffect(() => {
      if (!isPaused && timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [isPaused, timer]);


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

    if (isLoading || authLoading || !addedProblemsLoaded) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["loading-container"]}>
                    <Loader/>
                </div>
            </div>
        )
    }

  const sortedParticipants = [...participants].sort((a, b) => {
    return sortOrder === 'desc' ? b.accumulated_xp - a.accumulated_xp : a.accumulated_xp - b.accumulated_xp;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className={styles.container}>
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
            
            <h1 className={styles.title}>
              {competition?.title || 'Competition'}
            </h1>
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>{competition?.status}</span>
            </p>
            <p className={styles.description}>
              Compete with your classmates and earn XP by solving problems!
            </p>
          </div>
        </div>

        {/* Timer Section */}
        <div className={styles.timerSection}>
          <div className={styles.timerContent}>
            <div className={styles.timer}>
              {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
            </div>
            <div className={styles.timerControls}>
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className={styles.timerButton}
                disabled={totalTimerSeconds === 0}
                title={totalTimerSeconds === 0 ? 'Add problems with timers to start' : isPaused ? 'Start' : 'Pause'}
              >
                {isPaused ? (
                  <Play className="w-8 h-8 text-gray-700" />
                ) : (
                  <Pause className="w-8 h-8 text-gray-700" />
                )}
              </button>
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
                    <div key={compeProblem.problem.id} className={styles.participantCard}>
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
                          <button
                            className={styles.removeBtn}
                            onClick={() => handleRemoveProblem(compeProblem.problem)}
                            title="Remove from competition"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Problems Section */}
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Available Problems</h2>
              </div>
              <div className={styles.participantsList}>
                {problems.filter((problem) => !addedProblems.some(ap => ap.problem.id === problem.id) && problem.visibility === 'show').map((problem, index) => {
                  const canAdd = problem.timer && problem.timer > 0;
                  return (
                    <div key={problem.id} className={styles.participantCard}>
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
      
    </div>
  );
};

export default CompetitionDashboard;