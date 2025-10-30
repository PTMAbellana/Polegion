import React from 'react'
import { FaSignOutAlt, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import styles from '@/styles/room-details.module.css'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { STUDENT_ROUTES } from '@/constants/routes'
import { StudentRoomBannerProps } from '@/types'


export default function StudentRoomBanner({
    title,
    description,
    mantra,
    banner_image,
    onLeaveRoom
}: StudentRoomBannerProps) {
    const router = useRouter()
    const { clearCurrentRoom } = useStudentRoomStore()

    const handleBackClick = () => {
        clearCurrentRoom()
        router.replace(STUDENT_ROUTES.JOINED_ROOMS)
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

                {/* Right side - Leave Room Button */}
                <div className={styles.roomBannerRight}>
                    <div className={styles.roomBannerActions}>
                        <button
                            onClick={onLeaveRoom}
                            className={`${styles.roomBannerButton} ${styles.leaveButton}`}
                        >
                            <FaSignOutAlt className={styles.roomBannerButtonIcon} />
                            Leave Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
