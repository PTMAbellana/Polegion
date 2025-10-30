import { useState, useCallback } from 'react';

interface Shape {
  id: number;
  type: string;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points?: any;
}

export const useShapeManagement = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const pxToUnits = useCallback((px: number): number => {
    return px / 10;
  }, []);

  const getShapeProperties = useCallback((shape: Shape) => {
    if (shape.type === "square" && shape.points) {
      const { topLeft, topRight, bottomRight, bottomLeft } = shape.points;
      const sideLengths = [
        Math.sqrt((topLeft.x - topRight.x) ** 2 + (topLeft.y - topRight.y) ** 2),
        Math.sqrt((topRight.x - bottomRight.x) ** 2 + (topRight.y - bottomRight.y) ** 2),
        Math.sqrt((bottomRight.x - bottomLeft.x) ** 2 + (bottomRight.y - bottomLeft.y) ** 2),
        Math.sqrt((bottomLeft.x - topLeft.x) ** 2 + (bottomLeft.y - topLeft.y) ** 2),
      ].map(l => +(l / 10).toFixed(2));

      const area =
        0.5 *
        Math.abs(
          topLeft.x * topRight.y +
            topRight.x * bottomRight.y +
            bottomRight.x * bottomLeft.y +
            bottomLeft.x * topLeft.y -
            (topRight.x * topLeft.y +
              bottomRight.x * topRight.y +
              bottomLeft.x * bottomRight.y +
              topLeft.x * bottomLeft.y)
        ) / 100;

      return { ...shape, sideLengths, area: +area.toFixed(2) };
    }

    if (shape.type === "circle") {
      const diameter = +(shape.size / 10).toFixed(2);
      const radius = diameter / 2;
      const area = +(Math.PI * radius * radius).toFixed(2);
      const circumference = +(2 * Math.PI * radius).toFixed(2);
      return { ...shape, diameter, area, circumference };
    }

    if (shape.type === "triangle" && shape.points) {
      const pts = [shape.points.top, shape.points.left, shape.points.right];
      const sideLengths = [
        Math.sqrt((pts[0].x - pts[1].x) ** 2 + (pts[0].y - pts[1].y) ** 2) / 10,
        Math.sqrt((pts[1].x - pts[2].x) ** 2 + (pts[1].y - pts[2].y) ** 2) / 10,
        Math.sqrt((pts[2].x - pts[0].x) ** 2 + (pts[2].y - pts[0].y) ** 2) / 10,
      ].map(l => +l.toFixed(2));

      const area =
        Math.abs(
          (pts[0].x * (pts[1].y - pts[2].y) +
            pts[1].x * (pts[2].y - pts[0].y) +
            pts[2].x * (pts[0].y - pts[1].y)) / 2
        ) / 100;

      const baseLength = sideLengths[1];
      const height = +(2 * area / baseLength).toFixed(2);

      function dist(a: any, b: any) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / 10;
      }
      function getAngle(A: any, B: any, C: any) {
        const a = dist(B, C);
        const b = dist(A, C);
        const c = dist(A, B);
        const angleRad = Math.acos((b * b + c * c - a * a) / (2 * b * c));
        return +(angleRad * 180 / Math.PI).toFixed(2);
      }
      const angles = [
        getAngle(pts[0], pts[1], pts[2]),
        getAngle(pts[1], pts[2], pts[0]),
        getAngle(pts[2], pts[0], pts[1]),
      ];

      return {
        ...shape,
        points: shape.points,
        sideLengths,
        area: +area.toFixed(2),
        height,
        angles,
      };
    }

    return shape;
  }, []);

  return {
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
    selectedTool,
    setSelectedTool,
    pxToUnits,
    getShapeProperties,
  };
};
