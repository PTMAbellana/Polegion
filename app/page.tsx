"use client"
import Head from 'next/head';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Import the CSS module
import styles from '../styles/home.module.css'; // Adjusted path for your setup
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterRedirect = () => {
      setIsLoading(true);
      router.push("/auth/register");
  };
  return (
    <>
      <Head>
        <title>GeoPlay - Fun Geometry Visualizer</title>
        <meta name="description" content="Explore interactive geometry visualizations and gamified learning" />
        <link rel="icon" type="image/png" href="/images/polegionIcon.png" />
      </Head>


      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Welcome to Polegion</h1>
          <p className={styles.headerText}>Your fun and interactive geometry visualizer! Explore math like never before, aligned with your curriculum!</p>
          <button 
            className={styles.headerButton} 
            onClick={handleRegisterRedirect} 
            disabled={ isLoading}
          > { isLoading ? "Loading..." : "Start Exploring"}</button>
        </header>

        <section className={styles.customRow}>
          <div className={styles.customCol}>
            <div className={styles.customCard}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Interactive Visualizations</h5>
                <p className={styles.cardText}>Bring geometric shapes and concepts to life with engaging, real-time visualizations.</p>
              </div>
            </div>
          </div>
          <div className={styles.customCol}>
            <div className={styles.customCard}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Curriculum-Aligned Learning</h5>
                <p className={styles.cardText}>Tailored to your curriculum, helping you understand geometry concepts step by step.</p>
              </div>
            </div>
          </div>
          <div className={styles.customCol}>
            <div className={styles.customCard}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Gamified Challenges</h5>
                <p className={styles.cardText}>Complete fun geometry challenges, earn points, and level up your math skills!</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <Footer /> */}
    </>
  );
}
