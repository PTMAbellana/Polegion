import React, { RefObject, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import styles from "@/styles/create-problem.module.css";
import CircleShape from "../shapes/CircleShape";
import SquareShape from "../shapes/SquareShape";
import TriangleShape from "../shapes/TriangleShape";

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  type: string;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points?: any;
}

interface MainAreaProps {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  setSelectedTool: (tool: string | null) => void;
  saveButton?: React.ReactNode;
  shapeLimit: number;
  shapeCount: number;
  onLimitReached: () => void;
  
  // Display props
  pxToUnits: (px: number) => string;
  showAreaByShape: {
    circle: boolean;
    triangle: boolean;
    square: boolean;
  };
  showSides: boolean;
  showAngles: boolean;
  showDiameter: boolean;
  showCircumference: boolean;
  showHeight: boolean;
}

const MainArea: React.FC<MainAreaProps> = ({
  shapes,
  setShapes,
  selectedId,
  setSelectedId,
  setSelectedTool,
  saveButton,
  shapeLimit,
  shapeCount,
  onLimitReached,
  pxToUnits,
  showAreaByShape,
  showSides,
  showAngles,
  showDiameter,
  showCircumference,
  showHeight,
}) => {
  const stageRef = useRef<any>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 400 });

  // Updated resize observer to fill entire MainArea
  React.useEffect(() => {
    const updateStageSize = () => {
      if (mainAreaRef.current) {
        const rect = mainAreaRef.current.getBoundingClientRect();
        const headerHeight = 48; // Exact header height from CSS
        
        setStageSize({
          width: rect.width, // Full width, no padding
          height: rect.height - headerHeight // Full height minus header
        });
      }
    };

    // Initial size
    updateStageSize();

    // Add resize listener
    window.addEventListener('resize', updateStageSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData("shape-type");
    
    if (!shapeType) return;

    if (shapeCount >= shapeLimit) {
      onLimitReached();
      return;
    }

    // Get stage position relative to container
    const containerRect = mainAreaRef.current?.getBoundingClientRect();
    const stageRect = stageRef.current?.content.getBoundingClientRect();
    
    if (!containerRect || !stageRect) return;

    // Calculate drop position relative to stage
    const dropX = e.clientX - stageRect.left;
    const dropY = e.clientY - stageRect.top;

    const newShape: Shape = {
      id: Date.now(),
      type: shapeType,
      x: dropX,
      y: dropY,
      size: 80,
      fill: "#e3dcc2",
    };

    // Keep existing shape initialization logic
    if (shapeType === "triangle") {
      const size = 80;
      const h = size * Math.sqrt(3) / 2;
      newShape.points = {
        top: { x: 0, y: -h / 2 },
        left: { x: -size / 2, y: h / 2 },
        right: { x: size / 2, y: h / 2 },
      };
    } else if (shapeType === "square") {
      const size = 80;
      newShape.points = {
        topLeft: { x: -size / 2, y: -size / 2 },
        topRight: { x: size / 2, y: -size / 2 },
        bottomRight: { x: size / 2, y: size / 2 },
        bottomLeft: { x: -size / 2, y: size / 2 },
      };
    }

    setShapes(prev => [...prev, newShape]);
    setSelectedId(newShape.id);
    setSelectedTool(null);
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedTool(null);
    }
  };

  // Add boundary checking for shape deletion
  const handleShapeChange = (updatedShape: Shape) => {
    // Check if shape is outside MainArea boundaries
    const isOutsideBounds = 
      updatedShape.x < 0 || 
      updatedShape.y < 0 || 
      updatedShape.x > stageSize.width || 
      updatedShape.y > stageSize.height;

    if (isOutsideBounds) {
      // Remove shape if dragged outside
      setShapes(prev => prev.filter(shape => shape.id !== updatedShape.id));
      setSelectedId(null);
      setSelectedTool(null);
      
      // Reset display properties if no shapes left
      const remainingShapes = shapes.filter(shape => shape.id !== updatedShape.id);
      if (remainingShapes.length === 0) {
        // You might want to call a callback to reset display toggles
        // onAllShapesDeleted?.();
      }
    } else {
      // Update shape normally if within bounds
      setShapes(prev => prev.map(shape => 
        shape.id === updatedShape.id ? updatedShape : shape
      ));
    }
  };

  // Enhanced drag end handler with boundary checking
  const handleShapeDragEnd = (updatedShape: Shape) => {
    // Add some tolerance for better UX (10px buffer)
    const tolerance = 10;
    const isOutsideBounds = 
      updatedShape.x < -tolerance || 
      updatedShape.y < -tolerance || 
      updatedShape.x > stageSize.width + tolerance || 
      updatedShape.y > stageSize.height + tolerance;

    if (isOutsideBounds) {
      // Remove shape with visual feedback
      setShapes(prev => prev.filter(shape => shape.id !== updatedShape.id));
      setSelectedId(null);
      setSelectedTool(null);
      
      // Optional: Show deletion feedback
      console.log(`Shape ${updatedShape.id} deleted - dragged outside bounds`);
    } else {
      // Update shape position normally
      setShapes(prev => prev.map(shape => 
        shape.id === updatedShape.id ? updatedShape : shape
      ));
    }
  };

  // Handle resize events
  const handleCircleResize = (id: number, newSize: number) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, size: newSize } : shape
    ));
  };

  const handleSquareResize = (id: number, newPoints: any) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, points: newPoints } : shape
    ));
  };

  const handleTriangleResize = (id: number, newPoints: any) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, points: newPoints } : shape
    ));
  };

  return (
    <div
      ref={mainAreaRef}
      className={styles.mainArea}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ 
        overflow: "hidden", 
        position: "relative"
        // Removed width/height overrides - let CSS handle it
      }}
    >
      <div className={styles.mainAreaHeader}>Main Area</div>
      
      {/* Stage container that fills remaining space */}
      <div style={{ 
        position: "relative", 
        width: "100%", 
        height: "calc(100% - 48px)", // Exact header height from CSS
        overflow: "hidden"
      }}>
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          style={{ 
            display: "block" // Removed debugging colors and border
          }}
        >
          <Layer>
            {shapes.map((shape) => {
              const isSelected = shape.id === selectedId;
              
              if (shape.type === "circle") {
                return (
                  <CircleShape
                    key={shape.id}
                    shape={shape}
                    isSelected={isSelected}
                    onSelect={() => setSelectedId(shape.id)}
                    onChange={handleShapeDragEnd} // Use enhanced handler
                    onResize={handleCircleResize}
                    pxToUnits={pxToUnits}
                    showDiameter={showDiameter}
                    showCircumference={showCircumference}
                    showAreaByShape={showAreaByShape}
                  />
                );
              }
              
              if (shape.type === "square") {
                return (
                  <SquareShape
                    key={shape.id}
                    shape={shape}
                    isSelected={isSelected}
                    onSelect={() => setSelectedId(shape.id)}
                    onChange={handleShapeDragEnd} // Use enhanced handler
                    onResize={handleSquareResize}
                    pxToUnits={pxToUnits}
                    showSides={showSides}
                    showAngles={showAngles}
                    showAreaByShape={showAreaByShape}
                  />
                );
              }
              
              if (shape.type === "triangle") {
                return (
                  <TriangleShape
                    key={shape.id}
                    shape={shape}
                    isSelected={isSelected}
                    onSelect={() => setSelectedId(shape.id)}
                    onChange={handleShapeDragEnd} // Use enhanced handler
                    onResize={handleTriangleResize}
                    pxToUnits={pxToUnits}
                    showSides={showSides}
                    showAngles={showAngles}
                    showHeight={showHeight}
                    showAreaByShape={showAreaByShape}
                  />
                );
              }
              
              return null;
            })}
          </Layer>
        </Stage>
      </div>

      {saveButton}
    </div>
  );
};

export default MainArea;