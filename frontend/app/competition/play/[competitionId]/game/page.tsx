"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Gamepage from '@/components/Gamepage';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import styles from '@/styles/game.module.css';

interface Competition {
  title: string;
  status: string;
  gameplay_indicator?: string;
  current_problem_id?: number;
  current_problem_index?: number;
  timer_started_at?: string;
  timer_duration?: number;
}

const CompetitionGamePage = ({ params }: { params: Promise<{ competitionId: string }> }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  
  const [competitionId, setCompetitionId] = useState<string | null>(null);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Resolve params Promise
  useEffect(() => {
    params.then(resolvedParams => {
      setCompetitionId(resolvedParams.competitionId);
      setIsLoading(false);
    });
  }, [params]);

  // Real-time competition state
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    isConnected,
    connectionStatus,
  } = useCompetitionRealtime(competitionId ? Number(competitionId) : null, !competitionId);
  
  const currentCompetition: Competition = liveCompetition || competition || {} as Competition;

  // Competition timer hook
  const {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired
  } = useCompetitionTimer(competitionId ? Number(competitionId) : null, currentCompetition);

  // ✅ FIXED: Get room code from room ID using proper API endpoint
  const getRoomCodeFromId = async (roomId: string) => {
    try {
      console.log('🔍 Fetching room code for room ID:', roomId);
      
      // ✅ FIXED: Use correct backend endpoint
      const response = await fetch(`/api/virtual-rooms/id/${roomId}`);
      
      if (response.ok) {
        const roomData = await response.json();
        console.log('📋 Room data received:', roomData);
        
        // Extract the room code from the API response
        const roomCode = roomData.code;
        
        if (roomCode && roomCode !== roomId) {
          console.log('✅ Found room code:', roomCode);
          return roomCode;
        } else {
          console.warn('⚠️ No valid room code found:', roomData);
        }
      } else {
        console.warn(`❌ API returned status:`, response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching room data:', error);
    }
    
    return null;
  };

  // ✅ FIXED: Update the handleReturnToRoom function to use join format
  const handleReturnToRoom = async () => {
    console.log('🏠 Starting return to room process...');
    
    if (roomId) {
      try {
        const roomCode = await getRoomCodeFromId(roomId);
        
        if (roomCode) {
          const targetUrl = `/virtual-rooms/join/${roomCode}`;
          console.log('🚀 Navigating to:', targetUrl);
          router.push(targetUrl);
          return;
        }
      } catch (error) {
        console.error('❌ Error getting room code:', error);
      }
      
      // Fallback
      console.warn('⚠️ Using fallback navigation');
      router.push(`/virtual-rooms/join/${roomId}`);
    } else {
      router.push('/virtual-rooms');
    }
  };

  // Competition completion redirect
  useEffect(() => {
    // ✅ Add more specific conditions to prevent looping
    if (competitionId && 
        currentCompetition?.status === 'DONE' && 
        !redirecting && 
        !isLoading) { // Add isLoading check
    
      console.log('🏁 Competition finished! Redirecting participants...');
      console.log('Current status:', currentCompetition.status);
      console.log('Competition ID:', competitionId);
      console.log('Room ID:', roomId);
      
      setRedirecting(true);
      
      // ✅ Add a small delay to prevent rapid redirects
      setTimeout(() => {
        router.push(`/competition/play/${competitionId}?room=${roomId}`);
      }, 1000); // 1 second delay
    }
  }, [currentCompetition?.status, competitionId, roomId, router, redirecting, isLoading]); // Add isLoading to dependencies

  // ✅ Add cleanup effect to reset redirecting state if needed
  useEffect(() => {
    // Reset redirecting state if competition status changes back to active
    if (currentCompetition?.status && 
        currentCompetition.status !== 'DONE' && 
        redirecting) {
      console.log('Competition status changed, resetting redirect state');
      setRedirecting(false);
    }
  }, [currentCompetition?.status, redirecting]);

  // Show error if no room ID
  if (!roomId) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Invalid Room</h2>
          <p>No room ID provided. Please check your URL.</p>
          <div className={styles.errorActions}>
            <button onClick={() => router.back()}>Go Back</button>
            <button onClick={() => router.push('/virtual-rooms')}>Browse Rooms</button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while resolving params
  if (isLoading || !competitionId) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>Loading competition...</p>
        </div>
      </div>
    );
  }

  // Show completion overlay
  if (redirecting || currentCompetition?.status === 'DONE') {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.completionOverlay}>
          <div className={styles.completionContent}>
            <div className={styles.completionIcon}>🏆</div>
            <h1>Competition Completed!</h1>
            <p>Thank you for participating in the competition.</p>
            
            <div className={styles.completionDetails}>
              <div className={styles.competitionTitle}>
                {currentCompetition?.title || 'Competition'}
              </div>
              <div className={styles.completionTime}>
                Final Time: {formattedTime}
              </div>
            </div>
            
            <div className={styles.redirectMessage}>
              Taking you to the results page...
            </div>
            
            <div className={styles.completionActions}>
              <button 
                onClick={() => router.push(`/competition/play/${competitionId}?room=${roomId}`)}
                className={styles.viewResultsButton}
              >
                📊 View Results Now
              </button>
              
              <button 
                onClick={handleReturnToRoom}
                className={styles.returnToRoomButton}
              >
                🏠 Return to Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      {/* Floating return button */}
      <div className={styles.floatingControls}>
        <button 
          onClick={handleReturnToRoom}
          className={styles.floatingReturnButton}
          title="Return to Room"
        >
          🏠
        </button>
      </div>

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

      {/* PAUSE OVERLAY */}
      {currentCompetition?.gameplay_indicator === 'PAUSE' && (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseContent}>
            <div className={styles.pauseIcon}>⏸️</div>
            <h2>Competition Paused</h2>
            <p>Please wait for the instructor to resume the competition.</p>
            <div className={styles.pausedTimer}>
              Timer: {formattedTime}
            </div>
            
            <div className={styles.pauseActions}>
              <button 
                onClick={handleReturnToRoom}
                className={styles.pauseReturnButton}
              >
                🏠 Return to Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionGamePage;