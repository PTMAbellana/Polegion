import React, { useState } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import ChapterCard, { Chapter } from './ChapterCard';

interface ChapterListProps {
  chapters: Chapter[];
  selectedChapter: number;
  onSelectChapter: (id: number) => void;
  onStartChapter: () => void;
  styles: any;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  selectedChapter,
  onSelectChapter,
  onStartChapter,
  styles
}) => {
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);
  const currentChapter = chapters.find(c => c.id === selectedChapter);

  return (
    <div className={styles.chapterPanel}>
      <div className={styles.chapterHeader}>
        <Zap className={styles.chapterIcon} />
        <span>Available Chapters</span>
      </div>

      <div className={styles.chapterList}>
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            isSelected={selectedChapter === chapter.id}
            isHovered={hoveredChapter === chapter.id}
            onSelect={onSelectChapter}
            onHover={setHoveredChapter}
            styles={styles}
          />
        ))}
      </div>

      <div className={styles.actionSection}>
        <button 
          className={`${styles.startButton} ${
            currentChapter?.locked ? styles.disabled : ''
          }`}
          onClick={onStartChapter}
          disabled={currentChapter?.locked}
        >
          <span>Enter Chapter {selectedChapter}</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChapterList;
