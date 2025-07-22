import React from "react";
import styles from "@/styles/create-problem.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  description,
  disabled = false,
  size = 'medium',
  color = 'blue'
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange();
    }
  };

  return (
    <div className={`${styles.toggleSwitchContainer} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.toggleSwitchMain}>
        <div 
          className={`${styles.toggleSwitchLabel} ${styles[`size-${size}`]} ${styles[`color-${color}`]}`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            type="checkbox"
            checked={checked || false} 
            readOnly 
            disabled={disabled}
            className={styles.toggleSwitchInput}
            tabIndex={-1} 
          />
          
          {/* Visual toggle slider */}
          <span 
            className={`${styles.toggleSwitchSlider} ${checked ? styles.checked : ''} ${styles[`size-${size}`]} ${styles[`color-${color}`]}`}
          >
            <span className={styles.toggleSwitchOrb}></span>
          </span>
          
          {/* Label text */}
          <span className={styles.toggleSwitchText}>
            {label}
          </span>
        </div>
      </div>
      {description && (
        <div className={styles.toggleSwitchDescription}>
          {description}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;