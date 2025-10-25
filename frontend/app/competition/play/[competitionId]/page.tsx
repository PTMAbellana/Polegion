"use client";

import React, { use, useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { getRoomProblems } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getCompeById } from '@/api/competitions';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import { ConnectionStatus } from '@/components/debug/ConnectionStatus';

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
  const completed = searchParams.get("completed");
  const compe_id = use(params);
  const router = useRouter();

  // ✅ ONLY Competition states - removed all create-problem states
  const [sortOrder, setSortOrder] = useState('desc');
  const [fetched, setFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [problems, setProblems] = useState<Problems[]>([])
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined)

  // ✅ ENHANCED: Better real-time hook with more responsive polling
  const {
    competition: liveCompetition,
    participants: liveParticipants,
    isConnected,
    connectionStatus,
    setParticipants: setLiveParticipants,
    pollCount
  } = useCompetitionRealtime(compe_id.competitionId, isLoading);
  
  // ✅ ENHANCED: Better timer hook with immediate updates
  const {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired
  } = useCompetitionTimer(compe_id.competitionId, liveCompetition || competition);

  // Use live competition data when available, fallback to initial API state
  const currentCompetition: Competition = liveCompetition || competition || {} as Competition;

  const { isLoggedIn } = useAuthStore()

  // ✅ ENHANCED: Better initial data fetching with competition state handling
  const callMe = useCallback( async () => {
    try {
        setIsLoading(true)
        console.log('🔄 [Participant] Loading competition data...');
        
        const parts = await getAllParticipants(roomId, 'user', true, compe_id.competitionId)
        console.log("👥 [Participant] Participants data: ", parts)
        setParticipants(parts.data.participants || [])
        
        const probs = await getRoomProblems(roomId)
        setProblems(probs)

        const compe = await getCompeById(roomId, compe_id.competitionId, 'user')
        console.log("🏁 [Participant] Competition data: ", compe)
        setCompetition(compe)

        // ✅ IMMEDIATE REDIRECT: If competition is ongoing and we're not coming from completed page
        if (compe?.status === 'ONGOING' && !completed) {
          console.log('🚀 [Participant] Competition is ongoing, redirecting to game...');
          const gameUrl = `/competition/play/${compe_id.competitionId}/game?room=${roomId}`;
          setTimeout(() => {
            router.push(gameUrl);
          }, 1000); // Small delay to show loading state
        }

        setActiveProblems([]);
    } catch (error) {
        console.error('❌ [Participant] Error fetching competition details:', error)
    } finally {
        setIsLoading(false)
    }
  }, [roomId, compe_id.competitionId, completed, router])

  // Competition logic
  useEffect(() => {
      if (isLoggedIn && !fetched) {
          callMe()
          setFetched(true)
      } else {
          if (!isLoggedIn) {
              setIsLoading(true)
          }
      }
  }, [isLoggedIn, fetched, callMe])

  // Sync real-time participants data
  useEffect(() => {
    if (liveParticipants && liveParticipants.length > 0) {
      console.log('👥 [STUDENT] Syncing participants data:', liveParticipants);
      setParticipants(liveParticipants);
    }
  }, [liveParticipants]);

  // ✅ ENHANCED: Better competition state change detection
  useEffect(() => {
    console.log('🎯 [Participant] Competition state change detected:');
    console.log('  - Status:', currentCompetition?.status);
    console.log('  - Gameplay:', currentCompetition?.gameplay_indicator);
    console.log('  - Timer Active:', isTimerActive);
    console.log('  - Current Problem ID:', currentCompetition?.current_problem_id);
    console.log('  - Current Problem Index:', currentCompetition?.current_problem_index);
    console.log('  - Completed param:', completed);
  }, [currentCompetition, isTimerActive, completed]);

  // ✅ ENHANCED: Better redirect logic with more conditions
  useEffect(() => {
    // Only redirect if:
    // 1. Competition is ONGOING
    // 2. Timer is active (meaning it actually started)
    // 3. We're not coming from a completed competition
    // 4. We have a current problem ID (meaning a problem is active)
    if (currentCompetition?.status === 'ONGOING' && 
        isTimerActive && 
        !completed && 
        currentCompetition?.current_problem_id) {
      
      console.log('🚀 [Participant] All conditions met for game redirect:');
      console.log('  - Status: ONGOING ✅');
      console.log('  - Timer Active: ✅');
      console.log('  - Not from completed: ✅');
      console.log('  - Has problem ID: ✅');
      
      const gameUrl = `/competition/play/${compe_id.competitionId}/game?room=${roomId}`;
      console.log('🎯 [Participant] Redirecting to:', gameUrl);
      
      router.push(gameUrl);
    } else {
      console.log('⏳ [Participant] Redirect conditions not met:');
      console.log('  - Status:', currentCompetition?.status);
      console.log('  - Timer Active:', isTimerActive);
      console.log('  - From completed:', !!completed);
      console.log('  - Problem ID:', currentCompetition?.current_problem_id);
    }
  }, [
    currentCompetition?.status, 
    currentCompetition?.current_problem_id,
    isTimerActive, 
    compe_id.competitionId, 
    roomId, 
    router, 
    completed
  ]);

  // ✅ CLEANED UP: Simple getRoomCodeFromId without alerts
  const getRoomCodeFromId = async (roomId: string) => {
    try {
      console.log('🔍 Fetching room details for room ID:', roomId);
      
      // ✅ MORE COMPREHENSIVE AUTH CHECK
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const cookieToken = typeof window !== 'undefined' ? document.cookie.split(';').find(row => row.trim().startsWith('token=')) : null;
      
      console.log('🔐 Auth token sources:');
      console.log('  - localStorage:', !!token);
      console.log('  - sessionStorage:', !!sessionToken);
      console.log('  - cookie:', !!cookieToken);
      
      const finalToken = token || sessionToken || (cookieToken ? cookieToken.split('=')[1] : null);
      console.log('🔐 Final token selected:', !!finalToken);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if available
      if (finalToken) {
        headers['Authorization'] = `Bearer ${finalToken}`;
      }
      
      console.log('📡 Request URL:', `/api/virtual-rooms/id/${roomId}`);
      console.log('📡 Request headers:', headers);
      
      const response = await fetch(`/api/virtual-rooms/id/${roomId}`, {
        method: 'GET',
        headers,
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const roomDetails = await response.json();
        console.log('📋 ===== COMPLETE API RESPONSE =====');
        console.log('📋 Full response:', JSON.stringify(roomDetails, null, 2));
        console.log('📋 Room ID:', roomDetails.id);
        console.log('📋 Room Code (from .code):', roomDetails.code);
        console.log('📋 Room Name:', roomDetails.name);
        console.log('📋 All properties:', Object.keys(roomDetails));
        console.log('📋 ===================================');
        
        // ✅ DIRECT: Get the code property
        const roomCode = roomDetails.code;
        
        if (roomCode) {
          console.log('✅ SUCCESS: Room code extracted:', roomCode);
          return roomCode;
        } else {
          console.warn('⚠️ WARNING: Room code property exists but is empty/null');
          console.log('📋 Room details structure:', roomDetails);
          return null;
        }
      } else {
        // ✅ DETAILED ERROR ANALYSIS
        const errorText = await response.text();
        console.error('❌ API ERROR DETAILS:');
        console.error('  - Status:', response.status);
        console.error('  - Status Text:', response.statusText);
        console.error('  - Response Body:', errorText);
        
        if (response.status === 401) {
          console.error('🔐 AUTHENTICATION REQUIRED');
          console.log('💡 The API endpoint requires authentication');
          console.log('💡 Check if user is logged in properly');
        } else if (response.status === 404) {
          console.error('🔍 ROOM NOT FOUND');
          console.log('💡 Room ID might not exist in database');
          console.log('💡 Check if room ID 58 exists in rooms table');
        }
        
        return null;
      }
    } catch (error) {
      console.error('❌ NETWORK ERROR:', error);
      return null;
    }
  };

  // ✅ CLEANED UP: Simple handleReturnToRoom without alerts
  const handleReturnToRoom = async () => {
    console.log('🏠 ===== STARTING RETURN TO ROOM PROCESS =====');
    console.log('📋 Room ID from URL params:', roomId);
    console.log('🎯 Competition ID:', compe_id.competitionId);
    
    if (!roomId) {
      console.warn('⚠️ No room ID found in URL parameters');
      console.log('🚀 Redirecting to virtual rooms list');
      router.push('/virtual-rooms');
      return;
    }
    
    try {
      console.log('🔄 Step 1: Attempting to get room code from room ID...');
      const roomCode = await getRoomCodeFromId(roomId);
      
      if (roomCode) {
        console.log('✅ Step 2: Room code retrieved successfully:', roomCode);
        const targetUrl = `/virtual-rooms/${roomCode}`;
        console.log('🚀 Step 3: Navigating to room dashboard:', targetUrl);
        await router.push(targetUrl);
        console.log('✅ Navigation completed successfully');
        return;
      } else {
        console.warn('⚠️ Step 2 failed: Could not get room code');
        console.log('🔄 Trying fallback navigation options...');
        
        // ✅ FALLBACK 1: Try navigation with room ID directly (might work)
        console.log('🚀 Fallback 1: Trying navigation with room ID');
        const fallbackUrl1 = `/virtual-rooms/${roomId}`;
        console.log('🚀 Fallback URL:', fallbackUrl1);
        await router.push(fallbackUrl1);
        console.log('✅ Fallback navigation completed');
        return;
      }
      
    } catch (error) {
      console.error('❌ Error in room navigation process:', error);
      console.log('🔄 Using final fallback: virtual rooms list');
      
      // ✅ FALLBACK 2: Go to virtual rooms list
      router.push('/virtual-rooms');
    }
    
    console.log('🏠 ===== RETURN TO ROOM PROCESS COMPLETED =====');
  };

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
            
            {/* ✅ Return button for waiting state too */}
            {/* <div className={styles.actionButtons}>
              <button 
                onClick={handleReturnToRoom}
                className={styles.returnToRoomButton}
              >
                <span className={styles.buttonIcon}>🏠</span>
                Return to Room
              </button>
            </div> */}
          </div>
        </div>
      );
    }
    
    if (currentCompetition?.status === 'DONE') {
      return (
        <div className={styles.completedSection}>
          <div className={styles.completedContent}>
            <div className={styles.completedIcon}>🏆</div>
            <h2 className={styles.completedTitle}>Competition Completed!</h2>
            <p className={styles.completedDescription}>
              This competition has been completed. Check the final results below!
            </p>
            
            {/* Competition Summary */}
            <div className={styles.competitionSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Competition:</span>
                <span className={styles.summaryValue}>{currentCompetition?.title}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Final Time:</span>
                <span className={styles.summaryValue}>{formattedTime}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Participants:</span>
                <span className={styles.summaryValue}>{sortedParticipants.length}</span>
              </div>
            </div>
            
            {/* Final Leaderboard */}
            <div className={styles.finalLeaderboard}>
              <h3>🏆 Final Results</h3>
              <div className={styles.leaderboardList}>
                {sortedParticipants.slice(0, 10).map((participant, index) => (
                  <div 
                    key={participant.id} 
                    className={`${styles.leaderboardItem} ${index < 3 ? styles[`podium${index + 1}`] : ''}`}
                  >
                    <span className={styles.rank}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className={styles.name}>
                      {participant.fullName || 'Unknown'}
                    </span>
                    <span className={styles.xp}>{participant.accumulated_xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Enhanced Action Buttons */}
            <div className={styles.actionButtons}>
              {/* <button 
                onClick={handleReturnToRoom}
                className={styles.returnToRoomButton}
              >
                <span className={styles.buttonIcon}>🏠</span>
                Return to Room
              </button> */}
              
              <button 
                onClick={() => window.location.reload()}
                className={styles.refreshButton}
              >
                <span className={styles.buttonIcon}>🔄</span>
                Refresh Results
              </button>
              
              {/* Optional: Share results button */}
              <button 
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Results link copied to clipboard!');
                }}
                className={styles.shareButton}
              >
                <span className={styles.buttonIcon}>📋</span>
                Copy Results Link
              </button>
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

            {/* ✅ Return button for paused state */}
            {/* <div className={styles.actionButtons}>
              <button 
                onClick={handleReturnToRoom}
                className={styles.returnToRoomButton}
              >
                <span className={styles.buttonIcon}>🏠</span>
                Return to Room
              </button>
            </div> */}
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

          {/* ✅ Return button for default state */}
          {/* <div className={styles.actionButtons}>
            <button 
              onClick={handleReturnToRoom}
              className={styles.returnToRoomButton}
            >
              <span className={styles.buttonIcon}>🏠</span>
              Return to Room
            </button>
          </div> */}
        </div>
      </div>
    );
  };

  if (isLoading) {
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

  // ✅ MOVE: Define DebugInfo INSIDE the component
  // const DebugInfo = () => {
  //   const [roomCode, setRoomCode] = useState<string | null>(null);
  //   const [lastError, setLastError] = useState<string | null>(null);
    
  //   // Test function to get room code
  //   const testGetRoomCode = async () => {
  //     setLastError(null);
  //     if (roomId) {
  //       try {
  //         const code = await getRoomCodeFromId(roomId);
  //         setRoomCode(code);
  //         if (!code) {
  //           setLastError('API call succeeded but no room code returned');
  //         }
  //       } catch (error) {
  //         setLastError(`Error: ${error.message}`);
  //       }
  //     }
  //   };
    
  //   // Test auth function
  //   const testAuth = async () => {
  //     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  //     console.log('🔐 Auth Test:');
  //     console.log('Token exists:', !!token);
  //     console.log('Token length:', token?.length || 0);
  //     console.log('Token preview:', token ? `${token.substring(0, 10)}...` : 'None');
      
  //     if (!token) {
  //       alert('❌ No auth token found! Please log in again.');
  //     } else {
  //       alert(`✅ Auth token found (${token.length} chars)`);
  //     }
  //   };
    
  //   return (
  //     <div style={{
  //       position: 'fixed',
  //       bottom: '10px',
  //       left: '10px',
  //       background: 'rgba(0,0,0,0.8)',
  //       color: 'white',
  //       padding: '10px',
  //       borderRadius: '5px',
  //       fontSize: '12px',
  //       zIndex: 9999,
  //       maxWidth: '350px'
  //     }}>
  //       <div><strong>🔧 Debug Info:</strong></div>
  //       <div>Room ID: {roomId || 'None'}</div>
  //       <div>Room Code: {roomCode || 'Not fetched'}</div>
  //       <div>Competition ID: {compe_id.competitionId}</div>
  //       <div>Expected URL: {roomCode ? `/virtual-rooms/${roomCode}` : 'Pending...'}</div>
  //       <div>Auth Token: {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Present' : 'Missing'}</div>
  //       {lastError && <div style={{color: '#ff6666'}}>Error: {lastError}</div>}
        
  //       {/* ✅ NEW: Test Auth button */}
  //       <button 
  //         onClick={testAuth}
  //         style={{
  //           marginTop: '5px',
  //           padding: '5px',
  //           background: '#ff6600',
  //           color: 'white',
  //           border: 'none',
  //           borderRadius: '3px',
  //           cursor: 'pointer',
  //           width: '100%',
  //           marginBottom: '3px'
  //         }}
  //       >
  //         🔐 Test Auth Token
  //       </button>
        
  //       {/* Test Room Code button */}
  //       <button 
  //         onClick={testGetRoomCode}
  //         style={{
  //           padding: '5px',
  //           background: '#00ff00',
  //           color: 'black',
  //           border: 'none',
  //           borderRadius: '3px',
  //           cursor: 'pointer',
  //           width: '100%',
  //           marginBottom: '3px'
  //         }}
  //       >
  //         🧪 Test Get Room Code
  //       </button>
        
  //       {/* Test Navigation button */}
  //       <button 
  //         onClick={handleReturnToRoom}
  //         style={{
  //           padding: '5px',
  //           background: '#0066ff',
  //           color: 'white',
  //           border: 'none',
  //           borderRadius: '3px',
  //           cursor: 'pointer',
  //           width: '100%',
  //           marginBottom: '3px'
  //         }}
  //       >
  //         🚀 Test Navigation
  //       </button>
        
  //       {/* ✅ NEW: Force login button */}
  //       <button 
  //         onClick={() => {
  //           router.push('/login');
  //         }}
  //         style={{
  //           padding: '5px',
  //           background: '#cc0066',
  //           color: 'white',
  //           border: 'none',
  //           borderRadius: '3px',
  //           cursor: 'pointer',
  //           width: '100%'
  //         }}
  //       >
  //         🔑 Go to Login
  //       </button>
  //     </div>
  //   );
  // };

  return (
    <div className={styles.mainContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {/* <div className={styles.titleRow}> */}
            <h1 className={styles.title}>
              {currentCompetition?.title || 'Competition'}
            </h1>
            
            {/* ✅ Add Go Back button in header */}
            {/* <button 
              onClick={handleReturnToRoom}
              className={styles.headerBackButton}
              title="Return to Room"
            >
              <span className={styles.backIcon}>←</span>
              <span className={styles.backText}>Back to Room</span>
            </button> */}
          {/* </div> */}
          
          {/* <div className={styles.statusRow}> */}
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>{currentCompetition?.status}</span>
            </p>
            {/* <ConnectionStatus 
              isConnected={isConnected} 
              connectionStatus={connectionStatus}
              className="ml-4"
            /> */}
          {/* </div> */}
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
      {/* <div className={styles.leaderboardSection}>
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
      </div> */}

      {/* ✅ FIXED: Debug component now has access to all variables */}
      {/* {process.env.NODE_ENV === 'development' && <DebugInfo />} */}
    </div>
  );
};

export default CompetitionDashboard;