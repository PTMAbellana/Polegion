import React from "react";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

export default function CircleShape({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  handleShapeDrop,
  handleCircleResizeMouseDown,
  fillMode,
  draggingFill,
  scale,
  showDiameter,
  showCircumference,
  showArea,
}: any) {
  const size = shape.size;
  const labelYOffset = -size * 0.18;
  const r = size / 2;
  const handleX = size - 9;
  const handleY = r - 9;

  const unitLabel = typeof pxToUnits === "function" ? pxToUnits(size) : "0";
  const unitDiameter = parseFloat(unitLabel.toString().match(/[\d.]+/)?.[0] || "0");
  const unitRadius = unitDiameter / 2;
  const diameter = unitDiameter;
  const circumference = 2 * Math.PI * unitRadius;
  const area = Math.PI * Math.pow(unitRadius, 2);

  // Add snapping to move
  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startShape = { ...shape };

    function onMouseMove(me: MouseEvent) {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      const snappedX = snap(startShape.x + dx, 1);
      const snappedY = snap(startShape.y + dy, 1);
      shape.x = snappedX;
      shape.y = snappedY;
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {/* Main Circle Shape */}
      <div
        style={{
          position: "absolute",
          left: shape.x - size / 2,
          top: shape.y - size / 2,
          width: size,
          height: size,
          cursor: "move",
          zIndex: isSelected ? 10 : 2,
          userSelect: "none",
        }}
        onMouseDown={(e) => handleShapeMouseDown(shape.id, e)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(shape.id);
        }}
        onDragOver={(e) => {
          if (fillMode && draggingFill) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }
        }}
        onDrop={handleShapeDrop}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: shape.fill || "#e3dcc2",
            border: "6px solid #000",
            borderRadius: "50%",
            position: "relative",
          }}
        >
          {isSelected && (
            <>
              {/* Diameter line */}
              <svg
                width={size}
                height={size}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <line
                  x1={0}
                  y1={size / 2 - 4}
                  x2={size}
                  y2={size / 2 - 4}
                  stroke="#222"
                  strokeWidth={3}
                />
              </svg>

              {/* Resize handle */}
              <div
                style={{
                  position: "absolute",
                  left: handleX,
                  top: handleY,
                  width: 18,
                  height: 18,
                  background: "#2c514c",
                  border: "2px solid #fff",
                  borderRadius: "50%",
                  zIndex: 20,
                  boxShadow: "0 0 4px #0002",
                  cursor: "ew-resize",
                  transition: "cursor 0.1s",
                }}
                onMouseDown={(e) => handleCircleResizeMouseDown(shape.id, e)}
                title="Drag horizontally to resize"
              />
            </>
          )}

          {/* ✅ FIXED: Diameter Display at Center of Circle */}
          {isSelected && showDiameter && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: "white",
                border: "1px solid #1864ab",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#1864ab",
                zIndex: 15,
                whiteSpace: "nowrap",
                userSelect: "none",
                pointerEvents: "none",
                boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              Ø: {diameter.toFixed(2)} u
            </div>
          )}
        </div>
      </div>

      {/* ✅ FIXED: Area Display - Top Left of Main Area */}
      {isSelected && showArea && (
        <div
          style={{
            position: "absolute",
            left: "50px",
            top: "70px", // ✅ Fixed position - always at top
            background: "white",
            border: "2px solid #2c514c",
            borderRadius: "8px",
            padding: "10px 15px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#2c514c",
            zIndex: 1000,
            boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div style={{ marginBottom: "5px", fontSize: "11px", color: "#666" }}>
            Area Formula
          </div>
          <div style={{ fontSize: "10px", color: "#666", fontStyle: "italic", marginBottom: "3px" }}>
            A = π × r²
          </div>
          <div style={{ fontSize: "10px", color: "#1864ab", fontWeight: "600" }}>
            A = π × {unitRadius.toFixed(2)}² = {area.toFixed(2)} u²
          </div>
        </div>
      )}

      {/* ✅ FIXED: Circumference Display - Below Area */}
      {isSelected && showCircumference && (
        <div
          style={{
            position: "absolute",
            left: "50px",
            top: "160px", // ✅ Fixed position - always below area
            background: "white",
            border: "2px solid #ff6b35",
            borderRadius: "8px",
            padding: "10px 15px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#ff6b35",
            zIndex: 1000,
            boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div style={{ marginBottom: "5px", fontSize: "11px", color: "#666" }}>
            Circumference Formula
          </div>
          <div style={{ fontSize: "10px", color: "#666", fontStyle: "italic", marginBottom: "3px" }}>
            C = 2 × π × r
          </div>
          <div style={{ fontSize: "10px", color: "#ff6b35", fontWeight: "600" }}>
            C = 2 × π × {unitRadius.toFixed(2)} = {circumference.toFixed(2)} u
          </div>
        </div>
      )}
    </>
  );
}
