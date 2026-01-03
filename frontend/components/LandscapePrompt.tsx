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
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M12 19v2" />
          <path d="M8 21h8" />
          <path d="M7 12h10" />
          <path d="M7 9h10" />
        </svg>
        <div className={styles.rotateArrow}>⟲</div>
      </div>
      <h2 className={styles.landscapeTitle}>Please Rotate Your Device</h2>
      <p className={styles.landscapeText}>
        For the best experience with the Geometry Playground, please rotate your device to landscape mode.
      </p>
      <div className={styles.landscapeHint}>
        Landscape orientation provides more space to work with shapes and see their properties.
      </div>
    </div>
  );
};

export default LandscapePrompt;
