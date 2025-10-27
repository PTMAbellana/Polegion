"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Lock, CheckCircle, Star, Zap } from 'lucide-react';
import styles from '@/styles/castle4-adventure.module.css';

const FractalBastionChapterSelection = () => {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  // Chapter data
  const chapters = [
    {
      id: 1,
      title: "Chapter 1: The Hall of Mirrors",
      objective: "Mirror Match",
      description: "Understand line and rotational symmetry through mystical mirrors",
      unlocked: true,
      completed: false,
      reward: "Crystal of Balance",
      icon: "🪞"
    },
    {
      id: 2,
      title: "Chapter 2: The Tessellated Vault",
      objective: "Pattern Weaver",
      description: "Master polygon identification and tessellation patterns",
      unlocked: true,
      completed: false,
      reward: "Tessellation Key",
      icon: "🔷"
    },
    {
      id: 3,
      title: "Chapter 3: The Chamber of Motion",
      objective: "Transformation Master",
      description: "Master translation, rotation, and reflection of geometric shapes",
      unlocked: true,
      completed: false,
      reward: "Cog of Motion",
      icon: "⚙️"
    },
    {
      id: 4,
      title: "Chapter 4: The Polygonal Throne",
      objective: "Angle Architect",
      description: "Deepen understanding of polygons — identifying, drawing, similarity, congruence, and finding interior angles",
      unlocked: false,
      completed: false,
      reward: "Crown of Angles",
      icon: "👑"
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

    const completed = [];
    if (chapter1Complete) completed.push(1);
    if (chapter2Complete) completed.push(2);
    if (chapter3Complete) completed.push(3);
    if (chapter4Complete) completed.push(4);

    setCompletedChapters(completed);

    // Update chapters state with completion and unlock status
    setChaptersState(prevChapters => 
      prevChapters.map(chapter => {
        let unlocked = chapter.unlocked;
        let isCompleted = completed.includes(chapter.id);

        // Chapter 4 unlocks when Chapter 3 is complete
        if (chapter.id === 4) {
          unlocked = chapter3Complete;
        }

        return {
          ...chapter,
          unlocked,
          completed: isCompleted
        };
      })
    );
  }, []);

  // Calculate overall progress
  const overallProgress = Math.round((completedChapters.length / chapters.length) * 100);

  // Handle chapter selection
  const handleChapterSelect = (chapterId) => {
    const chapter = chaptersState.find(c => c.id === chapterId);
    if (chapter && chapter.unlocked) {
      setSelectedChapter(chapterId);
    }
  };

  // Handle chapter start
  const handleStartChapter = () => {
    const chapter = chaptersState.find(c => c.id === selectedChapter);
    if (chapter && chapter.unlocked) {
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
      {showIntro && (
        <div className={styles.introOverlay}>
          <div className={styles.introContent}>
            <h1 className={styles.introTitle}>Welcome to the Fractal Bastion</h1>
            <p className={styles.introText}>
              Where geometry dances infinitely through symmetry, patterns, and infinite recursion...
            </p>
            <div className={styles.introSpinner}></div>
          </div>
        </div>
      )}

      {/* Back to World Map Button */}
      <button 
        className={styles.backButton}
        onClick={handleBackToWorldMap}
      >
        Back to World Map
      </button>

      {/* Castle Title - Positioned at top center */}
      <div className={styles.titlePanel}>
        <div className={styles.castleTitle}>
          <h1>Fractal Bastion</h1>
          <p className={styles.castleSubtitle}>Misty Highlands</p>
        </div>
        
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Overall Progress</span>
            <span className={styles.progressValue}>{completedChapters.length} / {chapters.length} Chapters Completed</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content - Left Panel and Right Wizard */}
      <div className={styles.mainContent}>
        {/* Chapter Selection Panel - Left Side */}
        <div className={styles.chapterPanel}>
          <div className={styles.chapterHeader}>
            <Zap className={styles.chapterIcon} />
            <span>Available Chapters</span>
          </div>

          <div className={styles.chapterList}>
            {chaptersState.map((chapter) => {
              const isSelected = selectedChapter === chapter.id;
              const isCompleted = completedChapters.includes(chapter.id);
              const isHovered = hoveredChapter === chapter.id;

              return (
                <div 
                  key={chapter.id}
                  className={`${styles.chapterItem} ${
                    isSelected ? styles.selected : ''
                  } ${!chapter.unlocked ? styles.locked : ''} ${
                    isCompleted ? styles.completed : ''
                  }`}
                  onClick={() => handleChapterSelect(chapter.id)}
                  onMouseEnter={() => setHoveredChapter(chapter.id)}
                  onMouseLeave={() => setHoveredChapter(null)}
                >
                  <div className={styles.chapterIconContainer}>
                    {!chapter.unlocked ? (
                      <Lock className={styles.lockIcon} />
                    ) : isCompleted ? (
                      <CheckCircle className={styles.completedIcon} />
                    ) : (
                      <span className={styles.chapterEmoji}>{chapter.icon}</span>
                    )}
                  </div>

                  <div className={styles.chapterContent}>
                    <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                    <p className={styles.chapterObjective}>Objective: {chapter.objective}</p>
                  </div>

                  <div className={styles.chapterStatus}>
                    {isCompleted && (
                      <div className={styles.rewardBadge}>
                        <Star size={16} />
                        <span>{chapter.reward}</span>
                      </div>
                    )}
                    {chapter.unlocked && !isCompleted && (
                      <ChevronRight className={styles.chapterArrow} />
                    )}
                  </div>

                  {/* Chapter description on hover */}
                  {isHovered && chapter.unlocked && (
                    <div className={styles.chapterTooltip}>
                      <p>{chapter.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Start Chapter Button */}
          <div className={styles.actionSection}>
            <button 
              className={`${styles.startButton} ${
                !chaptersState.find(c => c.id === selectedChapter)?.unlocked ? styles.disabled : ''
              }`}
              onClick={handleStartChapter}
              disabled={!chaptersState.find(c => c.id === selectedChapter)?.unlocked}
            >
              <span>Enter Chapter {selectedChapter}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Wizard Character - Right Side */}
        <div className={styles.wizardContainer}>
          <img 
            src="/images/wizard.png" 
            alt="Wizard Archimedes"
            className={styles.wizardImage}
          />
        </div>
      </div>

      {/* Floating particles effect */}
      <div className={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FractalBastionChapterSelection;