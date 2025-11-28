import React from 'react'
import styles from '@/styles/profile.module.css'
import { AnimatedAvatarProps } from '@/types/props/profile'


export default function AnimatedAvatar({ 
    src, 
    alt = "Profile", 
    className = "" 
}: AnimatedAvatarProps) {
    return (
        <div className={`${styles['profile-avatar-container']} ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
                className={styles['profile-avatar']} 
                src={src || "/images/defaultImageProfile.png"}
                alt={alt}
            />
            <div className={styles['avatar-glow']}></div>
            <div className={styles['avatar-ring']}></div>
        </div>
    )
}