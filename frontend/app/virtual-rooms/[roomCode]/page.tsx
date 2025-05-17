"use client"
import Loader from '@/components/Loader'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { getRoomByCode } from '@/lib/apiService'
import styles from '@/styles/dashboard.module.css'
import { use, useEffect, useState } from 'react'

interface Room{
    title: string
    description: string
    mantra: string
    banner_image: string | File | undefined
    code: string
}

export default function RoomDetail({ params } : { params  : Promise<{roomCode : string }> }){
    const roomCode = use(params)
    const [ roomDetails, setRoomDetails ] = useState<Room | null>(null)

    const { isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    console.log('room code ', roomCode)

    useEffect(() => {
        
        if (
            isLoggedIn && 
            !authLoading
        ) {
            callMe()
            console.log('roomDetails 2 ', roomDetails)
        }
        else {
            if (authLoading) fullLoader()
            if (!isLoggedIn) fullLoader()
        }

    }, [isLoggedIn, authLoading])


    const callMe = async () => {
        const res = await getRoomByCode(roomCode.roomCode)
        console.log(res.data)
        setRoomDetails(res.data)
        console.log('roomDetails ', roomDetails)
    }

    const fullLoader = () => {
        console.log('Virtual Rooms: Auth is still loading')
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={styles["dashboard-container"]}>
            <div className={styles["main-content"]}>
                <p>
                    rararar
                </p>
                <p>
                    this is room code: {roomCode.roomCode}
                </p> 
                <p>
                    Room Details
                </p>
                <p>
                    {
                        roomDetails ?
                        <>
                            <p>title: {roomDetails.title}</p>
                            <p>description: {roomDetails.description}</p>
                            <p>mantra: {roomDetails.mantra}</p>
                            <p>code: {roomDetails.code}</p>
                            <p>image: </p>
                            <img src={roomDetails.banner_image} />
                        </> :
                        <p>wala</p>
                    }
                </p>
            </div>
        </div>
    )
}