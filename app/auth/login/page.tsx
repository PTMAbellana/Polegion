"use client";
import Head from 'next/head';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
import Loader from "@/components/Loader"; 

// Import icons
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

// Import CSS Module
import styles from '@/styles/login.module.css';

const formSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid Email value"),
    password: yup.string().required("Password is required")
});

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid Email value")
});

export default function Login() {
    const router = useRouter();
    const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [resetPasswordSubmitting, setResetPasswordSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm({
        resolver: yupResolver(formSchema)
    });

    const {
        register: registerForgotPassword,
        handleSubmit: handleForgotPasswordSubmit,
        formState: { errors: forgotPasswordErrors }
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema)
    });

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/auth/dashboard");
            return;
        }
    }, [isLoggedIn, router]);

    const handleSocialOauth = async (provider: "google" | "github") => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/dashboard`
                }
            });

            if (error) {
                toast.error(`Failed to login via ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
            }
        } catch (error) {
            toast.error("An error occurred during authentication");
        }
    };

    const onSubmit = async (formdata: any) => {
        try {
            const { email, password } = formdata;
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            });
            
            if (error) {
                toast.error("Invalid login details");
            } else {
                if (data.session?.access_token) {
                    setAuthToken(data.session?.access_token);
                    localStorage.setItem("access_token", data.session?.access_token);
                    
                    if (rememberMe) {
                        // You can implement more secure methods for "remember me" functionality
                        localStorage.setItem("remember_user", "true");
                    }
                    
                    setIsLoggedIn(true);
                    toast.success("User logged in successfully!");
                }
            }
        } catch (error) {
            toast.error("An error occurred during login");
        }
    };

    const handleRegisterRedirect = () => {
        router.push("/auth/register");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = () => {
        setShowForgotPasswordModal(true);
    };

    const handleCloseModal = () => {
        setShowForgotPasswordModal(false);
    };

    const onForgotPasswordSubmit = async (formdata: any) => {
        try {
            setResetPasswordSubmitting(true);
            const { email } = formdata;
            
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            });
            
            if (error) {
                toast.error("Failed to send password reset email");
            } else {
                toast.success("Password reset link sent to your email");
                setShowForgotPasswordModal(false);
            }
        } catch (error) {
            toast.error("An error occurred while processing your request");
        } finally {
            setResetPasswordSubmitting(false);
        }
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (showForgotPasswordModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showForgotPasswordModal]);

    return (
        <>
            <Head>
                <title>Login | Polegion</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet" />
            </Head>

            <Navbar />

            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <div className={styles.cardContent}>
                    {isSubmitting ? <Loader size="small" /> : ""}
                    {/* Logo */}
                        <div className={styles.logoContainer}>
                            <img 
                                src="/images/polegionLogo.png" 
                                alt="Logo" 
                                className={styles.logo} 
                            />
                        </div>

                        <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
                        <p className={styles.welcomeSubtitle}>Unleash your Inner Legend!</p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.formGroup}>
                                <input 
                                    type="email" 
                                    className={styles.inputField} 
                                    placeholder="Enter your email"
                                    {...register("email")} 
                                />
                                {errors.email && <p className={styles.error}>{errors.email.message?.toString()}</p>}
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.passwordInput}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className={styles.inputField} 
                                        placeholder="Enter your password"
                                        {...register("password")} 
                                    />
                                    <button 
                                        type="button" 
                                        className={styles.passwordToggle} 
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className={styles.error}>{errors.password.message?.toString()}</p>}
                            </div>

                            <div className={styles.rememberForgot}>
                                <div className={styles.rememberMe}>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        className={styles.checkbox}
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <label htmlFor="rememberMe" className={styles.rememberText}>Remember me</label>
                                </div>
                                <a 
                                    onClick={handleForgotPassword} 
                                    className={styles.forgotPassword}
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <button 
                                type="submit" 
                                className={styles.loginButton} 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <div className={styles.socialDivider}>
                            <div className={styles.dividerLine}></div>
                            <span className={styles.dividerText}>OR</span>
                            <div className={styles.dividerLine}></div>
                        </div>

                        <div className={styles.socialButtons}>
                            <button 
                                className={styles.socialButton} 
                                onClick={() => handleSocialOauth("google")}
                            >
                                <FcGoogle size={24} className={styles.socialIcon} />
                                Google
                            </button>
                            <button 
                                className={styles.socialButton} 
                                onClick={() => handleSocialOauth("github")}
                            >
                                <FaGithub size={24} className={styles.socialIcon} />
                                GitHub
                            </button>
                        </div>

                        <p className={styles.registerPrompt}>
                            Don't have an Account? <span onClick={handleRegisterRedirect} className={styles.registerLink}>Register</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Reset Password</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={handleCloseModal}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <p className={styles.modalDescription}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                        <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
                            <div className={styles.formGroup}>
                                <input 
                                    type="email" 
                                    className={styles.inputField} 
                                    placeholder="Enter your email"
                                    {...registerForgotPassword("email")} 
                                />
                                {forgotPasswordErrors.email && 
                                    <p className={styles.error}>{forgotPasswordErrors.email.message?.toString()}</p>
                                }
                            </div>
                            
                            <button 
                                type="submit" 
                                className={styles.forgotPasswordButton}
                                disabled={resetPasswordSubmitting}
                            >
                                {resetPasswordSubmitting ? (
                                    <>
                                        <Loader size="tiny" />
                                        <span>Sending...</span>
                                    </>
                                ) : "Send Reset Link"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}