"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import CastleIntro from '@/components/world/CastleIntro';
import CastleHeader from '@/components/world/CastleHeader';
import ChapterList from '@/components/world/ChapterList';
import CastleCard from '@/components/world/CastleCard';
import CastleActionButton from '@/components/world/CastleActionButton';
import ParticleEffect from '@/components/world/ParticleEffect';
import styles from '@/styles/castle1-adventure.module.css';
import { getAllCastles } from '@/api/castles';
import { getUserProgress } from '@/api/progress';
import type {
  CastleWithProgress,
  ChapterWithProgress,
  CastleProgress
} from '@/types/castle.types';

const CASTLE_ROUTE = 'castle1';

export default function CastlePage() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const { isLoading: authLoading } = AuthProtection();

  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  const [castleData, setCastleData] = useState<CastleWithProgress | null>(null);
  const [castleProgress, setCastleProgress] = useState<CastleProgress | null>(null);
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && userProfile?.id) {
      initializeCastle();
    }
  }, [authLoading, userProfile?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const initializeCastle = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = userProfile?.id;
      if (!userId) throw new Error('User not authenticated');

      const castlesResponse = await getAllCastles(userId);
      if (!castlesResponse.success) {
        throw new Error(castlesResponse.message || 'Failed to fetch castles');
      }

      const castle = castlesResponse.data.find(
        (c: CastleWithProgress) => c.route === CASTLE_ROUTE
      );
      if (!castle) throw new Error(`Castle with route '${CASTLE_ROUTE}' not found`);

      setCastleData(castle);
      if (castle.progress) setCastleProgress(castle.progress);

      const progressResponse = await getUserProgress(userId, castle.id);
      if (progressResponse.success && progressResponse.data) {
        if (progressResponse.data.castleProgress) {
          setCastleProgress(progressResponse.data.castleProgress);
        }

        const chaptersWithProgress = progressResponse.data.chapterProgress || [];
        chaptersWithProgress.sort((a: ChapterWithProgress, b: ChapterWithProgress) => 
          a.chapter_number - b.chapter_number
        );
        setChapters(chaptersWithProgress);

        const firstAvailable = chaptersWithProgress.find(
          (c: ChapterWithProgress) => c.progress?.unlocked && !c.progress?.completed
        ) || chaptersWithProgress[0];
        if (firstAvailable) setSelectedChapter(firstAvailable.chapter_number);
      }
    } catch (error: any) {
      console.error('❌ Error initializing castle:', error);
      setError(error.message || 'Failed to load castle data');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = (chapterNumber: number) => {
    const chapter = chapters.find(c => c.chapter_number === chapterNumber);
    if (chapter?.progress?.unlocked) {
      setSelectedChapter(chapterNumber);
    }
  };

  const handleStartChapter = () => {
    const chapter = chapters.find(c => c.chapter_number === selectedChapter);
    if (chapter?.progress?.unlocked && castleData) {
      router.push(`/student/worldmap/${CASTLE_ROUTE}/chapter${chapter.chapter_number}`);
    }
  };

  const handleBackToWorldMap = () => {
    router.push('/student/worldmap');
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading {castleData?.name || 'Castle'}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error_container}>
        <h2>Error Loading Castle</h2>
        <p>{error}</p>
        <button onClick={handleBackToWorldMap} className={styles.errorButton}>
          Return to World Map
        </button>
      </div>
    );
  }

  if (!userProfile || !castleData) {
    return (
      <div className={styles.error_container}>
        <h2>Access Denied</h2>
        <p>Please log in to access this castle.</p>
        <button onClick={() => router.push('/auth/login')} className={styles.errorButton}>
          Go to Login
        </button>
      </div>
    );
  }

  const completedChaptersCount = chapters.filter(c => c.progress?.completed).length;
  const overallProgress = chapters.length > 0 
    ? Math.round((completedChaptersCount / chapters.length) * 100) 
    : 0;
  const totalXpEarned = chapters.reduce((sum, c) => sum + (c.progress?.xp_earned || 0), 0);
  const selectedChapterData = chapters.find(c => c.chapter_number === selectedChapter);

  return (
    <div className={styles.chapterSelectionContainer}>
      <div className={styles.backgroundOverlay}></div>

      <CastleIntro
        show={showIntro}
        castleName={castleData.name}
        description={castleData.description}
        styleModule={styles}
      />

      <CastleHeader
        castleName={castleData.name}
        region={castleData.region}
        description={castleData.description}
        completedChapters={completedChaptersCount}
        totalChapters={chapters.length}
        overallProgress={overallProgress}
        onBack={handleBackToWorldMap}
        styleModule={styles}
        isLoading={loading} // Pass loading state
      />

      <div className={styles.mainContent}>
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          hoveredChapter={hoveredChapter}
          onChapterSelect={handleChapterSelect}
          onHoverEnter={setHoveredChapter}
          onHoverLeave={() => setHoveredChapter(null)}
          styleModule={styles}
        />

        <CastleCard
          castleName={castleData.name}
          description={castleData.description}
          imageNumber={castleData.image_number}
          totalXpEarned={totalXpEarned}
          chaptersRemaining={chapters.length - completedChaptersCount}
          styleModule={styles}
        />
      </div>

      <CastleActionButton
        selectedChapter={selectedChapter}
        isUnlocked={selectedChapterData?.progress?.unlocked || false}
        onStart={handleStartChapter}
        styleModule={styles}
      />

      <ParticleEffect styleModule={styles} count={15} />
    </div>
  );
}