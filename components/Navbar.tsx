"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaHome, FaDoorOpen, FaTrophy, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styles from '@/styles/navbar.module.css';

const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, setAuthToken, setUserProfile } = myAppHook();
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to logout");
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_profile");
            setIsLoggedIn(false);
            setAuthToken(null);
            setUserProfile(null);
            toast.success("Logged out successfully");
            router.push("/auth/login");
        }
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovering(false);
        }
    };

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            {isLoggedIn && isMobile && (
                <button 
                    className={`${styles["mobile-toggle-btn"]} ${!isCollapsed ? styles["sidebar-open"] : ''}`}
                    onClick={toggleSidebar}
                >
                    {!isCollapsed ? <FaTimes /> : <FaBars />}
                </button>
            )}

            {isLoggedIn ? (
                <>
                    {/* Sidebar */}
                    <div 
                        className={`
                            ${styles.sidebar} 
                            ${isCollapsed && !isHovering ? styles.collapsed : styles.expanded}
                            ${!isCollapsed && isMobile ? styles.open : ''}
                            ${isCollapsed && isMobile ? styles.closed : ''}
                        `}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className={styles["logo-container"]}>
                            {isCollapsed && !isHovering ? (
                                <div className={styles["logo-icon"]}>P</div>
                            ) : (
                                <h2>Polegion</h2>
                            )}
                        </div>
                        <nav className={styles["sidebar-nav"]}>
                            <ul>
                                <li className={isActive("/auth/dashboard") ? styles.active : ""}>
                                    <Link href="/auth/dashboard" title="Home">
                                        <FaHome className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Home</span>
                                    </Link>
                                </li>
                                <li className={isActive("/auth/virtualRooms") ? styles.active : ""}>
                                    <Link href="/auth/virtualRooms" title="Virtual Rooms">
                                        <FaDoorOpen className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Virtual Rooms</span>
                                    </Link>
                                </li>
                                <li className={isActive("/leaderboard") ? styles.active : ""}>
                                    <Link href="/leaderboard" title="Leaderboard">
                                        <FaTrophy className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Leaderboard</span>
                                    </Link>
                                </li>
                                <li className={isActive("/auth/profile") ? styles.active : ""}>
                                    <Link href="/auth/profile" title="Profile">
                                        <FaUser className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Profile</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className={styles["logout-container"]}>
                            <button onClick={handleLogout} className={styles["logout-btn"]} title="Logout">
                                <FaSignOutAlt className={styles["nav-icon"]} />
                                <span className={styles["nav-text"]}>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <nav className={styles["public-nav"]}>
                    <div className={styles["logo-container"]}>
                        <h2>EduVR</h2>
                    </div>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/auth/login">Login</Link>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
};

export default Navbar;