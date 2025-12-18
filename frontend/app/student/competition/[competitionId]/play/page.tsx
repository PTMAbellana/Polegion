"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import Gamepage from "@/components/Gamepage";
import { CompetitionPaused, CompetitionCompleted } from "@/components/competition";
import { useCompetitionRealtime } from "@/hooks/useCompetitionRealtime";
import { useCompetitionTimer } from "@/hooks/useCompetitionTimer";
import { useParticipantHeartbeat } from "@/hooks/useParticipantHeartbeat";
import { useAuthStore } from "@/store/authStore";
import type { Competition } from "@/types/common/competition";
import { useStudentRoomStore } from "@/store/studentRoomStore";
import styles from "@/styles/competition-student.module.css";

interface PlayPageProps {
  params: Promise<{ competitionId: number }>;
}

// Inner component that uses useSearchParams
function PlayPageContent({ competitionId }: { competitionId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentRoom } = useStudentRoomStore();
  const { userProfile } = useAuthStore();
  const roomId = searchParams.get('room') || currentRoom?.id?.toString() || '';
  const roomCode = searchParams.get('roomCode') || currentRoom?.code || '';

  const [showPauseOverlay, setShowPauseOverlay] = useState(false);

  // Real-time hooks - fetch competition data
  const {
    competition,
    participants,
    error: realtimeError,
  } = useCompetitionRealtime(competitionId.toString(), false, roomId, 'participant');

  // Send heartbeat to track active status while playing
  useParticipantHeartbeat(roomId, {
    isInCompetition: true,
    competitionId: competitionId.toString(),
    enabled: !!roomId
  });

  const liveCompetition = competition as Competition | null;
  const { formattedTime } = useCompetitionTimer(competitionId, liveCompetition);

  // Get user's XP from participants data
  const userAccumulatedXP = useMemo(() => {
    const found = participants.find(
      (p: any) => String(p.user_id) === String(userProfile?.id) || String(p.id) === String(userProfile?.id)
    );
    return found?.accumulated_xp || 0;
  }, [participants, userProfile?.id]);

  // Redirect logic based on competition status
  useEffect(() => {
    if (!liveCompetition) return;

    const roomParam = roomId ? `?room=${roomId}${roomCode ? `&roomCode=${roomCode}` : ''}` : '';

    // Competition not started yet - go to waiting room
    if (liveCompetition.status === "NEW") {
      router.push(`/student/competition/${competitionId}${roomParam}`);
      return;
    }

    // Don't redirect on DONE - let the game page show completion
    // (Prevents redirect errors and shows results in-place)

    // Competition paused - show overlay
    if (liveCompetition.gameplay_indicator === "PAUSE") {
      setShowPauseOverlay(true);
    } else {
      setShowPauseOverlay(false);
    }
  }, [liveCompetition, competitionId, router, roomId, roomCode]);

  // Show error if no roomId
  if (!roomId) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Missing Room ID</h1>
            <p className={styles.status}>
              Please access this page with a valid room parameter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if API failed
  if (realtimeError) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Connection Error</h1>
            <p className={styles.status} style={{ color: '#dc2626', marginTop: '1rem' }}>
              {realtimeError.message || 'Failed to connect to competition'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{ 
                marginTop: '1rem', 
                padding: '0.75rem 1.5rem', 
                cursor: 'pointer',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while waiting for competition data
  if (!liveCompetition) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className={styles.mainContainer}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Loading Game...</h1>
              <div style={{
                marginTop: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '5px solid rgba(34, 197, 94, 0.2)',
                  borderTop: '5px solid #22c55e',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Connecting to competition...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Competition not in proper state
  if (liveCompetition.status !== "ONGOING" && liveCompetition.status !== "DONE") {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Competition Not Active</h1>
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>{liveCompetition.status}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show completion screen if competition is done
  if (liveCompetition.status === "DONE") {
    return (
      <CompetitionCompleted
        competitionTitle={liveCompetition.title}
        formattedTime={formattedTime}
        participants={participants}
        onRefresh={() => window.location.reload()}
        roomId={roomId}
        roomCode={roomCode}
      />
    );
  }

  // Render the game
  return (
    <>
      {/* Pause Overlay - Shown when competition is paused */}
      {showPauseOverlay && (
        <CompetitionPaused
          formattedTime={formattedTime}
          competitionTitle={liveCompetition.title}
        />
      )}

      {/* Game Component */}
      <Gamepage
        roomCode={roomCode}
        competitionId={competitionId}
        currentCompetition={liveCompetition}
        roomId={roomId}
        isFullScreenMode={true}
        userAccumulatedXP={userAccumulatedXP}
      />
    </>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Loading...</h1>
        </div>
      </div>
    </div>
  );
}

// Main page component wraps content in Suspense
export default function PlayPage({ params }: PlayPageProps) {
  const { competitionId } = use(params);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PlayPageContent competitionId={competitionId} />
    </Suspense>
  );
}
