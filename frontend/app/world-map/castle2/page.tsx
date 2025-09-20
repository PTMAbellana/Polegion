"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Home, RotateCcw, Target, Award, Zap } from 'lucide-react';
import styles from '@/styles/castle.module.css';

const AngleMasteryTutorial = () => {
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
      id: 'angle-naming-intro',
      title: 'Naming Angles - The Three-Point Method',
      characterSide: 'left',
      dialogue: "Every angle has a proper name! We name angles using three points: the vertex (middle point) and one point on each ray. The vertex always goes in the middle. Let's practice naming angles correctly!",
      content: 'angle-naming',
      interactive: true,
      instruction: 'Click on the angles to practice naming them',
      hint: "Remember: Point-Vertex-Point naming convention!"
    },
    {
      id: 'angle-measuring-game',
      title: 'Angle Measurement Challenge',
      characterSide: 'right',
      dialogue: "Time to become a master measurer! Use your protractor skills to estimate these angles. Remember: acute (0°-90°), right (90°), obtuse (90°-180°), and straight (180°)!",
      content: 'angle-measuring',
      interactive: true,
      instruction: 'Estimate the angle measurements and click to submit',
      goal: 5,
      hint: "Look at the angle opening to estimate its size!"
    },
    {
      id: 'angle-types-identifier',
      title: 'Angle Types Detective',
      characterSide: 'left',
      dialogue: "Become an angle detective! Your mission: identify and classify different types of angles. Drag each angle to its correct category. Sharp eyes and quick thinking will help you succeed!",
      content: 'angle-types',
      interactive: true,
      instruction: 'Drag angles to their correct type categories',
      goal: 8,
      hint: "Acute < 90°, Right = 90°, Obtuse > 90° but < 180°"
    },
    {
      id: 'angle-constructor',
      title: 'Angle Construction Master',
      characterSide: 'right',
      dialogue: "Now you'll become an angle architect! Construct specific angles by dragging the rays to match the target measurement. Precision is key - get within 5° of the target!",
      content: 'angle-construction',
      interactive: true,
      instruction: 'Construct the target angle by dragging the ray',
      hint: "Watch the measurement display as you drag!"
    },
    {
      id: 'congruent-angles-matcher',
      title: 'Congruent Angles Memory Match',
      characterSide: 'left',
      dialogue: "Congruent angles have exactly the same measure! Find and match pairs of congruent angles in this memory-style game. Look carefully - some angles might look different but have the same measurement!",
      content: 'congruent-matching',
      interactive: true,
      instruction: 'Click pairs of congruent angles to match them',
      goal: 6,
      hint: "Congruent angles have identical measurements!"
    },
    {
      id: 'complementary-supplementary-intro',
      title: 'Angle Relationships - Partners in Crime',
      characterSide: 'right',
      dialogue: "Some angles are best friends! Complementary angles add up to 90°, while supplementary angles add up to 180°. These relationships are everywhere in geometry!",
      content: 'complementary-supplementary',
      interactive: true,
      instruction: 'Identify complementary and supplementary angle pairs',
      hint: "Complementary = 90°, Supplementary = 180°"
    },
    {
      id: 'missing-angle-solver',
      title: 'Missing Angle Detective',
      characterSide: 'left',
      dialogue: "Time for some angle algebra! When you know the relationship between angles, you can solve for missing measurements. Use your knowledge of complementary, supplementary, and other relationships!",
      content: 'missing-angle',
      interactive: true,
      instruction: 'Solve for the missing angle measurements',
      goal: 4,
      hint: "Use angle relationships: complementary, supplementary, or vertical angles!"
    },
    {
      id: 'word-problems-challenge',
      title: 'Real-World Angle Problems',
      characterSide: 'right',
      dialogue: "Mathematics comes alive in the real world! Solve these word problems involving angles. From architecture to navigation, angles are everywhere around us!",
      content: 'word-problems',
      interactive: true,
      instruction: 'Read carefully and solve the angle word problems',
      goal: 3,
      hint: "Break down the problem step by step!"
    },
    {
      id: 'angle-master-final',
      title: 'Angle Master Challenge',
      characterSide: 'left',
      dialogue: "The ultimate test! Combine all your angle knowledge in this final challenge. Name, measure, construct, and solve - prove you're a true Angle Master!",
      content: 'final-challenge',
      interactive: true,
      instruction: 'Complete all angle challenges to become an Angle Master',
      hint: "Use everything you've learned!"
    },
    {
      id: 'completion-castle2',
      title: 'Congratulations, Angle Master!',
      characterSide: 'right',
      dialogue: "Outstanding work! You've mastered the mysteries of angles and earned the title of Angle Master! Your skills in measuring, naming, and understanding angle relationships will serve you well in advanced geometry. The mathematical world salutes you!",
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
      case 'congruent-matching':
        handleCongruentMatchingClick(scaledX, scaledY);
        break;
      case 'complementary-supplementary':
        handleComplementarySupplementaryClick(scaledX, scaledY);
        break;
      case 'missing-angle':
        handleMissingAngleClick(scaledX, scaledY);
        break;
      case 'word-problems':
        handleWordProblemsClick(scaledX, scaledY);
        break;
      case 'final-challenge':
        handleFinalChallengeClick(scaledX, scaledY);
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
    // Handle angle type classification game
    const typeAngles = generateAngleTypesData();
    
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

  const handleCongruentMatchingClick = (x, y) => {
    // Handle congruent angle matching game
    const congruentAngles = generateCongruentAnglesData();
    
    congruentAngles.forEach(angle => {
      const distance = Math.sqrt((x - angle.x) ** 2 + (y - angle.y) ** 2);
      if (distance < 20 && !angle.matched) {
        selectAngleForMatching(angle);
      }
    });
  };

  const handleComplementarySupplementaryClick = (x, y) => {
    // Handle complementary/supplementary relationships
    const relationshipAngles = generateRelationshipAnglesData();
    
    relationshipAngles.forEach(anglePair => {
      anglePair.angles.forEach(angle => {
        const distance = Math.sqrt((x - angle.x) ** 2 + (y - angle.y) ** 2);
        if (distance < 20) {
          checkAngleRelationship(anglePair);
        }
      });
    });
  };

  const handleMissingAngleClick = (x, y) => {
    // Handle missing angle solver
    const missingAngleProblems = generateMissingAngleData();
    
    missingAngleProblems.forEach(problem => {
      const distance = Math.sqrt((x - problem.clickArea.x) ** 2 + (y - problem.clickArea.y) ** 2);
      if (distance < 30) {
        promptMissingAngleSolution(problem);
      }
    });
  };

  const handleWordProblemsClick = (x, y) => {
    // Handle word problems
    const problemAreas = [
      { x: 150, y: 100, width: 200, height: 80, problemId: 'problem1' },
      { x: 150, y: 200, width: 200, height: 80, problemId: 'problem2' },
      { x: 150, y: 300, width: 200, height: 80, problemId: 'problem3' }
    ];

    problemAreas.forEach(area => {
      if (x >= area.x && x <= area.x + area.width && 
          y >= area.y && y <= area.y + area.height) {
        showWordProblem(area.problemId);
      }
    });
  };

  const handleFinalChallengeClick = (x, y) => {
    // Handle final challenge - combination of all skills
    handleMultiSkillChallenge(x, y);
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

    // Handle construction mode dragging
    if (currentTutorial.content === 'angle-construction') {
      const constructionPoints = getConstructionPoints();
      constructionPoints.forEach(point => {
        const distance = Math.sqrt((scaledX - point.x) ** 2 + (scaledY - point.y) ** 2);
        if (distance < 15 && point.draggable) {
          setDraggedPoint(point.id);
          canvas.style.cursor = 'grabbing';
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

    if (draggedPoint && currentTutorial.content === 'angle-construction') {
      // Update construction angle
      updateConstructionAngle(scaledX, scaledY);
    }
  };

  const handleMouseUp = () => {
    if (draggedPoint) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = 'default';
      }
      
      // Check if constructed angle meets target
      if (currentTutorial.content === 'angle-construction') {
        checkConstructionAccuracy();
      }
    }
    setDraggedPoint(null);
  };

  // Helper functions for game data generation
  const generateAngleTypesData = () => {
    return [
      { x: 100, y: 100, degrees: 45, type: 'acute', classified: false, id: 'type1' },
      { x: 200, y: 100, degrees: 90, type: 'right', classified: false, id: 'type2' },
      { x: 300, y: 100, degrees: 120, type: 'obtuse', classified: false, id: 'type3' },
      { x: 400, y: 100, degrees: 180, type: 'straight', classified: false, id: 'type4' },
      { x: 150, y: 200, degrees: 30, type: 'acute', classified: false, id: 'type5' },
      { x: 250, y: 200, degrees: 150, type: 'obtuse', classified: false, id: 'type6' },
      { x: 350, y: 200, degrees: 60, type: 'acute', classified: false, id: 'type7' },
      { x: 200, y: 300, degrees: 90, type: 'right', classified: false, id: 'type8' }
    ];
  };

  const generateCongruentAnglesData = () => {
    return [
      { x: 100, y: 150, degrees: 45, pair: 'A', matched: false, id: 'cong1' },
      { x: 350, y: 200, degrees: 45, pair: 'A', matched: false, id: 'cong2' },
      { x: 200, y: 100, degrees: 90, pair: 'B', matched: false, id: 'cong3' },
      { x: 400, y: 300, degrees: 90, pair: 'B', matched: false, id: 'cong4' },
      { x: 150, y: 300, degrees: 60, pair: 'C', matched: false, id: 'cong5' },
      { x: 300, y: 150, degrees: 60, pair: 'C', matched: false, id: 'cong6' }
    ];
  };

  const generateRelationshipAnglesData = () => {
    return [
      {
        type: 'complementary',
        angles: [
          { x: 150, y: 150, degrees: 30, id: 'comp1a' },
          { x: 200, y: 150, degrees: 60, id: 'comp1b' }
        ],
        identified: false
      },
      {
        type: 'supplementary',
        angles: [
          { x: 300, y: 200, degrees: 120, id: 'supp1a' },
          { x: 350, y: 200, degrees: 60, id: 'supp1b' }
        ],
        identified: false
      }
    ];
  };

  const generateMissingAngleData = () => {
    return [
      {
        type: 'complementary',
        knownAngle: 35,
        missingAngle: 55,
        clickArea: { x: 150, y: 150 },
        solved: false,
        id: 'missing1'
      },
      {
        type: 'supplementary',
        knownAngle: 110,
        missingAngle: 70,
        clickArea: { x: 300, y: 200 },
        solved: false,
        id: 'missing2'
      },
      {
        type: 'triangle',
        knownAngles: [60, 70],
        missingAngle: 50,
        clickArea: { x: 250, y: 300 },
        solved: false,
        id: 'missing3'
      },
      {
        type: 'linear-pair',
        knownAngle: 145,
        missingAngle: 35,
        clickArea: { x: 400, y: 150 },
        solved: false,
        id: 'missing4'
      }
    ];
  };

  const getConstructionPoints = () => {
    return [
      { x: 250, y: 200, id: 'vertex', draggable: false },
      { x: 350, y: 200, id: 'ray1-end', draggable: false },
      { x: 300, y: 150, id: 'ray2-end', draggable: true }
    ];
  };

  // Angle naming dialog - enhanced with animations and sounds
  const showAngleNamingDialog = (angle) => {
    const options = [
      formatAngleName('A', 'B', 'C'),
      formatAngleName('C', 'B', 'A'),
      formatAngleName('B', 'A', 'C'),
      formatAngleName(angle.name.charAt(0), angle.name.charAt(1), angle.name.charAt(2))
    ];
    
    promptUserChoice(`Name this angle:`, options, (answer) => {
      const correct = answer === formatAngleName(angle.name.charAt(0), angle.name.charAt(1), angle.name.charAt(2)) ||
                     answer === formatAngleName(angle.name.charAt(2), angle.name.charAt(1), angle.name.charAt(0));
      
      if (correct) {
        updateScore(10);
        showFeedbackMessage('Correct! Great angle naming! 🎯', 'success');
      } else {
        showFeedbackMessage(`Incorrect. The correct answer is ${formatAngleName(angle.name.charAt(0), angle.name.charAt(1), angle.name.charAt(2))} or ${formatAngleName(angle.name.charAt(2), angle.name.charAt(1), angle.name.charAt(0))}`, 'error');
      }
    });
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

    promptUserChoice(`Classify this ${angle.degrees}° angle:`, 
      types.map(type => typeDescriptions[type]), 
      (answer) => {
        const selectedType = types.find(type => typeDescriptions[type] === answer);
        
        if (selectedType === angle.type) {
          updateScore(15);
          showFeedbackMessage('Correct classification! 🎯', 'success');
          markAngleAsClassified(angle.id);
        } else {
          showFeedbackMessage(`Incorrect. This ${angle.degrees}° angle is ${typeDescriptions[angle.type]}`, 'error');
        }
      });
  };

  const selectAngleForMatching = (angle) => {
    const currentSelection = gameState.selectedAngle;
    
    if (!currentSelection) {
      setGameState(prev => ({ ...prev, selectedAngle: angle }));
      showFeedbackMessage('First angle selected. Choose another to match!', 'info');
    } else {
      if (currentSelection.pair === angle.pair && currentSelection.id !== angle.id) {
        // Correct match!
        updateScore(25);
        showFeedbackMessage('Perfect match! These angles are congruent! 🎉', 'success');
        markAnglesAsMatched([currentSelection.id, angle.id]);
        setGameState(prev => ({ 
          ...prev, 
          selectedAngle: null,
          matchedPairs: [...prev.matchedPairs, currentSelection.pair]
        }));
      } else {
        showFeedbackMessage('These angles are not congruent. Try again!', 'error');
        setGameState(prev => ({ ...prev, selectedAngle: null }));
      }
    }
  };

  const checkAngleRelationship = (anglePair) => {
    const sum = anglePair.angles[0].degrees + anglePair.angles[1].degrees;
    
    if (anglePair.type === 'complementary' && sum === 90) {
      updateScore(20);
      showFeedbackMessage(`Correct! ${anglePair.angles[0].degrees}° + ${anglePair.angles[1].degrees}° = 90° (Complementary)`, 'success');
    } else if (anglePair.type === 'supplementary' && sum === 180) {
      updateScore(20);
      showFeedbackMessage(`Correct! ${anglePair.angles[0].degrees}° + ${anglePair.angles[1].degrees}° = 180° (Supplementary)`, 'success');
    } else {
      showFeedbackMessage(`These angles sum to ${sum}°. Look for the correct relationship!`, 'info');
    }
  };

  const promptMissingAngleSolution = (problem) => {
    let promptText = '';
    
    switch (problem.type) {
      case 'complementary':
        promptText = `If two angles are complementary and one measures ${problem.knownAngle}°, what is the other angle?`;
        break;
      case 'supplementary':
        promptText = `If two angles are supplementary and one measures ${problem.knownAngle}°, what is the other angle?`;
        break;
      case 'triangle':
        promptText = `In a triangle, two angles measure ${problem.knownAngles[0]}° and ${problem.knownAngles[1]}°. What is the third angle?`;
        break;
      case 'linear-pair':
        promptText = `Two angles form a linear pair. If one measures ${problem.knownAngle}°, what is the other angle?`;
        break;
    }

    const userAnswer = prompt(promptText);
    const answer = parseInt(userAnswer);
    
    if (answer === problem.missingAngle) {
      updateScore(30);
      showFeedbackMessage('Excellent problem solving! 🧮', 'success');
      markProblemAsSolved(problem.id);
    } else {
      showFeedbackMessage(`Incorrect. The answer is ${problem.missingAngle}°. Remember the angle relationships!`, 'error');
    }
  };

  const showWordProblem = (problemId) => {
    const problems = {
      problem1: {
        text: "A ladder is leaning against a wall. The ladder makes a 70° angle with the ground. What angle does the ladder make with the wall?",
        answer: 20,
        explanation: "The ladder, wall, and ground form a right triangle. 90° - 70° = 20°"
      },
      problem2: {
        text: "Two roads intersect forming four angles. If one angle measures 55°, what do the other three angles measure?",
        answer: "55°, 125°, 125°",
        explanation: "Vertical angles are equal (55°, 55°) and adjacent angles are supplementary (125°, 125°)"
      },
      problem3: {
        text: "In a triangular garden, one corner is 90° and another is 35°. What is the third corner?",
        answer: 55,
        explanation: "Angles in a triangle sum to 180°. 180° - 90° - 35° = 55°"
      }
    };

    const problem = problems[problemId];
    const userAnswer = prompt(problem.text);
    
    // Simple validation - in a real app, you'd want more sophisticated checking
    if (userAnswer && (userAnswer.includes(problem.answer.toString()) || userAnswer === problem.answer.toString())) {
      updateScore(40);
      showFeedbackMessage(`Correct! ${problem.explanation} 🏆`, 'success');
    } else {
      showFeedbackMessage(`Incorrect. ${problem.explanation}`, 'info');
    }
  };

  const updateConstructionAngle = (x, y) => {
    const vertex = { x: 250, y: 200 };
    const ray1End = { x: 350, y: 200 };
    const ray2End = { x, y };
    
    const constructedAngle = calculateAngle(vertex, ray1End, ray2End);
    setGameState(prev => ({ ...prev, constructedAngle }));
    
    // Update the draggable point position
    setInteractivePoints(prev => 
      prev.map(point => 
        point.id === 'ray2-end' ? { ...point, x, y } : point
      )
    );
  };

  const checkConstructionAccuracy = () => {
    const difference = Math.abs(gameState.constructedAngle - gameState.targetAngle);
    
    if (difference <= gameState.tolerance) {
      updateScore(50);
      showFeedbackMessage(`Perfect construction! You built a ${Math.round(gameState.constructedAngle)}° angle! 🎯`, 'success');
      generateNewTargetAngle();
    } else {
      showFeedbackMessage(`Close! You built ${Math.round(gameState.constructedAngle)}°, target was ${gameState.targetAngle}°. Try again!`, 'info');
    }
  };

  const generateNewTargetAngle = () => {
    const newTarget = Math.floor(Math.random() * 160) + 10; // 10° to 170°
    setGameState(prev => ({ ...prev, targetAngle: newTarget }));
  };

  const handleMultiSkillChallenge = (x, y) => {
    // Complex challenge combining all skills
    // This would implement a comprehensive final test
    showFeedbackMessage('Final challenge activated! Show your mastery! 🏆', 'info');
  };

  // Utility functions
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

  const markAngleAsClassified = (angleId) => {
    // Mark angle as classified in game state
    setInteractivePoints(prev => 
      prev.map(point => 
        point.id === angleId ? { ...point, classified: true } : point
      )
    );
  };

  const markAnglesAsMatched = (angleIds) => {
    // Mark angles as matched
    setInteractivePoints(prev => 
      prev.map(point => 
        angleIds.includes(point.id) ? { ...point, matched: true } : point
      )
    );
  };

  const markProblemAsSolved = (problemId) => {
    // Mark problem as solved
    setGameState(prev => ({ 
      ...prev, 
      [`${problemId}_solved`]: true 
    }));
  };

  const promptUserChoice = (question, options, callback) => {
    // In a real implementation, you'd use a modal or custom component
    // For now, using simple prompt
    const optionsText = options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
    const userChoice = prompt(`${question}\n${optionsText}\nEnter choice number:`);
    
    const choiceIndex = parseInt(userChoice) - 1;
    if (choiceIndex >= 0 && choiceIndex < options.length) {
      callback(options[choiceIndex]);
    }
  };

  // Canvas drawing function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background with angle-themed styling
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid with angle-themed colors
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
      case 'congruent-matching':
        drawCongruentMatching(ctx);
        break;
      case 'complementary-supplementary':
        drawComplementarySupplementary(ctx);
        break;
      case 'missing-angle':
        drawMissingAngle(ctx);
        break;
      case 'word-problems':
        drawWordProblems(ctx);
        break;
      case 'final-challenge':
        drawFinalChallenge(ctx);
        break;
      case 'completion':
        drawCompletion(ctx);
        break;
      default:
        break;
    }
  };

  // Individual drawing functions for each game mode
  const drawIntroduction = (ctx) => {
    // Welcome animation with rotating protractor
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

  const drawAngleNaming = (ctx) => {
    const angles = [
      { 
        vertex: { x: 150, y: 150, label: 'B' }, 
        point1: { x: 100, y: 100, label: 'A' }, 
        point2: { x: 200, y: 120, label: 'C' }, 
        id: 'angle1',
        clicked: interactivePoints.some(p => p.id === 'angle1')
      },
      { 
        vertex: { x: 350, y: 200, label: 'E' }, 
        point1: { x: 300, y: 150, label: 'D' }, 
        point2: { x: 400, y: 180, label: 'F' }, 
        id: 'angle2',
        clicked: interactivePoints.some(p => p.id === 'angle2')
      },
      { 
        vertex: { x: 250, y: 300, label: 'H' }, 
        point1: { x: 200, y: 250, label: 'G' }, 
        point2: { x: 300, y: 280, label: 'I' }, 
        id: 'angle3',
        clicked: interactivePoints.some(p => p.id === 'angle3')
      }
    ];

    angles.forEach(angle => {
      const angleColor = angle.clicked ? '#4CAF50' : '#2196F3';
      const degrees = calculateAngle(angle.vertex, angle.point1, angle.point2);

      // Draw rays
      ctx.beginPath();
      ctx.moveTo(angle.vertex.x, angle.vertex.y);
      ctx.lineTo(angle.point1.x, angle.point1.y);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(angle.vertex.x, angle.vertex.y);
      ctx.lineTo(angle.point2.x, angle.point2.y);
      ctx.stroke();

      // Draw angle arc
      const angle1 = Math.atan2(angle.point1.y - angle.vertex.y, angle.point1.x - angle.vertex.x);
      const angle2 = Math.atan2(angle.point2.y - angle.vertex.y, angle.point2.x - angle.vertex.x);
      
      ctx.beginPath();
      ctx.arc(angle.vertex.x, angle.vertex.y, 30, angle1, angle2);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points with labels
      [angle.point1, angle.vertex, angle.point2].forEach(point => {
        // Point circle
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = angleColor;
        ctx.fill();
        ctx.strokeStyle = '#1976D2';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#2C1810';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.label, point.x, point.y - 15);
      });

      // Click area indicator
      if (!angle.clicked) {
        const time = Date.now() * 0.005;
        const pulseRadius = 25 + Math.sin(time) * 5;
        ctx.beginPath();
        ctx.arc(angle.vertex.x, angle.vertex.y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `${angleColor}60`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Show angle name if clicked
      if (angle.clicked) {
        const nameX = angle.vertex.x;
        const nameY = angle.vertex.y + 50;
        
        ctx.fillStyle = 'rgba(76, 175, 80, 0.9)';
        ctx.fillRect(nameX - 40, nameY - 15, 80, 25);
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.strokeRect(nameX - 40, nameY - 15, 80, 25);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`∠${angle.point1.label}${angle.vertex.label}${angle.point2.label}`, nameX, nameY - 2);
      }
    });

    ctx.textAlign = 'left';

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 480, 60);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 480, 60);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('🎯 Click on angles to practice naming them!', 20, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Remember: Angles are named using three points (Point-Vertex-Point)', 20, 55);
  };

  const drawAngleMeasuring = (ctx) => {
    const measurementAngles = [
      { vertex: { x: 120, y: 150 }, angle: 45, id: 'measure1', measured: gameState[`measure1_measured`] },
      { vertex: { x: 280, y: 120 }, angle: 90, id: 'measure2', measured: gameState[`measure2_measured`] },
      { vertex: { x: 400, y: 200 }, angle: 135, id: 'measure3', measured: gameState[`measure3_measured`] },
      { vertex: { x: 200, y: 280 }, angle: 60, id: 'measure4', measured: gameState[`measure4_measured`] },
      { vertex: { x: 350, y: 320 }, angle: 120, id: 'measure5', measured: gameState[`measure5_measured`] }
    ];

    measurementAngles.forEach((angleData, index) => {
      const { vertex, angle: actualAngle, measured } = angleData;
      const angleColor = getAngleColor(actualAngle);
      
      // Calculate ray endpoints
      const ray1End = { x: vertex.x + 50, y: vertex.y };
      const angleRad = (actualAngle * Math.PI) / 180;
      const ray2End = { 
        x: vertex.x + 50 * Math.cos(angleRad), 
        y: vertex.y - 50 * Math.sin(angleRad) 
      };

      // Draw rays
      ctx.beginPath();
      ctx.moveTo(vertex.x, vertex.y);
      ctx.lineTo(ray1End.x, ray1End.y);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(vertex.x, vertex.y);
      ctx.lineTo(ray2End.x, ray2End.y);
      ctx.stroke();

      // Draw angle arc
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 35, 0, angleRad, false);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw vertex point
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = measured ? '#4CAF50' : '#FF5722';
      ctx.fill();
      ctx.strokeStyle = measured ? '#388E3C' : '#D84315';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulsing effect for unmeasured angles
      if (!measured) {
        const time = Date.now() * 0.004;
        const pulseRadius = 20 + Math.sin(time + index) * 3;
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `${angleColor}50`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Show measurement if already measured
      if (measured) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.9)';
        ctx.fillRect(vertex.x - 25, vertex.y - 40, 50, 25);
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.strokeRect(vertex.x - 25, vertex.y - 40, 50, 25);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${actualAngle}°`, vertex.x, vertex.y - 25);
      }

      // Label
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${index + 1}`, vertex.x, vertex.y + 30);
    });

    ctx.textAlign = 'left';

    // Score display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 80);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🎯 Measurement Challenge', 20, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(`Score: ${gameState.score}`, 20, 55);
    ctx.fillText(`Attempts: ${gameState.attempts}`, 20, 75);

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('📐 Click on the numbered angles to estimate their measurements', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('• Acute angles: 0° - 90°  • Right angles: 90°  • Obtuse angles: 90° - 180°', 20, 360);
    ctx.fillText('• Get within 5° for excellent, within 10° for good!', 20, 375);
  };

  const drawAngleTypes = (ctx) => {
    const typeAngles = generateAngleTypesData();
    
    // Draw category boxes
    const categories = [
      { name: 'Acute (< 90°)', x: 50, y: 50, width: 100, height: 60, color: '#4CAF50' },
      { name: 'Right (= 90°)', x: 170, y: 50, width: 100, height: 60, color: '#2196F3' },
      { name: 'Obtuse (90°-180°)', x: 290, y: 50, width: 100, height: 60, color: '#FF9800' },
      { name: 'Straight (= 180°)', x: 410, y: 50, width: 100, height: 60, color: '#9C27B0' }
    ];

    categories.forEach(category => {
      ctx.fillStyle = `${category.color}30`;
      ctx.fillRect(category.x, category.y, category.width, category.height);
      ctx.strokeStyle = category.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(category.x, category.y, category.width, category.height);

      ctx.fillStyle = category.color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(category.name.split(' ')[0], category.x + category.width/2, category.y + 20);
      ctx.font = '10px Arial';
      ctx.fillText(category.name.split(' ')[1] || '', category.x + category.width/2, category.y + 35);
    });

    // Draw angles to classify
    typeAngles.forEach(angleData => {
      const { x, y, degrees, type, classified } = angleData;
      const angleColor = classified ? '#4CAF50' : getAngleColor(degrees);
      
      // Calculate ray endpoints
      const ray1End = { x: x + 30, y: y };
      const angleRad = (degrees * Math.PI) / 180;
      const ray2End = { 
        x: x + 30 * Math.cos(angleRad), 
        y: y - 30 * Math.sin(angleRad) 
      };

      // Draw rays
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ray1End.x, ray1End.y);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ray2End.x, ray2End.y);
      ctx.stroke();

      // Draw angle arc
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, angleRad, false);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw vertex point
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = classified ? '#4CAF50' : '#FF5722';
      ctx.fill();
      ctx.strokeStyle = classified ? '#388E3C' : '#D84315';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Show degree measurement
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(x - 15, y + 25, 30, 20);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 15, y + 25, 30, 20);

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${degrees}°`, x, y + 38);

      // Success checkmark if classified
      if (classified) {
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('✓', x + 20, y - 5);
      }
    });

    ctx.textAlign = 'left';

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🕵️ Click on each angle to classify it into the correct type!', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Look at the degree measurement and the visual opening to determine the type', 20, 360);
    ctx.fillText(`Progress: ${typeAngles.filter(a => a.classified).length}/${typeAngles.length} classified`, 20, 375);
  };

  const drawAngleConstruction = (ctx) => {
    const vertex = { x: 250, y: 200 };
    const ray1End = { x: 350, y: 200 };
    const ray2End = interactivePoints.find(p => p.id === 'ray2-end') || { x: 300, y: 150 };
    
    // Calculate current angle
    const currentAngle = calculateAngle(vertex, ray1End, ray2End);
    const targetAngle = gameState.targetAngle;
    const difference = Math.abs(currentAngle - targetAngle);
    
    const constructionColor = difference <= gameState.tolerance ? '#4CAF50' : '#FF9800';

    // Draw fixed ray (horizontal)
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray1End.x, ray1End.y);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw draggable ray
    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(ray2End.x, ray2End.y);
    ctx.strokeStyle = constructionColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw angle arc
    const angle1 = Math.atan2(ray1End.y - vertex.y, ray1End.x - vertex.x);
    const angle2 = Math.atan2(ray2End.y - vertex.y, ray2End.x - vertex.x);
    
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 50, angle1, angle2, angle2 < angle1);
    ctx.strokeStyle = constructionColor;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw vertex
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw draggable point with enhanced visual feedback
    const pointColor = draggedPoint === 'ray2-end' ? '#FF5722' : constructionColor;
    ctx.beginPath();
    ctx.arc(ray2End.x, ray2End.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = pointColor;
    ctx.fill();
    ctx.strokeStyle = difference <= gameState.tolerance ? '#388E3C' : '#F57C00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Drag indicator
    if (draggedPoint !== 'ray2-end') {
      const time = Date.now() * 0.005;
      const pulseRadius = 20 + Math.sin(time) * 3;
      ctx.beginPath();
      ctx.arc(ray2End.x, ray2End.y, pulseRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = `${constructionColor}60`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Target display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 220, 100);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 220, 100);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🎯 Angle Construction', 20, 35);
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Target: ${targetAngle}°`, 20, 60);
    ctx.fillText(`Current: ${Math.round(currentAngle)}°`, 20, 80);
    
    // Accuracy indicator
    ctx.fillStyle = difference <= gameState.tolerance ? '#4CAF50' : '#FF9800';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Difference: ${Math.round(difference)}°`, 20, 100);

    // Success message
    if (difference <= gameState.tolerance) {
      ctx.fillStyle = 'rgba(76, 175, 80, 0.9)';
      ctx.fillRect(250, 10, 240, 60);
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.strokeRect(250, 10, 240, 60);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 Perfect Construction!', 370, 35);
      ctx.font = '14px Arial';
      ctx.fillText('Click to get a new target angle', 370, 55);
    }

    ctx.textAlign = 'left';

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🔧 Drag the orange endpoint to construct the target angle!', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('• The blue ray is fixed (0° reference)', 20, 360);
    ctx.fillText(`• Get within ${gameState.tolerance}° of the target for a perfect score!`, 20, 375);
  };

  const drawCongruentMatching = (ctx) => {
    const congruentAngles = generateCongruentAnglesData();
    const selectedAngle = gameState.selectedAngle;

    congruentAngles.forEach(angleData => {
      const { x, y, degrees, pair, matched, id } = angleData;
      
      let angleColor = getAngleColor(degrees);
      if (matched) angleColor = '#4CAF50';
      else if (selectedAngle && selectedAngle.id === id) angleColor = '#FF5722';
      else if (selectedAngle && selectedAngle.pair === pair) angleColor = '#FFC107';

      // Calculate ray endpoints
      const ray1End = { x: x + 35, y: y };
      const angleRad = (degrees * Math.PI) / 180;
      const ray2End = { 
        x: x + 35 * Math.cos(angleRad), 
        y: y - 35 * Math.sin(angleRad) 
      };

      // Draw rays
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ray1End.x, ray1End.y);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ray2End.x, ray2End.y);
      ctx.stroke();

      // Draw angle arc
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, angleRad, false);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw vertex point with enhanced visual feedback
      ctx.beginPath();
      ctx.arc(x, y, matched ? 12 : 10, 0, 2 * Math.PI);
      ctx.fillStyle = angleColor;
      ctx.fill();
      ctx.strokeStyle = matched ? '#388E3C' : '#D84315';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Show degree measurement
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(x - 15, y + 35, 30, 20);
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 15, y + 35, 30, 20);

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${degrees}°`, x, y + 48);

      // Selection indicator
      if (selectedAngle && selectedAngle.id === id) {
        const time = Date.now() * 0.006;
        const pulseRadius = 18 + Math.sin(time) * 3;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Match indicator
      if (matched) {
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✓', x + 25, y - 5);
      }

      // Pair indicator for potential matches
      if (selectedAngle && selectedAngle.pair === pair && selectedAngle.id !== id && !matched) {
        ctx.fillStyle = '#FFC107';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', x + 25, y - 5);
      }
    });

    ctx.textAlign = 'left';

    // Score and progress display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 250, 80);
    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 250, 80);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🧩 Congruent Angle Matching', 20, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(`Matched Pairs: ${gameState.matchedPairs.length}/3`, 20, 55);
    ctx.fillText(`Score: ${gameState.score}`, 20, 75);

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🎮 Click on angles to select them, then click another to match!', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('• Congruent angles have exactly the same measurement', 20, 360);
    ctx.fillText('• Selected angle glows red, potential matches glow yellow', 20, 375);

    if (selectedAngle) {
      ctx.fillStyle = '#FF5722';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`Selected: ${selectedAngle.degrees}° angle - Find its match!`, 350, 360);
    }
  };

  const drawComplementarySupplementary = (ctx) => {
    const relationshipData = generateRelationshipAnglesData();

    relationshipData.forEach((pair, pairIndex) => {
      const { type, angles, identified } = pair;
      const pairColor = type === 'complementary' ? '#4CAF50' : '#2196F3';
      const displayColor = identified ? '#4CAF50' : pairColor;

      angles.forEach((angleData, angleIndex) => {
        const { x, y, degrees } = angleData;
        
        // Calculate ray endpoints
        const ray1End = { x: x + 40, y: y };
        const angleRad = (degrees * Math.PI) / 180;
        const ray2End = { 
          x: x + 40 * Math.cos(angleRad), 
          y: y - 40 * Math.sin(angleRad) 
        };

        // Draw rays
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ray1End.x, ray1End.y);
        ctx.strokeStyle = displayColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ray2End.x, ray2End.y);
        ctx.stroke();

        // Draw angle arc
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, angleRad, false);
        ctx.strokeStyle = displayColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw vertex
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = displayColor;
        ctx.fill();
        ctx.strokeStyle = identified ? '#388E3C' : displayColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Show degree measurement
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(x - 20, y + 40, 40, 20);
        ctx.strokeStyle = displayColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 20, y + 40, 40, 20);

        ctx.fillStyle = '#2C1810';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${degrees}°`, x, y + 53);
      });

      // Draw connection line between related angles
      if (angles.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(angles[0].x, angles[0].y);
        ctx.lineTo(angles[1].x, angles[1].y);
        ctx.strokeStyle = `${displayColor}40`;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Show relationship label
      if (angles.length >= 2) {
        const midX = (angles[0].x + angles[1].x) / 2;
        const midY = (angles[0].y + angles[1].y) / 2 - 20;
        const sum = angles[0].degrees + angles[1].degrees;

        ctx.fillStyle = identified ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(midX - 60, midY - 15, 120, 30);
        ctx.strokeStyle = displayColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(midX - 60, midY - 15, 120, 30);

        ctx.fillStyle = identified ? 'white' : '#2C1810';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${angles[0].degrees}° + ${angles[1].degrees}° = ${sum}°`, midX, midY - 5);
        ctx.font = '10px Arial';
        ctx.fillText(type.charAt(0).toUpperCase() + type.slice(1), midX, midY + 8);

        if (identified) {
          ctx.fillStyle = '#4CAF50';
          ctx.font = 'bold 16px Arial';
          ctx.fillText('✓', midX + 70, midY);
        }
      }
    });

    ctx.textAlign = 'left';

    // Information panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 300, 100);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 300, 100);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('📐 Angle Relationships', 20, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4CAF50';
    ctx.fillText('• Complementary: Sum = 90°', 20, 55);
    ctx.fillStyle = '#2196F3';
    ctx.fillText('• Supplementary: Sum = 180°', 20, 75);
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 95);

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🔍 Click on angle pairs to identify their relationship!', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('• Look at the sum of the two connected angles', 20, 360);
    ctx.fillText('• Complementary pairs sum to 90°, Supplementary pairs sum to 180°', 20, 375);
  };

  const drawMissingAngle = (ctx) => {
    const problems = generateMissingAngleData();

    problems.forEach((problem, index) => {
      const { type, knownAngle, knownAngles, missingAngle, clickArea, solved } = problem;
      const problemColor = solved ? '#4CAF50' : '#FF9800';
      
      let displayText = '';
      let subText = '';
      
      switch (type) {
        case 'complementary':
          displayText = `${knownAngle}° + ? = 90°`;
          subText = 'Complementary Angles';
          break;
        case 'supplementary':
          displayText = `${knownAngle}° + ? = 180°`;
          subText = 'Supplementary Angles';
          break;
        case 'triangle':
          displayText = `${knownAngles[0]}° + ${knownAngles[1]}° + ? = 180°`;
          subText = 'Triangle Angle Sum';
          break;
        case 'linear-pair':
          displayText = `${knownAngle}° + ? = 180°`;
          subText = 'Linear Pair';
          break;
      }

      // Draw problem box
      const boxWidth = 200;
      const boxHeight = 80;
      
      ctx.fillStyle = solved ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)';
      ctx.fillRect(clickArea.x - boxWidth/2, clickArea.y - boxHeight/2, boxWidth, boxHeight);
      ctx.strokeStyle = problemColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(clickArea.x - boxWidth/2, clickArea.y - boxHeight/2, boxWidth, boxHeight);

      // Problem text
      ctx.fillStyle = problemColor;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(displayText, clickArea.x, clickArea.y - 10);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(subText, clickArea.x, clickArea.y + 10);

      // Problem number
      ctx.fillStyle = problemColor;
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`Problem ${index + 1}`, clickArea.x, clickArea.y - 30);

      // Solution display if solved
      if (solved) {
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`✓ ${missingAngle}°`, clickArea.x, clickArea.y + 30);
      } else {
        // Click indicator
        const time = Date.now() * 0.005;
        const pulseRadius = 15 + Math.sin(time + index) * 3;
        ctx.beginPath();
        ctx.arc(clickArea.x, clickArea.y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `${problemColor}60`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Visual representation based on problem type
      if (type === 'triangle') {
        // Draw triangle outline
        const triangleSize = 30;
        const tx = clickArea.x;
        const ty = clickArea.y + 50;
        
        ctx.beginPath();
        ctx.moveTo(tx, ty - triangleSize);
        ctx.lineTo(tx - triangleSize, ty + triangleSize);
        ctx.lineTo(tx + triangleSize, ty + triangleSize);
        ctx.closePath();
        ctx.strokeStyle = problemColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.textAlign = 'left';

    // Score display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 80);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🧮 Missing Angles', 20, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    const solvedCount = problems.filter(p => p.solved).length;
    ctx.fillText(`Solved: ${solvedCount}/${problems.length}`, 20, 55);
    ctx.fillText(`Score: ${gameState.score}`, 20, 75);

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('🎯 Click on each problem to solve for the missing angle!', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('• Use angle relationships: complementary (90°), supplementary (180°)', 20, 360);
    ctx.fillText('• Triangle angles always sum to 180°', 20, 375);
  };

  const drawWordProblems = (ctx) => {
    const problemAreas = [
      { 
        x: 50, y: 80, width: 400, height: 80, 
        problemId: 'problem1',
        title: 'Ladder Problem',
        preview: 'A ladder makes a 70° angle with the ground...',
        solved: gameState['problem1_solved']
      },
      { 
        x: 50, y: 180, width: 400, height: 80, 
        problemId: 'problem2',
        title: 'Intersecting Roads',
        preview: 'Two roads intersect forming four angles...',
        solved: gameState['problem2_solved']
      },
      { 
        x: 50, y: 280, width: 400, height: 80, 
        problemId: 'problem3',
        title: 'Triangular Garden',
        preview: 'A triangular garden has corners of 90° and 35°...',
        solved: gameState['problem3_solved']
      }
    ];

    problemAreas.forEach((area, index) => {
      const problemColor = area.solved ? '#4CAF50' : '#2196F3';
      
      // Draw problem card
      ctx.fillStyle = area.solved ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)';
      ctx.fillRect(area.x, area.y, area.width, area.height);
      ctx.strokeStyle = problemColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(area.x, area.y, area.width, area.height);

      // Problem title
      ctx.fillStyle = problemColor;
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`${index + 1}. ${area.title}`, area.x + 15, area.y + 25);

      // Problem preview
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.fillText(area.preview, area.x + 15, area.y + 50);

      // Status indicator
      if (area.solved) {
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('✓ SOLVED', area.x + area.width - 100, area.y + 35);
      } else {
        ctx.fillStyle = '#FF9800';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Click to solve →', area.x + area.width - 120, area.y + 35);
        
        // Pulse effect for unsolved problems
        const time = Date.now() * 0.003;
        const pulseRadius = 10 + Math.sin(time + index) * 3;
        ctx.beginPath();
        ctx.arc(area.x + area.width - 80, area.y + 35, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `${problemColor}60`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.textAlign = 'left';

    // Instructions panel for word problems
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 320, 480, 70);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 320, 480, 70);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('📖 Solve these real-world problems involving angles', 20, 340);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('• Read each problem carefully', 20, 360);
    ctx.fillText('• Think about the angle relationships involved', 20, 375);
  };

  const drawFinalChallenge = (ctx) => {
    // Multi-skill challenge combining all angle concepts
    const challengeElements = [
      {
        type: 'name',
        vertex: { x: 150, y: 100, label: 'B' },
        point1: { x: 100, y: 50, label: 'A' },
        point2: { x: 200, y: 80, label: 'C' },
        completed: gameState['final_naming_completed']
      },
      {
        type: 'measure',
        x: 350, y: 120,
        angle: 75,
        completed: gameState['final_measuring_completed']
      },
      {
        type: 'construct',
        target: 60,
        x: 200, y: 250,
        completed: gameState['final_construction_completed']
      },
      {
        type: 'solve',
        problem: 'Complementary: 35° + ? = 90°',
        answer: 55,
        x: 400, y: 280,
        completed: gameState['final_solving_completed']
      }
    ];

    // Challenge progress tracker
    const completedTasks = challengeElements.filter(el => el.completed).length;
    const totalTasks = challengeElements.length;

    // Header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 480, 100);
    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 480, 100);

    ctx.fillStyle = '#9C27B0';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 ANGLE MASTER FINAL CHALLENGE', 250, 40);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#2C1810';
    ctx.fillText(`Progress: ${completedTasks}/${totalTasks} Tasks Completed`, 250, 65);
    
    // Progress bar
    const progressWidth = 400;
    const progressHeight = 20;
    const progressX = 50;
    const progressY = 75;
    
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(progressX, progressY, (progressWidth * completedTasks) / totalTasks, progressHeight);
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.strokeRect(progressX, progressY, progressWidth, progressHeight);

    challengeElements.forEach((element, index) => {
      const taskColor = element.completed ? '#4CAF50' : '#FF9800';
      
      switch (element.type) {
        case 'name':
          // Draw angle naming task
          const { vertex, point1, point2 } = element;
          const degrees = calculateAngle(vertex, point1, point2);

          // Draw rays
          ctx.beginPath();
          ctx.moveTo(vertex.x, vertex.y);
          ctx.lineTo(point1.x, point1.y);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(vertex.x, vertex.y);
          ctx.lineTo(point2.x, point2.y);
          ctx.stroke();

          // Draw points with labels
          [point1, vertex, point2].forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = taskColor;
            ctx.fill();
            ctx.strokeStyle = '#1976D2';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#2C1810';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(point.label, point.x, point.y - 15);
          });

          // Task label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(vertex.x - 40, vertex.y + 30, 80, 25);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(vertex.x - 40, vertex.y + 30, 80, 25);

          ctx.fillStyle = taskColor;
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Task 1: NAME', vertex.x, vertex.y + 47);
          
          if (element.completed) {
            ctx.fillStyle = '#4CAF50';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('✓', vertex.x + 50, vertex.y + 10);
          }
          break;

        case 'measure':
          // Draw angle measuring task
          const { x, y, angle } = element;
          const ray1End = { x: x + 40, y: y };
          const angleRad = (angle * Math.PI) / 180;
          const ray2End = { 
            x: x + 40 * Math.cos(angleRad), 
            y: y - 40 * Math.sin(angleRad) 
          };

          // Draw rays
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ray1End.x, ray1End.y);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ray2End.x, ray2End.y);
          ctx.stroke();

          // Draw angle arc
          ctx.beginPath();
          ctx.arc(x, y, 25, 0, angleRad, false);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw vertex
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = taskColor;
          ctx.fill();

          // Task label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(x - 40, y + 35, 80, 25);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 40, y + 35, 80, 25);

          ctx.fillStyle = taskColor;
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Task 2: MEASURE', x, y + 52);

          if (element.completed) {
            ctx.fillStyle = '#4CAF50';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('✓', x + 50, y + 10);
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`${angle}°`, x, y - 15);
          }
          break;

        case 'construct':
          // Draw angle construction task
          const constructX = element.x;
          const constructY = element.y;
          const targetAngle = element.target;

          // Draw construction base
          ctx.beginPath();
          ctx.moveTo(constructX, constructY);
          ctx.lineTo(constructX + 50, constructY);
          ctx.strokeStyle = '#2196F3';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw target angle indicator
          const targetRad = (targetAngle * Math.PI) / 180;
          ctx.beginPath();
          ctx.arc(constructX, constructY, 35, 0, targetRad, false);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw vertex
          ctx.beginPath();
          ctx.arc(constructX, constructY, 8, 0, 2 * Math.PI);
          ctx.fillStyle = taskColor;
          ctx.fill();

          // Task label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(constructX - 50, constructY + 35, 100, 25);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(constructX - 50, constructY + 35, 100, 25);

          ctx.fillStyle = taskColor;
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Task 3: BUILD ${targetAngle}°`, constructX, constructY + 52);

          if (element.completed) {
            ctx.fillStyle = '#4CAF50';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('✓', constructX + 60, constructY + 10);
          }
          break;

        case 'solve':
          // Draw problem solving task
          const solveX = element.x;
          const solveY = element.y;

          // Problem box
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(solveX - 80, solveY - 30, 160, 60);
          ctx.strokeStyle = taskColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(solveX - 80, solveY - 30, 160, 60);

          ctx.fillStyle = taskColor;
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Task 4: SOLVE', solveX, solveY - 15);
          ctx.font = '11px Arial';
          ctx.fillText(element.problem, solveX, solveY);

          if (element.completed) {
            ctx.fillStyle = '#4CAF50';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`✓ Answer: ${element.answer}°`, solveX, solveY + 15);
          }
          break;
      }
    });

    ctx.textAlign = 'left';

    // Completion celebration
    if (completedTasks === totalTasks) {
      // Fireworks effect
      const time = Date.now() * 0.01;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6 + time;
        const distance = 50 + Math.sin(time * 2 + i) * 20;
        const sparkleX = 250 + Math.cos(angle) * distance;
        const sparkleY = 200 + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${(time * 50 + i * 60) % 360}, 70%, 60%)`;
        ctx.fill();
      }

      // Victory message
      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.fillRect(150, 180, 200, 60);
      ctx.strokeStyle = '#FF9800';
      ctx.lineWidth = 3;
      ctx.strokeRect(150, 180, 200, 60);

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 ANGLE MASTER! 🎉', 250, 205);
      ctx.font = '14px Arial';
      ctx.fillText('All tasks completed!', 250, 225);
    } else {
      // Instructions for remaining tasks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(10, 320, 480, 70);
      ctx.strokeStyle = '#9C27B0';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 320, 480, 70);

      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('🎯 Complete all 4 tasks to become an Angle Master!', 20, 340);
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText('• Click on angles to name them  • Estimate measurements  • Construct angles  • Solve problems', 20, 360);
      ctx.fillText(`Tasks remaining: ${totalTasks - completedTasks}`, 20, 375);
    }
  };

  const drawCompletion = (ctx) => {
    // Graduation celebration scene
    const centerX = 250;
    const centerY = 200;
    const time = Date.now() * 0.003;

    // Animated background elements
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + time;
      const distance = 100 + Math.sin(time * 2 + i) * 30;
      const elementX = centerX + Math.cos(angle) * distance;
      const elementY = centerY + Math.sin(angle) * distance;
      
      // Floating geometric symbols
      const symbols = ['∠', '°', '📐', '✓', '🎯', '⭐'];
      const symbol = symbols[i % symbols.length];
      
      ctx.fillStyle = `hsl(${(time * 30 + i * 30) % 360}, 60%, 50%)`;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.globalAlpha = 0.7 + Math.sin(time * 3 + i) * 0.3;
      ctx.fillText(symbol, elementX, elementY);
      ctx.restore();
    }

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

    // Angle Master title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(centerX - 120, centerY + 60, 240, 80);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX - 120, centerY + 60, 240, 80);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ANGLE MASTER', centerX, centerY + 85);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Certified Geometry Expert', centerX, centerY + 110);
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#FF9800';
    ctx.fillText(`Final Score: ${gameState.score}`, centerX, centerY + 130);

    // Achievement badges
    const achievements = [
      { name: 'Angle Namer', icon: '📝', x: centerX - 150, y: centerY + 180 },
      { name: 'Protractor Pro', icon: '📐', x: centerX - 50, y: centerY + 180 },
      { name: 'Constructor', icon: '🔧', x: centerX + 50, y: centerY + 180 },
      { name: 'Problem Solver', icon: '🧮', x: centerX + 150, y: centerY + 180 }
    ];

    achievements.forEach((achievement, index) => {
      // Badge background
      ctx.beginPath();
      ctx.arc(achievement.x, achievement.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();
      ctx.strokeStyle = '#388E3C';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Badge icon
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(achievement.icon, achievement.x, achievement.y + 5);

      // Badge name
      ctx.fillStyle = '#2C1810';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(achievement.name, achievement.x, achievement.y + 45);
    });

    // Celebration message
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 Congratulations! You have mastered the art of angles! 🎉', centerX, 50);

    // Stats summary
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 200, 120);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 120);

    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('📊 Your Journey:', 20, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(`✓ Total Score: ${gameState.score}`, 20, 55);
    ctx.fillText(`✓ Correct Answers: ${gameState.correctAnswers}`, 20, 75);
    ctx.fillText(`✓ Total Attempts: ${gameState.attempts}`, 20, 95);
    
    const accuracy = gameState.attempts > 0 ? Math.round((gameState.correctAnswers / gameState.attempts) * 100) : 0;
    ctx.fillText(`✓ Accuracy: ${accuracy}%`, 20, 115);

    ctx.textAlign = 'center';
  };

  // Navigation and control functions
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInteractivePoints([]);
      setGameState(prev => ({ ...prev, selectedAngle: null }));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

  // Effect hooks for initialization and updates
  useEffect(() => {
    setInteractivePoints([]);
    setDraggedPoint(null);
    
    const timer = setTimeout(() => {
      // Initialize points for specific steps
      if (currentTutorial.content === 'angle-construction') {
        setInteractivePoints(getConstructionPoints());
      }
      
      drawCanvas();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    drawCanvas();
  }, [currentTutorial, interactivePoints, gameState, draggedPoint]);

  // Animation loop for dynamic effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTutorial.content === 'introduction' || 
          currentTutorial.content === 'angle-construction' ||
          currentTutorial.content === 'congruent-matching' ||
          currentTutorial.content === 'missing-angle' ||
          currentTutorial.content === 'final-challenge' ||
          currentTutorial.content === 'completion') {
        drawCanvas();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentTutorial.content, interactivePoints, gameState]);

  // Event listeners setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentTutorial, draggedPoint]);

  // Main component render using Castle 1 layout structure
  return (
    <div className={styles.castleContainer}>
      {/* Header - same as Castle 1 */}
      <div className={styles.castleHeader}>
        <h1 className={styles.castleTitle}>
          🏰 Castle 2: Tower of Angles
        </h1>
        <div className={styles.castleProgressInfo}>
          <div className={styles.castleProgressLabel}>Step</div>
          <div className={styles.castleProgressNumbers}>
            {currentStep + 1}/{tutorialSteps.length}
          </div>
        </div>
      </div>

      {/* Progress bar - same as Castle 1 */}
      <div className={styles.castleProgressContainer}>
        <div className={styles.castleProgressBar}>
          <div 
            className={styles.castleProgressFill} 
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          ></div>
        </div>
        <div className={styles.castleProgressText}>
          Progress: {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
        </div>
      </div>

      {/* Main content area - same layout as Castle 1 */}
      <div className={styles.castleMainContent}>
        
        {/* Left side - Character and info */}
        <div className={styles.castleLeftPanel}>
          {showCharacter && (
            <div className={styles.castleCharacter}>
              <div className={styles.castleCharacterAvatar}>
                🧙‍♂️
              </div>
              <div className={styles.castleCharacterName}>
                Master Protractor
              </div>
              <div className={styles.castleCharacterTitle}>
                Guardian of Angular Wisdom
              </div>
            </div>
          )}

          {/* Lesson info */}
          <div className={styles.castleLessonInfo}>
            <h2 className={styles.castleLessonTitle}>
              {currentTutorial.title}
              {currentTutorial.interactive && (
                <span className={styles.castleInteractiveBadge}>
                  <Zap size={14} />
                  Interactive
                </span>
              )}
            </h2>
            
            <div className={styles.castleLessonContent}>
              <p className={styles.castleDialogue}>
                {currentTutorial.dialogue}
              </p>
              
              {currentTutorial.instruction && (
                <div className={styles.castleInstruction}>
                  <Target className={styles.castleInstructionIcon} />
                  <div>
                    <strong>Your Quest:</strong>
                    <p>{currentTutorial.instruction}</p>
                  </div>
                </div>
              )}
              
              {currentTutorial.hint && showHint && (
                <div className={styles.castleHint}>
                  <span className={styles.castleHintIcon}>💡</span>
                  <div>
                    <strong>Hint:</strong>
                    <p>{currentTutorial.hint}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Score display */}
          <div className={styles.castleScorePanel}>
            <div className={styles.castleScoreItem}>
              <Award className={styles.castleScoreIcon} />
              <div>
                <div className={styles.castleScoreLabel}>Score</div>
                <div className={styles.castleScoreValue}>{gameState.score}</div>
              </div>
            </div>
            <div className={styles.castleScoreItem}>
              <Target className={styles.castleScoreIcon} />
              <div>
                <div className={styles.castleScoreLabel}>Accuracy</div>
                <div className={styles.castleScoreValue}>
                  {gameState.attempts > 0 ? Math.round((gameState.correctAnswers / gameState.attempts) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Canvas area */}
        <div className={styles.castleRightPanel}>
          <div className={styles.castleCanvasContainer}>
            <canvas 
              ref={canvasRef} 
              className={styles.castleCanvas}
              width={500}
              height={400}
            />
          </div>
        </div>
      </div>

      {/* Bottom controls - same as Castle 1 */}
      <div className={styles.castleControls}>
        <div className={styles.castleNavigationButtons}>
          <button 
            className={`${styles.castleButton} ${styles.castleButtonSecondary}`}
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className={styles.castleStepIndicator}>
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                className={`${styles.castleStepDot} ${
                  index === currentStep ? styles.castleStepDotActive : ''
                } ${index < currentStep ? styles.castleStepDotCompleted : ''}`}
                onClick={() => setCurrentStep(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className={`${styles.castleButton} ${styles.castleButtonPrimary}`}
            onClick={nextStep}
            disabled={currentStep === tutorialSteps.length - 1}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className={styles.castleActionButtons}>
          <button 
            className={`${styles.castleButton} ${styles.castleButtonSecondary}`}
            onClick={toggleHint}
          >
            💡 {showHint ? 'Hide' : 'Show'} Hint
          </button>
          
          <button 
            className={`${styles.castleButton} ${styles.castleButtonSecondary}`}
            onClick={resetTutorial}
          >
            <RotateCcw size={16} />
            Reset
          </button>
          
          <button 
            className={`${styles.castleButton} ${styles.castleButtonSecondary}`}
            onClick={() => window.location.href = '/world-map'}
          >
            <Home size={16} />
            World Map
          </button>
        </div>
      </div>

      {/* Feedback toast - same as Castle 1 */}
      {showFeedback && (
        <div className={styles.castleFeedback}>
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};

export default AngleMasteryTutorial;