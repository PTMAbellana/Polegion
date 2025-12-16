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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const carouselSlides = [
    {
      id: 1,
      title: "Interactive World Map",
      description: "Navigate through 7 distinct worlds, each offering unique geometry challenges and progressive learning paths!",
      image: "/images/worldmap-page.webp",
      color: "#2E7D32",
    },
    {
      id: 2,
      title: "Curriculum-Based Modules",
      description: "Follow structured lessons aligned with educational standards, covering polygons, angles, circles, and spatial reasoning!",
      image: "/images/dashboard-page.webp",
      color: "#2E7D32",
    },
    {
      id: 3,
      title: "Pre & Post Assessments",
      description: "Track your learning journey with comprehensive assessments that measure your geometry mastery!",
      image: "/images/chapter-complete-page.webp",
      color: "#2E7D32",
    },
    {
      id: 4,
      title: "Collaborative Rooms",
      description: "Join virtual classrooms, compete with peers, and participate in teacher-led geometry competitions!",
      image: "/images/room-page.webp",
      color: "#2E7D32",
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
        <link rel="icon" type="image/png" href="/images/polegionIcon.webp" />
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
            <button 
              className={styles.hamburger}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={styles.headerActions}>
              <button className={styles.signInBtn} onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <button className={styles.mobileSignInBtn} onClick={() => {
                handleSignIn();
                setIsMobileMenuOpen(false);
              }}>
                Sign In
              </button>
            </div>
          )}
        </header>

        {/* Hero Section - Big and Exciting */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Master Geometry Through<br/>
              Interactive Adventures
            </h1>
            <p className={styles.heroSubtitle}>
              An interactive geometry learning platform featuring comprehensive assessment levels. Navigate through engaging challenges, collect relics as you master concepts, and track your improvement through structured pre-test and post-test evaluations.
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

                </>
              )}
            </button>
            <p className={styles.trustText}>
              Safe and Focused • Built for Students • Developed with AI Assistance
            </p>
          </div>
          
          {/* Credit Section */}
          <section className={styles.creditSection}>
            <div className={styles.creditContent}>
              <p className={styles.creditText}>
                Curriculum inspired by the Grade 6 Mathematics program at Cebu Institute of Technology University
              </p>
            </div>
          </section>
        </section>

        {/* Interactive Carousel Section */}
        <section className={styles.carouselSection} ref={carouselRef}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>See It In Action</span>
            <h2 className={styles.sectionTitle}>What Makes It Awesome?</h2>
              {/* <p className={styles.sectionSubtitle}>
                Scroll through to see how fun learning can be!
              </p> */}
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
                      unoptimized
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
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
              aria-label="Previous slide"
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
              aria-label="Next slide"
            >
              →
            </button>
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
                <p>Our platform is developed with AI assistance to create an optimized, user-friendly, and effective learning experience.</p>
              </div>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>TRACKING</div>
                  <h3>Track Your Child's Progress</h3>
                </div>
                <p>Measure your child's geometry mastery and track their improvement over time with our comprehensive assessment tools.</p>
              </div>
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
                src="/images/polegionIcon.webp" 
                alt="Polegion" 
                width={30} 
                height={30}
              />
              <span>Polegion</span>
            </div>
            <nav className={styles.footerLinks}>
              <a href="/privacy-policy">Privacy Policy</a>
            </nav>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Polegion. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
