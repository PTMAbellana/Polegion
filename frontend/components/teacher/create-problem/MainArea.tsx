import React, { useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import styles from "@/styles/create-problem-teacher.module.css";
import CircleShape from "./shapes/CircleShape";
import SquareShape from "./shapes/SquareShape";
import TriangleShape from "./shapes/TriangleShape";

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
  points?: unknown;
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
  onAllShapesDeleted: () => void;
  pxToUnits: (px: number) => number;
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

  React.useEffect(() => {
    const updateStageSize = () => {
      if (mainAreaRef.current) {
        const rect = mainAreaRef.current.getBoundingClientRect();
        const headerHeight = 48;
        
        setStageSize({
          width: rect.width,
          height: rect.height - headerHeight
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    
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

    const containerRect = mainAreaRef.current?.getBoundingClientRect();
    const stageRect = stageRef.current?.content.getBoundingClientRect();
    
    if (!containerRect || !stageRect) return;

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

  const handleShapeDragEnd = (updatedShape: Shape) => {
    const tolerance = 10;
    const isOutsideBounds = 
      updatedShape.x < -tolerance || 
      updatedShape.y < -tolerance || 
      updatedShape.x > stageSize.width + tolerance || 
      updatedShape.y > stageSize.height + tolerance;

    if (isOutsideBounds) {
      setShapes(prev => prev.filter(shape => shape.id !== updatedShape.id));
      setSelectedId(null);
      setSelectedTool(null);
    } else {
      setShapes(prev => prev.map(shape => 
        shape.id === updatedShape.id ? updatedShape : shape
      ));
    }
  };

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
    >
      <div className={styles.mainAreaHeader}>Main Area</div>
      
      <div className={styles.stageContainer}>
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
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
                    onChange={handleShapeDragEnd}
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
                    onChange={handleShapeDragEnd}
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
                    onChange={handleShapeDragEnd}
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
