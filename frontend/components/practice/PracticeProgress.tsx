// ============================================================================
// PRACTICE PROGRESS COMPONENT
// ============================================================================
// Tracks and displays practice session statistics
// ============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/practice.module.css';

interface PracticeStats {
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  categoryStats: Record<string, { attempts: number; correct: number; total: number }>;
}

interface PracticeProgressProps {
  category?: string;
}

export default function PracticeProgress({ category }: PracticeProgressProps) {
  const [stats, setStats] = useState<PracticeStats>({
    totalAttempts: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    categoryStats: {},
  });

  useEffect(() => {
    // Load stats from localStorage
    const saved = localStorage.getItem('practice-stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const overallPercentage = stats.totalQuestions > 0 
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) 
    : 0;

  const categoryData = category && stats.categoryStats[category];
  const categoryPercentage = categoryData && categoryData.total > 0
    ? Math.round((categoryData.correct / categoryData.total) * 100)
    : 0;

  if (category && categoryData) {
    return (
      <div className={styles.progressCard}>
        <h4 className={styles.progressTitle}>Your Progress</h4>
        <div className={styles.progressStats}>
          <div className={styles.progressItem}>
            <span className={styles.progressValue}>{categoryPercentage}%</span>
            <span className={styles.progressLabel}>Accuracy</span>
          </div>
          <div className={styles.progressItem}>
            <span className={styles.progressValue}>{categoryData.attempts}</span>
            <span className={styles.progressLabel}>Attempts</span>
          </div>
          <div className={styles.progressItem}>
            <span className={styles.progressValue}>{categoryData.correct}/{categoryData.total}</span>
            <span className={styles.progressLabel}>Correct</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.progressCard}>
      <h4 className={styles.progressTitle}>Overall Progress</h4>
      <div className={styles.progressStats}>
        <div className={styles.progressItem}>
          <span className={styles.progressValue}>{overallPercentage}%</span>
          <span className={styles.progressLabel}>Overall Accuracy</span>
        </div>
        <div className={styles.progressItem}>
          <span className={styles.progressValue}>{stats.totalAttempts}</span>
          <span className={styles.progressLabel}>Total Attempts</span>
        </div>
        <div className={styles.progressItem}>
          <span className={styles.progressValue}>{stats.totalCorrect}/{stats.totalQuestions}</span>
          <span className={styles.progressLabel}>Questions Answered</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to save practice stats
export function savePracticeStats(category: string, score: number, total: number) {
  const saved = localStorage.getItem('practice-stats');
  const stats: PracticeStats = saved ? JSON.parse(saved) : {
    totalAttempts: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    categoryStats: {},
  };

  stats.totalAttempts += 1;
  stats.totalCorrect += score;
  stats.totalQuestions += total;

  if (!stats.categoryStats[category]) {
    stats.categoryStats[category] = { attempts: 0, correct: 0, total: 0 };
  }

  stats.categoryStats[category].attempts += 1;
  stats.categoryStats[category].correct += score;
  stats.categoryStats[category].total += total;

  localStorage.setItem('practice-stats', JSON.stringify(stats));
}
