import React from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { ToggleSwitchProps } from "@/types";

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  description,
  disabled = false,
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
          className={styles.toggleSwitchLabel}
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
          <span className={`${styles.toggleSwitch} ${checked ? styles.checked : ''}`}>
            <span className={styles.toggleSlider}></span>
          </span>
          <span className={styles.toggleLabel}>{label}</span>
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
