"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import RegisterForm from "@/components/auth/RegisterForm";
import styles from "@/styles/register.module.css";
import { TEACHER_ROUTES, ROUTES } from "@/constants/routes";

export default function TeacherRegister() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push(TEACHER_ROUTES.LOGIN);
  };

  const handleBackToRoleSelection = () => {
    router.push(ROUTES.REGISTER);
  };



  return (
    <>
      <Head>
        <title>Teacher Registration | Polegion</title>
      </Head>

      <div className={styles.registerPage}>
        <div className={styles.registerCard}>
          <button 
            onClick={handleBackToRoleSelection}
            className={styles.backButton}
            type="button"
          >
            <IoChevronBack /> Back
          </button>
          <div className={styles.cardContent}>
            <div className={styles.logoContainer}>
              <img
                src="/images/polegionLogo.webp"
                alt="Logo"
                className={styles.logo}
              />
            </div>

            <h1 className={styles.welcomeTitle}>Create Teacher Account</h1>
            <p className={styles.welcomeSubtitle}>
              Join our educator community and inspire students!
            </p>

            <RegisterForm userType="teacher" />

            <p className={styles.loginPrompt}>
              Already have an account?{" "}
              <span onClick={handleLoginRedirect} className={styles.loginLink}>
                Login 
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}