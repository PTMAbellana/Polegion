import React from "react";

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
          style={{
            background: "#fabc60",
            border: "1px solid #000",
            borderRadius: 4,
            padding: "2px 10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => setTimerOpen(true)}
        >
          Add Timer
        </button>
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <span style={{ fontWeight: 500, marginRight: 8 }}>Timer:</span>
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
      )}
    </span>
  );
}