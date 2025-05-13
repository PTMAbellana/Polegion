"use client"
import { myAppHook } from '@/context/AppUtils';
import styles from '@/styles/dashboard.module.css'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getRooms } from '@/lib/apiService'

interface RoomType {
    id?: number;
    title?: string;
    description?: string;
    mantra?: string;
    banner_image?: string | null;
    created_at?: string;
}

export default function Dashboard() {
    const [rooms, setRooms] = useState<RoomType[]>([])
    const [userId, setUserId] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isLoading, setLocalLoading] = useState(false)

    const {
        isLoggedIn,
        userProfile, 
        setAuthToken, 
        setIsLoggedIn, 
        setUserProfile, 
        setIsLoading
    } = myAppHook()

    const router = useRouter()

    // unya sa ni bhe
    // get session mn ni sha
    // aa kailangan nani aty
    // aa i usa ni nako folder bhe, i ngan /home
    // para mag tipon nya si nako mag sigeg session2
    // kapoy tawag session TTOTT
    
    // useEffect( () => {
    //     const handleLoginSession = async () => {
    //         // i add ni sa kuan, backend
    //         // session handling
    //         // plus, i ano sd ni sha, i tipon tanan useEffect guro
    //         // para limpyo
    //         // ga labad ako ulo subay ani tanan TTOTT
    //     }
    //     // handleLoginSession()
    //     if (!isLoggedIn){
    //         router.push("/auth/login")
    //         return
    //     }
    // }, [])

    // ayyha? samaniiiii?!?!?!? 
    // i dont know this lage AHAHHHA
    // ilisdan ning name bhe
    // maan shag ano, na directly call sa db bisag wala na
    const fetchRoomsFromTable = async (userId: string) => {
        try{
            setLocalLoading(true)
            const response = await getRooms()
            
            if (!response) console.error("Failed to get rooms")
            setLocalLoading(false)
        } catch (error) {
            console.error("Error in fetching of rooms")
        }
    }

    const handleViewRoom = (roomId: string) => {
        router.push(`/virtual-rooms/${roomId}`)
    }

    return (
        <div className={styles["dashboard-container"]}>
      {/* <> */}
        {/* Main Content */}
        <div className={`${styles["main-content"]} ${sidebarOpen ? styles["sidebar-open"] : ''}`}>
          <div className={styles["welcome-section"]}>
            <h3>Welcome, {userProfile.name}!</h3>
            <h1>Dashboard</h1>
          </div>
  
          {isLoading ? (
            <div className={styles["loading-indicator"]}>Loading...</div>
          ) : (
            <div className={styles["dashboard-grid"]} style={{ gridTemplateColumns: "1fr" }}>
              {/* Room Cards Section */}
              <div className={styles["room-cards-section"]}>
                <h2>Your Virtual Rooms</h2>
                {rooms && rooms.length > 0 ? (
                  <div className={styles["room-cards"]}>
                    {rooms.map((room, index) => (
                      <div className={styles["room-card"]} key={index}>
                        <div className={styles["room-card-banner"]}>
                          {room.banner_image ? (
                            <img src={room.banner_image} alt={room.title} />
                          ) : (
                            <div className={styles["room-card-banner-placeholder"]}>
                              No Image
                            </div>
                          )}
                        </div>
                        <div className={styles["room-card-content"]}>
                          <h3 className={styles["room-card-title"]}>{room.title}</h3>
                          <p className={styles["room-card-description"]}>{room.description}</p>
                          <p className={styles["room-card-mantra"]}>"{room.mantra}"</p>
                          <div className={styles["room-card-actions"]}>
                            <button
                              className={styles["view-btn"]}
                              onClick={() => handleViewRoom(room.code)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles["no-data"]}>
                    No rooms found. Contact admin to create your first virtual room.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
}