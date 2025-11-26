import React from "react";
import { Rect, Line, Group, Text, Circle, Arc } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

function snapPoint(point: { x: number; y: number }, step = 1) {
  return {
    x: snap(point.x, step),
    y: snap(point.y, step)
  };
}

interface Point {
  x: number;
  y: number;
}

interface SquarePoints {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

interface SquareShapeData {
  id: number;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points: SquarePoints;
}

interface SquareShapeProps {
  shape: SquareShapeData;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (shape: SquareShapeData) => void;
  onResize: (id: number, newPoints: SquarePoints) => void;
  pxToUnits: (px: number) => number;
  showSides: boolean;
  showAngles: boolean;
  showArea: boolean;
  showAreaByShape: { circle: boolean; triangle: boolean; square: boolean };
}

const SquareShape: React.FC<SquareShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onResize,
  showSides,
  showAngles,
  showAreaByShape,
}) => {
  const { topLeft, topRight, bottomRight, bottomLeft } = shape.points;

  const getDistance = (p1: Point, p2: Point) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  // Angle calculation between three points
  const getAngleDeg = (p1: Point, vertex: Point, p2: Point) => {
    const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    const cosTheta = dot / (mag1 * mag2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
    return (angleRad * 180) / Math.PI;
  };

  // Check if lines intersect
  const doLinesIntersect = (p1: Point, p2: Point, p3: Point, p4: Point): boolean => {
    function ccw(a: Point, b: Point, c: Point) {
      return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    }
    return (
      ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
      ccw(p1, p2, p3) !== ccw(p1, p2, p4)
    );
  };

  // Check if shape is self-intersecting
  const isSelfIntersecting = (points: Point[]): boolean => {
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
  };

  // Check if shape is convex
  const isConvex = (points: Point[]): boolean => {
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
  };

  // Validate shape integrity
  const isValidShape = (points: Point[]): boolean => {
    return !isSelfIntersecting(points) && isConvex(points);
  };

  // Calculate area using shoelace formula
  const getQuadrilateralArea = () => {
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
    return area;
  };

  const sideLengths = [
    { from: topLeft, to: topRight, name: "top" },
    { from: topRight, to: bottomRight, name: "right" },
    { from: bottomRight, to: bottomLeft, name: "bottom" },
    { from: bottomLeft, to: topLeft, name: "left" },
  ];

  const cornerAngles = [
    { corner: topLeft, prev: bottomLeft, next: topRight, name: "topLeft" },
    { corner: topRight, prev: topLeft, next: bottomRight, name: "topRight" },
    { corner: bottomRight, prev: topRight, next: bottomLeft, name: "bottomRight" },
    { corner: bottomLeft, prev: bottomRight, next: topLeft, name: "bottomLeft" },
  ];

  const sideMidpoints = {
    top: { x: (topLeft.x + topRight.x) / 2, y: (topLeft.y + topRight.y) / 2 },
    bottom: { x: (bottomLeft.x + bottomRight.x) / 2, y: (bottomLeft.y + bottomRight.y) / 2 },
    left: { x: (topLeft.x + bottomLeft.x) / 2, y: (topLeft.y + bottomLeft.y) / 2 },
    right: { x: (topRight.x + bottomRight.x) / 2, y: (topRight.y + bottomRight.y) / 2 },
  };

  const handleDragEnd = (e: { target: { x: () => number; y: () => number } }) => {
    const node = e.target;
    const snappedX = snap(node.x(), 1);
    const snappedY = snap(node.y(), 1);
    
    onChange({
      ...shape,
      x: snappedX,
      y: snappedY
    });
  };

  // Handle vertex drag with proper validation
  const handleVertexDrag = (vertexKey: string, e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    
    const stage = e.target.getStage();
    if (!stage) return;
    const startPoints = { ...shape.points };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Transform screen coordinates to stage coordinates
      const stageBox = stage.container().getBoundingClientRect();
      const stageScale = stage.scaleX();
      const stagePosition = stage.position();
      
      const transformed = {
        x: (moveEvent.clientX - stageBox.left - stagePosition.x) / stageScale,
        y: (moveEvent.clientY - stageBox.top - stagePosition.y) / stageScale
      };

      // Account for shape's position offset
      const relativeX = transformed.x - shape.x;
      const relativeY = transformed.y - shape.y;

      const newPoint = snapPoint({
        x: relativeX,
        y: relativeY
      }, 1);

      const updatedPoints = { ...startPoints, [vertexKey]: newPoint };
      const pointArray = [
        updatedPoints.topLeft,
        updatedPoints.topRight,
        updatedPoints.bottomRight,
        updatedPoints.bottomLeft,
      ];

      // Only update if shape remains valid
      if (isValidShape(pointArray)) {
        onResize(shape.id, updatedPoints);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle side drag with proper coordinate transformation (like SVG version)
  const handleSideDrag = (sideName: string, e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    
    const stage = e.target.getStage();
    if (!stage) return;
    const startPoints = { ...shape.points };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Get current mouse position relative to stage (equivalent to SVG transformation)
      const stageBox = stage.container().getBoundingClientRect();
      const stageScale = stage.scaleX(); // Assuming uniform scaling
      const stagePosition = stage.position();
      
      // Transform screen coordinates to stage coordinates (like SVG matrixTransform)
      const transformed = {
        x: (moveEvent.clientX - stageBox.left - stagePosition.x) / stageScale,
        y: (moveEvent.clientY - stageBox.top - stagePosition.y) / stageScale
      };

      // Account for shape's position offset
      const relativeX = transformed.x - shape.x;
      const relativeY = transformed.y - shape.y;

      // Clone points
      const updatedPoints = { ...startPoints };

      if (sideName === "top") {
        const maxY = Math.min(updatedPoints.bottomLeft.y, updatedPoints.bottomRight.y) - 10;
        const newY = snap(Math.min(relativeY, maxY), 1);
        updatedPoints.topLeft.y = newY;
        updatedPoints.topRight.y = newY;
      } else if (sideName === "bottom") {
        const minY = Math.max(updatedPoints.topLeft.y, updatedPoints.topRight.y) + 10;
        const newY = snap(Math.max(relativeY, minY), 1);
        updatedPoints.bottomLeft.y = newY;
        updatedPoints.bottomRight.y = newY;
      } else if (sideName === "left") {
        const maxX = Math.min(updatedPoints.topRight.x, updatedPoints.bottomRight.x) - 10;
        const newX = snap(Math.min(relativeX, maxX), 1);
        updatedPoints.topLeft.x = newX;
        updatedPoints.bottomLeft.x = newX;
      } else if (sideName === "right") {
        const minX = Math.max(updatedPoints.topLeft.x, updatedPoints.bottomLeft.x) + 10;
        const newX = snap(Math.max(relativeX, minX), 1);
        updatedPoints.topRight.x = newX;
        updatedPoints.bottomRight.x = newX;
      }

      const pointArray = [
        updatedPoints.topLeft,
        updatedPoints.topRight,
        updatedPoints.bottomRight,
        updatedPoints.bottomLeft,
      ];

      // Only update if shape remains valid
      if (isValidShape(pointArray)) {
        onResize(shape.id, updatedPoints);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Enhanced shape classification function
  const classifyQuadrilateral = () => {
    const sides = [
      getDistance(topLeft, topRight),
      getDistance(topRight, bottomRight),
      getDistance(bottomRight, bottomLeft),
      getDistance(bottomLeft, topLeft)
    ];
    
    const angles = cornerAngles.map(corner => 
      getAngleDeg(corner.prev, corner.corner, corner.next)
    );
    
    const tolerance = 0.001; // Stricter tolerance for measurements
    const angleTolerance = 1; // 1 degree tolerance for angles
    
    // Check if all sides are equal
    const allSidesEqual = sides.every(side => 
      Math.abs(side - sides[0]) / sides[0] < tolerance
    );
    
    // Check if opposite sides are equal
    const oppositeSidesEqual = (
      Math.abs(sides[0] - sides[2]) / sides[0] < tolerance &&
      Math.abs(sides[1] - sides[3]) / sides[1] < tolerance
    );
    
    // Check if all angles are 90 degrees
    const allRightAngles = angles.every(angle => 
      Math.abs(angle - 90) < angleTolerance
    );
    
    // Check if opposite angles are equal
    const oppositeAnglesEqual = (
      Math.abs(angles[0] - angles[2]) < angleTolerance &&
      Math.abs(angles[1] - angles[3]) < angleTolerance
    );
    
    // ✅ FIXED: Enhanced parallel sides detection
    const getParallelSides = () => {
      // Vector for each side
      const vectors = [
        { x: topRight.x - topLeft.x, y: topRight.y - topLeft.y }, // top
        { x: bottomRight.x - topRight.x, y: bottomRight.y - topRight.y }, // right
        { x: bottomLeft.x - bottomRight.x, y: bottomLeft.y - bottomRight.y }, // bottom
        { x: topLeft.x - bottomLeft.x, y: topLeft.y - bottomLeft.y } // left
      ];
      
      // ✅ STRICTER: More precise parallel check using normalized vectors
      const isParallel = (v1: { x: number; y: number }, v2: { x: number; y: number }) => {
        // Normalize vectors
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        if (mag1 === 0 || mag2 === 0) return false;
        
        const n1 = { x: v1.x / mag1, y: v1.y / mag1 };
        const n2 = { x: v2.x / mag2, y: v2.y / mag2 };
        
        // Check if vectors are parallel (cross product near zero)
        const cross = Math.abs(n1.x * n2.y - n1.y * n2.x);
        return cross < 0.05; // Stricter tolerance for parallel check
      };
      
      const topBottomParallel = isParallel(vectors[0], vectors[2]);
      const leftRightParallel = isParallel(vectors[1], vectors[3]);
      
      return {
        topBottom: topBottomParallel,
        leftRight: leftRightParallel,
        hasExactlyOnePair: (topBottomParallel && !leftRightParallel) || (!topBottomParallel && leftRightParallel)
      };
    };
    
    const parallelInfo = getParallelSides();
    
    // ✅ STRICTER: Enhanced trapezoid detection
    const isTrapezoid = () => {
      // Must have exactly one pair of parallel sides
      if (!parallelInfo.hasExactlyOnePair) return false;
      
      // ✅ STRICTER: Additional checks for valid trapezoid
      // Non-parallel sides should NOT be equal (otherwise it's a parallelogram)
      if (parallelInfo.topBottom) {
        // Top and bottom are parallel, left and right should not be equal
        const leftSide = getDistance(topLeft, bottomLeft);
        const rightSide = getDistance(topRight, bottomRight);
        return Math.abs(leftSide - rightSide) / Math.max(leftSide, rightSide) > tolerance;
      } else if (parallelInfo.leftRight) {
        // Left and right are parallel, top and bottom should not be equal
        const topSide = getDistance(topLeft, topRight);
        const bottomSide = getDistance(bottomLeft, bottomRight);
        return Math.abs(topSide - bottomSide) / Math.max(topSide, bottomSide) > tolerance;
      }
      
      return false;
    };
    
    // Classify the shape with stricter rules
    if (allSidesEqual && allRightAngles) {
      return 'square';
    } else if (allRightAngles && oppositeSidesEqual) {
      return 'rectangle';
    } else if (allSidesEqual && oppositeAnglesEqual) {
      return 'rhombus';
    } else if (oppositeSidesEqual && oppositeAnglesEqual && parallelInfo.topBottom && parallelInfo.leftRight) {
      return 'parallelogram';
    } else if (isTrapezoid()) {
      return 'trapezoid';
    } else {
      return 'quadrilateral';
    }
  };
  
  // ✅ FIXED: Enhanced area formula with proper trapezoid handling
  const getAreaFormula = () => {
    const shapeType = classifyQuadrilateral();
    const areaValue = (getQuadrilateralArea() / 100);
    
    switch (shapeType) {
      case 'square':
        const side = getDistance(topLeft, topRight) / 10;
        return {
          title: "Square Area Formula",
          formula: "A = side²",
          calculation: `A = ${side.toFixed(2)}² = ${areaValue.toFixed(2)} u²`,
          color: "#2c514c"
        };
        
      case 'rectangle':
        const width = getDistance(topLeft, topRight) / 10;
        const height = getDistance(topLeft, bottomLeft) / 10;
        return {
          title: "Rectangle Area Formula",
          formula: "A = length × width",
          calculation: `A = ${width.toFixed(2)} × ${height.toFixed(2)} = ${areaValue.toFixed(2)} u²`,
          color: "#2c514c"
        };
        
      case 'rhombus':
        const diagonal1 = getDistance(topLeft, bottomRight) / 10;
        const diagonal2 = getDistance(topRight, bottomLeft) / 10;
        return {
          title: "Rhombus Area Formula",
          formula: "A = (d₁ × d₂) ÷ 2",
          calculation: `A = (${diagonal1.toFixed(2)} × ${diagonal2.toFixed(2)}) ÷ 2 = ${areaValue.toFixed(2)} u²`,
          color: "#8e44ad"
        };
        
      case 'parallelogram':
        const base = getDistance(topLeft, topRight) / 10;
        const approxHeight = areaValue / base;
        return {
          title: "Parallelogram Area Formula",
          formula: "A = base × height",
          calculation: `A = ${base.toFixed(2)} × ${approxHeight.toFixed(2)} = ${areaValue.toFixed(2)} u²`,
          color: "#e67e22"
        };
        
      case 'trapezoid':
        // ✅ FIXED: Determine which sides are parallel and calculate accordingly
        const vectors = [
          { x: topRight.x - topLeft.x, y: topRight.y - topLeft.y }, // top
          { x: bottomRight.x - topRight.x, y: bottomRight.y - topRight.y }, // right
          { x: bottomLeft.x - bottomRight.x, y: bottomLeft.y - bottomRight.y }, // bottom
          { x: topLeft.x - bottomLeft.x, y: topLeft.y - bottomLeft.y } // left
        ];
        
        const isParallel = (v1: { x: number; y: number }, v2: { x: number; y: number }) => {
          const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
          const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
          if (mag1 === 0 || mag2 === 0) return false;
          const n1 = { x: v1.x / mag1, y: v1.y / mag1 };
          const n2 = { x: v2.x / mag2, y: v2.y / mag2 };
          const cross = Math.abs(n1.x * n2.y - n1.y * n2.x);
          return cross < 0.05;
        };
        
        const topBottomParallel = isParallel(vectors[0], vectors[2]);
        const leftRightParallel = isParallel(vectors[1], vectors[3]);
        
        if (topBottomParallel) {
          // ✅ Top and bottom sides are parallel
          const a = getDistance(topLeft, topRight) / 10; // top base
          const b = getDistance(bottomLeft, bottomRight) / 10; // bottom base
          const h = Math.abs(topLeft.y - bottomLeft.y) / 10; // height
          return {
            title: "Trapezoid Area Formula",
            formula: "A = ((a + b) × h) ÷ 2",
            calculation: `A = ((${a.toFixed(2)} + ${b.toFixed(2)}) × ${h.toFixed(2)}) ÷ 2 = ${areaValue.toFixed(2)} u²`,
            color: "#27ae60"
          };
        } else if (leftRightParallel) {
          // ✅ FIXED: Left and right sides are parallel
          const a = getDistance(topLeft, bottomLeft) / 10; // left base
          const b = getDistance(topRight, bottomRight) / 10; // right base
          const h = Math.abs(topLeft.x - topRight.x) / 10; // horizontal distance (width)
          return {
            title: "Trapezoid Area Formula",
            formula: "A = ((a + b) × h) ÷ 2",
            calculation: `A = ((${a.toFixed(2)} + ${b.toFixed(2)}) × ${h.toFixed(2)}) ÷ 2 = ${areaValue.toFixed(2)} u²`,
            color: "#27ae60"
          };
        } else {
          // Fallback if parallel detection fails
          return {
            title: "Trapezoid Area Formula",
            formula: "A = Shoelace Formula",
            calculation: `A = ${areaValue.toFixed(2)} u² (using coordinate geometry)`,
            color: "#27ae60"
          };
        }
        
      default: // general quadrilateral
        return {
          title: "Quadrilateral Area Formula",
          formula: "A = Shoelace Formula",
          calculation: `A = ${areaValue.toFixed(2)} u² (calculated using coordinate geometry)`,
          color: "#34495e"
        };
    }
  };

  return (
    <>
      {/* Main Shape Group - Allow dragging even when selected */}
      <Group
        x={shape.x}
        y={shape.y}
        draggable={true} // Changed from !isSelected to true
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
      >
        {/* Main Quadrilateral */}
        <Line
          points={[
            topLeft.x, topLeft.y,
            topRight.x, topRight.y,
            bottomRight.x, bottomRight.y,
            bottomLeft.x, bottomLeft.y,
            topLeft.x, topLeft.y
          ]}
          fill={shape.fill || "#e3dcc2"}
          stroke="#000"
          strokeWidth={4}
          closed={true}
        />

        {/* Vertex handles */}
        {isSelected && Object.entries(shape.points).map(([key, point]) => (
          <Circle
            key={key}
            x={point.x}
            y={point.y}
            radius={8}
            fill="#2c514c"
            stroke="#fff"
            strokeWidth={2}
            draggable={false}
            onMouseDown={(e) => handleVertexDrag(key, e)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        ))}

        {/* Side middle handles */}
        {isSelected && Object.entries(sideMidpoints).map(([side, point]) => (
          <Circle
            key={side}
            x={point.x}
            y={point.y}
            radius={6}
            fill="#555"
            stroke="#fff"
            strokeWidth={1.5}
            draggable={false}
            onMouseDown={(e) => handleSideDrag(side, e)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = side === "top" || side === "bottom" ? "ns-resize" : "ew-resize";
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        ))}

        {/* Side Labels with clean styling */}
        {showSides && sideLengths.map((side, idx) => {
          const midX = (side.from.x + side.to.x) / 2;
          const midY = (side.from.y + side.to.y) / 2;
          const dx = side.to.x - side.from.x;
          const dy = side.to.y - side.from.y;
          const length = getDistance(side.from, side.to) / 10;
          const label = `${length.toFixed(2)} u`;

          const normalLength = Math.sqrt(dx * dx + dy * dy);
          if (normalLength === 0 || isNaN(normalLength)) return null;

          const outwardOffset = -25;
          const offsetX = (-dy / normalLength) * outwardOffset;
          const offsetY = (dx / normalLength) * outwardOffset;

          const labelX = midX + offsetX;
          const labelY = midY + offsetY;
          
          let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

          const labelWidth = Math.max(50, label.length * 8 + 10);

          return (
            <Group key={`side-${idx}`} rotation={angleDeg} x={labelX} y={labelY}>
              <Rect
                x={-labelWidth / 2}
                y={-10}
                width={labelWidth}
                height={20}
                fill="white"
                stroke="#1864ab"
                strokeWidth={1}
                cornerRadius={4}
              />
              <Text
                x={0}
                y={-5}
                text={label}
                fontSize={12}
                fontFamily="Arial"
                fill="#1864ab"
                fontStyle="bold"
                align="center"
                offsetX={labelWidth / 2}
                width={labelWidth}
              />
            </Group>
          );
        })}

        {/* Corner Angles with arcs and proper calculations */}
        {showAngles && cornerAngles.map((corner, idx) => {
          const angleDeg = getAngleDeg(corner.prev, corner.corner, corner.next);
          const center = corner.corner;
          const radius = 20;

          const v1 = { x: corner.prev.x - center.x, y: corner.prev.y - center.y };
          const v2 = { x: corner.next.x - center.x, y: corner.next.y - center.y };

          const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
          const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
          
          if (mag1 === 0 || mag2 === 0) return null;
          
          const v1Unit = { x: v1.x / mag1, y: v1.y / mag1 };
          const v2Unit = { x: v2.x / mag2, y: v2.y / mag2 };

          const angle1 = Math.atan2(v1Unit.y, v1Unit.x) * 180 / Math.PI;
          const angle2 = Math.atan2(v2Unit.y, v2Unit.x) * 180 / Math.PI;

          let arcAngle = angle2 - angle1;
          if (arcAngle > 180) arcAngle -= 360;
          if (arcAngle < -180) arcAngle += 360;
          
          const startAngle = angle1;
          const endAngle = angle1 + arcAngle;
          
          const midAngleRad = ((startAngle + endAngle) / 2) * Math.PI / 180;
          const labelX = center.x + Math.cos(midAngleRad) * (radius + 12);
          const labelY = center.y + Math.sin(midAngleRad) * (radius + 12);

          if (!isFinite(angleDeg) || !isFinite(labelX) || !isFinite(labelY)) {
            return null;
          }

          return (
            <Group key={`angle-${idx}`}>
              {Math.round(angleDeg) === 90 ? (
                <Group>
                  <Line
                    points={[
                      center.x + v1Unit.x * 15,
                      center.y + v1Unit.y * 15,
                      center.x + v1Unit.x * 15 + v2Unit.x * 8,
                      center.y + v1Unit.y * 15 + v2Unit.y * 8
                    ]}
                    stroke="#1864ab"
                    strokeWidth={1.5}
                  />
                  <Line
                    points={[
                      center.x + v2Unit.x * 15,
                      center.y + v2Unit.y * 15,
                      center.x + v2Unit.x * 15 + v1Unit.x * 8,
                      center.y + v2Unit.y * 15 + v1Unit.y * 8
                    ]}
                    stroke="#1864ab"
                    strokeWidth={1.5}
                  />
                </Group>
              ) : (
                <Arc
                  x={center.x}
                  y={center.y}
                  innerRadius={radius - 1}
                  outerRadius={radius + 1}
                  angle={Math.abs(arcAngle)}
                  rotation={Math.min(startAngle, endAngle)}
                  fill="#1864ab"
                  stroke="#1864ab"
                  strokeWidth={0.5}
                />
              )}
              
              <Text
                x={labelX - 12}
                y={labelY - 6}
                text={`${angleDeg.toFixed(1)}°`}
                fontSize={12}
                fill="#1864ab"
                align="center"
                offsetX={0}
              />
            </Group>
          );
        })}
      </Group>
    </>
  );
};

export default SquareShape;