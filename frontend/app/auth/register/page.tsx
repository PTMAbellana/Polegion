"use client"
import styles from '@/styles/register.module.css'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { ROUTES } from '@/constants/routes'

// as registerUser kay naa nay builtin na register function
import { register as registerUser } from '@/lib/apiService' 

import * as yup from "yup"
import toast from 'react-hot-toast'

const formSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid Email Value").required("Email value is required"),
    phone: yup.string().required("Phone number is required"),
    gender: yup.string().required("Gender is required").oneOf(["Male", "Female", "Other"], "Gender is not allowed"),
    password: yup.string().required("Password is required").min(6, "Password is of minimum 6 characters"),
    confirm_password: yup.string().required("Password is required").oneOf([yup.ref("password")], "Password didn't match")
})

export default function Register() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors, isSubmitting
        }
    } = useForm({
        resolver: yupResolver(formSchema)
    })

    const onSubmit = async (formdata: any) => {
        try {
            const response = await registerUser(formdata)
            if (response) {
                toast.success("User registered successfully")
                router.push(ROUTES.LOGIN)
            } else toast.error("Failed to register user")
        } catch (error) {
            console.error(error)
            toast.error("An error occured during registration")
        }
    }

    const handleLoginRedirect = () => {
        router.push(ROUTES.LOGIN)
    }

    const handleSocialOauth = async (provider: 'google' | 'github') => {
        console.log('is clicked! from register: ' + provider)
        // todo: server side ani niya
    }

    const togglePasswordVisibility = (field: 'password' | 'confirm') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <>
            <Head>
                <title>Register | Your App Name</title>
            </Head>

            <div className={styles.registerPage}>
                <div className={styles.registerCard}>
                    <div className={styles.cardContent}>
                        {/* Logo */}
                        <div className={styles.logoContainer}>
                            <img 
                                src="/images/polegionLogo.png" 
                                alt="Logo" 
                                className={styles.logo} 
                            />
                        </div>

                        <h1 className={styles.welcomeTitle}>Create Account</h1>
                        <p className={styles.welcomeSubtitle}>Join us and unleash your potential!</p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <input 
                                        type="text" 
                                        className={styles.inputField} 
                                        placeholder="Full Name"
                                        {...register("fullName")} 
                                    />
                                    {errors.fullName && <p className={styles.error}>{errors.fullName.message?.toString()}</p>}
                                </div>

                                <div className={styles.formGroup}>
                                    <input 
                                        type="text" 
                                        className={styles.inputField} 
                                        placeholder="Phone Number"
                                        {...register("phone")} 
                                    />
                                    {errors.phone && <p className={styles.error}>{errors.phone.message?.toString()}</p>}
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <input 
                                        type="email" 
                                        className={styles.inputField} 
                                        placeholder="Email Address"
                                        {...register("email")} 
                                    />
                                    {errors.email && <p className={styles.error}>{errors.email.message?.toString()}</p>}
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <select 
                                        className={styles.selectField} 
                                        {...register("gender")}
                                    >
                                        <option value="Select Gender" disabled selected>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <p className={styles.error}>{errors.gender.message?.toString()}</p>}
                                </div>

                                <div className={styles.formGroup}>
                                    <div className={styles.passwordInput}>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            className={styles.inputField} 
                                            placeholder="Password"
                                            {...register("password")} 
                                        />
                                        <button 
                                            type="button" 
                                            className={styles.passwordToggle} 
                                            onClick={() => togglePasswordVisibility('password')}
                                        >
                                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className={styles.error}>{errors.password.message?.toString()}</p>}
                                </div>

                                <div className={styles.formGroup}>
                                    <div className={styles.passwordInput}>
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            className={styles.inputField} 
                                            placeholder="Confirm Password"
                                            {...register("confirm_password")} 
                                        />
                                        <button 
                                            type="button" 
                                            className={styles.passwordToggle} 
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirm_password && <p className={styles.error}>{errors.confirm_password.message?.toString()}</p>}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className={styles.registerButton} 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registering..." : "Register"}
                            </button>
                        </form>

                        <div className={styles.socialDivider}>
                            <div className={styles.dividerLine}></div>
                            <span className={styles.dividerText}>OR REGISTER WITH</span>
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

                        <p className={styles.loginPrompt}>
                            Already have an account? <span onClick={handleLoginRedirect} className={styles.loginLink}>Login</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}