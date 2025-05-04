"use client";
import Head from 'next/head';
import Image from 'next/image';
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

// Import icons
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

// Import CSS Module
import styles from '@/styles/login.module.css';

const formSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid Email value"),
    password: yup.string().required("Password is required")
});

export default function Login() {
    const router = useRouter();
    const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm({
        resolver: yupResolver(formSchema)
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
        router.push("/auth/forgot-password");
        // Or implement a modal/popup for password reset
    };

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

            <Footer />
        </>
    );
}