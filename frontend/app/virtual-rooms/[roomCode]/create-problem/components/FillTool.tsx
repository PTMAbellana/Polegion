import React from "react";

export default function FillTool({
  fillMode,
  fillColor,
  setFillColor,
  FILL_COLORS,
  onClick,
  className = "",
  size = 64,
}: any) {
  return (
    <>
      <div
        className={className}
        style={{
          width: size,
          height: size,
          border: `6px solid #000`,
          borderRadius: "50%",
          background: fillColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          margin: "0 4px",
          boxSizing: "border-box",
        }}
        onClick={onClick}
        title="Fill Tool"
      >
        <span style={{ color: "#2c514c", fontWeight: 700, fontSize: 18 }}>Fill</span>
      </div>
      {fillMode && (
        <div className="fillPalette" style={{
          position: "absolute",
          left: 32,
          top: 240,
          zIndex: 20,
          display: "flex",
          gap: 8,
          background: "#fff",
          borderRadius: 12,
          padding: 8,
          boxShadow: "0 2px 12px #0002"
        }}>
          {FILL_COLORS.map((color: string) => (
            <div
              key={color}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: color,
                border: color === fillColor ? "3px solid #000" : "2px solid #000",
                transform: color === fillColor ? "scale(1.1)" : "scale(1)",
                transition: "all 0.15s ease",
                boxShadow: color === fillColor ? "0 0 0 2px #fff, 0 0 8px rgba(0,0,0,0.2)" : "none"
              }}
              onClick={() => setFillColor(color)}
            />
          ))}
        </div>
      )}
    </>
  );
}