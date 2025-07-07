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
      if (type === "square") {
        const rect = mainAreaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setShapes((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "square",
            x: x - 40,
            y: y - 40,
            size: 80,
            color: "#e3dcc2", // Match toolbox color
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