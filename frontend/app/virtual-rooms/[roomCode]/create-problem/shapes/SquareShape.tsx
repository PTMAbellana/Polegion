import React from "react";

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  // Normalize angles between 0 and 2π
  const TWO_PI = 2 * Math.PI;
  startAngle = (startAngle + TWO_PI) % TWO_PI;
  endAngle = (endAngle + TWO_PI) % TWO_PI;

  let angleDiff = endAngle - startAngle;
  if (angleDiff < 0) angleDiff += TWO_PI;

  // Always use the smaller (interior) angle
  const largeArcFlag = 0;
  const sweepFlag = angleDiff <= Math.PI ? 1 : 0;

  const start = {
    x: cx + radius * Math.cos(startAngle),
    y: cy + radius * Math.sin(startAngle),
  };
  const end = {
    x: cx + radius * Math.cos(endAngle),
    y: cy + radius * Math.sin(endAngle),
  };

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  fill?: string;
  points: {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
  };
}

interface SquareShapeProps {
  shape: Shape;
  isSelected: boolean;
  pxToUnits: (px: number) => string;
  handleShapeMouseDown: (id: number, e: React.MouseEvent) => void;
  setSelectedId: (id: number) => void;
  fillMode: boolean;
  draggingFill: boolean;
  scale: number;
  showProperties: boolean;
  showSides?: boolean;
  showAngles?: boolean;
  showArea?: boolean;
  onVertexMouseDown: (vertex: keyof Shape["points"]) => void;
  onSideMouseDown: (side: "top" | "bottom" | "left" | "right", point: Point, e: React.MouseEvent) => void;
  handleVertexDrag: (id: number, vertexKey: keyof Shape["points"], newPoint: Point) => void;
}

function getDistance(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Improved snap function with configurable step size
function snap(value: number, step = 1): number {
  return Math.round(value / step) * step;
}

// Helper function to snap a point
function snapPoint(point: Point, step = 1): Point {
  return {
    x: snap(point.x, step),
    y: snap(point.y, step)
  };
}

function getAngleDeg(p1: Point, vertex: Point, p2: Point) {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  const cosTheta = dot / (mag1 * mag2);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta))); // Clamp to avoid NaN
  return (angleRad * 180) / Math.PI;
}

function doLinesIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  function ccw(a: Point, b: Point, c: Point) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  }
  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
    ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
}

function isSelfIntersecting(points: Point[]): boolean {
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const a1 = points[i];
    const a2 = points[(i + 1) % n];
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
      const b1 = points[j];
      const b2 = points[(j + 1) % n];
      if (doLinesIntersect(a1, a2, b1, b2)) return true;
    }
  }
  return false;
}

function isConvex(points: Point[]): boolean {
  const n = points.length;
  if (n < 4) return true;
  let sign = 0;
  for (let i = 0; i < n; i++) {
    const dx1 = points[(i + 2) % n].x - points[(i + 1) % n].x;
    const dy1 = points[(i + 2) % n].y - points[(i + 1) % n].y;
    const dx2 = points[i].x - points[(i + 1) % n].x;
    const dy2 = points[i].y - points[(i + 1) % n].y;
    const zCrossProduct = dx1 * dy2 - dy1 * dx2;
    if (zCrossProduct !== 0) {
      if (sign === 0) {
        sign = Math.sign(zCrossProduct);
      } else if (sign !== Math.sign(zCrossProduct)) {
        return false;
      }
    }
  }
  return true;
}

function isValidShape(points: Point[]): boolean {
  return !isSelfIntersecting(points) && isConvex(points);
}

