import React from "react";
import styles from "@/styles/problem-builder.module.css";

const LandscapePrompt: React.FC = () => {
  return (
    <div className={styles.landscapePrompt}>
      <div className={styles.landscapeIcon}>
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21l4-4 4 4" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <h2 className={styles.landscapeTitle}>Desktop Access Required</h2>
      <p className={styles.landscapeText}>
        Polegion requires a desktop or laptop computer for the best learning experience.
      </p>
      <div className={styles.landscapeHint}>
        Please access this application from a desktop or laptop device to continue.
      </div>
    </div>
  );
};

export default LandscapePrompt;
