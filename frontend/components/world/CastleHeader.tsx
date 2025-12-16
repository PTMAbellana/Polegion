'use client';

import React from 'react';

interface CastleHeaderProps {
  castleName: string;
  region: string;
  description: string;
  completedChapters: number;
  totalChapters: number;
  overallProgress: number;
  onBack: () => void;
  styleModule: any;
  isLoading?: boolean; // NEW: Optional loading state
}

export default function CastleHeader({
  castleName,
  region,
  description,
  completedChapters,
  totalChapters,
  overallProgress,
  onBack,
  styleModule,
  isLoading = false // NEW
}: CastleHeaderProps) {
  return (
    <>
      {!isLoading && ( // Only show when not loading
        <button className={styleModule.backButton} onClick={onBack}>
          <div className={styleModule.backButtonContent}>
            <img 
              src="/images/world-map-button.webp" 
              alt="World Map"
              className={styleModule.backButtonImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className={styleModule.backButtonText}>Return to World Map</span>
          </div>
        </button>
      )}

      <div className={styleModule.titlePanel}>
        <div className={styleModule.castleTitle}>
          <h1>{castleName}</h1>
          <p className={styleModule.castleSubtitle}>{region}</p>
          <p className={styleModule.castleTheme}>{description}</p>
        </div>

        <div className={styleModule.progressSection}>
          <div className={styleModule.progressHeader}>
            <span className={styleModule.progressLabel}>Overall Progress</span>
            <span className={styleModule.progressValue}>
              {completedChapters} / {totalChapters} Chapters Completed
            </span>
          </div>
          <div className={styleModule.progressBar}>
            <div
              className={styleModule.progressFill}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}