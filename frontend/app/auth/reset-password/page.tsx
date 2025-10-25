"use client"

import Loader from "@/components/Loader"
import Head from "next/head"
import styles from '@/styles/login.module.css'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import * as yup from 'yup'
import { ROUTES } from '@/constants/routes'
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"
import { useMyApp } from "@/context/AppUtils"
import api from "@/api/axios"

interface ResetPasswordFormData {
    password: string,
    confirmPassword: string
}

class PasswordResetHandler {
    private router: ReturnType<typeof useRouter>;
    private token: string | null;

    constructor(router: ReturnType<typeof useRouter>, token: string | null) {
        this.router = router;
        this.token = token;
    }

    public async resetPassword(password: string): Promise<boolean> {
        try {
            if (!this.token) {
                throw new Error('Reset token not found');
            }

            //kani ang error
            const response = await api.post('/auth/reset-password/confirm', {
                token: this.token,
                password
            });

            console.log('response', response)
            
            return response.status === 200;
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }

    public redirectToLogin() {
        this.router.push(ROUTES.LOGIN);
    }
}

const passwordSchema = yup.object().shape({
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match")
})

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUserSession } = useMyApp();

    const [loading, setLoading] = useState(true);
    const [tokenError, setTokenError] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(passwordSchema)
    });

    useEffect(() => {
        const checkToken = () => {
            try {
                console.log('Current URL:', window.location.href);
                console.log('Query params:', Object.fromEntries(searchParams.entries()));
                
                // Check query parameters
                let resetToken = searchParams.get('token');
                
                // Check URL fragment (hash) if no token in query
                if (!resetToken && window.location.hash) {
                    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
                    resetToken = hashParams.get('access_token') || hashParams.get('token');
                }
                
                console.log('Extracted token:', resetToken);
                
                setToken(resetToken);
                
                if (!resetToken) {
                    console.warn('No reset token found in URL or hash');
                    setTokenError(true);
                    setLoading(false);
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Error checking reset token:', error);
                setTokenError(true);
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    const onSubmit = async (formData: ResetPasswordFormData) => {
        try {
            console.log('submit')
            console.log(token)
            const passwordHandler = new PasswordResetHandler(router, token);
            console.log(formData.password)
            const success = await passwordHandler.resetPassword(formData.password);
            
            if (success) {
                toast.success("Password reset successfully!");
                
                await refreshUserSession();
                
                setTimeout(() => {
                    passwordHandler.redirectToLogin();
                }, 1500);
            } else {
                console.log('wa')
                toast.error("Failed to reset password");
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            toast.error(
                error?.response?.data?.error || 
                'An error occurred while resetting your password'
            );
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Head>
                <title>Reset Password | Polegion</title>
            </Head>

            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <div className={styles.cardContent}>
                        {loading ? (
                            <div className={styles.loaderContainer}>
                                <Loader />
                                <p>Loading...</p>
                            </div>
                        ) : tokenError ? (
                            <div className={styles.errorContainer}>
                                <h2>Invalid or Expired Link</h2>
                                <p>
                                    Your password reset link is invalid or has expired. Please
                                    request a new password reset link.
                                </p>
                                <button
                                    className={styles.loginButton}
                                    onClick={() => router.push(ROUTES.LOGIN)}
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.logoContainer}>
                                    <img
                                        src="/images/polegionLogo.png"
                                        alt="Logo"
                                        className={styles.logo}
                                    />
                                </div>

                                <h1 className={styles.welcomeTitle}>Reset Your Password</h1>
                                <p className={styles.welcomeSubtitle}>
                                    Please enter your new password
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className={styles.formGroup}>
                                        <div className={styles.passwordInput}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={styles.inputField}
                                                placeholder="New password"
                                                {...register("password")}
                                            />
                                            <button
                                                type="button"
                                                className={styles.passwordToggle}
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash size={20} />
                                                ) : (
                                                    <FaEye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className={styles.error}>
                                                {errors.password.message?.toString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <div className={styles.passwordInput}>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={styles.inputField}
                                                placeholder="Confirm new password"
                                                {...register("confirmPassword")}
                                            />
                                            <button
                                                type="button"
                                                className={styles.passwordToggle}
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? (
                                                    <FaEyeSlash size={20} />
                                                ) : (
                                                    <FaEye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className={styles.error}>
                                                {errors.confirmPassword.message?.toString()}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className={styles.loginButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Resetting Password..." : "Reset Password"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
