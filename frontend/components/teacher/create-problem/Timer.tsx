import React from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { TimerProps } from "@/types";

const Timer: React.FC<TimerProps> = ({
  timerOpen,
  setTimerOpen,
  timerValue,
  setTimerValue,
}) => {
  return (
    <>
      {!timerOpen ? (
        <button
          className={`${styles.addTimerBtn} ${styles.rowBtn}`}
          onClick={() => setTimerOpen(true)}
        >
          Add Timer
        </button>
      ) : (
        <div className={styles.timerContainer}>
          <span className={styles.controlLabel}>Timer</span>
          <div className={styles.timerInputGroup}>
            <input
              type="number"
              min={5}
              value={timerValue}
              onChange={e => setTimerValue(Math.max(5, Number(e.target.value)))}
              className={styles.timerInput}
            />
            <span className={styles.timerUnit}>seconds</span>
            <button
              className={styles.closeButton}
              onClick={() => setTimerOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
