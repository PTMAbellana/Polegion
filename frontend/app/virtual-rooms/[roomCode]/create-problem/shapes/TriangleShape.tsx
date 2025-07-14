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
  const stroke = 6;
  const pad = stroke;

  const size = shape.size;
  const h = size * Math.sqrt(3) / 2;

  const [points, setPoints] = React.useState([
    { x: size / 2, y: 0 },             // top
    { x: 0, y: h },                    // bottom left
    { x: size, y: h },                 // bottom right
  ]);

  function getBounds(pts: { x: number; y: number }[]) {
    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return {
      left: minX - pad,
      top: minY - pad,
      width: (maxX - minX) + pad * 2,
      height: (maxY - minY) + pad * 2,
      offsetX: -minX + pad,
      offsetY: -minY + pad,
    };
  }

  const bounds = getBounds(points);

  function dist(a: any, b: any) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  function getAngleDeg(a: any, b: any, c: any) {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
    return Math.acos(dot / (magAB * magCB)) * (180 / Math.PI);
  }

  function handleSideDrag(e: React.MouseEvent, sideIndex: number) {
    e.stopPropagation();
    e.preventDefault();
    let lastX = e.clientX;
    let lastY = e.clientY;

    const p1Index = sideIndex;
    const p2Index = (sideIndex + 1) % 3;

    function onMouseMove(moveEvent: MouseEvent) {
      const dx = moveEvent.clientX - lastX;
      const dy = moveEvent.clientY - lastY;
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;

      setPoints((prev) => {
        const updated = prev.map((p) => ({ ...p }));
        updated[p1Index].x += dx;
        updated[p1Index].y += dy;
        updated[p2Index].x += dx;
        updated[p2Index].y += dy;
        return updated;
      });
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      handleShapeDrop?.();
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  const sideLengths = [
    dist(points[0], points[1]),
    dist(points[1], points[2]),
    dist(points[2], points[0]),
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: shape.x + bounds.left,
        top: shape.y + bounds.top,
        width: bounds.width,
        height: bounds.height,
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
      <svg width={bounds.width} height={bounds.height}>
        <polygon
          points={points.map(p => `${p.x + bounds.offsetX},${p.y + bounds.offsetY}`).join(" ")}
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

        {/* Side Labels */}
        {showSides &&
          sideLengths.map((length, i) => {
            const p1 = points[i];
            const p2 = points[(i + 1) % 3];

            const midX = (p1.x + p2.x) / 2 + bounds.offsetX;
            const midY = (p1.y + p2.y) / 2 + bounds.offsetY;

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const mag = Math.sqrt(dx * dx + dy * dy);
            const ux = -dy / mag;
            const uy = dx / mag;

            const offset = 16;
            const labelX = midX + ux * offset;
            const labelY = midY + uy * offset;

            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

            return (
              <text
                key={`side-label-${i}`}
                x={labelX}
                y={labelY}
                transform={`rotate(${angleDeg}, ${labelX}, ${labelY})`}
                fontSize={12}
                fill="#000"
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{
                  paintOrder: "stroke",
                  stroke: "#fff",
                  strokeWidth: 4,
                  strokeLinejoin: "round",
                }}
              >
                {pxToUnits(length)} u
              </text>
            );
          })}

        {/* Angles */}
        {showAngles &&
          points.map((corner, idx) => {
            const prev = points[(idx + 2) % 3];
            const next = points[(idx + 1) % 3];
            const radius = 20;

            const v1 = { x: prev.x - corner.x, y: prev.y - corner.y };
            const v2 = { x: next.x - corner.x, y: next.y - corner.y };

            const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
            const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
            const v1Unit = { x: v1.x / mag1, y: v1.y / mag1 };
            const v2Unit = { x: v2.x / mag2, y: v2.y / mag2 };

            const angleDeg = getAngleDeg(prev, corner, next);
            const midAngle = Math.atan2(v1Unit.y + v2Unit.y, v1Unit.x + v2Unit.x);
            const labelX = corner.x + Math.cos(midAngle) * (radius + 14) + bounds.offsetX;
            const labelY = corner.y + Math.sin(midAngle) * (radius + 14) + bounds.offsetY;
            const largeArcFlag = angleDeg > 180 ? 1 : 0;

            const arcPath = `
              M ${corner.x + v1Unit.x * radius + bounds.offsetX} ${corner.y + v1Unit.y * radius + bounds.offsetY}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${corner.x + v2Unit.x * radius + bounds.offsetX} ${corner.y + v2Unit.y * radius + bounds.offsetY}
            `;

            return (
              <g key={`angle-${idx}`}>
                {Math.round(angleDeg) === 90 ? (
                  <>
                    <line
                      x1={corner.x + v1Unit.x * radius + bounds.offsetX}
                      y1={corner.y + v1Unit.y * radius + bounds.offsetY}
                      x2={corner.x + v1Unit.x * radius + v2Unit.x * 10 + bounds.offsetX}
                      y2={corner.y + v1Unit.y * radius + v2Unit.y * 10 + bounds.offsetY}
                      stroke="#1864ab"
                      strokeWidth={1.5}
                    />
                    <line
                      x1={corner.x + v2Unit.x * radius + bounds.offsetX}
                      y1={corner.y + v2Unit.y * radius + bounds.offsetY}
                      x2={corner.x + v2Unit.x * radius + v1Unit.x * 10 + bounds.offsetX}
                      y2={corner.y + v2Unit.y * radius + v1Unit.y * 10 + bounds.offsetY}
                      stroke="#1864ab"
                      strokeWidth={1.5}
                    />
                  </>
                ) : (
                  <path d={arcPath} fill="none" stroke="#1864ab" strokeWidth={1.5} />
                )}
                <text
                  x={labelX}
                  y={labelY}
                  fontSize={12}
                  fill="#1864ab"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {angleDeg.toFixed(0)}°
                </text>
              </g>
            );
          })}

        {/* Height Line */}
        {showHeight && (
          <line
            x1={points[0].x + bounds.offsetX}
            y1={points[0].y + bounds.offsetY}
            x2={(points[1].x + points[2].x) / 2 + bounds.offsetX}
            y2={(points[1].y + points[2].y) / 2 + bounds.offsetY}
            stroke="#1864ab"
            strokeWidth={1.5}
            strokeDasharray="5,3"
          />
        )}

        {/* Drag Handles */}
        {isSelected &&
          points.map((start, i) => {
            const end = points[(i + 1) % 3];
            const midX = (start.x + end.x) / 2 + bounds.offsetX;
            const midY = (start.y + end.y) / 2 + bounds.offsetY;

            return (
              <circle
                key={`handle-${i}`}
                cx={midX}
                cy={midY}
                r={8}
                fill="#fabc60"
                stroke="#000"
                strokeWidth={1.5}
                style={{ cursor: "grab" }}
                onMouseDown={(e) => handleSideDrag(e, i)}
              />
            );
          })}
      </svg>

      {/* Area */}
      {showArea && (
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 12px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#fff",
            borderRadius: 6,
            border: "1px solid #aaa",
            fontSize: 14,
            boxShadow: "0 2px 6px #0001",
            padding: "4px 8px",
            pointerEvents: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          A: {(0.5 * size * h).toFixed(1)} u²
        </div>
      )}

      {/* Height text */}
      {showHeight && (
        <div
          style={{
            position: "absolute",
            left: (points[1].x + points[2].x) / 2 + bounds.offsetX,
            top: points[1].y + 12 + bounds.offsetY,
            transform: "translateX(-50%)",
            background: "#fff",
            borderRadius: 6,
            border: "1px solid #aaa",
            fontSize: 14,
            boxShadow: "0 2px 6px #0001",
            padding: "4px 8px",
            pointerEvents: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          Height: {h.toFixed(1)} u
        </div>
      )}
    </div>
  );
}
