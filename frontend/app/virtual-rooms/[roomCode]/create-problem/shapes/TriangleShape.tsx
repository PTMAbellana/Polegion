import React from "react";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

export default function TriangleShape({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  handleShapeDrop,
  fillMode,
  draggingFill,
  showSides,
  showAngles,
  showArea,
  showHeight,
  onShapeMove,
}: any) {
  const stroke = 6;

  const size = shape.size;
  const h = size * Math.sqrt(3) / 2; // height for equilateral triangle

  const [points, setPoints] = React.useState({
    top: { x: shape.x, y: shape.y - h / 2 },
    left: { x: shape.x - size / 2, y: shape.y + h / 2 },
    right: { x: shape.x + size / 2, y: shape.y + h / 2 },
  });

  // For calculations and rendering
  const sidePoints = [points.top, points.left, points.right];

  // Side lengths
  const sideLengths = [
    dist(sidePoints[0], sidePoints[1]),
    dist(sidePoints[1], sidePoints[2]),
    dist(sidePoints[2], sidePoints[0]),
  ];

  // Vertices
  {isSelected &&
    sidePoints.map((p, i) => {
      const vertexKey = i === 0 ? "top" : i === 1 ? "left" : "right";
      return (
        <circle
          key={`vertex-${i}`}
          cx={p.x}
          cy={p.y}
          r={8}
          fill="#2c514c"
          stroke="#fff"
          strokeWidth={2}
          style={{ cursor: "pointer", pointerEvents: "auto" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            let lastX = e.clientX;
            let lastY = e.clientY;

            const handleMove = (moveEvent: MouseEvent) => {
              const dx = moveEvent.clientX - lastX;
              const dy = moveEvent.clientY - lastY;
              lastX = moveEvent.clientX;
              lastY = moveEvent.clientY;

              setPoints(prev => ({
                ...prev,
                [vertexKey]: {
                  x: snap(prev[vertexKey].x + dx, 1),
                  y: snap(prev[vertexKey].y + dy, 1),
                }
              }));
            };

            const handleUp = () => {
              document.removeEventListener("mousemove", handleMove);
              document.removeEventListener("mouseup", handleUp);
            };

            document.addEventListener("mousemove", handleMove);
            document.addEventListener("mouseup", handleUp);
          }}
        />
      );
    })}

  // Area calculation
  function getTriangleArea(pointsObj: any) {
    // Convert object to array in the correct order: [top, left, right]
    const p = [pointsObj.top, pointsObj.left, pointsObj.right];
    const pUnit = p.map((pt) => ({ x: pxToUnits(pt.x), y: pxToUnits(pt.y) }));
    return Math.abs(
      (pUnit[0].x * (pUnit[1].y - pUnit[2].y) +
        pUnit[1].x * (pUnit[2].y - pUnit[0].y) +
        pUnit[2].x * (pUnit[0].y - pUnit[1].y)) / 2
    );
  }

  // Distance in units
  function dist(a: any, b: any) {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2
    ) / 10; // convert the pixel distance to units
  }

  // Height in units
  function getHeightFromTopVertex(pointsObj: any) {
    const top = pointsObj.top;
    const baseA = pointsObj.left;
    const baseB = pointsObj.right;
    const baseLength = dist(baseA, baseB);
    const area = getTriangleArea(pointsObj);
    return (2 * area) / baseLength;
  }

  function getHeightFoot(A, B, C) {
    // Vector from B to C
    const dx = C.x - B.x;
    const dy = C.y - B.y;

    // Vector from B to A
    const dxA = A.x - B.x;
    const dyA = A.y - B.y;

    // Project BA onto BC
    const lenBC = dx * dx + dy * dy;
    const dot = dx * dxA + dy * dyA;
    const t = lenBC === 0 ? 0 : dot / lenBC;

    // Foot coordinates
    return {
      x: B.x + t * dx,
      y: B.y + t * dy,
    };
  }

  const area = getTriangleArea(points); // points is {top, left, right}
  const height = getHeightFromTopVertex(points);

  // Snapping for moving the whole triangle
  const handleDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let lastX = e.clientX;
    let lastY = e.clientY;

    function onMouseMove(me: MouseEvent) {
      const dx = me.clientX - lastX;
      const dy = me.clientY - lastY;
      lastX = me.clientX;
      lastY = me.clientY;

      // Snap dx/dy
      const snappedDx = snap(dx, 1);
      const snappedDy = snap(dy, 1);

      setPoints(prev => ({
        top: {
          x: snap(prev.top.x + snappedDx, 1),
          y: snap(prev.top.y + snappedDy, 1),
        },
        left: {
          x: snap(prev.left.x + snappedDx, 1),
          y: snap(prev.left.y + snappedDy, 1),
        },
        right: {
          x: snap(prev.right.x + snappedDx, 1),
          y: snap(prev.right.y + snappedDy, 1),
        },
      }));
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      handleShapeDrop?.();
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Height foot
  const foot = getHeightFoot(points.top, points.left, points.right);

  // Height label
  const heightLabel = `Height: ${height.toFixed(1)} u`;

  // --- Add this helper function ---
  function getAngle(A, B, C) {
    // Returns angle at A in degrees
    const a = dist(B, C);
    const b = dist(A, C);
    const c = dist(A, B);
    // Law of Cosines
    const angleRad = Math.acos((b*b + c*c - a*a) / (2*b*c));
    return (angleRad * 180) / Math.PI;
  }

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Triangle shape */}
      <polygon
        points={[points.top, points.left, points.right].map((p) => `${p.x},${p.y}`).join(" ")}
        fill={shape.fill || "#e3dcc2"}
        stroke="#000"
        strokeWidth={stroke}
        onMouseDown={(e) => {
          handleDrag(e);
          handleShapeMouseDown(shape.id, e);
          setSelectedId(shape.id);
        }}
        style={{ cursor: "move", pointerEvents: "auto" }}
      />

      {/* Resize handles */}
      {isSelected &&
        [points.top, points.left, points.right].map((p, i) => {
          const vertexKey = i === 0 ? "top" : i === 1 ? "left" : "right";
          return (
            <circle
              key={`vertex-${i}`}
              cx={p.x}
              cy={p.y}
              r={8}
              fill="#2c514c"
              stroke="#fff"
              strokeWidth={2}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onMouseDown={(e) => {
                e.stopPropagation();
                let lastX = e.clientX;
                let lastY = e.clientY;

                const handleMove = (moveEvent: MouseEvent) => {
                  const dx = moveEvent.clientX - lastX;
                  const dy = moveEvent.clientY - lastY;
                  lastX = moveEvent.clientX;
                  lastY = moveEvent.clientY;

                  setPoints(prev => ({
                    ...prev,
                    [vertexKey]: {
                      x: snap(prev[vertexKey].x + dx, 1),
                      y: snap(prev[vertexKey].y + dy, 1),
                    }
                  }));
                };

                const handleUp = () => {
                  document.removeEventListener("mousemove", handleMove);
                  document.removeEventListener("mouseup", handleUp);
                };

                document.addEventListener("mousemove", handleMove);
                document.addEventListener("mouseup", handleUp);
              }}
            />
          );
        })}

      {/* Side Labels */}
      {showSides &&
        sideLengths.map((length, i) => {
          const p1 = sidePoints[i];
          const p2 = sidePoints[(i + 1) % 3];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const mag = Math.sqrt(dx * dx + dy * dy);
          const ux = -dy / mag;
          const uy = dx / mag;
          const offset = 16;
          const labelX = midX + ux * offset;
          const labelY = midY + uy * offset;

          let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

          const label = `${length.toFixed(1)} u`;
          const width = label.length * 7 + 10;

          return (
            <g
              key={`side-${i}`}
              transform={`rotate(${angleDeg}, ${labelX}, ${labelY})`}
            >
              <rect
                x={labelX - width / 2}
                y={labelY - 10}
                width={width}
                height={18}
                rx={4}
                ry={4}
                fill="white"
                stroke="#000"
                strokeWidth={0.4}
              />
              <text
                x={labelX}
                y={labelY + 4}
                textAnchor="middle"
                fontSize={12}
                fill="#000"
              >
                {label}
              </text>
            </g>
          );
        })}

      {isSelected && showArea && (
        <g>
          {(() => {
            const label = `A: ${area.toFixed(1)} u²`;
            const width = label.length * 7 + 10;

            // Use sidePoints array for consistent ordering
            const pA = sidePoints[2]; // bottom-right
            const pB = sidePoints[0]; // top
            const midX = (pA.x + pB.x) / 2;
            const midY = (pA.y + pB.y) / 2;

            // Offset label to the right of the midpoint
            const offsetX = 40;
            const offsetY = -10;

            const labelX = midX + offsetX + 60;
            const labelY = midY + offsetY;

            return (
              <>
                <rect
                  x={labelX - width / 2}
                  y={labelY - 14}
                  width={width}
                  height={26}
                  rx={6}
                  ry={6}
                  fill="white"
                  stroke="#000"
                  strokeWidth={0.5}
                />
                <text
                  x={labelX}
                  y={labelY + 5}
                  fontSize={14}
                  fill="#000"
                  textAnchor="middle"
                  fontWeight={500}
                >
                  {label}
                </text>
              </>
            );
          })()}
        </g>
      )}

      {/* Height Line & Label */}
      {showHeight && (
        <g>
          {(() => {
            const A = points.top;
            const B = points.left;
            const C = points.right;
            const foot = getHeightFoot(A, B, C);

            // Draw the height line
            return (
              <>
                <line
                  x1={A.x}
                  y1={A.y}
                  x2={foot.x}
                  y2={foot.y}
                  stroke="#1864ab"
                  strokeWidth={1.5}
                  strokeDasharray="5,3"
                />
                {/* Height label */}
                {(() => {
                  const label = `Height: ${height.toFixed(1)} u`;
                  const width = label.length * 7 + 10;
                  const x = (A.x + foot.x) / 2;
                  const y = (A.y + foot.y) / 2 - 18; // above the line

                  return (
                    <>
                      <rect
                        x={x - width / 2}
                        y={y}
                        width={width}
                        height={20}
                        rx={4}
                        ry={4}
                        fill="white"
                        stroke="#1864ab"
                        strokeWidth={0.6}
                      />
                      <text
                        x={x}
                        y={y + 14}
                        fontSize={13}
                        fill="#1864ab"
                        textAnchor="middle"
                        fontWeight={500}
                      >
                        {label}
                      </text>
                    </>
                  );
                })()}
              </>
            );
          })()}
        </g>
      )}

      {/* Angle Labels */}
      {showAngles &&
        sidePoints.map((p, i) => {
          // Vertices: A = p, B = sidePoints[(i+1)%3], C = sidePoints[(i+2)%3]
          const A = p;
          const B = sidePoints[(i + 1) % 3];
          const C = sidePoints[(i + 2) % 3];
          const angle = getAngle(A, B, C);
          const label = `${angle.toFixed(1)}°`;
          const offset = 28;
          // Offset label away from vertex
          const dirX = (A.x - (B.x + C.x) / 2);
          const dirY = (A.y - (B.y + C.y) / 2);
          const mag = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const labelX = A.x + (dirX / mag) * offset;
          const labelY = A.y + (dirY / mag) * offset;
          const width = label.length * 7 + 10;

          return (
            <g key={`angle-${i}`}>
              <rect
                x={labelX - width / 2}
                y={labelY - 12}
                width={width}
                height={18}
                rx={4}
                ry={4}
                fill="white"
                stroke="#1864ab"
                strokeWidth={0.4}
              />
              <text
                x={labelX}
                y={labelY + 2}
                textAnchor="middle"
                fontSize={12}
                fill="#1864ab"
              >
                {label}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
