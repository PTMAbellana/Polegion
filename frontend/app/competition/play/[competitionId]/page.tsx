"use client";

import React, { use, useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMyApp } from '@/context/AppUtils';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { getRoomProblems } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getCompeById } from '@/api/competitions';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import { ConnectionStatus } from '@/components/ConnectionStatus';

// Interfaces
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
  gameplay_indicator?: string;
  current_problem_id?: number;
  current_problem_index?: number;
  timer_started_at?: string;
  timer_duration?: number;
  timer_end_at?: string;
  time_remaining?: number;
}

const CompetitionDashboard = ({ params } : { params  : Promise<{competitionId : number }> }) => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const compe_id = use(params)
  const router = useRouter();

  // ✅ ONLY Competition states - removed all create-problem states
  const [sortOrder, setSortOrder] = useState('desc');
  const [fetched, setFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [problems, setProblems] = useState<Problems[]>([])
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined)

  // Real-time competition state for students
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    isConnected,
    connectionStatus,
    setParticipants: setLiveParticipants,
    pollCount
  } = useCompetitionRealtime(compe_id.competitionId, isLoading);
  
  // Use live competition data when available, fallback to initial API state
  const currentCompetition: Competition = liveCompetition || competition || {} as Competition;

  const { isLoggedIn } = useMyApp()
  const { isLoading: authLoading } = AuthProtection()

  const callMe = useCallback( async () => {
    try {
        setIsLoading(true)
        const parts = await getAllParticipants(roomId, 'user', true, compe_id.competitionId)
        console.log("Participants data: ", parts)
        setParticipants(parts.data.participants || [])
        
        const probs = await getRoomProblems(roomId)
        setProblems(probs)

        const compe = await getCompeById(roomId, compe_id.competitionId, 'user')
        console.log("Competition data: ", compe)
        setCompetition(compe)

        setActiveProblems([]);
    } catch (error) {
        console.error('Error fetching competition details:', error)
    } finally {
        setIsLoading(false)
    }
  }, [roomId, compe_id.competitionId])
  
  // Competition logic
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

  // Sync real-time participants data
  useEffect(() => {
    if (liveParticipants && liveParticipants.length > 0) {
      console.log('👥 [STUDENT] Syncing participants data:', liveParticipants);
      setParticipants(liveParticipants);
    }
  }, [liveParticipants]);

  // ✅ Competition timer hook
  const {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired
  } = useCompetitionTimer(compe_id.competitionId, liveCompetition || competition);

  // 🚀 REDIRECT to game page when competition starts
  useEffect(() => {
    if (currentCompetition?.status === 'ONGOING' && isTimerActive) {
      const gameUrl = `/competition/play/${compe_id.competitionId}/game?room=${roomId}`;
      router.push(gameUrl);
    }
  }, [currentCompetition?.status, isTimerActive, compe_id.competitionId, roomId, router]);

  // Handle non-active states with simple conditional rendering
  const renderDashboardState = () => {
    if (currentCompetition?.status === 'NEW') {
      return (
        <div className={styles.waitingSection}>
          <div className={styles.waitingContent}>
            <div className={styles.waitingIcon}>⏳</div>
            <h2 className={styles.waitingTitle}>Competition Not Started</h2>
            <p className={styles.waitingDescription}>
              The competition has not started yet. Please wait for the host to begin.
            </p>
            <div className={styles.waitingInfo}>
              <div className={styles.waitingCompetitionTitle}>
                {currentCompetition?.title || 'Competition'}
              </div>
              <div className={styles.waitingStatus}>
                Status: {currentCompetition?.status}
              </div>
              <div className={styles.waitingParticipants}>
                {sortedParticipants.length} participant{sortedParticipants.length !== 1 ? 's' : ''} joined
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentCompetition?.status === 'DONE') {
      return (
        <div className={styles.completedSection}>
          <div className={styles.completedContent}>
            <div className={styles.completedIcon}>🎉</div>
            <h2 className={styles.completedTitle}>Competition Completed!</h2>
            <p className={styles.completedDescription}>
              This competition has been completed. Check the final results below!
            </p>
            
            {/* Final Leaderboard */}
            <div className={styles.finalLeaderboard}>
              <h3>Final Results</h3>
              <div className={styles.leaderboardList}>
                {sortedParticipants.slice(0, 10).map((participant, index) => (
                  <div key={participant.id} className={styles.leaderboardItem}>
                    <span className={styles.rank}>#{index + 1}</span>
                    <span className={styles.name}>
                      {participant.fullName || 'Unknown'}
                    </span>
                    <span className={styles.xp}>{participant.accumulated_xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentCompetition?.gameplay_indicator === 'PAUSE') {
      return (
        <div className={styles.pausedSection}>
          <div className={styles.pausedContent}>
            <div className={styles.pausedIcon}>⏸️</div>
            <h2 className={styles.pausedTitle}>Competition Paused</h2>
            <p className={styles.pausedDescription}>
              The competition is currently paused. Please wait for the host to resume.
            </p>
            
            {/* Show timer in paused state */}
            <div className={styles.pausedTimer}>
              <div className={styles.timerDisplay}>
                <div className={styles.timerLabel}>Timer</div>
                <div className={styles.timerValue}>{formattedTime}</div>
                <div className={styles.timerStatus}>⏸️ Paused</div>
              </div>
            </div>
            
            {/* Current leaderboard during pause */}
            <div className={styles.pausedLeaderboard}>
              <h3>Current Standings</h3>
              <div className={styles.miniLeaderboardList}>
                {sortedParticipants.slice(0, 5).map((participant, index) => (
                  <div key={participant.id} className={styles.miniLeaderboardItem}>
                    <span className={styles.miniRank}>#{index + 1}</span>
                    <span className={styles.miniName}>
                      {participant.fullName?.split(' ')[0] || 'Unknown'}
                    </span>
                    <span className={styles.miniXp}>{participant.accumulated_xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Default state (loading or other)
    return (
      <div className={styles.defaultSection}>
        <div className={styles.defaultContent}>
          <div className={styles.defaultIcon}>📊</div>
          <h2 className={styles.defaultTitle}>Competition Dashboard</h2>
          <p className={styles.defaultDescription}>
            Preparing competition interface...
          </p>
          
          {/* Show basic info */}
          <div className={styles.competitionInfo}>
            <div className={styles.competitionTitle}>
              {currentCompetition?.title || 'Loading...'}
            </div>
            <div className={styles.competitionStatus}>
              Status: {currentCompetition?.status || 'Loading...'}
            </div>
            <ConnectionStatus 
              isConnected={isConnected} 
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || authLoading) {
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
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {currentCompetition?.title || 'Competition'}
          </h1>
          <div className={styles.statusRow}>
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>{currentCompetition?.status}</span>
            </p>
            <ConnectionStatus 
              isConnected={isConnected} 
              connectionStatus={connectionStatus}
              className="ml-4"
            />
          </div>
        </div>
      </div>

      {/* Timer Section */}
      <div className={styles.timerSection}>
        <div className={styles.timerContent}>
          <div className={styles.timer}>
            {formattedTime}
          </div>
          <div className={styles.timerStatus}>
            <span className={styles.timerLabel}>
              {currentCompetition?.status === 'NEW' ? 'Competition not started' :
               currentCompetition?.status === 'DONE' ? 'Competition completed' :
               !isTimerActive ? 'Competition Paused' :
               isExpired ? 'Time up!' : 
               `Problem ${(currentCompetition?.current_problem_index || 0) + 1} active`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Conditional Dashboard States */}
      {renderDashboardState()}

      {/* Leaderboard Section */}
      <div className={styles.leaderboardSection}>
        <div className={styles.leaderboardHeader}>
          <h2 className={styles.leaderboardTitle}>🏆 Leaderboard</h2>
          <button 
            className={styles.sortButton} 
            onClick={toggleSort}
            title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'desc' ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
        
        <div className={styles.leaderboardContent}>
          {sortedParticipants.length > 0 ? (
            <div className={styles.participantsList}>
              {sortedParticipants.map((participant, index) => (
                <div key={participant.id} className={styles.participantItem}>
                  <div className={styles.participantRank}>
                    #{index + 1}
                  </div>
                  <div className={styles.participantInfo}>
                    <div className={styles.participantName}>
                      {participant.fullName || 'Unknown Participant'}
                    </div>
                    <div className={styles.participantXp}>
                      {participant.accumulated_xp} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noParticipants}>
              <div className={styles.noParticipantsIcon}>👥</div>
              <div className={styles.noParticipantsText}>No participants yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionDashboard;