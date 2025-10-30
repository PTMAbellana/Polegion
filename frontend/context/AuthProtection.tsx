"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ROUTES, PUBLIC_ROUTES, STUDENT_ROUTES, TEACHER_ROUTES } from '@/constants/routes'
import { useAuthStore } from "@/store/authStore"

export function AuthProtection() {
    const {
        isLoggedIn,
        authLoading,
        appLoading,
        authToken,
        userProfile
    } = useAuthStore()

    const [localLoading, setLocalLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    const globalLoading = authLoading || appLoading;

    useEffect(() => {
        if (globalLoading) {
            setLocalLoading(true);
            return;
        }

        const handleRouteProtection = () => {
            setLocalLoading(true)
            
            try {
                // Redirect to home if not authenticated and route is protected
                if (!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
                    router.replace(ROUTES.HOME)
                    return;
                }

                // Redirect to dashboard if authenticated and on public routes
                if (isLoggedIn && PUBLIC_ROUTES.includes(pathname)) {
                    switch (userProfile?.role) {
                        case 'student':
                            router.replace(STUDENT_ROUTES.DASHBOARD)
                            break;
                        case 'teacher':
                        case 'admin':
                            router.replace(TEACHER_ROUTES.DASHBOARD)
                            break;
                        default:
                            router.replace(ROUTES.DASHBOARD)
                    }
                    return;
                }
            } catch (error) {
                console.error('Auth protection error:', error)
            } finally {
                setLocalLoading(false)
            }
        }

        const timer = setTimeout(handleRouteProtection, 100);
        return () => clearTimeout(timer);
    }, [pathname, router, isLoggedIn, globalLoading, authToken])

    return { 
        isLoggedIn,
        isLoading: localLoading || globalLoading
    }
}
