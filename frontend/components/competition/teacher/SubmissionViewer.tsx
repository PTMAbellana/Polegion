"use client";

import { useState, useEffect } from 'react';
import { getSubmissionsByProblem } from '@/api/attempt';
import Gamepage from '@/components/Gamepage';
import styles from '@/styles/submission-viewer.module.css';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  expected_xp: number;
}

interface Participant {
  id: string;
  user_id: string;
  fullName: string;
  accumulated_xp: number;
}

interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  shapes: any[];
  submitted_at: string;
  is_correct: boolean;
  xp_earned: number;
}

interface SubmissionViewerProps {
  problems: Problem[];
  participants: Participant[];
  competitionId: number;
  roomId: string;
}

export default function SubmissionViewer({
  problems,
  participants,
  competitionId,
  roomId
}: SubmissionViewerProps) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Load submission when both problem and participant are selected
  useEffect(() => {
    const loadSubmission = async () => {
      if (!selectedProblem || !selectedParticipant) {
        setSubmission(null);
        return;
      }

      setLoading(true);
      try {
        // Fetch submissions for this problem and filter by user
        const response = await getSubmissionsByProblem(selectedProblem.id);
        
        if (response.success && response.data) {
          const userSubmission = response.data.find(
            (s: any) => s.user_id === selectedParticipant.user_id
          );
          
          setSubmission(userSubmission || null);
        }
      } catch (error) {
        console.error('Error loading submission:', error);
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [selectedProblem, selectedParticipant]);

  return {
    // Return filters for left column
    filtersComponent: (
      <div className={styles.filtersContainer}>
        {/* Problem Selection */}
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Problems</h3>
            <span className={styles.filterCount}>{problems.length}</span>
          </div>
          <div className={styles.problemList}>
            {problems.length === 0 ? (
              <div className={styles.emptyState}>No problems</div>
            ) : (
              problems.map((problem, index) => (
                <div
                  key={problem.id}
                  className={`${styles.problemItem} ${selectedProblem?.id === problem.id ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedProblem(problem);
                    setSelectedParticipant(null);
                    setSubmission(null);
                  }}
                >
                  <span className={styles.problemNumber}>{index + 1}</span>
                  <div className={styles.problemDetails}>
                    <span className={styles.problemTitle}>{problem.title}</span>
                    <span className={styles.problemDifficulty} data-difficulty={problem.difficulty}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Participant Selection */}
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Participants</h3>
            <span className={styles.filterCount}>{participants.length}</span>
          </div>
          <div className={styles.participantList}>
            {participants.length === 0 ? (
              <div className={styles.emptyState}>No participants</div>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className={`${styles.participantItem} ${selectedParticipant?.id === participant.id ? styles.selected : ''} ${!selectedProblem ? styles.disabled : ''}`}
                  onClick={() => selectedProblem && setSelectedParticipant(participant)}
                >
                  <div className={styles.participantAvatar}>
                    {participant.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className={styles.participantDetails}>
                    <span className={styles.participantName}>{participant.fullName}</span>
                    <span className={styles.participantXp}>{participant.accumulated_xp} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    ),

    // Return main display for middle column
    displayComponent: (
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
              <strong>{selectedParticipant.fullName}</strong> has not submitted an answer for{' '}
              <strong>{selectedProblem.title}</strong>.
            </p>
          </div>
        )}

        {!loading && submission && selectedProblem && selectedParticipant && (
          <div className={styles.submissionDisplay}>
            <div className={styles.submissionHeader}>
              <div className={styles.submissionInfo}>
                <h3>{selectedParticipant.fullName}'s Answer</h3>
                <p>{selectedProblem.title}</p>
              </div>
              <div className={styles.submissionStatus}>
                <span className={submission.is_correct ? styles.correct : styles.incorrect}>
                  {submission.is_correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
                <span className={styles.xpEarned}>{submission.xp_earned || 0} XP Earned</span>
              </div>
            </div>
            
            <div className={styles.gameContainer}>
              <Gamepage
                roomCode=""
                competitionId={competitionId}
                roomId={roomId}
                isFullScreenMode={false}
                viewMode="readonly"
                initialShapes={submission.participant_solution || submission.shapes || []}
                problemData={{
                  ...selectedProblem,
                  description: submission.problem?.description || ''
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  };
}
