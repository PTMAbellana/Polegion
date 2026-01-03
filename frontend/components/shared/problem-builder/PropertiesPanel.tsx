import React from "react";
import styles from "@/styles/problem-builder.module.css";
import { Shape } from "@/types";

interface PropertiesPanelProps {
  selectedShape: Shape | null;
  pxToUnits: (px: number) => number;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedShape,
  pxToUnits,
}) => {
  
  // Helper to safely convert and format values
  const safeToFixed = (value: number | string, decimals: number = 2): string => {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toFixed(decimals);
  };
  
  // Safe pxToUnits that always returns a number
  const safePxToUnits = (px: number): number => {
    const result = pxToUnits(px);
    return typeof result === 'number' ? result : Number(result) || 0;
  };

  if (!selectedShape) {
    return (
      <div className={styles.propertiesPanel}>
        <div className={styles.propertiesPanelHeader}>Properties</div>
        <div className={styles.propertiesEmpty}>
          <p className={styles.emptyText}>Select a shape to view its properties</p>
        </div>
      </div>
    );
  }

  const renderLineProperties = () => {
    const points = selectedShape.points as any;
    if (!points?.start || !points?.end) return null;

    const { start, end } = points;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const lengthUnits = safePxToUnits(length);
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    return (
      <>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Length</div>
          <div className={styles.propertyValue}>{safeToFixed(lengthUnits, 2)} units</div>
          <div className={styles.propertyFormula}>
            √[(x₂-x₁)² + (y₂-y₁)²]
          </div>
          <div className={styles.propertyDetails}>
            √[({safeToFixed(end.x, 0)}-{safeToFixed(start.x, 0)})² + ({safeToFixed(end.y, 0)}-{safeToFixed(start.y, 0)})²] = {safeToFixed(lengthUnits, 2)}
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Midpoint</div>
          <div className={styles.propertyValue}>
            ({safeToFixed(safePxToUnits(midX), 1)}, {safeToFixed(safePxToUnits(midY), 1)})
          </div>
          <div className={styles.propertyFormula}>
            ((x₁+x₂)/2, (y₁+y₂)/2)
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Point A (Start)</div>
          <div className={styles.propertyValue}>
            ({safeToFixed(safePxToUnits(start.x), 1)}, {safeToFixed(safePxToUnits(start.y), 1)})
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Point B (End)</div>
          <div className={styles.propertyValue}>
            ({safeToFixed(safePxToUnits(end.x), 1)}, {safeToFixed(safePxToUnits(end.y), 1)})
          </div>
        </div>
      </>
    );
  };

  const renderAngleProperties = () => {
    const points = selectedShape.points as any;
    if (!points?.vertex || !points?.arm1End || !points?.arm2End) return null;

    const { vertex, arm1End, arm2End } = points;
    const v1 = { x: arm1End.x - vertex.x, y: arm1End.y - vertex.y };
    const v2 = { x: arm2End.x - vertex.x, y: arm2End.y - vertex.y };

    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    if (mag1 === 0 || mag2 === 0) return null;

    const cosAngle = dot / (mag1 * mag2);
    const clampedCos = Math.max(-1, Math.min(1, cosAngle));
    const angleDegrees = (Math.acos(clampedCos) * 180) / Math.PI;

    const getAngleType = () => {
      if (Math.abs(angleDegrees - 90) < 1) return "Right Angle";
      if (angleDegrees < 90) return "Acute Angle";
      if (angleDegrees > 90 && angleDegrees < 180) return "Obtuse Angle";
      if (Math.abs(angleDegrees - 180) < 1) return "Straight Angle";
      return "Angle";
    };

    return (
      <>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Angle Type</div>
          <div className={styles.propertyValue}>{getAngleType()}</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Measurement</div>
          <div className={styles.propertyValue}>{angleDegrees.toFixed(1)}°</div>
          <div className={styles.propertyFormula}>
            cos⁻¹((v₁·v₂)/(|v₁||v₂|))
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Classification</div>
          <div className={styles.propertyDetails}>
            {angleDegrees < 90 && "Less than 90° (Acute)"}
            {Math.abs(angleDegrees - 90) < 1 && "Exactly 90° (Right)"}
            {angleDegrees > 90 && angleDegrees < 180 && "Between 90° and 180° (Obtuse)"}
            {Math.abs(angleDegrees - 180) < 1 && "Exactly 180° (Straight)"}
          </div>
        </div>
      </>
    );
  };

  const renderCircleProperties = () => {
    const radius = selectedShape.size ? selectedShape.size / 2 : 0;
    const radiusUnits = safePxToUnits(radius);
    const diameter = radius * 2;
    const diameterUnits = safePxToUnits(diameter);
    const circumference = 2 * Math.PI * radius;
    const circumferenceUnits = safePxToUnits(circumference);
    const area = Math.PI * radius * radius;
    const areaUnits = safePxToUnits(area);

    return (
      <>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Radius</div>
          <div className={styles.propertyValue}>{safeToFixed(radiusUnits, 2)} units</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Diameter</div>
          <div className={styles.propertyValue}>{safeToFixed(diameterUnits, 2)} units</div>
          <div className={styles.propertyFormula}>d = 2r</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Circumference</div>
          <div className={styles.propertyValue}>{safeToFixed(circumferenceUnits, 2)} units</div>
          <div className={styles.propertyFormula}>C = 2πr</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Area</div>
          <div className={styles.propertyValue}>{safeToFixed(areaUnits, 2)} units²</div>
          <div className={styles.propertyFormula}>A = πr²</div>
        </div>
      </>
    );
  };

  const renderTriangleProperties = () => {
    const points = selectedShape.points as any;
    if (!points?.top || !points?.left || !points?.right) return null;

    const { top, left, right } = points;

    // Calculate side lengths
    const sideA = Math.sqrt(Math.pow(right.x - left.x, 2) + Math.pow(right.y - left.y, 2));
    const sideB = Math.sqrt(Math.pow(top.x - left.x, 2) + Math.pow(top.y - left.y, 2));
    const sideC = Math.sqrt(Math.pow(right.x - top.x, 2) + Math.pow(right.y - top.y, 2));

    // Calculate area using Heron's formula
    const s = (sideA + sideB + sideC) / 2;
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

    return (
      <>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Side Lengths</div>
          <div className={styles.propertyValue}>a = {safeToFixed(safePxToUnits(sideA), 2)} units</div>
          <div className={styles.propertyValue}>b = {safeToFixed(safePxToUnits(sideB), 2)} units</div>
          <div className={styles.propertyValue}>c = {safeToFixed(safePxToUnits(sideC), 2)} units</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Perimeter</div>
          <div className={styles.propertyValue}>
            {safeToFixed(safePxToUnits(sideA + sideB + sideC), 2)} units
          </div>
          <div className={styles.propertyFormula}>P = a + b + c</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Area</div>
          <div className={styles.propertyValue}>{safeToFixed(safePxToUnits(area), 2)} units²</div>
          <div className={styles.propertyFormula}>A = √[s(s-a)(s-b)(s-c)]</div>
        </div>
      </>
    );
  };

  const renderSquareProperties = () => {
    const points = selectedShape.points as any;
    if (!points?.topLeft || !points?.topRight || 
        !points?.bottomRight || !points?.bottomLeft) return null;

    const { topLeft, topRight, bottomRight, bottomLeft } = points;

    // Calculate side lengths
    const sideTop = Math.sqrt(Math.pow(topRight.x - topLeft.x, 2) + Math.pow(topRight.y - topLeft.y, 2));
    const sideRight = Math.sqrt(Math.pow(bottomRight.x - topRight.x, 2) + Math.pow(bottomRight.y - topRight.y, 2));
    const sideBottom = Math.sqrt(Math.pow(bottomRight.x - bottomLeft.x, 2) + Math.pow(bottomRight.y - bottomLeft.y, 2));
    const sideLeft = Math.sqrt(Math.pow(bottomLeft.x - topLeft.x, 2) + Math.pow(bottomLeft.y - topLeft.y, 2));

    const widthUnits = safePxToUnits(sideTop);
    const heightUnits = safePxToUnits(sideRight);
    const perimeter = sideTop + sideRight + sideBottom + sideLeft;

    // Calculate area using shoelace formula
    const area = Math.abs(
      (topLeft.x * topRight.y - topRight.x * topLeft.y) +
      (topRight.x * bottomRight.y - bottomRight.x * topRight.y) +
      (bottomRight.x * bottomLeft.y - bottomLeft.x * bottomRight.y) +
      (bottomLeft.x * topLeft.y - topLeft.x * bottomLeft.y)
    ) / 2;

    // Classify shape
    const isSquare = Math.abs(sideTop - sideRight) < 1 && 
                     Math.abs(sideRight - sideBottom) < 1 && 
                     Math.abs(sideBottom - sideLeft) < 1;
    const isRectangle = Math.abs(sideTop - sideBottom) < 1 && 
                        Math.abs(sideLeft - sideRight) < 1;

    const shapeType = isSquare ? "Square" : isRectangle ? "Rectangle" : "Quadrilateral";

    return (
      <>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Type</div>
          <div className={styles.propertyValue}>{shapeType}</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Side Lengths</div>
          <div className={styles.propertyValue}>Top: {safeToFixed(safePxToUnits(sideTop), 2)} units</div>
          <div className={styles.propertyValue}>Right: {safeToFixed(safePxToUnits(sideRight), 2)} units</div>
          <div className={styles.propertyValue}>Bottom: {safeToFixed(safePxToUnits(sideBottom), 2)} units</div>
          <div className={styles.propertyValue}>Left: {safeToFixed(safePxToUnits(sideLeft), 2)} units</div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Perimeter</div>
          <div className={styles.propertyValue}>
            {safeToFixed(safePxToUnits(perimeter), 2)} units
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <div className={styles.propertyLabel}>Area</div>
          <div className={styles.propertyValue}>{safeToFixed(area / (10 * 10), 2)} units²</div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.propertiesPanelHeader}>
        Properties
        <span className={styles.shapeTypeBadge}>
          {selectedShape.type.charAt(0).toUpperCase() + selectedShape.type.slice(1)}
        </span>
      </div>

      <div className={styles.propertiesContent}>
        {selectedShape.type === "line" && renderLineProperties()}
        {selectedShape.type === "angle" && renderAngleProperties()}
        {selectedShape.type === "circle" && renderCircleProperties()}
        {selectedShape.type === "triangle" && renderTriangleProperties()}
        {selectedShape.type === "square" && renderSquareProperties()}
      </div>
    </div>
  );
};

export default PropertiesPanel;
