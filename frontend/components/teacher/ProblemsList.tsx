import React from 'react'
import { useRouter } from 'next/navigation'
import { FaBook, FaPlus, FaEye, FaEyeSlash, FaTrash, FaBullseye, FaClock } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { ProblemsListProps } from '@/types'
import { TEACHER_ROUTES } from '@/constants/routes'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'


export default function ProblemsList({ problems, roomCode }: ProblemsListProps) {
    const router = useRouter()
    const { removeProblemFromRoom } = useTeacherRoomStore()
    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return styles.difficultyEasy
            case 'Intermediate':
            case 'Medium':
                return styles.difficultyMedium
            case 'Hard':
                return styles.difficultyHard
            default:
                return styles.difficultyMedium
        }
    }

    const handleCreateProblem = () => {
        router.push(`${TEACHER_ROUTES.VIRTUAL_ROOMS}/${roomCode}/create-problem`)
    }

    const handleDeleteProblem = (problemId: string | undefined) => () => {
        if (!problemId) return;
        removeProblemFromRoom(problemId)        
    }

    return (
        <div className={styles.problemsContainer}>
            <div className={styles.problemsHeader}>
                <h2 className={styles.problemsTitle}>
                    <FaBook />
                    Problems
                    <span className={styles.problemsCount}>
                        {problems.length}
                    </span>
                </h2>
                <button
                    onClick={handleCreateProblem}
                    className={styles.createButton}
                >
                    <FaPlus />
                    Create Problem
                </button>
            </div>
            
            <div className={styles.problemsContent}>
                {problems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaBook className={styles.emptyStateIcon} />
                        <h3 className={styles.emptyStateTitle}>No Problems Yet</h3>
                        <p className={styles.emptyStateDescription}>Create your first problem to get started!</p>
                        <button
                            onClick={handleCreateProblem}
                            className={styles.createFirstButton}
                        >
                            <FaPlus />
                            Create First Problem
                        </button>
                    </div>
                ) : (
                    <div>
                        {problems.map((problem, index) => (
                            <div key={problem.id || index} className={styles.problemCard}>
                                <div className={styles.problemHeader}>
                                    <h3 className={styles.problemTitle}>{problem.title}</h3>
                                    <div className={styles.problemActions}>
                                        <button 
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={handleDeleteProblem(problem.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.problemMeta}>
                                    <span className={`${styles.difficultyBadge} ${getDifficultyClass(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                    <div className={styles.visibilityIndicator}>
                                        {problem.visibility === 'public' || problem.visibility === 'show' ? (
                                            <><FaEye /> Visible</>
                                        ) : (
                                            <><FaEyeSlash /> Hidden</>
                                        )}
                                    </div>
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
                                            <span>{problem.timer} sec</span>
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