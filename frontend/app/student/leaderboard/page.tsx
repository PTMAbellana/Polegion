"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { AuthProtection } from '@/context/AuthProtection'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/dashboard-wow.module.css'

export default function StudentLeaderboardPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { joinedRooms, loading } = useStudentRoomStore()
    const { isLoading: authLoading } = AuthProtection()

    const handleViewLeaderboard = (roomCode: string | number) => {
        // Navigate to individual room leaderboard
        router.push(`/leaderboard/${roomCode}`)
    }

    if (authLoading) {
        return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>
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
                    useRoomCode={true}
                    showClickableCard={true}
                    showDeleteButton={false}
                    showRoomCode={true}
                    emptyMessage="No rooms joined yet. Join rooms to view their leaderboards!"
                    isLoading={loading}
                    viewButtonText="View Leaderboard"
                />
            </div>
        </LoadingOverlay>
    )
}