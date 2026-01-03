import React from "react";
import { Line, Group, Text, Rect, Circle, Arc } from "react-konva";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

interface Point {
  x: number;
  y: number;
}

interface TrianglePoints {
  top: Point;
  left: Point;
  right: Point;
}

interface TriangleShapeData {
  id: number;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points: TrianglePoints;
}

interface TriangleShapeProps {
  shape: TriangleShapeData;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (shape: TriangleShapeData) => void;
  onResize: (id: number, newPoints: TrianglePoints) => void;
  pxToUnits: (px: number) => number;
  showSides: boolean;
  showAngles: boolean;
  showHeight: boolean;
  showAreaByShape: { circle: boolean; triangle: boolean; square: boolean };
}

const TriangleShape: React.FC<TriangleShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onResize,
  pxToUnits,
  showSides,
  showAngles,
  showHeight,
  showAreaByShape,
}) => {
  const { top, left, right } = shape.points;

  // Keep your existing calculations
  const dist = (a: Point, b: Point) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / 10;
  };

  const getTriangleArea = () => {
    const points = [top, left, right];
    const pUnit = points.map((pt) => ({ x: pxToUnits(pt.x), y: pxToUnits(pt.y) }));
    return Math.abs(
      (pUnit[0].x * (pUnit[1].y - pUnit[2].y) +
        pUnit[1].x * (pUnit[2].y - pUnit[0].y) +
        pUnit[2].x * (pUnit[0].y - pUnit[1].y)) / 2
    );
  };

  const getHeightFromTopVertex = () => {
    const baseLength = dist(left, right);
    const area = getTriangleArea();
    return (2 * area) / baseLength;
  };

  const getHeightFoot = (A: Point, B: Point, C: Point) => {
    const dx = C.x - B.x;
    const dy = C.y - B.y;
    const dxA = A.x - B.x;
    const dyA = A.y - B.y;
    const lenBC = dx * dx + dy * dy;
    const dot = dx * dxA + dy * dyA;
    const t = lenBC === 0 ? 0 : dot / lenBC;
    return {
      x: B.x + t * dx,
      y: B.y + t * dy,
    };
  };

  // Calculate actual angles for each vertex
  const getAngle = (vertex: Point, point1: Point, point2: Point) => {
    const v1 = { x: point1.x - vertex.x, y: point1.y - vertex.y };
    const v2 = { x: point2.x - vertex.x, y: point2.y - vertex.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    const cosAngle = dot / (mag1 * mag2);
    const clampedCos = Math.max(-1, Math.min(1, cosAngle));
    return (Math.acos(clampedCos) * 180) / Math.PI;
  };

  // Calculate all three angles
  const topAngle = getAngle(top, left, right);
  const leftAngle = getAngle(left, top, right);
  const rightAngle = getAngle(right, top, left);

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

  const handleVertexDrag = (vertexKey: string, e: { evt: MouseEvent; cancelBubble?: boolean }) => {
    e.cancelBubble = true;
    
    const startX = e.evt.clientX;
    const startY = e.evt.clientY;
    const startPoints = { ...shape.points };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const newPoints = {
        ...startPoints,
        [vertexKey]: {
          x: snap(startPoints[vertexKey as keyof typeof startPoints].x + dx, 1),
          y: snap(startPoints[vertexKey as keyof typeof startPoints].y + dy, 1)
        }
      };
      
      const tempArea = Math.abs(
        (newPoints.top.x * (newPoints.left.y - newPoints.right.y) +
         newPoints.left.x * (newPoints.right.y - newPoints.top.y) +
         newPoints.right.x * (newPoints.top.y - newPoints.left.y)) / 2
      );
      
      if (tempArea >= 200) {
        onResize(shape.id, newPoints);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const sidePoints = [top, left, right];
  const sideLengths = [
    dist(sidePoints[0], sidePoints[1]),
    dist(sidePoints[1], sidePoints[2]),
    dist(sidePoints[2], sidePoints[0]),
  ];

  return (
    <>
      {/* Main Shape Group - Allow dragging even when selected */}
      <Group
        x={shape.x}
        y={shape.y}
        draggable={true} // Already set to true - triangle can be dragged when selected
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onMouseDown={(e) => {
          e.cancelBubble = true;
        }}
      >
        {/* Main Triangle */}
        <Line
          points={[top.x, top.y, left.x, left.y, right.x, right.y, top.x, top.y]}
          fill={shape.fill || "#e3dcc2"}
          stroke="#000"
          strokeWidth={6}
          hitStrokeWidth={20}
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

        {/* Side Labels - Positioned OUTSIDE the triangle */}
        {showSides && sideLengths.map((length, i) => {
          const p1 = sidePoints[i];
          const p2 = sidePoints[(i + 1) % 3];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const label = `${length.toFixed(2)} u`;

          const normalLength = Math.sqrt(dx * dx + dy * dy);
          if (normalLength === 0 || isNaN(normalLength)) return null;

          // Calculate triangle centroid to determine "inside" direction
          const centroidX = (top.x + left.x + right.x) / 3;
          const centroidY = (top.y + left.y + right.y) / 3;
          
          // Vector from midpoint to centroid (pointing inward)
          const toCenterX = centroidX - midX;
          const toCenterY = centroidY - midY;
          
          // Normalize the inward vector
          const toCenterLength = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
          const normalizedToCenterX = toCenterLength > 0 ? toCenterX / toCenterLength : 0;
          const normalizedToCenterY = toCenterLength > 0 ? toCenterY / toCenterLength : 0;
          
          // Calculate outward direction (opposite of inward)
          const outwardDistance = 50; // Increased distance to ensure outside placement
          const labelX = midX - (normalizedToCenterX * outwardDistance);
          const labelY = midY - (normalizedToCenterY * outwardDistance);
          
          // Calculate rotation angle for the label
          let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

          const labelWidth = Math.max(70, label.length * 8 + 10); // Increased min width

          return (
            <Group key={`side-${i}`} rotation={angleDeg} x={labelX} y={labelY}>
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

        {/* Height line with base line for perpendicularity visualization */}
        {showHeight && (
          <>
            {(() => {
              const foot = getHeightFoot(top, left, right);
              const height = getHeightFromTopVertex();
              const label = `h: ${height.toFixed(2)} u`;
              
              const labelX = foot.x + 20; // Offset from the line
              const labelY = (top.y + foot.y) / 2;
              const labelWidth = Math.max(70, label.length * 8 + 10);
              
              // Calculate base line direction for perpendicularity indicator
              const baseVector = { x: right.x - left.x, y: right.y - left.y };
              const baseLength = Math.sqrt(baseVector.x * baseVector.x + baseVector.y * baseVector.y);
              const normalizedBase = { 
                x: baseVector.x / baseLength, 
                y: baseVector.y / baseLength 
              };
              
              // Create perpendicular indicator lines at the foot
              const baseIndicatorLength = 20; // Length of base indicator line
              
              // Base line segments (extending from foot point)
              const baseStart = {
                x: foot.x - normalizedBase.x * baseIndicatorLength,
                y: foot.y - normalizedBase.y * baseIndicatorLength
              };
              const baseEnd = {
                x: foot.x + normalizedBase.x * baseIndicatorLength,
                y: foot.y + normalizedBase.y * baseIndicatorLength
              };
              
              // Create a proper right angle square at the foot point
              const rightAngleSize = 8; // Reduced size for better positioning
              
              // Determine which direction is "up" towards the triangle interior
              const heightVector = { x: top.x - foot.x, y: top.y - foot.y };
              const heightLength = Math.sqrt(heightVector.x * heightVector.x + heightVector.y * heightVector.y);
              const normalizedHeight = { 
                x: heightVector.x / heightLength, 
                y: heightVector.y / heightLength 
              };
              
              // Use the height direction (towards triangle) instead of arbitrary perpendicular
              const corner1 = {
                x: foot.x,
                y: foot.y
              };
              const corner2 = {
                x: foot.x + normalizedBase.x * rightAngleSize,
                y: foot.y + normalizedBase.y * rightAngleSize
              };
              const corner3 = {
                x: foot.x + normalizedBase.x * rightAngleSize + normalizedHeight.x * rightAngleSize,
                y: foot.y + normalizedBase.y * rightAngleSize + normalizedHeight.y * rightAngleSize
              };
              const corner4 = {
                x: foot.x + normalizedHeight.x * rightAngleSize,
                y: foot.y + normalizedHeight.y * rightAngleSize
              };
              
              return (
                <Group>
                  {/* Main base line of the triangle (highlighted) */}
                  <Line
                    points={[left.x, left.y, right.x, right.y]}
                    stroke="#e67e22"
                    strokeWidth={4}
                    opacity={0.7}
                  />
                  
                  {/* Extended base line at foot point for clarity */}
                  <Line
                    points={[baseStart.x, baseStart.y, baseEnd.x, baseEnd.y]}
                    stroke="#e67e22"
                    strokeWidth={2}
                    dash={[8, 4]}
                  />
                  
                  {/* Dashed height line */}
                  <Line
                    points={[top.x, top.y, foot.x, foot.y]}
                    stroke="#1864ab"
                    strokeWidth={3}
                    dash={[5, 5]}
                  />
                  
                  {/* RIGHT ANGLE INDICATOR - Proper square at foot point using height direction */}
                  <Line
                    points={[
                      corner1.x, corner1.y,  // Start at foot
                      corner2.x, corner2.y,  // Along base direction
                      corner3.x, corner3.y,  // Corner of square (using height direction)
                      corner4.x, corner4.y,  // Along height direction towards triangle
                      corner1.x, corner1.y   // Back to foot (complete square)
                    ]}
                    stroke="#27ae60"
                    strokeWidth={2}
                    fill="rgba(39, 174, 96, 0.2)" // Slightly more visible fill
                    closed={true}
                  />
                  
                  {/* Foot point marker */}
                  <Circle
                    x={foot.x}
                    y={foot.y}
                    radius={3}
                    fill="#27ae60"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                  
                  {/* Height label */}
                  <Group x={labelX} y={labelY}>
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
                  
                  {/* Base label */}
                  <Group x={(left.x + right.x) / 2} y={(left.y + right.y) / 2 + 25}>
                    <Rect
                      x={-25}
                      y={-10}
                      width={50}
                      height={20}
                      fill="white"
                      stroke="#e67e22"
                      strokeWidth={1}
                      cornerRadius={4}
                    />
                    <Text
                      x={0}
                      y={-5}
                      text="base"
                      fontSize={11}
                      fontFamily="Arial"
                      fill="#e67e22"
                      fontStyle="bold"
                      align="center"
                      offsetX={25}
                      width={50}
                    />
                  </Group>
                  
                  {/* Right angle indicator label - positioned at the corner of the square */}
                  <Group x={corner3.x + 8} y={corner3.y - 8}>
                    <Rect
                      x={-8}
                      y={-8}
                      width={16}
                      height={16}
                      fill="white"
                      stroke="#27ae60"
                      strokeWidth={1}
                      cornerRadius={3}
                    />
                    <Text
                      x={0}
                      y={-2}
                      text="90°"
                      fontSize={9}
                      fontFamily="Arial"
                      fill="#27ae60"
                      fontStyle="bold"
                      align="center"
                      offsetX={8}
                      width={16}
                    />
                  </Group>
                </Group>
              );
            })()}
          </>
        )}

        {/* Fixed Angle indicators with proper arc calculations */}
        {showAngles && (
          <>
            {/* Top angle */}
            <Group>
              {(() => {
                const v1 = { x: left.x - top.x, y: left.y - top.y };
                const v2 = { x: right.x - top.x, y: right.y - top.y };
                
                const angle1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
                const angle2 = Math.atan2(v2.y, v2.x) * 180 / Math.PI;
                
                let arcAngle = angle2 - angle1;
                if (arcAngle > 180) arcAngle -= 360;
                if (arcAngle < -180) arcAngle += 360;
                
                const rotationAngle = arcAngle > 0 ? angle1 : angle2;
                
                return (
                  <>
                    <Arc
                      x={top.x}
                      y={top.y}
                      innerRadius={19}
                      outerRadius={21}
                      angle={Math.abs(arcAngle)}
                      rotation={rotationAngle}
                      fill="#1864ab"
                      stroke="#1864ab"
                      strokeWidth={0.5}
                    />
                    <Group x={top.x} y={top.y - 35}>
                      <Rect
                        x={-20}
                        y={-10}
                        width={40}
                        height={20}
                        fill="white"
                        stroke="#1864ab"
                        strokeWidth={1}
                        cornerRadius={4}
                      />
                      <Text
                        x={0}
                        y={-5}
                        text={`${topAngle.toFixed(1)}°`}
                        fontSize={12}
                        fontFamily="Arial"
                        fill="#1864ab"
                        fontStyle="bold"
                        align="center"
                        offsetX={20}
                        width={40}
                      />
                    </Group>
                  </>
                );
              })()}
            </Group>
            
            {/* Left angle */}
            <Group>
              {(() => {
                const v1 = { x: top.x - left.x, y: top.y - left.y };
                const v2 = { x: right.x - left.x, y: right.y - left.y };
                
                const angle1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
                const angle2 = Math.atan2(v2.y, v2.x) * 180 / Math.PI;
                
                let arcAngle = angle2 - angle1;
                if (arcAngle > 180) arcAngle -= 360;
                if (arcAngle < -180) arcAngle += 360;
                
                const rotationAngle = arcAngle > 0 ? angle1 : angle2;
                
                return (
                  <>
                    <Arc
                      x={left.x}
                      y={left.y}
                      innerRadius={19}
                      outerRadius={21}
                      angle={Math.abs(arcAngle)}
                      rotation={rotationAngle}
                      fill="#1864ab"
                      stroke="#1864ab"
                      strokeWidth={0.5}
                    />
                    <Group x={left.x - 35} y={left.y + 25}>
                      <Rect
                        x={-20}
                        y={-10}
                        width={40}
                        height={20}
                        fill="white"
                        stroke="#1864ab"
                        strokeWidth={1}
                        cornerRadius={4}
                      />
                      <Text
                        x={0}
                        y={-5}
                        text={`${leftAngle.toFixed(1)}°`}
                        fontSize={12}
                        fontFamily="Arial"
                        fill="#1864ab"
                        fontStyle="bold"
                        align="center"
                        offsetX={20}
                        width={40}
                      />
                    </Group>
                  </>
                );
              })()}
            </Group>
            
            {/* Right angle */}
            <Group>
              {(() => {
                const v1 = { x: top.x - right.x, y: top.y - right.y };
                const v2 = { x: left.x - right.x, y: left.y - right.y };
                
                const angle1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
                const angle2 = Math.atan2(v2.y, v2.x) * 180 / Math.PI;
                
                let arcAngle = angle2 - angle1;
                if (arcAngle > 180) arcAngle -= 360;
                if (arcAngle < -180) arcAngle += 360;
                
                const rotationAngle = arcAngle > 0 ? angle1 : angle2;
                
                return (
                  <>
                    <Arc
                      x={right.x}
                      y={right.y}
                      innerRadius={19}
                      outerRadius={21}
                      angle={Math.abs(arcAngle)}
                      rotation={rotationAngle}
                      fill="#1864ab"
                      stroke="#1864ab"
                      strokeWidth={0.5}
                    />
                    <Group x={right.x + 35} y={right.y + 25}>
                      <Rect
                        x={-20}
                        y={-10}
                        width={40}
                        height={20}
                        fill="white"
                        stroke="#1864ab"
                        strokeWidth={1}
                        cornerRadius={4}
                      />
                      <Text
                        x={0}
                        y={-5}
                        text={`${rightAngle.toFixed(1)}°`}
                        fontSize={12}
                        fontFamily="Arial"
                        fill="#1864ab"
                        fontStyle="bold"
                        align="center"
                        offsetX={20}
                        width={40}
                      />
                    </Group>
                  </>
                );
              })()}
            </Group>
          </>
        )}
      </Group>
    </>
  );
};

export default TriangleShape;
