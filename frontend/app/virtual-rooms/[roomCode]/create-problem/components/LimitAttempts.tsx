import React, { useState } from "react";
import styles from "@/styles/create-problem.module.css";

export default function LimitAttempts({
  limit,
  setLimit,
}: {
  limit: number | null;
  setLimit: (n: number | null) => void;
}) {
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 500, marginLeft: 4, marginBottom: 2 }}>
        Attempts
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          min={1}
          className={styles.hintInput}
          value={input}
          onChange={e => setInput(Number(e.target.value))}
          style={{ width: 60 }}
          autoFocus
          onBlur={() => {
            // Do not close on blur, only on close button or Enter
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              setLimit(input);
              setEditing(false);
            }
          }}
        />
        <button
            type="button"
            style={{
                background: "#fabc60",
                border: "1px solid #000",
                borderRadius: 4,
                padding: "2px 10px",
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: 4
            }}
            aria-label="Cancel"
            onClick={() => setEditing(false)}
            tabIndex={0}
        >
          ✕
        </button>
      </div>
    </div>
  );
}