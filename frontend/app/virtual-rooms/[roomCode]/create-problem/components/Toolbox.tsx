import React, { useState } from "react";
import styles from "@/styles/create-problem.module.css";
import ToggleButton from "./ToggleButton";
import ToggleSwitch from "./ToggleSwitch";

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
}) => {
  // Dropdown open/close state for each shape
  const [openSquare, setOpenSquare] = useState(false);
  const [openCircle, setOpenCircle] = useState(false);
  const [openTriangle, setOpenTriangle] = useState(false);

  return (
    <div className={styles.toolbox}>
      <div className={styles.toolboxHeader}>Tool Box</div>
      <div className={styles.toolboxContent}>
        {/* Row: Square and Circle */}
        <div className={styles.toolboxRow}>
          {/* Square */}
          <div
            className={styles.toolboxSquare}
            draggable
            onDragStart={(e) => handleDragStart("square")(e)}
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
          {/* Circle */}
          <div
            className={styles.toolboxCircle}
            draggable
            onDragStart={(e) => handleDragStart("circle")(e)}
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
        {/* Row: Triangle and Fill Tool */}
        <div className={styles.toolboxRow} style={{ marginTop: 24 }}>
          {/* Triangle */}
          <div
            className={styles.toolboxTriangle}
            draggable
            onDragStart={(e) => handleDragStart("triangle")(e)}
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
          {/* Fill Tool */}
          <button
            type="button"
            className={`${styles.fillButton} ${
              fillMode ? styles.active : ""
            }`}
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
            {FILL_COLORS.map((color) => (
              <div
                key={color}
                className={styles.fillColor}
                style={{
                  background: color,
                  border:
                    color === fillColor
                      ? "3px solid #000"
                      : "2px solid #000",
                  transform:
                    color === fillColor ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.15s ease",
                  boxShadow:
                    color === fillColor
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
      
      {/* Filter groups for each shape */}
      <div className={styles.filterGroupsGrid}>
        {/* Square Filter Group */}
        <div className={styles.filterGroup}>
          <div
            className={styles.filterGroupHeader}
            onClick={() => setOpenSquare((v) => !v)}
          >
            Square Filter
            <span>{openSquare ? "▲" : "▼"}</span>
          </div>
          {openSquare && (
            <div className={styles.filterDropdown}>
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
                checked={showArea}
                onChange={() => setShowArea((v) => !v)}
                label="Show Area"
              />
            </div>
          )}
        </div>

        {/* Circle Filter Group */}
        <div className={styles.filterGroup}>
          <div
            className={styles.filterGroupHeader}
            onClick={() => setOpenCircle((v) => !v)}
          >
            Circle Filter
            <span>{openCircle ? "▲" : "▼"}</span>
          </div>
          {openCircle && (
            <div className={styles.filterDropdown}>
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
              <ToggleSwitch
                checked={showArea}
                onChange={() => setShowArea((v) => !v)}
                label="Show Area"
              />
            </div>
          )}
        </div>

        {/* Triangle Filter Group */}
        <div className={styles.filterGroup}>
          <div
            className={styles.filterGroupHeader}
            onClick={() => setOpenTriangle((v) => !v)}
          >
            Triangle Filter
            <span>{openTriangle ? "▲" : "▼"}</span>
          </div>
          {openTriangle && (
            <div className={styles.filterDropdown}>
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
                checked={showArea}
                onChange={() => setShowArea((v) => !v)}
                label="Show Area"
              />
              <ToggleSwitch
                checked={showHeight}
                onChange={() => setShowHeight((v) => !v)}
                label="Show Height"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbox;