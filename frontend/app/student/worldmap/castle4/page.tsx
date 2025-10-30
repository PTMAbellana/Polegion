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
import styles from '@/styles/castle4-adventure.module.css';

const FractalBastionChapterSelection = () => {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  // Chapter data
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "The Hall of Mirrors",
      objective: "Understand line and rotational symmetry through mystical mirrors",
      reward: "Crystal of Balance",
      locked: false,
      completed: false,
      emoji: "🪞"
    },
    {
      id: 2,
      title: "The Tessellated Vault",
      objective: "Master polygon identification and tessellation patterns",
      reward: "Tessellation Key",
      locked: false,
      completed: false,
      emoji: "🔷"
    },
    {
      id: 3,
      title: "The Chamber of Motion",
      objective: "Master translation, rotation, and reflection of geometric shapes",
      reward: "Cog of Motion",
      locked: false,
      completed: false,
      emoji: "⚙️"
    },
    {
      id: 4,
      title: "The Polygonal Throne",
      objective: "Deepen understanding of polygons — identifying, drawing, similarity, congruence, and finding interior angles",
      reward: "Crown of Angles",
      locked: true,
      completed: false,
      emoji: "👑"
    }
  ];

  const [chaptersState, setChaptersState] = useState(chapters);

  // Check completion status and unlock logic
  useEffect(() => {
    // Load progress from localStorage
    const chapter1Complete = localStorage.getItem('castle4-chapter1-completed') === 'true';
    const chapter2Complete = localStorage.getItem('castle4-chapter2-completed') === 'true';
    const chapter3Complete = localStorage.getItem('castle4-chapter3-completed') === 'true';
    const chapter4Complete = localStorage.getItem('castle4-chapter4-completed') === 'true';

    const completed: number[] = [];
    if (chapter1Complete) completed.push(1);
    if (chapter2Complete) completed.push(2);
    if (chapter3Complete) completed.push(3);
    if (chapter4Complete) completed.push(4);

    setCompletedChapters(completed);

    // Update chapters state with completion and unlock status
    setChaptersState(prevChapters => 
      prevChapters.map(chapter => {
        let locked = chapter.locked;
        const isCompleted = completed.includes(chapter.id);

        // Chapter 4 unlocks when Chapter 3 is complete
        if (chapter.id === 4) {
          locked = !chapter3Complete;
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
      router.push(`/student/worldmap/castle4/chapter${selectedChapter}`);
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
        castleName="Fractal Bastion"
        subtitle="Where geometry dances infinitely through symmetry, patterns, and infinite recursion..."
        styles={styles}
      />

      {/* Back to World Map Button */}
      <WorldMapButton 
        onClick={handleBackToWorldMap}
        styles={styles}
      />

      {/* Castle Title - Positioned at top center */}
      <CastleHeader
        castleName="Fractal Bastion"
        location="Misty Highlands"
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
          alt="Wizard Archimedes"
          styles={styles}
        />
      </div>

      {/* Floating particles effect */}
      <ParticleEffect count={15} styles={styles} />
    </div>
  );
};

export default FractalBastionChapterSelection;