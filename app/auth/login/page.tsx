"use client";
import Head from 'next/head';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

// Correct import for the CSS Module
import styles from '@/styles/login.module.css';

const formSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid Email value"),
    password: yup.string().required("Password is required")
});

export default function Login() {
    const router = useRouter();
    const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();

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
    }, [isLoggedIn]);

    const handleSocialOauth = async (provider: "google" | "github") => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/dashboard`
            }
        });

        if (error) {
            toast.error("Failed to login via Social Oauth");
        }
    };

    const onSubmit = async (formdata: any) => {
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
                setIsLoggedIn(true);
                toast.success("User logged in successfully!");
            }
        }
    };

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/styles/login.module.css" />
            </Head>

            <Navbar />

            <div className={styles.container}>
                <h2 className={styles.title}>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={styles.input} {...register("email")} />
                        <p className={styles.error}>{errors.email?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input type="password" className={styles.input} {...register("password")} />
                        <p className={styles.error}>{errors.password?.message}</p>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>Login</button>
                </form>

                <div className={styles.socialButtons}>
                    <button className={styles.googleButton} onClick={() => handleSocialOauth("google")}>Google</button>
                    <button className={styles.githubButton} onClick={() => handleSocialOauth("github")}>GitHub</button>
                </div>

                <p className={styles.registerPrompt}>
                    Don't have an account? <a href="/auth/register" className={styles.registerLink}>Register</a>
                </p>
            </div>

            <Footer />
        </>
    );
}
