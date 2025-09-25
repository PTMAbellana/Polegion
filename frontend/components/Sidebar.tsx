"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/api/auth";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaHome, FaTrophy, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import styles from '@/styles/navbar.module.css';

import { ROUTES } from '@/constants/routes'
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";

const Sidebar = () => {
    const {isLoggedIn, logout: contextLogout, userProfile} = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Get user role - could be from userProfile or route-based detection
    const getUserRole = () => {
        // Check if we're on a teacher or student route
        if (pathname.includes('/teacher/')) return 'teacher';
        if (pathname.includes('/student/')) return 'student';
        
        // Check user profile for role
        if (userProfile?.role) return userProfile.role;
        
        // Default to student if no clear indication
        return 'student';
    };

    const userRole = getUserRole();

    // temporary paths
    // Navigation items for teachers
    const teacherNavItems = [
        { path: ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
        { path: ROUTES.VIRTUAL_ROOMS, icon: FaChalkboardTeacher, label: 'Virtual Rooms', title: 'Virtual Rooms' },
        { path: ROUTES.LEADERBOARD, icon: FaTrophy, label: 'Leaderboards', title: 'Leaderboard' },
        { path: ROUTES.PROFILE, icon: FaUser, label: 'Profile', title: 'Profile' },
    ];

    // Navigation items for students
    const studentNavItems = [
        { path: ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
        { path: ROUTES.JOINED_ROOMS, icon: FaUsers, label: 'Joined Rooms', title: 'Joined Rooms' },
        { path: ROUTES.LEADERBOARD, icon: FaTrophy, label: 'Leaderboard', title: 'Leaderboard' },
        { path: ROUTES.PROFILE, icon: FaUser, label: 'Profile', title: 'Profile' },
    ];

    const navItems = userRole === 'teacher' ? teacherNavItems : studentNavItems;

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
        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to logout from your account?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
        });

        // If user confirmed logout
        if (result.isConfirmed) {
            // Show loading indicator
            Swal.fire({
                title: 'Logging out...',
                text: 'Please wait while we sign you out.',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                logout();
                contextLogout();
                
                // Close loading and show success
                Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown animate__faster'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp animate__faster'
                    }
                });
                
                toast.success("Logged out successfully");
                router.push(ROUTES.HOME);
                
            } catch (error) {
                console.log('Logout error: ', error);
                contextLogout();
                
                // Show error alert
                Swal.fire({
                    title: 'Logout Error',
                    text: 'There was an error during logout, but your session has been cleared.',
                    icon: 'warning',
                    confirmButtonColor: '#f59e0b',
                    confirmButtonText: 'OK'
                });
                
                toast.error('Error during logout, session cleared');
                router.push(ROUTES.HOME);
            }
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
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <li key={item.path} className={isActive(item.path) ? styles.active : ""}>
                                            <Link href={item.path} title={item.title}>
                                                <IconComponent className={styles["nav-icon"]} />
                                                <span className={styles["nav-text"]}>{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
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

export default Sidebar;
