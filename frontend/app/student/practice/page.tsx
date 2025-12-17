// ============================================================================
// PRACTICE DASHBOARD PAGE
// ============================================================================
// Main hub for accessing practice questions by category
// ============================================================================

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthProtection } from '@/context/AuthProtection';
import PageHeader from '@/components/PageHeader';
import CategorySelector from '@/components/practice/CategorySelector';
import PracticeProgress from '@/components/practice/PracticeProgress';
import styles from '@/styles/practice.module.css';
import dashboardStyles from '@/styles/dashboard-wow.module.css';

export default function PracticePage() {
  const router = useRouter();
  const { isLoading } = AuthProtection();

  const heroHighlights = [
    {
      title: 'Instant Feedback',
      description: 'Understand every answer right away and learn the reasoning.',
    },
    {
      title: 'Device-Specific Tracking',
      description: 'Progress saves on this device only—use the same device to track improvement.',
    },
    {
      title: 'Quick Sessions',
      description: 'Each set has five questions—perfect for focused practice.',
    },
  ];

  const practiceSteps = [
    {
      title: 'Pick a Track',
      detail: 'Choose the category that matches your current lesson or goal.',
    },
    {
      title: 'Answer / Reflect',
      detail: 'Read the feedback after each response to reinforce concepts.',
    },
    {
      title: 'Retake / Master',
      detail: 'Retry categories anytime with brand-new question variations.',
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={dashboardStyles['dashboard-container']}>
      {/* Page Header */}
      <PageHeader 
        title="Geometry Practice Hub"
        subtitle="Master geometry concepts through targeted practice"
        showAvatar={false}
        actionButton={
          <button onClick={() => router.push('/student/dashboard')} className={styles.backButtonHeader}>
            Dashboard
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className={styles.scrollableContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Guided Practice Path</span>
            <h1 className={styles.heroTitle}>Build confidence with daily geometry reps</h1>
            <p className={styles.heroSubtitle}>
              Practice whenever you like—each session creates fresh, curriculum-aligned questions
              that strengthen recall, problem solving, and higher-order thinking.
            </p>

            <div className={styles.heroHighlights}>
              {heroHighlights.map((item) => (
                <div key={item.title} className={styles.highlightCard}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.heroActions}>
              <button
                className={styles.primaryAction}
                onClick={() => router.push('/student/practice/knowledge-recall')}
              >
                Start with Knowledge Recall
              </button>
              <button
                className={styles.secondaryAction}
                onClick={() => router.push('/student/worldmap')}
              >
                Visit World Map
              </button>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <PracticeProgress />
            <div className={styles.heroInfoCard}>
              <h4>Session Checklist</h4>
              <ul>
                <li>Five curated questions per attempt</li>
                <li>Targets six mastery categories</li>
                <li>Instant scoring and reflection</li>
              </ul>
            </div>
            <div className={styles.infoNote}>
              <span className={styles.noteIcon}>ℹ️</span>
              <p>Practice progress is saved on this device only. If you switch devices, your stats won&apos;t transfer.</p>
            </div>
          </div>
        </section>

        <section className={styles.categorySection}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionBadge}>Skill Tracks</span>
              <h2>Select a focus area</h2>
              <p>
                Pick a category that matches your current lessons or mix tracks for spiral review.
                Each path keeps difficulty balanced for Grade 5–6 learners.
              </p>
            </div>
            <div className={styles.sectionStats}>
              <div>
                <strong>6</strong>
                <span>Categories</span>
              </div>
              <div>
                <strong>Unlimited</strong>
                <span>Attempts</span>
              </div>
            </div>
          </div>
          <CategorySelector />
        </section>

        <section className={styles.stepsSection}>
          <div className={styles.sectionHeadingCentered}>
            <span className={styles.sectionBadge}>How it works</span>
            <h2>Your practice routine</h2>
            <p>Follow these three steps to make every session purposeful and fun.</p>
          </div>
          <div className={styles.stepGrid}>
            {practiceSteps.map((step, index) => (
              <div key={step.title} className={styles.stepCard}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.supportSection}>
          <div className={styles.tipsPanel}>
            <h3>Practice tips</h3>
            <ul>
              <li>Questions refresh automatically every time you restart.</li>
              <li>Say your reasoning out loud to strengthen understanding.</li>
              <li>Note tricky items and revisit the category later.</li>
              <li>Alternate between easier and harder tracks for balance.</li>
              <li>Celebrate improvements—even small gains matter!</li>
            </ul>
          </div>
          <div className={styles.ctaPanel}>
            <h3>Need a bigger challenge?</h3>
            <p>
              Jump into castle chapters or assessments once you feel ready. The practice center
              prepares you for every quest inside Polegion.
            </p>
            <button onClick={() => router.push('/student/worldmap')}>
              Explore Chapters
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
