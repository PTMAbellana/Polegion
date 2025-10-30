import React from 'react'
import { FaTrophy, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import styles from '@/styles/room-details.module.css'
import { RoomBannerProps } from '@/types'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { TEACHER_ROUTES } from '@/constants/routes'

export default function RoomBanner({
    title,
    description,
    mantra,
    banner_image,
    onCompetitionDashboard,
    onEditRoom,
    onDeleteRoom
}: RoomBannerProps) {
    const router = useRouter()
    const { clearCurrentRoom } = useTeacherRoomStore()

    const handleBackClick = () => {
        clearCurrentRoom()
        router.replace(TEACHER_ROUTES.VIRTUAL_ROOMS)
    }

    return (
        <div className={styles.roomBanner}>
            {/* Custom banner image with fade effect */}
            {banner_image && typeof banner_image === 'string' && (
                <div 
                    className={styles.roomBannerImage}
                    style={{
                        backgroundImage: `url(${banner_image})`
                    }}
                />
            )}
            {/* Gradient Overlay - Image on top, transparent at bottom */}
            <div className={styles.roomBannerOverlay}></div>
            
            {/* Header Content */}
            <div className={styles.roomBannerContent}>
            
                {/* Back Button */}
                <button 
                    onClick={handleBackClick}
                    className={styles.backButton}
                    aria-label="Go back"
                >
                    <FaArrowLeft className={styles.backButtonIcon} />
                </button>
                
                {/* Left side - Room Info */}
                <div className={styles.roomBannerLeft}>
                    <div className={styles.roomBannerInfo}>
                        <h1 className={styles.roomBannerTitle}>{title}</h1>
                        {description && (
                            <p className={styles.roomBannerDescription}>{description}</p>
                        )}
                        {mantra && (
                            <p className={styles.roomBannerMantra}>&ldquo;{mantra}&rdquo;</p>
                        )}
                    </div>
                </div>

                {/* Right side - Action Buttons */}
                <div className={styles.roomBannerRight}>
                    {/* Action Buttons */}
                    <div className={styles.roomBannerActions}>
                        <button
                            onClick={onCompetitionDashboard}
                            className={`${styles.roomBannerButton} ${styles.competitionButton}`}
                        >
                            <FaTrophy className={styles.roomBannerButtonIcon} />
                            Competition Dashboard
                        </button>
                        <button
                            onClick={onEditRoom}
                            className={`${styles.roomBannerButton} ${styles.editButton}`}
                        >
                            <FaEdit className={styles.roomBannerButtonIcon} />
                            Edit Room
                        </button>
                        <button
                            onClick={onDeleteRoom}
                            className={`${styles.roomBannerButton} ${styles.deleteButton}`}
                        >
                            <FaTrash className={styles.roomBannerButtonIcon} />
                            Delete Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}