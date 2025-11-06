'use client';

import React, { useState, useRef, useEffect } from 'react';

export type GeometryShapeType = 'line-segment' | 'ray' | 'line';

export interface GeometryLevel {
  id: number;
  type: GeometryShapeType;
  title: string;
  instruction: string;
  ballStartX: number; // Starting X position of the ball (percentage 0-100)
  ballStartY: number; // Starting Y position of the ball (percentage 0-100)
}

interface GeometryPhysicsGameProps {
  level: GeometryLevel;
  onComplete: (success: boolean) => void;
  styleModule: any;
}

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 30; // Grid cell size in pixels
const BALL_RADIUS = 12;
const BOX_SIZE = 60;
const BOX_OPENING_HEIGHT = 15;
const BOX_WALL_THICKNESS = 8;
const SUCCESS_TIMER_DURATION = 3000; // 3 seconds in milliseconds

export default function GeometryPhysicsGame({
  level,
  onComplete,
  styleModule: styles,
}: GeometryPhysicsGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const ballVelocityRef = useRef<Point>({ x: 0, y: 0 });
  const onLineRef = useRef<boolean>(false);
  const insideBoxTimerRef = useRef<number | null>(null);
  const insideBoxStartTimeRef = useRef<number | null>(null);
  const onLineStartTimeRef = useRef<number | null>(null); // Track when ball started rolling on line
  
  const [points, setPoints] = useState<Point[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [ballPosition, setBallPosition] = useState<Point | null>(null);
  const [gameResult, setGameResult] = useState<'success' | 'failure' | null>(null);
  const [boxPosition, setBoxPosition] = useState<Point | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [ballStartPosition, setBallStartPosition] = useState<Point | null>(null);
  const [timeInBox, setTimeInBox] = useState<number>(0); // Track time ball has been in box
  const [timeOnLine, setTimeOnLine] = useState<number>(0); // Track time ball has been on line (for level 3)

  // Update canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth, 800);
        const height = Math.floor(width / 2); // Landscape ratio 2:1
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Use ResizeObserver for more accurate container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (canvasRef.current?.parentElement) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const canvasWidth = canvasSize.width;
  const canvasHeight = canvasSize.height;

  // Convert percentage to pixel position with randomization
  const percentToPixel = (percent: number, dimension: number, addRandomness = true) => {
    const baseValue = (percent / 100) * dimension;
    if (addRandomness) {
      // Add ±20% randomness
      const randomOffset = (Math.random() - 0.5) * 0.4 * dimension;
      return Math.max(BALL_RADIUS, Math.min(dimension - BALL_RADIUS, baseValue + randomOffset));
    }
    return baseValue;
  };

  // Generate random box position and random ball start position
  useEffect(() => {
    // Random box position - right half of canvas, bottom area
    const minX = canvasWidth / 2 + 50;
    const maxX = canvasWidth - BOX_SIZE - 50;
    const randomX = Math.floor(Math.random() * (maxX - minX) + minX);
    const randomY = canvasHeight - BOX_SIZE - 10;
    
    setBoxPosition({ x: randomX, y: randomY });
    
    // Random ball start position based on level settings
    setBallStartPosition({
      x: percentToPixel(level.ballStartX, canvasWidth, true),
      y: percentToPixel(level.ballStartY, canvasHeight, true),
    });
  }, [level.id, canvasWidth, canvasHeight]); // Regenerate when level or canvas size changes

  // Clear points when level changes
  useEffect(() => {
    setPoints([]);
    setGameResult(null);
    setIsSimulating(false);
    setBallPosition(null);
    setTimeInBox(0);
    setTimeOnLine(0);
    insideBoxStartTimeRef.current = null;
    onLineStartTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [level.id]);

  // Use memoized ball start position
  const ballStart = ballStartPosition || { x: 0, y: 0 };

  // Snap point to grid
  const snapToGrid = (x: number, y: number): Point => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
  };

  // Handle canvas click to place points
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSimulating || gameResult) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Account for canvas scaling (actual size vs displayed size)
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const snappedPoint = snapToGrid(x, y);

    // Determine how many points are needed based on level type
    const maxPoints = level.type === 'line-segment' ? 2 : level.type === 'ray' ? 2 : 2;

    if (points.length < maxPoints) {
      setPoints([...points, snappedPoint]);
    }
  };

  // Clear points
  const handleClear = () => {
    setPoints([]);
    setGameResult(null);
    setIsSimulating(false);
    setBallPosition(null);
    setTimeInBox(0);
    setTimeOnLine(0);
    insideBoxStartTimeRef.current = null;
    onLineStartTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Start physics simulation
  const handlePlay = () => {
    if (points.length < 2) return;

    setIsSimulating(true);
    setBallPosition({ ...ballStart });
    ballVelocityRef.current = { x: 0, y: 0 };
    setGameResult(null);
    setTimeInBox(0);
    setTimeOnLine(0);
    insideBoxStartTimeRef.current = null;
    onLineStartTimeRef.current = null;
  };

  // Physics simulation loop
  useEffect(() => {
    if (!isSimulating || !ballPosition || !boxPosition) return;

    const gravity = 0.4;
    const friction = 0.99;
    const rollingAcceleration = 0.6;

    const animate = () => {
      setBallPosition((prevPos) => {
        if (!prevPos) return null;

        let newVelocity = { ...ballVelocityRef.current };
        let newPosition = { ...prevPos };

        // Apply gravity
        newVelocity.y += gravity;

        // Apply velocity
        newPosition.x += newVelocity.x;
        newPosition.y += newVelocity.y;

        // Check collision with line/ray/segment
        const lineCollision = checkLineCollision(newPosition, points);
        if (lineCollision) {
          // Calculate the slope of the line
          const p1 = points[0];
          const p2 = points[1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const lineLength = Math.sqrt(dx * dx + dy * dy);
          
          // Normalize the line direction
          const dirX = dx / lineLength;
          const dirY = dy / lineLength;
          
          // Snap ball to line surface
          newPosition.y = lineCollision.y - BALL_RADIUS - 1;
          
          // Rolling physics - ball rolls along the slope
          if (Math.abs(newVelocity.y) < 5) {
            // Ball is on the surface
            newVelocity.y = 0; // Stop vertical movement
            
            // Calculate gravity component along the slope
            // Gravity pulls down, we project it onto the line direction
            const gravityAlongSlope = gravity * dirY; // How much gravity pulls along the slope
            const accelerationX = gravityAlongSlope * dirX; // X component of that acceleration
            
            // Apply the acceleration
            newVelocity.x += accelerationX;
            
            // Apply friction to slow down
            newVelocity.x *= friction;
            
            onLineRef.current = true;
            
            // For level 3 (line), track time on line
            if (level.type === 'line') {
              if (onLineStartTimeRef.current === null) {
                onLineStartTimeRef.current = Date.now();
              }
              
              const timeElapsed = Date.now() - onLineStartTimeRef.current;
              setTimeOnLine(timeElapsed);
              
              // Success if ball stays on line for 3 seconds
              if (timeElapsed >= SUCCESS_TIMER_DURATION) {
                setGameResult('success');
                setIsSimulating(false);
                setTimeout(() => onComplete(true), 500);
                return prevPos;
              }
            }
          } else {
            // Ball just hit the surface - bounce effect
            newVelocity.y = 0;
            newVelocity.x *= 0.7; // Reduce horizontal velocity on impact
          }
        } else {
          onLineRef.current = false;
          
          // For level 3, reset timer if ball leaves the line
          if (level.type === 'line' && onLineStartTimeRef.current !== null) {
            onLineStartTimeRef.current = null;
            setTimeOnLine(0);
          }
        }

        // Check collision with canvas boundaries
        if (newPosition.x - BALL_RADIUS < 0) {
          newPosition.x = BALL_RADIUS;
          newVelocity.x = -newVelocity.x * 0.5;
          
          // Hit side wall - failure for line level
          if (level.type === 'line') {
            setGameResult('failure');
            setIsSimulating(false);
            return prevPos;
          }
        }
        if (newPosition.x + BALL_RADIUS > canvasWidth) {
          newPosition.x = canvasWidth - BALL_RADIUS;
          newVelocity.x = -newVelocity.x * 0.5;
          
          // Hit side wall - failure for line level
          if (level.type === 'line') {
            setGameResult('failure');
            setIsSimulating(false);
            return prevPos;
          }
        }
        if (newPosition.y + BALL_RADIUS > canvasHeight) {
          newPosition.y = canvasHeight - BALL_RADIUS;
          newVelocity.y = -Math.abs(newVelocity.y) * 0.3;
          newVelocity.x *= friction;
          
          // Hit ground - failure for line level
          if (level.type === 'line') {
            setGameResult('failure');
            setIsSimulating(false);
            return prevPos;
          }
        }

        ballVelocityRef.current = newVelocity;

        // ============================================
        // BOX WALL COLLISIONS AND SUCCESS CHECK (Skip for level 3 - line)
        // ============================================
        
        if (level.type !== 'line') {
          // Define box boundaries
          const boxLeft = boxPosition.x;
          const boxRight = boxPosition.x + BOX_SIZE;
          const boxTop = boxPosition.y;
          const boxBottom = boxPosition.y + BOX_SIZE;
          const boxOpeningBottom = boxPosition.y + BOX_OPENING_HEIGHT;
          
          // Inner boundaries (accounting for walls)
          const innerLeft = boxLeft + BOX_WALL_THICKNESS;
          const innerRight = boxRight - BOX_WALL_THICKNESS;
          const innerBottom = boxBottom - BOX_WALL_THICKNESS;
          
          // Check if ball is in the general box area
          const ballLeft = newPosition.x - BALL_RADIUS;
          const ballRight = newPosition.x + BALL_RADIUS;
          const ballTop = newPosition.y - BALL_RADIUS;
          const ballBottom = newPosition.y + BALL_RADIUS;
          
          // Ball is near the box if it overlaps with box bounds
          const isNearBox = 
            ballRight >= boxLeft &&
            ballLeft <= boxRight &&
            ballBottom >= boxOpeningBottom && // Only check collisions below the opening
            ballTop <= boxBottom;
          
          if (isNearBox) {
            let collided = false;
            
            // LEFT WALL - Ball trying to enter from the left
            if (ballRight > innerLeft && ballRight < innerLeft + BOX_WALL_THICKNESS * 2 && 
                newPosition.x < innerLeft && ballBottom > boxOpeningBottom) {
              // Push ball out to the left
              newPosition.x = innerLeft - BALL_RADIUS;
              newVelocity.x = Math.abs(newVelocity.x) * 0.5; // Bounce away from wall
              collided = true;
            }
            
            // RIGHT WALL - Ball trying to enter from the right
            if (ballLeft < innerRight && ballLeft > innerRight - BOX_WALL_THICKNESS * 2 && 
                newPosition.x > innerRight && ballBottom > boxOpeningBottom) {
              // Push ball out to the right
              newPosition.x = innerRight + BALL_RADIUS;
              newVelocity.x = -Math.abs(newVelocity.x) * 0.5; // Bounce away from wall
              collided = true;
            }
            
            // BOTTOM WALL - Ball inside the box horizontally, hitting bottom
            if (newPosition.x > innerLeft && newPosition.x < innerRight &&
                ballBottom > innerBottom && ballBottom < innerBottom + BOX_WALL_THICKNESS * 2) {
              // Push ball up
              newPosition.y = innerBottom - BALL_RADIUS;
              newVelocity.y = -Math.abs(newVelocity.y) * 0.5; // Bounce up
              newVelocity.x *= 0.8; // Apply friction
              collided = true;
            }
            
            if (collided) {
              ballVelocityRef.current = newVelocity;
            }
          }
          
          // Update velocity after wall collisions
          ballVelocityRef.current = newVelocity;
          
          // ============================================
          // CHECK IF BALL IS IN SAFE ZONE (After collision checks)
          // ============================================
          
          // Check if ball is inside the box area (after entering through top opening)
          const isInsideBoxHorizontally = 
            newPosition.x >= boxPosition.x + BOX_WALL_THICKNESS &&
            newPosition.x <= boxPosition.x + BOX_SIZE - BOX_WALL_THICKNESS;
          
          const isInsideBoxVertically = 
            newPosition.y >= boxPosition.y + BOX_OPENING_HEIGHT &&
            newPosition.y + BALL_RADIUS <= boxPosition.y + BOX_SIZE - BOX_WALL_THICKNESS;
          
          const isBallInsideBox = isInsideBoxHorizontally && isInsideBoxVertically;
          
          if (isBallInsideBox) {
            // Ball is inside the box!
            // Start or update timer
            if (insideBoxStartTimeRef.current === null) {
              insideBoxStartTimeRef.current = Date.now();
            }
            
            const timeElapsed = Date.now() - insideBoxStartTimeRef.current;
            setTimeInBox(timeElapsed);
            
            // Apply friction inside box to slow down the ball
            newVelocity.x *= 0.95;
            newVelocity.y *= 0.95;
            ballVelocityRef.current = newVelocity;
            
            // Check if ball stayed for 3 seconds
            if (timeElapsed >= SUCCESS_TIMER_DURATION) {
              setGameResult('success');
              setIsSimulating(false);
              setTimeout(() => onComplete(true), 500);
              return prevPos;
            }
          } else {
            // Ball left the box - reset timer
            if (insideBoxStartTimeRef.current !== null) {
              insideBoxStartTimeRef.current = null;
              setTimeInBox(0);
            }
          }
        }

        // Check if ball is stuck or out of reasonable bounds
        if (newPosition.y > canvasHeight + 100) {
          setGameResult('failure');
          setIsSimulating(false);
        }

        return newPosition;
      });

      if (isSimulating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, ballPosition, points, level, canvasHeight, canvasWidth, boxPosition, onComplete]);

  // Check collision between ball and the drawn line
  const checkLineCollision = (ballPos: Point, linePoints: Point[]): Point | null => {
    if (linePoints.length < 2) return null;

    const p1 = linePoints[0];
    const p2 = linePoints[1];

    // Extend points based on shape type
    let extendedP1 = { ...p1 };
    let extendedP2 = { ...p2 };

    if (level.type === 'ray') {
      // Ray extends from p1 through p2 to infinity
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Don't extend p1 - it stays at the starting point
      extendedP1 = { ...p1 };
      extendedP2 = {
        x: p1.x + (dx / length) * 2000,
        y: p1.y + (dy / length) * 2000,
      };
    } else if (level.type === 'line') {
      // Extend in both directions
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      extendedP1 = {
        x: p1.x - (dx / length) * 2000,
        y: p1.y - (dy / length) * 2000,
      };
      extendedP2 = {
        x: p2.x + (dx / length) * 2000,
        y: p2.y + (dy / length) * 2000,
      };
    }

    // Point-to-line distance calculation
    const A = ballPos.x - extendedP1.x;
    const B = ballPos.y - extendedP1.y;
    const C = extendedP2.x - extendedP1.x;
    const D = extendedP2.y - extendedP1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let closestX, closestY;

    if (level.type === 'line-segment') {
      // For line segment, clamp to segment bounds
      if (param < 0) {
        closestX = extendedP1.x;
        closestY = extendedP1.y;
      } else if (param > 1) {
        closestX = extendedP2.x;
        closestY = extendedP2.y;
      } else {
        closestX = extendedP1.x + param * C;
        closestY = extendedP1.y + param * D;
      }
    } else if (level.type === 'ray') {
      // For ray, only allow collisions from p1 onwards (param >= 0)
      if (param < 0) {
        // Ball is behind the ray's starting point - no collision
        return null;
      }
      closestX = extendedP1.x + param * C;
      closestY = extendedP1.y + param * D;
    } else {
      // For line, don't clamp (allows both directions)
      closestX = extendedP1.x + param * C;
      closestY = extendedP1.y + param * D;
    }

    const distance = Math.sqrt(
      (ballPos.x - closestX) ** 2 + (ballPos.y - closestY) ** 2
    );

    // For line level, allow collision from above or slightly below to prevent pass-through
    // For other levels, only detect collision from above
    const allowCollision = level.type === 'line' 
      ? (distance < BALL_RADIUS + 2 && ballPos.y <= closestY + BALL_RADIUS)
      : (distance < BALL_RADIUS + 2 && ballPos.y < closestY);

    if (allowCollision) {
      return { x: closestX, y: closestY };
    }

    return null;
  };

  // Draw everything on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !boxPosition) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw vertical divider line (split canvas in half)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvasWidth; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw box with open top design (skip for level 3)
    if (level.type !== 'line') {
      const box = boxPosition;
      
      // Draw box as open-top container:  |    |
      //                                   ------
      
      // Draw interior/safe zone (light green if ball is inside)
      const ballIsInside = timeInBox > 0;
      ctx.fillStyle = ballIsInside ? 'rgba(76, 175, 80, 0.2)' : 'rgba(139, 111, 71, 0.1)';
      ctx.fillRect(
        box.x + BOX_WALL_THICKNESS,
        box.y + BOX_OPENING_HEIGHT,
        BOX_SIZE - BOX_WALL_THICKNESS * 2,
        BOX_SIZE - BOX_OPENING_HEIGHT - BOX_WALL_THICKNESS
      );
      
      // Left wall
      ctx.fillStyle = '#8B6F47';
      ctx.fillRect(box.x, box.y + BOX_OPENING_HEIGHT, BOX_WALL_THICKNESS, BOX_SIZE - BOX_OPENING_HEIGHT);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y + BOX_OPENING_HEIGHT, BOX_WALL_THICKNESS, BOX_SIZE - BOX_OPENING_HEIGHT);
      
      // Right wall
      ctx.fillStyle = '#8B6F47';
      ctx.fillRect(box.x + BOX_SIZE - BOX_WALL_THICKNESS, box.y + BOX_OPENING_HEIGHT, BOX_WALL_THICKNESS, BOX_SIZE - BOX_OPENING_HEIGHT);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x + BOX_SIZE - BOX_WALL_THICKNESS, box.y + BOX_OPENING_HEIGHT, BOX_WALL_THICKNESS, BOX_SIZE - BOX_OPENING_HEIGHT);
      
      // Bottom
      ctx.fillStyle = '#8B6F47';
      ctx.fillRect(box.x, box.y + BOX_SIZE - BOX_WALL_THICKNESS, BOX_SIZE, BOX_WALL_THICKNESS);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y + BOX_SIZE - BOX_WALL_THICKNESS, BOX_SIZE, BOX_WALL_THICKNESS);
      
      // Draw opening indicator (dashed line at top)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(box.x, box.y + BOX_OPENING_HEIGHT);
      ctx.lineTo(box.x + BOX_SIZE, box.y + BOX_OPENING_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label "OPEN" at top
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('OPEN', box.x + BOX_SIZE / 2, box.y + 10);
    }

    // Draw placed points
    ctx.fillStyle = '#FFD700';
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw point label
      ctx.fillStyle = '#FFF';
      ctx.font = '14px Arial';
      ctx.fillText(`P${index + 1}`, point.x + 10, point.y - 10);
      ctx.fillStyle = '#FFD700';
    });

    // Draw the geometric shape
    if (points.length >= 2) {
      const p1 = points[0];
      const p2 = points[1];

      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);

      if (level.type === 'line-segment') {
        // Draw line segment
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      } else if (level.type === 'ray') {
        // Draw ray (from p1 through p2 to edge)
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const extendedX = p1.x + (dx / length) * 2000;
        const extendedY = p1.y + (dy / length) * 2000;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(extendedX, extendedY);
        ctx.stroke();

        // Draw arrow at p1 to show starting point
        ctx.fillStyle = '#00BCD4';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (level.type === 'line') {
        // Draw line (extends in both directions)
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const extend1X = p1.x - (dx / length) * 2000;
        const extend1Y = p1.y - (dy / length) * 2000;
        const extend2X = p2.x + (dx / length) * 2000;
        const extend2Y = p2.y + (dy / length) * 2000;

        ctx.beginPath();
        ctx.moveTo(extend1X, extend1Y);
        ctx.lineTo(extend2X, extend2Y);
        ctx.stroke();
      }
    }

    // Draw ball (either at start or current position)
    const currentBallPos = ballPosition || ballStart;
    // Change ball color based on state
    // For line level: green if on line for a while, orange if simulating, blue if idle
    // For box levels: green if inside box, orange if simulating, blue if idle
    const ballColor = level.type === 'line' 
      ? (timeOnLine > 0 ? '#4CAF50' : isSimulating ? '#FF5722' : '#2196F3')
      : (timeInBox > 0 ? '#4CAF50' : isSimulating ? '#FF5722' : '#2196F3');
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(currentBallPos.x, currentBallPos.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [points, ballPosition, level, boxPosition, canvasWidth, canvasHeight, ballStart, timeInBox, timeOnLine, isSimulating]);

  const canPlay = points.length === 2 && !isSimulating;
  const needsMorePoints = points.length < 2;

  // Show loading while box and ball positions are being generated
  if (!boxPosition || !ballStartPosition) {
    return (
      <div className={styles.minigameContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.minigameContainer}>
      {/* Level Info - Horizontal Layout */}
      <div className={styles.levelInfoContainer} style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <h3 className={styles.levelTitle} style={{ 
          margin: 0, 
          minWidth: '150px',
          color: '#F5EFE7',
        }}>
          {level.title}
        </h3>
        <p className={styles.levelInstruction} style={{ 
          margin: 0, 
          flex: 1,
          color: '#D8C4B6',
        }}>
          {level.instruction}
        </p>
      </div>

      {/* Game Area - Canvas Left, Controls Right */}
      <div className={styles.gameAreaWrapper}>
        {/* Canvas Container */}
        <div className={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            style={{
              border: '2px solid #D8C4B6',
              borderRadius: '8px',
              cursor: isSimulating || gameResult ? 'default' : 'crosshair',
              backgroundColor: '#1a1a2e',
              width: '100%',
              height: 'auto',
              display: 'block',
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 450px)', /* Ensure canvas fits in viewport */
            }}
          />
        </div>

        {/* Controls Container */}
        <div className={styles.controlsContainer}>
          <button
            onClick={handlePlay}
            disabled={!canPlay}
            style={{
              opacity: canPlay ? 1 : 0.5,
              cursor: canPlay ? 'pointer' : 'not-allowed',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '700',
              background: canPlay 
                ? 'linear-gradient(135deg, #5a9663 0%, #6fa876 100%)' 
                : 'linear-gradient(135deg, rgba(62, 88, 121, 0.3) 0%, rgba(33, 53, 85, 0.3) 100%)',
              color: canPlay ? 'white' : 'rgba(245, 239, 231, 0.5)',
              border: canPlay ? '2px solid #5a9663' : '2px solid rgba(216, 196, 182, 0.2)',
              borderRadius: '10px',
              boxShadow: canPlay ? '0 4px 12px rgba(90, 150, 99, 0.4)' : 'none',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              if (canPlay) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #4f8558 0%, #62976b 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(90, 150, 99, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (canPlay) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #5a9663 0%, #6fa876 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(90, 150, 99, 0.4)';
              }
            }}
          >
            Play
          </button>

          <button 
            onClick={handleClear}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #c75450 0%, #d16965 100%)',
              color: 'white',
              border: '2px solid #c75450',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(199, 84, 80, 0.4)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b34946 0%, #c75450 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(199, 84, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #c75450 0%, #d16965 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 84, 80, 0.4)';
            }}
          >
            Clear
          </button>

          {/* Status Messages Area - Timer, Success, or Failure (same position) */}
          {/* Timer Countdown Indicator */}
          {((level.type === 'line' && timeOnLine > 0) || (level.type !== 'line' && timeInBox > 0)) && isSimulating && (
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(30, 136, 229, 0.9) 100%)',
              color: 'white',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: '700',
              border: '2px solid #2196F3',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
              backdropFilter: 'blur(5px)',
              minWidth: '140px',
              maxWidth: '100%',
            }}>
              <div style={{ 
                marginBottom: '6px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#F5EFE7',
              }}>
                {level.type === 'line' ? 'On the Line!' : 'Ball in Box!'}
              </div>
              <div style={{ 
                fontSize: '36px',
                fontWeight: '700',
                letterSpacing: '2px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                color: '#FFD700',
                lineHeight: '1',
              }}>
                {level.type === 'line' 
                  ? Math.ceil((SUCCESS_TIMER_DURATION - timeOnLine) / 1000)
                  : Math.ceil((SUCCESS_TIMER_DURATION - timeInBox) / 1000)}
              </div>
            </div>
          )}

          {/* Success Message */}
          {gameResult === 'success' && (
            <div className={styles.successMessage} style={{ 
              margin: 0,
              padding: '12px',
              fontSize: '13px',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(102, 187, 106, 0.9) 100%)',
              border: '2px solid #4CAF50',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
              backdropFilter: 'blur(5px)',
              textAlign: 'center',
              fontWeight: '700',
              color: 'white',
            }}>
            {level.type === 'line' 
              ? 'Success! You kept the ball balanced on the line!' 
              : 'Success! The ball reached the box!'}
            </div>
          )}

          {/* Failure Message */}
          {gameResult === 'failure' && (
            <div className={styles.failureMessage} style={{ 
              margin: 0,
              padding: '12px',
              fontSize: '13px',
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(239, 83, 80, 0.9) 100%)',
              border: '2px solid #F44336',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
              backdropFilter: 'blur(5px)',
              textAlign: 'center',
              fontWeight: '700',
              color: 'white',
            }}>
            {level.type === 'line' 
              ? 'Try again! The ball fell off the line or hit a wall!' 
              : 'Try again! The ball missed the box!'}
            </div>
          )}

          {/* Hints and Messages */}
          <div className={styles.hint} style={{ 
            margin: 0,
            padding: '10px 12px',
            fontSize: '13px',
            background: 'linear-gradient(135deg, rgba(216, 196, 182, 0.3) 0%, rgba(245, 239, 231, 0.2) 100%)',
            border: '2px solid rgba(216, 196, 182, 0.4)',
            borderRadius: '8px',
            color: '#F5EFE7',
            textAlign: 'center',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            visibility: needsMorePoints && !isSimulating ? 'visible' : 'hidden',
          }}>
            Click on the grid to place {2 - points.length} more point(s)
          </div>
        </div>
      </div>
    </div>
  );
}
