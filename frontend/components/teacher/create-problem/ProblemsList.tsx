import React from 'react';
import styles from '@/styles/create-problem-teacher.module.css';

const DIFFICULTY_COLORS = {
  Easy: "#8FFFC2",
  Intermediate: "#FFFD9B",
  Hard: "#FFB49B",
};

interface Problem {
  id: string;
  title?: string | null;
  description?: string | null;
  visibility: string;
  difficulty: string;
  max_attempts: number;
  expected_xp: number;
  timer?: number | null;
  hint?: string | null;
}

interface ProblemsListProps {
  problems: Problem[];
  onEdit: (problemId: string) => void;
  onDelete: (problemId: string) => void;
}

const ProblemsList: React.FC<ProblemsListProps> = ({ problems, onEdit, onDelete }) => {
  if (problems.length === 0) {
    return (
      <div className={styles.noProblems}>
        <div className={styles.noProblemsIcon}>📝</div>
        <div className={styles.noProblemsText}>No problems created yet.</div>
        <div className={styles.noProblemsSubtext}>Create your first problem to get started!</div>
      </div>
    );
  }

  return (
    <ul className={styles.problemList}>
      {problems.map(problem => (
        <li key={problem.id} className={styles.problemItem}>
          <div className={styles.problemItemHeader}>
            <div className={styles.problemTitle}>
              {problem.title || "Untitled Problem"}
            </div>
            <div className={styles.buttonGroup}>
              <button 
                onClick={() => onEdit(problem.id)} 
                className={styles.editButton}
                title="Edit this problem"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(problem.id)} 
                className={styles.deleteButton}
                title="Delete this problem"
              >
                Delete
              </button>
            </div>
          </div>
          <div className={styles.problemDetails}>
            <span 
              className={styles.problemDifficulty} 
              style={{ backgroundColor: DIFFICULTY_COLORS[problem.difficulty as keyof typeof DIFFICULTY_COLORS] }}
            >
              {problem.difficulty}
            </span>
            <span 
              className={`${styles.problemVisibility} ${styles[problem.visibility]}`}
            >
              {problem.visibility}
            </span>
            <div className={styles.problemMeta}>
              <span className={styles.problemAttempts}>
                {problem.max_attempts} {problem.max_attempts === 1 ? 'attempt' : 'attempts'}
              </span>
              <span className={styles.problemXp}>
                {problem.expected_xp} XP
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProblemsList;
