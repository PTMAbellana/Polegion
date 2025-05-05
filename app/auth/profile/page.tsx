"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import styles from '@/styles/dashboard.module.css';

export default function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: "User",
        email: "",
        phone: "",
        gender: ""
    });
    const { userProfile, setUserProfile, setIsLoggedIn, setAuthToken } = myAppHook();
    const router = useRouter();

    useEffect(() => {
        const handleLoginSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    toast.error("Failed to get user data");
                    router.push("/auth/login");
                    return;
                }
                
                if (data.session?.access_token) {
                    setAuthToken(data.session?.access_token);
                    localStorage.setItem("access_token", data.session?.access_token);
                    setIsLoggedIn(true);
                    
                    const userData = {
                        name: data.session.user?.user_metadata.fullName || "User",
                        email: data.session.user?.user_metadata.email || "",
                        gender: data.session.user?.user_metadata.gender || "",
                        phone: data.session.user?.user_metadata.phone || "",
                    };
                    
                    setUserProfile(userData);
                    setProfileData(userData);
                    localStorage.setItem("user_profile", JSON.stringify(userData));
                }
            } catch (err) {
                console.error("Session error:", err);
                toast.error("An error occurred while retrieving session");
            } finally {
                setIsLoading(false);
            }
        };

        handleLoginSession();
    }, []);

    // Use the profile data from state instead of directly accessing localStorage
    useEffect(() => {
        if (userProfile) {
            setProfileData(userProfile);
        }
    }, [userProfile]);

    // Toggle Sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={styles["dashboard-container"]}>
            <Navbar onToggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className={`${styles["main-content"]} ${sidebarOpen ? styles["sidebar-open"] : ''}`}>
                <div className={styles["welcome-section"]}>
                    <h3>Welcome, {profileData.name}!</h3>
                    <h1>Profile</h1>
                </div>

                {isLoading ? (
                    <div className={styles["loading-indicator"]}>Loading...</div>
                ) : (
                    <div className={styles["dashboard-grid"]}>
                        <div className={`${styles.card} ${styles["profile-card"]}`}>
                            <h3>User Information</h3>
                            <div className={styles["profile-info"]}>
                                <div className={styles["info-item"]}>
                                    <label>Name</label>
                                    <p>{profileData.name}</p>
                                </div>
                                <div className={styles["info-item"]}>
                                    <label>Email</label>
                                    <p>{profileData.email || "Not provided"}</p>
                                </div>
                                <div className={styles["info-item"]}>
                                    <label>Phone</label>
                                    <p>{profileData.phone || "Not provided"}</p>
                                </div>
                                <div className={styles["info-item"]}>
                                    <label>Gender</label>
                                    <p>{profileData.gender || "Not provided"}</p>
                                </div>
                                <div className={styles["form-actions"]}>
                                    <button 
                                        className={styles["submit-btn"]}
                                        onClick={() => router.push("/profile/edit")}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* <Footer /> */}
        </div>
    );
}