"use client"

import { usePathname, useRouter } from "next/navigation"
import { myAppHook } from "./AppUtils"
import { useEffect, useState } from "react"
import { ROUTES, PUBLIC_ROUTES } from '@/constants/routes'

export function AuthProtection () {
    const {
        isLoggedIn,
        // refreshUserSession,
        isLoading: globalLoading,
        authToken
    } = myAppHook()

    const [localLoading, setLocalLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {

        // Don't do anything while global loading is happening
        if (globalLoading) {
            console.log('Global loading in progress, waiting...');
            return;
        }

    //     async function checkAuth(){
    //         setLocalLoading(true)

    //         try {
    //             const isAuth = await refreshUserSession()
    //             console.log("Auth protection check - Path:", pathname, "IsLoggedIn:", isAuth)
    
    //             if (
    //                 !isAuth && 
    //                 !PUBLIC_ROUTES.includes(pathname)
    //             ) {
    //                 console.log("Redirecting to login: User not logged in and route is protected")
    //                 router.push(ROUTES.LOGIN)
    //             }
                
    //             if (
    //                 isAuth && 
    //                 (
    //                     pathname === ROUTES.LOGIN 
    //                     // || pathname === ROUTES.REGISTER      //unya nani
    //                 )
    //             ) {
    //                 console.log("Redirecting to dashboard: User is logged in and on login page")
    //                 router.push(ROUTES.DASHBOARD)
    //                 return
    //             }
    //         } catch (error) {
    //             console.error('Auth check error: ', error)
    //         } finally {
    //             setLocalLoading(false)
    //         }
    //     }

    //     checkAuth()
        
    // },
    // [pathname, router])
        async function handleRouteProtection() {
            setLocalLoading(true)
            
            try {
                console.log("Auth protection check - Path:", pathname, "IsLoggedIn:", isLoggedIn, "HasToken:", !!authToken)

                // Redirect to login if not authenticated and route is protected
                if (!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
                    console.log("Redirecting to login: User not logged in and route is protected")
                    router.push(ROUTES.HOME)
                    return
                }
                
                // Redirect to dashboard if authenticated and on login page
                if (isLoggedIn && 
                    (
                        pathname === ROUTES.LOGIN
                        && pathname === ROUTES.REGISTER
                    )
                ) {
                    console.log("Redirecting to dashboard: User is logged in and on login page")
                    // router.push(ROUTES.DASHBOARD)
                    router.push(pathname)
                    return
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