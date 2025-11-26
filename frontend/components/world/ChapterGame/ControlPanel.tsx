import React, { ReactNode } from 'react';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

export interface ControlPanelButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: 'previous' | 'home' | 'next';
  variant?: 'previous' | 'default' | 'next';
}

interface ControlPanelProps {
  buttons: ControlPanelButton[];
  styles: any;
  customContent?: ReactNode;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  buttons,
  styles,
  customContent
}) => {
  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'previous':
        return <ArrowLeft size={16} />;
      case 'home':
        return <Home size={16} />;
      case 'next':
        return <ChevronRight size={16} />;
      default:
        return null;
    }
  };

  const getButtonClass = (variant?: string) => {
    switch (variant) {
      case 'previous':
        return styles.previousButton;
      case 'next':
        return styles.nextButton;
      default:
        return styles.controlButton;
    }
  };

  return (
    <div className={styles.controlPanel}>
      {customContent}
      {buttons.map((button, index) => (
        <button
          key={index}
          className={getButtonClass(button.variant)}
          onClick={button.onClick}
          disabled={button.disabled}
        >
          {getIcon(button.icon)}
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ControlPanel;
