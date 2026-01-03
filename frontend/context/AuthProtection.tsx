"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ROUTES, PUBLIC_ROUTES, STUDENT_ROUTES } from '@/constants/routes'
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
                    router.replace(STUDENT_ROUTES.DASHBOARD);
                    return;
                }
            } catch (error) {
                console.error('Auth protection error:', error)
            } finally {
                setLocalLoading(false)
            }
        }

        handleRouteProtection();
    }, [pathname, router, isLoggedIn, globalLoading, authToken])

    return { 
        isLoggedIn,
        isLoading: localLoading || globalLoading
    }
}
