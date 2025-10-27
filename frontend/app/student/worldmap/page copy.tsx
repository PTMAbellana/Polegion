"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';
import styles from '@/styles/world-map.module.css';
import WorldMapIntro from '@/components/world/WorldMapIntro';
import { initializeUserCastleProgress, getUserCastlesWithProgress } from '@/lib/services/castleService';
import { CastleDisplay } from '@/types/castle.types';
import { supabase } from '@/lib/supabaseClient';

interface CastleMarkerProps {
  castle: CastleDisplay;
  type: 'prev' | 'current' | 'next';
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  animationClass?: string;
}

function CastleMarker({
  castle,
  type,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  animationClass,
}: CastleMarkerProps) {
  const markerClasses = [
    styles.castle_marker,
    type === 'current' ? styles.current_castle : styles.side_castle,
    castle.unlocked ? styles.unlocked : styles.locked,
    castle.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
    animationClass || '',
  ].join(' ');

  const imageContainerClasses = [
    styles.castle_image_container,
    type === 'current' ? styles.castle_large : styles.castle_small,
  ].join(' ');

  return (
    <div
      className={markerClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={imageContainerClasses}>
        <img
          src={`/images/${castle.imageNumber}.png`}
          alt={castle.name}
          style={{
            filter: !castle.unlocked ? 'grayscale(1) brightness(0.7)' : 'none',
          }}
          className={`${styles.castle_image} ${!castle.unlocked ? styles.locked_filter : ''}`}
          draggable={false}
        />

        {castle.completed && (
          <div className={styles.completion_crown}>
            <span>👑</span>
          </div>
        )}

        {!castle.unlocked && (
          <div className={styles.lock_overlay}>
            <span>🔒</span>
          </div>
        )}

        {castle.unlocked && !castle.completed && (
          <div className={styles.available_glow}></div>
        )}
      </div>
      {type === 'current' && (
        <div className={styles.castle_name_plate}>{castle.name}</div>
      )}
    </div>
  );
}

export default function WorldMapPage() {
  const { appLoading, authLoading, isLoggedIn, user } = useAuthStore();
  const [castles, setCastles] = useState<CastleDisplay[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCastle, setSelectedCastle] = useState<CastleDisplay | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<CastleDisplay | null>(null);
  const [currentCastleIndex, setCurrentCastleIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get user ID from Supabase directly if auth store doesn't have it
  useEffect(() => {
    async function getCurrentUser() {
      if (user?.id) {
        console.log('✅ User from auth store:', user.id);
        setCurrentUserId(user.id);
        return;
      }

      // Fallback: Get user from Supabase session
      console.log('⚠️ User not in store, checking Supabase session...');
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (supabaseUser) {
        console.log('✅ User from Supabase:', supabaseUser.id);
        setCurrentUserId(supabaseUser.id);
      } else {
        console.error('❌ No user found anywhere');
        setCurrentUserId(null);
      }
    }

    if (!authLoading && !appLoading && isLoggedIn) {
      getCurrentUser();
    }
  }, [authLoading, appLoading, isLoggedIn, user]);

  // Load castle data from database
  useEffect(() => {
    async function loadCastleData() {
      if (!currentUserId) {
        console.log('⏳ Waiting for user ID...', { currentUserId, user, isLoggedIn });
        return;
      }

      try {
        console.log('🚀 Starting castle data load for user:', currentUserId);
        setDataLoading(true);
        setError(null);

        // Step 1: Check if user has any castle progress
        console.log('📝 Step 1: Checking existing progress...');
        const { data: existingProgress, error: checkError } = await supabase
          .from('user_castle_progress')
          .select('id')
          .eq('user_id', currentUserId)
          .limit(1);

        if (checkError) {
          console.error('❌ Error checking progress:', checkError);
          throw checkError;
        }

        console.log('📊 Existing progress:', existingProgress);

        // Step 2: If no progress exists, initialize it
        if (!existingProgress || existingProgress.length === 0) {
          console.log('🆕 No progress found, initializing for new user...');
          const initResult = await initializeUserCastleProgress(currentUserId);
          console.log('✅ Initialization result:', initResult);

          if (!initResult.success) {
            throw new Error(initResult.error || 'Failed to initialize progress');
          }
        } else {
          console.log('✅ User already has progress, skipping initialization');
        }

        // Step 3: Fetch castles with user's progress
        console.log('📥 Step 3: Fetching castles with progress...');
        const { data, error: fetchError } = await getUserCastlesWithProgress(currentUserId);

        if (fetchError) {
          console.error('❌ Error fetching castles:', fetchError);
          throw fetchError;
        }

        console.log('📦 Raw data received:', data);

        if (!data || data.length === 0) {
          console.warn('⚠️ No castles found in database');
          throw new Error('No castles found. Please contact an administrator.');
        }

        // Step 4: Transform to display format
        const transformedCastles: CastleDisplay[] = data.map((castle: any) => {
          console.log('🏰 Processing castle:', castle.name, {
            unlocked: castle.progress?.unlocked,
            completed: castle.progress?.completed,
            progress: castle.progress
          });
          
          return {
            id: castle.id,
            name: castle.name,
            region: castle.region,
            description: castle.description,
            difficulty: castle.difficulty,
            xp: castle.total_xp,
            unlocked: castle.progress?.unlocked || false,
            completed: castle.progress?.completed || false,
            terrain: castle.terrain,
            route: castle.route,
            imageNumber: castle.image_number,
            totalXpEarned: castle.progress?.total_xp_earned || 0,
            completionPercentage: castle.progress?.completion_percentage || 0,
          };
        });

        console.log('✅ Castles transformed:', transformedCastles.length);
        console.log('🔓 Unlocked castles:', transformedCastles.filter(c => c.unlocked).map(c => c.name));
        
        setCastles(transformedCastles);
        
        // Set first castle as current if available
        if (transformedCastles.length > 0) {
          const firstUnlockedIndex = transformedCastles.findIndex(c => c.unlocked);
          if (firstUnlockedIndex >= 0) {
            setCurrentCastleIndex(firstUnlockedIndex);
          }
        }

      } catch (error: any) {
        console.error('💥 Critical error in loadCastleData:', error);
        setError(error.message || 'Failed to load castle data');
      } finally {
        console.log('🏁 Loading complete');
        setDataLoading(false);
      }
    }

    if (!authLoading && !appLoading && isLoggedIn && currentUserId) {
      console.log('✅ All conditions met, loading castle data...');
      loadCastleData();
    } else {
      console.log('⏳ Waiting for conditions...', { 
        authLoading, 
        appLoading, 
        isLoggedIn, 
        currentUserId 
      });
    }
  }, [authLoading, appLoading, isLoggedIn, currentUserId]);

  // Check for intro
  useEffect(() => {
    if (!authLoading && !appLoading && isLoggedIn) {
      const hasSeenIntro = localStorage.getItem('hasSeenMapIntro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, [authLoading, appLoading, isLoggedIn]);

  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => setDirection(null), 500);
      return () => clearTimeout(timer);
    }
  }, [direction, currentCastleIndex]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('hasSeenMapIntro', 'true');
  };

  const goNext = useCallback(() => {
    if (castles.length === 0) return;
    setDirection('right');
    setCurrentCastleIndex((prevIndex) => (prevIndex + 1) % castles.length);
    setSelectedCastle(null);
  }, [castles.length]);

  const goPrev = useCallback(() => {
    if (castles.length === 0) return;
    setDirection('left');
    setCurrentCastleIndex((prevIndex) => (prevIndex - 1 + castles.length) % castles.length);
    setSelectedCastle(null);
  }, [castles.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  // Loading states
  if (authLoading || appLoading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.error_container}>
        <h2>Access Denied</h2>
        <p>Please log in to access the World Map.</p>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading Ancient Map...</p>
        <small style={{ marginTop: '1rem', opacity: 0.7 }}>
          Initializing your journey...
        </small>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error_container}>
        <h2>⚠️ Error Loading Map</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
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
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary>Troubleshooting Steps</summary>
          <ol style={{ marginTop: '0.5rem' }}>
            <li>Check if tables exist in Supabase</li>
            <li>Run the SQL script to create tables</li>
            <li>Insert castle data</li>
          </ol>
        </details>
      </div>
    );
  }

  const handleCastleClick = (castle: CastleDisplay) => {
    if (!castle.unlocked) return;
    
    if (castles[currentCastleIndex].id !== castle.id) {
      const newIndex = castles.findIndex(c => c.id === castle.id);
      if (newIndex !== -1) {
        setDirection(newIndex > currentCastleIndex ? 'right' : 'left');
        setCurrentCastleIndex(newIndex);
        setSelectedCastle(null);
      }
    } else {
      setSelectedCastle(castle);
    }
  };

  const handleEnterCastle = (castle: CastleDisplay) => {
    if (!castle.unlocked) return;
    router.push(`/student/worldmap/${castle.id}`);
  };

  const prevIndex = (currentCastleIndex - 1 + castles.length) % castles.length;
  const nextIndex = (currentCastleIndex + 1) % castles.length;

  const castlesToDisplay = [
    { castle: castles[prevIndex], type: 'prev' as const },
    { castle: castles[currentCastleIndex], type: 'current' as const },
    { castle: castles[nextIndex], type: 'next' as const },
  ];

  return (
    <div className={styles.world_map_page_container}>
      {showIntro && <WorldMapIntro onIntroComplete={handleIntroComplete} />}
      
      {/* World Map Logo */}
      <div className={styles.world_map_logo_container}>
        <img 
          src="/images/world-map-logo.svg" 
          alt="World Map Logo" 
          className={styles.world_map_logo}
        />
      </div>

      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          backgroundImage: 'url("/images/world-map-bg.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
        }}
      />

      {/* Carousel */}
      <div className={styles.carousel_wrapper} style={{ position: 'relative', zIndex: 5 }}>
        <button
          className={`${styles.carousel_arrow} ${styles.arrow_left}`}
          onClick={goPrev}
          aria-label="Previous castle"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className={styles.carousel_track}>
          {castlesToDisplay.map(({ castle, type }) => {
            let animationClass = '';
            if (direction === 'right') {
              if (type === 'prev') animationClass = styles.shrink_to_side;
              if (type === 'current') animationClass = styles.grow_to_center;
              if (type === 'next') animationClass = styles.slide_in_right;
            } else if (direction === 'left') {
              if (type === 'prev') animationClass = styles.slide_in_left;
              if (type === 'current') animationClass = styles.grow_to_center;
              if (type === 'next') animationClass = styles.shrink_to_side;
            }

            return (
              <CastleMarker
                key={castle.id}
                castle={castle}
                type={type}
                isSelected={selectedCastle?.id === castle.id}
                isHovered={hoveredCastle?.id === castle.id}
                onClick={() => handleCastleClick(castle)}
                onMouseEnter={() => setHoveredCastle(castle)}
                onMouseLeave={() => setHoveredCastle(null)}
                animationClass={animationClass}
              />
            );
          })}
        </div>

        <button
          className={`${styles.carousel_arrow} ${styles.arrow_right}`}
          onClick={goNext}
          aria-label="Next castle"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Castle Details Panel */}
      {selectedCastle && (
        <div className={styles.castle_details_panel}>
          <h2>{selectedCastle.name}</h2>
          <p className={styles.castle_region}>{selectedCastle.region}</p>
          <p className={styles.castle_description}>{selectedCastle.description}</p>
          
          <div className={styles.castle_stats}>
            <div className={styles.stat_item}>
              <span className={styles.stat_label}>Difficulty:</span>
              <span className={styles.stat_value}>{selectedCastle.difficulty}</span>
            </div>
            <div className={styles.stat_item}>
              <span className={styles.stat_label}>XP:</span>
              <span className={styles.stat_value}>
                {selectedCastle.totalXpEarned} / {selectedCastle.xp}
              </span>
            </div>
            <div className={styles.stat_item}>
              <span className={styles.stat_label}>Progress:</span>
              <span className={styles.stat_value}>{selectedCastle.completionPercentage}%</span>
            </div>
          </div>

          <button 
            className={styles.enter_castle_button}
            onClick={() => handleEnterCastle(selectedCastle)}
          >
            Enter Castle →
          </button>
        </div>
      )}
    </div>
  );
}