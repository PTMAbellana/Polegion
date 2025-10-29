"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  const [imgError, setImgError] = useState(false);
  
  const markerClasses = [
    styles.castle_marker,
    type === 'current' ? styles.current_castle : styles.side_castle,
    castle.progress?.unlocked ? styles.unlocked : styles.locked,
    castle.progress?.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
    animationClass || '',
  ].join(' ');

  const getImagePath = () => {
    if (imgError) {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%234a5568"/><text y="50%" x="50%" text-anchor="middle" dominant-baseline="middle" font-size="100">🏰</text></svg>';
    }
    return `/images/${castle.image_number}.png`;
  };

  const handleImageError = () => {
    if (!imgError) {
      console.warn(`Image not found: /images/${castle.image_number}.png`);
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
          style={{
            filter: !castle.progress?.unlocked ? 'grayscale(1) brightness(0.7)' : 'none',
          }}
          className={`${styles.castle_image} ${!castle.progress?.unlocked ? styles.locked_filter : ''}`}
          draggable={false}
          onError={handleImageError}
        />

        {castle.progress?.completed && (
          <div className={styles.completion_crown}>
            <span>👑</span>
          </div>
        )}

        {!castle.progress?.unlocked && (
          <div className={styles.lock_overlay}>
            <span>🔒</span>
          </div>
        )}

        {castle.progress?.unlocked && !castle.progress?.completed && (
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
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const { isLoading: authLoading } = AuthProtection();

  // All useState hooks at the top
  const [showIntro, setShowIntro] = useState(false);
  const [selectedCastle, setSelectedCastle] = useState<CastleWithProgress | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<CastleWithProgress | null>(null);
  const [currentCastleIndex, setCurrentCastleIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [backgroundError, setBackgroundError] = useState(false);

  const {
    castles,
    loading: castlesLoading,
    error,
    selectCastle,
    refreshCastles
  } = useWorldMap(userProfile?.id || '');

  // All useEffect hooks together
  // Listen for navbar expansion state
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

  useEffect(() => {
    if (!authLoading && userProfile) {
      const hasSeenIntro = localStorage.getItem('hasSeenMapIntro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, [authLoading, userProfile]);

  useEffect(() => {
    if (castles.length > 0) {
      const firstUnlockedIndex = castles.findIndex(c => c.progress?.unlocked);
      if (firstUnlockedIndex >= 0) {
        setCurrentCastleIndex(firstUnlockedIndex);
      }
    }
  }, [castles]);

  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => setDirection(null), 500);
      return () => clearTimeout(timer);
    }
  }, [direction, currentCastleIndex]);

  // Background image preloading effect
  useEffect(() => {
    if (castles.length === 0) return;
    
    const currentCastle = castles[currentCastleIndex];
    if (!currentCastle) return;

    const currentBackgroundImage = `/images/${currentCastle.image_number}-background.png`;
    
    setBackgroundError(false);
    
    const img = new Image();
    img.src = currentBackgroundImage;
    
    img.onerror = () => {
      console.warn(`Background image not found: ${currentBackgroundImage}`);
      setBackgroundError(true);
    };
  }, [currentCastleIndex, castles]);

  // Callbacks
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

  const handleCastleClick = (castle: CastleWithProgress) => {
    if (!castle.progress?.unlocked) {
      return;
    }
    
    if (castles[currentCastleIndex].id !== castle.id) {
      const newIndex = castles.findIndex(c => c.id === castle.id);
      if (newIndex !== -1) {
        setDirection(newIndex > currentCastleIndex ? 'right' : 'left');
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
      // Use the castle's route property instead of ID
      router.push(castle.route);
    } catch (err) {
      console.error('Failed to enter castle:', err);
      alert('Failed to load castle details.');
    }
  };

  // Helper function for background style
  const getBackgroundStyle = () => {
    if (castles.length === 0) {
      return {
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    }

    const currentCastle = castles[currentCastleIndex];
    const currentBackgroundImage = `/images/${currentCastle.image_number}-background.png`;

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

  // Early returns AFTER all hooks
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

  // const currentCastle = castles[currentCastleIndex];

  const totalCastles = castles.length;
  const unlockedCastles = castles.filter(c => c.progress?.unlocked).length;
  const completedCastles = castles.filter(c => c.progress?.completed).length;
  const totalQuestions = castles.reduce((sum, c) => sum + (c.questions_count || 0), 0);

  return (
    <div className={`${styles.world_map_page_container} ${isNavExpanded ? styles.expanded : ''}`}>
      {showIntro && <WorldMapIntro onIntroComplete={handleIntroComplete} />}
      
      {/* Dynamic Background */}
      <div 
        className={`${styles.map_background} ${isNavExpanded ? styles.expanded : ''}`}
        style={getBackgroundStyle()}
      />

      {/* Main Content */}
      <main className={styles.main_content}>
        {/* Carousel */}
        <div className={styles.carousel_container}>
          <button
            className={`${styles.carousel_arrow} ${styles.arrow_left}`}
            onClick={goPrev}
            aria-label="Previous castle"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={styles.carousel_track}>
            {castlesToDisplay.map(({ castle, type }) => (
              <CastleMarker
                key={castle.id}
                castle={castle}
                type={type}
                isSelected={selectedCastle?.id === castle.id}
                isHovered={hoveredCastle?.id === castle.id}
                onClick={() => handleCastleClick(castle)}
                onMouseEnter={() => setHoveredCastle(castle)}
                onMouseLeave={() => setHoveredCastle(null)}
                animationClass={getAnimationClass(type)}
              />
            ))}
          </div>

          <button
            className={`${styles.carousel_arrow} ${styles.arrow_right}`}
            onClick={goNext}
            aria-label="Next castle"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Stats Panel - Always Visible */}
        <div className={styles.info_panel}>
          <div className={styles.info_card}>
            <div className={styles.stats_section}>
              <div className={styles.stat_item}>
                <div className={styles.stat_icon}>🏰</div>
                <div className={styles.stat_content}>
                  <div className={styles.stat_label}>Total Castles</div>
                  <div className={styles.stat_value}>{totalCastles}</div>
                </div>
              </div>

              <div className={styles.stat_item}>
                <div className={styles.stat_icon}>🔓</div>
                <div className={styles.stat_content}>
                  <div className={styles.stat_label}>Unlocked</div>
                  <div className={styles.stat_value}>{unlockedCastles}</div>
                </div>
              </div>

              <div className={styles.stat_item}>
                <div className={styles.stat_icon}>✅</div>
                <div className={styles.stat_content}>
                  <div className={styles.stat_label}>Completed</div>
                  <div className={styles.stat_value}>{completedCastles}</div>
                </div>
              </div>

              <div className={styles.stat_item}>
                <div className={styles.stat_icon}>📝</div>
                <div className={styles.stat_content}>
                  <div className={styles.stat_label}>Total Questions</div>
                  <div className={styles.stat_value}>{totalQuestions}</div>
                </div>
              </div>
            </div>
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

            <div className={styles.castle_details}>
              <div className={styles.castle_header}>
                <h2 className={styles.castle_details_title}>{selectedCastle.name}</h2>
                <p className={styles.castle_region}>{selectedCastle.region || 'Unknown Region'}</p>
              </div>

              <p className={styles.castle_description}>
                {selectedCastle.description || 'A mysterious castle awaits your exploration...'}
              </p>

              <div className={styles.castle_info_grid}>
                <div className={styles.castle_info_item}>
                  <div className={styles.castle_info_label}>Difficulty</div>
                  <div className={`${styles.castle_info_value} ${styles[selectedCastle.difficulty?.toLowerCase() || 'easy']}`}>
                    {selectedCastle.difficulty || 'Easy'}
                  </div>
                </div>

                <div className={styles.castle_info_item}>
                  <div className={styles.castle_info_label}>Questions</div>
                  <div className={styles.castle_info_value}>
                    {selectedCastle.questions_count || 0}
                  </div>
                </div>

                <div className={styles.castle_info_item}>
                  <div className={styles.castle_info_label}>Status</div>
                  <div className={styles.castle_info_value}>
                    {selectedCastle.progress?.completed ? '✅ Complete' : 
                     selectedCastle.progress?.unlocked ? '🔓 Unlocked' : '🔒 Locked'}
                  </div>
                </div>

                <div className={styles.castle_info_item}>
                  <div className={styles.castle_info_label}>Order</div>
                  <div className={styles.castle_info_value}>
                    {selectedCastle.order}
                  </div>
                </div>
              </div>

              {selectedCastle.progress?.unlocked && (
                <>
                  <div className={styles.progress_section}>
                    <div className={styles.progress_label}>
                      Progress: {selectedCastle.progress.questions_answered || 0} / {selectedCastle.questions_count || 0}
                    </div>
                    <div className={styles.progress_bar}>
                      <div 
                        className={styles.progress_fill}
                        style={{
                          width: `${((selectedCastle.progress.questions_answered || 0) / (selectedCastle.questions_count || 1)) * 100}%`
                        }}
                      />
                    </div>
                    <p className={styles.progress_text}>
                      {Math.round(((selectedCastle.progress.questions_answered || 0) / (selectedCastle.questions_count || 1)) * 100)}% Complete
                    </p>
                  </div>

                  <button
                    className={styles.enter_button}
                    onClick={() => handleEnterCastle(selectedCastle)}
                    disabled={!selectedCastle.progress?.unlocked}
                  >
                    {selectedCastle.progress?.completed ? 'Revisit Castle' : 'Enter Castle'}
                  </button>
                </>
              )}

              {!selectedCastle.progress?.unlocked && (
                <button
                  className={styles.enter_button}
                  disabled
                >
                  🔒 Complete Previous Castles to Unlock
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}