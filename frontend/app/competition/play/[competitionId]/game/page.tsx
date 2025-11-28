"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Gamepage from '@/components/Gamepage';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import { getCompeById } from '@/api/competitions';
import styles from '@/styles/game.module.css';

interface Competition {
  title: string;
  status: string;
  gameplay_indicator?: string;
  current_problem_id?: number;
  current_problem_index?: number;
  timer_started_at?: string;
  timer_duration?: number;
  total_problems?: number;
  problem_count?: number;
}

const CompetitionGamePage = ({ params }: { params: Promise<{ competitionId: string }> }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  
  const [competitionId, setCompetitionId] = useState<string | null>(null);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [initialDataFetched, setInitialDataFetched] = useState(false);

  // Resolve params Promise
  useEffect(() => {
    params.then(resolvedParams => {
      console.log('🎮 [Game] Competition ID resolved:', resolvedParams.competitionId);
      setCompetitionId(resolvedParams.competitionId);
    });
  }, [params]);

  // ✅ ENHANCED: Fetch initial competition data when competitionId is available
  const fetchInitialCompetitionData = useCallback(async () => {
    if (!competitionId || !roomId || initialDataFetched) return;
    
    try {
      console.log('🔄 [Game] Fetching initial competition data...');
      console.log('🔄 [Game] Competition ID:', competitionId);
      console.log('🔄 [Game] Room ID:', roomId);
      
      setIsLoading(true);
      
      // ✅ FETCH: Get competition data using the same API as dashboard
      const competitionData = await getCompeById(roomId, Number(competitionId), 'user');
      console.log('📊 [Game] Initial competition data loaded:', competitionData);
      
      if (competitionData) {
        setCompetition(competitionData);
        console.log('✅ [Game] Competition state set:', {
          title: competitionData.title,
          status: competitionData.status,
          gameplay_indicator: competitionData.gameplay_indicator,
          current_problem_id: competitionData.current_problem_id,
          current_problem_index: competitionData.current_problem_index,
          timer_started_at: competitionData.timer_started_at,
          timer_duration: competitionData.timer_duration
        });
        
        // ✅ CHECK: If competition is not ongoing, redirect back
        if (competitionData.status === 'DONE') {
          console.log('🏁 [Game] Competition is finished, redirecting...');
          setRedirecting(true);
          setTimeout(() => {
            router.push(`/competition/play/${competitionId}?room=${roomId}&completed=true`);
          }, 1000);
          return;
        }
        
        if (competitionData.status === 'NEW') {
          console.log('⏳ [Game] Competition not started, redirecting to dashboard...');
          router.push(`/competition/play/${competitionId}?room=${roomId}`);
          return;
        }
      }
      
      setInitialDataFetched(true);
    } catch (error) {
      console.error('❌ [Game] Error fetching initial competition data:', error);
      // ✅ FALLBACK: Redirect to dashboard on error
      router.push(`/competition/play/${competitionId}?room=${roomId}`);
    } finally {
      setIsLoading(false);
    }
  }, [competitionId, roomId, initialDataFetched, router]);

  // ✅ TRIGGER: Fetch initial data when competitionId is available
  useEffect(() => {
    if (competitionId && roomId) {
      fetchInitialCompetitionData();
    }
  }, [competitionId, roomId, fetchInitialCompetitionData]);

  // ✅ ENHANCED: Real-time competition state with better conditions
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    isConnected,
    connectionStatus,
  } = useCompetitionRealtime(
    competitionId ? Number(competitionId) : null, 
    !competitionId || isLoading, // Don't start realtime until we have basic data
    roomId || '', // Pass roomId for proper API calls and presence tracking
    'participant' // userType
  );
  
  // ✅ ENHANCED: Use live data when available, fallback to initial fetch
  const currentCompetition: Competition = liveCompetition || competition || {} as Competition;

  // ✅ ENHANCED: Competition timer hook with better data passing
  const {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired
  } = useCompetitionTimer(
    competitionId ? Number(competitionId) : null, 
    currentCompetition
  );

  // ✅ ENHANCED: Real-time state change logging
  useEffect(() => {
    if (currentCompetition && Object.keys(currentCompetition).length > 0) {
      console.log('🎮 [Game] Competition state update:', {
        source: liveCompetition ? 'Real-time' : 'Initial fetch',
        title: currentCompetition.title,
        status: currentCompetition.status,
        gameplay_indicator: currentCompetition.gameplay_indicator,
        current_problem_id: currentCompetition.current_problem_id,
        current_problem_index: currentCompetition.current_problem_index,
        timer_started_at: currentCompetition.timer_started_at,
        timer_duration: currentCompetition.timer_duration,
        isTimerActive,
        formattedTime
      });
    }
  }, [currentCompetition, liveCompetition, isTimerActive, formattedTime]);

  // ✅ FIXED: Get room code from room ID using proper API endpoint
  const getRoomCodeFromId = async (roomId: string) => {
    try {
      console.log('🔍 [Game] Fetching room code for room ID:', roomId);
      
      const response = await fetch(`/api/virtual-rooms/id/${roomId}`);
      
      if (response.ok) {
        const roomData = await response.json();
        console.log('📋 [Game] Room data received:', roomData);
        
        const roomCode = roomData.code;
        
        if (roomCode && roomCode !== roomId) {
          console.log('✅ [Game] Found room code:', roomCode);
          return roomCode;
        } else {
          console.warn('⚠️ [Game] No valid room code found:', roomData);
        }
      } else {
        console.warn(`❌ [Game] API returned status:`, response.status);
      }
    } catch (error) {
      console.error('❌ [Game] Error fetching room data:', error);
    }
    
    return null;
  };

  // ✅ ENHANCED: Better return to room with room code
  const handleReturnToRoom = async () => {
    console.log('🏠 [Game] Starting return to room process...');
    
    if (roomId) {
      try {
        const roomCode = await getRoomCodeFromId(roomId);
        
        if (roomCode) {
          const targetUrl = `/virtual-rooms/${roomCode}`;
          console.log('🚀 [Game] Navigating to:', targetUrl);
          router.push(targetUrl);
          return;
        }
      } catch (error) {
        console.error('❌ [Game] Error getting room code:', error);
      }
      
      // ✅ FALLBACK: Try with room ID directly
      console.warn('⚠️ [Game] Using fallback navigation');
      router.push(`/virtual-rooms/${roomId}`);
    } else {
      router.push('/virtual-rooms');
    }
  };

  // ✅ ENHANCED: Competition completion redirect with better conditions
  useEffect(() => {
    if (competitionId && 
        currentCompetition?.status === 'DONE' && 
        !redirecting && 
        !isLoading &&
        initialDataFetched) {
    
      console.log('🏁 [Game] Competition finished! Redirecting participants...');
      console.log('🏁 [Game] Current status:', currentCompetition.status);
      console.log('🏁 [Game] Competition ID:', competitionId);
      console.log('🏁 [Game] Room ID:', roomId);
      
      setRedirecting(true);
      
      setTimeout(() => {
        router.push(`/competition/play/${competitionId}?room=${roomId}&completed=true`);
      }, 1000);
    }
  }, [currentCompetition?.status, competitionId, roomId, router, redirecting, isLoading, initialDataFetched]);

  // ✅ ENHANCED: Handle competition state changes that require redirect
  useEffect(() => {
    if (!initialDataFetched || isLoading || redirecting) return;
    
    // ✅ REDIRECT: If competition becomes NEW (reset) or invalid state
    if (currentCompetition?.status === 'NEW') {
      console.log('⏳ [Game] Competition reset to NEW, redirecting to dashboard...');
      router.push(`/competition/play/${competitionId}?room=${roomId}`);
      return;
    }
    
    // ✅ STAY: Only stay on game page if competition is ONGOING
    if (currentCompetition?.status === 'ONGOING' && !currentCompetition?.current_problem_id) {
      console.log('⚠️ [Game] Competition ONGOING but no current problem, might be starting...');
    }
  }, [currentCompetition?.status, currentCompetition?.current_problem_id, initialDataFetched, isLoading, redirecting, router, competitionId, roomId]);

  // ✅ CLEANUP: Reset redirecting state if needed
  useEffect(() => {
    if (currentCompetition?.status && 
        currentCompetition.status !== 'DONE' && 
        redirecting) {
      console.log('🔄 [Game] Competition status changed, resetting redirect state');
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

  // Show loading while resolving params or fetching initial data
  // if (isLoading || !competitionId || !initialDataFetched) {
  //   return (
  //     <div className={styles.loadingContainer}>
  //       <div className={styles.loadingContent}>
  //         <div className={styles.spinner}></div>
  //         <p>Loading competition...</p>
  //         <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
  //           Competition ID: {competitionId || 'Resolving...'}
  //           <br />
  //           Room ID: {roomId}
  //           <br />
  //           Status: {currentCompetition?.status || 'Loading...'}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  // Show loading while resolving params or fetching initial data
  if (isLoading || !competitionId || !initialDataFetched) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          {/* ✅ NEW: Rubik's Cube Loading Animation */}
          <div className={styles.rubiksCube}>
            <div className={`${styles.face} ${styles.front}`}>
              <div className={`${styles.square} ${styles.red}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.orange}`}></div>
              <div className={`${styles.square} ${styles.red}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
            </div>
            <div className={`${styles.face} ${styles.back}`}>
              <div className={`${styles.square} ${styles.orange}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.red}`}></div>
              <div className={`${styles.square} ${styles.orange}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
            </div>
            <div className={`${styles.face} ${styles.right}`}>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
              <div className={`${styles.square} ${styles.blue}`}></div>
            </div>
            <div className={`${styles.face} ${styles.left}`}>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
              <div className={`${styles.square} ${styles.green}`}></div>
            </div>
            <div className={`${styles.face} ${styles.top}`}>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
              <div className={`${styles.square} ${styles.white}`}></div>
            </div>
            <div className={`${styles.face} ${styles.bottom}`}>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
              <div className={`${styles.square} ${styles.yellow}`}></div>
            </div>
          </div>
          
          <p style={{ 
            marginTop: '20px', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Loading competition...
          </p>
          
          <div style={{ 
            fontSize: '12px', 
            marginTop: '10px', 
            opacity: 0.7,
            color: '#6b7280' 
          }}>
            Competition ID: {competitionId || 'Resolving...'}
            <br />
            Room ID: {roomId}
            <br />
            Status: {currentCompetition?.status || 'Loading...'}
          </div>
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
                onClick={() => router.push(`/competition/play/${competitionId}?room=${roomId}&completed=true`)}
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

  // ✅ ENHANCED: Only render Gamepage when we have valid competition data
  if (!currentCompetition || !currentCompetition.status) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>Waiting for competition data...</p>
        </div>
      </div>
    );
  }

  console.log('🎮 [Game] Rendering Gamepage with data:', {
    roomCode: roomId,
    competitionId: Number(competitionId),
    currentCompetition: {
      title: currentCompetition.title,
      status: currentCompetition.status,
      current_problem_id: currentCompetition.current_problem_id,
      current_problem_index: currentCompetition.current_problem_index
    },
    roomId,
    isTimerActive,
    formattedTime
  });

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

      {/* ✅ ENHANCED: Pass all necessary props with proper data */}
      <Gamepage 
        roomCode={roomId}
        competitionId={Number(competitionId)}
        currentCompetition={currentCompetition}
        roomId={roomId}
        isFullScreenMode={true}
      />

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
      
      {/* ✅ DEBUG: Show current data in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '11px',
          maxWidth: '300px',
          zIndex: 9999
        }}>
          <div><strong>🎮 Game Debug:</strong></div>
          <div>Competition ID: {competitionId}</div>
          <div>Room ID: {roomId}</div>
          <div>Status: {currentCompetition?.status}</div>
          <div>Gameplay: {currentCompetition?.gameplay_indicator}</div>
          <div>Problem ID: {currentCompetition?.current_problem_id}</div>
          <div>Problem Index: {currentCompetition?.current_problem_index}</div>
          <div>Timer Active: {isTimerActive ? 'Yes' : 'No'}</div>
          <div>Time: {formattedTime}</div>
          <div>Real-time: {liveCompetition ? 'Connected' : 'Using initial'}</div>
          <div>Initial Fetched: {initialDataFetched ? 'Yes' : 'No'}</div>
        </div>
      )} */}
    </div>
  );
};

export default CompetitionGamePage;