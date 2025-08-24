"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/lib/supabaseClient";
import RegisterForm from "@/components/auth/RegisterForm";
import styles from "@/styles/register.module.css";
import SocialAuth from "@/components/auth/SocialAuth";

export default function Register() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      <Head>
        <title>Register | Polegion</title>
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

            <h1 className={styles.welcomeTitle}>Create Account</h1>
            <p className={styles.welcomeSubtitle}>
              Join us and unleash your potential!
            </p>

            <RegisterForm />

            <div className={styles.socialDivider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>OR REGISTER WITH</span>
              <div className={styles.dividerLine}></div>
            </div>

            <SocialAuth />

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

