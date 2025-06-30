import React from "react";
import styles from "@/styles/create-problem.module.css";

export default function Timer({
  timerOpen,
  setTimerOpen,
  timerValue,
  setTimerValue,
}: any) {
  return (
    <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: 12, marginLeft: 12 }}>
      {!timerOpen ? (
        <button
          className={`${styles.addTimerBtn} ${styles.rowBtn}`}
          onClick={() => setTimerOpen(true)}
        >
          Add Timer
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontWeight: 500, fontSize: "0.85rem", marginLeft: 4, marginBottom: 2 }}>
            Timer
          </span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              min={5}
              value={timerValue}
              onChange={e => setTimerValue(Math.max(5, Number(e.target.value)))}
              style={{
                width: 60,
                fontSize: 16,
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #aaa",
                marginRight: 8,
              }}
            />
            <span style={{ marginRight: 8 }}>seconds</span>
            <button
              style={{
                background: "#fabc60",
                border: "1px solid #000",
                borderRadius: 4,
                padding: "2px 10px",
                fontWeight: 600,
                cursor: "pointer",
                marginRight: 4,
              }}
              onClick={() => setTimerOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </span>
  );
}