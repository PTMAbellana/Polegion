"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useStudentRoomStore } from "@/store/studentRoomStore"
import { useStudentDashboardRealtime } from "@/hooks/useStudentDashboardRealtime"
import Loader from "@/components/Loader"
import LoadingOverlay from "@/components/LoadingOverlay"
import PageHeader from "@/components/PageHeader"
import RoomCardsList from "@/components/RoomCardsList"
import { STUDENT_ROUTES } from "@/constants/routes"
import { getRoomLeaderboards } from "@/api/records"
import dashboardStyles from "@/styles/dashboard-wow.module.css"
import studentStyles from "@/styles/dashboard.module.css"
import competitionStyles from "@/styles/competitions-dashboard.module.css"
import { Competition } from "@/types/common/competition"
import { LeaderboardData } from "@/types/common/leaderboard"
import AnimatedAvatar from "@/components/profile/AnimatedAvatar"
import { getAssessmentResults } from "@/api/assessments"
import AssessmentRadarChart from "@/components/assessment/AssessmentRadarChart"
import { getAllCastles } from "@/api/castles"
import { FaFortAwesome, FaDungeon, FaMedal } from 'react-icons/fa'

// Extended type for competitions with room context and additional fields
interface CompetitionWithRoom extends Competition {
  roomTitle?: string;
  roomCode?: string;
  problems?: Array<{ id: number }>;
  participants?: Array<{ id: number }>;
}

