"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload'
import SecuritySettings from '@/components/profile/SecuritySettings'
import styles from '@/styles/profile.module.css'
import dashboardStyles from '@/styles/dashboard-wow.module.css'
import { STUDENT_ROUTES } from '@/constants/routes'

export default function StudentEditProfilePage() {
    const router = useRouter()
    const { isLoggedIn, userProfile, appLoading } = useAuthStore()
    const [activeTab, setActiveTab] = useState<'basic' | 'image' | 'security'>('basic')

    // Show loader while app is initializing or user is not logged in
    if (appLoading || !isLoggedIn) {
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    const handleFormSuccess = () => {
        // Could show a success toast here
        setTimeout(() => {
            router.push(STUDENT_ROUTES.PROFILE)
        }, 2000)
    }

    const handleCancel = () => {
        router.push(STUDENT_ROUTES.PROFILE)
    }

    const handleImageUploadSuccess = () => {
        // Image uploaded successfully, could show notification
    }

    const backButton = (
        <button
            type="button"
            onClick={handleCancel}
            className={styles['back-button']}
        >
            Back to Profile
        </button>
    )

    return (
        <div className={dashboardStyles['dashboard-container']}>
            <div className={styles['edit-profile-page']}>
                <PageHeader 
                    title="Edit Profile"
                    subtitle="Update your personal information and settings"
                    actionButton={backButton}
                />

            <div className={styles['edit-profile-container']}>
                {/* Tab Navigation */}
                <div className={styles['tab-navigation']}>
                    <button
                        className={`${styles['tab-button']} ${activeTab === 'basic' ? styles['active'] : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        Basic Info
                    </button>
                    <button
                        className={`${styles['tab-button']} ${activeTab === 'image' ? styles['active'] : ''}`}
                        onClick={() => setActiveTab('image')}
                    >
                        Profile Picture
                    </button>
                    <button
                        className={`${styles['tab-button']} ${activeTab === 'security' ? styles['active'] : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        Security
                    </button>
                </div>

                {/* Tab Content */}
                <div className={styles['tab-content']}>
                    {activeTab === 'basic' && (
                        <ProfileEditForm
                            onSuccess={handleFormSuccess}
                            onCancel={handleCancel}
                        />
                    )}

                    {activeTab === 'image' && (
                        <ProfileImageUpload
                            onSuccess={handleImageUploadSuccess}
                        />
                    )}

                    {activeTab === 'security' && (
                        <SecuritySettings
                            userEmail={userProfile?.email}
                        />
                    )}
                </div>
            </div>
        </div>
    )
    )
}