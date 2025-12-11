'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/global-landscape.module.css';

const GlobalLandscapePrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Show prompt only on mobile devices in portrait mode
      const isMobile = window.innerWidth <= 900;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowPrompt(isMobile && isPortrait);
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!showPrompt) return null;

  return (
    <div className={styles.landscapeOverlay}>
      <div className={styles.landscapeContent}>
        <div className={styles.phoneIcon}>
          <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <div className={styles.rotateIcon}>⟲</div>
        </div>
        
        <h1 className={styles.title}>Rotate Your Device</h1>
        
        <p className={styles.message}>
          Polegion is best experienced in <strong>landscape mode</strong>
        </p>
        
        <div className={styles.instructions}>
          <p>Turn your phone sideways</p>
          <p>Rotate to landscape orientation</p>
          <p>Enjoy the full experience</p>
        </div>
        
        <div className={styles.hint}>
          This app requires landscape orientation for optimal gameplay and visualization
        </div>
      </div>
    </div>
  );
};

export default GlobalLandscapePrompt;
