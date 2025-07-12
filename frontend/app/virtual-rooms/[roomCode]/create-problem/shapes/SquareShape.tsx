"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/create-problem.module.css";

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  fill?: string;
  points: {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
  };
}

interface SquareShapeProps {
  shape: Shape;
  isSelected: boolean;
  pxToUnits: (px: number) => string;
  handleShapeMouseDown: (id: number, e: React.MouseEvent) => void;
  setSelectedId: (id: number) => void;
  fillMode: boolean;
  draggingFill: boolean;
  scale: number;
  showProperties: boolean;
  onVertexMouseDown: (vertex: keyof Shape["points"]) => void;
  onSideMouseDown: (side: "top" | "bottom" | "left" | "right") => void;
}

const SquareShape: React.FC<SquareShapeProps> = ({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  fillMode,
  draggingFill,
  scale,
  showProperties,
  onVertexMouseDown,
  onSideMouseDown,
}) => {
  const { topLeft, topRight, bottomRight, bottomLeft } = shape.points;

  const getPolygonPoints = () =>
    `${topLeft.x},${topLeft.y} ${topRight.x},${topRight.y} ${bottomRight.x},${bottomRight.y} ${bottomLeft.x},${bottomLeft.y}`;

  const calculateSide = (p1: Point, p2: Point) =>
    Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

  const sideLengths = [
    calculateSide(topLeft, topRight),
    calculateSide(topRight, bottomRight),
    calculateSide(bottomRight, bottomLeft),
    calculateSide(bottomLeft, topLeft),
  ];

  const area = Math.abs(
    (topLeft.x * topRight.y + topRight.x * bottomRight.y + bottomRight.x * bottomLeft.y + bottomLeft.x * topLeft.y -
      topRight.x * topLeft.y - bottomRight.x * topRight.y - bottomLeft.x * bottomRight.y - topLeft.x * bottomLeft.y) /
      2
  );

  const sideMidpoints = {
    top: {
      x: (topLeft.x + topRight.x) / 2,
      y: (topLeft.y + topRight.y) / 2,
    },
    bottom: {
      x: (bottomLeft.x + bottomRight.x) / 2,
      y: (bottomLeft.y + bottomRight.y) / 2,
    },
    left: {
      x: (topLeft.x + bottomLeft.x) / 2,
      y: (topLeft.y + bottomLeft.y) / 2,
    },
    right: {
      x: (topRight.x + bottomRight.x) / 2,
      y: (topRight.y + bottomRight.y) / 2,
    },
  };

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <polygon
        points={getPolygonPoints()}
        fill={shape.fill || "#e3dcc2"}
        stroke="#000"
        strokeWidth={4}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleShapeMouseDown(shape.id, e); // 💡 This triggers dragging the entire shape
          setSelectedId(shape.id);
        }}
        style={{ cursor: "move", pointerEvents: "auto" }}
      />

      {/* Vertex handles */}
      {isSelected &&
        Object.entries(shape.points).map(([key, point]) => (
          <circle
            key={key}
            cx={point.x}
            cy={point.y}
            r={8}
            fill="#2c514c"
            stroke="#fff"
            strokeWidth={2}
            onMouseDown={(e) => {
              e.stopPropagation();
              onVertexMouseDown(key as keyof typeof shape.points);
            }}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        ))}

      {/* Side handles */}
      {isSelected &&
        Object.entries(sideMidpoints).map(([side, point]) => (
          <circle
            key={side}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="#555"
            stroke="#fff"
            strokeWidth={1.5}
            onMouseDown={(e) => {
              e.stopPropagation();
              onSideMouseDown(side as "top" | "bottom" | "left" | "right", point, e);
            }}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        ))}

      {/* Shape properties */}
      {isSelected && showProperties && (
        <foreignObject x={topLeft.x} y={topLeft.y - 60} width={160} height={60}>
          <div
            style={{
              background: "#fff",
              color: "#222",
              fontSize: 14,
              borderRadius: 6,
              padding: "4px 10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div>Area: {area.toFixed(1)}</div>
            <div>Sides: {sideLengths.map((s) => pxToUnits(s)).join(", ")}</div>
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

export default SquareShape;
