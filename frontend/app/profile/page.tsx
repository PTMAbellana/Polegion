"use client"
import Loader from '@/components/Loader'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import styles from '@/styles/dashboard.module.css'
import { useRouter } from 'next/navigation'

export default function Profile() {
    const router = useRouter()
    const { isLoggedIn, userProfile } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    // if (authLoading) {
    //     console.log('Dashboard: Auth is still loading')
    //     return (
    //         <div className={styles["loading-container"]}>
    //             <Loader/>
    //         </div>
    //     )
    // }

    if (!isLoggedIn) {
        console.log('Profile: User is not logged in')
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

                {authLoading ? (
                    <div className={styles["loading-indicator"]}>Loading...</div>
                ) : (
                    <div className={styles["dashboard-grid"]}>
                        <div className={`${styles.card} ${styles["profile-card"]}`}>
                            <h3>User Information</h3>
                            <div className={styles["profile-info"]}>
                                <div className={styles["info-item"]}>
                                    <label>Name</label>
                                    <p>{userProfile?.name}</p>
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
                )}

            </div>
        </div>
    )
}