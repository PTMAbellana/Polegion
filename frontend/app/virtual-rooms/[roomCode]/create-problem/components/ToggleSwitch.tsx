import React from "react";
import styles from "@/styles/create-problem.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
    <button
      type="button"
      className={`${styles.toggleSwitch} ${checked ? styles.toggleSwitchActive : ""}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <div className={styles.switchTrack}>
        <div className={styles.switchOrb}></div>
      </div>
    </button>
    <span style={{ marginLeft: 12, fontWeight: 500 }}>{label}</span>
  </label>
);

export default ToggleSwitch;