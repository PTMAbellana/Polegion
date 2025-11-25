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
      title: "Explore Magical Castles",
      description: "Travel through 6 amazing castles, each teaching you cool geometry tricks!",
      image: "/images/placeholders/app-carousel-1.svg",
      color: "#2F3E75",
    },
    {
      id: 2,
      title: "Play Fun Mini-Games",
      description: "Solve puzzles, play games, and compete with friends on the leaderboard!",
      image: "/images/placeholders/app-carousel-2.svg",
      color: "#3A9679",
    },
    {
      id: 3,
      title: "Earn Cool Rewards",
      description: "Collect stars, unlock badges, and show off your amazing progress!",
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

  // Mouse wheel scroll handler for carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        // Scroll down - next slide
        setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
      } else {
        // Scroll up - previous slide
        setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
      }
    };

    carousel.addEventListener('wheel', handleWheel, { passive: false });
    return () => carousel.removeEventListener('wheel', handleWheel);
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
            <div className={styles.heroBadge}>NEW Adventure Game!</div>
            <h1 className={styles.heroTitle}>
              Master Geometry Through<br/>
              Interactive Adventures
            </h1>
            <p className={styles.heroSubtitle}>
              Journey through magical castles, solve engaging puzzles, and master geometry concepts through gamified learning experiences designed for students.
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
              100% Safe • No Ads • Parent Approved
            </p>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>6</div>
              <div className={styles.statLabel}>Interactive Castles</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>40+</div>
              <div className={styles.statLabel}>Fun Challenges</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1000+</div>
              <div className={styles.statLabel}>Happy Students</div>
            </div>
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
              <h3>Colorful & Interactive</h3>
              <p>Make shapes move, spin, and come to life with engaging 3D visualizations!</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Story Adventures</h3>
              <p>Follow exciting quests through magical lands and unlock new chapters!</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Instant Feedback</h3>
              <p>Know right away if you got it right with real-time validation!</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Play With Friends</h3>
              <p>Compete on leaderboards and collaborate in multiplayer rooms!</p>
            </div>
          </div>
        </section>

        {/* Why Parents Trust It */}
        <section className={styles.parentsSection}>
          <div className={styles.parentsContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>Trusted by Educators</span>
              <h2 className={styles.sectionTitle}>Built for Success in the Classroom</h2>
              <p className={styles.sectionSubtitle}>Designed with input from teachers and aligned with curriculum standards</p>
            </div>

            <div className={styles.parentGrid}>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>📚</div>
                  <h3>Curriculum Aligned</h3>
                </div>
                <p>Every lesson matches educational standards and classroom objectives, reinforcing what students learn in school.</p>
              </div>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>🛡️</div>
                  <h3>Safe Learning Space</h3>
                </div>
                <p>Completely ad-free environment with no distractions, ensuring students stay focused on learning.</p>
              </div>
              <div className={styles.parentCard}>
                <div className={styles.parentCardHeader}>
                  <div className={styles.parentCardIcon}>📊</div>
                  <h3>Detailed Analytics</h3>
                </div>
                <p>Track progress with comprehensive reports showing strengths, areas for improvement, and learning milestones.</p>
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
                src="/images/world-map.png" 
                alt="World Map" 
                fill 
                className={styles.previewImage}
              />
              <div className={styles.previewLabel}>Interactive World Map</div>
            </div>
            <div className={styles.previewCard}>
              <Image 
                src="/images/2.png" 
                alt="Fun Puzzles" 
                fill 
                className={styles.previewImage}
              />
              <div className={styles.previewLabel}>Engaging Puzzles</div>
            </div>
            <div className={styles.previewCard}>
              <Image 
                src="/images/1.png" 
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
            <h2 className={styles.ctaTitle}>Ready to Make Geometry Fun?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of students mastering geometry through interactive adventures
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
                  Start Learning Now - It's FREE!
                </>
              )}
            </button>
            <p className={styles.noCardText}>No credit card needed • Start instantly</p>
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
            <p>Making geometry magical for every learner ✨</p>
          </div>
        </footer>
      </div>
    </>
  );
}
