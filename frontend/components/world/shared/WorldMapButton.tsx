import React from 'react';

interface WorldMapButtonProps {
  onClick: () => void;
  imagePath?: string;
  text?: string;
  styles: any;
}

const WorldMapButton: React.FC<WorldMapButtonProps> = ({
  onClick,
  imagePath = '/images/world-map-button.webp',
  text = 'World Map',
  styles
}) => {
  return (
    <button 
      className={styles.backButton}
      onClick={onClick}
    >
      <img 
        src={imagePath}
        alt="Back to World Map" 
        className={styles.backButtonImage}
      />
      <span className={styles.backButtonText}>{text}</span>
    </button>
  );
};

export default WorldMapButton;
