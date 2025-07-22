import React from "react";
import styles from "@/styles/create-problem.module.css";

export default function SetVisibility({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
}) {
  return (
    <button
      className={`${styles.setVisibilityBtn} ${styles.rowBtn}`}
      style={{
        background: visible ? "#8bc34a" : "#e57373",
        color: "#fff",
        fontWeight: "bold",
        transition: "background 0.2s",
        userSelect: "none",
      }}
      onClick={() => setVisible(v => !v)}
    >
      {visible ? "Visible" : "Hide"}
    </button>
  );
}