import React, { RefObject } from "react";
import styles from "@/styles/create-problem.module.css";
import SquareShape from "../shapes/SquareShape";
import CircleShape from "../shapes/CircleShape";
import TriangleShape from "../shapes/TriangleShape";

// Assuming Point and Shape are declared somewhere globally or imported
interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  type: string;
  fill?: string;
  points?: {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
  };
  [key: string]: any;
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

interface MainAreaProps {
  mainAreaRef: RefObject<HTMLDivElement>;
  shapes: any[];
  renderShape: (shape: any, handleVertexDrag: typeof handleVertexDrag) => React.ReactNode;
  setShapes: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedId: (id: number | null) => void;
  setSelectedTool: (tool: string | null) => void;
  saveButton?: React.ReactNode;
  shapeLimit: number;
  shapeCount: number;
  onLimitReached: () => void;
}

const MainArea: React.FC<MainAreaProps> = ({
  mainAreaRef,
  shapes,
  renderShape,
  setShapes,
  setSelectedId,
  setSelectedTool,
  saveButton,
  shapeLimit,
  shapeCount,
  onLimitReached,
}) => {
  const handleVertexDrag = (
    shapeId: number,
    vertexKey: keyof Shape["points"],
    newPos: Point
  ) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (shape.id !== shapeId || !shape.points) return shape;

        // Handle triangle points
        if (shape.type === "triangle") {
          const updatedPoints = { ...shape.points, [vertexKey]: newPos };
          return { ...shape, points: updatedPoints };
        }

        // Handle square points
        if (shape.type === "square") {
          const updatedPoints = { ...shape.points, [vertexKey]: newPos };
          const pointArray = [
            updatedPoints.topLeft,
            updatedPoints.topRight,
            updatedPoints.bottomRight,
            updatedPoints.bottomLeft,
          ];

          if (isSelfIntersecting(pointArray)) {
            console.warn("Rejected self-intersecting update");
            return shape;
          }

          return { ...shape, points: updatedPoints };
        }

        return shape;
      })
    );
  };

  return (
    <div
      ref={mainAreaRef}
      className={styles.mainArea}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("shape-type");

        if (shapes.length >= shapeLimit) {
          onLimitReached?.();
          return;
        }

        const rect = mainAreaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (type === "square") {
          const size = 80;
          const topLeft = { x: x - size / 2, y: y - size / 2 };
          const topRight = { x: x + size / 2, y: y - size / 2 };
          const bottomRight = { x: x + size / 2, y: y + size / 2 };
          const bottomLeft = { x: x - size / 2, y: y + size / 2 };

          setShapes((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "square",
              x: x - 40,
              y: y - 40,
              size,
              fill: "#e3dcc2",
              points: {
                topLeft,
                topRight,
                bottomRight,
                bottomLeft,
              },
            },
          ]);
        } else if (type === "circle") {
          setShapes((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "circle",
              x: x - 40,
              y: y - 40,
              size: 80,
              color: "#e3dcc2",
            },
          ]);
        } else if (type === "triangle") {
          const size = 80;
          const h = size * Math.sqrt(3) / 2;
          const center = { x: x - 40, y: y - 40 };
          setShapes((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "triangle",
              x: center.x,
              y: center.y,
              size,
              color: "#e3dcc2",
              points: {
                top: { x: center.x, y: center.y - h / 2 },
                left: { x: center.x - size / 2, y: center.y + h / 2 },
                right: { x: center.x + size / 2, y: center.y + h / 2 },
              }
            },
          ]);
        }
      }}
      style={{ overflow: "hidden", position: "relative" }}
      onMouseDown={() => {
        setSelectedId(null);
        setSelectedTool(null);
      }}
    >
      <div className={styles.mainAreaHeader}>Main Area</div>
      {shapes.map((shape) => renderShape(shape, handleVertexDrag))}
      {saveButton}
    </div>
  );
};

export default MainArea;
