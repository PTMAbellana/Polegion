"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import LandscapePrompt from "@/components/LandscapePrompt";
import styles from "./analytics.module.css";
import { 
  FaCalendarCheck, 
  FaClock, 
  FaFire, 
  FaQuestionCircle, 
  FaCheckCircle, 
  FaChartLine,
  FaTrophy 
} from "react-icons/fa";

interface AnalyticsSummary {
  totalDays: number;
  totalTime: number;
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  averageTimePerDay: number;
  accuracyRate: number;
  streak: {
    currentStreak: number;
    longestStreak: number;
    totalLoginDays: number;
    lastLoginDate: string | null;
  };
}

interface WeeklyActivity {
  date: string;
  dayName: string;
  questionsAnswered: number;
  questionsCorrect: number;
  totalTimeMinutes: number;
}

interface Session {
  id: string;
  session_start: string;
  session_end: string | null;
  duration_minutes: number;
  questions_attempted: number;
  questions_correct: number;
}

export default function AnalyticsPage() {
  const { authToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [authToken]);

  const fetchAnalytics = async () => {
    if (!authToken) {
      console.error('[Analytics] No token available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      console.log('[Analytics] Fetching data with token:', authToken?.substring(0, 20) + '...');
      
      const [summaryRes, weeklyRes, sessionsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/analytics/summary`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get(`${backendUrl}/api/analytics/weekly`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get(`${backendUrl}/api/analytics/sessions?limit=5`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      console.log('[Analytics] Data fetched successfully');
      setSummary(summaryRes.data.data);
      setWeeklyActivity(weeklyRes.data.data);
      setRecentSessions(sessionsRes.data.data);
    } catch (error) {
      console.error('[Analytics] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <FaChartLine style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
          <p>No analytics data available yet.</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
            Start learning to see your progress here!
          </p>
          <button onClick={fetchAnalytics} className={styles.retryBtn}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const maxWeeklyQuestions = Math.max(...weeklyActivity.map(d => d.questionsAnswered), 1);

  return (
    <div className={styles.container}>
      <LandscapePrompt />
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1>Learning Analytics</h1>
          <p>Track your progress and stay motivated!</p>
        </div>

        {/* Streak Section */}
        <div className={styles.streakSection}>
        <div className={styles.streakCard}>
          <FaFire className={styles.fireIcon} />
          <div className={styles.streakInfo}>
            <h2>{summary.streak.currentStreak}</h2>
            <p>Day Streak</p>
          </div>
        </div>
        <div className={styles.streakDetails}>
          <div className={styles.streakStat}>
            <FaTrophy />
            <span>Longest: {summary.streak.longestStreak} days</span>
          </div>
          <div className={styles.streakStat}>
            <FaCalendarCheck />
            <span>Total: {summary.streak.totalLoginDays} days</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <FaCalendarCheck />
          </div>
          <div className={styles.statContent}>
            <h3>{summary.totalDays}</h3>
            <p>Active Days</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <FaClock />
          </div>
          <div className={styles.statContent}>
            <h3>{formatTime(summary.totalTime)}</h3>
            <p>Total Time</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <FaQuestionCircle />
          </div>
          <div className={styles.statContent}>
            <h3>{summary.totalQuestions}</h3>
            <p>Questions Answered</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <h3>{summary.accuracyRate.toFixed(1)}%</h3>
            <p>Accuracy Rate</p>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className={styles.chartSection}>
        <h2>
          <FaChartLine /> Weekly Activity
        </h2>
        <div className={styles.chart}>
          {weeklyActivity.map((day, idx) => (
            <div key={idx} className={styles.chartBar}>
              <div
                className={styles.bar}
                style={{
                  height: `${(day.questionsAnswered / maxWeeklyQuestions) * 100}%`,
                  backgroundColor: day.questionsAnswered > 0 ? '#4CAF50' : '#e0e0e0'
                }}
                title={`${day.questionsAnswered} questions, ${formatTime(day.totalTimeMinutes)}`}
              >
                <span className={styles.barValue}>
                  {day.questionsAnswered > 0 ? day.questionsAnswered : ''}
                </span>
              </div>
              <div className={styles.barLabel}>
                {day.dayName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className={styles.sessionsSection}>
        <h2>Recent Sessions</h2>
        {recentSessions.length === 0 ? (
          <p className={styles.noData}>No sessions yet. Start learning!</p>
        ) : (
          <div className={styles.sessionsList}>
            {recentSessions.map((session) => (
              <div key={session.id} className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  {formatDate(session.session_start)}
                </div>
                <div className={styles.sessionStats}>
                  <span>
                    <FaClock /> {formatTime(session.duration_minutes || 0)}
                  </span>
                  <span>
                    <FaQuestionCircle /> {session.questions_attempted} questions
                  </span>
                  <span>
                    <FaCheckCircle /> {session.questions_correct} correct
                  </span>
                  <span className={styles.sessionAccuracy}>
                    {session.questions_attempted > 0
                      ? `${((session.questions_correct / session.questions_attempted) * 100).toFixed(0)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
