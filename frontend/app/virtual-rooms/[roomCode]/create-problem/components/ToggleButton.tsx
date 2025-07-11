import React from "react";
import styles from "@/styles/create-problem.module.css";

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ active, onClick, label }) => (
  <button
    type="button"
    className={`${styles.toggleButton} ${active ? styles.toggleButtonActive : ""}`}
    onClick={onClick}
  >
    <span className={styles.toggleLabel}>{label}</span>
  </button>
);

export default ToggleButton;