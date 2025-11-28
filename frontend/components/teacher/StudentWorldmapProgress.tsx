import React from 'react'
import { FaPrint } from 'react-icons/fa'
import styles from '@/styles/records.module.css'

interface StudentWorldmapProgressProps {
  roomRecords: Array<{
    user_id: string
    first_name: string
    last_name: string
    total_xp: number
  }>
}

export default function StudentWorldmapProgress({ roomRecords }: StudentWorldmapProgressProps) {
  const handleViewProgress = (userId: string) => {
    window.open(`/teacher/student-progress/${userId}`, '_blank')
  }

  if (!roomRecords || roomRecords.length === 0) {
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Student Worldmap Progress</h3>
        <div className={styles.emptyState}>
          <p>No students found in this room.</p>
        </div>
      </div>
    )
  }

  // Sort by total XP descending
  const sortedRecords = [...roomRecords].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0))

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Student Worldmap Progress</h3>
      <p className={styles.sectionDescription}>
        View individual student progress across all castles and chapters
      </p>
      
      <div className={styles.studentProgressGrid}>
        {sortedRecords.map((student, index) => (
          <div key={student.user_id || `student-${index}`} className={styles.studentProgressCard}>
            <div className={styles.studentInfo}>
              <div className={styles.studentAvatar}>
                {student.first_name?.charAt(0) || '?'}
              </div>
              <div className={styles.studentDetails}>
                <h4 className={styles.studentName}>
                  {student.first_name} {student.last_name}
                </h4>
                <p className={styles.studentXp}>Total XP: {student.total_xp || 0}</p>
              </div>
            </div>
            
            <button
              onClick={() => handleViewProgress(student.user_id)}
              className={styles.viewProgressButton}
              title="View detailed progress report"
            >
              <FaPrint />
              <span>View Progress</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
