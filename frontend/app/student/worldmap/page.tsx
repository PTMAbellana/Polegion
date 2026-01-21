'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCastleStore } from '@/store/castleStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import WorldMapIntro from '@/components/world/WorldMapIntro';
import CastleMarker from '@/components/worldmap/CastleMarker';
import CastleModal from '@/components/worldmap/CastleModal';
import CastleStats from '@/components/worldmap/CastleStats';
import styles from '@/styles/world-map.module.css';
import { CastleWithProgress } from '@/types/common/castle';

export default function WorldMapPage() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const { isLoading: authLoading } = AuthProtection();

  // Zustand store
  const {
    castles,
    currentCastleIndex,
    selectedCastle,
    hoveredCastle,
    loading,
    error,
    showIntro,
    setCurrentCastleIndex,
    setSelectedCastle,
    setHoveredCastle,
    setShowIntro,
    getCastleStats,
    fetchCastles,
  } = useCastleStore();

  // Local UI state
  const [backgroundError, setBackgroundError] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false); // Track if castles are transitioning
  const [isNavigating, setIsNavigating] = useState(false); // Track navigation loading state
  
  // Refs for touch/swipe, fetching, and animation
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const hasFetchedRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const whooshAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Initialize audio
  useEffect(() => {
    isMountedRef.current = true;
    
    if (typeof window !== 'undefined') {
      whooshAudioRef.current = new Audio('/audio/whoosh.mp3');
      whooshAudioRef.current.volume = 0.5;
      // Preload the audio
      whooshAudioRef.current.load();
    }
    
    return () => {
      isMountedRef.current = false;
      // Clean up audio
      if (whooshAudioRef.current) {
        whooshAudioRef.current.pause();
        whooshAudioRef.current = null;
      }
      // Clear any pending animation timeouts
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Fetch castles on mount or when user changes
  useEffect(() => {
    const userId = userProfile?.id;
    
    if (userId && (!hasFetchedRef.current || lastUserIdRef.current !== userId) && isMountedRef.current) {
      console.log('[WorldMap] Fetching castles for user:', userId);
      hasFetchedRef.current = true;
      lastUserIdRef.current = userId;
      fetchCastles(userId);
    }
  }, [userProfile?.id, fetchCastles]);

  // Refetch castles when navigating back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only refetch if component is still mounted and page is visible
      if (!document.hidden && userProfile?.id && hasFetchedRef.current && isMountedRef.current) {
        console.log('[WorldMap] Page visible - refetching castles');
        fetchCastles(userProfile.id);
      }
    };

    const handleFocus = () => {
      // Only refetch if component is still mounted
      if (userProfile?.id && hasFetchedRef.current && isMountedRef.current) {
        console.log('[WorldMap] Window focused - refetching castles');
        fetchCastles(userProfile.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userProfile?.id, fetchCastles]);

  // Update selectedCastle when castles data refreshes (to show fresh progress in modal)
  useEffect(() => {
    if (selectedCastle && isMountedRef.current) {
      const updatedCastle = castles.find(c => c.id === selectedCastle.id);
      if (updatedCastle && JSON.stringify(updatedCastle.progress) !== JSON.stringify(selectedCastle.progress)) {
        console.log('[WorldMap] Castle data refreshed - updating modal with new progress');
        console.log('[WorldMap] Old progress:', selectedCastle.progress);
        console.log('[WorldMap] New progress:', updatedCastle.progress);
        setSelectedCastle(updatedCastle);
      }
    }
  }, [castles]);

  // Intro display - use user-specific localStorage key (only check once per session)
  const hasCheckedIntroRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && userProfile) {
      const introKey = `hasSeenMapIntro_${userProfile.id}`;
      const hasSeenIntro = localStorage.getItem(introKey);
      
      // Only update if we haven't checked for this user yet
      if (hasCheckedIntroRef.current !== userProfile.id) {
        hasCheckedIntroRef.current = userProfile.id;
        console.log('[WorldMap] Checking intro for user:', userProfile.id, 'hasSeenIntro:', hasSeenIntro);
        
        if (!hasSeenIntro) {
          console.log('[WorldMap] First time user - showing intro');
          // Mark as started immediately so it won't show again
          localStorage.setItem(introKey, 'started');
          setShowIntro(true);
        } else {
          console.log('[WorldMap] User has seen intro - keeping it hidden');
          setShowIntro(false);
        }
      }
    }
  }, [authLoading, userProfile]);

  // Preload ALL castle background images on mount
  useEffect(() => {
    if (castles.length === 0) return;
    
    const loadedSet = new Set<number>();
    
    castles.forEach((castle) => {
      // Use specific backgrounds for castle 0 and 6, modulo cycling for 7+
      let backgroundNum: number;
      if (castle.image_number >= 0 && castle.image_number <= 6) {
        backgroundNum = castle.image_number;
      } else {
        // Fallback for any other numbers, e.g., cycle through 1-5
        backgroundNum = ((castle.image_number - 1) % 5) + 1;
      }
      const img = new Image();
      img.src = `/images/castles/castle${backgroundNum}-background.webp`;
      
      img.onload = () => {
        loadedSet.add(castle.image_number);
        setPreloadedImages(new Set(loadedSet));
      };
      
      img.onerror = () => {
        console.warn(`Background image not found for castle ${castle.image_number}, using fallback`);
      };
    });
  }, [castles]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goNext();
    }
    if (isRightSwipe) {
      goPrev();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Callbacks
  const handleIntroComplete = () => {
    if (userProfile) {
      const introKey = `hasSeenMapIntro_${userProfile.id}`;
      localStorage.setItem(introKey, 'true');
      console.log('[WorldMap] Intro completed, saved to localStorage:', introKey);
    }
    setShowIntro(false);
  };

  // Reset modal state when arriving on world map
  useEffect(() => {
    setSelectedCastle(null);
    setHoveredCastle(null);
  }, [setSelectedCastle, setHoveredCastle]);

  const playWhoosh = () => {
    if (whooshAudioRef.current) {
      whooshAudioRef.current.currentTime = 0;
      const playPromise = whooshAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Audio play failed:', err));
      }
    }
  };

  const triggerCastleAnimation = (currentIdx: number) => {
    if (castles.length === 0 || !isMountedRef.current) return;
    
    // Set transitioning state
    setIsTransitioning(true);
    
    // Play whoosh sound immediately when animation starts
    playWhoosh();
    
    // Clear previous timeout if exists
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Clear transitioning after animation completes (0.5s)
    animationTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsTransitioning(false);
      }
    }, 500);
  };

  const goNext = useCallback(() => {
    if (castles.length === 0) return;
    const nextIndex = (currentCastleIndex + 1) % castles.length;
    setCurrentCastleIndex(nextIndex);
    setSelectedCastle(null);
    triggerCastleAnimation(nextIndex);
  }, [castles, currentCastleIndex, setCurrentCastleIndex, setSelectedCastle]);

  const goPrev = useCallback(() => {
    if (castles.length === 0) return;
    const prevIndex = (currentCastleIndex - 1 + castles.length) % castles.length;
    setCurrentCastleIndex(prevIndex);
    setSelectedCastle(null);
    triggerCastleAnimation(prevIndex);
  }, [castles, currentCastleIndex, setCurrentCastleIndex, setSelectedCastle]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedCastle) return;
      
      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, selectedCastle]);

  const handleCastleClick = async (castle: CastleWithProgress) => {
    if (!castle.progress?.unlocked) {
      return;
    }
    
    if (castles[currentCastleIndex].id !== castle.id) {
      const newIndex = castles.findIndex(c => c.id === castle.id);
      if (newIndex !== -1) {
        setCurrentCastleIndex(newIndex);
        setSelectedCastle(null);
        // Play whoosh sound when switching castles
        playWhoosh();
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }
    } else {
      // Toggle modal open/close
      if (selectedCastle?.id === castle.id) {
        setSelectedCastle(null);
      } else {
        // Open modal first, then refetch in background
        setSelectedCastle(castle);
        // Refetch castle data to update with fresh progress (useEffect will sync)
        if (userProfile?.id) {
          console.log('[WorldMap] Modal opened - refetching for fresh data');
          fetchCastles(userProfile.id);
        }
      }
    }
  };

  const handleEnterCastle = async (castle: CastleWithProgress) => {
    if (!castle.progress?.unlocked) {
      return;
    }

    try {
      setIsNavigating(true);
      router.push(`/student/worldmap/${castle.route}`);
    } catch (err) {
      console.error('Failed to enter castle:', err);
      setIsNavigating(false);
    }
  };

  // Background style helper
  const getBackgroundStyle = () => {
    if (castles.length === 0) {
      return {
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    }

    const currentCastle = castles[currentCastleIndex];
    // Use specific backgrounds for castle 0 and 6, modulo cycling for 7+
    let backgroundNum: number;
    if (currentCastle.image_number >= 0 && currentCastle.image_number <= 6) {
      backgroundNum = currentCastle.image_number;
    } else {
      // Fallback for any other numbers, e.g., cycle through 1-5
      backgroundNum = ((currentCastle.image_number - 1) % 5) + 1;
    }
    const currentBackgroundImage = `/images/castles/castle${backgroundNum}-background.webp`;

    // Only show the image if it's preloaded, otherwise show gradient
    const isImageLoaded = preloadedImages.has(currentCastle.image_number);
    
    if (isImageLoaded && !backgroundError) {
      return {
        backgroundImage: `url('${currentBackgroundImage}')`,
      };
    }

    // Fallback gradients while loading or on error
    const gradients: Record<number, string> = {
      1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };

    return {
      backgroundImage: gradients[backgroundNum] || gradients[1],
    };
  };

  // Loading states
  if (authLoading || loading) {
    return <Loader />;
  }

  if (!userProfile) {
    return (
      <div className={styles.error_container}>
        <h2>Access Denied</h2>
        <p>Please log in to access the World Map.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error_container}>
        <h2>Error Loading Map</h2>
        <p>{error}</p>
        <button onClick={() => userProfile?.id && fetchCastles(userProfile.id)}>
          Reload Page
        </button>
      </div>
    );
  }

  if (castles.length === 0) {
    return (
      <div className={styles.error_container}>
        <h2>No Castles Found</h2>
        <p>The database has no castle data.</p>
        <button onClick={() => userProfile?.id && fetchCastles(userProfile.id)}>
          Retry
        </button>
      </div>
    );
  }

  // Calculate carousel data - Show only current castle
  const currentCastle = castles[currentCastleIndex];

  const stats = getCastleStats();

  return (
    <div className={styles.world_map_page_container}>
      {showIntro && <WorldMapIntro onIntroComplete={handleIntroComplete} />}
      
      {/* Dynamic Background */}
      <div
        className={styles.map_background}
        style={getBackgroundStyle()}
      />

      {/* Logo - Top Right */}
      <div className={styles.world_map_logo}>
        <img src="/images/world-map-logo.webp" alt="World Map" />
      </div>

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Carousel Section */}
        <div className={styles.carousel_section}>
          {/* Carousel */}
          <div
            className={styles.carousel_container}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className={styles.carousel_arrow}
              onClick={goPrev}
              aria-label="Previous castle"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.carousel_track}>
              {/* Previous Castle (left) */}
              {castles.length > 0 && (
                <CastleMarker
                  key={`prev-${castles[(currentCastleIndex - 1 + castles.length) % castles.length].id}`}
                  castle={castles[(currentCastleIndex - 1 + castles.length) % castles.length]}
                  type="prev"
                  isSelected={selectedCastle?.id === castles[(currentCastleIndex - 1 + castles.length) % castles.length].id}
                  isHovered={hoveredCastle?.id === castles[(currentCastleIndex - 1 + castles.length) % castles.length].id}
                  isAnimating={isTransitioning}
                  onClick={() => handleCastleClick(castles[(currentCastleIndex - 1 + castles.length) % castles.length])}
                  onMouseEnter={() => setHoveredCastle(castles[(currentCastleIndex - 1 + castles.length) % castles.length])}
                  onMouseLeave={() => setHoveredCastle(null)}
                />
              )}
              
              {/* Current Castle (center) */}
              {currentCastle && (
                <CastleMarker
                  key={`current-${currentCastle.id}`}
                  castle={currentCastle}
                  type="current"
                  isSelected={selectedCastle?.id === currentCastle.id}
                  isHovered={hoveredCastle?.id === currentCastle.id}
                  isAnimating={isTransitioning}
                  onClick={() => handleCastleClick(currentCastle)}
                  onMouseEnter={() => setHoveredCastle(currentCastle)}
                  onMouseLeave={() => setHoveredCastle(null)}
                />
              )}
              
              {/* Next Castle (right) */}
              {castles.length > 0 && (
                <CastleMarker
                  key={`next-${castles[(currentCastleIndex + 1) % castles.length].id}`}
                  castle={castles[(currentCastleIndex + 1) % castles.length]}
                  type="next"
                  isSelected={selectedCastle?.id === castles[(currentCastleIndex + 1) % castles.length].id}
                  isHovered={hoveredCastle?.id === castles[(currentCastleIndex + 1) % castles.length].id}
                  isAnimating={isTransitioning}
                  onClick={() => handleCastleClick(castles[(currentCastleIndex + 1) % castles.length])}
                  onMouseEnter={() => setHoveredCastle(castles[(currentCastleIndex + 1) % castles.length])}
                  onMouseLeave={() => setHoveredCastle(null)}
                />
              )}
            </div>

            <button
              className={styles.carousel_arrow}
              onClick={goNext}
              aria-label="Next castle"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Compact Stats Panel */}
        <CastleStats {...stats} currentCastleIndex={currentCastleIndex} />
      </main>

      {/* Castle Details Modal */}
      {selectedCastle && (
        <CastleModal
          castle={selectedCastle}
          onClose={() => setSelectedCastle(null)}
          onEnter={handleEnterCastle}
        />
      )}

      {/* Loading Overlay */}
      {(isNavigating || loading) && (
        <div className={styles.loadingOverlay}>
          <Loader />
          <p className={styles.loadingText}>Loading...</p>
        </div>
      )}
    </div>
  );
}