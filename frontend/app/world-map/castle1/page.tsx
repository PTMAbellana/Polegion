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
      instruction: 'Drag the blue points to change the angle size',
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
      instruction: 'Drag the blue points to adjust the lines and see how they maintain their parallel relationship',
      hint: "Parallel lines have the same slope and never intersect!"
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
      dialogue: "Most lines that cross each other are intersecting lines - they meet at angles other than 90 degrees. Every intersection creates four angles, and opposite angles are always equal! Try dragging the line endpoints to see how the angles change.",
      content: 'intersecting',
      interactive: true,
      instruction: 'Drag the blue points to change the lines and observe how the intersection angle changes',
      hint: "Intersecting lines create four angles - opposite angles are always equal!"
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

    // Handle point creation modes
    if ((currentTutorial.id === 'point-intro' || currentTutorial.id === 'point-game') && 
        (!currentTutorial.goal || interactivePoints.length < currentTutorial.goal)) {
      setInteractivePoints([...interactivePoints, { x: scaledX, y: scaledY, id: Date.now() }]);
    }

    // Handle challenge mode clicks
    if (currentTutorial.content === 'challenge') {
      handleChallengeClick(scaledX, scaledY);
    }
  };

  // Challenge-specific click handler
  const handleChallengeClick = (x, y) => {
    if (currentTutorial.content !== 'challenge') return;
    
    const tolerance = 25; // Click tolerance in pixels
    
    // Define challenge elements
    const challengeElements = {
      points: [
        { x: 150, y: 100, id: 'point_A', label: 'Point A', type: 'point' },
        { x: 250, y: 300, id: 'point_B', label: 'Point B', type: 'point' },
        { x: 350, y: 100, id: 'point_C', label: 'Point C', type: 'point' },
        { x: 400, y: 200, id: 'point_D', label: 'Point D', type: 'point' }
      ],
      lineSegments: [
        { start: { x: 150, y: 100 }, end: { x: 250, y: 300 }, id: 'segment_AB', label: 'Line Segment AB', type: 'lineSegment' },
        { start: { x: 250, y: 300 }, end: { x: 350, y: 100 }, id: 'segment_BC', label: 'Line Segment BC', type: 'lineSegment' },
        { start: { x: 350, y: 100 }, end: { x: 150, y: 100 }, id: 'segment_CA', label: 'Line Segment CA', type: 'lineSegment' },
        { start: { x: 400, y: 150 }, end: { x: 480, y: 250 }, id: 'segment_DE', label: 'Line Segment DE', type: 'lineSegment' }
      ],
      rays: [
        { start: { x: 400, y: 200 }, direction: { x: 480, y: 120 }, id: 'ray_DF', label: 'Ray DF', type: 'ray' },
        { start: { x: 100, y: 350 }, direction: { x: 200, y: 350 }, id: 'ray_GH', label: 'Ray GH', type: 'ray' }
      ],
      angles: [
        { vertex: { x: 150, y: 100 }, id: 'angle_CAB', label: 'Angle CAB', type: 'angle' },
        { vertex: { x: 250, y: 300 }, id: 'angle_ABC', label: 'Angle ABC', type: 'angle' },
        { vertex: { x: 350, y: 100 }, id: 'angle_BCA', label: 'Angle BCA', type: 'angle' }
      ]
    };

    let elementFound = false;

    // Check for point clicks
    challengeElements.points.forEach(point => {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (distance < tolerance && !interactivePoints.some(p => p.id === point.id)) {
        setInteractivePoints(prev => [...prev, { ...point, found: true, foundAt: Date.now() }]);
        showSuccessMessage(`Found ${point.label}! 🎯`);
        elementFound = true;
      }
    });

    // Check for line segment clicks
    if (!elementFound) {
      challengeElements.lineSegments.forEach(segment => {
        const distanceToLine = pointToLineDistance(x, y, segment.start, segment.end);
        if (distanceToLine < tolerance && !interactivePoints.some(p => p.id === segment.id)) {
          setInteractivePoints(prev => [...prev, { ...segment, found: true, foundAt: Date.now() }]);
          showSuccessMessage(`Found ${segment.label}! ✨`);
          elementFound = true;
        }
      });
    }

    // Check for ray clicks
    if (!elementFound) {
      challengeElements.rays.forEach(ray => {
        const distanceToRay = pointToRayDistance(x, y, ray.start, ray.direction);
        if (distanceToRay < tolerance && !interactivePoints.some(p => p.id === ray.id)) {
          setInteractivePoints(prev => [...prev, { ...ray, found: true, foundAt: Date.now() }]);
          showSuccessMessage(`Found ${ray.label}! 🚀`);
          elementFound = true;
        }
      });
    }

    // Check for angle clicks (clicking near vertex)
    if (!elementFound) {
      challengeElements.angles.forEach(angle => {
        const distance = Math.sqrt((x - angle.vertex.x) ** 2 + (y - angle.vertex.y) ** 2);
        if (distance < tolerance + 15 && !interactivePoints.some(p => p.id === angle.id)) {
          setInteractivePoints(prev => [...prev, { ...angle, found: true, foundAt: Date.now() }]);
          showSuccessMessage(`Found ${angle.label}! 📐`);
          elementFound = true;
        }
      });
    }

    // Redraw canvas to show changes
    if (elementFound) {
      setTimeout(() => drawCanvas(), 50);
    }
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Handle line segment interaction
    if (currentTutorial.content === 'lineSegment') {
      const points = getPointsForCurrentStep();
      points.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        if (distance < 20) {
          setDraggedPoint(point.id);
        }
      });
    }
    
    // Enhanced ray interaction
    if (currentTutorial.content === 'ray') {
      const points = getPointsForCurrentStep();
      points.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        const hitRadius = point.id === 'rayStart' ? 20 : 15;
        if (distance < hitRadius) {
          setDraggedPoint(point.id);
          canvas.style.cursor = 'grabbing';
        }
      });
    }

    // Handle angle interaction
    if (currentTutorial.content === 'angle') {
      const points = interactivePoints.length >= 2 ? interactivePoints : [
        { x: 380, y: 150, id: 'ray1End' },
        { x: 120, y: 120, id: 'ray2End' }
      ];
      
      points.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        if (distance < 20) {
          setDraggedPoint(point.id);
          canvas.style.cursor = 'grabbing';
        }
      });
    }

    // Handle parallel lines interaction
    if (currentTutorial.content === 'parallel') {
      const points = interactivePoints.length >= 4 ? interactivePoints : [
        { x: 50, y: 120, id: 'line1Start' },
        { x: 450, y: 140, id: 'line1End' },
        { x: 50, y: 220, id: 'line2Start' },
        { x: 450, y: 240, id: 'line2End' }
      ];
      
      points.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        if (distance < 15) {
          setDraggedPoint(point.id);
          canvas.style.cursor = 'grabbing';
        }
      });
    }

    // Handle intersecting lines interaction - ENHANCED
    if (currentTutorial.content === 'intersecting') {
      const points = interactivePoints.length >= 4 ? interactivePoints : [
        { x: 100, y: 150, id: 'line1Start' },
        { x: 400, y: 250, id: 'line1End' },
        { x: 150, y: 300, id: 'line2Start' },
        { x: 350, y: 100, id: 'line2End' }
      ];
      
      points.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        if (distance < 15) {
          setDraggedPoint(point.id);
          canvas.style.cursor = 'grabbing';
        }
      });
    }
    
    // Handle vertex clicking
    if (currentTutorial.content === 'vertex') {
      const vertices = [
        { x: 150, y: 150, id: 'v1' },
        { x: 350, y: 200, id: 'v2' }
      ];
      
      vertices.forEach(vertex => {
        const distance = Math.sqrt((scaledX - vertex.x) ** 2 + (scaledY - vertex.y) ** 2);
        if (distance < 15) {
          const existingPointIndex = interactivePoints.findIndex(p => p.id === vertex.id);
          if (existingPointIndex >= 0) {
            setInteractivePoints(prev => prev.filter(p => p.id !== vertex.id));
          } else {
            setInteractivePoints(prev => [...prev, { ...vertex, clicked: true }]);
          }
        }
      });
    }
  };

  // Helper function to get points for current step
  const getPointsForCurrentStep = () => {
    switch (currentTutorial.content) {
      case 'lineSegment':
        return interactivePoints.length >= 2 ? interactivePoints.slice(0, 2) : [
          { x: 150, y: 200, id: 'lineStart' },
          { x: 350, y: 150, id: 'lineEnd' }
        ];
      case 'ray':
        return interactivePoints.length >= 2 ? interactivePoints.slice(0, 2) : [
          { x: 150, y: 200, id: 'rayStart' },
          { x: 350, y: 150, id: 'rayDirection' }
        ];
      case 'angle':
        return interactivePoints.length >= 2 ? interactivePoints.slice(0, 2) : [
          { x: 380, y: 150, id: 'ray1End' },
          { x: 120, y: 120, id: 'ray2End' }
        ];
      case 'parallel':
        return interactivePoints.length >= 4 ? interactivePoints : [
          { x: 50, y: 120, id: 'line1Start' },
          { x: 450, y: 140, id: 'line1End' },
          { x: 50, y: 220, id: 'line2Start' },
          { x: 450, y: 240, id: 'line2End' }
        ];
      case 'intersecting':
        return interactivePoints.length >= 4 ? interactivePoints : [
          { x: 100, y: 150, id: 'line1Start' },
          { x: 400, y: 250, id: 'line1End' },
          { x: 150, y: 300, id: 'line2Start' },
          { x: 350, y: 100, id: 'line2End' }
        ];
      default:
        return interactivePoints;
    }
  };

  const handleMouseMove = (event) => {
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

    // Handle dragging for all interactive content types
    if (draggedPoint) {
      setInteractivePoints(points =>
        points.map(point =>
          point.id === draggedPoint ? { ...point, x: scaledX, y: scaledY } : point
        )
      );
    } else {
      // Change cursor based on hovering over draggable elements
      let isHovering = false;
      
      if (currentTutorial.content === 'ray' || 
          currentTutorial.content === 'lineSegment' || 
          currentTutorial.content === 'angle' ||
          currentTutorial.content === 'parallel' ||
          currentTutorial.content === 'intersecting') {
        const points = getPointsForCurrentStep();
        points.forEach(point => {
          const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
          const hitRadius = 20;
          if (distance < hitRadius) {
            isHovering = true;
          }
        });
      }
      
      canvas.style.cursor = isHovering ? 'grab' : 'default';
    }
  };

  const handleMouseUp = () => {
    if (draggedPoint) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = 'default';
      }
    }
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
      { x: 150, y: 200, id: 'lineStart' },
      { x: 350, y: 150, id: 'lineEnd' }
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
    // Initialize points if not set
    const startPoint = interactivePoints.length > 0 ? interactivePoints[0] : { x: 150, y: 200, id: 'rayStart' };
    const directionPoint = interactivePoints.length > 1 ? interactivePoints[1] : { x: 350, y: 150, id: 'rayDirection' };

    // Calculate direction vector
    const dx = directionPoint.x - startPoint.x;
    const dy = directionPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Avoid division by zero
    if (length === 0) return;
    
    const unitX = dx / length;
    const unitY = dy / length;

    // Extend ray to canvas edge
    const maxExtension = 800; // Ensure it goes beyond canvas
    const extendedX = startPoint.x + unitX * maxExtension;
    const extendedY = startPoint.y + unitY * maxExtension;

    // Draw the ray line
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(extendedX, extendedY);
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw arrowhead at the extended end
    const arrowLength = 20;
    const arrowAngle = 0.5;
    const angle = Math.atan2(unitY, unitX);
    
    // Calculate arrow position (a bit before the extended end for visibility)
    const arrowX = startPoint.x + unitX * 400;
    const arrowY = startPoint.y + unitY * 400;
    
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - arrowLength * Math.cos(angle - arrowAngle),
      arrowY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - arrowLength * Math.cos(angle + arrowAngle),
      arrowY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw draggable starting point (red)
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#D32F2F';
    ctx.fill();
    ctx.strokeStyle = '#B71C1C';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw direction helper point (blue, smaller)
    ctx.beginPath();
    ctx.arc(directionPoint.x, directionPoint.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1976D2';
    ctx.fill();
    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add labels
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('A', startPoint.x - 8, startPoint.y + 25);
    ctx.fillText('→', arrowX - 10, arrowY - 15);

    // Instructions
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Drag the red point to move the ray start', 20, 30);
    ctx.fillText('Drag the blue point to change ray direction', 20, 50);

    // Set up interactive points if not already set
    if (interactivePoints.length < 2) {
      setInteractivePoints([startPoint, directionPoint]);
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
    // Initialize parallel line points if not set
    const line1Start = interactivePoints.length > 0 ? interactivePoints[0] : { x: 50, y: 120, id: 'line1Start' };
    const line1End = interactivePoints.length > 1 ? interactivePoints[1] : { x: 450, y: 140, id: 'line1End' };
    const line2Start = interactivePoints.length > 2 ? interactivePoints[2] : { x: 50, y: 220, id: 'line2Start' };
    const line2End = interactivePoints.length > 3 ? interactivePoints[3] : { x: 450, y: 240, id: 'line2End' };

    // Calculate slopes to maintain parallel relationship
    const line1Slope = (line1End.y - line1Start.y) / (line1End.x - line1Start.x);
    
    // Auto-adjust line2 to maintain parallel relationship when line1 is dragged
    if (draggedPoint && (draggedPoint === 'line1Start' || draggedPoint === 'line1End')) {
      const newSlope = (line1End.y - line1Start.y) / (line1End.x - line1Start.x);
      const line2Length = Math.sqrt(Math.pow(line2End.x - line2Start.x, 2) + Math.pow(line2End.y - line2Start.y, 2));
      const angle = Math.atan2(line1End.y - line1Start.y, line1End.x - line1Start.x);
      
      // Update line2 to maintain parallel relationship
      const updatedLine2End = {
        x: line2Start.x + Math.cos(angle) * line2Length,
        y: line2Start.y + Math.sin(angle) * line2Length,
        id: 'line2End'
      };
      
      // Update interactive points to maintain parallelism
      setInteractivePoints(prev => 
        prev.map(point => 
          point.id === 'line2End' ? updatedLine2End : point
        )
      );
    }

    // Calculate distance between parallel lines
    const distance = Math.abs(
      (line2Start.y - line1Start.y) * (line1End.x - line1Start.x) - 
      (line2Start.x - line1Start.x) * (line1End.y - line1Start.y)
    ) / Math.sqrt(Math.pow(line1End.x - line1Start.x, 2) + Math.pow(line1End.y - line1Start.y, 2));

    // Draw parallel lines with dynamic colors
    const parallelColor = Math.abs(line1Slope - (line2End.y - line2Start.y) / (line2End.x - line2Start.x)) < 0.1 ? '#4CAF50' : '#FF5722';
    
    ctx.strokeStyle = parallelColor;
    ctx.lineWidth = 4;

    // Draw line 1
    ctx.beginPath();
    ctx.moveTo(line1Start.x, line1Start.y);
    ctx.lineTo(line1End.x, line1End.y);
    ctx.stroke();

    // Draw line 2
    ctx.beginPath();
    ctx.moveTo(line2Start.x, line2Start.y);
    ctx.lineTo(line2End.x, line2End.y);
    ctx.stroke();

    // Draw draggable control points
    const getPointColor = (pointId) => {
      if (draggedPoint === pointId) {
        return { fill: '#FF5722', stroke: '#D84315' }; // Orange when dragging
      }
      return { fill: '#2196F3', stroke: '#1976D2' }; // Blue normally
    };

    // Draw control points for line 1
    [line1Start, line1End].forEach(point => {
      const colors = getPointColor(point.id);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw control points for line 2 (only if not auto-adjusting)
    if (!draggedPoint || (!draggedPoint.includes('line1'))) {
      [line2Start, line2End].forEach(point => {
        const colors = getPointColor(point.id);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Draw parallel indicators (arrow marks)
    const drawParallelMarks = (x1, y1, x2, y2) => {
      ctx.strokeStyle = parallelColor === '#4CAF50' ? '#2E7D32' : '#D32F2F';
      ctx.lineWidth = 3;
      
      for (let i = 0; i < 2; i++) {
        const offset = (i - 0.5) * 12;
        
        // Calculate perpendicular direction
        const lineAngle = Math.atan2(y2 - y1, x2 - x1);
        const perpAngle = lineAngle + Math.PI / 2;
        
        const markX1 = x1 + Math.cos(perpAngle) * 15;
        const markY1 = y1 + Math.sin(perpAngle) * 15;
        const markX2 = x1 - Math.cos(perpAngle) * 15;
        const markY2 = y1 - Math.sin(perpAngle) * 15;
        
        ctx.beginPath();
        ctx.moveTo(markX1 + offset, markY1);
        ctx.lineTo(markX2 + offset, markY2);
        ctx.stroke();
      }
    };

    // Draw parallel marks at midpoints
    const mid1X = (line1Start.x + line1End.x) / 2;
    const mid1Y = (line1Start.y + line1End.y) / 2;
    const mid2X = (line2Start.x + line2End.x) / 2;
    const mid2Y = (line2Start.y + line2End.y) / 2;

    drawParallelMarks(mid1X, mid1Y, line1End.x, line1End.y);
    drawParallelMarks(mid2X, mid2Y, line2End.x, line2End.y);

    // Show distance between lines
    ctx.fillStyle = parallelColor;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Distance: ${Math.round(distance)}px`, 20, 350);

    // Show slope information
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Line 1 slope: ${line1Slope.toFixed(3)}`, 20, 370);
    ctx.fillText(`Line 2 slope: ${((line2End.y - line2Start.y) / (line2End.x - line2Start.x)).toFixed(3)}`, 20, 385);

    // Parallel status indicator
    const isParallel = Math.abs(line1Slope - (line2End.y - line2Start.y) / (line2End.x - line2Start.x)) < 0.1;
    ctx.fillStyle = isParallel ? '#4CAF50' : '#FF5722';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(isParallel ? '✓ Lines are PARALLEL' : '✗ Lines are NOT parallel', 20, 320);

    // Interactive instructions
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Drag the blue points to adjust the lines!', 20, 30);
    ctx.fillText('Watch how the lines maintain their parallel relationship!', 20, 50);

    // Set up interactive points if not already set
    if (interactivePoints.length < 4) {
      setInteractivePoints([line1Start, line1End, line2Start, line2End]);
    }
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
    // Initialize intersecting line points with better centered positions
    const line1Start = interactivePoints.length > 0 ? interactivePoints[0] : { x: 100, y: 150, id: 'line1Start' };
    const line1End = interactivePoints.length > 1 ? interactivePoints[1] : { x: 400, y: 250, id: 'line1End' };
    const line2Start = interactivePoints.length > 2 ? interactivePoints[2] : { x: 150, y: 300, id: 'line2Start' };
    const line2End = interactivePoints.length > 3 ? interactivePoints[3] : { x: 350, y: 100, id: 'line2End' };

    // Calculate intersection point
    const intersection = calculateIntersection(line1Start, line1End, line2Start, line2End);
    
    // Calculate angles at intersection
    const line1Angle = Math.atan2(line1End.y - line1Start.y, line1End.x - line1Start.x);
    const line2Angle = Math.atan2(line2End.y - line2Start.y, line2End.x - line2Start.x);
    
    // Calculate the acute angle between lines
    let angleDiff = Math.abs(line1Angle - line2Angle);
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
    if (angleDiff > Math.PI / 2) angleDiff = Math.PI - angleDiff;
    
    const angleDegrees = angleDiff * (180 / Math.PI);

    // Dynamic colors based on angle
    const getAngleColor = (angle) => {
      if (Math.abs(angle - 90) < 5) return '#4CAF50'; // Nearly perpendicular
      if (angle < 30) return '#F44336'; // Very acute
      if (angle < 60) return '#FF9800'; // Acute
      return '#2196F3'; // Other angles
    };

    const angleColor = getAngleColor(angleDegrees);

    // Draw line 1 with dynamic color and extended length
    ctx.strokeStyle = angleColor;
    ctx.lineWidth = 4;
    
    // Extend line 1 beyond endpoints for better visibility
    const line1Dir = { 
      x: line1End.x - line1Start.x, 
      y: line1End.y - line1Start.y 
    };
    const line1Length = Math.sqrt(line1Dir.x * line1Dir.x + line1Dir.y * line1Dir.y);
    const line1Unit = { x: line1Dir.x / line1Length, y: line1Dir.y / line1Length };
    
    const line1ExtendedStart = {
      x: line1Start.x - line1Unit.x * 50,
      y: line1Start.y - line1Unit.y * 50
    };
    const line1ExtendedEnd = {
      x: line1End.x + line1Unit.x * 50,
      y: line1End.y + line1Unit.y * 50
    };

    ctx.beginPath();
    ctx.moveTo(line1ExtendedStart.x, line1ExtendedStart.y);
    ctx.lineTo(line1ExtendedEnd.x, line1ExtendedEnd.y);
    ctx.stroke();

    // Draw line 2 with dynamic color and extended length
    const line2Dir = { 
      x: line2End.x - line2Start.x, 
      y: line2End.y - line2Start.y 
    };
    const line2Length = Math.sqrt(line2Dir.x * line2Dir.x + line2Dir.y * line2Dir.y);
    const line2Unit = { x: line2Dir.x / line2Length, y: line2Dir.y / line2Length };
    
    const line2ExtendedStart = {
      x: line2Start.x - line2Unit.x * 50,
      y: line2Start.y - line2Unit.y * 50
    };
    const line2ExtendedEnd = {
      x: line2End.x + line2Unit.x * 50,
      y: line2End.y + line2Unit.y * 50
    };

    ctx.beginPath();
    ctx.moveTo(line2ExtendedStart.x, line2ExtendedStart.y);
    ctx.lineTo(line2ExtendedEnd.x, line2ExtendedEnd.y);
    ctx.stroke();

    // Highlight intersection point with enhanced pulsing effect
    const time = Date.now() * 0.005;
    const pulseRadius = 12 + Math.sin(time * 2) * 4;
    
    // Outer glow
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, pulseRadius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = `${angleColor}30`;
    ctx.fill();
    
    // Main intersection point
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, pulseRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw multiple angle arcs for better visualization
    const arcRadius = 50;
    
    // Calculate start and end angles for the acute angle
    let startAngle = Math.min(line1Angle, line2Angle);
    let endAngle = Math.max(line1Angle, line2Angle);
    
    // Ensure we draw the smaller angle
    if (endAngle - startAngle > Math.PI) {
      const temp = startAngle;
      startAngle = endAngle;
      endAngle = temp + 2 * Math.PI;
    }

    // Main angle arc
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, arcRadius, startAngle, endAngle);
    ctx.strokeStyle = angleColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Animated outer arc
    const animatedRadius = arcRadius + 10 + Math.sin(time * 1.5) * 5;
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, animatedRadius, startAngle, endAngle);
    ctx.strokeStyle = `${angleColor}60`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw draggable control points with better visibility
    const getPointColor = (pointId) => {
      if (draggedPoint === pointId) {
        return { fill: '#FF5722', stroke: '#D84315', radius: 12 };
      }
      return { fill: '#2196F3', stroke: '#1976D2', radius: 10 };
    };

    // Draw control points for both lines
    [line1Start, line1End, line2Start, line2End].forEach(point => {
      const colors = getPointColor(point.id);
      
      // Glow effect
      ctx.beginPath();
      ctx.arc(point.x, point.y, colors.radius + 5, 0, 2 * Math.PI);
      ctx.fillStyle = `${colors.fill}30`;
      ctx.fill();
      
      // Main point
      ctx.beginPath();
      ctx.arc(point.x, point.y, colors.radius, 0, 2 * Math.PI);
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Enhanced angle measurement display - positioned better
    const midAngle = (startAngle + endAngle) / 2;
    const labelDistance = arcRadius + 35;
    const labelX = intersection.x + Math.cos(midAngle) * labelDistance;
    const labelY = intersection.y + Math.sin(midAngle) * labelDistance;

    // Ensure label is within canvas bounds
    const adjustedLabelX = Math.max(50, Math.min(450, labelX));
    const adjustedLabelY = Math.max(50, Math.min(350, labelY));

    // Dynamic angle display with enhanced background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.roundRect(adjustedLabelX - 40, adjustedLabelY - 25, 80, 40, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = angleColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(angleDegrees)}°`, adjustedLabelX, adjustedLabelY - 5);
    ctx.textAlign = 'left';

    // Enhanced status display - positioned at top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 300, 80);
    ctx.strokeStyle = angleColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 300, 80);

    // Show angle type classification
    let angleType = '';
    if (Math.abs(angleDegrees - 90) < 2) {
      angleType = '🔥 Perfect Perpendicular! (90°)';
    } else if (angleDegrees < 30) {
      angleType = '⚡ Very Acute Angle';
    } else if (angleDegrees < 60) {
      angleType = '📐 Acute Angle';
    } else if (angleDegrees < 90) {
      angleType = '📏 Wide Acute Angle';
    } else {
      angleType = '📊 Obtuse Angle';
    }

    ctx.fillStyle = angleColor;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(angleType, 20, 35);

    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText(`Intersection Angle: ${Math.round(angleDegrees)}°`, 20, 55);
    ctx.fillText(`Complementary: ${Math.round(180 - angleDegrees)}°`, 20, 75);

    // Interactive instructions - positioned at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);
    
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🎯 Drag the blue points to change the intersection angle!', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Watch how the angle measurement changes as lines move', 20, 360);
    ctx.fillText('💡 Tip: Try to make a perfect 90° angle (perpendicular lines)!', 20, 375);

    // Add visual guides for special angles
    if (Math.abs(angleDegrees - 45) < 3) {
      ctx.fillStyle = '#FF9800';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('✨ Close to 45°!', adjustedLabelX - 30, adjustedLabelY + 20);
    } else if (Math.abs(angleDegrees - 90) < 3) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('🎉 Almost Perpendicular!', adjustedLabelX - 50, adjustedLabelY + 20);
    }

    // Set up interactive points if not already set
    if (interactivePoints.length < 4) {
      setInteractivePoints([line1Start, line1End, line2Start, line2End]);
    }
  };

  // Enhanced drawAngle function with proper centering
  const drawAngle = (ctx) => {
    // Center the vertex properly in the canvas
    const vertex = { x: 250, y: 200, id: 'vertex' }; // Canvas center: 500/2 = 250, 400/2 = 200
    
    // Better positioned ray endpoints for balanced appearance
    const ray1End = interactivePoints.length > 0 ? interactivePoints[0] : { x: 380, y: 150, id: 'ray1End' };
    const ray2End = interactivePoints.length > 1 ? interactivePoints[1] : { x: 120, y: 120, id: 'ray2End' };

    // Calculate angles
    const angle1 = Math.atan2(ray1End.y - vertex.y, ray1End.x - vertex.x);
    const angle2 = Math.atan2(ray2End.y - vertex.y, ray2End.x - vertex.x);
    
    // Calculate angle difference (always positive)
    let angleDiff = angle1 - angle2;
    if (angleDiff < 0) angleDiff += 2 * Math.PI;
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
    
    const angleDegrees = angleDiff * (180 / Math.PI);

    // Draw rays with dynamic colors based on angle
    const rayColor = angleDegrees < 45 ? '#E53E3E' : 
                     angleDegrees < 90 ? '#DD6B20' : 
                     angleDegrees < 135 ? '#38A169' : '#3182CE';
    
    ctx.strokeStyle = rayColor;
    ctx.lineWidth = 4;

    // Ray 1 (right side)
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray1End.x, ray1End.y);
    ctx.stroke();

    // Ray 2 (left side)
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray2End.x, ray2End.y);
    ctx.stroke();

    // Draw vertex point (perfectly centered)
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw centered angle arc
    const arcRadius = 60; // Smaller radius for better proportion
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, arcRadius, Math.min(angle1, angle2), Math.max(angle1, angle2));
    ctx.strokeStyle = rayColor;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Add pulsing effect to the arc
    const time = Date.now() * 0.003;
    const pulseRadius = arcRadius + Math.sin(time) * 8;
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, pulseRadius, Math.min(angle1, angle2), Math.max(angle1, angle2));
    ctx.strokeStyle = `${rayColor}60`; // Semi-transparent
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw draggable endpoints for rays
    const getPointColor = (pointId) => {
      if (draggedPoint === pointId) {
        return { fill: '#FF5722', stroke: '#D84315' }; // Orange when dragging
      }
      return { fill: '#1976D2', stroke: '#0D47A1' }; // Blue normally
    };

    // Ray 1 endpoint (right)
    const ray1Colors = getPointColor('ray1End');
    ctx.beginPath();
    ctx.arc(ray1End.x, ray1End.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = ray1Colors.fill;
    ctx.fill();
    ctx.strokeStyle = ray1Colors.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ray 2 endpoint (left)
    const ray2Colors = getPointColor('ray2End');
    ctx.beginPath();
    ctx.arc(ray2End.x, ray2End.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = ray2Colors.fill;
    ctx.fill();
    ctx.strokeStyle = ray2Colors.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Centered angle measurement display
    const midAngle = (angle1 + angle2) / 2;
    const labelDistance = arcRadius + 40; // Distance from vertex
    const labelX = vertex.x + Math.cos(midAngle) * labelDistance;
    const labelY = vertex.y + Math.sin(midAngle) * labelDistance;

    // Dynamic angle display with background (centered)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.roundRect(labelX - 35, labelY - 20, 70, 35, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = rayColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(angleDegrees)}°`, labelX, labelY - 2);
    ctx.textAlign = 'left';

    // Enhanced labels with better positioning (balanced)
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('A', ray2End.x - 25, ray2End.y - 10); // Left ray
    ctx.fillText('B', vertex.x - 8, vertex.y + 35); // Vertex (bottom)
    ctx.fillText('C', ray1End.x + 15, ray1End.y - 10); // Right ray

    // Centered angle name
    const angleNameX = vertex.x + Math.cos(midAngle) * (arcRadius - 20);
    const angleNameY = vertex.y + Math.sin(midAngle) * (arcRadius - 20);
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('∠ABC', angleNameX, angleNameY + 5);
    ctx.textAlign = 'left';

    // Centered instructions
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Drag the blue points to change the angle!', 250, 30);
    ctx.textAlign = 'left';
    
    // Centered angle classification
    let angleType = '';
    if (angleDegrees < 90) angleType = 'Acute Angle (< 90°)';
    else if (Math.abs(angleDegrees - 90) < 2) angleType = 'Right Angle (= 90°)';
    else if (angleDegrees < 180) angleType = 'Obtuse Angle (> 90°)';
    else angleType = 'Straight Angle (= 180°)';
    
    ctx.fillStyle = rayColor;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(angleType, 250, 370);
    ctx.textAlign = 'left';

    // Set up interactive points if not already set (better balanced positions)
    if (interactivePoints.length < 2) {
      setInteractivePoints([
        { x: 380, y: 150, id: 'ray1End' }, // Right side
        { x: 120, y: 120, id: 'ray2End' }  // Left side
      ]);
    }
  };

  // Fixed drawVertex function (Step 9) with click interaction
  const drawVertex = (ctx) => {
    const vertices = [
      { x: 150, y: 150, connections: [[300, 100], [200, 250]], id: 'v1' },
      { x: 350, y: 200, connections: [[150, 150], [450, 300], [300, 100]], id: 'v2' }
    ];

    vertices.forEach((vertex, index) => {
      // Check if this vertex was clicked
      const isClicked = interactivePoints.some(p => p.id === vertex.id && p.clicked);
      
      // Draw connections with different colors for clicked vertices
      ctx.strokeStyle = isClicked ? '#FF6B35' : '#795548';
      ctx.lineWidth = isClicked ? 4 : 3;
      
      vertex.connections.forEach(end => {
        ctx.beginPath();
        ctx.moveTo(vertex.x, vertex.y);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      });

      // Draw vertex point with animation if clicked
      ctx.beginPath();
      const radius = isClicked ? 15 : 12;
      ctx.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isClicked ? '#FF3D00' : '#FF9800';
      ctx.fill();
      ctx.strokeStyle = '#E65100';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add glow effect for clicked vertices
      if (isClicked) {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 61, 0, 0.3)';
        ctx.fill();
      }

      // Enhanced vertex label
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`V${index + 1}`, vertex.x - 15, vertex.y - 25);
      
      if (isClicked) {
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#D84315';
        ctx.fillText('Clicked!', vertex.x - 20, vertex.y + 40);
      }
    });

    // Instructions
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Click on the orange vertices to highlight them!', 20, 30);
  };

  // Enhanced drawChallenge function with full interactivity
  const drawChallenge = (ctx) => {
    // Define all geometric elements in the challenge figure
    const challengeElements = {
      points: [
        { x: 150, y: 100, id: 'point_A', label: 'A', type: 'point' },
        { x: 250, y: 300, id: 'point_B', label: 'B', type: 'point' },
        { x: 350, y: 100, id: 'point_C', label: 'C', type: 'point' },
        { x: 400, y: 200, id: 'point_D', label: 'D', type: 'point' }
      ],
      lineSegments: [
        { start: { x: 150, y: 100 }, end: { x: 250, y: 300 }, id: 'segment_AB', label: 'Line Segment AB', type: 'lineSegment' },
        { start: { x: 250, y: 300 }, end: { x: 350, y: 100 }, id: 'segment_BC', label: 'Line Segment BC', type: 'lineSegment' },
        { start: { x: 350, y: 100 }, end: { x: 150, y: 100 }, id: 'segment_CA', label: 'Line Segment CA', type: 'lineSegment' },
        { start: { x: 400, y: 150 }, end: { x: 480, y: 250 }, id: 'segment_DE', label: 'Line Segment DE', type: 'lineSegment' }
      ],
      rays: [
        { start: { x: 400, y: 200 }, direction: { x: 480, y: 120 }, id: 'ray_DF', label: 'Ray DF', type: 'ray' },
        { start: { x: 100, y: 350 }, direction: { x: 200, y: 350 }, id: 'ray_GH', label: 'Ray GH', type: 'ray' }
      ],
      angles: [
        { vertex: { x: 150, y: 100 }, id: 'angle_CAB', label: 'Angle CAB', type: 'angle' },
        { vertex: { x: 250, y: 300 }, id: 'angle_ABC', label: 'Angle ABC', type: 'angle' },
        { vertex: { x: 350, y: 100 }, id: 'angle_BCA', label: 'Angle BCA', type: 'angle' }
      ]
    };

    // Clear canvas and set background
    ctx.fillStyle = '#f8f4e6';
    ctx.fillRect(0, 0, 500, 400);

    // Draw subtle grid
    ctx.strokeStyle = '#e8dcc0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 500; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
    }
    for (let i = 0; i < 400; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(500, i);
      ctx.stroke();
    }

    // Draw line segments with interactive feedback
    challengeElements.lineSegments.forEach((segment, index) => {
      const isFound = interactivePoints.some(p => p.id === segment.id);
      
      // Glow effect for found segments
      if (isFound) {
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 15;
      }
      
      ctx.strokeStyle = isFound ? '#4CAF50' : (index < 3 ? '#2E7D32' : '#1565C0');
      ctx.lineWidth = isFound ? 6 : 4;
      
      ctx.beginPath();
      ctx.moveTo(segment.start.x, segment.start.y);
      ctx.lineTo(segment.end.x, segment.end.y);
      ctx.stroke();
      
      ctx.shadowBlur = 0; // Reset shadow
      
      // Draw click indicator for unfound segments
      if (!isFound) {
        const midX = (segment.start.x + segment.end.x) / 2;
        const midY = (segment.start.y + segment.end.y) / 2;
        
        ctx.beginPath();
        ctx.arc(midX, midY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(46, 125, 50, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Checkmark for found segments
      if (isFound) {
        const midX = (segment.start.x + segment.end.x) / 2;
        const midY = (segment.start.y + segment.end.y) / 2;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✓', midX, midY + 5);
        ctx.textAlign = 'left';
      }
    });

    // Draw rays with arrows
    challengeElements.rays.forEach((ray, index) => {
      const isFound = interactivePoints.some(p => p.id === ray.id);
      
      // Calculate ray direction
      const dx = ray.direction.x - ray.start.x;
      const dy = ray.direction.y - ray.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const unitX = dx / length;
      const unitY = dy / length;
      
      // Extend ray beyond canvas
      const extendedX = ray.start.x + unitX * 400;
      const extendedY = ray.start.y + unitY * 400;
      
      // Glow effect for found rays
      if (isFound) {
        ctx.shadowColor = '#FF5722';
        ctx.shadowBlur = 12;
      }
      
      ctx.strokeStyle = isFound ? '#4CAF50' : '#FF5722';
      ctx.lineWidth = isFound ? 6 : 4;
      
      // Draw ray line
      ctx.beginPath();
      ctx.moveTo(ray.start.x, ray.start.y);
      ctx.lineTo(extendedX, extendedY);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
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
      ctx.stroke();
      
      // Checkmark for found rays
      if (isFound) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✓', ray.start.x + unitX * 50, ray.start.y + unitY * 50);
        ctx.textAlign = 'left';
      }
    });

    // Draw points (vertices)
    challengeElements.points.forEach((point, index) => {
      const isFound = interactivePoints.some(p => p.id === point.id);
      
      // Glow effect for found points
      if (isFound) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
        ctx.fill();
      }
      
      // Main point circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, isFound ? 15 : 10, 0, 2 * Math.PI);
      ctx.fillStyle = isFound ? '#4CAF50' : '#D32F2F';
      ctx.fill();
      ctx.strokeStyle = isFound ? '#2E7D32' : '#B71C1C';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Point label
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(point.label, point.x + 20, point.y - 15);
      
      // Checkmark for found points
      if (isFound) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✓', point.x, point.y + 5);
        ctx.textAlign = 'left';
      }
    });

    // Draw angles with arcs (only for found angles)
    challengeElements.angles.forEach((angle, index) => {
      const isFound = interactivePoints.some(p => p.id === angle.id);
      
      if (isFound) {
        const vertex = angle.vertex;
        const arcRadius = 40;
        
        // Calculate angles for the arc based on triangle geometry
        let startAngle, endAngle;
        if (angle.id === 'angle_CAB') {
          startAngle = Math.PI;
          endAngle = Math.PI + 1.3;
        } else if (angle.id === 'angle_ABC') {
          startAngle = -2.6;
          endAngle = -0.9;
        } else if (angle.id === 'angle_BCA') {
          startAngle = 0;
          endAngle = 1.3;
        }
        
        // Glow effect
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, arcRadius, startAngle, endAngle);
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Additional arc for emphasis
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, arcRadius + 8, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(76, 175, 80, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Angle symbol
        const midAngle = (startAngle + endAngle) / 2;
        const symbolX = vertex.x + Math.cos(midAngle) * (arcRadius + 15);
        const symbolY = vertex.y + Math.sin(midAngle) * (arcRadius + 15);
        
               
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('∠', symbolX, symbolY + 5);
        ctx.textAlign = 'left';
      }
    });

    // Challenge progress UI
    const foundElements = interactivePoints.length;
    const totalElements = 13; // 4 points + 4 segments + 2 rays + 3 angles
    
    // Main progress panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 220, 150);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 220, 150);
    
    // Title
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🔍 Geometry Hunter', 20, 35);
    
    // Score
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = foundElements === totalElements ? '#4CAF50' : '#666';
    ctx.fillText(`Found: ${foundElements}/${totalElements}`, 20, 60);
    
    // Progress bar
    const progressWidth = (foundElements / totalElements) * 180;
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(20, 70, 180, 12);
    ctx.fillStyle = foundElements === totalElements ? '#4CAF50' : '#2196F3';
    ctx.fillRect(20, 70, progressWidth, 12);
    
    // Element checklist
    const elementTypes = [
      { 
        name: 'Points', 
        found: interactivePoints.filter(p => p.type === 'point').length, 
        total: 4,
        icon: '●'
      },
      { 
        name: 'Line Segments', 
        found: interactivePoints.filter(p => p.type === 'lineSegment').length, 
        total: 4,
        icon: '▬'
      },
      { 
        name: 'Rays', 
        found: interactivePoints.filter(p => p.type === 'ray').length, 
        total: 2,
        icon: '→'
      },
      { 
        name: 'Angles', 
        found: interactivePoints.filter(p => p.type === 'angle').length, 
        total: 3,
        icon: '∠'
      }
    ];
    
    elementTypes.forEach((type, index) => {
      const y = 100 + index * 18;
      const isComplete = type.found === type.total;
      
      ctx.fillStyle = isComplete ? '#4CAF50' : '#666';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`${type.icon} ${type.name}: ${type.found}/${type.total}`, 25, y);
      
      if (isComplete) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillText('✓', 200, y);
      }
    });

    // Instructions panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 350, 480, 40);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 350, 480, 40);
    
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🎯 Click on geometric elements to identify them!', 20, 370);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Find: Red points • Green line segments • Orange rays • Angles at vertices', 20, 385);

    // Completion celebration
    if (foundElements === totalElements) {
      // Celebration overlay
      ctx.fillStyle = 'rgba(76, 175, 80, 0.95)';
      ctx.fillRect(120, 120, 260, 160);
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 4;
      ctx.strokeRect(120, 120, 260, 160);
      
      // Celebration content
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏆 CHALLENGE', 250, 160);
      ctx.fillText('COMPLETE!', 250, 190);
      
      ctx.font = 'bold 18px Arial';
      ctx.fillText('🎉 Geometry Master! 🎉', 250, 220);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#E8F5E8';
      ctx.fillText('You found all geometric elements!', 250, 245);
      ctx.fillText('Click Next to continue your journey', 250, 265);
      ctx.textAlign = 'left';
    }
  };

  // Effect to redraw canvas when step changes
  useEffect(() => {
    setInteractivePoints([]);
    setDraggedPoint(null);
    
    const timer = setTimeout(() => {
      // Initialize points for specific steps
      if (currentTutorial.content === 'ray') {
        setInteractivePoints([ 
          { x: 150, y: 200, id: 'rayStart' },
          { x: 350, y: 150, id: 'rayDirection' }
        ]);
      } else if (currentTutorial.content === 'lineSegment') {
        setInteractivePoints([
          { x: 150, y: 200, id: 'lineStart' },
          { x: 350, y: 150, id: 'lineEnd' }
        ]);
      } else if (currentTutorial.content === 'angle') {
        setInteractivePoints([
          { x: 380, y: 150, id: 'ray1End' },
          { x: 120, y: 120, id: 'ray2End' }
        ]);
      } else if (currentTutorial.content === 'parallel') {
        setInteractivePoints([
          { x: 50, y: 120, id: 'line1Start' },
          { x: 450, y: 140, id: 'line1End' },
          { x: 50, y: 220, id: 'line2Start' },
          { x: 450, y: 240, id: 'line2End' }
        ]);
      } else if (currentTutorial.content === 'intersecting') {
        setInteractivePoints([
          { x: 100, y: 150, id: 'line1Start' },
          { x: 400, y: 250, id: 'line1End' },
          { x: 150, y: 300, id: 'line2Start' },
          { x: 350, y: 100, id: 'line2End' }
        ]);
      }
      
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

// Helper function to calculate line intersection
const calculateIntersection = (p1, p2, p3, p4) => {
  const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y, x4 = p4.x, y4 = p4.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
  if (Math.abs(denom) < 0.001) {
    // Lines are parallel, return midpoint
    return { x: 250, y: 200 };
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - x3) * (x3 - x4)) / denom;
  
  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1)
  };
};