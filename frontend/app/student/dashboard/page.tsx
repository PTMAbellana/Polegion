"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import LoadingOverlay from "@/components/LoadingOverlay"
import PageHeader from "@/components/PageHeader"
import MiniProfileCard from "@/components/MiniProfileCard"
import { STUDENT_ROUTES } from "@/constants/routes"
import dashboardStyles from "@/styles/dashboard-wow.module.css"
import studentStyles from "@/styles/dashboard.module.css"
import { getAssessmentResults } from "@/api/assessments"
import AssessmentRadarChart from "@/components/assessment/AssessmentRadarChart"
import { getAllCastles } from "@/api/castles"
import { FaFortAwesome, FaFlask, FaFire, FaCalendarCheck, FaClock, FaQuestionCircle, FaCheckCircle, FaChartBar, FaHistory, FaGraduationCap, FaBook, FaPercentage } from 'react-icons/fa'
import axios from "axios"

export default function StudentDashboard() {
  const router = useRouter()
  const { isLoggedIn, appLoading, userProfile, authToken } = useAuthStore()

  // Assessment and castle state
  const [pretestScores, setPretestScores] = useState<any>(null)
  const [posttestScores, setPosttestScores] = useState<any>(null)
  const [assessmentLoading, setAssessmentLoading] = useState(true)
  const [castles, setCastles] = useState<any[]>([])
  const [castlesLoading, setCastlesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'assessment' | 'castle'>('castle')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [adaptiveRecentSessions, setAdaptiveRecentSessions] = useState<any[]>([]) // Adaptive learning sessions

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!authToken) return
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        
        // Fetch summary
        const summaryRes = await axios.get(`${backendUrl}/analytics/summary`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        setAnalyticsData(summaryRes.data.data)

        // Fetch weekly activity
        const weeklyRes = await axios.get(`${backendUrl}/analytics/weekly`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        setWeeklyActivity(weeklyRes.data.data)

        const sessionsRes = await axios.get(`${backendUrl}/analytics/sessions?limit=3`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        setRecentSessions(sessionsRes.data.data)

        // Fetch adaptive learning analytics - REPLACE the main stats
        try {
          const adaptiveSummaryRes = await axios.get(`${backendUrl}/adaptive-analytics/simple`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
          const adaptiveData = adaptiveSummaryRes.data.data
          console.log('[Dashboard] Adaptive stats:', adaptiveData)
          
          // REPLACE analyticsData with adaptive learning stats
          setAnalyticsData({
            streak: {
              currentStreak: adaptiveData.currentStreak || 0,
              longestStreak: adaptiveData.longestStreak || 0,
              totalLoginDays: adaptiveData.totalActiveDays || 0
            },
            totalDays: adaptiveData.totalActiveDays || 0,
            totalTime: Math.floor((adaptiveData.totalTime || 0) / 60), // Convert seconds to minutes
            totalQuestions: adaptiveData.totalQuestions || 0,
            accuracyRate: adaptiveData.overallAccuracy || 0
          })

          const adaptiveWeeklyRes = await axios.get(`${backendUrl}/adaptive-analytics/weekly`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
          // REPLACE weeklyActivity with adaptive weekly data
          const adaptiveWeeklyData = adaptiveWeeklyRes.data.data.map((day: any) => ({
            date: day.date,
            questionsAnswered: day.questions_answered || 0,
            timeSpent: Math.floor((day.total_time_seconds || 0) / 60), // Convert to minutes
            sessionsCount: day.sessions_count || 0
          }))
          setWeeklyActivity(adaptiveWeeklyData)

          // Fetch adaptive recent sessions
          const adaptiveSessionsRes = await axios.get(`${backendUrl}/adaptive-analytics/sessions?limit=3`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
          setAdaptiveRecentSessions(adaptiveSessionsRes.data.data)
        } catch (adaptiveError) {
          console.log('[Dashboard] Adaptive analytics not available yet:', adaptiveError)
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching analytics:', error)
      }
    }

    fetchAnalytics()
  }, [authToken])

  const formatTime = (minutes: number) => {
    // Handle NaN, null, undefined, or negative values
    if (!minutes || isNaN(minutes) || minutes < 0) return '0m';
    
    // Round to nearest minute
    const roundedMinutes = Math.round(minutes);
    
    if (roundedMinutes < 60) return `${roundedMinutes}m`;
    
    const hours = Math.floor(roundedMinutes / 60);
    const mins = roundedMinutes % 60;
    
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <MiniProfileCard
            firstName={userProfile?.first_name}
            lastName={userProfile?.last_name}
            profilePic={userProfile?.profile_pic}
            role="Student"
            profileRoute={STUDENT_ROUTES.PROFILE}
          />

          {/* Analytics Stats Section */}
          {analyticsData && (
            <div> 
              <div className={studentStyles.sectionHeader}>
                <h2>Learning Statistics</h2>
              </div>
              <div className={studentStyles.analyticsCard}>
                {/* Emphasized Day Streak Card */}
                <div className={studentStyles.streakCardLarge}>
                  <FaFire className={studentStyles.fireIcon} />
                  <div className={studentStyles.streakInfo}>
                    <div className={studentStyles.streakValue}>{analyticsData.streak?.currentStreak || 0}</div>
                    <div className={studentStyles.streakLabel}>Day Streak</div>
                  </div>
                  <div className={studentStyles.streakExtras}>
                    <span>🏆 Longest: {analyticsData.streak?.longestStreak || 0} days</span>
                    <span>📅 Total: {analyticsData.streak?.totalLoginDays || 0} days</span>
                  </div>
                </div>
                
                {/* Other 4 Stats in a Row */}
                <div className={studentStyles.statsRow}>
                  <div className={studentStyles.analyticsStatItem}>
                    <div className={studentStyles.analyticsIconWrapper} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                      <FaCalendarCheck />
                    </div>
                    <div className={studentStyles.analyticsStatInfo}>
                      <div className={studentStyles.analyticsStatValue}>{analyticsData.totalDays || 0}</div>
                      <div className={studentStyles.analyticsStatLabel}>Active Days</div>
                    </div>
                  </div>
                  <div className={studentStyles.analyticsStatItem}>
                    <div className={studentStyles.analyticsIconWrapper} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                      <FaClock />
                    </div>
                    <div className={studentStyles.analyticsStatInfo}>
                      <div className={studentStyles.analyticsStatValue}>{formatTime(analyticsData.totalTime || 0)}</div>
                      <div className={studentStyles.analyticsStatLabel}>Total Time</div>
                    </div>
                  </div>
                  <div className={studentStyles.analyticsStatItem}>
                    <div className={studentStyles.analyticsIconWrapper} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                      <FaQuestionCircle />
                    </div>
                    <div className={studentStyles.analyticsStatInfo}>
                      <div className={studentStyles.analyticsStatValue}>{analyticsData.totalQuestions || 0}</div>
                      <div className={studentStyles.analyticsStatLabel}>Questions Answered</div>
                    </div>
                  </div>
                  <div className={studentStyles.analyticsStatItem}>
                    <div className={studentStyles.analyticsIconWrapper} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                      <FaCheckCircle />
                    </div>
                    <div className={studentStyles.analyticsStatInfo}>
                      <div className={studentStyles.analyticsStatValue}>{analyticsData.accuracyRate?.toFixed(1) || 0}%</div>
                      <div className={studentStyles.analyticsStatLabel}>Accuracy</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Action Buttons */}
                <div className={studentStyles.quickActionsCompact}>
                  <button 
                    className={studentStyles.quickActionButtonSmall}
                    onClick={() => router.push(STUDENT_ROUTES.WORLD_MAP)}
                  >
                    <FaFortAwesome />
                    <span>Adventure Mode</span>
                  </button>
                  
                  <button 
                    className={studentStyles.quickActionButtonSmall}
                    onClick={() => router.push(STUDENT_ROUTES.ADAPTIVE_LEARNING)}
                  >
                    <FaFlask />
                    <span>Adaptive Learning</span>
                  </button>
                </div>
              </div>
            </div>
          )}
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

      </div>
    </div>
  )
}
