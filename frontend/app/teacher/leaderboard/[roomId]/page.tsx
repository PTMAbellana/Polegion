"use client"

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import Loader from '@/components/Loader'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useAuthStore } from '@/store/authStore'
import { useRecordsManagement } from '@/hooks/useRecordsManagement'
import { useRecordsPreview } from '@/hooks/useRecordsPreview'
import RecordsHeader from '@/components/teacher/RecordsHeader'
import RecordsDownloadSection from '@/components/teacher/RecordsDownloadSection'
import styles from '@/styles/leaderboard.module.css'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'

export default function RecordPage({ params }: { params: Promise<{ roomId: number }> }) {
  const router = useRouter()
  const { roomId } = use(params)
  const { isLoggedIn, appLoading } = useAuthStore()
  const { createdRooms } = useTeacherRoomStore()

  // Find the room object by id
  const roomObj = createdRooms.find(room => room.id?.toString() === roomId?.toString())
  const roomCode = roomObj?.code || ''
  const roomTitle = roomObj?.title || ''

  const {
    isLoading,
    handleDownloadRoom,
    handleDownloadCompetition
  } = useRecordsManagement(roomId)

  const {
    roomRecords,
    competitionRecords,
    competitions,
    loading: recordsLoading,
    error: recordsError
  } = useRecordsPreview(roomId)

  const handleBackClick = () => {
    router.back()
  }

  if (appLoading || !isLoggedIn) {
    return <LoadingOverlay isLoading={true}><Loader /></LoadingOverlay>
  }

  return (
    <LoadingOverlay isLoading={recordsLoading}>
      {recordsError ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
          <p>{recordsError}</p>
        </div>
      ) : (
        <div className={styles.leaderboard_container}>
          {/* Back Button */}
          <div className={styles.back_button_container}>
            <button onClick={handleBackClick} className={styles.back_button}>
              <FaArrowLeft className={styles.back_icon} />
              <span>Back</span>
            </button>
          </div>
    
          {/* Scrollable Container */}
          <div className={styles.leaderboard_scrollable}>
            {/* Records Header */}
            <RecordsHeader roomTitle={roomTitle} roomCode={roomCode} totalStudents={roomRecords.length} />

            <RecordsDownloadSection
              onDownloadRoomAction={handleDownloadRoom}
              onDownloadCompetitionAction={handleDownloadCompetition}
              isLoading={isLoading}
              roomRecords={roomRecords}
              competitionRecords={competitionRecords}
              competitions={competitions}
            />
          </div>
        </div>
      )}
    </LoadingOverlay>
          </div>
        </div>
      )}
    </LoadingOverlay>
  )
}