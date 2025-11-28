"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import Gamepage from "@/components/Gamepage";
import { CompetitionPaused } from "@/components/competition";
import { useCompetitionRealtime } from "@/hooks/useCompetitionRealtime";
import { useCompetitionTimer } from "@/hooks/useCompetitionTimer";
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
  const roomId = searchParams.get('room') || currentRoom?.id?.toString() || '';
  const roomCode = searchParams.get('roomCode') || '';

  // Debug logging
  console.log('🎮 [PlayPage] competitionId:', competitionId, 'roomId:', roomId, 'currentRoom:', currentRoom);

  // Real-time hooks - pass false to not block connection
  const {
    competition,
    isConnected,
  } = useCompetitionRealtime(competitionId, false, roomId, 'participant');

  // Debug logging for competition data
  console.log('🎮 [PlayPage] competition:', competition, 'isConnected:', isConnected);

  const liveCompetition = competition as Competition | null;
  const { formattedTime } = useCompetitionTimer(competitionId, liveCompetition);

  // Track if we should show pause overlay
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Set a timeout to show error message if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!liveCompetition) {
        setLoadTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [liveCompetition]);

  // Redirect logic based on competition status
  useEffect(() => {
    if (!liveCompetition) return;

    const roomParam = roomId ? `?room=${roomId}${roomCode ? `&roomCode=${roomCode}` : ''}` : '';

    // Competition not started yet - go to waiting room
    if (liveCompetition.status === "NEW") {
      router.push(`/student/competition/${competitionId}${roomParam}`);
      return;
    }

    // Competition finished - go to results
    if (liveCompetition.status === "DONE") {
      router.push(`/student/competition/${competitionId}${roomParam}`);
      return;
    }

    // Competition paused - show overlay
    if (liveCompetition.gameplay_indicator === "PAUSE") {
      setShowPauseOverlay(true);
    } else {
      setShowPauseOverlay(false);
    }
  }, [liveCompetition, competitionId, router, roomId, roomCode]);

  // Show error if no roomId provided
  if (!roomId) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Missing Room ID</h1>
            <p className={styles.status}>
              Please access this page with a valid room parameter.
            </p>
            <button 
              onClick={() => router.back()}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!liveCompetition) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              {loadTimeout ? 'Failed to Load Competition' : 'Loading Competition...'}
            </h1>
            {loadTimeout && (
              <>
                <p className={styles.status}>
                  Could not connect to the competition. Please check your connection.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Competition not in proper state
  if (liveCompetition.status !== "ONGOING") {
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

  return (
    <>
      {/* Pause Overlay - Shown when competition is paused */}
      {showPauseOverlay && (
        <CompetitionPaused
          formattedTime={formattedTime}
          competitionTitle={liveCompetition.title}
        />
      )}

      {/* Game Component - Note: currentRoom is preserved from studentRoomStore */}
      <Gamepage
        roomCode={currentRoom?.code || ""}
        competitionId={competitionId}
        currentCompetition={liveCompetition}
        roomId={roomId || currentRoom?.id?.toString() || ""}
        isFullScreenMode={true}
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
