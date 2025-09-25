"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/home.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStudentRedirect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/student/auth/login");
    }, 1000);
  };

  const handleTeacherRedirect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/teacher/auth/login");
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Polegion - Fun Geometry Visualizer</title>
        <meta
          name="description"
          content="Explore interactive geometry visualizations and gamified learning"
        />
        <link rel="icon" type="image/png" href="/images/polegionIcon.png" />
      </Head>

      <div className={styles.container}>
        {/* Animated background elements */}
        <div className={styles.backgroundElements}>
          <div 
            className={styles.mouseFollower}
            style={{
              left: mousePosition.x / 15,
              top: mousePosition.y / 15,
            }}
          />
          <div className={styles.floatingShape1} />
          <div className={styles.floatingShape2} />
          <div className={styles.floatingShape3} />
          <div className={styles.floatingShape4} />
          <div className={styles.floatingShape5} />
        </div>

        {/* Geometric floating shapes */}
        <div className={styles.geometricShapes}>
          <div className={styles.shape1} />
          <div className={styles.shape2} />
          <div className={styles.shape3} />
          <div className={styles.shape4} />
          <div className={styles.shape5} />
          <div className={styles.shape6} />
        </div>

        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🎯</span>
            <span>Next-Generation Geometry Learning</span>
          </div>
          
          <h1 className={styles.headerTitle}>
            <span className={styles.titleWelcome}>Welcome to</span>
            <br />
            <span className={styles.brandName}>Polegion</span>
          </h1>
          
          <p className={styles.headerText}>
            Your fun and interactive geometry visualizer! Explore math like never before, 
            perfectly aligned with your curriculum and designed to make learning addictive.
          </p>
          
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.headerButton} ${styles.studentButton}`}
              onClick={handleStudentRedirect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Loading...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>🎓</span>
                  I&apos;m a Student
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
            <button
              className={`${styles.headerButton} ${styles.teacherButton}`}
              onClick={handleTeacherRedirect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Loading...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>👩‍🏫</span>
                  I&apos;m a Teacher
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
          </div>
        </header>

        <section className={styles.customRow}>
          <div className={styles.customCol}>
            <div className={`${styles.customCard} ${styles.cardGreen}`}>
              <div className={styles.cardIcon}>✨</div>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Interactive Visualizations</h5>
                <p className={styles.cardText}>
                  Bring geometric shapes and concepts to life with engaging, 
                  real-time visualizations that respond to your touch.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.customCol}>
            <div className={`${styles.customCard} ${styles.cardBlue}`}>
              <div className={styles.cardIcon}>📚</div>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Curriculum-Aligned Learning</h5>
                <p className={styles.cardText}>
                  Perfectly tailored to your curriculum, helping you master geometry 
                  concepts with structured, progressive learning paths.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.customCol}>
            <div className={`${styles.customCard} ${styles.cardOrange}`}>
              <div className={styles.cardIcon}>🏆</div>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Gamified Challenges</h5>
                <p className={styles.cardText}>
                  Complete exciting geometry challenges, earn achievements, unlock new levels, 
                  and compete with friends while mastering math!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaButtonGroup}>
            <button
              className={`${styles.ctaButton} ${styles.studentCta}`}
              onClick={handleStudentRedirect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Loading...
                </>
              ) : (
                <>
                  Student Login
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
            <button
              className={`${styles.ctaButton} ${styles.teacherCta}`}
              onClick={handleTeacherRedirect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Loading...
                </>
              ) : (
                <>
                  Teacher Login
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
          </div>
        </section>

        
      </div>
    </>
  );
}
