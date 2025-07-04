import React, { RefObject } from "react";
import styles from "@/styles/create-problem.module.css";
import SquareShape from "../shapes/SquareShape";
import CircleShape from "../shapes/CircleShape";
import TriangleShape from "../shapes/TriangleShape";

interface MainAreaProps {
  mainAreaRef: RefObject<HTMLDivElement>;
  shapes: any[];
  renderShape: (shape: any) => React.ReactNode;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  setSelectedId: (id: number | null) => void;
  setSelectedTool: (tool: string | null) => void;
  saveButton?: React.ReactNode;
}

const MainArea: React.FC<MainAreaProps> = ({
  mainAreaRef,
  shapes,
  renderShape,
  handleDrop,
  handleDragOver,
  setSelectedId,
  setSelectedTool,
  saveButton,
}) => (
  <div
    ref={mainAreaRef}
    className={styles.mainArea}
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    style={{ overflow: "hidden", position: "relative" }}
    onMouseDown={() => {
      setSelectedId(null);
      setSelectedTool(null);
    }}
  >
    <div className={styles.mainAreaHeader}>
      Main Area
    </div>
    {shapes.map(renderShape)}
    {saveButton}
  </div>
);

export default MainArea;