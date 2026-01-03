"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styles from '@/styles/navbar.module.css';
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";
import { studentNavItems, teacherNavItems } from "@/constants/nav";

const Sidebar = (
    {
        userRole
    } : {
        userRole: 'teacher' | 'student' | 'admin' | null 
    }
) => {
    const {isLoggedIn, logout } = useAuthStore();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const navItems = userRole === 'student' ? studentNavItems : teacherNavItems;

    useEffect(() => {
        const checkMobile = () => {
            const isPortrait = window.innerWidth <= 768;
            const isLandscape = window.innerWidth <= 900 && window.innerHeight <= 500;
            const isMobileDevice = isPortrait || isLandscape;
            
            setIsMobile(isMobileDevice);
            if (isMobileDevice) {
                setIsCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        window.addEventListener('orientationchange', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('orientationchange', checkMobile);
        };
    }, []);

    // Handle click outside to close sidebar on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only handle on mobile when sidebar is open
            if (!isMobile || isCollapsed) return;

            const target = event.target as Node;
            
            // Check if click is outside sidebar and not on the toggle button
            if (
                sidebarRef.current && 
                !sidebarRef.current.contains(target) &&
                !(target as Element).closest(`.${styles["mobile-toggle-btn"]}`)
            ) {
                setIsCollapsed(true);
            }
        };

        // Add event listener
        if (isMobile && !isCollapsed) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobile, isCollapsed]);

    const handleLogout = async () => {
        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout from your account?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
        });

        // If user confirmed logout
        if (result.isConfirmed) {
            try {
                logout();
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
                    {/* Mobile Overlay */}
                    {isMobile && !isCollapsed && (
                        <div 
                            className={styles.overlay}
                            onClick={() => setIsCollapsed(true)}
                        />
                    )}

                    {/* Sidebar */}
                    <div 
                        ref={sidebarRef}
                        className={sidebarClass}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className={styles["logo-container"]}>
                            {isCollapsed && !isHovering ? (
                                <img
                                src="/images/polegionIcon.webp"
                                alt="Polegion Icon"
                                className={styles["logo-icon"]}
                                />
                            ) : (
                                <img
                                src="/images/polegionLogoWhite.webp"
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
