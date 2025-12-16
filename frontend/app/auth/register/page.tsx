"use client";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { STUDENT_ROUTES, TEACHER_ROUTES, ROUTES } from "@/constants/routes";
import styles from "@/styles/role-selection.module.css";

export default function RoleSelection() {
  const router = useRouter();

  const handleStudentRegister = () => {
    router.push(STUDENT_ROUTES.REGISTER);
  };

  const handleTeacherRegister = () => {
    router.push(TEACHER_ROUTES.REGISTER);
  };

  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      <Head>
        <title>Choose Your Role | Polegion</title>
      </Head>

      <div className={styles.roleSelectionPage}>
        <div className={styles.roleSelectionCard}>
          <div className={styles.cardContent}>
            {/* Logo */}
            <div className={styles.logoContainer}>
              <img
                src="/images/polegionLogo.webp"
                alt="Logo"
                className={styles.logo}
              />
            </div>

            <h1 className={styles.welcomeTitle}>Join Polegion</h1>
            <p className={styles.welcomeSubtitle}>Choose your role to get started</p>

            <div className={styles.roleOptions}>
              <div className={styles.roleCard} onClick={handleStudentRegister}>
                <div className={styles.roleIcon}>
                  <FaGraduationCap className={styles.iconSvg} />
                </div>
                <h2 className={styles.roleTitle}>Student</h2>
                <p className={styles.roleDescription}>
                  Embark on an exciting geometry adventure and learn through interactive challenges
                </p>
                <button className={styles.roleButton}>
                  Register as Student
                </button>
              </div>

              <div className={styles.roleCard} onClick={handleTeacherRegister}>
                <div className={styles.roleIcon}>
                  <FaChalkboardTeacher className={styles.iconSvg} />
                </div>
                <h2 className={styles.roleTitle}>Teacher</h2>
                <p className={styles.roleDescription}>
                  Create engaging lessons and inspire students with interactive geometry education
                </p>
                <button className={styles.roleButton}>
                  Register as Teacher
                </button>
              </div>
            </div>

            <p className={styles.loginPrompt}>
              Already have an account?{" "}
              <span onClick={handleLogin} className={styles.loginLink}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
