import React from "react";

export default function SquareShape({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  handleShapeDrop,
  handleSquareResize,
  fillMode,
  draggingFill,
}: any) {
  const width = shape.width ?? shape.size;
  const height = shape.height ?? shape.size;
  const labelOffset = 48;

  return (
    <div
      style={{
        position: "absolute",
        left: shape.x,
        top: shape.y,
        width,
        height,
        cursor: "move",
        zIndex: isSelected ? 10 : 2,
      }}
      onMouseDown={(e) => handleShapeMouseDown(shape.id, e)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(shape.id);
      }}
      onDragOver={e => {
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
          borderRadius: 0,
          position: "relative",
        }}
      >
        {isSelected && (
          <>
            {/* Top */}
            <span style={{
              position: "absolute",
              top: -labelOffset,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              boxShadow: "0 2px 6px #0001",
              whiteSpace: "nowrap"
            }}>{pxToUnits(width)}</span>
            {/* Bottom */}
            <span style={{
              position: "absolute",
              bottom: -labelOffset,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              boxShadow: "0 2px 6px #0001",
              whiteSpace: "nowrap"
            }}>{pxToUnits(width)}</span>
            {/* Left */}
            <span style={{
              position: "absolute",
              left: -labelOffset - 16,
              top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              boxShadow: "0 2px 6px #0001",
              whiteSpace: "nowrap"
            }}>{pxToUnits(height)}</span>
            {/* Right */}
            <span style={{
              position: "absolute",
              right: -labelOffset - 16,
              top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              background: "#fff",
              padding: "2px 8px",
              borderRadius: 6,
              border: "1px solid #aaa",
              fontSize: 14,
              boxShadow: "0 2px 6px #0001",
              whiteSpace: "nowrap"
            }}>{pxToUnits(height)}</span>
            {/* Resize handles */}
            {/* Top */}
            <div
              style={{
                position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                cursor: "ns-resize", zIndex: 20,
              }}
              onMouseDown={(e) => handleSquareResize(shape.id, "top", e)}
            />
            {/* Bottom */}
            <div
              style={{
                position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                cursor: "ns-resize", zIndex: 20,
              }}
              onMouseDown={(e) => handleSquareResize(shape.id, "bottom", e)}
            />
            {/* Left */}
            <div
              style={{
                position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
                width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                cursor: "ew-resize", zIndex: 20,
              }}
              onMouseDown={(e) => handleSquareResize(shape.id, "left", e)}
            />
            {/* Right */}
            <div
              style={{
                position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)",
                width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                cursor: "ew-resize", zIndex: 20,
              }}
              onMouseDown={(e) => handleSquareResize(shape.id, "right", e)}
            />
          </>
        )}
      </div>
    </div>
  );
}