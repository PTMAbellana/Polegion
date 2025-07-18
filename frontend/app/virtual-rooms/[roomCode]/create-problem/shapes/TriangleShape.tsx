import React, { useRef, useMemo, useCallback } from "react";

function snap(value: number, step = 1) {
  return Math.round(value / step) * step;
}

export default function TriangleShape({
  shape,
  isSelected,
  pxToUnits,
  handleShapeMouseDown,
  setSelectedId,
  handleShapeDrop,
  fillMode,
  draggingFill,
  showSides,
  showAngles,
  showArea,
  showHeight,
  onShapeMove,
}: any) {
  // ✅ Add this line
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const stroke = 6;
  const size = shape.size;
  const h = size * Math.sqrt(3) / 2; // height for equilateral triangle

  const [points, setPoints] = React.useState(
    shape.points
      ? { ...shape.points }
      : {
          top: { x: shape.x, y: shape.y - h / 2 },
          left: { x: shape.x - size / 2, y: shape.y + h / 2 },
          right: { x: shape.x + size / 2, y: shape.y + h / 2 },
        }
  );

  // Sync points state with shape.points when editing or loading
  React.useEffect(() => {
    if (shape.points) {
      setPoints({ ...shape.points });
    }
  }, [shape.points]);

  // For calculations and rendering
  const {
    sidePoints,
    sideLengths,
    area,
    height,
  } = useMemo(() => {
    const sp = [points.top, points.left, points.right];
    const sl = [
      dist(sp[0], sp[1]),
      dist(sp[1], sp[2]),
      dist(sp[2], sp[0]),
    ];
    const a = getTriangleArea(points);
    const h = getHeightFromTopVertex(points);
    
    return { sidePoints: sp, sideLengths: sl, area: a, height: h };
  }, [points.top.x, points.top.y, points.left.x, points.left.y, points.right.x, points.right.y]);

  // Area calculation
  function getTriangleArea(pointsObj: any) {
    // Convert object to array in the correct order: [top, left, right]
    const p = [pointsObj.top, pointsObj.left, pointsObj.right];
    const pUnit = p.map((pt) => ({ x: pxToUnits(pt.x), y: pxToUnits(pt.y) }));
    return Math.abs(
      (pUnit[0].x * (pUnit[1].y - pUnit[2].y) +
        pUnit[1].x * (pUnit[2].y - pUnit[0].y) +
        pUnit[2].x * (pUnit[0].y - pUnit[1].y)) / 2
    );
  }

  // Distance in units
  function dist(a: any, b: any) {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2
    ) / 10; // convert the pixel distance to units
  }

  // Height in units
  function getHeightFromTopVertex(pointsObj: any) {
    const top = pointsObj.top;
    const baseA = pointsObj.left;
    const baseB = pointsObj.right;
    const baseLength = dist(baseA, baseB);
    const area = getTriangleArea(pointsObj);
    return (2 * area) / baseLength;
  }

  function getHeightFoot(A, B, C) {
    // Vector from B to C
    const dx = C.x - B.x;
    const dy = C.y - B.y;

    // Vector from B to A
    const dxA = A.x - B.x;
    const dyA = A.y - B.y;

    // Project BA onto BC
    const lenBC = dx * dx + dy * dy;
    const dot = dx * dxA + dy * dyA;
    const t = lenBC === 0 ? 0 : dot / lenBC;

    // Foot coordinates
    return {
      x: B.x + t * dx,
      y: B.y + t * dy,
    };
  }

  // Snapping for moving the whole triangle
  // Optimized dragging for the whole triangle
  const handleDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(shape.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPoints = { ...points };

    function onMouseMove(me: MouseEvent) {
      // Calculate total movement from start position
      const totalDx = me.clientX - startX;
      const totalDy = me.clientY - startY;

      // Apply movement to all points at once
      const newPoints = {
        top: {
          x: startPoints.top.x + totalDx,
          y: startPoints.top.y + totalDy,
        },
        left: {
          x: startPoints.left.x + totalDx,
          y: startPoints.left.y + totalDy,
        },
        right: {
          x: startPoints.right.x + totalDx,
          y: startPoints.right.y + totalDy,
        },
      };

      // Update points immediately without snapping during drag
      setPoints(newPoints);
      
      // Throttled update to parent
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        onShapeMove && onShapeMove({ ...shape, points: newPoints });
      }, 16); // 60fps
    }

    function onMouseUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      
      // Final snap on mouse up
      const totalDx = me.clientX - startX;
      const totalDy = me.clientY - startY;
      
      const finalPoints = {
        top: {
          x: snap(startPoints.top.x + totalDx, 5),
          y: snap(startPoints.top.y + totalDy, 5),
        },
        left: {
          x: snap(startPoints.left.x + totalDx, 5),
          y: snap(startPoints.left.y + totalDy, 5),
        },
        right: {
          x: snap(startPoints.right.x + totalDx, 5),
          y: snap(startPoints.right.y + totalDy, 5),
        },
      };
      
      setPoints(finalPoints);
      onShapeMove && onShapeMove({ ...shape, points: finalPoints });
      handleShapeDrop?.();
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [shape, points, onShapeMove, setSelectedId, handleShapeDrop]);

  // Height foot
  const foot = getHeightFoot(points.top, points.left, points.right);

  // Height label
  const heightLabel = `Height: ${height.toFixed(1)} u`;

  // --- Add this helper function ---
  function getAngle(A, B, C) {
    // Returns angle at A in degrees
    const a = dist(B, C);
    const b = dist(A, C);
    const c = dist(A, B);
    // Law of Cosines
    const angleRad = Math.acos((b*b + c*c - a*a) / (2*b*c));
    return (angleRad * 180) / Math.PI;
  }

  // React.useEffect(() => {
  //   onShapeMove && onShapeMove({
  //     ...shape,
  //     points: { top: points.top, left: points.left, right: points.right }
  //   });
  // }, [points, onShapeMove, shape]);

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Triangle shape */}
      <polygon
        points={[points.top, points.left, points.right].map((p) => `${p.x},${p.y}`).join(" ")}
        fill={shape.fill || "#e3dcc2"}
        stroke="#000"
        strokeWidth={stroke}
        onMouseDown={(e) => {
          // ✅ Only call this once here
          handleShapeMouseDown(shape.id, e);
          handleDrag(e);
        }}
        style={{ cursor: "move", pointerEvents: "auto" }}
      />

      {/* Resize handles with constraints */}
      {isSelected &&
        [points.top, points.left, points.right].map((p, i) => {
          const vertexKey = i === 0 ? "top" : i === 1 ? "left" : "right";
          return (
            <circle
              key={`vertex-${i}`}
              cx={p.x}
              cy={p.y}
              r={8}
              fill="#2c514c"
              stroke="#fff"
              strokeWidth={2}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onMouseDown={(e) => {
                e.stopPropagation();
                
                const startX = e.clientX;
                const startY = e.clientY;
                const startPoints = { ...points };
                const originalVertex = startPoints[vertexKey];

                const handleMove = (moveEvent: MouseEvent) => {
                  // Calculate total movement from start
                  const totalDx = moveEvent.clientX - startX;
                  const totalDy = moveEvent.clientY - startY;
                  
                  // Calculate new vertex position
                  const newX = originalVertex.x + totalDx;
                  const newY = originalVertex.y + totalDy;
                  
                  // Create new points object
                  const tempPoints = {
                    ...startPoints,
                    [vertexKey]: { x: newX, y: newY }
                  };
                  
                  // ✅ SIMPLIFIED VALIDATION - Less restrictive
                  const tempArea = Math.abs(
                    (tempPoints.top.x * (tempPoints.left.y - tempPoints.right.y) +
                     tempPoints.left.x * (tempPoints.right.y - tempPoints.top.y) +
                     tempPoints.right.x * (tempPoints.top.y - tempPoints.left.y)) / 2
                  );
                  
                  // Only check for minimum area (much more permissive)
                  if (tempArea < 200) { // Reduced from 500 to 200
                    return;
                  }
                  
                  // Update immediately without snapping during drag
                  setPoints(tempPoints);
                  
                  // Throttled parent update
                  if (updateTimeoutRef.current) {
                    clearTimeout(updateTimeoutRef.current);
                  }
                  updateTimeoutRef.current = setTimeout(() => {
                    onShapeMove && onShapeMove({ ...shape, points: tempPoints });
                  }, 16);
                };

                const handleUp = (upEvent: MouseEvent) => {
                  document.removeEventListener("mousemove", handleMove);
                  document.removeEventListener("mouseup", handleUp);
                  
                  // Final snap on mouse up
                  const totalDx = upEvent.clientX - startX;
                  const totalDy = upEvent.clientY - startY;
                  
                  const finalPoints = {
                    ...startPoints,
                    [vertexKey]: {
                      x: snap(originalVertex.x + totalDx, 5),
                      y: snap(originalVertex.y + totalDy, 5)
                    }
                  };
                  
                  // ✅ No validation on final - just apply the points
                  setPoints(finalPoints);
                  onShapeMove && onShapeMove({ ...shape, points: finalPoints });
                };

                document.addEventListener("mousemove", handleMove);
                document.addEventListener("mouseup", handleUp);
              }}
            />
          );
        })}

      {/* Side Labels - IMPROVED POSITIONING */}
      {showSides &&
        sideLengths.map((length, i) => {
          const p1 = sidePoints[i];
          const p2 = sidePoints[(i + 1) % 3];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const mag = Math.sqrt(dx * dx + dy * dy);
          
          if (mag === 0) return null;
          
          // Unit vector perpendicular to the side (pointing outward)
          const ux = -dy / mag;
          const uy = dx / mag;
          
          // ✅ Increase offset to prevent intersection
          const offset = 28; // Increased from 16 to 28
          
          // ✅ Calculate triangle centroid to determine outward direction
          const centroidX = (sidePoints[0].x + sidePoints[1].x + sidePoints[2].x) / 3;
          const centroidY = (sidePoints[0].y + sidePoints[1].y + sidePoints[2].y) / 3;
          
          // Vector from midpoint to centroid
          const toCentroidX = centroidX - midX;
          const toCentroidY = centroidY - midY;
          
          // Check if perpendicular vector points toward or away from centroid
          const dotProduct = ux * toCentroidX + uy * toCentroidY;
          
          // Flip direction if pointing toward centroid (we want outward)
          const outwardX = dotProduct > 0 ? -ux : ux;
          const outwardY = dotProduct > 0 ? -uy : uy;
          
          const labelX = midX + outwardX * offset;
          const labelY = midY + outwardY * offset;

          // ✅ Adjust text rotation for better readability
          let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
          
          // Keep text horizontal for better readability
          if (Math.abs(angleDeg) > 45 && Math.abs(angleDeg) < 135) {
            // For steep angles, keep text horizontal
            angleDeg = 0;
          } else if (angleDeg > 90 || angleDeg < -90) {
            angleDeg += 180;
          }

          const label = `${length.toFixed(2)} u`;
          const width = label.length * 7 + 12; // Slightly wider padding

          return (
            <g key={`side-${i}`}>
              {/* ✅ Optional: Add a subtle connection line from triangle to label */}
              <line
                x1={midX + outwardX * 8}
                y1={midY + outwardY * 8}
                x2={midX + outwardX * 20}
                y2={midY + outwardY * 20}
                stroke="#666"
                strokeWidth={0.5}
                opacity={0.3}
                strokeDasharray="2,2"
              />
              
              <g transform={`rotate(${angleDeg}, ${labelX}, ${labelY})`}>
                <rect
                  x={labelX - width / 2}
                  y={labelY - 12}
                  width={width}
                  height={20} // Slightly taller
                  rx={5}
                  ry={5}
                  fill="white"
                  stroke="#000"
                  strokeWidth={0.5}
                  // ✅ Add drop shadow for better visibility
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                />
                <text
                  x={labelX}
                  y={labelY + 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#000"
                  fontWeight={500}
                >
                  {label}
                </text>
              </g>
            </g>
          );
        })}

      {/* Area Formula Display - Top Left of Main Area (like circle) */}
      {isSelected && showArea && (
        <g>
          {(() => {
            const baseLength = dist(sidePoints[1], sidePoints[2]);
            const formulaText = `Area = ½ × Base × Height`;
            const calculationText = `A = ½ × ${baseLength.toFixed(2)} × ${height.toFixed(2)} = ${area.toFixed(2)} u²`;
            const formulaWidth = Math.max(formulaText.length * 8, calculationText.length * 7) + 20;
            
            // ✅ CHANGED: Position formula box in TOP-LEFT corner (like circle)
            const formulaX = 50 + formulaWidth/2; // 50px from left edge
            const formulaY = 95; // 70px from top + offset for centering

            return (
              <>
                {/* ✅ Area Formula box - TOP LEFT positioning */}
                <rect
                  x={50} // ✅ CHANGED: From 750 to 50 (left edge)
                  y={70} // ✅ CHANGED: Fixed top position
                  width={formulaWidth}
                  height={55}
                  rx={8}
                  ry={8}
                  fill="white"
                  stroke="#2c514c"
                  strokeWidth={2}
                  filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.1))"
                />
                
                <text
                  x={formulaX}
                  y={85} // ✅ Adjusted Y position for left alignment
                  fontSize={13}
                  fill="#2c514c"
                  textAnchor="middle"
                  fontWeight={700}
                >
                  Area Formula
                </text>
                
                <text
                  x={formulaX}
                  y={100} // ✅ Adjusted Y position for left alignment
                  fontSize={11}
                  fill="#666"
                  textAnchor="middle"
                  fontStyle="italic"
                >
                  {formulaText}
                </text>
                
                <text
                  x={formulaX}
                  y={115} // ✅ Adjusted Y position for left alignment
                  fontSize={10}
                  fill="#1864ab"
                  textAnchor="middle"
                  fontWeight={600}
                >
                  {calculationText}
                </text>
              </>
            );
          })()}
        </g>
      )}

      {/* Height Line & Label - WITHOUT Area Formula */}
      {showHeight && (
        <g>
          {(() => {
            const A = points.top;
            const B = points.left;
            const C = points.right;
            const foot = getHeightFoot(A, B, C);
            const baseLength = dist(B, C);

            return (
              <>
                {/* ✅ Extended Base line highlighting */}
                <g>
                  {(() => {
                    const baseVector = { x: C.x - B.x, y: C.y - B.y };
                    const baseMag = Math.sqrt(baseVector.x * baseVector.x + baseVector.y * baseVector.y);
                    
                    if (baseMag === 0) return null;
                    
                    const baseUnit = { x: baseVector.x / baseMag, y: baseVector.y / baseMag };
                    const extensionLength = 30;
                    const extendedB = {
                      x: B.x - baseUnit.x * extensionLength,
                      y: B.y - baseUnit.y * extensionLength
                    };
                    const extendedC = {
                      x: C.x + baseUnit.x * extensionLength,
                      y: C.y + baseUnit.y * extensionLength
                    };

                    return (
                      <>
                        <line
                          x1={B.x}
                          y1={B.y}
                          x2={C.x}
                          y2={C.y}
                          stroke="#ff6b35"
                          strokeWidth={4}
                          opacity={0.9}
                        />
                        <line
                          x1={extendedB.x}
                          y1={extendedB.y}
                          x2={B.x}
                          y2={B.y}
                          stroke="#ff6b35"
                          strokeWidth={2}
                          opacity={0.6}
                          strokeDasharray="5,3"
                        />
                        <line
                          x1={C.x}
                          y1={C.y}
                          x2={extendedC.x}
                          y2={extendedC.y}
                          stroke="#ff6b35"
                          strokeWidth={2}
                          opacity={0.6}
                          strokeDasharray="5,3"
                        />
                      </>
                    );
                  })()}
                </g>
                
                {/* Base label - ENHANCED WHITE BACKGROUND */}
                <g>
                  {(() => {
                    const baseMidX = (B.x + C.x) / 2;
                    const baseMidY = (B.y + C.y) / 2;
                    const baseLabel = `Base: ${baseLength.toFixed(2)} u`;
                    const baseWidth = baseLabel.length * 7 + 16; // Increased padding
                    
                    // Position base label below the base line with more offset
                    const labelOffset = 35;
                    const baseLabelX = baseMidX;
                    const baseLabelY = baseMidY + labelOffset;
                    
                    return (
                      <>
                        {/* Connection line to label */}
                        <line
                          x1={baseMidX}
                          y1={baseMidY + 8}
                          x2={baseLabelX}
                          y2={baseLabelY - 12}
                          stroke="#ff6b35"
                          strokeWidth={1}
                          opacity={0.5}
                          strokeDasharray="2,2"
                        />
                        
                        {/* ✅ Enhanced white background */}
                        <rect
                          x={baseLabelX - baseWidth / 2}
                          y={baseLabelY - 12}
                          width={baseWidth}
                          height={24}
                          rx={6}
                          ry={6}
                          fill="white"
                          stroke="#ff6b35"
                          strokeWidth={1.5}
                          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.2))"
                        />
                        <text
                          x={baseLabelX}
                          y={baseLabelY + 4}
                          fontSize={12}
                          fill="#ff6b35"
                          textAnchor="middle"
                          fontWeight={600}
                        >
                          {baseLabel}
                        </text>
                      </>
                    );
                  })()}
                </g>

                {/* ✅ Extended Height line */}
                <g>
                  {(() => {
                    const heightVector = { x: foot.x - A.x, y: foot.y - A.y };
                    const heightMag = Math.sqrt(heightVector.x * heightVector.x + heightVector.y * heightVector.y);
                    
                    if (heightMag === 0) return null;
                    
                    const heightUnit = { x: heightVector.x / heightMag, y: heightVector.y / heightMag };
                    const heightExtension = 25;
                    const extendedFoot = {
                      x: foot.x + heightUnit.x * heightExtension,
                      y: foot.y + heightUnit.y * heightExtension
                    };

                    const baseVector = { x: C.x - B.x, y: C.y - B.y };
                    const baseMag = Math.sqrt(baseVector.x * baseVector.x + baseVector.y * baseVector.y);
                    const baseUnit = baseMag > 0 ? { x: baseVector.x / baseMag, y: baseVector.y / baseMag } : { x: 1, y: 0 };

                    return (
                      <>
                        <line
                          x1={A.x}
                          y1={A.y}
                          x2={foot.x}
                          y2={foot.y}
                          stroke="#1864ab"
                          strokeWidth={3}
                          strokeDasharray="none"
                        />
                        <line
                          x1={foot.x}
                          y1={foot.y}
                          x2={extendedFoot.x}
                          y2={extendedFoot.y}
                          stroke="#1864ab"
                          strokeWidth={2}
                          opacity={0.6}
                          strokeDasharray="5,3"
                        />
                        <rect
                          x={foot.x - 6}
                          y={foot.y - 6}
                          width={12}
                          height={12}
                          fill="none"
                          stroke="#1864ab"
                          strokeWidth={2}
                          transform={`rotate(45, ${foot.x}, ${foot.y})`}
                        />
                        <g>
                          {(() => {
                            const perpSize = 8;
                            const perpX1 = foot.x - baseUnit.y * perpSize;
                            const perpY1 = foot.y + baseUnit.x * perpSize;
                            const perpX2 = foot.x + baseUnit.y * perpSize;
                            const perpY2 = foot.y - baseUnit.x * perpSize;
                            
                            return (
                              <line
                                x1={perpX1}
                                y1={perpY1}
                                x2={perpX2}
                                y2={perpY2}
                                stroke="#1864ab"
                                strokeWidth={1.5}
                                opacity={0.7}
                              />
                            );
                          })()}
                        </g>
                      </>
                    );
                  })()}
                </g>
                
                {/* Height label - ENHANCED WHITE BACKGROUND */}
                <g>
                  {(() => {
                    const heightLabel = `Height: ${height.toFixed(2)} u`;
                    const heightWidth = heightLabel.length * 7 + 16; // Increased padding
                    const heightMidX = (A.x + foot.x) / 2;
                    const heightMidY = (A.y + foot.y) / 2;
                    
                    // Move both horizontally AND vertically away
                    const offsetX = A.x > foot.x ? 45 : -45;
                    const offsetY = -25; // Move upward by 25 pixels
                    const labelX = heightMidX + offsetX;
                    const labelY = heightMidY + offsetY;

                    return (
                      <>
                        {/* Connection line from height to label */}
                        <line
                          x1={heightMidX}
                          y1={heightMidY}
                          x2={labelX}
                          y2={labelY + 10}
                          stroke="#1864ab"
                          strokeWidth={1}
                          opacity={0.5}
                          strokeDasharray="2,2"
                        />
                        
                        {/* ✅ Enhanced white background */}
                        <rect
                          x={labelX - heightWidth / 2}
                          y={labelY - 12}
                          width={heightWidth}
                          height={24}
                          rx={6}
                          ry={6}
                          fill="white"
                          stroke="#1864ab"
                          strokeWidth={1.5}
                          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.2))"
                        />
                        <text
                          x={labelX}
                          y={labelY + 4}
                          fontSize={12}
                          fill="#1864ab"
                          textAnchor="middle"
                          fontWeight={600}
                        >
                          {heightLabel}
                        </text>
                      </>
                    );
                  })()}
                </g>
                
                {/* ✅ Perpendicularity indicator */}
                <g>
                  {(() => {
                    const perpLabel = "⊥";
                    const perpX = foot.x + 15;
                    const perpY = foot.y - 15;
                    
                    return (
                      <>
                        <circle
                          cx={perpX}
                          cy={perpY}
                          r={12}
                          fill="white"
                          stroke="#1864ab"
                          strokeWidth={1}
                          opacity={0.9}
                        />
                        <text
                          x={perpX}
                          y={perpY + 5}
                          fontSize={16}
                          fill="#1864ab"
                          textAnchor="middle"
                          fontWeight={700}
                        >
                          {perpLabel}
                        </text>
                      </>
                    );
                  })()}
                </g>
              </>
            );
          })()}
        </g>
      )}

      {/* Angle Arcs (like square) - CORRECTED VERSION */}
      {showAngles &&
        sidePoints.map((vertex, i) => {
          const A = vertex;
          const B = sidePoints[(i + 1) % 3];
          const C = sidePoints[(i + 2) % 3];
          
          // Calculate angle at vertex A
          const angle = getAngle(A, B, C);
          
          // Create vectors from A to B and A to C
          const vecAB = { x: B.x - A.x, y: B.y - A.y };
          const vecAC = { x: C.x - A.x, y: C.y - A.y };
          
          // Calculate magnitudes
          const magAB = Math.sqrt(vecAB.x * vecAB.x + vecAB.y * vecAB.y);
          const magAC = Math.sqrt(vecAC.x * vecAC.x + vecAC.y * vecAC.y);
          
          if (magAB === 0 || magAC === 0) return null;
          
          // Calculate angles for the arc
          const startAngle = Math.atan2(vecAB.y, vecAB.x);
          const endAngle = Math.atan2(vecAC.y, vecAC.x);
          
          // Arc radius
          const arcRadius = 20;
          
          // Calculate arc path - ensure we draw the smaller arc
          let angleDiff = endAngle - startAngle;
          
          // Normalize angle difference to [-π, π]
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
          
          // For triangles, we want the interior angle, so if the angle is > 180°, take the complement
          const shouldFlip = Math.abs(angleDiff) > Math.PI;
          if (shouldFlip) {
            angleDiff = angleDiff > 0 ? angleDiff - 2 * Math.PI : angleDiff + 2 * Math.PI;
          }
          
          const largeArcFlag = Math.abs(angleDiff) > Math.PI ? 1 : 0;
          const sweepFlag = angleDiff > 0 ? 1 : 0;
          
          // Calculate arc endpoints
          const startX = A.x + arcRadius * Math.cos(startAngle);
          const startY = A.y + arcRadius * Math.sin(startAngle);
          const endX = A.x + arcRadius * Math.cos(endAngle);
          const endY = A.y + arcRadius * Math.sin(endAngle);
          
          // Create the arc path
          const arcPath = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
          
          // Calculate label position (middle of the arc)
          let midAngle = (startAngle + endAngle) / 2;
          
          // Adjust mid angle if we're drawing the larger arc
          if (shouldFlip) {
            midAngle += Math.PI;
          }
          
          // Ensure the label is positioned correctly
          const labelRadius = arcRadius + 12;
          const labelX = A.x + labelRadius * Math.cos(midAngle);
          const labelY = A.y + labelRadius * Math.sin(midAngle);
          
          const label = `${angle.toFixed(2)}°`;
          const width = label.length * 6 + 8;
          
          return (
            <g key={`angle-arc-${i}`}>
              {/* Angle arc */}
              <path
                d={arcPath}
                fill="none"
                stroke="#1864ab"
                strokeWidth={1.5}
              />
              
              {/* Radius lines to show the angle clearly */}
              <line
                x1={A.x}
                y1={A.y}
                x2={A.x + (arcRadius - 5) * Math.cos(startAngle)}
                y2={A.y + (arcRadius - 5) * Math.sin(startAngle)}
                stroke="#1864ab"
                strokeWidth={1}
                opacity={0.4}
              />
              <line
                x1={A.x}
                y1={A.y}
                x2={A.x + (arcRadius - 5) * Math.cos(endAngle)}
                y2={A.y + (arcRadius - 5) * Math.sin(endAngle)}
                stroke="#1864ab"
                strokeWidth={1}
                opacity={0.4}
              />
              
              {/* Small dot at vertex */}
              <circle
                cx={A.x}
                cy={A.y}
                r={2}
                fill="#1864ab"
                opacity={0.6}
              />
              
              {/* Angle label with background */}
              <rect
                x={labelX - width / 2}
                y={labelY - 8}
                width={width}
                height={16}
                rx={3}
                ry={3}
                fill="white"
                stroke="#1864ab"
                strokeWidth={0.5}
              />
              <text
                x={labelX}
                y={labelY + 3}
                textAnchor="middle"
                fontSize={10}
                fill="#1864ab"
                fontWeight={500}
              >
                {label}
              </text>
            </g>
          );
        })}

      {/* Add arrow marker definitions */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="#1864ab"
          />
        </marker>
        
        {/* Height arrow marker */}
        <marker
          id="heightArrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <circle
            cx="4"
            cy="4"
            r="3"
            fill="#1864ab"
          />
        </marker>
      </defs>
    </svg>
  );
}

