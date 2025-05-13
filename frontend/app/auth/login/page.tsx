"use client"
import Loader from "@/components/Loader";
import Head from "next/head";

import styles from '@/styles/login.module.css'
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaGithub, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import * as yup from "yup"
import { myAppHook } from "@/context/AppUtils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { login } from '@/lib/apiService'
import toast from "react-hot-toast";

const formSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email address"),
    password: yup.string().required("Password is required")
})

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email address")
})

export default function Login() {
    const router = useRouter()
    
    const { 
        isLoggedIn, 
        setIsLoggedIn, 
        setAuthToken, 
        setUserProfile 
    } = myAppHook()
    
    const [ showPassword, setShowPassword ] = useState(false)
    const [ rememberMe, setRememberMe ] = useState(false)
    const [ showForgotPasswordModal, setShowForgotPasswordModal ] = useState(false)
    const [resetPasswordSubmitting, setResetPasswordSubmitting] = useState(false);

    useEffect( () => {
        if (isLoggedIn) {
            router.push("/dashboard")
            return
        }
    }, [isLoggedIn, router])

    const {
        register,
        handleSubmit,
        formState: {
            isSubmitting,
            errors
        }
    } = useForm({
        resolver: yupResolver(formSchema)
    })

    const {
        register: registerForgotPassword,
        handleSubmit: handleForgotPasswordSubmit, 
        formState: {
            errors: forgotPasswordErrors
        }
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema)
    })

    const handleSocialOauth = async (provider: "google" | "github") => {
        console.log('google or github')
        // todo:
        //      server side of signin with authentication (google | github)
    }

    const onSubmit = async (formdata: any) => {
        try {
            const { email, password } = formdata
            const response = await login(email,password)

            if (response.data.session?.access_token) {
                setAuthToken(response.data.session.access_token)
                localStorage.setItem("access_token", response.data.session.access_token)
                
                if (rememberMe) localStorage.setItem("remember_user", "true")
            }
            setIsLoggedIn(true)

            // there's something at the metro ka talaga! 
            // pero k nalang
            setUserProfile({
                name: response.data.session.user?.user_metadata.fullName,
                email: response.data.session.user?.user_metadata.email,
                gender: response.data.session.user?.user_metadata.gender,
                phone: response.data.session.user?.user_metadata.phone,
            })
        } catch (error) {
            toast.error("An error occurred during login");
        }
    }

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
        console.log('forgot password ohno!')
    }

    useEffect( () => {
        if (showForgotPasswordModal) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'unset'

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showForgotPasswordModal])

    return (
        <>
            <Head>
                <title>Login | Polegion</title>
            </Head>

            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <div className={styles.cardContent}>
                    {isSubmitting ? <Loader /> : ""}
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
                                        <Loader />
                                        <span>Sending...</span>
                                    </>
                                ) : "Send Reset Link"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}