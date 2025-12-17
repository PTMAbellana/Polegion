import { useMemo } from 'react';
import Gamepage from '@/components/Gamepage';
import styles from '@/styles/submission-viewer.module.css';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  expected_xp: number;
  description?: string;
}

interface Participant {
  id: string;
  user_id: string;
  fullName?: string;
  accumulated_xp: number;
}

interface SubmissionDisplayProps {
  selectedProblem: Problem | null;
  selectedParticipant: Participant | null;
  submission: any | null;
  loading: boolean;
  competitionId: number;
  roomId: string;
}

export default function SubmissionDisplay({
  selectedProblem,
  selectedParticipant,
  submission,
  loading,
  competitionId,
  roomId
}: SubmissionDisplayProps) {
  const xpEarned = submission?.xp_gained ?? submission?.xp_earned ?? 0;
  const isCorrect = typeof submission?.is_correct === 'boolean'
    ? submission.is_correct
    : xpEarned > 0;

  const feedback = submission?.feedback;

  const resolvedShapes = useMemo(() => {
    if (!submission) return [];
    if (Array.isArray(submission.participant_solution)) return submission.participant_solution;
    if (submission.participant_solution) {
      return submission.participant_solution;
    }
    if (Array.isArray(submission.solution)) return submission.solution;
    if (submission.solution) {
      try {
        return JSON.parse(submission.solution);
      } catch (error) {
        console.error('Failed to parse submission solution', error);
        return [];
      }
    }
    return [];
  }, [submission]);

  return (
    <div className={styles.displayContainer}>
      {!selectedProblem && !selectedParticipant && (
        <div className={styles.placeholderState}>
          <div className={styles.placeholderIcon}>📝</div>
          <h3>Select a Problem and Participant</h3>
          <p>Choose a problem from the list, then select a participant to view their submission.</p>
        </div>
      )}

      {selectedProblem && !selectedParticipant && (
        <div className={styles.placeholderState}>
          <div className={styles.placeholderIcon}>👤</div>
          <h3>Select a Participant</h3>
          <p>Choose a participant to view their submission for <strong>{selectedProblem.title}</strong>.</p>
        </div>
      )}

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading submission...</p>
        </div>
      )}

      {!loading && selectedProblem && selectedParticipant && !submission && (
        <div className={styles.emptySubmissionState}>
          <div className={styles.emptyIcon}>❌</div>
          <h3>No Submission Found</h3>
          <p>
            <strong>{selectedParticipant.fullName || 'Participant'}</strong> has not submitted an answer for{' '}
            <strong>{selectedProblem.title}</strong>.
          </p>
        </div>
      )}

      {!loading && submission && selectedProblem && selectedParticipant && (
        <div className={styles.submissionDisplay}>
          <div className={styles.submissionHeader}>
            <div className={styles.submissionInfo}>
              <h3>{(selectedParticipant.fullName || 'Participant')}'s Answer</h3>
              <p>{selectedProblem.title}</p>
              {submission.submitted_at && (
                <span className={styles.submissionMeta}>Submitted {new Date(submission.submitted_at).toLocaleString()}</span>
              )}
            </div>
            <div className={styles.submissionStatus}>
              <span className={isCorrect ? styles.correct : styles.incorrect}>
                {isCorrect ? '✓ Correct' : '✗ Needs Review'}
              </span>
              <span className={styles.xpEarned}>{xpEarned} XP Earned</span>
            </div>
          </div>

          {feedback && (
            <div className={styles.feedbackCallout}>
              <span>Feedback:</span>
              <p>{feedback}</p>
            </div>
          )}
          
          <div className={styles.gameContainer}>
            <Gamepage
              roomCode=""
              competitionId={competitionId}
              roomId={roomId}
              isFullScreenMode={false}
              viewMode="readonly"
              initialShapes={resolvedShapes}
              problemData={{
                ...selectedProblem,
                description: submission.problem?.description || selectedProblem.description || ''
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
