"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { STUDENT_ROUTES } from "@/constants/routes";
import styles from "@/styles/login.module.css";

export default function StudentLogin() {
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
    router.push(STUDENT_ROUTES.REGISTER);
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
        <title>Student Login | Polegion</title>
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

            <h1 className={styles.welcomeTitle}>Welcome Back, Student!</h1>
            <p className={styles.welcomeSubtitle}>Ready to explore geometry?</p>

            <LoginForm onForgotPassword={handleForgotPassword} userType="student" />

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