import React from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { SetVisibilityProps } from "@/types";

const SetVisibility: React.FC<SetVisibilityProps> = ({
  visible,
  setVisible,
}) => {
  return (
    <button
      className={`${styles.setVisibilityBtn} ${styles.rowBtn}`}
      style={{
        background: visible ? "#8bc34a" : "#e57373",
        color: "#fff",
      }}
      onClick={() => setVisible(!visible)}
    >
      {visible ? "Visible" : "Hide"}
    </button>
  );
};

export default SetVisibility;
