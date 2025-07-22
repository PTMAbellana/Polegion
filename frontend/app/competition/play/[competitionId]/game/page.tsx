"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Gamepage from '@/components/Gamepage';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import { getCompeById } from '@/api/competitions';
import Loader from '@/components/Loader';
import styles from '@/styles/game.module.css';

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

const CompetitionGamePage = ({ params }: { params: Promise<{ competitionId: string }> }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  
  // ✅ Handle the Promise params properly
  const [competitionId, setCompetitionId] = useState<string | null>(null);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Resolve params Promise
  useEffect(() => {
    params.then(resolvedParams => {
      setCompetitionId(resolvedParams.competitionId);
    });
  }, [params]);

  // Real-time competition state - only initialize when competitionId is available
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    isConnected,
    connectionStatus,
  } = useCompetitionRealtime(competitionId ? Number(competitionId) : null, isLoading);
  
  // Use live competition data when available
  const currentCompetition: Competition = liveCompetition || competition || {} as Competition;

  // Competition timer hook
  const {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired
  } = useCompetitionTimer(competitionId ? Number(competitionId) : null, currentCompetition);

  // Fetch initial competition data
  // useEffect(() => {
  //   const fetchCompetition = async () => {
  //     if (!competitionId || !roomId) return;
      
  //     try {
  //       setIsLoading(true);
  //       const compe = await getCompeById(roomId, Number(competitionId), 'user');
  //       setCompetition(compe);
  //     } catch (error) {
  //       console.error('Error fetching competition:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (competitionId && roomId) {
  //     fetchCompetition();
  //   }
  // }, [competitionId, roomId]);

  // ✅ Only redirect when competition ends (remove infinite loop)
  useEffect(() => {
    if (competitionId && currentCompetition?.status === 'DONE') {
      console.log('🏁 Competition finished, redirecting to results...');
      setTimeout(() => {
        router.push(`/competition/play/${competitionId}?room=${roomId}&completed=true`);
      }, 2000); // 2 second delay to show final state
    }
  }, [currentCompetition?.status, competitionId, roomId, router]);

  // Show loading while fetching data
  // if (isLoading || !competitionId) {
  //   return (
  //     <div className={styles.loadingContainer}>
  //       <Loader />
  //       <div className={styles.loadingText}>Loading game interface...</div>
  //     </div>
  //   );
  // }

  // Show error if no room ID
  if (!roomId) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Invalid Room</h2>
          <p>No room ID provided. Please check your URL.</p>
          <button onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      {/* ✅ Pass resolved values instead of Promises */}
      <Gamepage 
        roomCode={roomId}
        competitionId={Number(competitionId)}
        currentCompetition={currentCompetition}
        roomId={roomId}
        isFullScreenMode={true}
      />
      
      {/* Game overlay info */}
      <div className={styles.gameOverlay}>
        <div className={styles.gameInfo}>
          <div className={styles.competitionTitle}>
            {currentCompetition?.title}
          </div>
          <div className={styles.problemNumber}>
            Problem {(currentCompetition?.current_problem_index || 0) + 1}
          </div>
        </div>
        
        <div className={styles.connectionStatus}>
          <div className={`${styles.connectionDot} ${isConnected ? styles.connected : styles.disconnected}`}></div>
          <span className={styles.connectionText}>
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </span>
        </div>
      </div>

      {/* ✅ PAUSE OVERLAY - Show instead of redirecting */}
      {currentCompetition?.gameplay_indicator === 'PAUSE' && (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseContent}>
            <div className={styles.pauseIcon}>⏸️</div>
            <h2>Competition Paused</h2>
            <p>Please wait for the instructor to resume the competition.</p>
            <div className={styles.pausedTimer}>
              Timer: {formattedTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionGamePage;