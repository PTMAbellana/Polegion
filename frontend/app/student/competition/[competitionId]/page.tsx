"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { useCompetitionRealtime } from "@/hooks/useCompetitionRealtime";
import { useCompetitionTimer } from "@/hooks/useCompetitionTimer";
import {
  CompetitionWaitingRoom,
  CompetitionPaused,
  CompetitionCompleted,
  CompetitionTimer,
} from "@/components/competition";
import type { Competition, CompetitionParticipant } from "@/types/common/competition";
import styles from "@/styles/competition-student.module.css";
import { useStudentRoomStore } from "@/store/studentRoomStore";

interface CompetitionPageProps {
  params: Promise<{ competitionId: number }>;
}

// Inner component that uses useSearchParams
function CompetitionPageContent({ competitionId }: { competitionId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentRoom } = useStudentRoomStore();
  
  // Get roomId from URL or fallback to store
  const roomId = searchParams.get('room') || currentRoom?.id?.toString() || '';
  const roomCode = searchParams.get('roomCode') || currentRoom?.code || '';
  
  // Track if we're ready to connect (have roomId)
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (roomId) {
      setIsReady(true);
    }
  }, [roomId]);

  // Real-time hooks - only connect when ready
  const {
    competition,
    participants,
    activeParticipants,
  } = useCompetitionRealtime(competitionId.toString(), !isReady, roomId);

  const liveCompetition = competition as Competition | null;
  const liveParticipants = participants as CompetitionParticipant[];
  const liveActiveParticipants = activeParticipants || [];

  // Filter out teachers from active participants count
  // Only show students (role === 'student' or role is undefined but they're in participants list)
  const filteredActiveParticipants = useMemo(() => {
    console.log('🔍 [Filter] Active participants before filter:', liveActiveParticipants);
    console.log('🔍 [Filter] Participants list:', liveParticipants);
    
    // Get participant IDs (students who joined the competition)
    const participantIds = new Set(liveParticipants.map(p => p.user_id || p.id));
    
    const filtered = liveActiveParticipants.filter((ap: { id: string; role?: string }) => {
      // If role is explicitly 'teacher', exclude them
      if (ap.role === 'teacher') {
        console.log('🚫 [Filter] Excluding teacher:', ap);
        return false;
      }
      // If role is 'student', include them
      if (ap.role === 'student') {
        return true;
      }
      // If role is undefined (old presence data), check if they're in participants list
      if (!ap.role && participantIds.size > 0) {
        const isParticipant = participantIds.has(ap.id);
        console.log(`🔍 [Filter] No role for ${ap.id}, isParticipant: ${isParticipant}`);
        return isParticipant;
      }
      // Default: include if we can't determine
      return true;
    });
    
    console.log('✅ [Filter] Filtered active participants:', filtered);
    return filtered;
  }, [liveActiveParticipants, liveParticipants]);

  const {
    formattedTime,
    isExpired,
    isPaused,
  } = useCompetitionTimer(competitionId, liveCompetition);

  // Redirect to game page when competition is ONGOING and not paused
  useEffect(() => {
    console.log('🔍 [Student Redirect Check]', {
      status: liveCompetition?.status,
      gameplay_indicator: liveCompetition?.gameplay_indicator,
      shouldRedirect: liveCompetition?.status === "ONGOING" && liveCompetition?.gameplay_indicator === "PLAY"
    });
    
    if (
      liveCompetition?.status === "ONGOING" &&
      liveCompetition?.gameplay_indicator === "PLAY" // Match backend value
    ) {
      console.log('✅ [Student Redirect] Redirecting to play page!');
      const roomParam = roomId ? `?room=${roomId}${roomCode ? `&roomCode=${roomCode}` : ''}` : '';
      router.push(`/student/competition/${competitionId}/play${roomParam}`);
    }
  }, [liveCompetition, competitionId, router, roomId, roomCode]);

  if (!liveCompetition) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Loading Competition...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Status-based rendering
  const renderContent = () => {
    switch (liveCompetition.status) {
      case "NEW":
        return (
          <CompetitionWaitingRoom
            competition={liveCompetition}
            participants={liveParticipants}
            activeParticipants={filteredActiveParticipants}
          />
        );

      case "ONGOING":
        // If paused, show pause overlay
        if (liveCompetition.gameplay_indicator === "PAUSE") {
          return (
            <CompetitionPaused
              formattedTime={formattedTime}
              competitionTitle={liveCompetition.title}
            />
          );
        }
        // Otherwise redirect will handle (shouldn't see this)
        return null;

      case "DONE":
        return (
          <CompetitionCompleted
            competitionTitle={liveCompetition.title}
            formattedTime={formattedTime}
            participants={liveParticipants}
            onRefresh={() => window.location.reload()}
          />
        );

      default:
        return (
          <div className={styles.waitingRoom}>
            <div className={styles.waitingContent}>
              <h2 className={styles.waitingTitle}>Unknown Competition Status</h2>
              <p className={styles.waitingDescription}>
                Status: {liveCompetition.status}
              </p>
            </div>
          </div>
        );
    }
  };

  const handleGoBack = () => {
    // Navigate to the joined room page using roomCode
    if (roomCode) {
      router.push(`/student/joined-rooms/${roomCode}`);
    } else {
      router.push('/student/joined-rooms');
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          onClick={handleGoBack}
          className={styles.backButton}
          title="Go back"
        >
          Back
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{liveCompetition.title}</h1>
          <p className={styles.status}>
            Status: <span className={styles.statusValue}>{liveCompetition.status}</span>
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className={styles.scrollableContent}>
        {/* Timer Section - Show for ONGOING only, hide for DONE */}
        {liveCompetition.status === "ONGOING" && (
          <div className={styles.timerSection}>
            <CompetitionTimer
              formattedTime={formattedTime}
              isActive={!isPaused && !isExpired}
              isExpired={isExpired}
              isPaused={isPaused}
              currentProblemIndex={1}
              totalProblems={liveParticipants.length}
              status={liveCompetition.status}
            />
          </div>
        )}

        {/* Content */}
        {renderContent()}
      </div>
    </div>
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
export default function CompetitionPage({ params }: CompetitionPageProps) {
  const { competitionId } = use(params);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompetitionPageContent competitionId={competitionId} />
    </Suspense>
  );
}