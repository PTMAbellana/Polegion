"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Home, RotateCcw } from 'lucide-react';
import styles from '@/styles/castle.module.css';

const GeometryTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCharacter, setShowCharacter] = useState(true);
  const [characterSide, setCharacterSide] = useState('right');
  const [interactivePoints, setInteractivePoints] = useState([]);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const canvasRef = useRef(null);

  // Enhanced tutorial steps with better progression and mini-games
  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Euclidean Spire!',
      characterSide: 'right',
      dialogue: "Greetings, young explorer! I am Master Euclid, guardian of geometric wisdom. This ancient spire holds the secrets of shapes and space. Are you ready to begin your mathematical adventure?",
      content: 'introduction',
      interactive: false,
      hint: "Click 'Next' to begin your journey!"
    },
    {
      id: 'plane',
      title: 'The Infinite Plane',
      characterSide: 'left',
      dialogue: "Before we create anything, we need space to work in! A plane is like an infinite flat surface - imagine a piece of paper that goes on forever in all directions. This canvas represents our geometric plane!",
      content: 'plane',
      interactive: false,
      hint: "The grid shows our infinite workspace"
    },
    {
      id: 'point-intro',
      title: 'The Mighty Point',
      characterSide: 'right',
      dialogue: "Every geometric journey begins with a single point! A point shows exact location but has no size - no length, width, or height. It's just... there! Let's create some magical points together!",
      content: 'point',
      interactive: true,
      instruction: 'Click anywhere on the canvas to create 5 points',
      goal: 5,
      hint: "Points are the building blocks of all geometry!"
    },
    {
      id: 'point-game',
      title: 'Point Placement Challenge',
      characterSide: 'left',
      dialogue: "Excellent! Now let's play a game. Can you place points to spell out your first initial? Remember, each click creates a point that shows a specific location!",
      content: 'point-game',
      interactive: true,
      instruction: 'Create points to draw your first initial (use 8-10 points)',
      goal: 10,
      hint: "Be creative! Points can make any shape you imagine."
    },
    {
      id: 'line-segment',
      title: 'Line Segments - Connecting Points',
      characterSide: 'right',
      dialogue: "When we connect two points with a straight path, we create a line segment! It has a definite start and end - like drawing a straight line between two dots with your ruler.",
      content: 'lineSegment',
      interactive: true,
      instruction: 'Drag the red endpoints to reshape the line segment',
      hint: "A line segment is the shortest distance between two points!"
    },
    {
      id: 'ray',
      title: 'Rays - One-Way Infinite Paths',
      characterSide: 'left',
      dialogue: "A ray is like a flashlight beam! It starts at one point and goes on forever in one direction. See the arrow? That shows it continues infinitely!",
      content: 'ray',
      interactive: true,
      instruction: 'Drag the starting point to change where the ray begins',
      hint: "Rays have a starting point but no ending point!"
    },
    {
      id: 'line',
      title: 'Lines - Infinite in Both Directions',
      characterSide: 'right',
      dialogue: "A line is the ultimate path - it extends infinitely in BOTH directions! No beginning, no end, just an endless straight journey through space. The arrows show it goes on forever!",
      content: 'line',
      interactive: false,
      hint: "Lines represent infinite possibilities and connections!"
    },
    {
      id: 'angle-intro',
      title: 'Angles - Measuring Turns',
      characterSide: 'left',
      dialogue: "When two rays meet at a point, they form an angle! Think of it as measuring how much you need to turn from one direction to another. The meeting point is called the vertex!",
      content: 'angle',
      interactive: true,
      instruction: 'Watch how the angle changes as rays move',
      hint: "Angles measure the 'opening' between two rays!"
    },
    {
      id: 'vertex',
      title: 'Vertex - The Meeting Point',
      characterSide: 'right',
      dialogue: "The vertex is the special point where rays meet to form angles, or where line segments connect. It's like the corner of your room - where two walls meet!",
      content: 'vertex',
      interactive: true,
      instruction: 'Click on the orange vertices to see their connections',
      hint: "Vertices are the connection points in geometry!"
    },
    {
      id: 'parallel',
      title: 'Parallel Lines - Forever Apart',
      characterSide: 'left',
      dialogue: "Some lines are destined never to meet! Parallel lines run in exactly the same direction and stay the same distance apart forever - like train tracks or the edges of this canvas!",
      content: 'parallel',
      interactive: true,
      instruction: 'See how parallel lines maintain equal distance',
      hint: "Parallel lines never intersect, no matter how far they extend!"
    },
    {
      id: 'perpendicular',
      title: 'Perpendicular Lines - Perfect Right Angles',
      characterSide: 'right',
      dialogue: "When two lines meet at exactly 90 degrees, they're perpendicular! Like the corner of a book or where a wall meets the floor - it forms a perfect square corner!",
      content: 'perpendicular',
      interactive: true,
      instruction: 'Notice the perfect 90° angle where lines meet',
      hint: "Perpendicular lines create the strongest, most stable connections!"
    },
    {
      id: 'intersecting',
      title: 'Intersecting Lines - Where Paths Cross',
      characterSide: 'left',
      dialogue: "Most lines that cross each other are intersecting lines - they meet at angles other than 90 degrees. Every intersection tells a story of two different paths meeting!",
      content: 'intersecting',
      interactive: true,
      instruction: 'Observe how the angle changes at the intersection',
      hint: "Intersecting lines create various angle measurements!"
    },
    {
      id: 'final-challenge',
      title: 'Geometry Master Challenge!',
      characterSide: 'right',
      dialogue: "Time for your final test! Can you identify all the geometric elements we've learned? Look at this complex figure and count: points, line segments, rays, and angles!",
      content: 'challenge',
      interactive: true,
      instruction: 'Click on different elements to identify them',
      hint: "Use everything you've learned to analyze this geometric figure!"
    },
    {
      id: 'completion',
      title: 'Quest Complete - Geometry Apprentice!',
      characterSide: 'left',
      dialogue: "Outstanding work, brave mathematician! You've mastered the fundamental building blocks of geometry. You're now ready to explore more complex geometric adventures! The mathematical world awaits!",
      content: 'completion',
      interactive: false,
      hint: "You've earned the title of Geometry Apprentice!"
    }
  ];

  const currentTutorial = tutorialSteps[currentStep];

  // Interactive canvas functions
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if ((currentTutorial.id === 'point-intro' || currentTutorial.id === 'point-game') && 
        (!currentTutorial.goal || interactivePoints.length < currentTutorial.goal)) {
      setInteractivePoints([...interactivePoints, { x: scaledX, y: scaledY, id: Date.now() }]);
    }
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Check if clicking on a draggable point
    interactivePoints.forEach(point => {
      const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
      if (distance < 20) {
        setDraggedPoint(point.id);
      }
    });
  };

  const handleMouseMove = (event) => {
    if (draggedPoint) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Scale coordinates
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;

      setInteractivePoints(points =>
        points.map(point =>
          point.id === draggedPoint ? { ...point, x: scaledX, y: scaledY } : point
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedPoint(null);
  };

  // Canvas drawing function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background
    ctx.fillStyle = '#f8f4e6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e8dcc0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw based on current tutorial step
    switch (currentTutorial.content) {
      case 'point':
      case 'point-game':
        drawPoints(ctx);
        break;
      case 'lineSegment':
        drawLineSegment(ctx);
        break;
      case 'ray':
        drawRay(ctx);
        break;
      case 'line':
        drawLine(ctx);
        break;
      case 'parallel':
        drawParallelLines(ctx);
        break;
      case 'perpendicular':
        drawPerpendicularLines(ctx);
        break;
      case 'intersecting':
        drawIntersectingLines(ctx);
        break;
      case 'angle':
        drawAngle(ctx);
        break;
      case 'vertex':
        drawVertex(ctx);
        break;
      case 'challenge':
        drawChallenge(ctx);
        break;
      default:
        break;
    }
  };

  // Enhanced drawing functions with more engaging visuals
  const drawPoints = (ctx) => {
    interactivePoints.forEach((point, index) => {
      // Draw glow effect
      ctx.beginPath();
      ctx.arc(point.x, point.y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.fill();

      // Draw main point
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#8B4513';
      ctx.fill();
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Animated sparkle effect
      const time = Date.now() * 0.005;
      const sparkleX = point.x + Math.cos(time + index) * 12;
      const sparkleY = point.y + Math.sin(time + index) * 12;
      
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.fill();

      // Enhanced label
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`P${index + 1}`, point.x + 12, point.y - 5);
    });

    // Show progress for point-creation goals
    if (currentTutorial.goal && interactivePoints.length < currentTutorial.goal) {
      ctx.fillStyle = '#666';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(
        `Points created: ${interactivePoints.length}/${currentTutorial.goal}`, 
        20, 30
      );
    }

    // Show completion message
    if (currentTutorial.goal && interactivePoints.length >= currentTutorial.goal) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
      ctx.fillRect(150, 180, 200, 60);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Goal Complete! ✓', 250, 210);
      ctx.fillText('Click Next to Continue', 250, 230);
      ctx.textAlign = 'left';
    }
  };

  const drawLineSegment = (ctx) => {
    const points = interactivePoints.length >= 2 ? interactivePoints.slice(0, 2) : [
      { x: 150, y: 200, id: 1 },
      { x: 350, y: 150, id: 2 }
    ];

    if (points.length < 2) return;

    // Draw line segment
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw endpoints
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#D32F2F';
      ctx.fill();
      ctx.strokeStyle = '#B71C1C';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(index === 0 ? 'A' : 'B', point.x - 8, point.y + 25);
    });

    // Update interactive points for dragging
    if (interactivePoints.length < 2) {
      setInteractivePoints(points);
    }
  };

  const drawRay = (ctx) => {
    const startPoint = interactivePoints[0] || { x: 150, y: 200 };
    const directionPoint = { x: 350, y: 150 };

    // Calculate direction vector
    const dx = directionPoint.x - startPoint.x;
    const dy = directionPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    // Extend to canvas edge
    const extendedX = startPoint.x + unitX * 600;
    const extendedY = startPoint.y + unitY * 600;

    // Draw ray
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(extendedX, extendedY);
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw arrowhead
    const arrowLength = 20;
    const arrowAngle = 0.5;
    const angle = Math.atan2(unitY, unitX);
    
    ctx.beginPath();
    ctx.moveTo(extendedX, extendedY);
    ctx.lineTo(
      extendedX - arrowLength * Math.cos(angle - arrowAngle),
      extendedY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(extendedX, extendedY);
    ctx.lineTo(
      extendedX - arrowLength * Math.cos(angle + arrowAngle),
      extendedY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw starting point
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#D32F2F';
    ctx.fill();

    // Label
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('A', startPoint.x - 8, startPoint.y + 25);

    if (interactivePoints.length === 0) {
      setInteractivePoints([startPoint]);
    }
  };

  const drawLine = (ctx) => {
    const midPoint = { x: 250, y: 200 };

    // Draw line extending beyond canvas
    ctx.beginPath();
    ctx.moveTo(0, midPoint.y - 50);
    ctx.lineTo(500, midPoint.y + 50);
    ctx.strokeStyle = '#7B1FA2';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw arrows on both ends
    const drawArrow = (x, y, angle) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 20 * Math.cos(angle - 0.5), y - 20 * Math.sin(angle - 0.5));
      ctx.moveTo(x, y);
      ctx.lineTo(x - 20 * Math.cos(angle + 0.5), y - 20 * Math.sin(angle + 0.5));
      ctx.strokeStyle = '#4A148C';
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    drawArrow(480, midPoint.y + 48, 0.1);
    drawArrow(20, midPoint.y - 48, Math.PI + 0.1);
  };

  const drawParallelLines = (ctx) => {
    // Draw two parallel lines
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.lineTo(450, 140);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, 220);
    ctx.lineTo(450, 240);
    ctx.stroke();

    // Draw parallel indicators (arrow marks)
    const drawParallelMarks = (x1, y1, x2, y2) => {
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 2; i++) {
        const offset = (i - 0.5) * 10;
        ctx.beginPath();
        ctx.moveTo(x1 + offset, y1 - 15);
        ctx.lineTo(x1 + offset, y1 + 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x2 + offset, y2 - 15);
        ctx.lineTo(x2 + offset, y2 + 15);
        ctx.stroke();
      }
    };

    drawParallelMarks(250, 130, 250, 230);

    // Label
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Parallel Lines', 180, 280);
  };

  const drawPerpendicularLines = (ctx) => {
    const centerX = 250;
    const centerY = 200;

    // Draw horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.strokeStyle = '#F57C00';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100);
    ctx.lineTo(centerX, centerY + 100);
    ctx.strokeStyle = '#E65100';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw right angle indicator
    const squareSize = 25;
    ctx.beginPath();
    ctx.moveTo(centerX + squareSize, centerY);
    ctx.lineTo(centerX + squareSize, centerY - squareSize);
    ctx.lineTo(centerX, centerY - squareSize);
    ctx.strokeStyle = '#BF360C';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 90° label
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('90°', centerX + 30, centerY - 30);
  };

  const drawIntersectingLines = (ctx) => {
    const centerX = 250;
    const centerY = 200;

    // Draw first line
    ctx.beginPath();
    ctx.moveTo(centerX - 120, centerY - 60);
    ctx.lineTo(centerX + 120, centerY + 60);
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw second line
    ctx.beginPath();
    ctx.moveTo(centerX - 100, centerY + 80);
    ctx.lineTo(centerX + 100, centerY - 80);
    ctx.strokeStyle = '#7B1FA2';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw intersection point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Draw angle arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI / 3);
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('65°', centerX + 45, centerY - 20);
  };

  const drawAngle = (ctx) => {
    const vertex = { x: 200, y: 250 };
    const ray1End = { x: 350, y: 200 };
    const ray2End = { x: 320, y: 100 };

    // Draw rays
    ctx.strokeStyle = '#673AB7';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray1End.x, ray1End.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray2End.x, ray2End.y);
    ctx.stroke();

    // Draw vertex
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Draw angle arc
    const angle1 = Math.atan2(ray1End.y - vertex.y, ray1End.x - vertex.x);
    const angle2 = Math.atan2(ray2End.y - vertex.y, ray2End.x - vertex.x);

    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 50, angle2, angle1);
    ctx.strokeStyle = '#3F51B5';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('A', ray2End.x + 5, ray2End.y - 5);
    ctx.fillText('B', vertex.x - 15, vertex.y + 25);
    ctx.fillText('C', ray1End.x + 5, ray1End.y + 15);
    ctx.fillText('∠ABC', vertex.x + 60, vertex.y - 20);
  };

  const drawVertex = (ctx) => {
    // Draw multiple geometric elements meeting at vertices
    const vertices = [
      { x: 150, y: 150, connections: [[300, 100], [200, 250]] },
      { x: 350, y: 200, connections: [[150, 150], [400, 300], [300, 100]] }
    ];

    vertices.forEach((vertex, index) => {
      // Draw lines from vertex
      ctx.strokeStyle = '#795548';
      ctx.lineWidth = 3;
      
      vertex.connections.forEach(end => {
        ctx.beginPath();
        ctx.moveTo(vertex.x, vertex.y);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      });

      // Draw vertex point
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF9800';
      ctx.fill();
      ctx.strokeStyle = '#E65100';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Vertex label
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`V${index + 1}`, vertex.x - 10, vertex.y - 20);
    });
  };

  const drawChallenge = (ctx) => {
    // Draw a complex figure with various geometric elements
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 3;

    // Triangle
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(250, 300);
    ctx.lineTo(350, 100);
    ctx.closePath();
    ctx.stroke();

    // Points at vertices
    const vertices = [
      { x: 150, y: 100 },
      { x: 250, y: 300 },
      { x: 350, y: 100 }
    ];

    vertices.forEach((vertex, index) => {
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#D32F2F';
      ctx.fill();

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(['A', 'B', 'C'][index], vertex.x + 15, vertex.y - 10);
    });

    // Additional elements
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 150);
    ctx.lineTo(480, 250);
    ctx.stroke();

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Can you identify:', 20, 350);
    ctx.fillText('• Points', 20, 370);
    ctx.fillText('• Line segments', 20, 385);
  };

  // Effect to redraw canvas when step changes
  useEffect(() => {
    setInteractivePoints([]);
    const timer = setTimeout(() => {
      drawCanvas();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      drawCanvas();
    }, 50);
    return () => clearTimeout(timer);
  }, [interactivePoints]);

  // Animation loop for sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTutorial.content === 'point' || currentTutorial.content === 'point-game') {
        drawCanvas();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentTutorial.content, interactivePoints]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCharacterSide(tutorialSteps[currentStep + 1].characterSide);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCharacterSide(tutorialSteps[currentStep - 1].characterSide);
    }
  };

  const resetInteractive = () => {
    setInteractivePoints([]);
  };

  return (
    <div className={styles.castleContainer}>
      {/* Header */}
      <div className={styles.castleHeader}>
        <div className={styles.castleHeaderContent}>
          <div className={styles.castleHeaderFlex}>
            <div className={styles.castleHeaderLeft}>
              <div className={styles.castleEmoji}>🏰</div>
              <div>
                <h1 className={styles.castleTitle}>Euclidean Spire</h1>
                <p className={styles.castleSubtitle}>Introduction to Basic Geometry</p>
              </div>
            </div>
            <div className={styles.castleProgressInfo}>
              <div className={styles.castleProgressLabel}>Progress</div>
              <div className={styles.castleProgressNumbers}>{currentStep + 1}/{tutorialSteps.length}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.castleProgressContainer}>
          <div className={styles.castleProgressBar}>
            <div 
              className={styles.castleProgressFill}
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.castleMain}>
        <div className={styles.castleContentWrapper}>
          {/* Tutorial Area */}
          <div className={styles.castleTutorialArea}>
            {/* Character Dialogue */}
            <div className={`${styles.castleCharacterSection} ${styles[characterSide]}`}>
              {showCharacter && (
                <div className={styles.castleCharacterContent}>
                  {/* Character Avatar */}
                  <div className={styles.castleCharacterAvatarSection}>
                    <div className={styles.castleCharacterAvatar}>
                      🧙‍♂️
                    </div>
                    <h3 className={styles.castleCharacterName}>Master Euclid</h3>
                    <p className={styles.castleCharacterRole}>Guardian of Geometric Wisdom</p>
                  </div>

                  {/* Dialogue Box */}
                  <div className={styles.castleDialogueBox}>
                    <div className={characterSide === 'right' ? styles.castleDialogueArrowRight : styles.castleDialogueArrowLeft} />
                    
                    <h4 className={styles.castleDialogueTitle}>{currentTutorial.title}</h4>
                    <p className={styles.castleDialogueText}>{currentTutorial.dialogue}</p>
                    
                    {currentTutorial.instruction && (
                      <div className={styles.castleInstructionBox}>
                        <p className={styles.castleInstructionText}>
                          📝 {currentTutorial.instruction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Canvas Area */}
            <div className={`${styles.castleCanvasSection} ${characterSide === 'right' ? styles.left : styles.right}`}>
              <div className={styles.castleCanvasContent}>
                <div className={styles.castleCanvasHeader}>
                  <h3 className={styles.castleCanvasTitle}>Interactive Learning Canvas</h3>
                  {currentTutorial.interactive && (
                    <button
                      onClick={resetInteractive}
                      className={styles.castleResetButton}
                    >
                      <RotateCcw className={styles.icon16} />
                      Reset
                    </button>
                  )}
                </div>

                <div className={styles.castleCanvasWrapper}>
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={400}
                    className={styles.castleCanvas}
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  />
                </div>

                {currentTutorial.content === 'completion' && (
                  <div className={styles.castleCompletionSection}>
                    <div className={styles.castleCompletionEmoji}>🏆</div>
                    <h3 className={styles.castleCompletionTitle}>Castle Conquered!</h3>
                    <p className={styles.castleCompletionText}>You've completed the Euclidean Spire tutorial!</p>
                    <div className={styles.castleCompletionBadges}>
                      <span className={styles.castleBadgeGreen}>+150 XP</span>
                      <span className={styles.castleBadgeBlue}>Basic Geometry Mastered</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className={styles.castleNavigation}>
            <div className={styles.castleNavigationFlex}>
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={styles.castleNavButton}
              >
                <ChevronLeft className={styles.icon20} />
                Previous
              </button>

              <div className={styles.castleNavCenter}>
                <button 
                  onClick={() => window.location.href = '/world-map'}
                  className={styles.castleMapButton}
                >
                  <Home className={styles.icon16} />
                  Map
                </button>
                <span className={styles.castleStepText}>
                  Step {currentStep + 1} of {tutorialSteps.length}
                </span>
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === tutorialSteps.length - 1}
                className={styles.castleNavButton}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className={styles.icon20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Popup */}
      {currentTutorial.content === 'completion' && (
        <div className={styles.castleAchievementOverlay}>
          <div className={styles.castleAchievementModal}>
            <div className={styles.castleAchievementContent}>
              <div className={styles.castleAchievementEmoji}>🏆</div>
              <h2 className={styles.castleAchievementTitle}>Castle Conquered!</h2>
              <p className={styles.castleAchievementSubtitle}>You've mastered the fundamentals of geometry!</p>
              
              <div className={styles.castleRewardsSection}>
                <h3 className={styles.castleRewardsTitle}>Rewards Earned:</h3>
                <div className={styles.castleRewardsList}>
                  <div className={styles.castleRewardItem}>
                    <span className={styles.castleRewardLabel}>Experience Points</span>
                    <span className={styles.castleRewardValueGreen}>+150 XP</span>
                  </div>
                  <div className={styles.castleRewardItem}>
                    <span className={styles.castleRewardLabel}>Achievement</span>
                    <span className={styles.castleRewardValueBlue}>Geometry Novice</span>
                  </div>
                  <div className={styles.castleRewardItem}>
                    <span className={styles.castleRewardLabel}>Progress</span>
                    <span className={styles.castleRewardValuePurple}>Castle 1 Complete</span>
                  </div>
                </div>
              </div>

              <div className={styles.castleAchievementButtons}>
                <button 
                  onClick={() => window.location.href = '/world-map'}
                  className={styles.castleAchievementButtonAmber}
                >
                  Return to Map
                </button>
                <button 
                  onClick={() => window.location.href = '/world-map/castle2'}
                  className={styles.castleAchievementButtonGreen}
                >
                  Next Castle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeometryTutorial;