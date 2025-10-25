"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';
import styles from '@/styles/world-map.module.css';
import Image from 'next/image';

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
  imageNumber: number; // Added for castle image mapping
}

const CASTLES: Castle[] = [
  {
    id: 'euclidean-tower',
    name: 'Euclidean Spire',
    region: 'Northern Peaks',
    description: 'Ancient tower where geometry was first discovered',
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
    region: 'Eastern Woodlands',
    description: 'Fortress of many-sided mysteries',
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
    description: 'Coastal fortress guarding curved secrets',
    difficulty: 'Intermediate',
    problems: 18,
    xp: 300,
    position: { x: 20, y: 25 }, // Moved higher - was y: 45, now y: 25 (above wizard)
    unlocked: true,
    completed: false,
    terrain: 'coastal',
    route: '/student/worldmap/castle3',
    imageNumber: 3
  },
  {
    id: 'triangle-stronghold',
    name: 'Pyramid Stronghold',
    region: 'Desert Reaches',
    description: 'Ancient pyramid containing triangular wisdom',
    difficulty: 'Intermediate',
    problems: 20,
    xp: 350,
    position: { x: 45, y: 70 },
    unlocked: false,
    completed: false,
    terrain: 'desert',
    route: '/student/worldmap/castle4',
    imageNumber: 4
  },
  {
    id: 'fractal-fortress',
    name: 'Fractal Bastion',
    region: 'Misty Highlands',
    description: 'Mystical castle of infinite patterns',
    difficulty: 'Hard',
    problems: 25,
    xp: 500,
    position: { x: 55, y: 35 }, // Moved lower - was y: 25, now y: 35 (below title)
    unlocked: false,
    completed: false,
    terrain: 'highland',
    route: '/student/worldmap/castle5',
    imageNumber: 5
  },
  {
    id: 'dimensional-domain',
    name: 'Arcane Observatory',
    region: 'Celestial Heights',
    description: 'Tower reaching into dimensional realms',
    difficulty: 'Hard',
    problems: 30,
    xp: 600,
    position: { x: 65, y: 60 }, // Moved lower - was y: 50, now y: 60 (adjusted down with Fractal Bastion)
    unlocked: false,
    completed: false,
    terrain: 'mystical',
    route: '/student/worldmap/castle6',
    imageNumber: 6
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

export default function WorldMapPage() {
  const { appLoading, authLoading, isLoggedIn } = useAuthStore();
  const [selectedCastle, setSelectedCastle] = useState<Castle | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<Castle | null>(null);
  const [showWizardDialogue, setShowWizardDialogue] = useState(true);
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerDeltaXRef = useRef<number>(0);
  const router = useRouter();

  // One castle per world/slide
  const WORLDS: Castle[][] = CASTLES.map((c) => [c]);

  const goToWorld = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(WORLDS.length - 1, index));
    setCurrentWorldIndex(nextIndex);
    setSelectedCastle(null);
  }, [WORLDS.length]);

  const goPrev = useCallback(() => goToWorld(currentWorldIndex - 1), [goToWorld, currentWorldIndex]);
  const goNext = useCallback(() => goToWorld(currentWorldIndex + 1), [goToWorld, currentWorldIndex]);

  // Auto-hide wizard dialogue after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWizardDialogue(false);
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
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
    setSelectedCastle(castle);
  };

  const handleEnterCastle = (castle: Castle) => {
    if (!castle.unlocked) return;
    router.push(castle.route);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartXRef.current = e.clientX;
    pointerDeltaXRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartXRef.current == null) return;
    pointerDeltaXRef.current = e.clientX - pointerStartXRef.current;
  };

  const onPointerUp = () => {
    const delta = pointerDeltaXRef.current;
    pointerStartXRef.current = null;
    pointerDeltaXRef.current = 0;
    const threshold = 60; // px
    if (delta > threshold) {
      goPrev();
    } else if (delta < -threshold) {
      goNext();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#228B22';
      case 'Intermediate': return '#DAA520'; 
      case 'Hard': return '#8B0000';
      default: return '#8B4513';
    }
  };

  return (
    <div className={styles.world_map_container}>
      {/* Wizard Character */}
      <div className={styles.wizard_character}>
        <Image
          src="/images/wizard.png"
          alt="Royal Cartographer"
          width={250}
          height={375}
          className={styles.wizard_image}
        />
        {showWizardDialogue && (
          <div className={styles.wizard_speech_bubble}>
            <button 
              className={styles.wizard_close_button}
              onClick={() => setShowWizardDialogue(false)}
            >
              ✕
            </button>
            <p>Welcome to Polegion, brave mathematician! Choose your quest wisely.</p>
          </div>
        )}
      </div>

      {/* Main Map Container */}
      <div
        className={styles.main_map_container}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={styles.carousel_track}
          style={{ transform: `translateX(-${currentWorldIndex * 100}vw)` }}
        >
          {WORLDS.map((worldCastles, idx) => (
            <div key={idx} className={`${styles.carousel_slide} ${idx === currentWorldIndex ? styles.active_slide : ''}`}>
              {/* World Map Background */}
              <div className={styles.world_map_background}>
                <Image
                  src="/images/world-map.png"
                  alt="World Map of Polegion"
                  fill
                  className={styles.map_background_image}
                  priority={idx === 0}
                />
              </div>

              {/* Map Title Scroll */}
              <div className={styles.map_title_scroll}>
                <h1>Polegion</h1>
                <p>The Sacred Lands of Mathematics</p>
              </div>

              {/* Single centered Castle */}
              {worldCastles.map((castle) => (
                <div key={castle.id} className={styles.castle_center_wrapper}>
                  <div
                    className={`${styles.castle_marker} ${styles.centered_marker} ${
                      castle.unlocked ? styles.unlocked : styles.locked
                    } ${castle.completed ? styles.completed : ''} ${
                      selectedCastle?.id === castle.id ? styles.selected : ''
                    } ${hoveredCastle?.id === castle.id ? styles.hovered : ''}`}
                    onClick={() => handleCastleClick(castle)}
                    onMouseEnter={() => setHoveredCastle(castle)}
                    onMouseLeave={() => setHoveredCastle(null)}
                  >
                    {/* Castle Image */}
                    <div className={`${styles.castle_image_container} ${styles.castle_large}`}>
                      <Image
                        src={`/images/${castle.imageNumber}.png`}
                        alt={castle.name}
                        width={220}
                        height={220}
                        className={`${styles.castle_image} ${
                          !castle.unlocked ? styles.locked_filter : ''
                        }`}
                      />
                      
                      {/* Castle Status Overlays */}
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

                    {/* Castle Name Label */}
                    <div className={styles.castle_nameplate}>
                      <div className={styles.nameplate_scroll}>
                        {castle.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slide Progress Indicator */}
              <div className={styles.progress_indicator}>
                <div className={styles.progress_scroll}>
                  <h3>Quest Progress</h3>
                  <div className={styles.progress_stats}>
                    <span>🏆 Conquered: {CASTLES.filter(c => c.completed).length}/{CASTLES.length}</span>
                    <span>⚔️ Available: {CASTLES.filter(c => c.unlocked && !c.completed).length}</span>
                    <span>🔒 Sealed: {CASTLES.filter(c => !c.unlocked).length}</span>
                  </div>
                  <div className={styles.progress_bar}>
                    <div 
                      className={styles.progress_fill}
                      style={{ width: `${(CASTLES.filter(c => c.completed).length / CASTLES.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Compass Rose */}
              <div className={styles.compass_rose}>
                <div className={styles.compass_inner}>
                  <div className={styles.compass_needle}>N</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className={styles.carousel_nav_left}
          onClick={goPrev}
          disabled={currentWorldIndex === 0}
          aria-label="Previous world"
        >
          ‹
        </button>
        <button
          className={styles.carousel_nav_right}
          onClick={goNext}
          disabled={currentWorldIndex === WORLDS.length - 1}
          aria-label="Next world"
        >
          ›
        </button>

        {/* Dots */}
        <div className={styles.carousel_dots}>
          {WORLDS.map((_, i) => (
            <button
              key={i}
              className={`${styles.carousel_dot} ${i === currentWorldIndex ? styles.active : ''}`}
              onClick={() => goToWorld(i)}
              aria-label={`Go to world ${i + 1}`}
            />
          ))}
        </div>

        {/* Castle Details Panel */}
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
              {/* Castle Preview */}
              <div className={styles.castle_preview}>
                <Image
                  src={`/images/${selectedCastle.imageNumber}.png`}
                  alt={selectedCastle.name}
                  width={150}
                  height={150}
                  className={styles.preview_image}
                />
              </div>
              
              {/* Castle Information */}
              <div className={styles.castle_info_section}>
                <div className={styles.region_banner}>
                  <span>🏛️ {selectedCastle.region}</span>
                </div>
                
                <div 
                  className={styles.difficulty_badge}
                  style={{ backgroundColor: getDifficultyColor(selectedCastle.difficulty) }}
                >
                  {selectedCastle.difficulty}
                </div>
                
                <p className={styles.castle_description}>
                  {selectedCastle.description}
                </p>
                
                <div className={styles.quest_stats}>
                  <div className={styles.stat_item}>
                    <span className={styles.stat_label}>Trials:</span>
                    <span className={styles.stat_value}>{selectedCastle.problems}</span>
                  </div>
                  <div className={styles.stat_item}>
                    <span className={styles.stat_label}>Glory Points:</span>
                    <span className={styles.stat_value}>{selectedCastle.xp}</span>
                  </div>
                  <div className={styles.stat_item}>
                    <span className={styles.stat_label}>Status:</span>
                    <span className={styles.stat_value}>
                      {selectedCastle.completed ? '⚔️ Conquered' : '🗡️ Awaiting'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className={styles.action_buttons}>
                <button 
                  className={styles.enter_quest_button}
                  onClick={() => handleEnterCastle(selectedCastle)}
                >
                  <span className={styles.button_text}>
                    {selectedCastle.completed ? '🏰 Return to Castle' : '⚔️ Begin Quest'}
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