import styles from "@/styles/create-problem.module.css";
import React from "react";

interface ToolboxProps {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  handleDragStart: (type: string) => void;
  fillColor: string;
  fillMode: boolean;
  setFillMode: (mode: boolean) => void;
  handleFillDragStart: (e: React.DragEvent) => void;
  handleFillDragEnd: () => void;
  FILL_COLORS: string[];
  setFillColor: (color: string) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({
  selectedTool,
  setSelectedTool,
  handleDragStart,
  fillColor,
  fillMode,
  setFillMode,
  handleFillDragStart,
  handleFillDragEnd,
  FILL_COLORS,
  setFillColor,
}) => (
  <div className={styles.toolbox}>
    <div className={styles.toolboxHeader}></div>
    <div className={styles.toolboxContent}>
      {/* Row: Square and Circle */}
      <div className={styles.toolboxRow}>
        <div
          className={styles.toolboxSquare}
          draggable
          onDragStart={() => handleDragStart("square")}
          onClick={() => setSelectedTool("square")}
          style={{
            background: "#e3dcc2",
            border: "6px solid #000",
            borderRadius: 0,
            width: 100,
            height: 100,
            marginRight: 16,
            position: "static",
            cursor: "pointer",
            transform: selectedTool === "square" ? "scale(1.05)" : "scale(1)",
            boxShadow: selectedTool === "square"
              ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)"
              : "none",
            opacity: selectedTool === "square" ? 1 : 0.8,
            transition: "all 0.2s ease",
          }}
        />
        <div
          className={styles.toolboxCircle}
          draggable
          onDragStart={() => handleDragStart("circle")}
          onClick={() => setSelectedTool("circle")}
          style={{
            background: "#e3dcc2",
            border: "6px solid #000",
            borderRadius: "50%",
            width: 100,
            height: 100,
            position: "static",
            cursor: "pointer",
            transform: selectedTool === "circle" ? "scale(1.05)" : "scale(1)",
            boxShadow: selectedTool === "circle"
              ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)"
              : "none",
            opacity: selectedTool === "circle" ? 1 : 0.8,
            transition: "all 0.2s ease",
          }}
        />
      </div>
      {/* Row: Triangle and Fill Tool */}
      <div className={styles.toolboxRow} style={{ marginTop: 24 }}>
        <div
          className={styles.toolboxTriangle}
          draggable
          onDragStart={() => handleDragStart("triangle")}
          onClick={() => setSelectedTool("triangle")}
          style={{
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 24,
            position: "static",
            cursor: "pointer",
            transform: selectedTool === "triangle" ? "scale(1.05)" : "scale(1)",
            boxShadow: selectedTool === "triangle"
              ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)"
              : "none",
            opacity: selectedTool === "triangle" ? 1 : 0.8,
            transition: "all 0.2s ease",
          }}
        >
          <svg width={100} height={100}>
            <polygon
              points="50,10 10,90 90,90"
              fill="#e3dcc2"
              stroke="#000"
              strokeWidth="6"
            />
          </svg>
        </div>
        {/* Fill Tool */}
        <div
          className={`${styles.shapeFillTool} shapeFillTool`}
          style={{
            background: fillColor,
            border: "5px solid #000",
            width: 80,
            height: 80,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: fillMode ? "grab" : "pointer",
            position: "relative",
            boxShadow: fillMode
              ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)"
              : "none",
            opacity: fillMode ? 1 : 0.8,
            transform: fillMode ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
          onClick={e => {
            e.stopPropagation();
            setFillMode(!fillMode);
          }}
          draggable={fillMode}
          onDragStart={e => {
            if (fillMode) {
              handleFillDragStart(e);
            } else {
              e.preventDefault();
            }
          }}
          onDragEnd={handleFillDragEnd}
          title={
            fillMode
              ? "Drag to fill shapes or click outside to close"
              : "Click to activate fill mode"
          }
        >
          {/* Paint bucket icon with dynamic styling */}
          <svg width="40" height="40" viewBox="0 0 40 40">
            <g>
              <rect
                x="10"
                y="20"
                width="20"
                height="12"
                rx="4"
                fill="#fff"
                stroke="#222"
                strokeWidth="2"
                opacity={fillMode ? 1 : 0.9}
              />
              <rect
                x="18"
                y="8"
                width="4"
                height="16"
                rx="2"
                fill="#fff"
                stroke="#222"
                strokeWidth="2"
                transform="rotate(-30 20 16)"
                opacity={fillMode ? 1 : 0.9}
              />
              <ellipse
                cx="20"
                cy="34"
                rx="8"
                ry="3"
                fill={fillColor}
                stroke="#222"
                strokeWidth="2"
              />
            </g>
          </svg>
          <span
            style={{
              position: "absolute",
              bottom: 6,
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 700,
              color: "#222",
              fontSize: 14,
              textShadow: "0 1px 2px #fff",
              opacity: fillMode ? 1 : 0.8,
            }}
          >
            Fill
          </span>
          {/* Active indicator */}
          {fillMode && (
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 12,
                height: 12,
                background: "#4CAF50",
                borderRadius: "50%",
                border: "2px solid #fff",
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
              }}
            />
          )}
        </div>
      </div>
      {/* Color Palette (show when fillMode is active) */}
      {fillMode && (
        <div className={`${styles.fillPalette} fillPalette`}>
          {FILL_COLORS.map(color => (
            <div
              key={color}
              className={styles.fillColor}
              style={{
                background: color,
                border: color === fillColor ? "3px solid #000" : "2px solid #000",
                transform: color === fillColor ? "scale(1.1)" : "scale(1)",
                transition: "all 0.15s ease",
                boxShadow: color === fillColor
                  ? "0 0 0 2px #fff, 0 0 8px rgba(0,0,0,0.2)"
                  : "none",
              }}
              onClick={e => {
                e.stopPropagation();
                setFillColor(color);
              }}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

export default Toolbox;