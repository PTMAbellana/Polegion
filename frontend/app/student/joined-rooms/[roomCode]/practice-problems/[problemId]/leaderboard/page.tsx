"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getProblemLeaderboard } from '@/api/problems';
import ProblemLeaderboard from '@/components/student/ProblemLeaderboard';
import { useAuthStore } from '@/store/authStore';
import styles from './leaderboard.module.css';

export default function ProblemLeaderboardPage({ params }: { params: Promise<{ problemId: string }> }) {
  const router = useRouter();
  const { problemId } = use(params);
  const { userProfile } = useAuthStore();
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [problemInfo, setProblemInfo] = useState<any>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [problemId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await getProblemLeaderboard(problemId, 100);
      
      console.log('Leaderboard response:', response);
      
      if (response.success) {
        console.log('Leaderboard data:', response.data);
        setLeaderboard(response.data || []);
      } else {
        console.error('Leaderboard fetch failed:', response.message);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => router.back()}
          className={styles.backButton}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>🏆 Leaderboard</h1>
          {problemInfo && <p className={styles.problemTitle}>{problemInfo.title}</p>}
        </div>
      </div>

      <div className={styles.content}>
        <ProblemLeaderboard 
          entries={leaderboard}
          currentUserId={userProfile?.id}
          loading={loading}
          showTimeColumn={true}
        />
      </div>
    </div>
  );
}
