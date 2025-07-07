import React, { useRef } from "react";
import styles from "@/styles/create-problem.module.css";

interface SquareShapeProps {
  shape: {
    id: number;
    x: number;
    y: number;
    size: number;
    color?: string;
  };
  isSelected: boolean;
  onUpdate: (update: Partial<{ x: number; y: number; size: number }>) => void;
}

const SquareShape: React.FC<SquareShapeProps & { showProperties: boolean }> = ({
  shape,
  isSelected,
  onUpdate,
  showProperties,
}) => {
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const resizing = useRef<boolean>(false);

  // Drag logic
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(styles.resizeHandle)) {
      resizing.current = true;
    } else {
      dragOffset.current = { x: e.clientX - shape.x, y: e.clientY - shape.y };
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (resizing.current) {
      const newSize = Math.max(20, e.clientX - shape.x);
      onUpdate({ size: newSize });
    } else if (dragOffset.current) {
      onUpdate({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  };

  const onMouseUp = () => {
    dragOffset.current = null;
    resizing.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const side = shape.size;
  const area = side * side;
  const angles = [90, 90, 90, 90];

  return (
    <div
      className={styles.squareShape}
      style={{
        position: "absolute",
        left: shape.x,
        top: shape.y,
        width: shape.size,
        height: shape.size,
        background: shape.color || "#e3dcc2",
        border: "6px solid #000", // Match toolbox border
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: "move",
        userSelect: "none",
      }}
      onMouseDown={onMouseDown}
    >
      {/* Resize handle (bottom-right corner) */}
      {isSelected && (
        <div
          className={styles.resizeHandle}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            background: "#2c514c",
            cursor: "nwse-resize",
            borderRadius: 4,
          }}
        />
      )}
      {showProperties && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "100%",
            transform: "translate(-50%, 8px)",
            background: "#fff",
            color: "#222",
            fontSize: 14,
            borderRadius: 6,
            padding: "4px 10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginTop: 4,
            zIndex: 10,
            minWidth: 120,
            textAlign: "center",
          }}
        >
          {showSides && <div>Side: {side.toFixed(1)}</div>}
          {showAngles && <div>Angles: {angles.join("°, ")}°</div>}
          {showArea && <div>Area: {area.toFixed(1)}</div>}
        </div>
      )}
    </div>
  );
};

export default SquareShape;