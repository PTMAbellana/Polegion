"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/world-map.module.css';

const DIALOGUE = [
  {
    text: "In ages past, the realm of Geometry stood as a bastion of perfect order, where every point, line, and shape existed in harmonious equilibrium.",
    audioSrc: "/audio/narration/intro/intro_1_prologue.mp3",
    animation: styles.intro_anim_fadeIn,
  },
  {
    text: "However, the Five Great Castles of Knowledge began to fade, their luminance diminishing as the fundamental understanding of shapes and measures slipped into obscurity.",
    audioSrc: "/audio/narration/intro/intro_2_conflict.mp3",
    animation: styles.intro_anim_pulseDarkness,
  },
  {
    text: "Deprived of their wisdom, the world descended into chaos. Patterns dissolved, lines fractured, and the very foundation of geometric harmony began to crumble.",
    audioSrc: "/audio/narration/intro/intro_3_consequence.mp3",
    animation: styles.intro_anim_vignette,
  },
  {
    text: "Yet within this darkness, hope persists. A new scholar has emerged, one possessing the intellect required to restore equilibrium to this fractured realm.",
    audioSrc: "/audio/narration/intro/intro_4_hope.mp3",
    animation: styles.intro_anim_glow,
  },
  {
    text: "You have been chosen to undertake a journey through the Five Realms of Geometry. Each castle safeguards essential knowledge of form, pattern, and dimensional understanding.",
    audioSrc: "/audio/narration/intro/intro_5_chosen.mp3",
    animation: styles.intro_anim_spotlight,
  },
  {
    text: "Through study, creation, and mastery of each challenge, you will illuminate the path forward. With every triumph, another fragment of this world's brilliance shall be restored.",
    audioSrc: "/audio/narration/intro/intro_6_mission.mp3",
    animation: styles.intro_anim_focusMap,
  },
  {
    text: "Step forward, scholar, and commence your journey into the realm of geometric mastery.",
    audioSrc: "/audio/narration/intro/intro_7_begin.mp3",
    animation: null, // No animation for last line
  },
];

interface WorldMapIntroProps {
  onIntroComplete: () => void;
}

export default function WorldMapIntro({ onIntroComplete }: WorldMapIntroProps) {
  // Load saved progress from localStorage
  const getInitialProgress = () => {
    try {
      const saved = localStorage.getItem('worldMapIntro_progress');
      return saved ? JSON.parse(saved) : { currentLine: 0, hasStarted: false };
    } catch {
      return { currentLine: 0, hasStarted: false };
    }
  };

  const [currentLineIndex, setCurrentLineIndex] = useState(getInitialProgress().currentLine);
  const [displayText, setDisplayText] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(styles.intro_anim_fadeIn);
  const [showLogo, setShowLogo] = useState(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialized = useRef(false);

  // Save progress to localStorage whenever line changes
  useEffect(() => {
    localStorage.setItem('worldMapIntro_progress', JSON.stringify({ 
      currentLine: currentLineIndex, 
      hasStarted: true 
    }));
  }, [currentLineIndex]);

  const playLine = (index: number) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    const animation = DIALOGUE[index].animation;
    if (animation) {
      setCurrentAnimation(animation);
    }
    setDisplayText('');

    const audio = audioRefs.current[index];
    
    // Stop previous audio before playing new one
    if (currentAudioRef.current && currentAudioRef.current !== audio) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    currentAudioRef.current = audio;

    if (audio) {
      audio.currentTime = 0;
      // Use a promise to handle play() properly
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Audio play failed:", e);
          console.log("Attempting to play:", DIALOGUE[index].audioSrc);
        });
      }
    }

    const line = DIALOGUE[index].text;
    let charIndex = 0;

    typingIntervalRef.current = setInterval(() => {
      if (charIndex < line.length) {
        setDisplayText(line.substring(0, charIndex + 1));
        charIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      }
    }, 40);
  };

  const stopAllAudio = () => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        // Check if audio is actually playing before pausing
        if (!audio.paused) {
          audio.pause();
        }
        audio.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    // Only initialize once to prevent audio interruption
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    audioRefs.current = DIALOGUE.map((line) => {
      const audio = new Audio(line.audioSrc);
      audio.preload = 'auto';
      audio.addEventListener('error', (e) => {
        console.error(`Failed to load audio: ${line.audioSrc}`, e);
      });
      return audio;
    });

    // Small delay to ensure audio elements are ready
    const initialLine = getInitialProgress().currentLine;
    setTimeout(() => {
      playLine(initialLine);
    }, 100);

    return () => {
      console.log('[WorldMapIntro] Cleaning up audio and timers');
      stopAllAudio();
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      // Clear audio references
      audioRefs.current = [];
      currentAudioRef.current = null;
      isInitialized.current = false;
    };
  }, []);

  const handleNext = () => {
    if (currentLineIndex < DIALOGUE.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
      playLine(currentLineIndex + 1);
    } else {
      // Last line, show logo then complete
      setShowLogo(true);
      localStorage.removeItem('worldMapIntro_progress');
      setTimeout(() => {
        setCurrentAnimation(styles.intro_anim_fadeOutAll);
        setTimeout(() => {
          onIntroComplete();
        }, 2000);
      }, 3000);
    }
  };

  const handleSkip = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    stopAllAudio();
    localStorage.removeItem('worldMapIntro_progress');
    onIntroComplete();
  };

  return (
    <div className={`${styles.intro_overlay} ${currentAnimation}`}>
      <div className={styles.intro_vignette}></div>
      <div className={styles.intro_glow}></div>
      
      {!showLogo ? (
        <>
          <div className={styles.intro_flourish_top}></div>
          <div className={styles.intro_flourish_bottom}></div>
          
          <div className={styles.intro_content}>
            <div className={styles.intro_scroll_container}>
              <div className={styles.intro_scroll_edge_left}></div>
              <div className={styles.intro_scroll_edge_right}></div>
              
              <p className={styles.intro_text}>
                {displayText}
              </p>
            </div>
            
            <div className={styles.intro_progress}>
              {DIALOGUE.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.progress_dot} ${
                    index === currentLineIndex ? styles.active : ''
                  } ${index < currentLineIndex ? styles.completed : ''}`}
                >
                </span>
              ))}
            </div>
            
            <div className={styles.intro_warning_text}>
              Please complete the introduction in one session. Navigating away will restart the sequence.
            </div>
            
            <button onClick={handleNext} className={styles.intro_next_button}>
              {currentLineIndex < DIALOGUE.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </>
      ) : (
        <div className={styles.intro_logo_container}>
          <img 
            src="/images/world-map-logo.webp" 
            alt="Polegion Logo" 
            className={styles.intro_logo}
          />
        </div>
      )}
      
      <button onClick={handleSkip} className={styles.intro_skip_button}>
        Skip Introduction
      </button>
    </div>
  );
}