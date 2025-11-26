'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/background-effects.module.css';

interface Castle {
  terrain: 'mountain' | 'forest' | 'desert' | 'coastal' | 'highland' | 'mystical';
}

interface BackgroundEffectProps {
  terrain: Castle['terrain'];
}

// Helper to create multiple particles
const particles = (count: number) => {
  return Array.from({ length: count }, (_, i) => i);
};

// --- Snow Effect Component (Mountain - Euclidean Spire) ---
const SnowEffect = () => (
  <div className={`${styles.effect_layer} ${styles.active}`}>
    {particles(50).map((i) => (
      <div
        key={i}
        className={styles.snowflake}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
          opacity: 0.3 + Math.random() * 0.7,
          fontSize: `${10 + Math.random() * 20}px`,
        }}
      >
        ❄
      </div>
    ))}
  </div>
);

// --- Leaves Effect Component (Forest - Polygon Citadel) ---
const LeavesEffect = () => (
  <div className={`${styles.effect_layer} ${styles.active}`}>
    {particles(40).map((i) => (
      <div
        key={i}
        className={styles.leaf}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${6 + Math.random() * 4}s`,
          opacity: 0.4 + Math.random() * 0.6,
          fontSize: `${12 + Math.random() * 18}px`,
        }}
      >
        {['•', '•', '•'][Math.floor(Math.random() * 3)]}
      </div>
    ))}
  </div>
);

// --- Bubbles Effect Component (Coastal - Circle Sanctuary) ---
const BubblesEffect = () => (
  <div className={`${styles.effect_layer} ${styles.active}`}>
    {particles(35).map((i) => (
      <div
        key={i}
        className={styles.bubble}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${4 + Math.random() * 3}s`,
          opacity: 0.3 + Math.random() * 0.5,
          fontSize: `${8 + Math.random() * 15}px`,
        }}
      >
        ○
      </div>
    ))}
  </div>
);

// --- Mist Effect Component (Highland - Fractal Bastion) ---
const MistEffect = () => (
  <div className={`${styles.effect_layer} ${styles.active}`}>
    {particles(25).map((i) => (
      <div
        key={i}
        className={styles.mist}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${8 + Math.random() * 4}s`,
          opacity: 0.2 + Math.random() * 0.3,
          width: `${50 + Math.random() * 100}px`,
          height: `${30 + Math.random() * 50}px`,
        }}
      />
    ))}
  </div>
);

// --- Stars Effect Component (Mystical - Arcane Observatory) ---
const StarsEffect = () => (
  <div className={`${styles.effect_layer} ${styles.active}`}>
    {particles(30).map((i) => (
      <div
        key={i}
        className={styles.star}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }}
      >
        ✨
      </div>
    ))}
  </div>
);

// --- Main Background Effect Component ---
export default function BackgroundEffect({ terrain }: BackgroundEffectProps) {
  const [currentTerrain, setCurrentTerrain] = useState(terrain);

  useEffect(() => {
    setCurrentTerrain(terrain);
  }, [terrain]);

  return (
    <div className={styles.effects_wrapper}>
      {currentTerrain === 'mountain' && <SnowEffect />}
      {currentTerrain === 'forest' && <LeavesEffect />}
      {currentTerrain === 'coastal' && <BubblesEffect />}
      {currentTerrain === 'highland' && <MistEffect />}
      {currentTerrain === 'mystical' && <StarsEffect />}
    </div>
  );
}