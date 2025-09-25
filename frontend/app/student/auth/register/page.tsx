"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import styles from "@/styles/register.module.css";
import { STUDENT_ROUTES } from "@/constants/routes";

export default function StudentRegister() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push(STUDENT_ROUTES.LOGIN);
  };



  return (
    <>
      <Head>
        <title>Student Registration | Polegion</title>
      </Head>

      <div className={styles.registerPage}>
        <div className={styles.registerCard}>
          <div className={styles.cardContent}>
            <div className={styles.logoContainer}>
              <img
                src="/images/polegionLogo.png"
                alt="Logo"
                className={styles.logo}
              />
            </div>

            <h1 className={styles.welcomeTitle}>Create Student Account</h1>
            <p className={styles.welcomeSubtitle}>
              Join the adventure and discover geometry!
            </p>

            <RegisterForm userType="student" />

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