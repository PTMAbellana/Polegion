import React from "react";
import styles from "@/styles/create-problem.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string; // ✅ Add optional description
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  description 
}) => {
  return (
    <div className={styles.toggleSwitchContainer}>
      <div className={styles.toggleSwitchMain}>
        <label className={styles.toggleSwitchLabel}>
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={styles.toggleSwitchInput}
          />
          <span className={styles.toggleSwitchSlider}></span>
          <span className={styles.toggleSwitchText}>{label}</span>
        </label>
      </div>
      {/* ✅ Add description if provided */}
      {description && (
        <div className={styles.toggleSwitchDescription}>
          {description}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;