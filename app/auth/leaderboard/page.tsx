"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { myAppHook } from "@/context/AppUtils";
import Navbar from "@/components/Navbar"; // Import Navbar
import styles from '@/styles/room.module.css';

export default function Leaderboard() {
  const [rooms, setRooms] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setLocalLoading] = useState(false);

  const { setAuthToken, setIsLoggedIn, setUserProfile, setIsLoading } = myAppHook();
  const router = useRouter();

  useEffect(() => {
    // Handle login session and fetch data...
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles["dashboard-container"]}>
      <Navbar onToggleSidebar={toggleSidebar} /> {/* Use the Navbar here */}

      {/* Main Content */}
      <div className={`${styles["main-content"]} ${sidebarOpen ? styles["sidebar-open"] : ''}`}>
        {/* Content goes here */}
      </div>
    </div>
  );
}
