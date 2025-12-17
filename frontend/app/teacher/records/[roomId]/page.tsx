"use client"

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useAuthStore } from '@/store/authStore'
import { useRecordsManagement } from '@/hooks/useRecordsManagement'
import { useRecordsPreview } from '@/hooks/useRecordsPreview'
import PageHeader from '@/components/PageHeader'
import RecordsDownloadSection from '@/components/teacher/RecordsDownloadSection'
import styles from '@/styles/records.module.css'
import dashboardStyles from '@/styles/dashboard-wow.module.css'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'

export default function RecordPage({ params }: { params: Promise<{ roomId: number }> }) {
  const router = useRouter()
  const { roomId } = use(params)
  const { isLoggedIn, appLoading, userProfile } = useAuthStore()
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
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={dashboardStyles["dashboard-container"]}>
      {/* Fixed Header */}
      <PageHeader 
        title={`Student Records - ${roomTitle}`}
        subtitle={`Room Code: ${roomCode} • ${roomRecords.length} students enrolled`}
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'T'}
        actionButton={
          <button 
            onClick={handleBackClick}
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowLeft /> Back to Room
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className={dashboardStyles["scrollable-content"]}>
        <RecordsDownloadSection
          onDownloadRoomAction={handleDownloadRoom}
          onDownloadCompetitionAction={handleDownloadCompetition}
          isLoading={isLoading}
          roomRecords={roomRecords}
          competitionRecords={competitionRecords}
          competitions={competitions}
          roomId={roomId}
        />
      </div>
    </div>
  )
}