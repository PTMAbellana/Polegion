import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  styles: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  styles
}) => {
  const progress = (current / total) * 100;

  return (
    <div className={styles.progressBar}>
      <div 
        className={styles.progressFill} 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
