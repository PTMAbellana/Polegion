import { useState, useMemo } from 'react';
import styles from '@/styles/submission-viewer.module.css';
import { Problem } from '@/types/common/competition';

type ViewerProblem = Problem & { competitionProblemId?: string };

interface Participant {
  id: string;
  user_id: string;
  fullName?: string;
  accumulated_xp: number;
}

interface SubmissionFiltersProps {
  problems: ViewerProblem[];
  participants: Participant[];
  selectedProblem: ViewerProblem | null;
  selectedParticipant: Participant | null;
  onSelectProblem: (problem: ViewerProblem) => void;
  onSelectParticipant: (participant: Participant) => void;
}

const resolveName = (participant: Participant) => {
  return participant.fullName?.trim() || 'Unnamed Participant';
};

const buildInitials = (name: string) => {
  if (!name) return '??';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');
  return initials || name.slice(0, 2).toUpperCase();
};

export default function SubmissionFilters({
  problems,
  participants,
  selectedProblem,
  selectedParticipant,
  onSelectProblem,
  onSelectParticipant
}: SubmissionFiltersProps) {
  const [activeTab, setActiveTab] = useState<'problems' | 'participants'>('problems');

  const tabMeta = useMemo(() => ([
    { key: 'problems', label: 'Problems', count: problems.length },
    { key: 'participants', label: 'Participants', count: participants.length }
  ] as const), [problems.length, participants.length]);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.tabHeader}>
        {tabMeta.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabTrigger} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            <span>{tab.label}</span>
            <span className={styles.tabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.filterSection}>
        {activeTab === 'problems' ? (
          <div className={styles.problemList}>
            {problems.length === 0 ? (
              <div className={styles.emptyState}>No problems</div>
            ) : (
              problems.map((problem, index) => (
                <div
                  key={problem.id}
                  className={`${styles.problemItem} ${selectedProblem?.id === problem.id ? styles.selected : ''}`}
                  onClick={() => onSelectProblem(problem)}
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
        ) : (
          <div className={styles.participantList}>
            {participants.length === 0 ? (
              <div className={styles.emptyState}>No participants</div>
            ) : (
              participants.map((participant) => {
                const participantName = resolveName(participant);
                const initials = buildInitials(participantName);
                const isDisabled = !selectedProblem;
                const isSelected = selectedParticipant?.id === participant.id;

                return (
                  <div
                    key={participant.id}
                    className={`${styles.participantItem} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                    onClick={() => !isDisabled && onSelectParticipant(participant)}
                  >
                    <div className={styles.participantAvatar}>
                      {initials}
                    </div>
                    <div className={styles.participantDetails}>
                      <span className={styles.participantName}>{participantName}</span>
                      <span className={styles.participantXp}>{participant.accumulated_xp ?? 0} XP</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
