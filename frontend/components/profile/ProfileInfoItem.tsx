import React from 'react'
import styles from '@/styles/profile.module.css'
import { ProfileInfoItemProps } from '@/types/props/profile'


export default function ProfileInfoItem({ 
    label, 
    value, 
    fallback = 'N/A' 
}: ProfileInfoItemProps) {
    return (
        <div className={styles['profile-info-group']}>
            <label className={styles['profile-label']}>{label}</label>
            <div className={styles['profile-value']}>
                {value || fallback}
            </div>
        </div>
    )
}