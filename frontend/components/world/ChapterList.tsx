'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Lock, Star, Zap } from 'lucide-react';
import type { ChapterWithProgress } from '@/types/castle.types';

interface ChapterListProps {
  chapters: ChapterWithProgress[];
  selectedChapter: number | null;
  hoveredChapter: string | null;
  onChapterSelect: (chapterNumber: number) => void;
  onHoverEnter: (chapterId: string) => void;
  onHoverLeave: () => void;
  styleModule: any;
}

export default function ChapterList({
  chapters,
  selectedChapter,
  hoveredChapter,
  onChapterSelect,
  onHoverEnter,
  onHoverLeave,
  styleModule
}: ChapterListProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, chapterId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top,
      left: rect.right + 16 // 16px gap from the item
    });
    onHoverEnter(chapterId);
  };

  const hoveredChapterData = chapters.find(ch => ch.id === hoveredChapter);

  return (
    <>
      <div className={styleModule.chapterPanel}>
        <div className={styleModule.chapterHeader}>
          <Zap className={styleModule.chapterIcon} />
          <span>Available Chapters</span>
        </div>

        <div className={styleModule.chapterList}>
          {chapters.map((chapter) => {
            const isSelected = selectedChapter === chapter.chapter_number;
            const isCompleted = chapter.progress?.completed || false;
            const isUnlocked = chapter.progress?.unlocked || false;
            const isHovered = hoveredChapter === chapter.id;

            return (
              <div
                key={chapter.id}
                className={`${styleModule.chapterItem} ${isSelected ? styleModule.selected : ''} ${!isUnlocked ? styleModule.locked : ''} ${isCompleted ? styleModule.completed : ''}`}
                onClick={() => onChapterSelect(chapter.chapter_number)}
                onMouseEnter={(e) => handleMouseEnter(e, chapter.id)}
                onMouseLeave={onHoverLeave}
              >
                <div className={styleModule.chapterNumberContainer}>
                  {!isUnlocked ? (
                    <Lock className={styleModule.lockIcon} />
                  ) : (
                    <span className={styleModule.chapterNumber}>{chapter.chapter_number}</span>
                  )}
                </div>

                <div className={styleModule.chapterContent}>
                  <h3 className={styleModule.chapterTitle}>{chapter.title}</h3>
                  <p className={styleModule.chapterObjective}>
                    Chapter {chapter.chapter_number} • {chapter.xp_reward} XP
                  </p>
                </div>

                <div className={styleModule.chapterStatus}>
                  {isCompleted && chapter.progress?.quiz_passed && (
                    <div className={styleModule.rewardBadge}>
                      <Star size={16} />
                      <span>Completed</span>
                    </div>
                  )}
                  {isUnlocked && !isCompleted && (
                    <ChevronRight className={styleModule.chapterArrow} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal the tooltip to body - OUTSIDE all containers */}
      {mounted && hoveredChapterData && hoveredChapterData.progress?.unlocked && 
        createPortal(
          <div 
            className={styleModule.chapterTooltip}
            style={{
              position: 'fixed',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              zIndex: 9999
            }}
          >
            <p>{hoveredChapterData.description}</p>
            {hoveredChapterData.progress && (
              <div className={styleModule.tooltipTopics}>
                <span className={styleModule.topicTag}>
                  XP Earned: {hoveredChapterData.progress.xp_earned}/{hoveredChapterData.xp_reward}
                </span>
                {hoveredChapterData.progress.quiz_passed && (
                  <span className={styleModule.topicTag}>✓ Quiz Passed</span>
                )}
              </div>
            )}
          </div>,
          document.body
        )
      }
    </>
  );
}