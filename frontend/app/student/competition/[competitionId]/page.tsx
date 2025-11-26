"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface CompetitionPageProps {
  params: Promise<{ competitionId: number }>;
}

export default function CompetitionPage({ params }: CompetitionPageProps) {
  const { competitionId } = use(params);
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const roomId = searchParams.get('room') || ''; // Always defined, even if empty string

  // Real-time hooks
  const {
    competition,
    participants,
  } = useCompetitionRealtime(competitionId.toString(), false, roomId);

  const liveCompetition = competition as Competition | null;
  const liveParticipants = participants as CompetitionParticipant[];

  const {
    formattedTime,
    isExpired,
    isPaused,
  } = useCompetitionTimer(competitionId, liveCompetition);

  // Redirect to game page when competition is ONGOING and not paused
  useEffect(() => {
    if (
      liveCompetition?.status === "ONGOING" &&
      liveCompetition?.gameplay_indicator === "PLAY" // Match backend value
    ) {
      const roomParam = roomId ? `?room=${roomId}` : '';
      router.push(`/student/competition/${competitionId}/play${roomParam}`);
    }
  }, [liveCompetition, competitionId, router, roomId]);

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
            onCopyLink={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert("Competition link copied to clipboard!");
            }}
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

  return (
    <div className={styles.mainContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{liveCompetition.title}</h1>
          <p className={styles.status}>
            Status: <span className={styles.statusValue}>{liveCompetition.status}</span>
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className={styles.scrollableContent}>
        {/* Timer Section - Show for ONGOING and DONE */}
        {(liveCompetition.status === "ONGOING" || liveCompetition.status === "DONE") && (
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