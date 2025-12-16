import React from 'react';

interface WizardDialogueProps {
  message: string;
  wizardImage?: string;
  styles: any;
}

const WizardDialogue: React.FC<WizardDialogueProps> = ({
  message,
  wizardImage = '/images/wizards/wizard.webp',
  styles
}) => {
  return (
    <div className={styles.wizardDialogue}>
      <img 
        src={wizardImage} 
        alt="Wizard" 
        className={styles.wizardImage}
      />
      <div className={styles.wizardMessage}>{message}</div>
    </div>
  );
};

export default WizardDialogue;
