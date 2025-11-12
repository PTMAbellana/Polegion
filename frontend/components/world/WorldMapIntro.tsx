"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/world-map.module.css';

const DIALOGUE = [
  {
    text: "Long ago, the world of Geometry was a realm of perfect balance where every point, line, and shape lived in harmony.",
    audioSrc: "/audio/narration/intro/intro_1_prologue.mp3",
    animation: styles.intro_anim_fadeIn,
  },
  {
    text: "But one day, the Five Great Castles of Knowledge dimmed… their lights fading as the understanding of shapes and measures was forgotten.",
    audioSrc: "/audio/narration/intro/intro_2_conflict.mp3",
    animation: styles.intro_anim_pulseDarkness,
  },
  {
    text: "Without their wisdom, the world lost its form, patterns unraveled, lines broke, and the very harmony of learning began to fade.",
    audioSrc: "/audio/narration/intro/intro_3_consequence.mp3",
    animation: styles.intro_anim_vignette,
  },
  {
    text: "Yet hope remains. A new traveler has arrived… one with a mind bright enough to restore the balance.",
    audioSrc: "/audio/narration/intro/intro_4_hope.mp3",
    animation: styles.intro_anim_glow,
  },
  {
    text: "You, young scholar, are chosen to embark on a journey through the Five Realms of Geometry, each castle guarding secrets of form, pattern, and dimension.",
    audioSrc: "/audio/narration/intro/intro_5_chosen.mp3",
    animation: styles.intro_anim_spotlight,
  },
  {
    text: "You will learn, create, and conquer each fortress through wisdom and curiosity. And with every challenge you overcome, you'll restore another piece of this world's light.",
    audioSrc: "/audio/narration/intro/intro_6_mission.mp3",
    animation: styles.intro_anim_focusMap,
  },
  {
    text: "Step forward… and let the learning begin.",
    audioSrc: "/audio/narration/intro/intro_7_begin.mp3",
    animation: null, // No animation for last line
  },
];

interface WorldMapIntroProps {
  onIntroComplete: () => void;
}

export default function WorldMapIntro({ onIntroComplete }: WorldMapIntroProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(styles.intro_anim_fadeIn);
  const [showLogo, setShowLogo] = useState(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRefs.current = DIALOGUE.map((line) => {
      const audio = new Audio(line.audioSrc);
      audio.preload = 'auto';
      audio.addEventListener('error', (e) => {
        console.error(`Failed to load audio: ${line.audioSrc}`, e);
      });
      return audio;
    });

    audioRefs.current.forEach((audio, index) => {
      if (audio) {
        audio.onended = () => {
          if (index < DIALOGUE.length - 1) {
            setCurrentLineIndex(index + 1);
          } else {
            // Last audio finished, show logo
            setShowLogo(true);
            // Wait for logo display (3 seconds) then fade out and complete
            setTimeout(() => {
              setCurrentAnimation(styles.intro_anim_fadeOutAll);
              setTimeout(() => {
                onIntroComplete();
              }, 2000); // Wait for fade out animation
            }, 3000); // Show logo for 3 seconds
          }
        };
      }
    });

    playLine(0);

    return () => {
      stopAllAudio();
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [onIntroComplete]);

  useEffect(() => {
    if (currentLineIndex < DIALOGUE.length) {
      playLine(currentLineIndex);
    }
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

  const handleSkip = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    stopAllAudio();
    onIntroComplete();
  };

  return (
    <div className={`${styles.intro_overlay} ${currentAnimation}`}>
      <div className={styles.intro_vignette}></div>
      <div className={styles.intro_glow}></div>
      
      {!showLogo ? (
        <>
          <div className={styles.intro_flourish_top}>✦ ═══════ ✦</div>
          <div className={styles.intro_flourish_bottom}>✦ ═══════ ✦</div>
          
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
                  ◆
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.intro_logo_container}>
          <img 
            src="/images/world-map-logo.png" 
            alt="Polegion Logo" 
            className={styles.intro_logo}
          />
        </div>
      )}
      
      <button onClick={handleSkip} className={styles.intro_skip_button}>
        ⚡ Skip Tale →
      </button>
    </div>
  );
}