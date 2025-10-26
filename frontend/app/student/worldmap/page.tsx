"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';
import styles from '@/styles/world-map.module.css';
import WorldMapIntro from '@/components/world/WorldMapIntro';
// import BackgroundEffect from '@/components/world/BackgroundEffect';

interface Castle {
  id: string;
  name: string;
  region: string;
  description: string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard';
  problems: number;
  xp: number;
  position: { x: number; y: number };
  unlocked: boolean;
  completed: boolean;
  terrain: 'mountain' | 'forest' | 'desert' | 'coastal' | 'highland' | 'mystical';
  route: string;
  imageNumber: number;
}

const CASTLES: Castle[] = [
  {
    id: 'euclidean-tower',
    name: 'Euclidean Spire',
    region: 'Northern Peaks',
    description: 'Glowing white tower where geometry was first discovered',
    difficulty: 'Easy',
    problems: 12,
    xp: 150,
    position: { x: 75, y: 15 },
    unlocked: true,
    completed: false,
    terrain: 'mountain',
    route: '/student/worldmap/castle1',
    imageNumber: 1
  },
  {
    id: 'polygon-palace',
    name: 'Polygon Citadel',
    region: 'Eastern Woods',
    description: 'Hidden fortress among the many-sided mysteries of the woods',
    difficulty: 'Easy',
    problems: 15,
    xp: 200,
    position: { x: 85, y: 35 },
    unlocked: true,
    completed: true,
    terrain: 'forest',
    route: '/student/worldmap/castle2',
    imageNumber: 2
  },
  {
    id: 'circle-keep',
    name: 'Circle Sanctuary',
    region: 'Golden Shores',
    description: 'Shining coastal fortress guarding curved secrets',
    difficulty: 'Intermediate',
    problems: 18,
    xp: 300,
    position: { x: 20, y: 25 },
    unlocked: true,
    completed: false,
    terrain: 'coastal',
    route: '/student/worldmap/castle3',
    imageNumber: 3
  },
  {
    id: 'fractal-fortress',
    name: 'Fractal Bastion',
    region: 'Misty Highlands',
    description: 'Floating mystical castle of infinite patterns',
    difficulty: 'Hard',
    problems: 25,
    xp: 500,
    position: { x: 55, y: 35 },
    unlocked: false,
    completed: false,
    terrain: 'highland',
    route: '/student/worldmap/castle4',
    imageNumber: 4
  },
  {
    id: 'dimensional-domain',
    name: 'Arcane Observatory',
    region: 'Celestial Heights',
    description: 'Tower rising above the clouds into dimensional realms',
    difficulty: 'Hard',
    problems: 30,
    xp: 600,
    position: { x: 65, y: 60 },
    unlocked: false,
    completed: false,
    terrain: 'mystical',
    route: '/student/worldmap/castle5',
    imageNumber: 5
  },
  {
    id: 'infinity-keep',
    name: 'Infinity Throne',
    region: 'The Eternal Realm',
    description: 'The legendary seat of geometric mastery',
    difficulty: 'Hard',
    problems: 35,
    xp: 1000,
    position: { x: 35, y: 55 },
    unlocked: false,
    completed: false,
    terrain: 'mystical',
    route: '/student/worldmap/castle7',
    imageNumber: 7
  }
];

interface CastleMarkerProps {
  castle: Castle;
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
  const { appLoading, authLoading, isLoggedIn } = useAuthStore();
  const [selectedCastle, setSelectedCastle] = useState<Castle | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<Castle | null>(null);
  const [currentCastleIndex, setCurrentCastleIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Only check for intro logic *after* loading is done and user is logged in
    if (!authLoading && !appLoading && isLoggedIn) {
      const hasSeenIntro = localStorage.getItem('hasSeenMapIntro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, [authLoading, appLoading, isLoggedIn]); // This dependency array is key

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
    setDirection('right');
    setCurrentCastleIndex((prevIndex) => (prevIndex + 1) % CASTLES.length);
    setSelectedCastle(null);
  }, []);

  const goPrev = useCallback(() => {
    setDirection('left');
    setCurrentCastleIndex((prevIndex) => (prevIndex - 1 + CASTLES.length) % CASTLES.length);
    setSelectedCastle(null);
  }, []);

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

  if (authLoading || appLoading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading Ancient Map...</p>
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

  const handleCastleClick = (castle: Castle) => {
    if (!castle.unlocked) return;
    if (CASTLES[currentCastleIndex].id !== castle.id) {
      const newIndex = CASTLES.findIndex(c => c.id === castle.id);
      if (newIndex !== -1) {
        if (newIndex > currentCastleIndex) {
          setDirection('right');
        } else {
          setDirection('left');
        }
        setCurrentCastleIndex(newIndex);
        setSelectedCastle(null);
      }
    } else {
      setSelectedCastle(castle);
    }
  };

  const handleEnterCastle = (castle: Castle) => {
    if (!castle.unlocked) return;
    router.push(castle.route);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#228B22';
      case 'Intermediate':
        return '#DAA520';
      case 'Hard':
        return '#8B0000';
      default:
        return '#8B4513';
    }
  };

  const prevIndex = (currentCastleIndex - 1 + CASTLES.length) % CASTLES.length;
  const nextIndex = (currentCastleIndex + 1) % CASTLES.length;

  const castlesToDisplay = [
    { castle: CASTLES[prevIndex], type: 'prev' as const },
    { castle: CASTLES[currentCastleIndex], type: 'current' as const },
    { castle: CASTLES[nextIndex], type: 'next' as const },
  ];

  const currentTerrain = CASTLES[currentCastleIndex].terrain;

  return (
    <div className={styles.world_map_page_container}>
      {showIntro && <WorldMapIntro onIntroComplete={handleIntroComplete} />}
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

      {/* <BackgroundEffect terrain={currentTerrain} /> */}

      <div className={styles.carousel_wrapper} style={{ position: 'relative', zIndex: 5 }}>
        <button
          className={`${styles.carousel_arrow} ${styles.arrow_left}`}
          onClick={goPrev}
          aria-label="Previous castle"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {selectedCastle && (
        <div className={styles.castle_details_panel}>
        </div>
      )}
    </div>
  );
}