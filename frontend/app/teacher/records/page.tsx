"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/dashboard-wow.module.css'
import { TEACHER_ROUTES } from '@/constants/routes'

export default function TeacherRecordPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { createdRooms, loading } = useTeacherRoomStore()

    const handleViewRecords = (roomId: string | number) => {
        // Navigate to individual room records
        router.push(`${TEACHER_ROUTES.RECORDS}/${roomId}`)
    }

    return (
        <LoadingOverlay isLoading={loading}>
            <PageHeader
                title="Records"
                userName={userProfile?.first_name}
                subtitle="View records for your created rooms"
            />

            <div className={styles["scrollable-content"]}>
                <RoomCardsList
                    rooms={createdRooms}
                    onViewRoom={handleViewRecords}
                    useRoomCode={false}
                    showClickableCard={true}
                    showDeleteButton={false}
                    showRoomCode={false}
                    emptyMessage="No rooms created yet. Create rooms to view their records!"
                    isLoading={loading}
                    viewButtonText="View Records"
                />
            </div>
        </LoadingOverlay>
    )
}