const SquareShape: React.FC<SquareShapeProps> = ({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  fillMode,
  draggingFill,
  scale,
  showProperties,
  showSides = false,
  showAngles = false,
  showArea = false,
  onVertexMouseDown,
  onSideMouseDown,
  handleVertexDrag,
}) => {
  const { topLeft, topRight, bottomRight, bottomLeft } = shape.points;

  const getPolygonPoints = () =>
    `${topLeft.x},${topLeft.y} ${topRight.x},${topRight.y} ${bottomRight.x},${bottomRight.y} ${bottomLeft.x},${bottomLeft.y}`;

  const sideLengths = [
    { from: topLeft, to: topRight },
    { from: topRight, to: bottomRight },
    { from: bottomRight, to: bottomLeft },
    { from: bottomLeft, to: topLeft },
  ];

  const cornerAngles = [
    { corner: topLeft, prev: bottomLeft, next: topRight },
    { corner: topRight, prev: topLeft, next: bottomRight },
    { corner: bottomRight, prev: topRight, next: bottomLeft },
    { corner: bottomLeft, prev: bottomRight, next: topLeft },
  ];

  const area = 0.5 * Math.abs(
    topLeft.x * topRight.y +
    topRight.x * bottomRight.y +
    bottomRight.x * bottomLeft.y +
    bottomLeft.x * topLeft.y -
    (topRight.x * topLeft.y +
      bottomRight.x * topRight.y +
      bottomLeft.x * bottomRight.y +
      topLeft.x * bottomLeft.y)
  );

  const areaValue = (area / 100).toFixed(2);
  const labelText = `Area: ${areaValue} u²`;

  const [textWidth, setTextWidth] = React.useState<number>(0);
  const textRef = React.useRef<SVGTextElement | null>(null);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (textRef.current) {
        const bbox = textRef.current.getBBox();
        setTextWidth(bbox.width);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [labelText]);

  const sideMidpoints = {
    top: { x: (topLeft.x + topRight.x) / 2, y: (topLeft.y + topRight.y) / 2 },
    bottom: { x: (bottomLeft.x + bottomRight.x) / 2, y: (bottomLeft.y + bottomRight.y) / 2 },
    left: { x: (topLeft.x + bottomLeft.x) / 2, y: (topLeft.y + bottomLeft.y) / 2 },
    right: { x: (topRight.x + bottomRight.x) / 2, y: (topRight.y + bottomRight.y) / 2 },
  };

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
      <polygon
        points={getPolygonPoints()}
        fill={shape.fill || "#e3dcc2"}
        stroke="#000"
        strokeWidth={4}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleShapeMouseDown(shape.id, e);
          setSelectedId(shape.id);
        }}
        style={{ cursor: "move", pointerEvents: "auto" }}
      />

      {/* Side Lengths */}
      {showSides &&
      sideLengths.map((side, idx) => {
        const midX = (side.from.x + side.to.x) / 2;
        const midY = (side.from.y + side.to.y) / 2;
        const dx = side.to.x - side.from.x;
        const dy = side.to.y - side.from.y;
        const length = getDistance(side.from, side.to) / 10;
        const label = `${length.toFixed(2)} u`; 

        const normalLength = Math.sqrt(dx * dx + dy * dy);
        if (normalLength === 0 || isNaN(normalLength)) return null;

        const outwardOffset = -20;
        const offsetX = (-dy / normalLength) * outwardOffset;
        const offsetY = (dx / normalLength) * outwardOffset;

        const labelX = midX + offsetX;
        const labelY = midY + offsetY;
        let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

        return (
          <g key={`side-${idx}`} transform={`rotate(${angleDeg}, ${labelX}, ${labelY})`}>
            <rect
              x={labelX - 20}
              y={labelY - 10}
              width={40}
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
      
      {/* Corner Angles */}
      {showAngles &&
        cornerAngles.map((corner, idx) => {
          const angleDeg = getAngleDeg(corner.prev, corner.corner, corner.next);
          const center = corner.corner;
          const radius = 20;

          const v1 = { x: corner.prev.x - center.x, y: corner.prev.y - center.y };
          const v2 = { x: corner.next.x - center.x, y: corner.next.y - center.y };

          const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
          const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
          const v1Unit = { x: v1.x / mag1, y: v1.y / mag1 };
          const v2Unit = { x: v2.x / mag2, y: v2.y / mag2 };

          const angle1 = Math.atan2(v1Unit.y, v1Unit.x);
          const angle2 = Math.atan2(v2Unit.y, v2Unit.x);

          let midAngle = (angle1 + angle2) / 2;
          if (Math.abs(angle1 - angle2) > Math.PI) midAngle += Math.PI;

          const labelX = center.x + Math.cos(midAngle) * (radius + 12);
          const labelY = center.y + Math.sin(midAngle) * (radius + 12);

          if (
            !isFinite(angleDeg) ||
            !isFinite(labelX) ||
            !isFinite(labelY) ||
            isNaN(angleDeg) ||
            isNaN(labelX) ||
            isNaN(labelY)
          ) {
            return null;
          }

          return (
            <g key={`angle-${idx}`}>
              {Math.round(angleDeg) === 90 ? (
                <>
                  <line
                    x1={center.x + v1Unit.x * 20}
                    y1={center.y + v1Unit.y * 20}
                    x2={center.x + v1Unit.x * 20 + v2Unit.x * 10}
                    y2={center.y + v1Unit.y * 20 + v2Unit.y * 10}
                    stroke="#1864ab"
                    strokeWidth={1.5}
                  />
                  <line
                    x1={center.x + v2Unit.x * 20}
                    y1={center.y + v2Unit.y * 20}
                    x2={center.x + v2Unit.x * 20 + v1Unit.x * 10}
                    y2={center.y + v2Unit.y * 20 + v1Unit.y * 10}
                    stroke="#1864ab"
                    strokeWidth={1.5}
                  />
                </>
              ) : (
                <path
                  d={describeArc(center.x, center.y, radius, angle1, angle2)}
                  stroke="#1864ab"
                  fill="none"
                  strokeWidth={1.5}
                />
              )}
              <text
                x={labelX}
                y={labelY}
                fontSize={12}
                fill="#1864ab"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {angleDeg.toFixed(2)}°
              </text>
            </g>
          );
        })}

      {/* Vertex Handles */}
      {isSelected &&
        Object.entries(shape.points).map(([key, point]) => (
          <circle
            key={key}
            cx={point.x}
            cy={point.y}
            r={8}
            fill="#2c514c"
            stroke="#fff"
            strokeWidth={2}
            onMouseDown={(e) => {
              e.stopPropagation();
              setSelectedId(shape.id);

              const vertexKey = key as keyof typeof shape.points;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const svg = (e.target as SVGElement).ownerSVGElement;
                if (!svg) return;

                const pt = svg.createSVGPoint();
                pt.x = moveEvent.clientX;
                pt.y = moveEvent.clientY;
                const transformed = pt.matrixTransform(svg.getScreenCTM()?.inverse());

                // Apply snapping to the transformed point
                const snappedPoint = snapPoint({ x: transformed.x, y: transformed.y }, 1);

                const updatedPoints = { ...shape.points, [vertexKey]: snappedPoint };
                const pointArray = [
                  updatedPoints.topLeft,
                  updatedPoints.topRight,
                  updatedPoints.bottomRight,
                  updatedPoints.bottomLeft,
                ];

                if (isValidShape(pointArray)) {
                  handleVertexDrag(shape.id, vertexKey, snappedPoint);
                }
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        ))}

      {/* Side Handles */}
      {isSelected &&
        Object.entries(sideMidpoints).map(([side, point]) => (
          <circle
            key={side}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="#555"
            stroke="#fff"
            strokeWidth={1.5}
            onMouseDown={(e) => {
              e.stopPropagation();
              setSelectedId(shape.id);
              const svg = (e.target as SVGElement).ownerSVGElement;
              if (!svg) return;

              const pt = svg.createSVGPoint();
              const sideKey = side as "top" | "bottom" | "left" | "right";

              const handleMouseMove = (moveEvent: MouseEvent) => {
                pt.x = moveEvent.clientX;
                pt.y = moveEvent.clientY;
                const transformed = pt.matrixTransform(svg.getScreenCTM()?.inverse());

                // Clone points
                const updatedPoints = { ...shape.points };

                if (sideKey === "top") {
                  const maxY = Math.min(updatedPoints.bottomLeft.y, updatedPoints.bottomRight.y) - 10;
                  const newY = snap(Math.min(transformed.y, maxY), 1);
                  updatedPoints.topLeft.y = newY;
                  updatedPoints.topRight.y = newY;
                } else if (sideKey === "bottom") {
                  const minY = Math.max(updatedPoints.topLeft.y, updatedPoints.topRight.y) + 10;
                  const newY = snap(Math.max(transformed.y, minY), 1);
                  updatedPoints.bottomLeft.y = newY;
                  updatedPoints.bottomRight.y = newY;
                } else if (sideKey === "left") {
                  const maxX = Math.min(updatedPoints.topRight.x, updatedPoints.bottomRight.x) - 10;
                  const newX = snap(Math.min(transformed.x, maxX), 1);
                  updatedPoints.topLeft.x = newX;
                  updatedPoints.bottomLeft.x = newX;
                } else if (sideKey === "right") {
                  const minX = Math.max(updatedPoints.topLeft.x, updatedPoints.bottomLeft.x) + 10;
                  const newX = snap(Math.max(transformed.x, minX), 1);
                  updatedPoints.topRight.x = newX;
                  updatedPoints.bottomRight.x = newX;
                }

                const pointArray = [
                  updatedPoints.topLeft,
                  updatedPoints.topRight,
                  updatedPoints.bottomRight,
                  updatedPoints.bottomLeft,
                ];

                if (isValidShape(pointArray)) {
                  Object.entries(updatedPoints).forEach(([vertexKey, newPoint]) => {
                    handleVertexDrag(shape.id, vertexKey as keyof Shape["points"], newPoint);
                  });
                }
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        ))}

      {/* Area Label Only */}
      {isSelected && showArea && (
        <g>
          <rect
            x={(topRight.x + bottomRight.x) / 2 + 80 - (textWidth || 80) / 2 - 8}
            y={(topRight.y + bottomRight.y) / 2 - 14}
            width={(textWidth || 80) + 16}
            height={28}
            rx={6}
            ry={6}
            fill="white"
            stroke="#000"
            strokeWidth={0.5}
          />
          <text
            ref={textRef}
            x={(topRight.x + bottomRight.x) / 2 + 80}
            y={(topRight.y + bottomRight.y) / 2 + 5}
            fontSize={14}
            fill="#000"
            textAnchor="middle"
            style={{ pointerEvents: "none", fontWeight: 500 }}
          >
            {labelText}
          </text>
        </g>
      )}

      {/* ✅ Area Formula Display - Top Left of Main Area (like circle and triangle) */}
      {isSelected && showArea && (
        <g>
          {(() => {
            // Calculate side length (assuming it's a square/rectangle)
            const width = getDistance(topLeft, topRight) / 10; // Convert to units
            const height = getDistance(topLeft, bottomLeft) / 10; // Convert to units
            const areaValue = (area / 100); // Convert to square units
            
            const formulaText = width === height ? 
              `Area = side²` : // For perfect square
              `Area = length × width`; // For rectangle
            
            const calculationText = width === height ?
              `A = ${width.toFixed(2)}² = ${areaValue.toFixed(2)} u²` :
              `A = ${width.toFixed(2)} × ${height.toFixed(2)} = ${areaValue.toFixed(2)} u²`;
            
            const formulaWidth = Math.max(formulaText.length * 8, calculationText.length * 7) + 20;
            
            // ✅ Fixed position - Top Left of Main Area
            const formulaX = 50 + formulaWidth/2; // 50px from left edge
            const formulaY = 95; // 70px from top + offset for centering

            return (
              <>
                {/* Area Formula box - TOP LEFT positioning */}
                <rect
                  x={50} // Fixed left position
                  y={70} // Fixed top position
                  width={formulaWidth}
                  height={55}
                  rx={8}
                  ry={8}
                  fill="white"
                  stroke="#2c514c"
                  strokeWidth={2}
                  filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.1))"
                />
                
                <text
                  x={formulaX}
                  y={85}
                  fontSize={13}
                  fill="#2c514c"
                  textAnchor="middle"
                  fontWeight={700}
                >
                  Area Formula
                </text>
                
                <text
                  x={formulaX}
                  y={100}
                  fontSize={11}
                  fill="#666"
                  textAnchor="middle"
                  fontStyle="italic"
                >
                  {formulaText}
                </text>
                
                <text
                  x={formulaX}
                  y={115}
                  fontSize={10}
                  fill="#1864ab"
                  textAnchor="middle"
                  fontWeight={600}
                >
                  {calculationText}
                </text>
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
};

export default SquareShape;