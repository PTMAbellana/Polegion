'use client'

import { myAppHook } from "@/context/AppUtils"
import { AuthProtection } from "@/context/AuthProtection"
import { use, useEffect, useState } from "react"

import styles from '@/styles/dashboard.module.css'
import Loader from "@/components/Loader"

export default function JoinRoom({ params } : { params  : Promise<{roomCode : string }> }){
    console.log(params)
    const roomCode = use(params)

    const [ isLoading, setIsLoading ] = useState(true)

    const { isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    console.log(roomCode)

    useEffect(() => {
        if (isLoggedIn && !authLoading) {
            callMe()
        } else {
            if (authLoading || !isLoggedIn) setIsLoading(true)
        }
    }, [isLoggedIn, authLoading])

    const callMe = async() => {
        try {
            setIsLoading(true)
            //do something here like call the api for this room
        } catch (error) {
            console.log('Error fetching room details: ', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading || authLoading) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["loading-container"]}>
                    <Loader/>
                </div>
            </div>
        )
    }

    return (
        <div className={styles["dashboard-container"]}>
            Joined room: {roomCode.roomCode}
        </div>
    )
}