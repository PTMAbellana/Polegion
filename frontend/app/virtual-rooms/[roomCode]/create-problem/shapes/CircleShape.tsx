import React from "react";

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
}: any) {
  const size = shape.size;
  const labelYOffset = -size * 0.18;
  const r = size / 2;
  const handleX = size - 9;
  const handleY = r - 9;

  const diameter = size;
  const circumference = 2 * Math.PI * (size / 2);
  const area = Math.PI * Math.pow(size / 2, 2);

  const showDiameter = true;
  const showCircumference = true;
  const showArea = true;

  return (
    <div
      style={{
        position: "absolute",
        left: shape.x,
        top: shape.y,
        width: size,
        height: size,
        cursor: "move",
        zIndex: isSelected ? 10 : 2,
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
                y1={size / 2}
                x2={size}
                y2={size / 2}
                stroke="#222"
                strokeWidth={3}
              />
            </svg>
            {/* Side handle (resize) */}
            <div
              style={{
                position: "absolute",
                left: handleX,
                top: handleY,
                width: 18,
                height: 18,
                background: "#fabc60",
                borderRadius: "50%",
                zIndex: 20,
                border: "2px solid #000",
                boxShadow: "0 0 4px #0002",
                cursor: "ew-resize",
                transition: "cursor 0.1s",
              }}
              onMouseDown={(e) => handleCircleResizeMouseDown(shape.id, e)}
              title="Drag horizontally to resize"
            />
            {/* Diameter label */}
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: `calc(50% + ${labelYOffset}px)`,
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
              {pxToUnits(size)}
            </span>
            {/* Additional Info */}
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
                Diameter: {diameter.toFixed(1)}
              </div>
            )}
            {showCircumference && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `calc(50% + ${labelYOffset}px + 40px)`,
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
                Circumference: {circumference.toFixed(1)}
              </div>
            )}
            {showArea && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `calc(50% + ${labelYOffset}px + 60px)`,
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
                Area: {area.toFixed(1)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}