"use client";
import Navbar from "@/components/Navbar";
import { myAppHook } from "@/context/AppUtils";
import { useState } from "react";
import styles from '@/styles/dashboard.module.css';

export default function Profile() {
    const { userProfile } = myAppHook();
    const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar visibility

    // Toggle Sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={styles["dashboard-container"]}>
            <Navbar onToggleSidebar={toggleSidebar} /> {/* Pass toggle function to Navbar */}
            
            <div className={`${styles["main-content"]} ${sidebarOpen ? styles["sidebar-open"] : ''}`}>
                {userProfile ? (
                    <div className="container mt-5">
                        <h2>Profile</h2>
                        <div className="card p-4 shadow-sm">
                            <p><strong>Name: </strong> {userProfile?.name} </p>
                            <p><strong>Email: </strong> {userProfile?.email}</p>
                            <p><strong>Phone: </strong> {userProfile?.phone}</p>
                            <p><strong>Gender: </strong> {userProfile?.gender}</p>
                        </div>
                    </div>
                ) : (
                    <p> No Profile Found</p>
                )}
            </div>

            {/* <Footer /> */}
        </div>
    );
}
