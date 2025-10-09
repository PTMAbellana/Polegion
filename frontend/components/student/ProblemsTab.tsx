import React from 'react'
import { useRouter } from 'next/navigation'
import { FaBook, FaExternalLinkAlt, FaEye, FaEyeSlash, FaBullseye, FaClock } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { TProblemType, SProblemType } from '@/types'

interface ProblemsTabProps {
    problems: (TProblemType | SProblemType)[]
    roomCode: string
}

export default function ProblemsTab({ problems, roomCode }: ProblemsTabProps) {
    const router = useRouter()

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return styles.difficultyEasy
            case 'intermediate':
            case 'medium':
                return styles.difficultyMedium
            case 'hard':
                return styles.difficultyHard
            default:
                return styles.difficultyMedium
        }
    }

    const handleOpenProblem = (problemId: number | undefined) => {
        if (problemId) {
            router.push(`/student/joined-rooms/${roomCode}/problem/${problemId}`)
        }
    }

    return (
        <div className={styles.problemsContainer}>
            <div className={styles.problemsContent}>
                {problems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaBook className={styles.emptyStateIcon} />
                        <h3 className={styles.emptyStateTitle}>No Problems Yet</h3>
                        <p className={styles.emptyStateDescription}>Your teacher hasn&apos;t created any problems yet!</p>
                    </div>
                ) : (
                    <div>
                        {problems.map((problem, index) => (
                            <div key={problem.id || index} className={styles.problemCard}>
                                <div className={styles.problemHeader}>
                                    <h3 className={styles.problemTitle}>{problem.title}</h3>
                                    <div className={styles.problemActions}>
                                        <button 
                                            className={`${styles.actionButton} ${styles.openButton}`}
                                            onClick={() => handleOpenProblem(problem.id)}
                                            title="Open problem"
                                        >
                                            <FaExternalLinkAlt />
                                            Open
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.problemMeta}>
                                    <span className={`${styles.difficultyBadge} ${getDifficultyClass(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                    {'visibility' in problem && (
                                        <div className={styles.visibilityIndicator}>
                                            {problem.visibility === 'show' ? (
                                                <><FaEye /> Visible</>
                                            ) : (
                                                <><FaEyeSlash /> Hidden</>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                <p className={styles.problemDescription}>{problem.description}</p>
                                
                                <div className={styles.problemMeta}>
                                    <div className={styles.visibilityIndicator}>
                                        <FaBullseye />
                                        <span>{problem.max_attempts} attempts</span>
                                    </div>
                                    {problem.timer && (
                                        <div className={styles.visibilityIndicator}>
                                            <FaClock />
                                            <span>{problem.timer}min</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
