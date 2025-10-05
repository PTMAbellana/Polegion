"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/dashboard-wow.module.css'
import { STUDENT_ROUTES } from '@/constants/routes'

export default function StudentLeaderboardPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { joinedRooms, loading } = useStudentRoomStore()

    const handleViewLeaderboard = (roomId: string | number) => {
        // Navigate to individual room leaderboard
        router.push(`${STUDENT_ROUTES.LEADERBOARD}/${roomId}`)
    }

    return (
        <LoadingOverlay isLoading={loading}>
            <PageHeader
                title="Wall of Fame"
                userName={userProfile?.first_name}
                subtitle="View leaderboards for your joined rooms"
            />

            <div className={styles["scrollable-content"]}>
                <RoomCardsList
                    rooms={joinedRooms}
                    onViewRoom={handleViewLeaderboard}
                    useRoomCode={false}
                    showClickableCard={true}
                    showDeleteButton={false}
                    showRoomCode={false}
                    emptyMessage="No rooms joined yet. Join rooms to view their leaderboards!"
                    isLoading={loading}
                    viewButtonText="View Leaderboard"
                />
            </div>
        </LoadingOverlay>
    )
}