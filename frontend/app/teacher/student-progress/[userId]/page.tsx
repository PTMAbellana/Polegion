"use client"

import React, { useEffect, useState } from 'react'
import { use } from 'react'
import { Printer } from 'lucide-react'
import styles from '@/styles/student-progress-report.module.css'
import { getStudentProgress } from '@/api/users'

interface StudentProgress {
  user: {
    first_name: string
    last_name: string
    email: string
    profile_pic: string
  }
  castles: Array<{
    castle_id: number
    castle_name: string
    chapters_completed: number
    total_chapters: number
    total_xp: number
    progress_percentage: number
  }>
  competitions: Array<{
    competition_id: number
    title: string
    accumulated_xp: number
    rank: number
    status: string
    date: string
  }>
}

export default function StudentProgressReport({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getStudentProgress(userId)
        
        if (response.success && response.data) {
          setProgress(response.data)
        } else {
          setError(response.error || 'Failed to load student progress')
        }
      } catch (err) {
        console.error('Error fetching student progress:', err)
        setError('An error occurred while loading student progress')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchStudentProgress()
    }
  }, [userId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading student progress...</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className={styles.error}>
        <h2>Error Loading Progress</h2>
        <p>{error || 'Unable to load progress data for this student.'}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.studentInfo}>
            {progress.user.profile_pic && (
              <img 
                src={progress.user.profile_pic} 
                alt={`${progress.user.first_name} ${progress.user.last_name}`}
                className={styles.avatar}
              />
            )}
            <div>
              <h1 className={styles.title}>
                Student Progress Report
              </h1>
              <p className={styles.studentName}>
                {progress.user.first_name} {progress.user.last_name}
              </p>
              <p className={styles.studentEmail}>{progress.user.email}</p>
            </div>
          </div>
          <button 
            onClick={handlePrint} 
            className={styles.printButton}
          >
            <Printer size={20} />
            Print Report
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Castle Progress Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Castle Progress</h2>
          <div className={styles.castlesGrid}>
            {progress.castles.map((castle) => (
              <div key={castle.castle_id} className={styles.castleCard}>
                <div className={styles.castleHeader}>
                  <h3 className={styles.castleName}>{castle.castle_name}</h3>
                  <div className={styles.castleProgress}>
                    {castle.progress_percentage}%
                  </div>
                </div>
                <div className={styles.castleStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Chapters:</span>
                    <span className={styles.statValue}>
                      {castle.chapters_completed} / {castle.total_chapters}
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Total XP:</span>
                    <span className={styles.statValue}>{castle.total_xp}</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${castle.progress_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Competition History Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Competition History</h2>
          {progress.competitions.length > 0 ? (
            <div className={styles.competitionsTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Competition</th>
                    <th>Date</th>
                    <th>XP Earned</th>
                    <th>Rank</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.competitions.map((comp) => (
                    <tr key={comp.competition_id}>
                      <td>{comp.title}</td>
                      <td>{new Date(comp.date).toLocaleDateString()}</td>
                      <td className={styles.xpCell}>{comp.accumulated_xp} XP</td>
                      <td className={styles.rankCell}>#{comp.rank}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[`status${comp.status}`]}`}>
                          {comp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No competition history available.</p>
            </div>
          )}
        </section>

        {/* Summary Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Total Castle XP</div>
              <div className={styles.summaryValue}>
                {progress.castles.reduce((sum, c) => sum + c.total_xp, 0)}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Competitions Joined</div>
              <div className={styles.summaryValue}>
                {progress.competitions.length}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Competition XP</div>
              <div className={styles.summaryValue}>
                {progress.competitions.reduce((sum, c) => sum + c.accumulated_xp, 0)}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Overall Progress</div>
              <div className={styles.summaryValue}>
                {Math.round(
                  progress.castles.reduce((sum, c) => sum + c.progress_percentage, 0) / 
                  progress.castles.length
                )}%
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
