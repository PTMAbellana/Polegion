"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PlayPage({ params }: PlayPageProps) {
  const { competitionId } = use(params);
  const router = useRouter();
  const { currentRoom } = useStudentRoomStore();

  // Real-time hooks
  const {
    competition,
  } = useCompetitionRealtime(competitionId.toString(), false);

  const liveCompetition = competition as Competition | null;
  const { formattedTime } = useCompetitionTimer(liveCompetition);

  // Track if we should show pause overlay
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);

  // Redirect logic based on competition status
  useEffect(() => {
    if (!liveCompetition) return;

    // Competition not started yet - go to waiting room
    if (liveCompetition.status === "NEW") {
      router.push(`/student/competition/${competitionId}`);
      return;
    }

    // Competition finished - go to results
    if (liveCompetition.status === "DONE") {
      router.push(`/student/competition/${competitionId}`);
      return;
    }

    // Competition paused - show overlay
    if (liveCompetition.gameplay_indicator === "PAUSE") {
      setShowPauseOverlay(true);
    } else {
      setShowPauseOverlay(false);
    }
  }, [liveCompetition, competitionId, router]);

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
        roomId={currentRoom?.id?.toString()}
        isFullScreenMode={true}
      />
    </>
  );
}
