import React from 'react'
import { useRouter } from 'next/navigation'
import { FaTrophy, FaExternalLinkAlt } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { STUDENT_ROUTES } from '@/constants/routes'
import { CompetitionsTabProps } from '@/types'

export default function CompetitionsTab({ competitions }: CompetitionsTabProps) {
    const router = useRouter()

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return styles.statusActive
            case 'ONGOING':
                return styles.statusOngoing
            case 'DONE':
                return styles.statusDone
            default:
                return styles.statusActive
        }
    }

    const handleOpenCompetition = (competitionId: number) => {
        router.push(`${STUDENT_ROUTES.PLAY}/${competitionId }`);
    }

    return (
        <div className={styles.problemsContainer}>
            <div className={styles.problemsContent}>
                {competitions.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaTrophy className={styles.emptyStateIcon} />
                        <h3 className={styles.emptyStateTitle}>No Competitions Yet</h3>
                        <p className={styles.emptyStateDescription}>Your teacher hasn&apos;t created any competitions yet!</p>
                    </div>
                ) : (
                    <div>
                        {competitions.map((competition) => (
                            <div key={competition.id} className={styles.problemCard}>
                                <div className={styles.problemHeader}>
                                    <h3 className={styles.problemTitle}>{competition.title}</h3>

                                   {competition.status !== 'DONE' && (
                                        <div className={styles.problemActions}>
                                            <button 
                                                className={`${styles.actionButton} ${styles.openButton}`}
                                                onClick={() => handleOpenCompetition(competition.id)}
                                                title="Open competition"
                                            >
                                                <FaExternalLinkAlt />
                                                Open
                                            </button>
                                        </div>
                                   )} 
                                </div>
                                
                                <div className={styles.problemMeta}>
                                    <span className={`${styles.statusBadge} ${getStatusClass(competition.status)}`}>
                                        {competition.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