// ✅ Enhanced validation function with proper side-crossing prevention
function isValidTriangle(pts) {
  const { top, left, right } = pts;
  
  // Quick area check first (fastest)
  const area = Math.abs(
    (top.x * (left.y - right.y) +
     left.x * (right.y - top.y) +
     right.x * (top.y - left.y)) / 2
  );
  
  if (area < 200) return false; // Too small
  
  // ✅ Check for side crossings - MAIN PREVENTION
  if (isTriangleInsideOut(pts)) return false;
  
  // ✅ Check for reasonable triangle geometry
  const d1 = Math.sqrt((top.x - left.x) ** 2 + (top.y - left.y) ** 2);
  const d2 = Math.sqrt((left.x - right.x) ** 2 + (left.y - right.y) ** 2);
  const d3 = Math.sqrt((right.x - top.x) ** 2 + (right.y - top.y) ** 2);
  
  // Check triangle inequality (prevents degenerate triangles)
  if (d1 + d2 <= d3 || d1 + d3 <= d2 || d2 + d3 <= d1) {
    return false;
  }
  
  return true;
}

// ✅ Re-enable this - simplified but effective
function doSidesCross(pts) {
  // For triangles, we mainly need to check if the triangle has "folded over" itself
  return isTriangleInsideOut(pts);
}

// ✅ Check if triangle has folded over itself (orientation check)
function isTriangleInsideOut(pts) {
  const { top, left, right } = pts;
  
  // Calculate the signed area (cross product)
  const signedArea = (top.x * (left.y - right.y) +
                     left.x * (right.y - top.y) +
                     right.x * (top.y - left.y)) / 2;
  
  // ✅ More sophisticated check - look for extreme negative values
  // This indicates the triangle has folded over itself
  if (signedArea < -500) { // Allow some negative area but not extreme
    return true;
  }
  
  // ✅ Additional check - if vertices are too close together in a line
  const centroidX = (top.x + left.x + right.x) / 3;
  const centroidY = (top.y + left.y + right.y) / 3;
  
  // Check if all vertices are roughly on the same line (degenerate triangle)
  const distances = [
    Math.sqrt((top.x - centroidX) ** 2 + (top.y - centroidY) ** 2),
    Math.sqrt((left.x - centroidX) ** 2 + (left.y - centroidY) ** 2),
    Math.sqrt((right.x - centroidX) ** 2 + (right.y - centroidY) ** 2)
  ];
  
  // If centroid is too close to all vertices, triangle is too flat
  if (Math.max(...distances) < 20) {
    return true;
  }
  
  return false;
}
