"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Loader from "@/components/Loader";
import LoginForm from "@/components/auth/LoginForm";
import SocialAuth from "@/components/auth/SocialAuth";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";
import styles from "@/styles/login.module.css";

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, refreshUserSession } = useAuthStore();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
    refreshUserSession();
    if (isLoggedIn) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isLoggedIn, router, refreshUserSession]);

  useEffect(() => {
    if (showForgotPasswordModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showForgotPasswordModal]);

  const handleRegisterRedirect = () => {
    router.push(ROUTES.REGISTER);
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <>
      <Head>
        <title>Login | Polegion</title>
      </Head>

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

            <LoginForm onForgotPassword={handleForgotPassword} />

            <SocialAuth />

            <p className={styles.registerPrompt}>
              Don&lsquo;t have an Account?{" "}
              <span
                onClick={handleRegisterRedirect}
                className={styles.registerLink}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
