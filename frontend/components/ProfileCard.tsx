"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import styles from '@/styles/profile.module.css'
import { ROUTES } from '@/constants/routes'

interface ProfileCardProps {
    userType?: 'student' | 'teacher'
}

export default function ProfileCard({ userType }: ProfileCardProps) {
    const router = useRouter()
    const { isLoggedIn, userProfile, appLoading } = useAuthStore()

    console.log('userProfile in ProfileCard: ', userProfile)
    if (appLoading || !isLoggedIn) {
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    const handleEditProfile = () => {
        const editRoute = userType 
            ? `/${userType}/profile/edit` 
            : `${ROUTES.PROFILE}/edit`
        router.push(editRoute)
    }

    const getDisplayName = () => {
        if (userProfile?.first_name && userProfile?.last_name) {
            return `${userProfile.first_name} ${userProfile.last_name}`
        }
        
        if (userProfile?.first_name) {
            return userProfile.first_name
        }
        
        if (userProfile?.email) {
            return userProfile.email
        }
        
        return 'Your Name'
    }

    // 🎯 FIXED: More robust status logic  
    const getUserStatus = () => {
        if (userProfile?.role) {
            return `Active ${userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}`
        }
        return userType ? `Active ${userType.charAt(0).toUpperCase() + userType.slice(1)}` : 'Active User'
    }

    return (
        <div className={styles['profile-page']}>

            <div className={styles['profile-card']}>
                {/* Animated Header */}
                <div className={styles['profile-header']}>
                    <div className={styles['profile-avatar-container']}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            className={styles['profile-avatar']} 
                            src={userProfile?.profile_pic || "/placeholder-avatar.png"}
                            alt="Profile"
                        />
                        <div className={styles['avatar-glow']}></div>
                        <div className={styles['avatar-ring']}></div>
                    </div>
                    <div className={styles['profile-title-group']}>
                        <h1 className={styles['profile-title']}>
                            {getDisplayName()}
                        </h1>
                        <span className={styles['profile-status']}>
                            {getUserStatus()}
                        </span>
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