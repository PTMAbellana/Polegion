import React from 'react';
import styles from './ProblemLeaderboard.module.css';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  best_score: number;
  time_taken: number | null;
  attempt_count: number;
}

interface ProblemLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  loading?: boolean;
  emptyMessage?: string;
  showTimeColumn?: boolean;
}

const ProblemLeaderboard: React.FC<ProblemLeaderboardProps> = ({
  entries,
  currentUserId,
  loading = false,
  emptyMessage = 'No entries yet. Be the first to solve this problem!',
  showTimeColumn = true,
}) => {
  const formatTime = (seconds: number | null) => {
    if (!seconds) return '-';
    
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return styles.rankGold;
      case 2:
        return styles.rankSilver;
      case 3:
        return styles.rankBronze;
      default:
        return '';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏆</div>
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rankHeader}>Rank</th>
              <th className={styles.usernameHeader}>Username</th>
              <th className={styles.scoreHeader}>Score</th>
              {showTimeColumn && <th className={styles.timeHeader}>Time</th>}
              <th className={styles.attemptsHeader}>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isCurrentUser = entry.user_id === currentUserId;
              const rowClass = `${styles.row} ${isCurrentUser ? styles.currentUserRow : ''} ${getRankColor(entry.rank)}`;
              
              return (
                <tr key={entry.user_id} className={rowClass}>
                  <td className={styles.rankCell}>
                    <div className={styles.rankContent}>
                      <span className={styles.rankBadge}>
                        {getRankIcon(entry.rank)}
                      </span>
                      {isCurrentUser && (
                        <span className={styles.youBadge}>YOU</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.usernameCell}>
                    <div className={styles.usernameContent}>
                      {entry.username}
                      {isCurrentUser && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.starIcon}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className={styles.scoreCell}>
                    <div className={styles.scoreContent}>
                      <span className={styles.scoreValue}>{entry.best_score.toFixed(1)}</span>
                      <span className={styles.scoreMax}>/100</span>
                    </div>
                  </td>
                  {showTimeColumn && (
                    <td className={styles.timeCell}>
                      {formatTime(entry.time_taken)}
                    </td>
                  )}
                  <td className={styles.attemptsCell}>
                    <span className={styles.attemptsBadge}>{entry.attempt_count}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryIcon}>👥</span>
          <span className={styles.summaryText}>
            <strong>{entries.length}</strong> {entries.length === 1 ? 'solver' : 'solvers'}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryIcon}>📊</span>
          <span className={styles.summaryText}>
            Avg Score: <strong>{(entries.reduce((sum, e) => sum + e.best_score, 0) / entries.length).toFixed(1)}</strong>
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryIcon}>🎯</span>
          <span className={styles.summaryText}>
            Total Attempts: <strong>{entries.reduce((sum, e) => sum + e.attempt_count, 0)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemLeaderboard;
