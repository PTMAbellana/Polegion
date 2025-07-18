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
      // Snap to 1 pixel (0.1 unit)
      const snappedX = snap(startShape.x + dx, 1);
      const snappedY = snap(startShape.y + dy, 1);
      shape.x = snappedX;
      shape.y = snappedY;
      // If you use setShapes, call setShapes here
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: shape.x - size / 2, // ✅ Center the circle horizontally
        top: shape.y - size / 2, // ✅ Center the circle vertically
        width: size,
        height: size,
        cursor: "move",
        zIndex: isSelected ? 10 : 2,
        userSelect: "none", // 👈 disables text selection for everything inside
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

        {/* Diameter label */}
        {showDiameter && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: `calc(50% + ${labelYOffset}px + 20px)`,
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              zIndex: 4,
              whiteSpace: "nowrap",
            }}
          >
            Ø: {diameter.toFixed(1)} u
          </div>
        )}

        {/* Circumference label */}
        {showCircumference && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: `calc(100% + 10px)`,
              transform: "translateX(-50%)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              zIndex: 4,
              whiteSpace: "nowrap",
            }}
          >
            C: {circumference.toFixed(1)} u
          </div>
        )}

        {/* Area label */}
        {isSelected && showArea && (
          <div
            style={{
              position: "absolute",
              left: "calc(100% + 20px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              zIndex: 4,
              whiteSpace: "nowrap",
            }}
          >
            A: {area.toFixed(1)} u²
          </div>
        )}
      </div>
    </div>
  );
}
