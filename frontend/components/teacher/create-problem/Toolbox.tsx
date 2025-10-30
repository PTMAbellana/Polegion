import React, { useState, useEffect } from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import Filters from "./Filters";
import { ToolboxProps } from "@/types";

const Toolbox: React.FC<ToolboxProps> = ({
  selectedTool,
  setSelectedTool,
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
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCompact(window.innerWidth <= 1200);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDragStartInternal = (type: string) => (e: React.DragEvent) => {
    if (shapes.length >= 1) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("shape-type", type);
  };

  return (
    <div className={`${styles.toolbox} ${isCompact ? styles.toolboxCompact : ''}`}>
      <div className={styles.toolboxHeader}>
        {isCompact ? "Tools" : "Tool Box"}
      </div>

      <div className={styles.toolboxSingleColumn}>
        <div className={styles.toolboxSection}>
          <div className={styles.sectionHeader}>Shapes</div>
          
          <div className={styles.shapesGrid}>
            {/* Circle */}
            <div
              className={`${styles.toolboxCircle} ${selectedTool === "circle" ? styles.selected : ''}`}
              draggable={shapes.length < 1}
              onDragStart={handleDragStartInternal("circle")}
              onClick={() => shapes.length < 1 && setSelectedTool("circle")}
              style={{
                cursor: shapes.length >= 1 ? "not-allowed" : "pointer",
                opacity: shapes.length >= 1 ? 0.5 : 1,
              }}
              title={shapes.length >= 1 ? "Shape limit reached" : "Circle"}
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="#e3dcc2"
                  stroke={selectedTool === "circle" ? "#ffffff" : "#000"}
                  strokeWidth="8"
                />
              </svg>
            </div>

            {/* Square */}
            <div
              className={`${styles.toolboxSquare} ${selectedTool === "square" ? styles.selected : ''}`}
              draggable={shapes.length < 1}
              onDragStart={handleDragStartInternal("square")}
              onClick={() => shapes.length < 1 && setSelectedTool("square")}
              style={{
                cursor: shapes.length >= 1 ? "not-allowed" : "pointer",
                opacity: shapes.length >= 1 ? 0.5 : 1,
              }}
              title={shapes.length >= 1 ? "Shape limit reached" : "Square"}
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <rect
                  x="10"
                  y="10"
                  width="100"
                  height="100"
                  fill="#e3dcc2"
                  stroke={selectedTool === "square" ? "#ffffff" : "#000"}
                  strokeWidth="8"
                />
              </svg>
            </div>

            {/* Triangle */}
            <div
              className={`${styles.toolboxTriangle} ${selectedTool === "triangle" ? styles.selected : ''}`}
              draggable={shapes.length < 1}
              onDragStart={handleDragStartInternal("triangle")}
              onClick={() => shapes.length < 1 && setSelectedTool("triangle")}
              style={{
                cursor: shapes.length >= 1 ? "not-allowed" : "pointer",
                opacity: shapes.length >= 1 ? 0.5 : 1,
              }}
              title={shapes.length >= 1 ? "Shape limit reached" : "Triangle"}
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <polygon
                  points="60,10 10,110 110,110"
                  fill="#e3dcc2"
                  stroke={selectedTool === "triangle" ? "#ffffff" : "#000"}
                  strokeWidth="8"
                />
              </svg>
            </div>

            {/* Empty slot */}
            <div className={styles.emptyShapeSlot}>
              <span className={styles.plusIcon}>Soon</span>
            </div>
          </div>

          {shapes.length >= 1 && (
            <div className={styles.shapeLimitIndicator}>
              ⚠️ Shape limit reached
            </div>
          )}
        </div>

        <div className={styles.toolboxSection}>
          <div className={styles.sectionHeader}>Properties</div>
          <div className={styles.filtersWrapper}>
            <Filters
              shapes={shapes}
              showSides={showSides}
              setShowSides={setShowSides}
              showAngles={showAngles}
              setShowAngles={setShowAngles}
              showAreaByShape={showAreaByShape}
              setShowAreaByShape={setShowAreaByShape}
              showHeight={showHeight}
              setShowHeight={setShowHeight}
              showDiameter={showDiameter}
              setShowDiameter={setShowDiameter}
              showCircumference={showCircumference}
              setShowCircumference={setShowCircumference}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
