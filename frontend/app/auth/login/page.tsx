"use client"
import Loader from "@/components/Loader"
import { myAppHook } from "@/context/AppUtils"
import { login, resetPassword } from "@/lib/apiService"
import { yupResolver } from "@hookform/resolvers/yup"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as yup from "yup"

import styles from '@/styles/login.module.css'
import { FaEye, FaEyeSlash, FaGithub, FaTimes } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

import { ROUTES } from '@/constants/routes'

interface LoginFormData {
    email: string
    password: string
}

interface ForgotPasswordFormData {
    email: string
}

const formSchema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup.string().required('Password is required')
})

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address')
})

export default function Login() {
    const router = useRouter()

    const {
        isLoggedIn,
        setIsLoggedIn,
        setAuthToken,
        setUserProfile,
        refreshUserSession,
        userProfile
    } = myAppHook()

    const [showPassword, setShowPassword] = useState(false) 
    const [rememberMe, setRememberMe] = useState(false)
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
    const [resetPasswordSubmitting, setResetPasswordSubmitting] = useState(false)

    useEffect (() => {
        refreshUserSession()

        if (isLoggedIn) router.push(ROUTES.DASHBOARD)
    }, [isLoggedIn, router, refreshUserSession])

    const {
        register,
        handleSubmit,
        formState: {
            isSubmitting,
            errors
        }
    } = useForm<LoginFormData>({
        resolver:yupResolver(formSchema)
    })

    const {
        register: registerForgotPassword,
        handleSubmit: handleForgotPasswordSubmit,
        formState: {
            errors: forgotPasswordErrors
        },
        reset: resetForgotPasswordForm
    } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema)
    })

    const handleSocialOauth = async (provider: 'google' | 'github') => {
        toast.error(`${provider} authentication not implemented yet`)
    }

    const onSubmit = async (formdata: LoginFormData) => {
        try {
            const {
                email,
                password
            } = formdata
            const response = await login(email, password)

            if (response?.data?.session?.access_token) {
                setAuthToken(response.data.session.access_token)

                if (rememberMe) localStorage.setItem('remember_user', 'true')
                
                if (response.data.user) {
                    setUserProfile({
                        id: response.data.user.id,
                        email: response.data.user.email,
                        fullName: response.data.user.user_metadata?.fullName,
                        gender: response.data.user.user_metadata?.gender,
                        phone: response.data.user.user_metadata?.phone
                    })
                }

                setIsLoggedIn(true)
                console.log(isLoggedIn)
                console.log(userProfile)
                toast.success('Login successful!')
                router.push(ROUTES.DASHBOARD)
            } else toast.error('Invalid login response')
        } catch (error : any) {
            console.error('Login error: ', error)
            toast.error(
                error?.response?.data?.message ||
                'An error occured during login' 
            )
            
        }
    }

    const handleRegisterRedirect = () => {
        router.push(ROUTES.REGISTER)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleForgotPassword = () => {
        setShowForgotPasswordModal(true)
    }

    const handleCloseModal = () => {
        setShowForgotPasswordModal(false)
        resetForgotPasswordForm()
    }

    const onForgotPasswordSubmit = async (formdata: ForgotPasswordFormData) => {
        try {
            setResetPasswordSubmitting(true)
            await resetPassword(formdata.email)
            toast.success('Password reset link sent to your email')
            handleCloseModal()
        } catch (error : any) {
            console.error('Reset password error: ', error)
            toast.error(
                error?.response?.data?.message || 
                'Failed to send reset link'
            )
        } finally {
            setResetPasswordSubmitting(false)
        }
    }

    useEffect(() => {
        if (showForgotPasswordModal) document.body.style.overflow = 'hidden'
        else  document.body.style.overflow = 'unset'

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
                    {isSubmitting && <Loader />}
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
                                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
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
                                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
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
                                    <p className={styles.error}>{forgotPasswordErrors.email.message}</p>
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
