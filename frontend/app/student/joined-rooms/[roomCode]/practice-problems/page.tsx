"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/api/axios';
import styles from './practice-problems.module.css';
import Loader from '@/components/Loader';

interface PublicProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard';
  problem_type: string;
  expected_xp: number;
  total_attempts: number;
  unique_solvers: number;
  average_score: number | null;
  highest_score: number | null;
  user_best_score?: number | null;
  user_attempts?: number;
  user_last_attempt?: string | null;
}

const DIFFICULTY_COLORS = {
  Easy: '#10b981',
  Intermediate: '#f59e0b',
  Hard: '#ef4444',
};

const PROBLEM_TYPE_LABELS: Record<string, string> = {
  general: 'General',
  angle_complementary: 'Complementary Angles',
  angle_supplementary: 'Supplementary Angles',
  perimeter_square: 'Square Perimeter',
  perimeter_rectangle: 'Rectangle Perimeter',
  area_square: 'Square Area',
  area_rectangle: 'Rectangle Area',
  // Add more as needed
};

export default function PracticeProblemsPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const router = useRouter();
  const { roomCode } = use(params);
  
  const [problems, setProblems] = useState<PublicProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<PublicProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  
  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublicProblems();
  }, [roomCode]);

  useEffect(() => {
    applyFilters();
  }, [problems, difficultyFilter, typeFilter, searchQuery]);

  const fetchPublicProblems = async () => {
    try {
      setLoading(true);
      
      // First get room info to get room ID
      const roomResponse = await axios.get(`/rooms/${roomCode}`);
      setRoomInfo(roomResponse.data.data);
      const roomId = roomResponse.data.data.id;
      
      // Then fetch public problems
      const response = await axios.get(`/problems/public/${roomId}`);
      setProblems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching public problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(p => p.difficulty === difficultyFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.problem_type === typeFilter);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProblems(filtered);
  };

  const handleTakeProblem = (problemId: string) => {
    router.push(`/student/joined-rooms/${roomCode}/practice-problems/${problemId}`);
  };

  const getProblemTypeLabel = (type: string) => {
    return PROBLEM_TYPE_LABELS[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const uniqueTypes = Array.from(new Set(problems.map(p => p.problem_type)));

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          onClick={() => router.push(`/student/joined-rooms/${roomCode}`)}
          className={styles.backButton}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Room
        </button>
        
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Practice Problems</h1>
          {roomInfo && <p className={styles.roomName}>{roomInfo.name}</p>}
          <p className={styles.subtitle}>
            Solve public problems to improve your skills and climb the leaderboard!
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search</label>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Difficulty</label>
          <select
            className={styles.filterSelect}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Problem Type</label>
          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {getProblemTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statValue}>{problems.length}</div>
          <div className={styles.statLabel}>Total Problems</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>
            {problems.filter(p => p.user_best_score && p.user_best_score >= 70).length}
          </div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statValue}>
            {problems.filter(p => p.user_attempts && p.user_attempts > 0).length}
          </div>
          <div className={styles.statLabel}>Attempted</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statValue}>
            {problems.reduce((sum, p) => sum + (p.user_best_score || 0), 0)}
          </div>
          <div className={styles.statLabel}>Total Score</div>
        </div>
      </div>

      {/* Problems List */}
      <div className={styles.problemsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Available Problems</h2>
          <span className={styles.problemCount}>
            {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
          </span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No problems found</h3>
            <p className={styles.emptyText}>
              {problems.length === 0 
                ? 'No public problems available yet. Check back later!'
                : 'Try adjusting your filters to see more problems.'}
            </p>
          </div>
        ) : (
          <div className={styles.problemsGrid}>
            {filteredProblems.map((problem) => (
              <div key={problem.id} className={styles.problemCard}>
                {/* Header */}
                <div className={styles.problemHeader}>
                  <div className={styles.problemTitleRow}>
                    <h3 className={styles.problemTitle}>{problem.title}</h3>
                    <span 
                      className={styles.difficultyBadge}
                      style={{ background: DIFFICULTY_COLORS[problem.difficulty] }}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <span className={styles.problemType}>
                    {getProblemTypeLabel(problem.problem_type)}
                  </span>
                </div>

                {/* Description */}
                <p className={styles.problemDescription}>{problem.description}</p>

                {/* Stats */}
                <div className={styles.problemStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statItemIcon}>👥</span>
                    <span className={styles.statItemText}>{problem.unique_solvers} solvers</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statItemIcon}>📝</span>
                    <span className={styles.statItemText}>{problem.total_attempts} attempts</span>
                  </div>
                  {problem.highest_score && (
                    <div className={styles.statItem}>
                      <span className={styles.statItemIcon}>🏆</span>
                      <span className={styles.statItemText}>Best: {problem.highest_score.toFixed(0)}</span>
                    </div>
                  )}
                </div>

                {/* Personal Stats */}
                {problem.user_attempts && problem.user_attempts > 0 && (
                  <div className={styles.personalStats}>
                    <div className={styles.personalStatItem}>
                      <span className={styles.personalLabel}>Your Best:</span>
                      <span className={styles.personalValue}>
                        {problem.user_best_score?.toFixed(0) || 0}
                      </span>
                    </div>
                    <div className={styles.personalStatItem}>
                      <span className={styles.personalLabel}>Attempts:</span>
                      <span className={styles.personalValue}>{problem.user_attempts}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.takeButton}
                    onClick={() => handleTakeProblem(problem.id)}
                  >
                    {problem.user_attempts && problem.user_attempts > 0 ? 'Try Again' : 'Take Problem'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                  
                  <button
                    className={styles.leaderboardButton}
                    onClick={() => router.push(`/student/joined-rooms/${roomCode}/practice-problems/${problem.id}/leaderboard`)}
                    title="View Leaderboard"
                  >
                    🏆
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
