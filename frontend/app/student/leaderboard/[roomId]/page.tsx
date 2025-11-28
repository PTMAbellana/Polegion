"use client"

import React, { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/components/Loader"
import LoadingOverlay from "@/components/LoadingOverlay"
import { useAuthStore } from "@/store/authStore"
import { useLeaderboardManagement } from "@/hooks/useLeaderboardManagement"
import { Trophy, Medal } from "lucide-react"
import LeaderboardHeader from "@/components/student/LeaderboardHeader"
import LeaderboardTabs from "@/components/student/LeaderboardTabs"
import LeaderboardGrid from "@/components/student/LeaderboardGrid"
import CompetitionLeaderboardsSplit from "@/components/student/CompetitionLeaderboardsSplit"
import styles from "@/styles/leaderboard.module.css"

export default function LeaderboardPage({ params }: { params: Promise<{ roomId: number }> }) {
  const router = useRouter()
  const { roomId } = use(params)
  const { isLoggedIn, appLoading } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"overall" | "competition">("overall")

  const {
    roomBoards,
    compeBoards,
    loading,
    error,
    fetchLeaderboards,
    clearLeaderboards
  } = useLeaderboardManagement(roomId)

  useEffect(() => {
    if (isLoggedIn && !appLoading && roomId) {
      void fetchLeaderboards()
    }

    return () => {
      clearLeaderboards()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, appLoading, roomId])

  const handleBackClick = () => {
    router.back()
  }

  if (appLoading || !isLoggedIn || loading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (error && roomBoards.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Error Loading Leaderboards</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            onClick={() => router.back()}
            className={styles.errorButton}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
      <div className={styles.leaderboard_container}>
        {/* Back Button */}
        <div className={styles.back_button_container}>
            <button onClick={handleBackClick} className={styles.back_button}>
            <span>Back to Rooms</span>
            </button>
        </div>

        <div className={styles.leaderboard_scrollable} >
            {/* Hero Header */}
            <LeaderboardHeader
                totalPlayers={roomBoards.length}
                totalCompetitions={compeBoards.length}
            />

            {/* Main Content */}
            <div className={styles.main_content}>
                {/* Navigation Tabs */}
                <LeaderboardTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                overallCount={roomBoards.length}
                competitionCount={compeBoards.length}
                />

                {/* Overall Leaderboard */}
                {activeTab === "overall" && (
                <div className={styles.content_section}>
                    <div className={styles.section_header}>
                    <h2 className={styles.section_title}>
                        <Trophy className={styles.section_icon} />
                        Overall Room Rankings
                    </h2>
                    <p className={styles.section_description}>
                        Combined scores from all competitions in this room
                    </p>
                    </div>

                    <LeaderboardGrid
                    items={roomBoards}
                    emptyMessage="No Rankings Yet"
                    emptyIcon=""
                    />
                </div>
                )}

                {/* Competition Leaderboards */}
                {activeTab === "competition" && (
                <div className={styles.content_section}>
                    <div className={styles.section_header}>
                    <h2 className={styles.section_title}>
                        <Medal className={styles.section_icon} />
                        Competition Rankings
                    </h2>
                    <p className={styles.section_description}>
                        Individual competition leaderboards
                    </p>
                    </div>

                    <CompetitionLeaderboardsSplit competitions={compeBoards} />
                </div>
                )}
            </div>
        </div>
    </div>
  )
}