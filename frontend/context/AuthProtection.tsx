"use client"

import { usePathname, useRouter } from "next/navigation"
import { myAppHook } from "./AppUtils"
import { useEffect, useState } from "react"
import { ROUTES, PUBLIC_ROUTES } from '@/constants/routes'

export function AuthProtection () {
    const {
        isLoggedIn,
        refreshUserSession,
        isLoading: globalLoading
    } = myAppHook()

    const [localLoading, setLocalLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {

        async function checkAuth(){
            setLocalLoading(true)

            try {
                const isAuth = await refreshUserSession()
                console.log("Auth protection check - Path:", pathname, "IsLoggedIn:", isAuth)
    
                // if (
                //     !isAuth && 
                //     !PUBLIC_ROUTES.includes(pathname)
                // ) {
                //     console.log("Redirecting to login: User not logged in and route is protected")
                //     router.push(ROUTES.LOGIN)
                // }
                
                if (
                    isAuth && 
                    (
                        pathname === ROUTES.LOGIN 
                        // || pathname === ROUTES.REGISTER      //unya nani
                    )
                ) {
                    console.log("Redirecting to dashboard: User is logged in and on login page")
                    router.push(ROUTES.DASHBOARD)
                    return
                }
            } catch (error) {
                console.error('Auth check error: ', error)
            } finally {
                setLocalLoading(false)
            }
        }

        checkAuth()
        
    },
    [pathname, router])

    return { 
        isLoggedIn,
        isLoading: localLoading || globalLoading
    }
}