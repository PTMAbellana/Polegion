"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CastleIntro,
  CastleHeader,
  ChapterList,
  WizardCharacter,
  ParticleEffect,
  type Chapter
} from '@/components/world/CastleAdventure';
import { WorldMapButton } from '@/components/world/shared';
import styles from '@/styles/castle3-adventure.module.css';

const CircleSanctuaryChapterSelection = () => {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  // Chapter data for Circle Sanctuary
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "The Tide of Shapes",
      objective: "Identify the parts of a circle — center, radius, diameter, chord, arc, and sector",
      reward: "Pearl of the Center",
      locked: false,
      completed: false,
      emoji: "🌊"
    },
    {
      id: 2,
      title: "The Path of the Perimeter",
      objective: "Understand and compute circumference of a circle using C = 2πr or C = πd",
      reward: "Shell of Motion",
      locked: false,
      completed: false,
      emoji: "🐚"
    },
    {
      id: 3,
      title: "The Chamber of Space",
      objective: "Calculate the area of a circle and recognize semi-circles and sectors",
      reward: "Orb of Infinity",
      locked: false,
      completed: false,
      emoji: "⭐"
    }
  ];

  const [chaptersState, setChaptersState] = useState(chapters);

  // Check completion status and unlock logic
  useEffect(() => {
    // Load progress from localStorage
    const chapter1Complete = localStorage.getItem('castle3-chapter1-completed') === 'true';
    const chapter2Complete = localStorage.getItem('castle3-chapter2-completed') === 'true';
    const chapter3Complete = localStorage.getItem('castle3-chapter3-completed') === 'true';

    const completed: number[] = [];
    if (chapter1Complete) completed.push(1);
    if (chapter2Complete) completed.push(2);
    if (chapter3Complete) completed.push(3);

    setCompletedChapters(completed);

    // Update chapters state with completion and unlock status
    setChaptersState(prevChapters => 
      prevChapters.map(chapter => {
        let locked = chapter.locked;
        let isCompleted = completed.includes(chapter.id);

        // Chapter 2 unlocks when Chapter 1 is complete
        if (chapter.id === 2) {
          locked = !chapter1Complete;
        }
        
        // Chapter 3 unlocks when Chapter 2 is complete
        if (chapter.id === 3) {
          locked = !chapter2Complete;
        }

        return {
          ...chapter,
          locked,
          completed: isCompleted
        };
      })
    );
  }, []);

  // Handle chapter selection
  const handleChapterSelect = (chapterId: number) => {
    const chapter = chaptersState.find(c => c.id === chapterId);
    if (chapter && !chapter.locked) {
      setSelectedChapter(chapterId);
    }
  };

  // Handle chapter start
  const handleStartChapter = () => {
    const chapter = chaptersState.find(c => c.id === selectedChapter);
    if (chapter && !chapter.locked) {
      router.push(`/student/worldmap/castle3/chapter${selectedChapter}`);
    }
  };

  // Handle back to world map
  const handleBackToWorldMap = () => {
    router.push('/student/worldmap');
  };

  useEffect(() => {
    // Auto-dismiss intro after 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.chapterSelectionContainer}>
      {/* Background */}
      <div className={styles.backgroundOverlay}></div>
      
      {/* Introduction Overlay */}
      <CastleIntro 
        show={showIntro}
        castleName="Circle Sanctuary"
        subtitle="Where waves trace perfect arcs and circles rule the tides..."
        styles={styles}
      />

      {/* Back to World Map Button */}
      <WorldMapButton 
        onClick={handleBackToWorldMap}
        styles={styles}
      />

      {/* Castle Title - Positioned at top center */}
      <CastleHeader
        castleName="Circle Sanctuary"
        location="Golden Shores"
        completedChapters={completedChapters.length}
        totalChapters={chapters.length}
        styles={styles}
      />

      {/* Main Content - Left Panel and Right Wizard */}
      <div className={styles.mainContent}>
        {/* Chapter Selection Panel - Left Side */}
        <ChapterList
          chapters={chaptersState}
          selectedChapter={selectedChapter}
          onSelectChapter={handleChapterSelect}
          onStartChapter={handleStartChapter}
          styles={styles}
        />

        {/* Wizard Character - Right Side */}
        <WizardCharacter 
          imagePath="/images/wizard.png"
          alt="Archimedes the Wise"
          styles={styles}
        />
      </div>

      {/* Floating particles effect */}
      <ParticleEffect count={15} styles={styles} />
    </div>
  );
};

export default CircleSanctuaryChapterSelection;
