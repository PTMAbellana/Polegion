import React from "react";
import styles from "@/styles/create-problem.module.css";

interface ToolboxProps {
  fillMode: boolean;
  setFillMode: (mode: boolean) => void;
  fillColor: string;
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  handleDragStart: (type: string) => void;
  FILL_COLORS: string[];
  setFillColor: (color: string) => void;
  showProperties: boolean;
  setShowProperties: (show: boolean) => void;
  showSides: boolean;
  setShowSides: (show: boolean) => void;
  showAngles: boolean;
  setShowAngles: (show: boolean) => void;
  showArea: boolean;
  setShowArea: (show: boolean) => void;
  showHeight: boolean;
  setShowHeight: (show: boolean) => void;
  showDiameter: boolean;
  setShowDiameter: (show: boolean) => void;
  showCircumference: boolean;
  setShowCircumference: (show: boolean) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({
  fillMode,
  setFillMode,
  fillColor,
  selectedTool,
  setSelectedTool,
  handleDragStart,
  FILL_COLORS,
  setFillColor,
  showProperties,
  setShowProperties,
  showSides,
  setShowSides,
  showAngles,
  setShowAngles,
  showArea,
  setShowArea,
  showHeight,
  setShowHeight,
  showDiameter,
  setShowDiameter,
  showCircumference,
  setShowCircumference,
}) => (
  <div className={styles.toolbox}>
    <div className={styles.toolboxHeader}>Tool Box</div>
    <div className={styles.toolboxContent}>
      {/* Row: Square and Circle */}
      <div className={styles.toolboxRow}>
        <div
          className={styles.toolboxSquare}
          draggable
          onDragStart={handleDragStart("square")}
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
        <button
          type="button"
          className={`${styles.fillButton} ${fillMode ? styles.active : ""}`}
          onClick={() => setFillMode(!fillMode)}
          tabIndex={0}
          style={{
            width: 102,
            height: 90,
            position: "relative",
            cursor: "pointer",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={styles.fillToolLogo}>
            <div className={styles.bucket}>
              <span
                className={styles.label}
                style={fillMode ? { color: "#fff" } : { color: fillColor }}
              >
                FILL
              </span>
            </div>
            <div
              className={styles.droplet}
              style={{
                ["--fillColor" as any]: fillColor,
                opacity: fillMode ? 1 : undefined,
              }}
            ></div>
          </div>
        </button>
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
    <button
      className={styles.showPropertiesBtn}
      onClick={() => setShowSides(v => !v)}
      style={{
        marginTop: 24,
        padding: "8px 16px",
        borderRadius: 8,
        background: showSides ? "#2c514c" : "#e3dcc2",
        color: showSides ? "#fff" : "#222",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
    >
      {showSides ? "Hide Sides" : "Show Sides"}
    </button>
    <button
      className={styles.showPropertiesBtn}
      onClick={() => setShowAngles(v => !v)}
      style={{
        marginTop: 8,
        padding: "8px 16px",
        borderRadius: 8,
        background: showAngles ? "#2c514c" : "#e3dcc2",
        color: showAngles ? "#fff" : "#222",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
    >
      {showAngles ? "Hide Angles" : "Show Angles"}
    </button>
    <button
      className={styles.showPropertiesBtn}
      onClick={() => setShowArea(v => !v)}
      style={{
        marginTop: 8,
        padding: "8px 16px",
        borderRadius: 8,
        background: showArea ? "#2c514c" : "#e3dcc2",
        color: showArea ? "#fff" : "#222",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
    >
      {showArea ? "Hide Area" : "Show Area"}
    </button>
    <button
      className={styles.showPropertiesBtn}
      onClick={() => setShowHeight(v => !v)}
      style={{
        marginTop: 8,
        padding: "8px 16px",
        borderRadius: 8,
        background: showHeight ? "#2c514c" : "#e3dcc2",
        color: showHeight ? "#fff" : "#222",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
    >
      {showHeight ? "Hide Height" : "Show Height"}
    </button>
    <button
      className={styles.showPropertiesBtn}
      onClick={() => setShowDiameter(v => !v)}
      style={{
        marginTop: 8,
        padding: "8px 16px",
        borderRadius: 8,
        background: showDiameter ? "#2c514c" : "#e3dcc2",
        color: showDiameter ? "#fff" : "#222",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
    >
      {showDiameter ? "Hide Diameter" : "Show Diameter"}
    </button>
    <button
      className={styles.showPropertiesBtn}
      onClick={() => setShowCircumference(v => !v)}
      style={{
        marginTop: 8,
        padding: "8px 16px",
        borderRadius: 8,
        background: showCircumference ? "#2c514c" : "#e3dcc2",
        color: showCircumference ? "#fff" : "#222",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
    >
      {showCircumference ? "Hide Circumference" : "Show Circumference"}
    </button>
  </div>
);

export default Toolbox;