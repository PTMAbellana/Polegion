"use client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import styles from "../styles/landingpage.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    router.push(ROUTES.LOGIN); //TEMPORARY CHANGE
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(ROUTES.LOGIN); // TEMPORARY CHANGE
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
        {/* Header with background image */}
        <header className={styles.pageHeader}>
          <div className={styles.headerBg}>
            <Image 
              src="/images/landing-page-header.svg" 
              alt="Header background" 
              fill 
              className={styles.headerBgImage}
              priority 
            />
          </div>
          <div className={styles.headerContent}>
            <div className={styles.logoSection}>
              <Image 
                src="/images/polegionIcon.png" 
                alt="Polegion Icon" 
                width={50} 
                height={50}
                className={styles.brandIcon}
              />
            </div>
            <button className={styles.signInBtn} onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.welcomeText}>Welcome to</span>
              <div className={styles.logoContainer}>
                <Image 
                  src="/images/polegion-logo.gif" 
                  alt="Polegion" 
                  width={400} 
                  height={120}
                  className={styles.polegionLogo}
                  unoptimized
                  priority
                />
              </div>
            </h1>
            <p className={styles.heroSubtitle}>
              Explore castles, solve puzzles, and learn geometry the fun way.
            </p>
            <button 
              className={styles.getStartedBtn} 
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Loading...
                </>
              ) : (
                <>
                  Let&rsquo;s Get Started
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Why Kids Love It Section */}
        <section className={styles.whyKidsSection}>
          <div className={styles.sectionBg}>
            <Image 
              src="/images/landing-page-background-1.svg" 
              alt="Background" 
              fill 
              className={styles.sectionBgImage}
            />
          </div>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Why Kids Will Love It</h2>
            <div className={styles.featureRow}>
              <div className={styles.featureBox}>
                <div className={styles.featureImageWrap}>
                  <div className={styles.featureIcon}>🌀</div>
                </div>
                <div className={styles.featureTextWrap}>
                  <h3 className={styles.featureTitle}>Interactive Visualizations</h3>
                  <p className={styles.featureDesc}>
                    Make shapes move, rotate, and come alive with engaging animations.
                  </p>
                </div>
              </div>

              <div className={styles.featureBox}>
                <div className={styles.featureImageWrap}>
                  <div className={styles.featureIcon}>🏰</div>
                </div>
                <div className={styles.featureTextWrap}>
                  <h3 className={styles.featureTitle}>Story + Adventure</h3>
                  <p className={styles.featureDesc}>
                    Each castle is a math topic to conquer with exciting quests.
                  </p>
                </div>
              </div>

              <div className={styles.featureBox}>
                <div className={styles.featureImageWrap}>
                  <div className={styles.featureIcon}>⭐</div>
                </div>
                <div className={styles.featureTextWrap}>
                  <h3 className={styles.featureTitle}>Rewards & Achievements</h3>
                  <p className={styles.featureDesc}>
                    Collect stars, unlock badges, and progress like a game.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Parents Approve Section */}
        <section className={styles.parentsSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Why Parents & Teachers Approve</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>📚</div>
                <h3 className={styles.benefitTitle}>Curriculum-Aligned</h3>
                <p className={styles.benefitText}>
                  Matches grade-level geometry lessons perfectly.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🛡️</div>
                <h3 className={styles.benefitTitle}>Safe & Kid-Friendly</h3>
                <p className={styles.benefitText}>
                  Ad-free, distraction-free learning environment.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>📈</div>
                <h3 className={styles.benefitTitle}>Progress Tracking</h3>
                <p className={styles.benefitText}>
                  See mastered topics and areas needing help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className={styles.previewSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>A Sneak Peek</h2>
            <div className={styles.previewGrid}>
              <div className={styles.previewCard}>
                <Image 
                  src="/images/world-map.png" 
                  alt="World Map Preview" 
                  fill 
                  className={styles.previewImage}
                />
                <div className={styles.previewLabel}>World Map (Castles & Topics)</div>
              </div>
              <div className={styles.previewCard}>
                <Image 
                  src="/images/2.png" 
                  alt="Geometry Puzzle Preview" 
                  fill 
                  className={styles.previewImage}
                />
                <div className={styles.previewLabel}>Interactive Geometry Puzzle</div>
              </div>
              <div className={styles.previewCard}>
                <Image 
                  src="/images/1.png" 
                  alt="Badges Preview" 
                  fill 
                  className={styles.previewImage}
                />
                <div className={styles.previewLabel}>Badges & Achievements</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className={styles.testimonialsSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>What People Are Saying</h2>
            <div className={styles.testimonials}>
              <blockquote className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  &ldquo;My students are excited about geometry again!&rdquo;
                </p>
                <span className={styles.testimonialAuthor}>— Ms. Rivera, Math Teacher</span>
              </blockquote>
              <blockquote className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  &ldquo;My child actually asks to practice math now.&rdquo;
                </p>
                <span className={styles.testimonialAuthor}>— Jacob, Parent</span>
              </blockquote>
            </div>
          </div>
        </section> */}

        {/* Bottom CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Start Your Adventure Now</h2>
            <p className={styles.ctaSubtitle}>
              It&rsquo;s free to begin — jump into your first geometry quest today!
            </p>
            <button 
              className={styles.ctaButton} 
              onClick={handleGetStarted}
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
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <span>·</span>
            <a href="#" className={styles.footerLink}>Contact</a>
            <span>·</span>
            <a href="#" className={styles.footerLink}>Privacy</a>
            <span>·</span>
            <a href="#" className={styles.footerLink}>Help</a>
          </nav>
          <div className={styles.footerTagline}>
            Polegion — Making math magical for every learner.
          </div>
        </footer>
      </div>
    </>
  );
}