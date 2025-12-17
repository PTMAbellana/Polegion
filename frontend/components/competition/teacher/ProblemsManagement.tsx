import React, { useState } from 'react'
import { Edit3 } from 'lucide-react'
import { Problem, CompetitionProblem } from '@/types/common/competition'
import styles from '@/styles/competition-teacher.module.css'

interface ProblemsManagementProps {
  availableProblems: Problem[]
  addedProblems: CompetitionProblem[]
  competitionStatus: string
  onAddProblem: (problem: Problem) => void
  onRemoveProblem: (problem: Problem) => void
  onUpdateTimer: (problemId: string, timer: number) => void
}

export default function ProblemsManagement({
  availableProblems,
  addedProblems,
  competitionStatus,
  onAddProblem,
  onRemoveProblem,
  onUpdateTimer
}: ProblemsManagementProps) {
  const [editingTimerId, setEditingTimerId] = useState<string | null>(null)
  const [timerEditValue, setTimerEditValue] = useState<number>(0)

  const handleEditTimer = (problem: Problem) => {
    setEditingTimerId(problem.id)
    setTimerEditValue(problem.timer || 0)
  }

  const handleSaveTimer = async (problem: Problem) => {
    await onUpdateTimer(problem.id, timerEditValue)
    setEditingTimerId(null)
  }

  const handleCancelEdit = () => {
    setEditingTimerId(null)
  }

  const isEditable = competitionStatus === 'NEW'

  return (
    <div className={styles.leftColumn}>
      {/* Added Problems Section */}
      {addedProblems.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Added Problems</h2>
            <span className={styles.badge}>{addedProblems.length}</span>
          </div>
          
          <div className={styles.problemsList}>
            {addedProblems.map((compeProblem, index) => (
              <div key={`added-${compeProblem.problem.id}-${index}`} className={styles.problemCard}>
                <div className={styles.problemContent}>
                  <div className={styles.problemLeft}>
                    <div className={styles.problemRank}>{index + 1}</div>
                    <div className={styles.problemInfo}>
                      <h3 className={styles.problemTitle}>
                        {compeProblem.problem.title || 'Untitled Problem'}
                      </h3>
                      <div className={styles.problemMeta}>
                        <span 
                          className={styles.problemDifficulty}
                          data-difficulty={compeProblem.problem.difficulty}
                        >
                          {compeProblem.problem.difficulty}
                        </span>
                        <span className={styles.problemXp}>
                          {compeProblem.problem.expected_xp} XP
                        </span>
                        <span 
                          className={styles.visibilityBadge}
                          data-visibility={compeProblem.problem.visibility}
                        >
                          {compeProblem.problem.visibility === 'public' ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.problemRight}>
                    <div className={styles.problemTimer}>
                      {compeProblem.timer != null && compeProblem.timer > 0 
                        ? `${compeProblem.timer}s` 
                        : <span className={styles.noTimer}>No timer</span>
                      }
                    </div>

                    {isEditable && (
                      <button
                        className={styles.removeButton}
                        onClick={() => onRemoveProblem(compeProblem.problem)}
                        title="Remove from competition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Problems Section */}
      {isEditable && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Available Problems</h2>
            <span className={styles.badge}>
              {availableProblems.filter(p => 
                !addedProblems.some(ap => ap.problem.id === p.id)
              ).length}
            </span>
          </div>
          
          <div className={styles.problemsList}>
            {availableProblems
              .filter(problem => 
                !addedProblems.some(ap => ap.problem.id === problem.id)
              )
              .map((problem, index) => {
                const canAdd = problem.timer && problem.timer > 0
                return (
                  <div key={`available-${problem.id}-${index}`} className={styles.problemCard}>
                    <div className={styles.problemContent}>
                      <div className={styles.problemLeft}>
                        <div className={styles.problemRank}>{index + 1}</div>
                        <div className={styles.problemInfo}>
                          <h3 className={styles.problemTitle}>
                            {problem.title || 'Untitled Problem'}
                          </h3>
                          <div className={styles.problemMeta}>
                            <span 
                              className={styles.problemDifficulty}
                              data-difficulty={problem.difficulty}
                            >
                              {problem.difficulty}
                            </span>
                            <span className={styles.problemXp}>
                              {problem.expected_xp} XP
                            </span>
                            <span 
                              className={styles.visibilityBadge}
                              data-visibility={problem.visibility}
                            >
                              {problem.visibility === 'public' ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.problemRight}>
                        {editingTimerId === problem.id ? (
                          <>
                            <input
                              type="number"
                              min={1}
                              value={timerEditValue}
                              onChange={e => setTimerEditValue(Number(e.target.value))}
                              className={styles.timerInput}
                              placeholder="Seconds"
                            />
                            <button
                              onClick={() => handleSaveTimer(problem)}
                              className={styles.saveButton}
                              title="Save timer"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className={styles.cancelButton}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <div className={styles.problemTimer}>
                              {problem.timer != null && problem.timer > 0 
                                ? `${problem.timer}s` 
                                : <span className={styles.noTimer}>No timer</span>
                              }
                            </div>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditTimer(problem)}
                              title="Edit timer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              className={styles.addButton}
                              disabled={!canAdd}
                              onClick={() => onAddProblem(problem)}
                              title={!canAdd ? 'Set timer first' : 'Add to competition'}
                            >
                              +
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
