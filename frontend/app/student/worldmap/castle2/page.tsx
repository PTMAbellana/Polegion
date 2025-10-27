"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Home, RotateCcw, Target, Award, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/castle.module.css';

const AngleMasteryTutorial = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCharacter, setShowCharacter] = useState(true);
  const [characterSide, setCharacterSide] = useState('right');
  const [interactivePoints, setInteractivePoints] = useState([]);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [gameState, setGameState] = useState({
    score: 0,
    attempts: 0,
    correctAnswers: 0,
    currentAnswer: '',
    selectedAngle: null,
    matchedPairs: [],
    constructedAngle: 0,
    targetAngle: 90,
    tolerance: 5
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef(null);

  // Enhanced tutorial steps for Castle 2 - Angle Mastery
  const tutorialSteps = [
    {
      id: 'welcome-castle2',
      title: 'Welcome to the Tower of Angles!',
      characterSide: 'right',
      dialogue: "Welcome back, brave mathematician! I am Master Protractor, guardian of angular wisdom. In this tower, you'll master the art of measuring, naming, and understanding angles. Are you ready to unlock the secrets of angular geometry?",
      content: 'introduction',
      interactive: false,
      hint: "This castle specializes in all things angular!"
    },
    {
      id: 'angle-basics',
      title: 'What is an Angle?',
      characterSide: 'left',
      dialogue: "An angle is formed when two rays meet at a common point called the vertex! Think of it as measuring the 'opening' between two directions. The wider the opening, the larger the angle!",
      content: 'angle-basics',
      interactive: true,
      instruction: 'Drag the rays to see how angles change',
      hint: "Watch how the angle measurement changes as you move the rays!"
    },
    {
      id: 'angle-naming',
      title: 'Naming Angles - The Three-Point Method',
      characterSide: 'right',
      dialogue: "Every angle has a proper name! We name angles using three points: one point on each ray and the vertex in the middle. The vertex ALWAYS goes in the middle of the name!",
      content: 'angle-naming',
      interactive: true,
      instruction: 'Click on angles to practice naming them correctly',
      goal: 3,
      hint: "Remember: Point-Vertex-Point naming convention!"
    },
    {
      id: 'angle-measuring',
      title: 'Measuring Angles with a Protractor',
      characterSide: 'left',
      dialogue: "Time to become a master measurer! Angles are measured in degrees (°). A full rotation is 360°. Use your estimation skills to measure these angles!",
      content: 'angle-measuring',
      interactive: true,
      instruction: 'Estimate the angle measurements and click to submit',
      goal: 5,
      hint: "Look at the angle opening to estimate its size!"
    },
    {
      id: 'angle-types',
      title: 'Types of Angles',
      characterSide: 'right',
      dialogue: "Angles have special names based on their size! Acute angles are less than 90°, right angles are exactly 90°, obtuse angles are between 90° and 180°, and straight angles are exactly 180°!",
      content: 'angle-types',
      interactive: true,
      instruction: 'Drag angles to their correct type categories',
      goal: 8,
      hint: "Acute < 90°, Right = 90°, Obtuse > 90° but < 180°"
    },
    {
      id: 'angle-construction',
      title: 'Angle Construction Master',
      characterSide: 'left',
      dialogue: "Now you'll become an angle architect! Construct specific angles by dragging the rays to match the target measurement. Precision is key - get within 5° of the target!",
      content: 'angle-construction',
      interactive: true,
      instruction: 'Construct the target angle by dragging the ray',
      hint: "Watch the measurement display as you drag!"
    },
    {
      id: 'complementary-supplementary',
      title: 'Angle Relationships - Perfect Partners',
      characterSide: 'right',
      dialogue: "Some angles are best friends! Complementary angles add up to 90°, while supplementary angles add up to 180°. These relationships are everywhere in geometry!",
      content: 'complementary-supplementary',
      interactive: true,
      instruction: 'Find pairs of complementary and supplementary angles',
      hint: "Complementary = 90°, Supplementary = 180°"
    },
    {
      id: 'vertical-angles',
      title: 'Vertical Angles - Mirror Images',
      characterSide: 'left',
      dialogue: "When two lines intersect, they create four angles! The angles opposite each other are called vertical angles, and they're always equal! It's like looking in a mirror!",
      content: 'vertical-angles',
      interactive: true,
      instruction: 'Identify pairs of vertical angles',
      hint: "Vertical angles are across from each other and always equal!"
    },
    {
      id: 'adjacent-angles',
      title: 'Adjacent Angles - Friendly Neighbors',
      characterSide: 'right',
      dialogue: "Adjacent angles are next-door neighbors! They share a common vertex and a common side, but don't overlap. When adjacent angles form a straight line, they're supplementary!",
      content: 'adjacent-angles',
      interactive: true,
      instruction: 'Find pairs of adjacent angles',
      hint: "Adjacent angles share a vertex and a side!"
    },
    {
      id: 'angle-bisector',
      title: 'Angle Bisectors - Perfect Division',
      characterSide: 'left',
      dialogue: "An angle bisector is like a perfectly fair judge - it divides an angle into two equal parts! This ray splits the angle right down the middle, creating two congruent angles.",
      content: 'angle-bisector',
      interactive: true,
      instruction: 'Create angle bisectors by dragging the ray to the middle',
      hint: "The bisector creates two equal angles!"
    },
    {
      id: 'missing-angles',
      title: 'Missing Angle Detective',
      characterSide: 'right',
      dialogue: "Time for some angle algebra! When you know the relationships between angles, you can solve for missing measurements. Use complementary, supplementary, and vertical angle rules!",
      content: 'missing-angles',
      interactive: true,
      instruction: 'Solve for the missing angle measurements',
      goal: 4,
      hint: "Use angle relationships: complementary, supplementary, or vertical angles!"
    },
    {
      id: 'angle-challenge',
      title: 'Angle Master Challenge!',
      characterSide: 'left',
      dialogue: "The ultimate test! Combine all your angle knowledge in this final challenge. Name, measure, identify types, and find relationships - prove you're a true Angle Master!",
      content: 'angle-challenge',
      interactive: true,
      instruction: 'Complete all angle challenges to become an Angle Master',
      hint: "Use everything you've learned!"
    },
    {
      id: 'completion-castle2',
      title: 'Congratulations, Angle Master!',
      characterSide: 'right',
      dialogue: "Outstanding work! You've mastered the mysteries of angles and earned the title of Angle Master! Your skills in measuring, naming, and understanding angle relationships will serve you well in advanced geometry!",
      content: 'completion',
      interactive: false,
      hint: "You've conquered the Tower of Angles!"
    }
  ];

  const currentTutorial = tutorialSteps[currentStep];

  // Angle calculation utilities
  const calculateAngle = (vertex, point1, point2) => {
    const angle1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x);
    const angle2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x);
    let diff = angle2 - angle1;
    if (diff < 0) diff += 2 * Math.PI;
    return (diff * 180) / Math.PI;
  };

  const formatAngleName = (point1, vertex, point2) => {
    return `∠${point1}${vertex}${point2}`;
  };

  const classifyAngle = (degrees) => {
    if (degrees < 90) return 'acute';
    if (degrees === 90) return 'right';
    if (degrees < 180) return 'obtuse';
    if (degrees === 180) return 'straight';
    return 'reflex';
  };

  const getAngleColor = (degrees) => {
    if (degrees < 90) return '#4CAF50'; // Green for acute
    if (degrees === 90) return '#2196F3'; // Blue for right
    if (degrees < 180) return '#FF9800'; // Orange for obtuse
    if (degrees === 180) return '#9C27B0'; // Purple for straight
    return '#F44336'; // Red for reflex
  };

  // Interactive canvas functions
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Handle different game modes
    switch (currentTutorial.content) {
      case 'angle-naming':
        handleAngleNamingClick(scaledX, scaledY);
        break;
      case 'angle-measuring':
        handleAngleMeasuringClick(scaledX, scaledY);
        break;
      case 'angle-types':
        handleAngleTypesClick(scaledX, scaledY);
        break;
      case 'complementary-supplementary':
        handleComplementarySupplementaryClick(scaledX, scaledY);
        break;
      case 'vertical-angles':
        handleVerticalAnglesClick(scaledX, scaledY);
        break;
      case 'adjacent-angles':
        handleAdjacentAnglesClick(scaledX, scaledY);
        break;
      case 'missing-angles':
        handleMissingAnglesClick(scaledX, scaledY);
        break;
      case 'angle-challenge':
        handleAngleChallengeClick(scaledX, scaledY);
        break;
    }
  };

  // Game-specific click handlers
  const handleAngleNamingClick = (x, y) => {
    const angles = [
      { vertex: { x: 150, y: 150 }, point1: { x: 100, y: 100 }, point2: { x: 200, y: 120 }, name: 'ABC', id: 'angle1' },
      { vertex: { x: 350, y: 200 }, point1: { x: 300, y: 150 }, point2: { x: 400, y: 180 }, name: 'DEF', id: 'angle2' },
      { vertex: { x: 250, y: 300 }, point1: { x: 200, y: 250 }, point2: { x: 300, y: 280 }, name: 'GHI', id: 'angle3' }
    ];

    angles.forEach(angle => {
      const distance = Math.sqrt((x - angle.vertex.x) ** 2 + (y - angle.vertex.y) ** 2);
      if (distance < 30) {
        showAngleNamingDialog(angle);
      }
    });
  };

  const handleAngleMeasuringClick = (x, y) => {
    const measurementAngles = [
      { vertex: { x: 120, y: 150 }, angle: 45, id: 'measure1' },
      { vertex: { x: 280, y: 120 }, angle: 90, id: 'measure2' },
      { vertex: { x: 400, y: 200 }, angle: 135, id: 'measure3' },
      { vertex: { x: 200, y: 280 }, angle: 60, id: 'measure4' },
      { vertex: { x: 350, y: 320 }, angle: 120, id: 'measure5' }
    ];

    measurementAngles.forEach(angle => {
      const distance = Math.sqrt((x - angle.vertex.x) ** 2 + (y - angle.vertex.y) ** 2);
      if (distance < 25) {
        promptAngleMeasurement(angle);
      }
    });
  };

  const handleAngleTypesClick = (x, y) => {
    const typeAngles = [
      { x: 100, y: 100, degrees: 45, type: 'acute', classified: false, id: 'type1' },
      { x: 200, y: 100, degrees: 90, type: 'right', classified: false, id: 'type2' },
      { x: 300, y: 100, degrees: 120, type: 'obtuse', classified: false, id: 'type3' },
      { x: 400, y: 100, degrees: 180, type: 'straight', classified: false, id: 'type4' },
      { x: 150, y: 200, degrees: 30, type: 'acute', classified: false, id: 'type5' },
      { x: 250, y: 200, degrees: 150, type: 'obtuse', classified: false, id: 'type6' },
      { x: 350, y: 200, degrees: 60, type: 'acute', classified: false, id: 'type7' },
      { x: 200, y: 300, degrees: 90, type: 'right', classified: false, id: 'type8' }
    ];
    
    typeAngles.forEach(angle => {
      const distance = Math.sqrt((x - angle.x) ** 2 + (y - angle.y) ** 2);
      if (distance < 20) {
        if (!angle.classified) {
          setGameState(prev => ({ ...prev, selectedAngle: angle }));
          showAngleTypeOptions(angle);
        }
      }
    });
  };

  const handleComplementarySupplementaryClick = (x, y) => {
    // Handle complementary/supplementary angle pair identification
    showFeedbackMessage('Find angle pairs that add to 90° or 180°!', 'info');
  };

  const handleVerticalAnglesClick = (x, y) => {
    // Handle vertical angle identification
    showFeedbackMessage('Look for opposite angles when lines intersect!', 'info');
  };

  const handleAdjacentAnglesClick = (x, y) => {
    // Handle adjacent angle identification
    showFeedbackMessage('Find angles that share a vertex and side!', 'info');
  };

  const handleMissingAnglesClick = (x, y) => {
    // Handle missing angle problems
    showFeedbackMessage('Use angle relationships to find missing measurements!', 'info');
  };

  const handleAngleChallengeClick = (x, y) => {
    // Handle final challenge interactions
    showFeedbackMessage('Apply all your angle knowledge!', 'info');
  };

  // Helper functions
  const updateScore = (points) => {
    setGameState(prev => ({ 
      ...prev, 
      score: prev.score + points,
      correctAnswers: prev.correctAnswers + 1
    }));
  };

  const showFeedbackMessage = (message, type) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const showAngleNamingDialog = (angle) => {
    const options = [
      formatAngleName('A', 'B', 'C'),
      formatAngleName('C', 'B', 'A'),
      formatAngleName('B', 'A', 'C'),
      formatAngleName(angle.name.charAt(0), angle.name.charAt(1), angle.name.charAt(2))
    ];
    
    const userChoice = prompt(`Name this angle:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\nEnter choice number:`);
    const choiceIndex = parseInt(userChoice) - 1;
    
    if (choiceIndex >= 0 && choiceIndex < options.length) {
      const answer = options[choiceIndex];
      const correct = answer === formatAngleName(angle.name.charAt(0), angle.name.charAt(1), angle.name.charAt(2)) ||
                     answer === formatAngleName(angle.name.charAt(2), angle.name.charAt(1), angle.name.charAt(0));
      
      if (correct) {
        updateScore(10);
        showFeedbackMessage('Correct! Great angle naming! 🎯', 'success');
      } else {
        showFeedbackMessage(`Incorrect. The correct answer is ${formatAngleName(angle.name.charAt(0), angle.name.charAt(1), angle.name.charAt(2))} or ${formatAngleName(angle.name.charAt(2), angle.name.charAt(1), angle.name.charAt(0))}`, 'error');
      }
      setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
    }
  };

  const promptAngleMeasurement = (angle) => {
    const userEstimate = prompt(`Estimate the angle measurement (in degrees):`);
    const estimate = parseInt(userEstimate);
    
    if (isNaN(estimate)) {
      showFeedbackMessage('Please enter a valid number!', 'error');
      return;
    }

    const difference = Math.abs(estimate - angle.angle);
    
    if (difference <= 5) {
      updateScore(20);
      showFeedbackMessage(`Excellent! You were within 5° of the actual ${angle.angle}°! 🎯`, 'success');
    } else if (difference <= 10) {
      updateScore(10);
      showFeedbackMessage(`Good! You were within 10° of the actual ${angle.angle}°! 👍`, 'success');
    } else {
      showFeedbackMessage(`The actual angle is ${angle.angle}°. Keep practicing! 📐`, 'info');
    }

    setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
  };

  const showAngleTypeOptions = (angle) => {
    const types = ['acute', 'right', 'obtuse', 'straight'];
    const typeDescriptions = {
      acute: 'Acute (< 90°)',
      right: 'Right (= 90°)',
      obtuse: 'Obtuse (90° - 180°)',
      straight: 'Straight (= 180°)'
    };

    const userChoice = prompt(`Classify this ${angle.degrees}° angle:\n${types.map((type, i) => `${i + 1}. ${typeDescriptions[type]}`).join('\n')}\nEnter choice number:`);
    const choiceIndex = parseInt(userChoice) - 1;
    
    if (choiceIndex >= 0 && choiceIndex < types.length) {
      const selectedType = types[choiceIndex];
      
      if (selectedType === angle.type) {
        updateScore(15);
        showFeedbackMessage('Correct classification! 🎯', 'success');
      } else {
        showFeedbackMessage(`Incorrect. This ${angle.degrees}° angle is ${typeDescriptions[angle.type]}`, 'error');
      }
      setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
    }
  };

  // Enhanced canvas drawing function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background with angle-themed styling
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e0e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 25) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 25) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw based on current tutorial step
    switch (currentTutorial.content) {
      case 'introduction':
        drawIntroduction(ctx);
        break;
      case 'angle-basics':
        drawAngleBasics(ctx);
        break;
      case 'angle-naming':
        drawAngleNaming(ctx);
        break;
      case 'angle-measuring':
        drawAngleMeasuring(ctx);
        break;
      case 'angle-types':
        drawAngleTypes(ctx);
        break;
      case 'angle-construction':
        drawAngleConstruction(ctx);
        break;
      case 'complementary-supplementary':
        drawComplementarySupplementary(ctx);
        break;
      case 'vertical-angles':
        drawVerticalAngles(ctx);
        break;
      case 'adjacent-angles':
        drawAdjacentAngles(ctx);
        break;
      case 'angle-bisector':
        drawAngleBisector(ctx);
        break;
      case 'missing-angles':
        drawMissingAngles(ctx);
        break;
      case 'angle-challenge':
        drawAngleChallenge(ctx);
        break;
      case 'completion':
        drawCompletion(ctx);
        break;
      default:
        break;
    }
  };

  // Individual drawing functions
  const drawIntroduction = (ctx) => {
    const centerX = 250;
    const centerY = 200;
    const time = Date.now() * 0.002;

    // Draw animated protractor
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI, false);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw degree markings
    for (let i = 0; i <= 180; i += 15) {
      const angle = (i * Math.PI) / 180;
      const innerRadius = 70;
      const outerRadius = i % 30 === 0 ? 85 : 80;
      
      const x1 = centerX + innerRadius * Math.cos(Math.PI - angle);
      const y1 = centerY + innerRadius * Math.sin(Math.PI - angle);
      const x2 = centerX + outerRadius * Math.cos(Math.PI - angle);
      const y2 = centerY + outerRadius * Math.sin(Math.PI - angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#1976D2';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (i % 30 === 0) {
        ctx.fillStyle = '#1976D2';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), x2 + 10 * Math.cos(Math.PI - angle), y2 + 10 * Math.sin(Math.PI - angle) + 4);
      }
    }

    // Animated angle measurement
    const animatedAngle = 45 + 30 * Math.sin(time);
    const rayAngle = (animatedAngle * Math.PI) / 180;
    const rayEndX = centerX + 60 * Math.cos(Math.PI - rayAngle);
    const rayEndY = centerY + 60 * Math.sin(Math.PI - rayAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 60, centerY);
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(rayEndX, rayEndY);
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Display angle measurement
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(centerX - 30, centerY - 30, 60, 25);
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - 30, centerY - 30, 60, 25);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(animatedAngle)}°`, centerX, centerY - 10);

    // Welcome message
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to the Tower of Angles!', centerX, 350);
    ctx.font = '16px Arial';
    ctx.fillText('Master the art of angular geometry', centerX, 375);
    ctx.textAlign = 'left';
  };

  const drawAngleBasics = (ctx) => {
    const vertex = { x: 250, y: 200 };
    const ray1End = interactivePoints.length > 0 ? interactivePoints[0] : { x: 380, y: 150, id: 'ray1End' };
    const ray2End = interactivePoints.length > 1 ? interactivePoints[1] : { x: 120, y: 120, id: 'ray2End' };

    // Calculate angle
    const angle1 = Math.atan2(ray1End.y - vertex.y, ray1End.x - vertex.x);
    const angle2 = Math.atan2(ray2End.y - vertex.y, ray2End.x - vertex.x);
    let angleDiff = angle1 - angle2;
    if (angleDiff < 0) angleDiff += 2 * Math.PI;
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
    const angleDegrees = angleDiff * (180 / Math.PI);

    // Draw rays
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 4;
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
    ctx.arc(vertex.x, vertex.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Draw angle arc
    const arcRadius = 60;
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, arcRadius, Math.min(angle1, angle2), Math.max(angle1, angle2));
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Display measurement
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(angleDegrees)}°`, vertex.x, vertex.y - 80);

    // Labels
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Vertex', vertex.x, vertex.y + 35);
    ctx.fillText('Ray 1', ray1End.x + 15, ray1End.y);
    ctx.fillText('Ray 2', ray2End.x - 25, ray2End.y);

    ctx.textAlign = 'left';

    // Set up interactive points
    if (interactivePoints.length < 2) {
      setInteractivePoints([ray1End, ray2End]);
    }
  };

  const drawAngleNaming = (ctx) => {
    const angles = [
      { vertex: { x: 150, y: 150 }, point1: { x: 100, y: 100 }, point2: { x: 200, y: 120 }, name: 'ABC' },
      { vertex: { x: 350, y: 200 }, point1: { x: 300, y: 150 }, point2: { x: 400, y: 180 }, name: 'DEF' },
      { vertex: { x: 250, y: 300 }, point1: { x: 200, y: 250 }, point2: { x: 300, y: 280 }, name: 'GHI' }
    ];

    angles.forEach((angle, index) => {
      // Draw rays
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(angle.vertex.x, angle.vertex.y);
      ctx.lineTo(angle.point1.x, angle.point1.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(angle.vertex.x, angle.vertex.y);
      ctx.lineTo(angle.point2.x, angle.point2.y);
      ctx.stroke();

      // Draw points
      [angle.point1, angle.vertex, angle.point2].forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = i === 1 ? '#FF5722' : '#4CAF50';
        ctx.fill();
      });

      // Labels
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(angle.name.charAt(0), angle.point1.x - 15, angle.point1.y - 10);
      ctx.fillText(angle.name.charAt(1), angle.vertex.x - 8, angle.vertex.y + 25);
      ctx.fillText(angle.name.charAt(2), angle.point2.x + 10, angle.point2.y - 10);

      // Angle name
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`∠${angle.name}`, angle.vertex.x - 20, angle.vertex.y - 25);
    });

    // Instructions
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Click on angles to practice naming them!', 20, 30);
  };

  const drawAngleMeasuring = (ctx) => {
    const measurementAngles = [
      { vertex: { x: 120, y: 150 }, angle: 45, id: 'measure1' },
      { vertex: { x: 280, y: 120 }, angle: 90, id: 'measure2' },
      { vertex: { x: 400, y: 200 }, angle: 135, id: 'measure3' },
      { vertex: { x: 200, y: 280 }, angle: 60, id: 'measure4' },
      { vertex: { x: 350, y: 320 }, angle: 120, id: 'measure5' }
    ];

    measurementAngles.forEach((angle, index) => {
      const vertex = angle.vertex;
      const degrees = angle.angle;
      const ray1Angle = 0;
      const ray2Angle = (degrees * Math.PI) / 180;

      const ray1End = { x: vertex.x + 50, y: vertex.y };
      const ray2End = { x: vertex.x + 50 * Math.cos(ray2Angle), y: vertex.y - 50 * Math.sin(ray2Angle) };

      // Draw rays
      ctx.strokeStyle = getAngleColor(degrees);
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
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 30, -ray2Angle, 0);
      ctx.strokeStyle = getAngleColor(degrees);
      ctx.lineWidth = 3;
      ctx.stroke();

      // Question mark
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('?°', vertex.x, vertex.y - 45);
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Click on angles to estimate their measurements!', 20, 30);
  };

  const drawAngleTypes = (ctx) => {
    const typeAngles = [
      { x: 100, y: 100, degrees: 45, type: 'acute' },
      { x: 200, y: 100, degrees: 90, type: 'right' },
      { x: 300, y: 100, degrees: 120, type: 'obtuse' },
      { x: 400, y: 100, degrees: 180, type: 'straight' },
      { x: 150, y: 200, degrees: 30, type: 'acute' },
      { x: 250, y: 200, degrees: 150, type: 'obtuse' },
      { x: 350, y: 200, degrees: 60, type: 'acute' },
      { x: 200, y: 300, degrees: 90, type: 'right' }
    ];

    // Draw type categories
    const categories = [
      { name: 'Acute (< 90°)', x: 50, y: 350, color: '#4CAF50' },
      { name: 'Right (= 90°)', x: 150, y: 350, color: '#2196F3' },
      { name: 'Obtuse (90° - 180°)', x: 250, y: 350, color: '#FF9800' },
      { name: 'Straight (= 180°)', x: 400, y: 350, color: '#9C27B0' }
    ];

    categories.forEach(category => {
      ctx.fillStyle = category.color;
      ctx.fillRect(category.x, category.y, 80, 30);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(category.name, category.x + 40, category.y + 20);
    });

    // Draw angles
    typeAngles.forEach(angle => {
      const vertex = { x: angle.x, y: angle.y };
      const degrees = angle.degrees;
      const ray1End = { x: vertex.x + 30, y: vertex.y };
      const ray2Angle = (degrees * Math.PI) / 180;
      const ray2End = { x: vertex.x + 30 * Math.cos(ray2Angle), y: vertex.y - 30 * Math.sin(ray2Angle) };

      // Draw rays
      ctx.strokeStyle = getAngleColor(degrees);
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
      ctx.arc(vertex.x, vertex.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF5722';
      ctx.fill();

      // Show degrees
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${degrees}°`, vertex.x, vertex.y - 25);
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Drag angles to their correct type categories!', 20, 30);
  };

  const drawAngleConstruction = (ctx) => {
    const vertex = { x: 250, y: 200 };
    const fixedRay = { x: 350, y: 200 };
    const movableRay = interactivePoints.length > 0 ? interactivePoints[0] : { x: 250, y: 120, id: 'movableRay' };
    
    const angle1 = Math.atan2(fixedRay.y - vertex.y, fixedRay.x - vertex.x);
    const angle2 = Math.atan2(movableRay.y - vertex.y, movableRay.x - vertex.x);
    let angleDiff = angle1 - angle2;
    if (angleDiff < 0) angleDiff += 2 * Math.PI;
    const currentAngle = angleDiff * (180 / Math.PI);

    // Draw fixed ray
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(fixedRay.x, fixedRay.y);
    ctx.stroke();

    // Draw movable ray
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(movableRay.x, movableRay.y);
    ctx.stroke();

    // Draw vertex
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Draw movable point
    ctx.beginPath();
    ctx.arc(movableRay.x, movableRay.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#2196F3';
    ctx.fill();

    // Draw angle arc
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 50, angle2, angle1);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Display measurements
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Current: ${Math.round(currentAngle)}°`, 250, 50);
    ctx.fillText(`Target: ${gameState.targetAngle}°`, 250, 75);

    const difference = Math.abs(currentAngle - gameState.targetAngle);
    if (difference <= gameState.tolerance) {
      ctx.fillStyle = '#4CAF50';
      ctx.fillText('SUCCESS! ✓', 250, 100);
    }

    ctx.textAlign = 'left';

    if (interactivePoints.length < 1) {
      setInteractivePoints([movableRay]);
    }
  };

  const drawComplementarySupplementary = (ctx) => {
    // Draw complementary angles (add to 90°)
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Complementary Angles (Add to 90°)', 50, 50);

    const comp1 = { vertex: { x: 100, y: 100 }, angle1: 30, angle2: 60 };
    const comp2 = { vertex: { x: 250, y: 100 }, angle1: 45, angle2: 45 };

    [comp1, comp2].forEach(pair => {
      // Draw first angle
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pair.vertex.x, pair.vertex.y, 40, 0, (pair.angle1 * Math.PI) / 180);
      ctx.stroke();

      // Draw second angle
      ctx.strokeStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(pair.vertex.x, pair.vertex.y, 40, (pair.angle1 * Math.PI) / 180, (Math.PI) / 2);
      ctx.stroke();

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${pair.angle1}°`, pair.vertex.x + 15, pair.vertex.y - 15);
      ctx.fillText(`${pair.angle2}°`, pair.vertex.x - 25, pair.vertex.y - 15);
    });

    // Draw supplementary angles (add to 180°)
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Supplementary Angles (Add to 180°)', 50, 250);

    const supp1 = { vertex: { x: 100, y: 300 }, angle1: 120, angle2: 60 };
    const supp2 = { vertex: { x: 350, y: 300 }, angle1: 100, angle2: 80 };

    [supp1, supp2].forEach(pair => {
      // Draw angles
      ctx.strokeStyle = '#FF9800';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pair.vertex.x, pair.vertex.y, 40, 0, (pair.angle1 * Math.PI) / 180);
      ctx.stroke();

      ctx.strokeStyle = '#9C27B0';
      ctx.beginPath();
      ctx.arc(pair.vertex.x, pair.vertex.y, 40, (pair.angle1 * Math.PI) / 180, Math.PI);
      ctx.stroke();

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${pair.angle1}°`, pair.vertex.x + 15, pair.vertex.y - 15);
      ctx.fillText(`${pair.angle2}°`, pair.vertex.x - 35, pair.vertex.y - 15);
    });
  };

  const drawVerticalAngles = (ctx) => {
    const intersection = { x: 250, y: 200 };

    // Draw intersecting lines
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(350, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(150, 250);
    ctx.lineTo(350, 150);
    ctx.stroke();

    // Draw intersection point
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Highlight vertical angle pairs
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, 30, 0, Math.PI / 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, 30, Math.PI, Math.PI + Math.PI / 4);
    ctx.stroke();

    ctx.strokeStyle = '#FF9800';
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, 40, Math.PI / 4, 3 * Math.PI / 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, 40, 5 * Math.PI / 4, 7 * Math.PI / 4);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Vertical angles are equal!', 50, 50);
    ctx.fillStyle = '#4CAF50';
    ctx.fillText('Green angles = 45°', 50, 350);
    ctx.fillStyle = '#FF9800';
    ctx.fillText('Orange angles = 135°', 200, 350);
  };

  const drawAdjacentAngles = (ctx) => {
    const vertex = { x: 200, y: 200 };

    // Draw three rays forming adjacent angles
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(vertex.x + 100, vertex.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(vertex.x + 70, vertex.y - 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(vertex.x, vertex.y - 100);
    ctx.stroke();

    // Highlight adjacent angles
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 40, -Math.PI / 4, 0);
    ctx.stroke();

    ctx.strokeStyle = '#FF9800';
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 50, -Math.PI / 2, -Math.PI / 4);
    ctx.stroke();

    // Draw vertex
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Adjacent Angles', 50, 50);
    ctx.font = 'bold 14px Arial';
    ctx.fillText('• Share a vertex', 50, 350);
    ctx.fillText('• Share a common side', 50, 370);
    ctx.fillText('• Do not overlap', 50, 390);
  };

  const drawAngleBisector = (ctx) => {
    const vertex = { x: 250, y: 250 };
    const ray1End = { x: 150, y: 150 };
    const ray2End = { x: 350, y: 150 };
    const bisectorEnd = interactivePoints.length > 0 ? interactivePoints[0] : { x: 250, y: 150, id: 'bisector' };

    // Calculate if bisector is correct
    const angle1 = Math.atan2(ray1End.y - vertex.y, ray1End.x - vertex.x);
    const angle2 = Math.atan2(ray2End.y - vertex.y, ray2End.x - vertex.x);
    const bisectorAngle = Math.atan2(bisectorEnd.y - vertex.y, bisectorEnd.x - vertex.x);
    const correctBisectorAngle = (angle1 + angle2) / 2;

    const isCorrect = Math.abs(bisectorAngle - correctBisectorAngle) < 0.1;

    // Draw main rays
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray1End.x, ray1End.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray2End.x, ray2End.y);
    ctx.stroke();

    // Draw bisector
    ctx.strokeStyle = isCorrect ? '#4CAF50' : '#FF5722';
    ctx.lineWidth = 4;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(bisectorEnd.x, bisectorEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw vertex
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Draw draggable point
    ctx.beginPath();
    ctx.arc(bisectorEnd.x, bisectorEnd.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = isCorrect ? '#4CAF50' : '#FF5722';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(isCorrect ? 'Perfect Bisector! ✓' : 'Drag to bisect the angle', 250, 50);

    if (interactivePoints.length < 1) {
      setInteractivePoints([bisectorEnd]);
    }
  };

  const drawMissingAngles = (ctx) => {
    // Problem 1: Complementary angles
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Problem 1: If angle A = 35°, find its complement', 50, 50);

    const vertex1 = { x: 150, y: 100 };
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(vertex1.x, vertex1.y, 30, 0, (35 * Math.PI) / 180);
    ctx.stroke();

    ctx.strokeStyle = '#FF5722';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(vertex1.x, vertex1.y, 30, (35 * Math.PI) / 180, Math.PI / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('35°', vertex1.x + 15, vertex1.y - 10);
    ctx.fillText('?°', vertex1.x - 20, vertex1.y - 10);

    // Problem 2: Supplementary angles
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Problem 2: If angle B = 110°, find its supplement', 50, 200);

    const vertex2 = { x: 150, y: 250 };
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(vertex2.x, vertex2.y, 40, 0, (110 * Math.PI) / 180);
    ctx.stroke();

    ctx.strokeStyle = '#FF5722';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(vertex2.x, vertex2.y, 40, (110 * Math.PI) / 180, Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('110°', vertex2.x + 20, vertex2.y - 10);
    ctx.fillText('?°', vertex2.x - 30, vertex2.y - 10);

    // Show answers
    ctx.fillStyle = '#666';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Click to reveal answers', 300, 350);
  };

  const drawAngleChallenge = (ctx) => {
    // Challenge overview
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 ANGLE MASTER CHALLENGE 🏆', 250, 50);

    ctx.font = 'bold 14px Arial';
    ctx.fillText('Complete all tasks to become an Angle Master!', 250, 75);

    // Task checklist
    const tasks = [
      'Name 3 angles correctly',
      'Measure 5 angles within 10°',
      'Classify 4 angle types',
      'Find 2 complementary pairs',
      'Identify 2 vertical angle pairs'
    ];

    ctx.textAlign = 'left';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Challenge Tasks:', 50, 120);

    tasks.forEach((task, index) => {
      const completed = Math.random() > 0.5; // Random completion for demo
      ctx.fillStyle = completed ? '#4CAF50' : '#666';
      ctx.fillText(`${completed ? '✓' : '○'} ${task}`, 50, 140 + index * 20);
    });

    // Progress
    const progress = 3; // Example progress
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(50, 260, (progress / 5) * 200, 20);
    ctx.strokeStyle = '#1976D2';
    ctx.strokeRect(50, 260, 200, 20);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Progress: ${progress}/5 tasks completed`, 50, 300);

    if (progress === 5) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 CHALLENGE COMPLETE! 🎉', 250, 350);
      ctx.fillText('You are now an ANGLE MASTER!', 250, 375);
    }
  };

  const drawCompletion = (ctx) => {
    const centerX = 250;
    const centerY = 200;

    // Central trophy/medal
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, 60, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Trophy details
    ctx.fillStyle = '#FF6F00';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆', centerX, centerY - 10);

    // Completion message
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 Congratulations! You are now an Angle Master! 🎉', centerX, 50);

    // Achievement badges
    const badges = ['Angle Namer', 'Angle Measurer', 'Type Classifier', 'Relationship Expert'];
    badges.forEach((badge, index) => {
      const x = 50 + (index * 100);
      const y = 320;
      
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(x, y, 90, 30);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(badge, x + 45, y + 20);
    });

    ctx.textAlign = 'left';
  };

  // Mouse interaction handlers
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

    // Handle construction and bisector mode dragging
    if (currentTutorial.content === 'angle-construction' || 
        currentTutorial.content === 'angle-bisector' ||
        currentTutorial.content === 'angle-basics') {
      
      interactivePoints.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        if (distance < 20) {
          setDraggedPoint(point.id);
        }
      });
    }
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (draggedPoint) {
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

  // Navigation and control functions
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCharacterSide(tutorialSteps[currentStep + 1].characterSide);
      setInteractivePoints([]);
      setGameState(prev => ({ ...prev, selectedAngle: null }));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCharacterSide(tutorialSteps[currentStep - 1].characterSide);
      setInteractivePoints([]);
      setGameState(prev => ({ ...prev, selectedAngle: null }));
    }
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setInteractivePoints([]);
    setGameState({
      score: 0,
      attempts: 0,
      correctAnswers: 0,
      currentAnswer: '',
      selectedAngle: null,
      matchedPairs: [],
      constructedAngle: 0,
      targetAngle: 90,
      tolerance: 5
    });
    setShowFeedback(false);
    setFeedbackMessage('');
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Effect hooks
  useEffect(() => {
    setInteractivePoints([]);
    setDraggedPoint(null);
    
    const timer = setTimeout(() => {
      drawCanvas();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    drawCanvas();
  }, [currentTutorial, interactivePoints, gameState, draggedPoint]);

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
                      onClick={resetTutorial}
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

// Helper function to check if point is near another point
const isPointNear = (point1, point2, threshold = 20) => {
  const distance = Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  return distance < threshold;
};

// Helper function to generate random angle problems
const generateAngleProblem = () => {
  const problemTypes = ['complementary', 'supplementary', 'vertical', 'linear'];
  const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
  
  switch (type) {
    case 'complementary':
      const angle1 = Math.floor(Math.random() * 80) + 10; // 10-89 degrees
      return {
        type: 'complementary',
        given: angle1,
        answer: 90 - angle1,
        question: `If one angle is ${angle1}°, what is its complement?`
      };
    
    case 'supplementary':
      const angle2 = Math.floor(Math.random() * 160) + 20; // 20-179 degrees
      return {
        type: 'supplementary',
        given: angle2,
        answer: 180 - angle2,
        question: `If one angle is ${angle2}°, what is its supplement?`
      };
    
    case 'vertical':
      const angle3 = Math.floor(Math.random() * 170) + 10;
      return {
        type: 'vertical',
        given: angle3,
        answer: angle3,
        question: `If one vertical angle is ${angle3}°, what is its opposite angle?`
      };
    
    case 'linear':
      const angle4 = Math.floor(Math.random() * 120) + 30;
      const angle5 = Math.floor(Math.random() * (180 - angle4 - 10)) + 10;
      const answer = 180 - angle4 - angle5;
      return {
        type: 'linear',
        given: `${angle4}° and ${angle5}°`,
        answer: answer,
        question: `Three angles on a line measure ${angle4}°, ${angle5}°, and ?°. What is the missing angle?`
      };
  }
};

// Helper function to check angle relationships
const checkAngleRelationship = (angle1, angle2, type) => {
  switch (type) {
    case 'complementary':
      return Math.abs((angle1 + angle2) - 90) < 2;
    case 'supplementary':
      return Math.abs((angle1 + angle2) - 180) < 2;
    case 'vertical':
      return Math.abs(angle1 - angle2) < 2;
    default:
      return false;
  }
};

// Helper function to format degrees
const formatDegrees = (degrees) => {
  return `${Math.round(degrees)}°`;
};

// Helper function to create angle arc path
const createAngleArc = (ctx, vertex, startAngle, endAngle, radius, clockwise = false) => {
  ctx.beginPath();
  if (clockwise) {
    ctx.arc(vertex.x, vertex.y, radius, startAngle, endAngle, false);
  } else {
    ctx.arc(vertex.x, vertex.y, radius, startAngle, endAngle, true);
  }
  return ctx;
};

// Helper function to draw arrow
const drawArrow = (ctx, fromX, fromY, toX, toY, arrowLength = 10) => {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Draw main line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  
  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowLength * Math.cos(angle - Math.PI / 6),
    toY - arrowLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowLength * Math.cos(angle + Math.PI / 6),
    toY - arrowLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};

// Helper function to draw text with background
const drawTextWithBackground = (ctx, text, x, y, backgroundColor = 'rgba(255, 255, 255, 0.9)', textColor = '#2C1810') => {
  const metrics = ctx.measureText(text);
  const padding = 8;
  const backgroundWidth = metrics.width + (padding * 2);
  const backgroundHeight = 20;
  
  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.roundRect(x - padding, y - 15, backgroundWidth, backgroundHeight, 5);
  ctx.fill();
  
  // Draw border
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Draw text
  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
};

// Helper function to animate elements
const animateElement = (element, property, targetValue, duration = 300) => {
  const startValue = element[property];
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    
    element[property] = startValue + (targetValue - startValue) * easedProgress;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
};

// Helper function to check if angle is within tolerance
const isAngleWithinTolerance = (actual, target, tolerance = 5) => {
  return Math.abs(actual - target) <= tolerance;
};

// Helper function to get next angle in sequence
const getNextTargetAngle = () => {
  const commonAngles = [30, 45, 60, 90, 120, 135, 150];
  return commonAngles[Math.floor(Math.random() * commonAngles.length)];
};

// Helper function to calculate distance between two points
const calculateDistance = (point1, point2) => {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
};

// Helper function to normalize angle to 0-360 range
const normalizeAngle = (angle) => {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
};

// Helper function to convert radians to degrees
const radToDeg = (radians) => {
  return (radians * 180) / Math.PI;
};

// Helper function to convert degrees to radians
const degToRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

// Animation frame handler
let animationFrameId;

const startAnimation = () => {
  const animate = () => {
    if (currentTutorial.content === 'introduction' || 
        currentTutorial.content === 'angle-basics' ||
        currentTutorial.content === 'completion') {
      drawCanvas();
    }
       animationFrameId = requestAnimationFrame(animate);
  };
  animate();
};

const stopAnimation = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// Effect for starting/stopping animations
useEffect(() => {
  startAnimation();
  return () => stopAnimation();
}, [currentTutorial.content]);

// Effect for handling window resize
useEffect(() => {
  const handleResize = () => {
    // Redraw canvas on resize
    setTimeout(drawCanvas, 100);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Effect for keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        if (currentStep > 0) {
          event.preventDefault();
          prevStep();
        }
        break;
      case 'ArrowRight':
        if (currentStep < tutorialSteps.length - 1) {
          event.preventDefault();
          nextStep();
        }
        break;
      case 'h':
      case 'H':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          toggleHint();
        }
        break;
      case 'r':
      case 'R':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          resetTutorial();
        }
        break;
      case 'Escape':
        if (showFeedback) {
          setShowFeedback(false);
        }
        break;
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [currentStep, showFeedback, tutorialSteps.length]);

// Effect for auto-progression on certain achievements
useEffect(() => {
  if (gameState.score > 0 && gameState.score % 100 === 0) {
    showFeedbackMessage(`🎉 Milestone reached! ${gameState.score} points!`, 'success');
  }
}, [gameState.score]);

// Effect for updating character side based on tutorial step
useEffect(() => {
  setCharacterSide(currentTutorial.characterSide || 'right');
}, [currentStep, currentTutorial.characterSide]);

// Clean up on unmount
useEffect(() => {
  return () => {
    stopAnimation();
    setInteractivePoints([]);
    setDraggedPoint(null);
  };
}, []);

};

export default AngleMasteryTutorial;