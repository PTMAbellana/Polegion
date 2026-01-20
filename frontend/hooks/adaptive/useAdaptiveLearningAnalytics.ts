/**
 * Hook for Adaptive Learning Analytics
 * Simple stats fetching without session management
 */

import { useState, useCallback } from 'react';
import axios from '@/api/axios';

interface DailyActivity {
  date: string;
  sessions_count: number;
  total_time_seconds: number;
  questions_answered: number;
  questions_correct: number;
  topics_practiced: string[];
  unique_topics_count: number;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalSessions: number;
  totalTime: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  firstSessionDate: string | null;
  lastActivityDate: string | null;
}

interface TopicStat {
  topic_name: string;
  sessions: number;
  questions_attempted: number;
  questions_correct: number;
  total_time_seconds: number;
  accuracy: string;
}

export const useAdaptiveLearningAnalytics = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [topicBreakdown, setTopicBreakdown] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user statistics summary (simple - from adaptive progress)
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/adaptive-analytics/simple');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      console.error('[Analytics] Error fetching stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch weekly activity
   */
  const fetchWeeklyActivity = useCallback(async () => {
    try {
      const response = await axios.get('/adaptive-analytics/weekly');
      
      if (response.data.success) {
        setWeeklyActivity(response.data.data);
      }
    } catch (err: any) {
      console.error('[Analytics] Error fetching weekly activity:', err);
    }
  }, []);

  /**
   * Fetch topic breakdown
   */
  const fetchTopicBreakdown = useCallback(async (days: number = 30) => {
    try {
      const response = await axios.get(`/adaptive-analytics/topics?days=${days}`);
      
      if (response.data.success) {
        setTopicBreakdown(response.data.data);
      }
    } catch (err: any) {
      console.error('[Analytics] Error fetching topic breakdown:', err);
    }
  }, []);

  /**
   * Format seconds to readable time
   */
  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }, []);

  /**
   * Format date to readable string
   */
  const formatDate = useCallback((date: string | null): string => {
    if (!date) return 'Never';
    
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  return {
    // Statistics
    stats,
    weeklyActivity,
    topicBreakdown,
    
    // Fetch methods
    fetchStats,
    fetchWeeklyActivity,
    fetchTopicBreakdown,
    
    // Utility
    formatTime,
    formatDate,
    loading,
    error,
  };
};
