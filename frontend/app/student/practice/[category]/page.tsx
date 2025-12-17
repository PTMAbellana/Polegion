// ============================================================================
// CATEGORY PRACTICE PAGE
// ============================================================================
// Dynamic practice session for specific geometry category
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthProtection } from '@/context/AuthProtection';
import PageHeader from '@/components/PageHeader';
import PracticeQuiz from '@/components/practice/PracticeQuiz';
import PracticeProgress, { savePracticeStats } from '@/components/practice/PracticeProgress';
import { getQuestionsByCategory } from '@/utils/questions/generateQuestions';
import { PRACTICE_CATEGORIES } from '@/components/practice/CategorySelector';
import styles from '@/styles/practice.module.css';

export default function CategoryPracticePage() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category as string;
  const { isLoading } = AuthProtection();

  const [questions, setQuestions] = useState<any[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const categoryInfo = PRACTICE_CATEGORIES.find((c) => c.id === category);
  const checklistItems = [
    'Five curated questions per attempt',
    'Targets six mastery categories',
    'Instant scoring and reflection',
  ];

  const sessionHighlights = [
    {
      title: 'Smart Feedback',
      detail: 'See why answers are correct and build better strategies.',
    },
    {
      title: 'Curriculum Aligned',
      detail: 'Covers Grade 5–6 geometry concepts and competencies.',
    },
    {
      title: 'Quick / Repeatable',
      detail: 'Finish a set in under five minutes, then try again.',
    },
  ];

  const quickFacts = ['Grade 5-6 geometry', 'Fresh questions every run', 'Takes ~5 minutes'];

  useEffect(() => {
    if (category) {
      generateNewQuestions();
    }
  }, [category]);

  const generateNewQuestions = () => {
    const newQuestions = getQuestionsByCategory(category);
    setQuestions(newQuestions);
    setIsStarted(false);
  };

  const handleComplete = (score: number, total: number) => {
    savePracticeStats(category, score, total);
  };

  const handleRestart = () => {
    generateNewQuestions();
    setIsStarted(true);
  };

  const handleBackToPractice = () => {
    router.push('/student/practice');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className={styles.errorContainer}>
        <h2>Category Not Found</h2>
        <p>The practice category you're looking for doesn't exist.</p>
        <button onClick={handleBackToPractice} className={styles.backButton}>
          Back to Practice
        </button>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className={styles.categoryPageContainer}>
        {/* Page Header */}
        <PageHeader 
          title={categoryInfo.name}
          subtitle="Practice Mode - Build mastery through repetition"
          showAvatar={false}
          actionButton={
            <button onClick={handleBackToPractice} className={styles.backButtonHeader}>
              Practice Hub
            </button>
          }
        />

        {/* Scrollable Content */}
        <div className={styles.scrollableContent}>
          <div className={styles.startScreen}>
          <div className={styles.categoryHero}>
            <div className={styles.categoryHeroContent}>
              <span className={styles.sectionBadge}>Practice Mode</span>
              <div className={styles.categoryBadgeRow}>
                <div 
                  className={styles.categoryIconLarge} 
                  style={{ background: categoryInfo.gradient }}
                >
                  <span>{categoryInfo.initials}</span>
                </div>
                <div>
                  <h1 className={styles.categoryTitle}>{categoryInfo.name}</h1>
                  <p className={styles.categoryIntroDescription}>{categoryInfo.description}</p>
                </div>
              </div>
              <div className={styles.categoryFactPills}>
                {quickFacts.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </div>
            </div>

            <div className={styles.categoryHeroPanel}>
              <PracticeProgress category={category} />
              <div className={styles.heroInfoCard}>
                <h4>Session Checklist</h4>
                <ul>
                  {checklistItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.infoNote}>
                <span className={styles.noteIcon}>ℹ️</span>
                <p>Progress saves on this device only. Use the same device to track your stats.</p>
              </div>
            </div>
          </div>

          <div className={styles.sessionCards}>
            {sessionHighlights.map((highlight) => (
              <div key={highlight.title} className={styles.sessionCard}>
                <h3>{highlight.title}</h3>
                <p>{highlight.detail}</p>
              </div>
            ))}
          </div>

          <div className={styles.startActions}>
            <button
              className={styles.primaryAction}
              onClick={() => setIsStarted(true)}
            >
              Start Practice
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryPageContainer}>
      {/* Page Header */}
      <PageHeader 
        title={categoryInfo.name}
        subtitle="Practice Mode - Active Session"
        showAvatar={false}
        actionButton={
          <button onClick={handleBackToPractice} className={styles.backButtonHeader}>
            Practice Hub
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className={styles.scrollableContent}>

        <PracticeQuiz
          questions={questions}
          onComplete={handleComplete}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
