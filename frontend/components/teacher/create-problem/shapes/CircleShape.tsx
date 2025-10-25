import React from "react";
import { Circle, Line, Group, Text, Rect } from "react-konva";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

interface CircleShapeData {
  id: number;
  x: number;
  y: number;
  size: number;
  fill?: string;
}

interface CircleShapeProps {
  shape: CircleShapeData;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (shape: CircleShapeData) => void;
  onResize: (id: number, newSize: number) => void;
  pxToUnits: (px: number) => number;
  showDiameter: boolean;
  showCircumference: boolean;
  showAreaByShape: { circle: boolean; triangle: boolean; square: boolean };
}

const CircleShape: React.FC<CircleShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onResize,
  pxToUnits,
  showDiameter,
  showCircumference,
  showAreaByShape,
}) => {
  const radius = shape.size / 2;
  
  // Size constraints for circle
  const MIN_SIZE = 40;
  const MAX_SIZE = 300;
  
  // Calculate measurements
  const unitLabel = pxToUnits(shape.size);
  const unitDiameter = parseFloat(unitLabel.toString().match(/[\d.]+/)?.[0] || "0");
  const unitRadius = unitDiameter / 2;
  const unitArea = Math.PI * unitRadius * unitRadius;
  const unitCircumference = Math.PI * unitDiameter;

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

  const handleResizeMouseDown = (e: { evt: MouseEvent; cancelBubble?: boolean }) => {
    e.cancelBubble = true;
    
    // Keep your existing resize logic with size limits
    const startX = e.evt.clientX;
    const startSize = shape.size;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      let newSize = startSize + dx * 2;
      
      // Apply size constraints
      newSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newSize));
      
      onResize(shape.id, newSize);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Check if circle is at size limits for visual feedback
  const isAtMinSize = shape.size <= MIN_SIZE;
  const isAtMaxSize = shape.size >= MAX_SIZE;

  return (
    <>
      {/* Main Shape Group - Only contains the shape elements */}
      <Group
        x={shape.x}
        y={shape.y}
        draggable
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
      >
        {/* Main Circle */}
        <Circle
          radius={radius}
          fill={shape.fill || "#e3dcc2"}
          stroke="#000"
          strokeWidth={6}
        />

        {/* Diameter line */}
        {isSelected && (
          <Line
            points={[-radius, 0, radius, 0]}
            stroke="#222"
            strokeWidth={3}
          />
        )}

        {/* Resize handle with visual feedback for size limits */}
        {isSelected && (
          <Circle
            x={radius + 15}
            y={0}
            radius={9}
            fill={isAtMaxSize ? "#e74c3c" : isAtMinSize ? "#f39c12" : "#2c514c"}
            stroke="#fff"
            strokeWidth={2}
            draggable={false}
            onMouseDown={handleResizeMouseDown}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                if (isAtMaxSize || isAtMinSize) {
                  container.style.cursor = "not-allowed";
                } else {
                  container.style.cursor = "ew-resize";
                }
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        )}

        {/* Size limit indicator */}
        {isSelected && (isAtMinSize || isAtMaxSize) && (
          <Group>
            <Rect
              x={-40}
              y={radius + 15}
              width={80}
              height={18}
              fill={isAtMaxSize ? "#e74c3c" : "#f39c12"}
              stroke="#fff"
              strokeWidth={1}
              cornerRadius={9}
            />
            <Text
              x={0}
              y={radius + 20}
              text={isAtMaxSize ? "MAX SIZE" : "MIN SIZE"}
              fontSize={10}
              fontFamily="Arial"
              fill="#fff"
              fontStyle="bold"
              align="center"
              offsetX={40}
              width={80}
            />
          </Group>
        )}

        {/* Diameter label */}
        {isSelected && showDiameter && (
          <Group>
            <Rect
              x={-35}
              y={-10}
              width={70}
              height={20}
              fill="white"
              stroke="#1864ab"
              strokeWidth={1}
              cornerRadius={4}
            />
            <Text
              x={0}
              y={-5}
              text={`Ø: ${unitDiameter.toFixed(2)} u`}
              fontSize={12}
              fontFamily="Arial"
              fill="#1864ab"
              fontStyle="bold"
              align="center"
              offsetX={35}
              width={70} 
            />
          </Group>
        )}

        {/* Circumference label */}
        {isSelected && showCircumference && (
          <Group>
            <Rect
              x={-45}
              y={radius + 35}
              width={90}
              height={20}
              fill="white"
              stroke="#e67e22"
              strokeWidth={1}
              cornerRadius={4}
            />
            <Text
              x={0}
              y={radius + 40}
              text={`C: ${unitCircumference.toFixed(2)} u`}
              fontSize={12}
              fontFamily="Arial"
              fill="#e67e22"
              fontStyle="bold"
              align="center"
              offsetX={45}
              width={90}
            />
          </Group>
        )}
      </Group>

      {/* FIXED OVERLAYS - Outside the Group, absolutely positioned */}
      {/* Area Formula Display - FIXED POSITION */}
      {showAreaByShape.circle && isSelected && (
        <>
          {(() => {
            const formulaText = "Area = π × r²";
            const calculationText = `A = π × ${unitRadius.toFixed(2)}² = ${unitArea.toFixed(2)} u²`;
            const formulaWidth = Math.max(formulaText.length * 8, calculationText.length * 7) + 20;

            return (
              <>
                {/* ABSOLUTE Position - Not affected by shape movement */}
                <Rect
                  x={50} // Fixed absolute position
                  y={70} // Fixed absolute position
                  width={formulaWidth}
                  height={85}
                  cornerRadius={8}
                  fill="white"
                  stroke="#2c514c"
                  strokeWidth={2}
                  shadowColor="rgba(0,0,0,0.1)"
                  shadowBlur={4}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={1}
                />
                
                <Text
                  x={50 + formulaWidth/2} // Absolute positioning
                  y={85}
                  text="Area Formula"
                  fontSize={13}
                  fill="#2c514c"
                  align="center"
                  fontStyle="bold"
                  offsetX={formulaWidth/2}
                  width={formulaWidth}
                />
                
                <Text
                  x={50 + formulaWidth/2}
                  y={105}
                  text={formulaText}
                  fontSize={11}
                  fill="#666"
                  align="center"
                  fontStyle="italic"
                  offsetX={formulaWidth/2}
                  width={formulaWidth}
                />
                
                <Text
                  x={50 + formulaWidth/2}
                  y={125}
                  text={calculationText}
                  fontSize={10}
                  fill="#1864ab"
                  align="center"
                  fontStyle="bold"
                  offsetX={formulaWidth/2}
                  width={formulaWidth}
                />
              </>
            );
          })()}
        </>
      )}

      {/* Circumference Formula Display - FIXED POSITION */}
      {showCircumference && isSelected && (
        <>
          {(() => {
            const formulaText = "Circumference = 2 × π × r";
            const calculationText = `C = 2 × π × ${unitRadius.toFixed(2)} = ${unitCircumference.toFixed(2)} u`;
            const formulaWidth = Math.max(formulaText.length * 8, calculationText.length * 7) + 20;

            return (
              <>
                {/* ABSOLUTE Position - Not affected by shape movement */}
                <Rect
                  x={50} // Fixed absolute position
                  y={170} // Fixed absolute position (below area box)
                  width={formulaWidth}
                  height={85}
                  cornerRadius={8}
                  fill="white"
                  stroke="#ff6b35"
                  strokeWidth={2}
                  shadowColor="rgba(0,0,0,0.1)"
                  shadowBlur={4}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={1}
                />
                
                <Text
                  x={50 + formulaWidth/2} // Absolute positioning
                  y={185}
                  text="Circumference Formula"
                  fontSize={13}
                  fill="#ff6b35"
                  align="center"
                  fontStyle="bold"
                  offsetX={formulaWidth/2}
                  width={formulaWidth}
                />
                
                <Text
                  x={50 + formulaWidth/2}
                  y={205}
                  text="C = 2 × π × r"
                  fontSize={11}
                  fill="#666"
                  align="center"
                  fontStyle="italic"
                  offsetX={formulaWidth/2}
                  width={formulaWidth}
                />
                
                <Text
                  x={50 + formulaWidth/2}
                  y={225}
                  text={calculationText}
                  fontSize={10}
                  fill="#ff6b35"
                  align="center"
                  fontStyle="bold"
                  offsetX={formulaWidth/2}
                  width={formulaWidth}
                />
              </>
            );
          })()}
        </>
      )}
    </>
  );
};

export default CircleShape;