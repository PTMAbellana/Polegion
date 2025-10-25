"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import ProfileInfoItem from '@/components/profile/ProfileInfoItem'
import AnimatedAvatar from '@/components/profile/AnimatedAvatar'
import styles from '@/styles/profile.module.css'
import { ROUTES, STUDENT_ROUTES, TEACHER_ROUTES } from '@/constants/routes'
import { ProfileCardProps } from '@/types/props/profile'


export default function ProfileCard({ 
    userType 
}: ProfileCardProps) {
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
        let route;
        switch(userType) {
            case "student":
                route = STUDENT_ROUTES.EDIT_PROFILE;
                break;
            case "teacher":
                route = TEACHER_ROUTES.EDIT_PROFILE;
                break;
            default:
                route = ROUTES.EDIT_PROFILE;
        }
        router.push(route)
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
                {/* Left Side - Large Profile Picture */}
                <div className={styles['profile-left']}>
                    <div className={styles['profile-avatar-large']}>
                        <AnimatedAvatar
                            src={userProfile?.profile_pic}
                            alt="Profile"
                            className={styles['avatar-large']}
                        />
                    </div>
                </div>

                {/* Right Side - Profile Information */}
                <div className={styles['profile-right']}>
                    {/* Profile Header */}
                    <div className={styles['profile-header']}>
                        <h1 className={styles['profile-title']}>
                            {getDisplayName()}
                        </h1>
                        <span className={styles['profile-status']}>
                            {getUserStatus()}
                        </span>
                    </div>

                    {/* Profile Details */}
                    <div className={styles['profile-details']}>
                        <ProfileInfoItem 
                            label="Email" 
                            value={userProfile?.email} 
                        />
                        <ProfileInfoItem 
                            label="Phone Number" 
                            value={userProfile?.phone} 
                        />
                        <ProfileInfoItem 
                            label="Gender" 
                            value={userProfile?.gender} 
                            fallback="Not specified"
                        />
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