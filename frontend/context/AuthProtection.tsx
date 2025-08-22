"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ROUTES, PUBLIC_ROUTES } from '@/constants/routes'
import { useAuthStore } from "@/store/authStore"

export function AuthProtection () {
    const {
        isLoggedIn,
        authLoading,
        appLoading,
        authToken
    } = useAuthStore()

    const [localLoading, setLocalLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Combine loading states for convenience
    const globalLoading = authLoading || appLoading;

    useEffect(() => {
        if (globalLoading) {
            setLocalLoading(true);
            return;
        }

        async function handleRouteProtection() {
            setLocalLoading(true)
            try {
                console.log("Auth protection check - Path:", pathname, "IsLoggedIn:", isLoggedIn, "HasToken:", !!authToken)

                // Redirect to login if not authenticated and route is protected
                if (!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
                    console.log("Redirecting to login: User not logged in and route is protected")
                    router.replace(ROUTES.HOME)
                    return;
                }

                // Redirect to dashboard if authenticated and on login or register page
                if (
                    isLoggedIn &&
                    PUBLIC_ROUTES.includes(pathname)
                    // (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER)
                ) {
                    console.log("Redirecting to dashboard: User is logged in and on login/register page")
                    router.replace(ROUTES.DASHBOARD)
                    return;
                }

                console.log('Route protection check completed')
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
