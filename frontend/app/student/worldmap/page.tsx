"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';
import styles from '@/styles/world-map.module.css';

// --- INTERFACE & DATA ---

interface Castle {
  id: string;
  name: string;
  region: string;
  description: string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard';
  problems: number;
  xp: number;
  position: { x: number; y: number }; // Note: Position data is not used by the carousel
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
  // Note: The 6th castle from your original array is included in the rotation
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

// --- CASTLE MARKER SUB-COMPONENT ---

interface CastleMarkerProps {
  castle: Castle;
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
  const markerClasses = [
    styles.castle_marker,
    type === 'current' ? styles.current_castle : styles.side_castle,
    castle.unlocked ? styles.unlocked : styles.locked,
    castle.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
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
          className={`${styles.castle_image} ${
            !castle.unlocked ? styles.locked_filter : ''
          }`}
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

// --- MAIN PAGE COMPONENT ---

export default function WorldMapPage() {
  const { appLoading, authLoading, isLoggedIn } = useAuthStore();
  const [selectedCastle, setSelectedCastle] = useState<Castle | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<Castle | null>(null);
  const [currentCastleIndex, setCurrentCastleIndex] = useState(0); // Carousel state
  const router = useRouter();

  // Carousel navigation functions
  const goNext = useCallback(() => {
    setCurrentCastleIndex(
      (prevIndex) => (prevIndex + 1) % CASTLES.length
    );
    setSelectedCastle(null); // Close panel on navigation
  }, []);

  const goPrev = useCallback(() => {
    setCurrentCastleIndex(
      (prevIndex) => (prevIndex - 1 + CASTLES.length) % CASTLES.length
    );
    setSelectedCastle(null); // Close panel on navigation
  }, []);

  // Keyboard navigation
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

  // Loading state
  if (authLoading || appLoading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading Ancient Map...</p>
      </div>
    );
  }

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className={styles.error_container}>
        <h2>Access Denied</h2>
        <p>Please log in to access the World Map.</p>
      </div>
    );
  }

  // Event Handlers
  const handleCastleClick = (castle: Castle) => {
    if (!castle.unlocked) return;
    
    // If clicking a side castle, navigate to it
    if (CASTLES[currentCastleIndex].id !== castle.id) {
        const newIndex = CASTLES.findIndex(c => c.id === castle.id);
        if (newIndex !== -1) {
            setCurrentCastleIndex(newIndex);
            setSelectedCastle(null);
        }
    } else {
        // If clicking the center castle, open its panel
        setSelectedCastle(castle);
    }
  };

  const handleEnterCastle = (castle: Castle) => {
    if (!castle.unlocked) return;
    router.push(castle.route);
  };

  // Helper function
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

  // --- Calculate castles for carousel display ---
  const prevIndex = (currentCastleIndex - 1 + CASTLES.length) % CASTLES.length;
  const nextIndex = (currentCastleIndex + 1) % CASTLES.length;

  const castlesToDisplay = [
    { castle: CASTLES[prevIndex], type: 'prev' as const },
    { castle: CASTLES[currentCastleIndex], type: 'current' as const },
    { castle: CASTLES[nextIndex], type: 'next' as const },
  ];

  return (
    // New outer container for the "behind" background
    <div className={styles.world_map_page_container}>
      
      {/* This is the main map container with rounded borders */}
      <div className={styles.world_map_container}>
        
        {/* Background Image Div */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundImage: 'url("/images/world-map-bg.svg")',
            backgroundSize: 'cover', // Use 'cover' for a better fit
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
          }}
        />

        {/* New Carousel Wrapper */}
        <div className={styles.carousel_wrapper}>
          <button
            className={`${styles.carousel_arrow} ${styles.arrow_left}`}
            onClick={goPrev}
            aria-label="Previous castle"
          >
            ‹
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
              />
            ))}
          </div>

          <button
            className={`${styles.carousel_arrow} ${styles.arrow_right}`}
            onClick={goNext}
            aria-label="Next castle"
          >
            ›
          </button>
        </div>

        {/* Castle Details Panel (remains the same) */}
        {selectedCastle && (
          <div className={styles.castle_details_panel}>
            <div className={styles.panel_header}>
              <div className={styles.heraldic_banner}>
                <h2>{selectedCastle.name}</h2>
                <button
                  className={styles.close_button}
                  onClick={() => setSelectedCastle(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={styles.panel_content}>
              <div className={styles.castle_preview}>
                <img
                  src={`/images/${selectedCastle.imageNumber}.png`}
                  alt={selectedCastle.name}
                  width={150}
                  height={150}
                  className={styles.preview_image}
                  draggable={false}
                />
              </div>

              <div className={styles.castle_info_section}>
                <div className={styles.region_banner}>
                  <span>🏛️ {selectedCastle.region}</span>
                </div>

                <div
                  className={styles.difficulty_badge}
                  style={{
                    backgroundColor: getDifficultyColor(
                      selectedCastle.difficulty
                    ),
                  }}
                >
                  {selectedCastle.difficulty}
                </div>

                <p className={styles.castle_description}>
                  {selectedCastle.description}
                </p>

                <div className={styles.quest_stats}>
                  <div className={styles.stat_item}>
                    <span className={styles.stat_label}>Trials:</span>
                    <span className={styles.stat_value}>
                      {selectedCastle.problems}
                    </span>
                  </div>
                  <div className={styles.stat_item}>
                    <span className={styles.stat_label}>Glory Points:</span>
                    <span className={styles.stat_value}>
                      {selectedCastle.xp}
                    </span>
                  </div>
                  <div className={styles.stat_item}>
                    <span className={styles.stat_label}>Status:</span>
                    <span className={styles.stat_value}>
                      {selectedCastle.completed ? '⚔️ Conquered' : '🗡️ Awaiting'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.action_buttons}>
                <button
                  className={styles.enter_quest_button}
                  onClick={() => handleEnterCastle(selectedCastle)}
                >
                  <span className={styles.button_text}>
                    {selectedCastle.completed
                      ? '🏰 Return to Castle'
                      : '⚔️ Begin Quest'}
                  </span>
                </button>

                <button className={styles.scout_button}>
                  <span className={styles.button_text}>🔍 Scout Ahead</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}