import React from 'react';

interface CastleIntroProps {
  show: boolean;
  castleName: string;
  subtitle: string;
  styles: any;
}

const CastleIntro: React.FC<CastleIntroProps> = ({
  show,
  castleName,
  subtitle,
  styles
}) => {
  if (!show) return null;

  return (
    <div className={styles.introOverlay}>
      <div className={styles.introContent}>
        <h1 className={styles.introTitle}>Welcome to the {castleName}</h1>
        <p className={styles.introText}>{subtitle}</p>
        <div className={styles.introSpinner}></div>
      </div>
    </div>
  );
};

export default CastleIntro;
