import React, { useState } from "react";
import styles from "@/styles/create-problem-teacher.module.css";

interface LimitAttemptsProps {
  limit: number | null;
  setLimit: (n: number | null) => void;
}

const LimitAttempts: React.FC<LimitAttemptsProps> = ({
  limit,
  setLimit,
}) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(limit ?? 1);

  return !editing ? (
    <button
      className={`${styles.limitedAttemptsBtn} ${styles.rowBtn}`}
      onClick={() => setEditing(true)}
    >
      Limit Attempts
    </button>
  ) : (
    <div className={styles.timerContainer}>
      <span className={styles.controlLabel}>Attempts</span>
      <div className={styles.timerInputGroup}>
        <input
          type="number"
          min={1}
          className={styles.timerInput}
          value={input}
          onChange={e => setInput(Number(e.target.value))}
          autoFocus
          onKeyDown={e => {
            if (e.key === "Enter") {
              setLimit(input);
              setEditing(false);
            }
          }}
        />
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Cancel"
          onClick={() => setEditing(false)}
          tabIndex={0}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LimitAttempts;
