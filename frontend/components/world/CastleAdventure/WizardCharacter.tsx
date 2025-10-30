import React from 'react';

interface WizardCharacterProps {
  imagePath?: string;
  alt?: string;
  styles: any;
}

const WizardCharacter: React.FC<WizardCharacterProps> = ({
  imagePath = '/images/wizard.png',
  alt = 'Wizard Archimedes',
  styles
}) => {
  return (
    <div className={styles.wizardContainer}>
      <img 
        src={imagePath}
        alt={alt}
        className={styles.wizardImage}
      />
    </div>
  );
};

export default WizardCharacter;
