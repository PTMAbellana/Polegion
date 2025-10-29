"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useWorldMap } from '@/hooks/useWorldMap';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import WorldMapIntro from '@/components/world/WorldMapIntro';
import styles from '@/styles/world-map.module.css';
import type { CastleWithProgress } from '@/types/castle.types';

interface CastleMarkerProps {
  castle: CastleWithProgress;
  type: 'prev' | 'current' | 'next';  
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function CastleMarker({
  castle,
  type,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CastleMarkerProps) {
  const [imgError, setImgError] = useState(false);
  
  const markerClasses = [
    styles.castle_marker,
    type === 'current' ? styles.current_castle : styles.side_castle,
    castle.progress?.unlocked ? styles.unlocked : styles.locked,
    castle.progress?.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
  ].join(' ');

  const getImagePath = () => {
    if (imgError) {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%234a5568"/><text y="50%" x="50%" text-anchor="middle" dominant-baseline="middle" font-size="100">🏰</text></svg>';
    }
    return `/images/castles/castle${castle.image_number}.png`;
  };

  const handleImageError = () => {
    if (!imgError) {
      console.warn(`Image not found: /images/castles/castle${castle.image_number}.png`);
      setImgError(true);
    }
  };

  return (
    <div
      className={markerClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.castle_image_container}>
        <img
          src={getImagePath()}
          alt={castle.name}
          className={`${styles.castle_image} ${!castle.progress?.unlocked ? styles.locked_filter : ''}`}
          draggable={false}
          onError={handleImageError}
        />

        {castle.progress?.completed && (
          <div className={styles.completion_crown}>
            👑
          </div>
        )}

        {!castle.progress?.unlocked && (
          <div className={styles.lock_overlay}>
            🔒
          </div>
        )}
      </div>
      
      {type === 'current' && (
        <div className={styles.castle_name_plate}>{castle.name}</div>
      )}
    </div>
  );
}

export default function WorldMapPage() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const { isLoading: authLoading } = AuthProtection();

  // Refs for touch/swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // All useState hooks
  const [showIntro, setShowIntro] = useState(false);
  const [selectedCastle, setSelectedCastle] = useState<CastleWithProgress | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<CastleWithProgress | null>(null);
  const [currentCastleIndex, setCurrentCastleIndex] = useState(0);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [backgroundError, setBackgroundError] = useState(false);

  const {
    castles,
    loading: castlesLoading,
    error,
    selectCastle,
    refreshCastles
  } = useWorldMap(userProfile?.id || '');

  // Navbar expansion listener
  useEffect(() => {
    const checkNavbarHover = (e: MouseEvent) => {
      if (window.innerWidth > 968) {
        const isNearNavbar = e.clientX <= 70;
        setIsNavExpanded(isNearNavbar);
      } else {
        setIsNavExpanded(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth <= 968) {
        setIsNavExpanded(false);
      }
    };

    window.addEventListener('mousemove', checkNavbarHover);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', checkNavbarHover);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Intro display
  useEffect(() => {
    if (!authLoading && userProfile) {
      const hasSeenIntro = localStorage.getItem('hasSeenMapIntro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, [authLoading, userProfile]);

  // Set initial castle index
  useEffect(() => {
    if (castles.length > 0) {
      const firstUnlockedIndex = castles.findIndex(c => c.progress?.unlocked);
      if (firstUnlockedIndex >= 0) {
        setCurrentCastleIndex(firstUnlockedIndex);
      }
    }
  }, [castles]);

  // Background preload
  useEffect(() => {
    if (castles.length === 0) return;
    
    const currentCastle = castles[currentCastleIndex];
    if (!currentCastle) return;

    const currentBackgroundImage = `/images/castles/castle${currentCastle.image_number}-background.png`;
    
    setBackgroundError(false);
    
    const img = new Image();
    img.src = currentBackgroundImage;
    
    img.onerror = () => {
      console.warn(`Background image not found: ${currentBackgroundImage}`);
      setBackgroundError(true);
    };
  }, [currentCastleIndex, castles]);

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
    setShowIntro(false);
    localStorage.setItem('hasSeenMapIntro', 'true');
  };

  const goNext = useCallback(() => {
    if (castles.length === 0) return;
    setCurrentCastleIndex((prevIndex) => (prevIndex + 1) % castles.length);
    setSelectedCastle(null);
  }, [castles.length]);

  const goPrev = useCallback(() => {
    if (castles.length === 0) return;
    setCurrentCastleIndex((prevIndex) => (prevIndex - 1 + castles.length) % castles.length);
    setSelectedCastle(null);
  }, [castles.length]);

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

  const handleCastleClick = (castle: CastleWithProgress) => {
    if (!castle.progress?.unlocked) {
      return;
    }
    
    if (castles[currentCastleIndex].id !== castle.id) {
      const newIndex = castles.findIndex(c => c.id === castle.id);
      if (newIndex !== -1) {
        setCurrentCastleIndex(newIndex);
        setSelectedCastle(null);
      }
    } else {
      setSelectedCastle(selectedCastle?.id === castle.id ? null : castle);
    }
  };

  const handleEnterCastle = async (castle: CastleWithProgress) => {
    if (!castle.progress?.unlocked) {
      alert('🔒 This castle is locked! Complete previous castles to unlock.');
      return;
    }

    try {
      await selectCastle(castle);
      router.push(`/student/worldmap/${castle.route}`);
    } catch (err) {
      console.error('Failed to enter castle:', err);
      alert('Failed to load castle details.');
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
    const currentBackgroundImage = `/images/castles/castle${currentCastle.image_number}-background.png`;

    if (!backgroundError) {
      return {
        backgroundImage: `url('${currentBackgroundImage}')`,
      };
    }

    const gradients: Record<number, string> = {
      1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };

    return {
      backgroundImage: gradients[currentCastle.image_number] || gradients[1],
    };
  };

  // Loading states
  if (authLoading || castlesLoading) {
    return (
      <Loader />
    );
  }

  if (!userProfile) {
    return (
      <div className={`${styles.error_container} `}>
        <h2>Access Denied</h2>
        <p>Please log in to access the World Map.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.error_container} `}>
        <h2>⚠️ Error Loading Map</h2>
        <p>{error}</p>
        <button onClick={() => refreshCastles()}>Reload Page</button>
      </div>
    );
  }

  if (castles.length === 0) {
    return (
      <div className={`${styles.error_container}`}>
        <h2>No Castles Found</h2>
        <p>The database has no castle data.</p>
        <button onClick={() => refreshCastles()}>Retry</button>
      </div>
    );
  }

  // Calculate carousel data
  const prevIndex = (currentCastleIndex - 1 + castles.length) % castles.length;
  const nextIndex = (currentCastleIndex + 1) % castles.length;

  const castlesToDisplay = [
    { castle: castles[prevIndex], type: 'prev' as const },
    { castle: castles[currentCastleIndex], type: 'current' as const },
    { castle: castles[nextIndex], type: 'next' as const },
  ];

  const getAnimationClass = (type: 'prev' | 'current' | 'next'): string => {
    if (!direction) return '';
    
    if (direction === 'right') {
      if (type === 'prev') return styles.shrink_to_side;
      if (type === 'current') return styles.grow_to_center;
      if (type === 'next') return styles.slide_in_right;
    } else if (direction === 'left') {
      if (type === 'prev') return styles.slide_in_left;
      if (type === 'current') return styles.grow_to_center;
      if (type === 'next') return styles.shrink_to_side;
    }
    
    return '';
  };

  const currentCastle = castles[currentCastleIndex];

  const totalCastles = castles.length;
  const unlockedCastles = castles.filter(c => c.progress?.unlocked).length;
  const completedCastles = castles.filter(c => c.progress?.completed).length;
  const totalXP = castles.reduce((sum, c) => sum + (c.progress?.total_xp_earned || 0), 0);

  return (
    <div className={`${styles.world_map_page_container} ${isNavExpanded ? styles.expanded : ''}`}>
      {showIntro && <WorldMapIntro onIntroComplete={handleIntroComplete} />}
      
      {/* Dynamic Background */}
      <div 
        className={`${styles.map_background} ${isNavExpanded ? styles.expanded : ''}`}
        style={getBackgroundStyle()}
      />

      {/* Logo - Top Right */}
      <div className={styles.world_map_logo}>
        <img src="/images/world-map-logo.png" alt="World Map" />
      </div>

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Carousel Section */}
        <div className={styles.carousel_section}>
          {/* Carousel Indicators (Dots) */}
          <div className={styles.carousel_indicators}>
            {castles.map((castle, index) => (
              <button
                key={castle.id}
                className={`${styles.indicator_dot} ${
                  index === currentCastleIndex ? styles.active : ''
                } ${castle.progress?.completed ? styles.completed : ''} ${
                  castle.progress?.unlocked ? styles.unlocked : styles.locked
                }`}
                onClick={() => {
                  if (castle.progress?.unlocked) {
                    setCurrentCastleIndex(index);
                    setSelectedCastle(null);
                  }
                }}
                aria-label={`Go to ${castle.name}`}
                title={castle.name}
              />
            ))}
          </div>

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
              {castlesToDisplay.map(({ castle, type }) => (
                <CastleMarker
                  key={`${castle.id}-${type}`}
                  castle={castle}
                  type={type}
                  isSelected={selectedCastle?.id === castle.id}
                  isHovered={hoveredCastle?.id === castle.id}
                  onClick={() => handleCastleClick(castle)}
                  onMouseEnter={() => setHoveredCastle(castle)}
                  onMouseLeave={() => setHoveredCastle(null)}
                />
              ))}
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
        <div className={styles.stats_panel}>
          <div className={styles.stat_item}>
            <span className={styles.stat_label}>Completed:</span>
            <span className={styles.stat_value}>{completedCastles}/{totalCastles}</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.stat_label}>Unlocked:</span>
            <span className={styles.stat_value}>{unlockedCastles}</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.stat_label}>Total XP:</span>
            <span className={styles.stat_value}>{totalXP}</span>
          </div>
        </div>
      </main>

      {/* Castle Details Modal */}
      {selectedCastle && (
        <div 
          className={styles.modal_overlay}
          onClick={() => setSelectedCastle(null)}
        >
          <div 
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.close_button}
              onClick={() => setSelectedCastle(null)}
              aria-label="Close"
            >
              ×
            </button>

            <h2>{selectedCastle.name}</h2>
            <p className={styles.castle_description}>
              {selectedCastle.description || 'A mysterious castle awaits...'}
            </p>

            <div className={styles.castle_info}>
              <p><strong>Difficulty:</strong> {selectedCastle.difficulty || 'Easy'}</p>
              <p><strong>Region:</strong> {selectedCastle.region || 'Unknown'}</p>
              <p><strong>Total XP:</strong> {selectedCastle.total_xp || 0}</p>
            </div>

            {selectedCastle.progress?.unlocked && (
              <>
                <div className={styles.progress_bar_container}>
                  <div className={styles.progress_label}>
                    Progress: {selectedCastle.progress.completion_percentage || 0}%
                  </div>
                  <div className={styles.progress_bar}>
                    <div 
                      className={styles.progress_fill}
                      style={{ width: `${selectedCastle.progress.completion_percentage || 0}%` }}
                    />
                  </div>
                </div>

                <button
                  className={styles.enter_button}
                  onClick={() => handleEnterCastle(selectedCastle)}
                >
                  {selectedCastle.progress?.completed ? 'Revisit Castle' : 'Enter Castle'}
                </button>
              </>
            )}

            {!selectedCastle.progress?.unlocked && (
              <p className={styles.locked_message}>
                🔒 Complete previous castles to unlock
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}