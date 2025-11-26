"use client";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const carouselSlides = [
    {
      id: 1,
      title: "7 Interactive Worlds",
      description: "Navigate through 2 assessment levels and 5 castle realms, each with unique geometry challenges and lessons!",
      image: "/images/placeholders/app-carousel-1.svg",
      color: "#2F3E75",
    },
    {
      id: 2,
      title: "Collaborative Learning",
      description: "Join virtual rooms, compete with classmates, and participate in real-time geometry challenges!",
      image: "/images/placeholders/app-carousel-2.svg",
      color: "#3A9679",
    },
    {
      id: 3,
      title: "Collect Relics & Track Progress",
      description: "Earn relics as you master concepts, complete assessments, and unlock achievements!",
      image: "/images/placeholders/app-carousel-3.svg",
      color: "#FABC60",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);



  const handleSignIn = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(ROUTES.LOGIN);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Polegion - Learn Geometry the Fun Way!</title>
        <meta
          name="description"
          content="Join the adventure! Learn geometry through magical castles, fun games, and exciting quests."
        />
        <link rel="icon" type="image/png" href="/images/polegionIcon.png" />
      </Head>

      <div className={styles.landingContainer}>
        {/* Floating Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logoSection}>
              <Image 
                src="/images/polegion-logo.gif" 
                alt="Polegion" 
                width={180} 
                height={60}
                className={styles.polegionLogo}
                unoptimized
                style={{ objectFit: 'contain' }}
              />
            </div>
            <button className={styles.signInBtn} onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section - Big and Exciting */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>Welcome! Currently in Development</div>
            <h1 className={styles.heroTitle}>
              Master Geometry Through<br/>
              Interactive Adventures
            </h1>
            <p className={styles.heroSubtitle}>
              An interactive geometry learning platform featuring 7 progressive worlds—2 comprehensive assessment levels and 5 curriculum-based castle realms. Navigate through engaging challenges, collect relics as you master concepts, and track your improvement through structured pre-test and post-test evaluations.
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
                  Start Your Adventure FREE
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
            <p className={styles.trustText}>
              Safe & Focused • Built for Students • Developed with AI Assistance
            </p>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>7</div>
              <div className={styles.statLabel}>Interactive Worlds</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>5</div>
              <div className={styles.statLabel}>Castle Realms</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>2</div>
              <div className={styles.statLabel}>Assessment Levels</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>6</div>
              <div className={styles.statLabel}>Learning Categories</div>
            </div>
          </div>
        </section>

        {/* Credit Section */}
        <section className={styles.creditSection}>
          <div className={styles.creditContent}>
            <p className={styles.creditText}>
              Curriculum inspired by the Grade 6 Mathematics program at Cebu Institute of Technology University
            </p>
          </div>
        </section>

        {/* Interactive Carousel Section */}
        <section className={styles.carouselSection} ref={carouselRef}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>See It In Action</span>
            <h2 className={styles.sectionTitle}>What Makes It Awesome?</h2>
            <p className={styles.sectionSubtitle}>
              Scroll through to see how fun learning can be!
            </p>
          </div>

          <div className={styles.carouselWrapper}>
            <div 
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={styles.carouselSlide}
                  style={{ borderColor: slide.color }}
                >
                  <div className={styles.slideContent}>
                    <h3 className={styles.slideTitle}>{slide.title}</h3>
                    <p className={styles.slideDescription}>{slide.description}</p>
                  </div>
                  <div className={styles.slideImage}>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className={styles.slideImg}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.carouselControls}>
            <button 
              className={styles.carouselArrow}
              onClick={() => setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
            >
              ←
            </button>
            <div className={styles.carouselDots}>
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.carouselDot} ${activeSlide === index ? styles.active : ''}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <button 
              className={styles.carouselArrow}
              onClick={() => setActiveSlide((prev) => (prev + 1) % carouselSlides.length)}
            >
              →
            </button>
          </div>
        </section>

        {/* Why Kids Love It */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Key Features</span>
            <h2 className={styles.sectionTitle}>Why Students Love It</h2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Interactive World Map</h3>
              <p>Navigate through 7 distinct worlds, each offering unique geometry challenges and progressive learning paths!</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Curriculum-Based Modules</h3>
              <p>Follow structured lessons aligned with educational standards, covering polygons, angles, circles, and spatial reasoning!</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Pre & Post Assessments</h3>
              <p>Track your learning journey with comprehensive assessments that measure your geometry mastery!</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Collaborative Rooms</h3>
              <p>Join virtual classrooms, compete with peers, and participate in teacher-led geometry competitions!</p>
            </div>
          </div>
        </section>

        {/* Why Parents Trust It */}
        <section className={styles.parentsSection}>
          <div className={styles.parentsContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>Designed for Learning</span>
              <h2 className={styles.sectionTitle}>Evidence-Based Geometry Education</h2>
              <p className={styles.sectionSubtitle}>Targeting measurable improvement in geometry performance through interactive learning</p>
            </div>

            <div className={styles.parentGrid}>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>CURRICULUM</div>
                  <h3>DepEd-Aligned Curriculum</h3>
                </div>
                <p>Covers Grade 5-6 geometry MELCs including polygons, angles, circles, perimeter/area, spatial reasoning, and 3D figures.</p>
              </div>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>AI BUILT</div>
                  <h3>AI-Assisted Development</h3>
                </div>
                <p>Platform developed with AI assistance to optimize user experience, generate educational content, and streamline development processes.</p>
              </div>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>TRACKING</div>
                  <h3>Progress Tracking</h3>
                </div>
                <p>Comprehensive pre-test and post-test assessments measure geometry mastery and track improvement over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Preview Images */}
        <section className={styles.previewSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Sneak Peek</span>
            <h2 className={styles.sectionTitle}>Take A Look Inside</h2>
          </div>

          <div className={styles.previewGrid}>
            <div className={styles.previewCard}>
              <Image 
                src="/images/world-map-bg.svg" 
                alt="World Map" 
                fill 
                className={styles.previewImage}
              />
              <div className={styles.previewLabel}>Interactive World Map</div>
            </div>
            <div className={styles.previewCard}>
              <Image 
                src="/images/paths-of-power.png" 
                alt="Fun Puzzles" 
                fill 
                className={styles.previewImage}
              />
              <div className={styles.previewLabel}>Engaging Puzzles</div>
            </div>
            <div className={styles.previewCard}>
              <Image 
                src="/images/wizard-check.png" 
                alt="Awesome Rewards" 
                fill 
                className={styles.previewImage}
              />
              <div className={styles.previewLabel}>Achievement Rewards</div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCtaSection}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Join Our Learning Adventure</h2>
            <p className={styles.ctaSubtitle}>
              Experience interactive geometry education through 7 unique worlds, collaborative rooms, and comprehensive assessments
            </p>
            <button 
              className={styles.ctaButtonLarge} 
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
                  Get Started - Free Access!
                </>
              )}
            </button>
            <p className={styles.noCardText}>Platform in development • New features added regularly</p>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <Image 
                src="/images/polegionIcon.png" 
                alt="Polegion" 
                width={30} 
                height={30}
              />
              <span>Polegion</span>
            </div>
            <nav className={styles.footerLinks}>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
              <a href="#">Help</a>
            </nav>
          </div>
          <div className={styles.footerBottom}>
            <p>Making geometry accessible through interactive learning • Built with AI assistance</p>
          </div>
        </footer>
      </div>
    </>
  );
}
