"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

// Import custom CSS for Register component
import styles from '@/styles/register.module.css';

const formSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid Email Value").required("Email value is required"),
    phone: yup.string().required("Phone number is required"),
    gender: yup.string().required("Gender is required").oneOf(["Male", "Female", "Other"], "Gender is not allowed"),
    password: yup.string().required("Password is required").min(6, "Password is of minimum 6 characters"),
    confirm_password: yup.string().required("Password is required").oneOf([yup.ref("password")], "Password didn't match")
});

export default function Register() {
    const router = useRouter();
    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(formSchema)
    });

    const onSubmit = async (formdata: any) => {
        const { fullName, email, password, gender, phone } = formdata;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    fullName,
                    gender,
                    phone
                }
            }
        });

        if (error) {
            toast.error("Failed to register user");
        } else {
            toast.success("User registered successfully.");
            router.push("/auth/login");
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Display Name</label>
                        <input type="text" className={styles.input} {...register("fullName")} />
                        <p className={styles.error}>{errors.fullName?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={styles.input} {...register("email")} />
                        <p className={styles.error}>{errors.email?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Phone</label>
                        <input type="text" className={styles.input} {...register("phone")} />
                        <p className={styles.error}>{errors.phone?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Gender</label>
                        <select className={styles.select} {...register("gender")}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <p className={styles.error}>{errors.gender?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input type="password" className={styles.input} {...register("password")} />
                        <p className={styles.error}>{errors.password?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Confirm Password</label>
                        <input type="password" className={styles.input} {...register("confirm_password")} />
                        <p className={styles.error}>{errors.confirm_password?.message}</p>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>Register</button>
                </form>

                <p className={styles.registerPrompt}>
                    Already have an account? <a href="/auth/login" className={styles.registerLink}>Login</a>
                </p>
            </div>
            <Footer />
        </>
    );
}
