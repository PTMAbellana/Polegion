"use client";
import Head from "next/head";

// Import the CSS module
import styles from "../styles/home.module.css"; // Adjusted path for your setup
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ROUTES } from "@/constants/routes";
import { refreshToken } from "@/lib/apiService";
import { myAppHook } from "@/context/AppUtils";
import { getUserProfile } from "@/lib/apiService";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { setIsLoggedIn, setUserProfile } = myAppHook();

  useEffect(() => {
    const handleTokens = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const expiresAt = params.get("expires_at");

      if (access_token && refresh_token) {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        const expiresAtMs = parseInt(expiresAt!) * 1000;
        localStorage.setItem("expires_at", expiresAtMs.toString());

        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("Failed to set session:", error.message);
        } else {
          //TODO: get user info??
          refreshToken();
          setIsLoggedIn(true);

          const pr = await getUserProfile();
          if (pr?.data) {
            console.log("Fresh profile data received: ", pr.data);
            setUserProfile(pr.data);
            // console.log(userProfile)
            const updateUser = {
              ...pr.data,
            };
            localStorage.setItem("user", JSON.stringify(updateUser));
            router.push(ROUTES.DASHBOARD);
          }
        }
      }
    };

    handleTokens();
  }, []);

  const handleRegisterRedirect = () => {
    setIsLoading(true);
    router.push("/auth/login");
    // router.push("/auth/register");
  };
  return (
    <>
      <Head>
        <title>GeoPlay - Fun Geometry Visualizer</title>
        <meta
          name="description"
          content="Explore interactive geometry visualizations and gamified learning"
        />
        <link rel="icon" type="image/png" href="/images/polegionIcon.png" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Welcome to Polegion</h1>
          <p className={styles.headerText}>
            Your fun and interactive geometry visualizer! Explore math like
            never before, aligned with your curriculum!
          </p>
          <button
            className={styles.headerButton}
            onClick={handleRegisterRedirect}
            disabled={isLoading}
          >
            {" "}
            {isLoading ? "Loading..." : "Start Exploring"}
          </button>
        </header>

        <section className={styles.customRow}>
          <div className={styles.customCol}>
            <div className={styles.customCard}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Interactive Visualizations</h5>
                <p className={styles.cardText}>
                  Bring geometric shapes and concepts to life with engaging,
                  real-time visualizations.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.customCol}>
            <div className={styles.customCard}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>
                  Curriculum-Aligned Learning
                </h5>
                <p className={styles.cardText}>
                  Tailored to your curriculum, helping you understand geometry
                  concepts step by step.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.customCol}>
            <div className={styles.customCard}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>Gamified Challenges</h5>
                <p className={styles.cardText}>
                  Complete fun geometry challenges, earn points, and level up
                  your math skills!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
