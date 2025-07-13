import React from "react";
import styles from "@/styles/create-problem.module.css";
import ToggleSwitch from "./ToggleSwitch";

interface ToolboxProps {
  fillMode: boolean;
  setFillMode: (mode: boolean) => void;
  fillColor: string;
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  handleDragStart: (type: string) => (e: React.DragEvent) => void;
  FILL_COLORS: string[];
  setFillColor: (color: string) => void;
  showProperties: boolean;
  setShowProperties: (show: boolean) => void;

  // These are still global (used for square and triangle)
  showSides: boolean;
  setShowSides: (show: boolean) => void;
  showAngles: boolean;
  setShowAngles: (show: boolean) => void;

  // Area is now per shape
  showAreaByShape: {
    circle: boolean;
    triangle: boolean;
    square: boolean;
  };
  setShowAreaByShape: React.Dispatch<React.SetStateAction<{
    circle: boolean;
    triangle: boolean;
    square: boolean;
  }>>;

  // Circle-specific
  showDiameter: boolean;
  setShowDiameter: (show: boolean) => void;
  showCircumference: boolean;
  setShowCircumference: (show: boolean) => void;

  // Triangle-specific
  showHeight: boolean;
  setShowHeight: (show: boolean) => void;

  shapes: any[];
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
  showAreaByShape,
  setShowAreaByShape,
  showHeight,
  setShowHeight,
  showDiameter,
  setShowDiameter,
  showCircumference,
  setShowCircumference,
  shapes,
}) => {
  return (
    <div className={styles.toolbox}>
      <div className={styles.toolboxHeader}>Tool Box</div>

      <div className={styles.toolboxContent}>
        {/* Row 1: Square + Circle */}
        <div className={styles.toolboxRow}>
          <div
            className={styles.toolboxSquare}
            draggable
            onDragStart={handleDragStart("square")}
            onClick={() => setSelectedTool("square")}
            style={{
              background: "#e3dcc2",
              border: selectedTool === "square" ? "6px solid #1e90ff" : "6px solid #000",
              borderRadius: 0,
              width: 100,
              height: 100,
              marginRight: 16,
              position: "static",
              cursor: "pointer",
              transform: selectedTool === "square" ? "scale(1.05)" : "scale(1)",
              opacity: selectedTool === "square" ? 1 : 0.8,
              transition: "all 0.2s ease",
            }}
          />

          <div
            className={styles.toolboxCircle}
            draggable
            onDragStart={handleDragStart("circle")}
            onClick={() => setSelectedTool("circle")}
            style={{
              background: "#e3dcc2",
              border: selectedTool === "circle" ? "6px solid #1e90ff" : "6px solid #000",
              borderRadius: "50%",
              width: 100,
              height: 100,
              position: "static",
              cursor: "pointer",
              transform: selectedTool === "circle" ? "scale(1.05)" : "scale(1)",
              opacity: selectedTool === "circle" ? 1 : 0.8,
              transition: "all 0.2s ease",
            }}
          />
        </div>

        {/* Row 2: Triangle + Fill */}
        <div className={styles.toolboxRow} style={{ marginTop: 24 }}>
          <div
            className={styles.toolboxTriangle}
            draggable
            onDragStart={handleDragStart("triangle")}
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
              opacity: selectedTool === "triangle" ? 1 : 0.8,
              transition: "all 0.2s ease",
            }}
          >
            <svg width={100} height={100}>
              <polygon
                points="50,10 10,90 90,90"
                fill="#e3dcc2"
                stroke={selectedTool === "triangle" ? "#1e90ff" : "#000"}
                strokeWidth="6"
              />
            </svg>
          </div>

          {/* <button
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
          </button> */}
        </div>

        {/* Fill Color Palette */}
        {fillMode && (
          <div className={`${styles.fillPalette} fillPalette`}>
            {FILL_COLORS.map((color) => (
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
                onClick={(e) => {
                  e.stopPropagation();
                  setFillColor(color);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shape Filters */}
      {shapes.length > 0 && (() => {
        const hasCircle = shapes.some((s) => s.type === "circle");
        const hasSquare = shapes.some((s) => s.type === "square");
        const hasTriangle = shapes.some((s) => s.type === "triangle");

        return (
          <div className={styles.filterGroup} style={{ marginTop: 20 }}>
            <h4 className={styles.filterGroupHeader}>Shape Filters</h4>

            {hasSquare && (
              <>
                <ToggleSwitch
                  checked={showAreaByShape.square}
                  onChange={() =>
                    setShowAreaByShape((prev) => ({ ...prev, square: !prev.square }))
                  }
                  label="Show Area (Square)"
                />
                <ToggleSwitch
                  checked={showSides}
                  onChange={() => setShowSides((v) => !v)}
                  label="Show Sides"
                />
                <ToggleSwitch
                  checked={showAngles}
                  onChange={() => setShowAngles((v) => !v)}
                  label="Show Angles"
                />
              </>
            )}

            {hasTriangle && (
              <>
                <ToggleSwitch
                  checked={showAreaByShape.triangle}
                  onChange={() =>
                    setShowAreaByShape((prev) => ({ ...prev, triangle: !prev.triangle }))
                  }
                  label="Show Area (Triangle)"
                />
                <ToggleSwitch
                  checked={showSides}
                  onChange={() => setShowSides((v) => !v)}
                  label="Show Sides"
                />
                <ToggleSwitch
                  checked={showAngles}
                  onChange={() => setShowAngles((v) => !v)}
                  label="Show Angles"
                />
                <ToggleSwitch
                  checked={showHeight}
                  onChange={() => setShowHeight((v) => !v)}
                  label="Show Height"
                />
              </>
            )}

            {hasCircle && (
              <>
                <ToggleSwitch
                  checked={showAreaByShape.circle}
                  onChange={() =>
                    setShowAreaByShape((prev) => ({ ...prev, circle: !prev.circle }))
                  }
                  label="Show Area (Circle)"
                />
                <ToggleSwitch
                  checked={showDiameter}
                  onChange={() => setShowDiameter((v) => !v)}
                  label="Show Diameter"
                />
                <ToggleSwitch
                  checked={showCircumference}
                  onChange={() => setShowCircumference((v) => !v)}
                  label="Show Circumference"
                />
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default Toolbox;
