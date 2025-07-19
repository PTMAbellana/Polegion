"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useMyApp } from "@/context/AppUtils";
import { logout } from "@/api/auth";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaHome, FaDoorOpen, FaTrophy, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styles from '@/styles/navbar.module.css';

import { ROUTES } from '@/constants/routes'

const Navbar = () => {
    const { 
        isLoggedIn, 
        logout: contextLogout 
    } = useMyApp();
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
        console.log('clicked 0')
        try{
            await logout()
            contextLogout()
            
            toast.success("Logged out successfully")
            router.push(ROUTES.HOME)
            
        } catch (error){
            console.log('Logout error: ', error)
            contextLogout()
            toast.error('Error during logout, session cleared')
            router.push(ROUTES.HOME)
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

    const isActive = (path: string) => {
        return pathname === path;
    };

    // Determine sidebar class based on state
    const sidebarClass = `
        ${styles.sidebar} 
        ${isCollapsed && !isHovering ? styles.collapsed : ''} 
        ${!isCollapsed || isHovering ? styles.expanded : ''}
        ${!isCollapsed && isMobile ? styles.open : ''}
        ${isCollapsed && isMobile ? styles.closed : ''}
    `;

    return (
        <>
            {/* Mobile Toggle Button */}
            {isLoggedIn && isMobile && (
                <button 
                    className={`${styles["mobile-toggle-btn"]} ${!isCollapsed ? styles["sidebar-open"] : ''}`}
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                >
                    {!isCollapsed ? <FaTimes /> : <FaBars />}
                </button>
            )}

            {isLoggedIn && (
                <>
                    {/* Sidebar */}
                    <div 
                        className={sidebarClass}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className={styles["logo-container"]}>
                            {isCollapsed && !isHovering ? (
                                <img
                                src="/images/polegionIcon.png"
                                alt="Polegion Icon"
                                className={styles["logo-icon"]}
                                />
                            ) : (
                                <img
                                src="/images/polegionLogoWhite.png"
                                alt="Polegion Logo"
                                className={styles["logo-text"]}
                                />
                            )}
                        </div>
                        <nav className={styles["sidebar-nav"]}>
                            <ul>
                                <li className={isActive(ROUTES.DASHBOARD) ? styles.active : ""}>
                                    <Link href={ROUTES.DASHBOARD} title="Home">
                                        <FaHome className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Home</span>
                                    </Link>
                                </li>
                                <li className={isActive(ROUTES.VIRTUAL_ROOMS) ? styles.active : ""}>
                                    <Link href={ROUTES.VIRTUAL_ROOMS} title="Virtual Rooms">
                                        <FaDoorOpen className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Virtual Rooms</span>
                                    </Link>
                                </li>
                                <li className={isActive(ROUTES.LEADERBOARD) ? styles.active : ""}>
                                    <Link href={ROUTES.LEADERBOARD} title="Leaderboard">
                                        <FaTrophy className={styles["nav-icon"]} />
                                        <span className={styles["nav-text"]}>Leaderboard</span>
                                    </Link>
                                </li>
                                <li className={isActive(ROUTES.PROFILE) ? styles.active : ""}>
                                    <Link href={ROUTES.PROFILE} title="Profile">
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
            )}
        </>
    );
};

export default Navbar;
