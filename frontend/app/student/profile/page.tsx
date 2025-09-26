"use client"

import ProfileCard from '@/components/ProfileCard'
import { useAuthStore } from '@/store/authStore'

export default function StudentProfilePage() {
    const { userProfile } = useAuthStore()
    console.log('userProfile in StudentProfilePage: ', userProfile)
    return <ProfileCard userType="student" />
}
