"use client";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ROUTES } from "@/constants/routes";
import { refreshToken } from "@/api/auth";
import { useMyApp } from "@/context/AppUtils";
import { getUserProfile } from "@/api/users";
import styles from "../styles/landingpage.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { setIsLoggedIn, setUserProfile } = useMyApp();

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
          refreshToken();
          setIsLoggedIn(true);

          const pr = await getUserProfile();
          if (pr?.data) {
            console.log("Fresh profile data received: ", pr.data);
            setUserProfile(pr.data);
            const updateUser = {
              ...pr.data,
            };
            localStorage.setItem("user", JSON.stringify(updateUser));
            router.push(ROUTES.DASHBOARD);
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    handleTokens();
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRegisterRedirect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/login");
    }, 1000);
  };

  const handleExploreWorlds = () => {
    router.push("/world-map");
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

        <section className={styles.hero}>
          <div className={styles.heroText}>
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
                className={styles.headerButton}
                onClick={handleRegisterRedirect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner} />
                    Loading...
                  </>
                ) : (
                  <>
                    Start Exploring
                    <span className={styles.arrow}>→</span>
                  </>
                )}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={handleExploreWorlds}
              >
                Explore Worlds
              </button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroArt}>
              <Image
                src="/images/world-map.png"
                alt="Polegion World Map"
                fill
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </section>

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
          <button
            className={styles.ctaButton}
            onClick={handleRegisterRedirect}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner} />
                Loading...
              </>
            ) : (
              <>
                Get Started Now
                <span className={styles.arrow}>→</span>
              </>
            )}
          </button>
        </section>

        
      </div>
    </>
  );
}
