"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { ROUTES } from "@/constants/routes";
import styles from "@/styles/login.module.css";

export default function GeneralLogin() {
  const router = useRouter();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

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
                src="/images/polegionLogo.webp"
                alt="Logo"
                className={styles.logo}
              />
            </div>

            <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
            <p className={styles.welcomeSubtitle}>Login to continue your geometry adventure</p>

            <LoginForm onForgotPassword={handleForgotPassword} userType="general" />

            <p className={styles.registerPrompt}>
              Don&apos;t have an Account?{" "}
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
