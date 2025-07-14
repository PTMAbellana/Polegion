"use client";

import React, { use, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Pause, Play } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { myAppHook } from '@/context/AppUtils';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { getRoomProblems } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getCompeById } from '@/api/competitions';

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
    expected_xp: number
    timer: number | null
}

interface Competition {
  title: string;
  status: string;
}

const CompetitionDashboard = ({ params } : { params  : Promise<{competitionId : number }> }) => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const compe_id = use(params)

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
  const [addedProblems, setAddedProblems] = useState<string[]>([]); // store problem ids added to competition
  // Track if addedProblems have been loaded from API
  const [addedProblemsLoaded, setAddedProblemsLoaded] = useState(false);
  const [editingTimerId, setEditingTimerId] = useState<string | null>(null);
  const [timerEditValue, setTimerEditValue] = useState<number>(0);
  const [ competition, setCompetition ] = useState<Competition | undefined>(undefined)
  
  const { isLoggedIn } = myAppHook()
  const { isLoading: authLoading } = AuthProtection()
  const router = useRouter();

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
            // setAddedProblems(order || [])
            setAddedProblems([]); // Default: empty, replace with API result
            setAddedProblemsLoaded(true);
        } catch (error) {
            console.error('Error fetching room details:', error)
        } finally {
            setIsLoading(false)
        }
    }
    // Calculate total timer (in seconds/minutes) for added problems
    const addedProblemsList = problems.filter((p) => addedProblems.includes(p.id));
    const totalTimerSeconds = addedProblemsList.reduce((acc, p) => acc + (p.timer || 0), 0);
    
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
    const handleAddProblem = async (problem) => {
      if (!problem.timer || problem.timer <= 0) {
        alert('Cannot add problem without a timer!');
        return;
      }
      setAddedProblems((prev) => {
        const updated = [...prev, problem.id];
        // --- Update order in backend ---
        // TODO: Call your API to persist the new order
        // await updateAddedProblemsOrder(roomId, compe_id.competitionId, updated)
        return updated;
      });
    };

    // Remove problem from competition (persistent order)
    const handleRemoveProblem = async (problem) => {
      setAddedProblems((prev) => {
        const updated = prev.filter((id) => id !== problem.id);
        // --- Update order in backend ---
        // TODO: Call your API to persist the new order
        // await updateAddedProblemsOrder(roomId, compe_id.competitionId, updated)
        return updated;
      });
    };

    // Edit timer UI logic
    const handleEditTimer = (problem) => {
      setEditingTimerId(problem.id);
      setTimerEditValue(problem.timer || 0);
    };

    const handleSaveTimer = (problem) => {
      // TODO: Call your API to update timer for this problem
      setProblems((prev) => prev.map((p) => p.id === problem.id ? { ...p, timer: timerEditValue } : p));
      setEditingTimerId(null);
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

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className={styles.container}>
      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              {competition?.title || 'Competition Dashboard'}
            </h1>
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>{competition?.status}</span>
            </p>
            <p className={styles.description}>
              You can see the progress of the students and how much XP they have garnered already.
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
        {/* Added Problems Section */}
        {addedProblemsList.length > 0 && (
          <div className={styles.participantsSection}>
            <div className={styles.participantsHeader}>
              <h2 className={styles.participantsTitle}>Added Problems</h2>
            </div>
            <div className={styles.participantsList}>
              {addedProblemsList.map((problem, index) => (
                <div key={problem.id} className={styles.participantCard}>
                  <div className={styles.participantContent}>
                    <div className={styles.participantLeft}>
                      <div className={styles.participantRank}>{index + 1}</div>
                      <div>
                        <h3 className={styles.participantName}>{problem.title || 'No Title'}</h3>
                      </div>
                    </div>
                    <div className={styles.participantRight}>
                      <div className={styles.participantXp}>
                        {problem.timer != null && problem.timer > 0 ? `${problem.timer} seconds` : <span style={{ color: 'red' }}>No timer</span>}
                      </div>
                      <button
                        style={{
                          marginLeft: 8,
                          background: '#c0392b',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '4px 12px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                        onClick={() => handleRemoveProblem(problem)}
                        title="Remove from competition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problems Section */}
        <div className={styles.participantsSection}>
          <div className={styles.participantsHeader}>
            <h2 className={styles.participantsTitle}>
              Problems:
            </h2>
          </div>

          {/* Problems List */}
          <div className={styles.participantsList}>
            {problems.filter((problem) => !addedProblems.includes(problem.id)).map((problem, index) => {
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
                      {/* Timer display or edit */}
                      {editingTimerId === problem.id ? (
                        <>
                          <input
                            type="number"
                            min={1}
                            value={timerEditValue}
                            onChange={e => setTimerEditValue(Number(e.target.value))}
                            style={{ width: 80, marginRight: 8 }}
                          />
                          <span>seconds</span>
                          <button onClick={() => handleSaveTimer(problem)} style={{ marginLeft: 8 }}>Save</button>
                          <button onClick={handleCancelEdit} style={{ marginLeft: 4 }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <div className={styles.participantXp}>
                            {problem.timer != null && problem.timer > 0 ? `${problem.timer} seconds` : <span style={{ color: 'red' }}>No timer</span>}
                          </div>
                          <button className={styles.editButton} onClick={() => handleEditTimer(problem)} title="Edit timer">
                            <Edit3 className="w-5 h-5 text-gray-600" />
                          </button>
                        </>
                      )}
                      {/* Add button */}
                      <button
                        style={{
                          marginLeft: 8,
                          background: canAdd ? '#2d7a2d' : '#ccc',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '4px 12px',
                          cursor: !canAdd ? 'not-allowed' : 'pointer',
                          fontWeight: 600
                        }}
                        disabled={!canAdd}
                        onClick={() => handleAddProblem(problem)}
                        title={!canAdd ? 'Cannot add without timer' : 'Add to competition'}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Participants Section */}
        <div className={styles.participantsSection}>
          <div className={styles.participantsHeader}>
            <h2 className={styles.participantsTitle}>
              Participants:
            </h2>
            
            {/* Sort Control */}
            <div className={styles.sortControls}>
              <button
                onClick={toggleSort}
                className={styles.sortButton}
              >
                <div className={styles.sortIcons}>
                  <ChevronUp className={`w-4 h-4 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <ChevronDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <span className={styles.sortText}>
                  {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                </span>
              </button>
            </div>
          </div>

          {/* Participants List */}
          <div className={styles.participantsList}>
            {sortedParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={styles.participantCard}
              >
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
                    <div className={styles.participantXp}>
                      {participant.accumulated_xp} XP
                    </div>
                    {/* <button className={styles.editButton}>
                      <Edit3 className="w-5 h-5 text-gray-600" />
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Action Buttons */}
        {/* <div className={styles.actionSection}>
          <button className={styles.observeButton}>
            <Eye className="w-5 h-5" />
            <span>Observe</span>
          </button>
        </div> */}
      </div>
      
    </div>
  );
};

export default CompetitionDashboard;