import React, { RefObject } from "react";
import styles from "@/styles/create-problem.module.css";
import SquareShape from "../shapes/SquareShape";
import CircleShape from "../shapes/CircleShape";
import TriangleShape from "../shapes/TriangleShape";

interface MainAreaProps {
  mainAreaRef: React.RefObject<HTMLDivElement>;
  shapes: any[];
  renderShape: (shape: any) => React.ReactNode;
  setShapes: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedId: (id: number | null) => void;
  setSelectedTool: (tool: string | null) => void;
  saveButton?: React.ReactNode;
}

const MainArea: React.FC<MainAreaProps> = ({
  mainAreaRef,
  shapes,
  renderShape,
  setSelectedId,
  setSelectedTool,
  saveButton,
  setShapes,
}) => (
  <div
    ref={mainAreaRef}
    className={styles.mainArea}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("shape-type");
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
            size: 80, // diameter
            color: "#e3dcc2",
          },
        ]);
      } else if (type === "triangle") {
        setShapes((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "triangle",
            x: x - 45,
            y: y - 45,
            size: 90,
            color: "#e3dcc2",
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
    {shapes.map(renderShape)}
    {saveButton}
  </div>
);

export default MainArea;