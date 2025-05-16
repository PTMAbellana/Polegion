"use client"
import styles from '@/styles/dashboard.module.css'

export default function VirtualRooms() {
    return (
        <div className={styles['dashboard-container']}>
            <div className={styles["main-content"]}>
                <div className={styles["welcome-section"]}>
                    <h1>Virtual Rooms</h1>
                </div>
            </div>
        </div>
    )
}