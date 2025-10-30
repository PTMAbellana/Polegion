import React from 'react';
import { Lock, CheckCircle, ChevronRight, Star } from 'lucide-react';

export interface Chapter {
  id: number;
  title: string;
  objective: string;
  reward: string;
  locked: boolean;
  completed: boolean;
  emoji: string;
}

interface ChapterCardProps {
  chapter: Chapter;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: number) => void;
  onHover: (id: number | null) => void;
  styles: any;
}

const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  styles
}) => {
  return (
    <div 
      className={`${styles.chapterItem} ${
        isSelected ? styles.selected : ''
      } ${chapter.locked ? styles.locked : ''} ${
        chapter.completed ? styles.completed : ''
      }`}
      onClick={() => onSelect(chapter.id)}
      onMouseEnter={() => onHover(chapter.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={styles.chapterIconContainer}>
        {chapter.locked ? (
          <Lock className={styles.lockIcon} />
        ) : chapter.completed ? (
          <CheckCircle className={styles.completedIcon} />
        ) : (
          <span className={styles.chapterEmoji}>{chapter.emoji}</span>
        )}
      </div>

      <div className={styles.chapterContent}>
        <h3 className={styles.chapterTitle}>{chapter.title}</h3>
        <p className={styles.chapterObjective}>Objective: {chapter.objective}</p>
      </div>

      <div className={styles.chapterStatus}>
        {chapter.completed && (
          <div className={styles.rewardBadge}>
            <Star size={16} />
            <span>{chapter.reward}</span>
          </div>
        )}
        {!chapter.locked && !chapter.completed && (
          <ChevronRight className={styles.chapterArrow} />
        )}
      </div>
    </div>
  );
};

export default ChapterCard;
