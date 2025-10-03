"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaHome, FaTrophy, FaUser, FaSignOutAlt, FaBars, FaTimes, FaChalkboardTeacher, FaDungeon, FaMedal, FaUserAstronaut, FaFortAwesome, FaShapes } from 'react-icons/fa';
import styles from '@/styles/navbar.module.css';

import { ROUTES, STUDENT_ROUTES, TEACHER_ROUTES } from '@/constants/routes'
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";

const Sidebar = (
    {
        userRole
    } : {
        userRole: 'teacher' | 'student' | null
    }
) => {
    const {isLoggedIn, logout } = useAuthStore();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // temporary paths
    // Navigation items for teachers
    const teacherNavItems = [
        { path: TEACHER_ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
        { path: TEACHER_ROUTES.VIRTUAL_ROOMS, icon: FaChalkboardTeacher, label: 'Virtual Rooms', title: 'Virtual Rooms' },
        { path: ROUTES.LEADERBOARD, icon: FaTrophy, label: 'Leaderboards', title: 'Leaderboard' },
        { path: TEACHER_ROUTES.PROFILE, icon: FaUser, label: 'Profile', title: 'Profile' },
    ];

    // Navigation items for students
    const studentNavItems = [
        { path: STUDENT_ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
        { path: STUDENT_ROUTES.JOINED_ROOMS, icon: FaDungeon, label: 'Joined Rooms', title: 'Joined Rooms' },
        { path: STUDENT_ROUTES.WORLD_MAP, icon: FaFortAwesome, label: 'World Map', title: 'World Map' },
        { path: STUDENT_ROUTES.PLAYGROUND, icon: FaShapes, label: 'Playground', title: 'Playground' },
        { path: ROUTES.LEADERBOARD, icon: FaMedal, label: 'Wall of Fame', title: 'Leaderboard' },
        { path: STUDENT_ROUTES.PROFILE, icon: FaUserAstronaut, label: 'Profile', title: 'Profile' },
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
                
            } catch (error) {
                console.log('Logout error: ', error);
                
                // Show error alert
                Swal.fire({
                    title: 'Logout Error',
                    text: 'There was an error during logout, but your session has been cleared.',
                    icon: 'warning',
                    confirmButtonColor: '#f59e0b',
                    confirmButtonText: 'OK'
                });
                
                toast.error('Error during logout, session cleared');
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
