import React, { useState, useEffect } from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { LimitAttemptsProps } from "@/types/props/problem";

const LimitAttempts: React.FC<LimitAttemptsProps> = ({
  limit,
  setLimit,
}) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(limit ?? 1);

  // Sync input state with limit prop when it changes
  useEffect(() => {
    setInput(limit ?? 1);
  }, [limit]);

  const handleSave = () => {
    setLimit(input);
    setEditing(false);
  };

  return !editing ? (
    <button
      className={`${styles.limitedAttemptsBtn} ${styles.rowBtn}`}
      onClick={() => {
        setInput(limit ?? 1);
        setEditing(true);
      }}
    >
      Limit Attempts ({limit ?? 1})
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
          onBlur={handleSave}
          autoFocus
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Save and Close"
          onClick={handleSave}
          tabIndex={0}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LimitAttempts;
