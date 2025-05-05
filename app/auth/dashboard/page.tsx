"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { myAppHook } from "@/context/AppUtils";
import Navbar from "@/components/Navbar";
import styles from '@/styles/room.module.css';

interface RoomType {
  id?: number;
  title?: string;
  description?: string;
  mantra?: string;
  banner_image?: string | null;
  created_at?: string;
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [userId, setUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setLocalLoading] = useState(false);

  const { setAuthToken, setIsLoggedIn, isLoggedIn, setUserProfile, setIsLoading } = myAppHook();
  const router = useRouter();

  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Failed to get user data");
        router.push("/auth/login");
        return;
      }
      setIsLoading(true);
      if (data.session?.access_token) {
        setAuthToken(data.session?.access_token);
        setUserId(data.session?.user.id);
        localStorage.setItem("access_token", data.session?.access_token);
        setIsLoggedIn(true);
        setUserProfile({
          name: data.session.user?.user_metadata.fullName,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
        });
        localStorage.setItem("user_profile", JSON.stringify({
          name: data.session.user?.user_metadata.fullName,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
        }));
        fetchRoomsFromTable(data.session.user.id);
      }
      setIsLoading(false);
    };

    handleLoginSession();
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
  }, []);

  const fetchRoomsFromTable = async (userId: string) => {
    setLocalLoading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("user_id", userId)
      .order('created_at', { ascending: false });

    if (data) {
      setRooms(data);
    }
    setLocalLoading(false);
  };

  // View Room Details
  const handleViewRoom = (roomId: number) => {
    router.push(`/rooms/${roomId}`);
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const userProfile = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem("user_profile") || '{"name": "User"}')
    : { name: "User" };

  return (
    <div className={styles["dashboard-container"]}>
      <Navbar onToggleSidebar={toggleSidebar} />

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
                            onClick={() => handleViewRoom(room.id)}
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
  );
}