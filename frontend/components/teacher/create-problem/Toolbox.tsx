import React, { useState, useEffect } from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { ToolboxProps } from "@/types";

const Toolbox: React.FC<ToolboxProps> = ({
  selectedTool,
  setSelectedTool,
  shapes,
  showSides,
  setShowSides,
  showAngles,
  setShowAngles,
  showHeight,
  setShowHeight,
  showDiameter,
  setShowDiameter,
  showCircumference,
  setShowCircumference,
  showLength,
  setShowLength,
  showMidpoint,
  setShowMidpoint,
  showMeasurement,
  setShowMeasurement,
  showArcRadius,
  setShowArcRadius,
  showAreaByShape,
  setShowAreaByShape,
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
    // Note: shape limit is enforced in MainArea, not here
    e.dataTransfer.setData("shape-type", type);
  };

  return (
    <div className={`${styles.toolbox} ${isCompact ? styles.toolboxCompact : ''}`}>
      <div className={styles.toolboxHeader}>
        {isCompact ? "Tools" : "Tool Box"}
      </div>

      {/* Instructions */}
      <div className={styles.toolboxInstructions}>
        <div className={styles.instructionsTitle}>How to use:</div>
        <ul className={styles.instructionsList}>
          <li>Drag shapes/tools to the Main Area</li>
          <li>To delete: drag outside or press Delete/Backspace</li>
          <li>Click to select and view properties</li>
        </ul>
      </div>

      <div className={styles.toolboxSingleColumn}>
        <div className={styles.toolboxSection}>
          <div className={styles.sectionHeader}>Shapes</div>
          
          <div className={styles.shapesGrid}>
            {/* Circle */}
            <div
              className={`${styles.toolboxCircle} ${selectedTool === "circle" ? styles.selected : ''}`}
              draggable={true}
              onDragStart={handleDragStartInternal("circle")}
              onClick={() => setSelectedTool("circle")}
              style={{
                cursor: "grab",
                opacity: 1,
              }}
              title="Circle - Drag to Main Area"
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="#e3dcc2"
                  stroke="#000"
                  strokeWidth="8"
                />
              </svg>
            </div>

            {/* Square */}
            <div
              className={`${styles.toolboxSquare} ${selectedTool === "square" ? styles.selected : ''}`}
              draggable={true}
              onDragStart={handleDragStartInternal("square")}
              onClick={() => setSelectedTool("square")}
              style={{
                cursor: "grab",
                opacity: 1,
              }}
              title="Quadrilateral - Drag to Main Area"
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <rect
                  x="10"
                  y="10"
                  width="100"
                  height="100"
                  fill="#e3dcc2"
                  stroke="#000"
                  strokeWidth="8"
                />
              </svg>
            </div>

            {/* Triangle */}
            <div
              className={`${styles.toolboxTriangle} ${selectedTool === "triangle" ? styles.selected : ''}`}
              draggable={true}
              onDragStart={handleDragStartInternal("triangle")}
              onClick={() => setSelectedTool("triangle")}
              style={{
                cursor: "grab",
                opacity: 1,
              }}
              title="Triangle - Drag to Main Area"
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <polygon
                  points="60,10 10,110 110,110"
                  fill="#e3dcc2"
                  stroke="#000"
                  strokeWidth="8"
                />
              </svg>
            </div>

            {/* Line */}
            <div
              className={`${styles.toolboxLine} ${selectedTool === "line" ? styles.selected : ''}`}
              draggable={true}
              onDragStart={handleDragStartInternal("line")}
              onClick={() => setSelectedTool("line")}
              style={{
                cursor: "grab",
                opacity: 1,
              }}
              title="Line Segment - Drag to Main Area"
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <line
                  x1="15"
                  y1="60"
                  x2="105"
                  y2="60"
                  stroke="#000"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="15" cy="60" r="8" fill="#000" />
                <circle cx="105" cy="60" r="8" fill="#000" />
              </svg>
            </div>

            {/* Angle */}
            <div
              className={`${styles.toolboxAngle} ${selectedTool === "angle" ? styles.selected : ''}`}
              draggable={true}
              onDragStart={handleDragStartInternal("angle")}
              onClick={() => setSelectedTool("angle")}
              style={{
                cursor: "grab",
                opacity: 1,
              }}
              title="Angle - Drag to Main Area"
            >
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <path
                  d="M 48,90 A 28,28 0 0,0 35,66"
                  fill="none"
                  stroke="#2c514c"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <line x1="20" y1="90" x2="100" y2="90" stroke="#000" strokeWidth="8" strokeLinecap="round" />
                <line x1="20" y1="90" x2="70" y2="20" stroke="#000" strokeWidth="8" strokeLinecap="round" />
                <circle cx="20" cy="90" r="8" fill="#000" />
              </svg>
            </div>
          </div>

          <div className={styles.shapeCountIndicator}>
            Shapes: {shapes.length} / 5
          </div>
        </div>

        {/* Property Toggles */}
        {(setShowSides || setShowAngles || setShowHeight || setShowDiameter || 
          setShowCircumference || setShowLength || setShowMidpoint || 
          setShowMeasurement || setShowArcRadius || setShowAreaByShape) && (
          <div className={styles.toolboxSection}>
            <div className={styles.sectionHeader}>Show Properties</div>
            
            <div className={styles.propertyToggles}>
              {/* Line Properties */}
              {setShowLength && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showLength}
                    onChange={(e) => setShowLength(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Line Length</span>
                </label>
              )}
              
              {setShowMidpoint && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showMidpoint}
                    onChange={(e) => setShowMidpoint(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Line Midpoint</span>
                </label>
              )}

              {/* Angle Properties */}
              {setShowMeasurement && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showMeasurement}
                    onChange={(e) => setShowMeasurement(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Angle Measurement</span>
                </label>
              )}

              {/* Polygon Properties */}
              {setShowSides && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showSides}
                    onChange={(e) => setShowSides(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Side Lengths (Triangle & Quadrilateral)</span>
                </label>
              )}
              
              {setShowAngles && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showAngles}
                    onChange={(e) => setShowAngles(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Corner Angles (Triangle & Quadrilateral)</span>
                </label>
              )}
              
              {setShowHeight && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showHeight}
                    onChange={(e) => setShowHeight(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Triangle Height</span>
                </label>
              )}

              {/* Circle Properties */}
              {setShowDiameter && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showDiameter}
                    onChange={(e) => setShowDiameter(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Circle Diameter</span>
                </label>
              )}
              
              {setShowCircumference && (
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={showCircumference}
                    onChange={(e) => setShowCircumference(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <span>Circle Circumference</span>
                </label>
              )}

              {/* General Area */}
              {setShowAreaByShape && showAreaByShape && (
                <>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={showAreaByShape.circle}
                      onChange={(e) => setShowAreaByShape({ ...showAreaByShape, circle: e.target.checked })}
                      className={styles.toggleCheckbox}
                    />
                    <span>Circle Area</span>
                  </label>
                  
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={showAreaByShape.triangle}
                      onChange={(e) => setShowAreaByShape({ ...showAreaByShape, triangle: e.target.checked })}
                      className={styles.toggleCheckbox}
                    />
                    <span>Triangle Area</span>
                  </label>
                  
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={showAreaByShape.square}
                      onChange={(e) => setShowAreaByShape({ ...showAreaByShape, square: e.target.checked })}
                      className={styles.toggleCheckbox}
                    />
                    <span>Square Area</span>
                  </label>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbox;
