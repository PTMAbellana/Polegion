"use client"

import React from 'react'
import Loader from '@/components/Loader'
import { myAppHook } from '@/context/AppUtils'
import styles from '@/styles/dashboard.module.css'
import { useRouter } from 'next/navigation'

export default function Profile() {
    const router = useRouter()
    const { isLoggedIn, userProfile, isLoading } = myAppHook()

    if (isLoading || !isLoggedIn) {
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={styles['dashboard-container']}>
            <div className={styles["main-content"]}>
                <div className={styles["welcome-section"]}>
                    <h1>Profile</h1>
                </div>

                <div className={styles["dashboard-grid"]}>
                    <div className={`${styles.card} ${styles["profile-card"]}`}>
                        <h3>User Information</h3>
                        <div className={styles["profile-info"]}>
                            <div className={styles["info-item"]}>
                                <label>Name</label>
                                <p>{userProfile?.fullName || "Not provided"}</p>
                            </div>
                            <div className={styles["info-item"]}>
                                <label>Email</label>
                                <p>{userProfile?.email || "Not provided"}</p>
                            </div>
                            <div className={styles["info-item"]}>
                                <label>Phone</label>
                                <p>{userProfile?.phone || "Not provided"}</p>
                            </div>
                            <div className={styles["info-item"]}>
                                <label>Gender</label>
                                <p>{userProfile?.gender || "Not provided"}</p>
                            </div>
                            <div className={styles["form-actions"]}>
                                <button
                                    className={styles["submit-btn"]}
                                    onClick={() => router.push("/profile/edit")}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}