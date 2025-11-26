import React from "react";
import { Line, Group, Text, Rect, Circle, Arc } from "react-konva";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

interface Point {
  x: number;
  y: number;
}

interface AnglePoints {
  vertex: Point;
  arm1End: Point;
  arm2End: Point;
}

interface AngleShapeData {
  id: number;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points: AnglePoints;
}

interface AngleShapeProps {
  shape: AngleShapeData;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (shape: AngleShapeData) => void;
  onResize: (id: number, newPoints: AnglePoints) => void;
  showMeasurement: boolean;
  showArcRadius: boolean;
}

const AngleShape: React.FC<AngleShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onResize,
  showMeasurement,
  showArcRadius,
}) => {
  const { vertex, arm1End, arm2End } = shape.points;

  // Calculate angle in degrees
  const getAngleDegrees = () => {
    const v1 = { x: arm1End.x - vertex.x, y: arm1End.y - vertex.y };
    const v2 = { x: arm2End.x - vertex.x, y: arm2End.y - vertex.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    const cosAngle = dot / (mag1 * mag2);
    const clampedCos = Math.max(-1, Math.min(1, cosAngle));
    return (Math.acos(clampedCos) * 180) / Math.PI;
  };

  const angleDegrees = getAngleDegrees();

  // Determine angle type
  const getAngleType = () => {
    if (Math.abs(angleDegrees - 90) < 1) return "Right Angle";
    if (angleDegrees < 90) return "Acute Angle";
    if (angleDegrees > 90 && angleDegrees < 180) return "Obtuse Angle";
    if (Math.abs(angleDegrees - 180) < 1) return "Straight Angle";
    return "Angle";
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

  const handlePointDrag = (pointKey: 'vertex' | 'arm1End' | 'arm2End', e: { evt: MouseEvent; cancelBubble?: boolean }) => {
    e.cancelBubble = true;
    
    const startX = e.evt.clientX;
    const startY = e.evt.clientY;
    const startPoints = { ...shape.points };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const newPoints = {
        ...startPoints,
        [pointKey]: {
          x: snap(startPoints[pointKey].x + dx, 1),
          y: snap(startPoints[pointKey].y + dy, 1)
        }
      };
      
      onResize(shape.id, newPoints);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate arc parameters
  const v1 = { x: arm1End.x - vertex.x, y: arm1End.y - vertex.y };
  const v2 = { x: arm2End.x - vertex.x, y: arm2End.y - vertex.y };
  
  const angle1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
  const angle2 = Math.atan2(v2.y, v2.x) * 180 / Math.PI;
  
  let arcAngle = angle2 - angle1;
  if (arcAngle > 180) arcAngle -= 360;
  if (arcAngle < -180) arcAngle += 360;
  
  // Use the correct rotation angle
  const rotationAngle = arcAngle > 0 ? angle1 : angle2;
  const arcRadius = showArcRadius ? 40 : 30;

  // Calculate label position
  const midAngleRad = ((rotationAngle + (rotationAngle + Math.abs(arcAngle))) / 2) * Math.PI / 180;
  const labelDistance = arcRadius + 25;
  const labelX = vertex.x + Math.cos(midAngleRad) * labelDistance;
  const labelY = vertex.y + Math.sin(midAngleRad) * labelDistance;

  // Check if it's a right angle
  const isRightAngle = Math.abs(angleDegrees - 90) < 1;

  return (
    <>
      <Group
        x={shape.x}
        y={shape.y}
        draggable={true}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
      >
        {/* Arm 1 */}
        <Line
          points={[vertex.x, vertex.y, arm1End.x, arm1End.y]}
          stroke={isSelected ? "#2c514c" : "#000"}
          strokeWidth={isSelected ? 4 : 3}
        />

        {/* Arm 2 */}
        <Line
          points={[vertex.x, vertex.y, arm2End.x, arm2End.y]}
          stroke={isSelected ? "#2c514c" : "#000"}
          strokeWidth={isSelected ? 4 : 3}
        />

        {/* Angle Arc or Right Angle Indicator */}
        {isRightAngle ? (
          <Group>
            {(() => {
              const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
              const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
              
              if (mag1 === 0 || mag2 === 0) return null;
              
              const v1Unit = { x: v1.x / mag1, y: v1.y / mag1 };
              const v2Unit = { x: v2.x / mag2, y: v2.y / mag2 };
              
              const squareSize = 15;
              
              return (
                <>
                  <Line
                    points={[
                      vertex.x + v1Unit.x * squareSize,
                      vertex.y + v1Unit.y * squareSize,
                      vertex.x + v1Unit.x * squareSize + v2Unit.x * squareSize,
                      vertex.y + v1Unit.y * squareSize + v2Unit.y * squareSize
                    ]}
                    stroke="#1864ab"
                    strokeWidth={2}
                  />
                  <Line
                    points={[
                      vertex.x + v2Unit.x * squareSize,
                      vertex.y + v2Unit.y * squareSize,
                      vertex.x + v2Unit.x * squareSize + v1Unit.x * squareSize,
                      vertex.y + v2Unit.y * squareSize + v1Unit.y * squareSize
                    ]}
                    stroke="#1864ab"
                    strokeWidth={2}
                  />
                </>
              );
            })()}
          </Group>
        ) : (
          <Arc
            x={vertex.x}
            y={vertex.y}
            innerRadius={arcRadius - 2}
            outerRadius={arcRadius + 2}
            angle={Math.abs(arcAngle)}
            rotation={rotationAngle}
            fill="#1864ab"
            stroke="#1864ab"
            strokeWidth={1}
          />
        )}

        {/* Angle Measurement Label */}
        {showMeasurement && (
          <Group x={labelX} y={labelY}>
            <Rect
              x={-30}
              y={-12}
              width={60}
              height={24}
              fill="white"
              stroke="#1864ab"
              strokeWidth={1}
              cornerRadius={4}
            />
            <Text
              x={0}
              y={-6}
              text={`${angleDegrees.toFixed(1)}°`}
              fontSize={14}
              fontFamily="Arial"
              fill="#1864ab"
              fontStyle="bold"
              align="center"
              offsetX={30}
              width={60}
            />
          </Group>
        )}

        {/* Point handles when selected */}
        {isSelected && (
          <>
            {/* Vertex */}
            <Circle
              x={vertex.x}
              y={vertex.y}
              radius={10}
              fill="#e74c3c"
              stroke="#fff"
              strokeWidth={2}
              draggable={false}
              onMouseDown={(e) => handlePointDrag('vertex', e)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "default";
              }}
            />

            {/* Arm 1 End */}
            <Circle
              x={arm1End.x}
              y={arm1End.y}
              radius={8}
              fill="#2c514c"
              stroke="#fff"
              strokeWidth={2}
              draggable={false}
              onMouseDown={(e) => handlePointDrag('arm1End', e)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "default";
              }}
            />

            {/* Arm 2 End */}
            <Circle
              x={arm2End.x}
              y={arm2End.y}
              radius={8}
              fill="#2c514c"
              stroke="#fff"
              strokeWidth={2}
              draggable={false}
              onMouseDown={(e) => handlePointDrag('arm2End', e)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "default";
              }}
            />

            {/* Point Labels */}
            <Group x={vertex.x} y={vertex.y - 20}>
              <Rect
                x={-10}
                y={-10}
                width={20}
                height={20}
                fill="white"
                stroke="#e74c3c"
                strokeWidth={1}
                cornerRadius={3}
              />
              <Text
                x={0}
                y={-4}
                text="V"
                fontSize={12}
                fontFamily="Arial"
                fill="#e74c3c"
                fontStyle="bold"
                align="center"
                offsetX={10}
                width={20}
              />
            </Group>
          </>
        )}
      </Group>
    </>
  );
};

export default AngleShape;
