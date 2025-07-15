"use client";

import React, { use, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

  const [sortOrder, setSortOrder] = useState('desc');
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState(0); // in seconds
  const [fetched, setFetched] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true)
  
  const [ participants, setParticipants ] = useState<Participant[]>([])
  const [problems, setProblems] = useState<Problems[]>([])
  // Active problems in competition (read-only)
  const [activeProblems, setActiveProblems] = useState<string[]>([]); // store problem ids in competition
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
            // Fetch participants for this competition
            const parts = await getAllParticipants(roomId, 'creator', true, compe_id.competitionId)
            setParticipants(parts.data.participants || [])
            
            // Fetch all room problems
            const probs = await getRoomProblems(roomId)
            setProblems(probs)

            // Fetch competition details
            const compe = await getCompeById(roomId, compe_id.competitionId)
            setCompetition(compe)

            // Fetch active problems for this competition (read-only)
            // TODO: Replace with API call to get problems added to this competition
            // const activeProbs = await getCompetitionProblems(roomId, compe_id.competitionId)
            setActiveProblems([]); // Default: empty, replace with API result
        } catch (error) {
            console.error('Error fetching competition details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Get active problems list (read-only)
    const activeProblemsList = problems.filter((p) => activeProblems.includes(p.id));
    const totalTimerSeconds = activeProblemsList.reduce((acc, p) => acc + (p.timer || 0), 0);
    
    // Timer logic (read-only, controlled by room creator)
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

    if (isLoading || authLoading) {
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

        {/* Timer Section - Read Only */}
        <div className={styles.timerSection}>
          <div className={styles.timerContent}>
            <div className={styles.timer}>
              {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
            </div>
            <div className={styles.timerStatus}>
              <span className={styles.timerLabel}>
                {timer === 0 ? 'No active problems' : isPaused ? 'Competition Paused' : 'Competition Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={styles.roomContent}>
          {/* Left Column - Competition Problems */}
          <div className={styles.leftColumn}>
            {/* Active Problems Section */}
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Competition Problems</h2>
              </div>
              <div className={styles.participantsList}>
                {activeProblemsList.length > 0 ? (
                  activeProblemsList.map((problem, index) => (
                    <div key={problem.id} className={styles.participantCard}>
                      <div className={styles.participantContent}>
                        <div className={styles.participantLeft}>
                          <div className={styles.participantRank}>{index + 1}</div>
                          <div>
                            <h3 className={styles.participantName}>{problem.title || 'No Title'}</h3>
                            <div className={styles.problemMeta}>
                              <span className={styles.problemDifficulty} data-difficulty={problem.difficulty}>
                                {problem.difficulty}
                              </span>
                              <span className={styles.problemXp}>{problem.expected_xp} XP</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.participantRight}>
                          <div className={styles.participantXp}>
                            {problem.timer != null && problem.timer > 0 ? `${problem.timer}s` : 'No timer'}
                          </div>
                          <button 
                            className={styles.solveButton}
                            onClick={() => {
                              // TODO: Navigate to problem solving page
                              console.log('Solve problem:', problem.id)
                            }}
                          >
                            Solve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <p>No problems added yet</p>
                    <span>Wait for the room creator to add problems to start competing!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
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
                {sortedParticipants.length > 0 ? (
                  sortedParticipants.map((participant, index) => (
                    <div key={participant.id} className={styles.participantCard}>
                      <div className={styles.participantContent}>
                        <div className={styles.participantLeft}>
                          <div className={`${styles.participantRank} ${index < 3 ? styles[`rank${index + 1}`] : ''}`}>
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
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👥</div>
                    <p>No participants yet</p>
                    <span>Participants will appear here once they join</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDashboard;