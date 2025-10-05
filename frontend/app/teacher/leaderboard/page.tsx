"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/dashboard-wow.module.css'

export default function TeacherLeaderboardPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { createdRooms, loading } = useTeacherRoomStore()

    const handleViewLeaderboard = (roomId: string | number) => {
        // Navigate to individual room leaderboard
        router.push(`/leaderboard/${roomId}`)
    }

    return (
        <LoadingOverlay isLoading={loading}>
            <PageHeader
                title="Leaderboards"
                userName={userProfile?.first_name}
                subtitle="View leaderboards for your created rooms"
            />

            <div className={styles["scrollable-content"]}>
                <RoomCardsList
                    rooms={createdRooms}
                    onViewRoom={handleViewLeaderboard}
                    useRoomCode={false}
                    showClickableCard={true}
                    showDeleteButton={false}
                    showRoomCode={false}
                    emptyMessage="No rooms created yet. Create rooms to view their leaderboards!"
                    isLoading={loading}
                    viewButtonText="View Records"
                />
            </div>
        </LoadingOverlay>
    )
}
