"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Import CSS Module - You can use your existing login.module.css or create a new one
import styles from "@/styles/login.module.css";

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    // Check if there's a hash with access_token in the URL
    const handleHashChange = async () => {
      try {
        if (typeof window !== "undefined") {
          // Get the hash from the URL
          const hash = window.location.hash;
          
          if (!hash) {
            setTokenError(true);
            setLoading(false);
            return;
          }
          
          // Extract the access token
          const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
          const type = new URLSearchParams(hash.substring(1)).get("type");
          
          if (!accessToken || type !== "recovery") {
            setTokenError(true);
            setLoading(false);
            return;
          }
          
          // Verify the token is valid
          const { data, error } = await supabase.auth.getUser(accessToken);
          
          if (error || !data.user) {
            setTokenError(true);
            setLoading(false);
            return;
          }
          
          // Store the token temporarily
          sessionStorage.setItem("resetPasswordToken", accessToken);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error processing reset token:", error);
        setTokenError(true);
        setLoading(false);
      }
    };

    handleHashChange();
    
    // Remove the hash from the URL for security
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const onSubmit = async (formData) => {
    try {
      const { password } = formData;
      const accessToken = sessionStorage.getItem("resetPasswordToken");
      
      if (!accessToken) {
        toast.error("Reset token not found. Please try again.");
        return;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser(
        { password }
      );
      
      if (error) {
        toast.error("Failed to reset password: " + error.message);
        return;
      }
      
      // Clear the token
      sessionStorage.removeItem("resetPasswordToken");
      
      toast.success("Password reset successfully!");
      
      // Redirect to login
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
      
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred while resetting your password");
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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.cardContent}>
            {loading ? (
              <div className={styles.loaderContainer}>
                <Loader size="medium" />
                <p>Verifying your reset token...</p>
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
                  onClick={() => router.push("/auth/login")}
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