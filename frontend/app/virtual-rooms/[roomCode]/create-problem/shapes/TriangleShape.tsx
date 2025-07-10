import React from "react";

export default function TriangleShape({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  handleShapeDrop,
  handleResizeMouseDown,
  fillMode,
  draggingFill,
  showSides,
  showAngles,
  showArea,
  showHeight,
}: any) {
  const size = shape.size;
  const h = size * Math.sqrt(3) / 2;
  const stroke = 6;
  const pad = stroke;
  const svgWidth = size + pad * 2;
  const svgHeight = h + pad * 2;
  const points = [
    [svgWidth / 2, pad],                // top (A)
    [pad, h + pad],                     // bottom left (B)
    [size + pad, h + pad],              // bottom right (C)
  ];

  function dist(a: number[], b: number[]) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  }
  const sideLengths = [
    dist(points[0], points[1]), // AB (left)
    dist(points[1], points[2]), // BC (bottom)
    dist(points[2], points[0]), // CA (right)
  ];

  const midpoints = [
    [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2], // AB
    [(points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2], // BC
    [(points[2][0] + points[0][0]) / 2, (points[2][1] + points[0][1]) / 2], // CA
  ];

  function angleBetween(a: number[], b: number[]) {
    return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  }
  const angles = [
    angleBetween(points[0], points[1]), // AB (left)
    angleBetween(points[1], points[2]), // BC (bottom)
    angleBetween(points[2], points[0]), // CA (right)
  ];

  const labelRotations = [
    angles[0] + 180, // left side
    angles[1],       // bottom side
    angles[2] + 180, // right side
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: shape.x, // was: shape.x - pad
        top: shape.y, // was: shape.y - pad
        width: svgWidth,
        height: svgHeight,
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
      <svg width={svgWidth} height={svgHeight} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon
          points={points.map((p) => p.join(",")).join(" ")}
          fill={shape.fill || "#e3dcc2"}
          stroke="#000"
          strokeWidth={stroke}
          style={{
            filter: isSelected
              ? "drop-shadow(0 0 0 4px #fff) drop-shadow(0 0 0 8px rgba(0,0,0,0.2))"
              : "none",
            transition: "filter 0.2s",
          }}
        />
      </svg>
      {isSelected &&
        midpoints.map((m, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m[0],
              top: m[1],
              transform: `translate(-50%, -50%) rotate(${labelRotations[i]}deg)`,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                borderRadius: 6,
                border: "1px solid #aaa",
                fontSize: 14,
                boxShadow: "0 2px 6px #0001",
                padding: "2px 8px",
                width: "fit-content",
                whiteSpace: "nowrap",
                height: "24px",
                fontWeight: 400,
              }}
            >
              {pxToUnits(sideLengths[i])}
            </div>
          </div>
        ))}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            right: -10,
            bottom: -10,
            width: 16,
            height: 16,
            background: "#fabc60",
            border: "2px solid #000",
            borderRadius: 4,
            cursor: "nwse-resize",
            zIndex: 20,
          }}
          onMouseDown={(e) => handleResizeMouseDown(shape.id, e)}
        />
      )}
      {showSides && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            background: "#fff",
            borderRadius: 6,
            border: "1px solid #aaa",
            fontSize: 14,
            boxShadow: "0 2px 6px #0001",
            padding: "4px 8px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Sides: {sideLengths.map(pxToUnits).join(", ")}
        </div>
      )}
      {showAngles && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 20,
            background: "#fff",
            borderRadius: 6,
            border: "1px solid #aaa",
            fontSize: 14,
            boxShadow: "0 2px 6px #0001",
            padding: "4px 8px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Angles: {angles.map((a) => a.toFixed(1)).join(", ")}
        </div>
      )}
      {showArea && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 40,
            background: "#fff",
            borderRadius: 6,
            border: "1px solid #aaa",
            fontSize: 14,
            boxShadow: "0 2px 6px #0001",
            padding: "4px 8px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Area: {(0.5 * size * h).toFixed(1)} sq units
        </div>
      )}
      {showHeight && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 60,
            background: "#fff",
            borderRadius: 6,
            border: "1px solid #aaa",
            fontSize: 14,
            boxShadow: "0 2px 6px #0001",
            padding: "4px 8px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Height: {h.toFixed(1)} units
        </div>
      )}
    </div>
  );
}