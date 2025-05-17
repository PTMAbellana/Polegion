"use client"
import styles from '@/styles/dashboard.module.css'

export default function Leaderboard() {
    return (
        <div className={styles['dashboard-container']}>
            <div className={styles["main-content"]}>
                <div className={styles["welcome-section"]}>
                    <h1>Leaderboard</h1>
                </div>
            </div>
        </div>
    )
}