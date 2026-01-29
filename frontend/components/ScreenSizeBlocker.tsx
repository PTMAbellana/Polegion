'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/screen-size-blocker.module.css';

const ScreenSizeBlocker: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Check viewport size (too small for app)
      const isSmallViewport = window.innerWidth < 768 || window.innerHeight < 500;
      
      // Block if mobile device OR small viewport
      setShowPrompt(isMobileUA || isSmallViewport);
    };

    // Initial check
    checkIfMobile();

    // Listen for changes
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('orientationchange', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('orientationchange', checkIfMobile);
    };
  }, []);

  if (!showPrompt) return null;

  return (
    <div className={styles.blockerOverlay}>
      <div className={styles.blockerContent}>
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
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Screen Too Small</h1>
        
        <p className={styles.message}>
          Polegion requires a <strong>larger screen</strong>
        </p>
        
        <div className={styles.instructions}>
          <p>Use a desktop or laptop computer</p>
          <p>Or maximize your browser window</p>
        </div>
        
        <div className={styles.hint}>
          Minimum: 768px wide × 500px tall
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeBlocker;
