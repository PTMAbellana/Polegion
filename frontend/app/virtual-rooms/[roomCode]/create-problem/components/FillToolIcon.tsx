import React from "react";
import styles from "@/styles/create-problem.module.css";

interface FillToolIconProps {
  fillColor?: string;
  style?: React.CSSProperties;
}

const FillToolIcon: React.FC<FillToolIconProps> = ({ fillColor = "#1e90ff", style }) => (
  <div className={styles.fillToolLogo} style={style}>
    <div className={styles.bucket}>
      <span
        className={styles.label}
        style={{ color: fillColor }}
      >
        FILL
      </span>
    </div>
    <div
      className={styles.droplet}
      style={{ ["--fillColor" as any]: fillColor }}
    ></div>
  </div>
);

export default FillToolIcon;