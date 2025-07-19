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
            <div className={styles['container']}>
             <div className={styles['left-section']}> 
            {/* Page Title */}
            <h1 className={styles['page-title']}>User Profile</h1>

            {/* Profile Image */}
            <div className={styles['profile-image-container']}>
                <img 
                className={styles['profile-image']} 
                src={userProfile?.profile_pic}
                />
            </div>
            </div>  
            <div className={styles['right-section']}>
            {/* Form Fields (Read-only) */}
            <div className={styles['profile-info']}>
                {/* Full Name Field */}
                <div className={styles['info-group']}>
                    <label className={styles['info-label']}>Full Name</label>
                    <div className={styles['info-value']}>
                        {userProfile?.fullName || 'Enter your Full Name'}
                    </div>
                </div>

                {/* Phone Field */}
                <div className={styles['info-group']}>
                    <label className={styles['info-label']}>Phone Number</label>
                    <div className={styles['info-value']}>
                        {userProfile?.phone || 'Enter your Phone Number'}
                    </div>
                </div>

                {/* Email Field */}
                <div className={styles['info-group']}>
                    <label className={styles['info-label']}>Email</label>
                    <div className={styles['info-value']}>
                        {userProfile?.email || 'Enter your Email'}
                    </div>
                </div>

                {/* Gender Field */}
                <div className={styles['info-group']}>
                    <label className={styles['info-label']}>Gender</label>
                    <div className={styles['info-value']}>
                        {userProfile?.gender || 'Not specified'}
                    </div>
                </div>
            </div>

            {/* Edit Profile Button */}
            <button
                onClick={handleEditProfile}
                className={styles['edit-profile-button']}
            >
                Edit Profile
            </button>
            </div>
            </div>
        </div>
    )
}
