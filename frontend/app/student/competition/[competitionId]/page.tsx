"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { useCompetitionRealtime } from "@/hooks/useCompetitionRealtime";
import { useCompetitionTimer } from "@/hooks/useCompetitionTimer";
import { useParticipantHeartbeat } from "@/hooks/useParticipantHeartbeat";
import PageHeader from "@/components/PageHeader";
import {
  CompetitionWaitingRoom,
  CompetitionPaused,
  CompetitionCompleted,
  CompetitionTimer,
} from "@/components/competition";
import type { Competition, CompetitionParticipant } from "@/types/common/competition";
import styles from "@/styles/competition-student.module.css";
import dashboardStyles from "@/styles/dashboard-wow.module.css";
import { useStudentRoomStore } from "@/store/studentRoomStore";

interface CompetitionPageProps {
  params: Promise<{ competitionId: number }>;
}

// Inner component that uses useSearchParams
function CompetitionPageContent({ competitionId }: { competitionId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentRoom } = useStudentRoomStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Get roomId from URL or fallback to store
  const roomId = searchParams.get('room') || currentRoom?.id?.toString() || '';
  const roomCode = searchParams.get('roomCode') || currentRoom?.code || '';

  // Real-time hooks - connect immediately if we have roomId
  const {
    competition,
    participants,
    activeParticipants,
  } = useCompetitionRealtime(competitionId.toString(), !roomId, roomId, 'participant');

  // Send heartbeat to track active status
  useParticipantHeartbeat(roomId, {
    isInCompetition: true,
    competitionId: competitionId.toString(),
    enabled: !!roomId // Start immediately when we have roomId
  });

  const liveCompetition = competition as Competition | null;
  const liveParticipants = participants as CompetitionParticipant[];
  const liveActiveParticipants = activeParticipants || [];

  // Mark initial load as complete after competition and participants load
  // Removed the delay - activeParticipants should update immediately when presence syncs
  useEffect(() => {
    if (liveCompetition && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [liveCompetition, isInitialLoad]);

  // Filter out teachers/host from active participants count and deduplicate by user_id
  // Only show students (role === 'student' or role is undefined but they're in participants list)
  const filteredActiveParticipants = useMemo(() => {
    console.log('🔍 [Filter] Active participants before filter:', liveActiveParticipants);
    console.log('🔍 [Filter] Participants list:', liveParticipants);
    
    // Get participant IDs (students who joined the competition)
    const participantIds = new Set(liveParticipants.map(p => p.user_id || p.id));
    
    // Get competition creator/host ID
    const hostId = liveCompetition?.created_by;
    
    const filtered = liveActiveParticipants.filter((ap: { id: string; role?: string }) => {
      // Exclude host/creator of the competition
      if (hostId && ap.id === hostId) {
        console.log('🚫 [Filter] Excluding host:', ap);
        return false;
      }
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
    
    // Deduplicate by user_id to count unique users instead of multiple sessions
    const uniqueIds = [...new Set(filtered.map((ap: any) => ap.id))];
    const deduplicated = uniqueIds.map(id => filtered.find((ap: any) => ap.id === id));
    
    console.log('✅ [Filter] Filtered and deduplicated active participants:', deduplicated);
    return deduplicated;
  }, [liveActiveParticipants, liveParticipants, liveCompetition?.created_by]);

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
    <div className={dashboardStyles["dashboard-container"]}>
      <div className={styles.mainContainer}>
        {/* Header */}
        <PageHeader
          title={liveCompetition.title}
          subtitle={
            <div style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.5rem 1rem',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Timer</span>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2C514C', fontFamily: 'monospace' }}>{formattedTime}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.5rem 1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Participants</span>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2C514C', fontFamily: 'monospace' }}>{liveParticipants.length}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.5rem 1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Active</span>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981', fontFamily: 'monospace' }}>{filteredActiveParticipants.length}</span>
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                background: liveCompetition.status === 'NEW' ? 'rgba(6, 182, 212, 0.1)' : 
                           liveCompetition.status === 'ONGOING' ? 'rgba(16, 185, 129, 0.1)' : 
                           'rgba(107, 114, 128, 0.1)',
                borderRadius: '0.5rem',
                border: `1px solid ${liveCompetition.status === 'NEW' ? 'rgba(6, 182, 212, 0.3)' : 
                           liveCompetition.status === 'ONGOING' ? 'rgba(16, 185, 129, 0.3)' : 
                           'rgba(107, 114, 128, 0.3)'}`,
                fontWeight: '700',
                fontSize: '0.875rem',
                color: liveCompetition.status === 'NEW' ? '#06b6d4' : 
                       liveCompetition.status === 'ONGOING' ? '#10b981' : 
                       '#6b7280',
                textTransform: 'uppercase'
              }}>
                {liveCompetition.status}
              </div>
            </div>
          }
          showAvatar={false}
          actionButton={
            <button 
              onClick={handleGoBack}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                height: '44px'
              }}
            >
              Back
            </button>
          }
        />

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