"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyApp } from '@/context/AppUtils';
import Loader from '@/components/Loader';
import styles from '@/styles/world-map.module.css';

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
  route: string; // Added route property
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
    route: '/world-map/castle1' // Route to castle1
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
    route: '/world-map/castle2' // Route to castle2
  },
  {
    id: 'circle-keep',
    name: 'Circle Sanctuary',
    region: 'Golden Shores',
    description: 'Coastal fortress guarding curved secrets',
    difficulty: 'Intermediate',
    problems: 18,
    xp: 300,
    position: { x: 20, y: 45 },
    unlocked: true,
    completed: false,
    terrain: 'coastal',
    route: '/world-map/castle3' // Route to castle3
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
    route: '/world-map/castle4' // Route to castle4
  },
  {
    id: 'fractal-fortress',
    name: 'Fractal Bastion',
    region: 'Misty Highlands',
    description: 'Mystical castle of infinite patterns',
    difficulty: 'Hard',
    problems: 25,
    xp: 500,
    position: { x: 55, y: 25 },
    unlocked: false,
    completed: false,
    terrain: 'highland',
    route: '/world-map/castle5' // Route to castle5
  },
  {
    id: 'dimensional-domain',
    name: 'Arcane Observatory',
    region: 'Celestial Heights',
    description: 'Tower reaching into dimensional realms',
    difficulty: 'Hard',
    problems: 30,
    xp: 600,
    position: { x: 65, y: 50 },
    unlocked: false,
    completed: false,
    terrain: 'mystical',
    route: '/world-map/castle6' // Route to castle6
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
    route: '/world-map/castle7' // Route to castle7
  }
];

