import React from 'react';

interface CastleHeaderProps {
  castleName: string;
  location: string;
  completedChapters: number;
  totalChapters: number;
  styles: any;
}

const CastleHeader: React.FC<CastleHeaderProps> = ({
  castleName,
  location,
  completedChapters,
  totalChapters,
  styles
}) => {
  const overallProgress = Math.round((completedChapters / totalChapters) * 100);

  return (
    <div className={styles.titlePanel}>
      <div className={styles.castleTitle}>
        <h1>{castleName}</h1>
        <p className={styles.castleSubtitle}>{location}</p>
      </div>
      
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Overall Progress</span>
          <span className={styles.progressValue}>
            {completedChapters} / {totalChapters} Chapters Completed
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CastleHeader;
