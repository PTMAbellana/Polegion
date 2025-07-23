"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMyApp } from '@/context/AppUtils'
import Loader from '@/components/Loader'
import styles from '@/styles/profile.module.css'
import { ROUTES } from '@/constants/routes'

export default function ProfilePage() {
    const router = useRouter()
    const { isLoggedIn, userProfile, appLoading } = useMyApp()

    if (appLoading || !isLoggedIn) {
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    const handleEditProfile = () => {
        router.push(`${ROUTES.PROFILE}/edit`)
    }

    return (
        <div className={styles['profile-page']}>
            <div className={styles['profile-card']}>
                {/* Animated Header */}
                <div className={styles['profile-header']}>
                    <div className={styles['profile-avatar-container']}>
                        <img 
                            className={styles['profile-avatar']} 
                            src={userProfile?.profile_pic || "/placeholder-avatar.png"}
                            alt="Profile"
                        />
                        <div className={styles['avatar-glow']}></div>
                        {/* Fun animated ring */}
                        <div className={styles['avatar-ring']}></div>
                    </div>
                    <div className={styles['profile-title-group']}>
                        <h1 className={styles['profile-title']}>
                            {userProfile?.fullName || 'Your Name'}
                        </h1>
                        <span className={styles['profile-status']}>Active User</span>
                    </div>
                </div>
                {/* Details */}
                <div className={styles['profile-details']}>
                    <div className={styles['profile-info-group']}>
                        <label className={styles['profile-label']}>Phone Number</label>
                        <div className={styles['profile-value']}>
                            {userProfile?.phone || 'Enter your Phone Number'}
                        </div>
                    </div>
                    <div className={styles['profile-info-group']}>
                        <label className={styles['profile-label']}>Email</label>
                        <div className={styles['profile-value']}>
                            {userProfile?.email || 'Enter your Email'}
                        </div>
                    </div>
                    <div className={styles['profile-info-group']}>
                        <label className={styles['profile-label']}>Gender</label>
                        <div className={styles['profile-value']}>
                            {userProfile?.gender || 'Not specified'}
                        </div>
                    </div>
                </div>
                {/* Edit Profile Button */}
                <button
                    onClick={handleEditProfile}
                    className={styles['edit-profile-button']}
                >
                    <span className={styles['edit-icon']}>✏️</span>
                    Edit Profile
                </button>
            </div>
        </div>
    )
}
