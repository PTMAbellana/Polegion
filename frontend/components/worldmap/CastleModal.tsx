"use client"

import React, { useEffect } from 'react'
import { CastleModalProps } from '@/types/props/castle'
import styles from '@/styles/world-map.module.css'

// Learning objectives for each castle
const CASTLE_TOPICS: Record<string, string[]> = {
  'castle0': [
    'Assess your current geometry knowledge baseline',
    'Identify areas for improvement before starting your journey',
    'Establish a learning benchmark for future progress tracking'
  ],
  'castle1': [
    'Identify different geometric figures',
    'Identify parallel, intersecting, perpendicular, and skew lines',
    'Draw and name different geometric figures'
  ],
  'castle2': [
    'Name and measure angles',
    'Identify the kinds of angles',
    'Construct angles and identify congruent angles',
    'Differentiate complementary from supplementary angles',
    'Solve for missing angle measures',
    'Solve word problems involving angles'
  ],
  'castle3': [
    'Draw a circle and identify its parts',
    'Find the circumference and area of a circle',
    'Solve word problems involving circles'
  ],
  'castle4': [
    'Identify different polygons',
    'Identify similar and congruent polygons',
    'Solve for the interior angles of polygons',
    'Find the perimeter and area of polygons',
    'Solve word problems involving polygons'
  ],
  'castle5': [
    'Identify plane and 3D figures (solid figures)',
    'Differentiate plane figures from solid figures',
    'Find the surface area of solid figures',
    'Find the volume of prisms, pyramids, cylinders, cones, and spheres',
    'Solve word problems involving volume of solid figures'
  ],
  'castle6': [
    'Demonstrate mastery of all geometry concepts learned',
    'Measure your growth and improvement since the pretest',
    'Earn your final achievement and complete your geometry journey'
  ]
}

// Castle color themes
const CASTLE_THEMES: Record<number, { primary: string; secondary: string; accent: string; border: string }> = {
  0: {
    primary: '#715A5A',
    secondary: '#37353E',
    accent: '#8B6B6B',
    border: '#5A4848'
  },
  1: {
    primary: '#3E5879',
    secondary: '#213555',
    accent: '#5A7FA3',
    border: '#4A6B8A'
  },
  2: {
    primary: '#4C763B',
    secondary: '#043915',
    accent: '#6B9C52',
    border: '#3D5F2E'
  },
  3: {
    primary: '#27667B',
    secondary: '#143D60',
    accent: '#3B8BA5',
    border: '#1E5270'
  },
  4: {
    primary: '#B77466',
    secondary: '#957C62',
    accent: '#D09082',
    border: '#A56B5D'
  },
  5: {
    primary: '#6A4C93',
    secondary: '#2D1B4E',
    accent: '#8B6BB8',
    border: '#553A7A'
  },
  6: {
    primary: '#FFBF1C',
    secondary: '#000080',
    accent: '#FFD60A',
    border: '#D1A309'
  }
}

export default function CastleModal({ castle, onClose, onEnter }: CastleModalProps) {
  // Debug logging to check data
  useEffect(() => {
    console.log('[CastleModal] Castle data:', castle);
    console.log('[CastleModal] Castle progress:', castle.progress);
    console.log('[CastleModal] Completion percentage:', castle.progress?.completion_percentage);
  }, [castle]);

  // Get topics for this castle
  const topics = CASTLE_TOPICS[castle.route] || [];
  
  // Get theme colors for this castle
  const theme = CASTLE_THEMES[castle.image_number] || CASTLE_THEMES[1];

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <style jsx>{`
        .${styles.modal_content}::-webkit-scrollbar-thumb {
          background: ${theme.primary} !important;
        }
        .${styles.modal_content}::-webkit-scrollbar-thumb:hover {
          background: ${theme.accent} !important;
        }
        .${styles.modal_content}::-webkit-scrollbar-track {
          background: ${theme.secondary}40 !important;
        }
      `}</style>
      <div 
        className={styles.modal_content} 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(145deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`,
          backdropFilter: 'blur(20px)',
          borderColor: theme.border,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.9), inset 0 0 30px ${theme.primary}20`
        }}
      >
        <button
          className={styles.close_button}
          onClick={onClose}
          aria-label="Close"
          style={{
            borderColor: theme.accent,
            color: theme.primary
          }}
        >
          ✕
        </button>

        <div className={styles.modal_header}>
          <h2 className={styles.modal_title} style={{ color: theme.primary }}>
            {castle.name}
          </h2>
        </div>

        {/* Learning Topics */}
        <div className={styles.learning_topics} style={{ borderColor: theme.border }}>
          <h3 className={styles.topics_title} style={{ color: theme.primary }}>
            Learning Objectives
          </h3>
          <ul className={styles.topics_list}>
            {topics.map((topic, index) => (
              <li key={index} className={styles.topic_item}>
                <span className={styles.topic_bullet} style={{ color: theme.accent }}>◆</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* XP Progress */}
        {castle.progress && castle.image_number !== 0 && castle.image_number !== 6 && (
          <div className={styles.xp_section} style={{ borderColor: theme.border, backgroundColor: `${theme.primary}10` }}>
            <div className={styles.xp_info}>
              <span className={styles.xp_label} style={{ color: theme.primary }}>
                XP Earned:
              </span>
              <span className={styles.xp_value}>
                {castle.progress.total_xp_earned || 0} / {castle.total_xp || 0}
              </span>
            </div>
          </div>
        )}

        {/* Assessment Note for Castle 0 and 6 */}
        {castle.progress && (castle.image_number === 0 || castle.image_number === 6) && (
          <div className={styles.xp_section} style={{ borderColor: theme.border, backgroundColor: `${theme.primary}10` }}>
            <div className={styles.xp_info}>
              <span className={styles.xp_label} style={{ color: theme.primary }}>
                {castle.image_number === 0 ? 'Assessment Only' : 'Final Assessment'}
              </span>
              <span className={styles.xp_value} style={{ fontSize: '0.875rem' }}>
                {castle.image_number === 0 
                  ? 'No XP awarded - diagnostic purposes only'
                  : 'No XP awarded - achievement earned upon completion'}
              </span>
            </div>
          </div>
        )}

        {castle.progress?.unlocked && (
          <>
            <div className={styles.progress_bar_container}>
              <div className={styles.progress_label} style={{ color: theme.primary }}>
                Progress: {castle.progress.completion_percentage || 0}%
              </div>
              <div className={styles.progress_bar} style={{ borderColor: theme.border }}>
                <div
                  className={styles.progress_fill}
                  style={{ 
                    width: `${castle.progress.completion_percentage || 0}%`,
                    background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.accent} 100%)`,
                    boxShadow: `0 0 15px ${theme.primary}60`
                  }}
                />
              </div>
            </div>

            <button
              className={styles.enter_button}
              onClick={() => onEnter(castle)}
              style={{
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.primary} 100%)`,
                borderColor: theme.border
              }}
            >
              {castle.progress?.completed ? 'Revisit Castle' : 'Enter Castle'}
            </button>
          </>
        )}

        {!castle.progress?.unlocked && (
          <div className={styles.locked_message} style={{ borderColor: theme.border }}>
            <p>Complete previous castles to unlock this realm</p>
          </div>
        )}
      </div>
    </div>
  )
}