export default function StudentDashboard() {
  const router = useRouter()
  const { isLoggedIn, appLoading, userProfile } = useAuthStore()
  const { 
    joinedRooms, 
    loading: roomsLoading, 
    fetchJoinedRooms 
  } = useStudentRoomStore()

  // Assessment and castle state (not affected by real-time)
  const [pretestScores, setPretestScores] = useState<any>(null)
  const [posttestScores, setPosttestScores] = useState<any>(null)
  const [assessmentLoading, setAssessmentLoading] = useState(true)
  const [castles, setCastles] = useState<any[]>([])
  const [castlesLoading, setCastlesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'assessment' | 'castle'>('castle')

  // Initial fetch on mount
  useEffect(() => {
    if (isLoggedIn && !appLoading) {
      void fetchJoinedRooms()
    }
  }, [isLoggedIn, appLoading, fetchJoinedRooms])

  // Real-time hook for competitions and leaderboards
  const { activeCompetitions, leaderboards, lastUpdate } = useStudentDashboardRealtime(
    userProfile?.id,
    joinedRooms
  )

  // Auto-refresh rooms when real-time updates occur
  useEffect(() => {
    if (lastUpdate > 0 && joinedRooms.length > 0) {
      // Debounce: only refresh if last update was recent
      const timeSinceUpdate = Date.now() - lastUpdate
      if (timeSinceUpdate < 1000) {
        void fetchJoinedRooms()
      }
    }
  }, [lastUpdate, fetchJoinedRooms, joinedRooms.length])

  // Fetch assessment results
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!userProfile?.id) return
      
      setAssessmentLoading(true)
      try {
        // Fetch pretest
        const pretestResponse: any = await getAssessmentResults(userProfile.id, 'pretest')
        console.log('[Dashboard] Pretest response:', pretestResponse)
        // Handle both response formats: {success: false} or direct data
        if (pretestResponse?.categoryScores) {
          console.log('[Dashboard] Pretest category scores:', pretestResponse.categoryScores)
          setPretestScores(pretestResponse.categoryScores)
        } else if (pretestResponse?.success && pretestResponse?.results) {
          console.log('[Dashboard] Pretest category scores:', pretestResponse.results.categoryScores)
          setPretestScores(pretestResponse.results.categoryScores)
        }
      } catch (error) {
        console.log('[Dashboard] No pretest results found:', error)
      }

      try {
        // Fetch posttest
        const posttestResponse: any = await getAssessmentResults(userProfile.id, 'posttest')
        console.log('[Dashboard] Posttest response:', posttestResponse)
        // Handle both response formats: {success: false} or direct data
        if (posttestResponse?.categoryScores) {
          console.log('[Dashboard] Posttest category scores:', posttestResponse.categoryScores)
          setPosttestScores(posttestResponse.categoryScores)
        } else if (posttestResponse?.success && posttestResponse?.results) {
          console.log('[Dashboard] Posttest category scores:', posttestResponse.results.categoryScores)
          setPosttestScores(posttestResponse.results.categoryScores)
        }
      } catch (error) {
        console.log('[Dashboard] No posttest results found:', error)
      }

      setAssessmentLoading(false)
    }

    fetchAssessments()
  }, [userProfile?.id])

  // Fetch castle progress
  useEffect(() => {
    const fetchCastles = async () => {
      if (!userProfile?.id) return
      
      setCastlesLoading(true)
      try {
        const castleData = await getAllCastles(userProfile.id)
        console.log('[Dashboard] Castle data received:', castleData)
        console.log('[Dashboard] Sample castle:', castleData[0])
        setCastles(castleData)
      } catch (error) {
        console.error('[Dashboard] Error fetching castles:', error)
      }
      setCastlesLoading(false)
    }

    fetchCastles()
  }, [userProfile?.id])

  const handleJoinRoom = () => {
    router.push(STUDENT_ROUTES.JOINED_ROOMS)
  }

  const handleViewRoom = (roomCode: string | number) => {
    router.push(`/student/joined-rooms/${roomCode}`)
  }

  const handleCompetitionClick = (competition: CompetitionWithRoom) => {
    const roomParam = competition.room_id ? `?room=${competition.room_id}` : '';
    if (competition.status === 'ONGOING') {
      router.push(`/student/competition/${competition.id}/play${roomParam}`)
    } else {
      router.push(`/student/competition/${competition.id}${roomParam}`)
    }
  }

  if (appLoading || !isLoggedIn) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={dashboardStyles["dashboard-container"]}>
      {/* Fixed Header */}
      <PageHeader 
        title={`Welcome back, ${userProfile?.first_name || 'Student'}!`}
        subtitle="Continue your learning journey and track your progress"
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'S'}
      />

      {/* Scrollable Content */}
      <div className={dashboardStyles["scrollable-content"]}>

        {/* Top Section: Mini Profile + Quick Actions */}
        <div className={studentStyles.topSection}>
          {/* Mini Profile Card */}
          <section className={studentStyles.miniProfileCard}>
            {userProfile?.profile_pic ? (
              <AnimatedAvatar
                className={studentStyles.miniProfileImg}
                src={userProfile.profile_pic}
                alt="Profile"
              />
            ) : (
              <div className={studentStyles.miniProfileLetter}>
                {userProfile?.first_name?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <div className={studentStyles.miniProfileInfo}>
              <h3 className={studentStyles.miniProfileName}>
                {userProfile?.first_name} {userProfile?.last_name}
              </h3>
              <p className={studentStyles.miniProfileRole}>
                Student
              </p>
            </div>
            <button 
              className={studentStyles.viewProfileButton}
              onClick={() => router.push(STUDENT_ROUTES.PROFILE)}
            >
              View Full Profile
            </button>
          </section>

          {/* Quick Actions Cards */}
          <div className={studentStyles.quickActionsGrid}>
            <button 
              className={studentStyles.quickActionCard}
              onClick={() => router.push(STUDENT_ROUTES.WORLD_MAP)}
            >
              <div className={studentStyles.quickActionIcon}>
                <FaFortAwesome />
              </div>
              <div className={studentStyles.quickActionContent}>
                <h4>Adventure Mode</h4>
                <p>Explore the world map</p>
              </div>
            </button>
            
            <button 
              className={studentStyles.quickActionCard}
              onClick={handleJoinRoom}
            >
              <div className={studentStyles.quickActionIcon}>
                <FaDungeon />
              </div>
              <div className={studentStyles.quickActionContent}>
                <h4>Join Room</h4>
                <p>Enter a room code</p>
              </div>
            </button>

            <button 
              className={studentStyles.quickActionCard}
              onClick={() => router.push(STUDENT_ROUTES.LEADERBOARD)}
            >
              <div className={studentStyles.quickActionIcon}>
                <FaMedal />
              </div>
              <div className={studentStyles.quickActionContent}>
                <h4>Leaderboard</h4>
                <p>See top performers</p>
              </div>
            </button>
          </div>
        </div>

        {/* Performance Tracking Section with Tabs */}
        {(!assessmentLoading && (pretestScores || posttestScores)) || (!castlesLoading && castles.length > 0) ? (
          <section className={studentStyles.performanceSection}>
            <div className={studentStyles.sectionHeader}>
              <h2>Your Progress</h2>
            </div>
            
            <div className={studentStyles.performanceCard}>
              {/* Tab Navigation */}
              <div className={studentStyles.tabNavigation}>
                <button
                  className={`${studentStyles.tabButton} ${activeTab === 'castle' ? studentStyles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('castle')}
                  disabled={castles.length === 0}
                >
                  Castle Progress
                </button>
                <button
                  className={`${studentStyles.tabButton} ${activeTab === 'assessment' ? studentStyles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('assessment')}
                  disabled={!pretestScores && !posttestScores}
                >
                  Assessment Performance
                </button>
              </div>

              {/* Tab Content */}
              <div className={studentStyles.tabContent}>
                {activeTab === 'castle' && castles.length > 0 && (
                  <div className={studentStyles.castleContent}>
                    <div className={studentStyles.castleGrid}>
                      {castles.map((castle) => {
                        console.log('[Dashboard] Castle:', castle.name, 'total_chapters:', castle.total_chapters, 'full data:', castle)
                        const totalChapters = castle.total_chapters || 0
                        const progressPercent = castle.progress?.completion_percentage || 0
                        // Estimate completed chapters based on completion percentage
                        const completedChapters = totalChapters > 0 
                          ? Math.floor((progressPercent / 100) * totalChapters)
                          : 0
                        const userXp = castle.progress?.total_xp_earned || 0
                        const isUnlocked = castle.progress?.unlocked || false
                        const isCompleted = castle.progress?.completed || false
                        
                        return (
                          <div key={castle.id} className={studentStyles.castleCard}>
                            <div className={studentStyles.castleHeader}>
                              <h4>{castle.name}</h4>
                              <span className={studentStyles.castleLevel}>Castle {castle.unlock_order}</span>
                            </div>
                            <div className={studentStyles.castleProgress}>
                              <div className={studentStyles.progressBar}>
                                <div 
                                  className={studentStyles.progressFill}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className={studentStyles.progressText}>
                                {completedChapters} / {totalChapters} chapters
                              </span>
                            </div>
                            <div className={studentStyles.castleStats}>
                              <div className={studentStyles.castleStat}>
                                <span className={studentStyles.statLabel}>XP Earned</span>
                                <span className={studentStyles.statValue}>{userXp}</span>
                              </div>
                              <div className={studentStyles.castleStat}>
                                <span className={studentStyles.statLabel}>Status</span>
                                <span className={studentStyles.statValue}>
                                  {!isUnlocked ? 'Locked' : isCompleted ? 'Complete' : progressPercent > 0 ? 'In Progress' : 'Not Started'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'assessment' && (pretestScores || posttestScores) && (
                  <div className={studentStyles.assessmentContent}>
                    <div className={studentStyles.assessmentInfo}>
                      <h3>Knowledge Assessment Progress</h3>
                      <p>
                        {pretestScores && posttestScores
                          ? "View your learning journey from pretest to posttest"
                          : pretestScores
                          ? "Complete your posttest to see your improvement"
                          : "Your posttest results are ready"}
                      </p>
                      <div className={studentStyles.assessmentStats}>
                        <div className={studentStyles.statBadge}>
                          <span className={studentStyles.statIcon}>{pretestScores ? '✓' : '○'}</span>
                          <span>Pretest {pretestScores ? 'Complete' : 'Pending'}</span>
                        </div>
                        <div className={studentStyles.statBadge}>
                          <span className={studentStyles.statIcon}>{posttestScores ? '✓' : '○'}</span>
                          <span>Posttest {posttestScores ? 'Complete' : 'Pending'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={studentStyles.assessmentChartWrapper}>
                      <AssessmentRadarChart
                        currentScores={posttestScores || pretestScores}
                        pretestScores={posttestScores ? pretestScores : undefined}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* Active Competitions Section */}
        {activeCompetitions.length > 0 && (
          <section className={dashboardStyles["card"]}>
            <div className={competitionStyles.section_header}>
              <div>
                <h2 className={`${competitionStyles.section_title} ${competitionStyles.student}`}>
                  <span className={competitionStyles.icon}>⚡</span>
                  Active Competitions
                </h2>
                <p className={competitionStyles.section_subtitle}>
                  Jump into ongoing or upcoming competitions
                </p>
              </div>
            </div>
            
            <div className={competitionStyles.competitions_grid}>
              {activeCompetitions.map(competition => (
                <div 
                  key={competition.id} 
                  className={`${competitionStyles.competition_card} ${competitionStyles.student_card}`}
                  onClick={() => handleCompetitionClick(competition)}
                >
                  <div className={competitionStyles.competition_header}>
                    <h3 className={`${competitionStyles.competition_title} ${competitionStyles.student_title}`}>{competition.title}</h3>
                    <span className={`${competitionStyles.status_badge} ${competitionStyles[competition.status.toLowerCase()]}`}>
                      {competition.status === 'ONGOING' ? '🔴 LIVE' : '⏳ Starting Soon'}
                    </span>
                  </div>
                  
                  <div className={`${competitionStyles.competition_meta} ${competitionStyles.student_meta}`}>
                    <span className={competitionStyles.meta_item}>
                      📚 {competition.roomTitle || 'Unknown Room'}
                    </span>
                    <span className={competitionStyles.meta_item}>
                      🎯 {competition.problems?.length || 0} Problems
                    </span>
                    {competition.participants && (
                      <span className={competitionStyles.meta_item}>
                        👥 {competition.participants.length} Participants
                      </span>
                    )}
                  </div>

                  <div className={competitionStyles.competition_action}>
                    {competition.status === 'ONGOING' ? (
                      <button className={competitionStyles.join_button}>
                        🎮 Join Now
                      </button>
                    ) : (
                      <button className={competitionStyles.view_button}>
                        👀 View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leaderboards Section */}
        {leaderboards.length > 0 && (
          <section className={studentStyles.leaderboardsSection}>
            <div className={studentStyles.sectionHeader}>
              <h2>🏆 Top Performers</h2>
              <button 
                className={studentStyles.viewAllButton}
                onClick={() => router.push(STUDENT_ROUTES.LEADERBOARD)}
              >
                View All Rankings
              </button>
            </div>
            
            <div className={studentStyles.leaderboardsGrid}>
              {leaderboards.map((leaderboard) => (
                <div key={leaderboard.id} className={studentStyles.leaderboardCard}>
                  <h3 className={studentStyles.leaderboardTitle}>
                    📚 {leaderboard.title}
                  </h3>
                  <div className={studentStyles.leaderboardList}>
                    {leaderboard.data.map((item, index) => {
                      const participant = Array.isArray(item.participants) 
                        ? item.participants[0] 
                        : item.participants
                      return (
                        <div key={index} className={studentStyles.leaderboardItem}>
                          <div className={studentStyles.leaderboardRank}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div className={studentStyles.leaderboardUser}>
                            <div className={studentStyles.leaderboardUserAvatar}>
                              {participant?.first_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span className={studentStyles.leaderboardUserName}>
                              {participant?.first_name} {participant?.last_name}
                            </span>
                          </div>
                          <div className={studentStyles.leaderboardScore}>
                            {item.accumulated_xp} XP
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Joined Rooms Section */}
        <section className={studentStyles.roomsSection}>
          <div className={studentStyles.sectionHeader}>
            <h2>📚 Your Rooms</h2>
            {joinedRooms.length > 3 && (
              <button 
                className={studentStyles.viewAllButton}
                onClick={() => router.push(STUDENT_ROUTES.JOINED_ROOMS)}
              >
                View All Rooms
              </button>
            )}
          </div>
          
          {roomsLoading ? (
            <div className={dashboardStyles["loading-container"]}>
              <Loader />
            </div>
          ) : joinedRooms.length > 0 ? (
            <div className={dashboardStyles["room-cards"]}>
              <RoomCardsList 
                rooms={joinedRooms.slice(0, 4)} // Show first 3
                onViewRoom={handleViewRoom}
              />
            </div>
          ) : (
            <div className={dashboardStyles["no-data"]}>
              <span className={dashboardStyles["no-data-icon"]}>📚</span>
              <p className={dashboardStyles["no-data-text"]}>No Rooms Yet</p>
              <p className={dashboardStyles["no-data-subtext"]}>
                Join your first room to start learning!
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
