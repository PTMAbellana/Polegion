'use client';

import React from 'react';
import { ChevronRight, Lock, Sparkles } from 'lucide-react';

interface CastleActionButtonProps {
  selectedChapter: number | null;
  isUnlocked: boolean;
  isCompleted?: boolean;
  onStart: () => void;
  styleModule: any;
}

export default function CastleActionButton({
  selectedChapter,
  isUnlocked,
  isCompleted = false,
  onStart,
  styleModule
}: CastleActionButtonProps) {
  return (
    <div className={styleModule.actionSection}>
      <button
        className={`${styleModule.startButton} ${!isUnlocked ? styleModule.disabled : ''}`}
        onClick={onStart}
        disabled={!isUnlocked}
      >
        {!isUnlocked ? (
          <>
            <Lock size={20} />
            <span>Chapter Locked</span>
          </>
        ) : isCompleted ? (
          <>
            <Sparkles size={20} className={styleModule.sparkleIcon} />
            <span>Replay Chapter {selectedChapter}</span>
            <ChevronRight size={20} className={styleModule.arrowIcon} />
          </>
        ) : (
          <>
            <Sparkles size={20} className={styleModule.sparkleIcon} />
            <span>Enter Chapter {selectedChapter}</span>
            <ChevronRight size={20} className={styleModule.arrowIcon} />
          </>
        )}
      </button>
    </div>
  );
}