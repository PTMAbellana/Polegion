import React from 'react'
import { useRouter } from 'next/navigation'
import { FaBook, FaExternalLinkAlt, FaEye, FaEyeSlash, FaBullseye, FaClock } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { TProblemType, SProblemType } from '@/types'
import Swal from 'sweetalert2'

interface ProblemsTabProps {
    problems: (TProblemType | SProblemType)[]
    roomCode: string
}

export default function ProblemsTab({ problems, roomCode }: ProblemsTabProps) {
    const router = useRouter()

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

    const handleOpenProblem = async (problemId: string | undefined, problemTitle: string, maxAttempts: number, timer?: number) => {
        if (!problemId) return;

        // Create confirmation dialog
        const timeText = timer ? ` You have ${Math.floor(timer / 60)}min ${timer % 60}s to complete it.` : '';
        const attemptsText = maxAttempts === 1 ? '1 attempt' : `${maxAttempts} attempts`;
        
        const result = await Swal.fire({
            title: 'Ready to Start?',
            html: `
                <div style="text-align: left; margin: 20px 0;">
                    <p style="margin-bottom: 10px;"><strong>Problem:</strong> ${problemTitle}</p>
                    <p style="margin-bottom: 10px;"><strong>Attempts:</strong> You have ${attemptsText} to solve this problem.</p>
                    ${timer ? `<p style="margin-bottom: 10px;"><strong>Time Limit:</strong>${timeText}</p>` : ''}
                    <p style="margin-top: 15px; color: #666;">Make sure you're ready before proceeding!</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "I'm Ready!",
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            router.push(`/student/joined-rooms/${roomCode}/practice-problems/${problemId}`);
        }
    };

    // Filter out hidden/private problems for students
    // Only show problems that are explicitly public
    const visibleProblems = problems.filter(problem => 
        problem.visibility === 'public'
    );

    return (
        <div className={styles.problemsContainer}>
            <div className={styles.problemsContent}>
                {visibleProblems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaBook className={styles.emptyStateIcon} />
                        <h3 className={styles.emptyStateTitle}>No Problems Yet</h3>
                        <p className={styles.emptyStateDescription}>Your teacher hasn&apos;t created any problems yet!</p>
                    </div>
                ) : (
                    <div>
                        {visibleProblems.map((problem, index) => (
                            <div key={problem.id || index} className={styles.problemCard}>
                                <div className={styles.problemHeader}>
                                    <h3 className={styles.problemTitle}>{problem.title}</h3>
                                    <div className={styles.problemActions}>
                                        {problem.visibility === 'public' && (
                                            <button 
                                                className={`${styles.actionButton} ${styles.openButton}`}
                                                onClick={() => handleOpenProblem(problem.id, problem.title, problem.max_attempts, problem.timer)}
                                                title="Open problem"
                                            >
                                                <FaExternalLinkAlt />
                                                Open
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className={styles.problemMeta}>
                                    <span className={`${styles.difficultyBadge} ${getDifficultyClass(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                    {'visibility' in problem && (
                                        <div className={styles.visibilityIndicator}>
                                            {problem.visibility === 'public' ? (
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
                                            <span>{Math.floor(problem.timer / 60)}min {problem.timer % 60}s</span>
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