export default function WorldMapPage() {
  const { isLoggedIn, authLoading, userProfile } = useMyApp();
  const [selectedCastle, setSelectedCastle] = useState<Castle | null>(null);
  const [hoveredCastle, setHoveredCastle] = useState<Castle | null>(null);
  const router = useRouter();

  if (authLoading) {
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
    // Navigate to the specific castle route
    router.push(castle.route);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#228B22';
      case 'Intermediate': return '#DAA520'; 
      case 'Hard': return '#8B0000';
      default: return '#8B4513';
    }
  };

  const getCastleIcon = (castle: Castle) => {
    if (castle.completed) return '👑';
    if (!castle.unlocked) return '🔒';
    
    switch (castle.terrain) {
      case 'mountain': return '🏔️';
      case 'forest': return '🌲';
      case 'desert': return '🏜️';
      case 'coastal': return '🏖️';
      case 'highland': return '⛰️';
      case 'mystical': return '✨';
      default: return '🏰';
    }
  };

  return (
    <div className={styles.world_map_container}>
      <header className={styles.header}>
        <h1 className={styles.title}>⚔️ Realm of Geometry ⚔️</h1>
        <p className={styles.subtitle}>
          Embark upon an epic quest through mathematical kingdoms, brave {userProfile?.fullName}!
        </p>
        <div className={styles.progress_scroll}>
          <div className={styles.scroll_text}>
            🏆 Quest Progress: {CASTLES.filter(c => c.completed).length}/{CASTLES.length} Realms Conquered
          </div>
          <div className={styles.progress_bar_medieval}>
            <div 
              className={styles.progress_fill_medieval} 
              style={{ width: `${(CASTLES.filter(c => c.completed).length / CASTLES.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className={styles.main_content}>
        <div className={styles.map_container}>
          {/* Fantasy Medieval Map */}
          <div className={styles.fantasy_map}>
            {/* Parchment background with aging effects */}
            <div className={styles.parchment_overlay} />
            
            {/* Terrain Features */}
            <div className={styles.mountain_range} style={{ left: '70%', top: '10%' }} />
            <div className={styles.mountain_range_2} style={{ left: '50%', top: '20%' }} />
            <div className={styles.forest_area} style={{ left: '80%', top: '30%' }} />
            <div className={styles.forest_area_2} style={{ left: '15%', top: '60%' }} />
            <div className={styles.desert_dunes} style={{ left: '40%', top: '65%' }} />
            <div className={styles.coastal_area} style={{ left: '10%', top: '40%' }} />
            
            {/* Rivers and Roads */}
            <div className={styles.ancient_river} />
            <div className={styles.kingdom_road} />
            
            {/* Decorative compass */}
            <div className={styles.compass_rose}>
              <div className={styles.compass_inner}>
                <div className={styles.compass_point}>N</div>
              </div>
            </div>
            
            {/* Map title cartouche */}
            <div className={styles.map_cartouche}>
              <h3>GEOMETRIA</h3>
              <p>The Sacred Lands</p>
            </div>
            
            {/* Castle Markers with Realistic Medieval Style */}
            {CASTLES.map((castle) => (
              <div
                key={castle.id}
                className={`${styles.medieval_castle} ${
                  castle.unlocked ? styles.unlocked : styles.locked
                } ${castle.completed ? styles.conquered : ''} ${
                  selectedCastle?.id === castle.id ? styles.selected : ''
                } ${hoveredCastle?.id === castle.id ? styles.hovered : ''}`}
                style={{
                  left: `${castle.position.x}%`,
                  top: `${castle.position.y}%`,
                }}
                onClick={() => handleCastleClick(castle)}
                onMouseEnter={() => setHoveredCastle(castle)}
                onMouseLeave={() => setHoveredCastle(null)}
                title={castle.unlocked ? castle.name : '🔒 Sealed by Ancient Magic'}
              >
                <div className={`${styles.castle_structure} ${styles[castle.terrain]}`}>
                  <div className={styles.castle_towers}>
                    <div className={styles.main_keep} />
                    <div className={styles.tower_left} />
                    <div className={styles.tower_right} />
                  </div>
                  <div className={styles.castle_walls} />
                  <div className={styles.castle_gate} />
                  
                  {castle.completed && <div className={styles.victory_banner} />}
                  {!castle.unlocked && <div className={styles.magic_seal} />}
                  {castle.unlocked && !castle.completed && <div className={styles.entrance_glow} />}
                </div>
                
                <div className={styles.medieval_nameplate}>
                  <div className={styles.nameplate_scroll}>
                    {castle.name}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Ancient Paths connecting castles */}
            <svg className={styles.ancient_paths} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <filter id="aged-path" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence baseFrequency="0.3" numOctaves="4" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
              </defs>
              
              {/* Connecting roads between castles */}
              <path 
                d="M 75 15 Q 80 25 85 35" 
                stroke="#8B4513" 
                strokeWidth="0.5" 
                fill="none"
                strokeDasharray="2,1"
                filter="url(#aged-path)"
                className={styles.royal_road}
              />
              <path 
                d="M 85 35 Q 75 40 65 50" 
                stroke="#8B4513" 
                strokeWidth="0.5" 
                fill="none"
                strokeDasharray="2,1"
                filter="url(#aged-path)"
                className={styles.royal_road}
              />
              <path 
                d="M 20 45 Q 30 50 35 55" 
                stroke="#654321" 
                strokeWidth="0.3" 
                fill="none"
                strokeDasharray="1,1"
                opacity="0.7"
              />
            </svg>
          </div>

          {/* Medieval Castle Details Panel */}
          {selectedCastle && (
            <div className={styles.medieval_details_panel}>
              <div className={styles.panel_header}>
                <div className={styles.heraldic_border}>
                  <h2>{selectedCastle.name}</h2>
                  <button 
                    className={styles.close_seal}
                    onClick={() => setSelectedCastle(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className={styles.panel_content}>
                <div className={styles.castle_heraldry}>
                  <div className={styles.coat_of_arms}>
                    <div className={styles.shield}>
                      {getCastleIcon(selectedCastle)}
                    </div>
                  </div>
                  
                  <div className={styles.castle_info}>
                    <span className={styles.realm_name}>🏛️ {selectedCastle.region}</span>
                    <span 
                      className={styles.difficulty_banner}
                      style={{ backgroundColor: getDifficultyColor(selectedCastle.difficulty) }}
                    >
                      {selectedCastle.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className={styles.quest_description}>
                  <p>{selectedCastle.description}</p>
                </div>
                
                <div className={styles.quest_statistics}>
                  <div className={styles.stat_scroll}>
                    <span className={styles.stat_title}>Trials</span>
                    <span className={styles.stat_number}>{selectedCastle.problems}</span>
                  </div>
                  <div className={styles.stat_scroll}>
                    <span className={styles.stat_title}>Glory Points</span>
                    <span className={styles.stat_number}>{selectedCastle.xp}</span>
                  </div>
                  <div className={styles.stat_scroll}>
                    <span className={styles.stat_title}>Status</span>
                    <span className={styles.stat_number}>
                      {selectedCastle.completed ? '⚔️ Conquered' : '🗡️ Awaiting'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.quest_actions}>
                  <button 
                    className={styles.enter_castle_btn}
                    onClick={() => handleEnterCastle(selectedCastle)}
                  >
                    <span className={styles.btn_text}>
                      {selectedCastle.completed ? '🏰 Return to Castle' : '⚔️ Begin Quest'}
                    </span>
                  </button>
                  <button className={styles.scout_btn}>
                    <span className={styles.btn_text}>🔍 Scout Ahead</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Medieval Legend */}
        <div className={styles.ancient_legend}>
          <div className={styles.legend_scroll}>
            <h3>⚜️ Legend of Symbols ⚜️</h3>
            <div className={styles.legend_entries}>
              <div className={styles.legend_entry}>
                <span className={styles.legend_symbol}>🏰</span>
                <span>Available Quest</span>
              </div>
              <div className={styles.legend_entry}>
                <span className={styles.legend_symbol}>👑</span>
                <span>Conquered Realm</span>
              </div>
              <div className={styles.legend_entry}>
                <span className={styles.legend_symbol}>🔒</span>
                <span>Sealed by Magic</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}