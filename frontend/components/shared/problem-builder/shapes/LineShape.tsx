import React from "react";
import { Line, Group, Text, Rect, Circle } from "react-konva";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

interface Point {
  x: number;
  y: number;
}

interface LinePoints {
  start: Point;
  end: Point;
}

interface LineShapeData {
  id: number;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points: LinePoints;
}

interface LineShapeProps {
  shape: LineShapeData;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (shape: LineShapeData) => void;
  onResize: (id: number, newPoints: LinePoints) => void;
  pxToUnits: (px: number) => number;
  showLength: boolean;
  showMidpoint: boolean;
}

const LineShape: React.FC<LineShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onResize,
  pxToUnits,
  showLength,
  showMidpoint,
}) => {
  const { start, end } = shape.points;

  // Calculate line length
  const getDistance = (p1: Point, p2: Point) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const lengthInPixels = getDistance(start, end);
  const lengthInUnits = pxToUnits(lengthInPixels);

  // Calculate midpoint
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };

  // Calculate angle for label rotation
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

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

  const handleEndpointDrag = (endpointKey: 'start' | 'end', e: { evt: MouseEvent; cancelBubble?: boolean }) => {
    e.cancelBubble = true;
    
    const startX = e.evt.clientX;
    const startY = e.evt.clientY;
    const startPoints = { ...shape.points };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const newPoints = {
        ...startPoints,
        [endpointKey]: {
          x: snap(startPoints[endpointKey].x + dx, 1),
          y: snap(startPoints[endpointKey].y + dy, 1)
        }
      };
      
      // Ensure minimum length
      const newLength = getDistance(newPoints.start, newPoints.end);
      if (newLength >= 30) {
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

  return (
    <>
      <Group
        x={shape.x}
        y={shape.y}
        draggable
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
        {/* Main Line */}
        <Line
          points={[start.x, start.y, end.x, end.y]}
          stroke={isSelected ? "#2c514c" : "#000"}
          strokeWidth={isSelected ? 4 : 3}
        />

        {/* Start endpoint handle */}
        {isSelected && (
          <Circle
            x={start.x}
            y={start.y}
            radius={8}
            fill="#2c514c"
            stroke="#fff"
            strokeWidth={2}
            draggable={false}
            onMouseDown={(e) => handleEndpointDrag('start', e)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        )}

        {/* End endpoint handle */}
        {isSelected && (
          <Circle
            x={end.x}
            y={end.y}
            radius={8}
            fill="#2c514c"
            stroke="#fff"
            strokeWidth={2}
            draggable={false}
            onMouseDown={(e) => handleEndpointDrag('end', e)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        )}

        {/* Midpoint indicator */}
        {showMidpoint && (
          <Circle
            x={midpoint.x}
            y={midpoint.y}
            radius={4}
            fill="#e67e22"
            stroke="#fff"
            strokeWidth={1}
          />
        )}

        {/* Length label */}
        {showLength && (
          <Group rotation={angleDeg} x={midpoint.x} y={midpoint.y - 20}>
            <Rect
              x={-40}
              y={-10}
              width={80}
              height={20}
              fill="white"
              stroke="#1864ab"
              strokeWidth={1}
              cornerRadius={4}
            />
            <Text
              x={0}
              y={-5}
              text={`${lengthInUnits.toFixed(2)} u`}
              fontSize={12}
              fontFamily="Arial"
              fill="#1864ab"
              fontStyle="bold"
              align="center"
              offsetX={40}
              width={80}
            />
          </Group>
        )}

        {/* Endpoint labels */}
        {isSelected && (
          <>
            <Group x={start.x - 15} y={start.y - 20}>
              <Rect
                x={-10}
                y={-10}
                width={20}
                height={20}
                fill="white"
                stroke="#2c514c"
                strokeWidth={1}
                cornerRadius={3}
              />
              <Text
                x={0}
                y={-4}
                text="A"
                fontSize={12}
                fontFamily="Arial"
                fill="#2c514c"
                fontStyle="bold"
                align="center"
                offsetX={10}
                width={20}
              />
            </Group>
            <Group x={end.x + 15} y={end.y - 20}>
              <Rect
                x={-10}
                y={-10}
                width={20}
                height={20}
                fill="white"
                stroke="#2c514c"
                strokeWidth={1}
                cornerRadius={3}
              />
              <Text
                x={0}
                y={-4}
                text="B"
                fontSize={12}
                fontFamily="Arial"
                fill="#2c514c"
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

export default LineShape;
