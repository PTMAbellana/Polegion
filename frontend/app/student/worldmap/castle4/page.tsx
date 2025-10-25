"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from '@/styles/castle4-polygon.module.css';
import Image from 'next/image';

// Types
interface CircleProblem {
  id: string;
  type: 'circumference' | 'area' | 'word-problem';
  title: string;
  description: string;
  radius?: number;
  diameter?: number;
  circumference?: number;
  area?: number;
  question: string;
  correctAnswer: number;
  userAnswer: string;
  isCompleted: boolean;
  hint: string;
  formula: string;
  visualData?: {
    showRadius: boolean;
    showDiameter: boolean;
    showFormula: boolean;
  };
}

interface WizardDialogue {
  id: string;
  text: string;
  type: 'intro' | 'hint' | 'correct' | 'incorrect' | 'completion' | 'teaching';
  emotion: 'happy' | 'thinking' | 'excited' | 'encouraging' | 'wise';
}

interface Quest {
  id: number;
  title: string;
  description: string;
  problems: CircleProblem[];
  completed: boolean;
  category: 'circumference' | 'area' | 'word-problems';
}

export default function Castle4CircumferenceAreaAdventure() {
  const router = useRouter();
  
  // Adventure State
  const [currentQuest, setCurrentQuest] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuests] = useState(3);
  const [showWizardDialogue, setShowWizardDialogue] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<'circumference' | 'area' | null>(null);
  
  const [wizardDialogue, setWizardDialogue] = useState<WizardDialogue>({
    id: '1',
    text: "Welcome to the Measurement Sanctum, young mathematician! I am Archimedes, master of circles and measurements. Here, we shall unlock the secrets of circumference and area!",
    type: 'intro',
    emotion: 'wise'
  });

  // Circle Problems Data
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: "Circumference Mastery",
      description: "Learn to calculate the distance around circles using C = πd or C = 2πr",
      category: 'circumference',
      completed: false,
      problems: [
        {
          id: 'c1',
          type: 'circumference',
          title: 'Garden Circle',
          description: 'A circular garden has a radius of 5 meters.',
          radius: 5,
          question: 'What is the circumference of the garden? (Use π ≈ 3.14)',
          correctAnswer: 31.4,
          userAnswer: '',
          isCompleted: false,
          hint: 'Use the formula C = 2πr where r = 5',
          formula: 'C = 2πr',
          visualData: { showRadius: true, showDiameter: false, showFormula: true }
        },
        {
          id: 'c2',
          type: 'circumference',
          title: 'Wheel Diameter',
          description: 'A bicycle wheel has a diameter of 24 inches.',
          diameter: 24,
          question: 'What is the circumference of the wheel? (Use π ≈ 3.14)',
          correctAnswer: 75.36,
          userAnswer: '',
          isCompleted: false,
          hint: 'Use the formula C = πd where d = 24',
          formula: 'C = πd',
          visualData: { showRadius: false, showDiameter: true, showFormula: true }
        },
        {
          id: 'c3',
          type: 'circumference',
          title: 'Clock Face',
          description: 'A clock face has a radius of 8 cm.',
          radius: 8,
          question: 'What is the circumference of the clock? (Use π ≈ 3.14)',
          correctAnswer: 50.24,
          userAnswer: '',
          isCompleted: false,
          hint: 'Remember: C = 2πr, so multiply 2 × 3.14 × 8',
          formula: 'C = 2πr',
          visualData: { showRadius: true, showDiameter: false, showFormula: true }
        }
      ]
    },
    {
      id: 2,
      title: "Area Mastery",
      description: "Master the art of calculating circle areas using A = πr²",
      category: 'area',
      completed: false,
      problems: [
        {
          id: 'a1',
          type: 'area',
          title: 'Pizza Circle',
          description: 'A circular pizza has a radius of 6 inches.',
          radius: 6,
          question: 'What is the area of the pizza? (Use π ≈ 3.14)',
          correctAnswer: 113.04,
          userAnswer: '',
          isCompleted: false,
          hint: 'Use the formula A = πr² where r = 6, so A = 3.14 × 6²',
          formula: 'A = πr²',
          visualData: { showRadius: true, showDiameter: false, showFormula: true }
        },
        {
          id: 'a2',
          type: 'area',
          title: 'Circular Pool',
          description: 'A circular swimming pool has a diameter of 20 feet.',
          diameter: 20,
          question: 'What is the area of the pool? (Use π ≈ 3.14)',
          correctAnswer: 314,
          userAnswer: '',
          isCompleted: false,
          hint: 'First find radius: r = d/2 = 10, then A = πr² = 3.14 × 10²',
          formula: 'A = πr²',
          visualData: { showRadius: true, showDiameter: true, showFormula: true }
        },
        {
          id: 'a3',
          type: 'area',
          title: 'Circular Rug',
          description: 'A circular rug has a radius of 4 feet.',
          radius: 4,
          question: 'What is the area of the rug? (Use π ≈ 3.14)',
          correctAnswer: 50.24,
          userAnswer: '',
          isCompleted: false,
          hint: 'A = πr² = 3.14 × 4 × 4 = 3.14 × 16',
          formula: 'A = πr²',
          visualData: { showRadius: true, showDiameter: false, showFormula: true }
        }
      ]
    },
    {
      id: 3,
      title: "Word Problem Challenges",
      description: "Apply your knowledge to solve real-world circle problems",
      category: 'word-problems',
      completed: false,
      problems: [
        {
          id: 'w1',
          type: 'word-problem',
          title: 'Track Runner',
          description: 'Maria runs around a circular track with radius 50 meters.',
          radius: 50,
          question: 'How far does Maria run in one complete lap? (Use π ≈ 3.14)',
          correctAnswer: 314,
          userAnswer: '',
          isCompleted: false,
          hint: 'One lap around = circumference. Use C = 2πr',
          formula: 'C = 2πr',
          visualData: { showRadius: true, showDiameter: false, showFormula: true }
        },
        {
          id: 'w2',
          type: 'word-problem',
          title: 'Sprinkler Coverage',
          description: 'A sprinkler can water in a circle with radius 12 feet.',
          radius: 12,
          question: 'What area can the sprinkler cover? (Use π ≈ 3.14)',
          correctAnswer: 452.16,
          userAnswer: '',
          isCompleted: false,
          hint: 'Coverage area = circle area. Use A = πr²',
          formula: 'A = πr²',
          visualData: { showRadius: true, showDiameter: false, showFormula: true }
        },
        {
          id: 'w3',
          type: 'word-problem',
          title: 'Fence Around Garden',
          description: 'John wants to put a fence around his circular garden with diameter 18 feet.',
          diameter: 18,
          question: 'How much fencing does John need? (Use π ≈ 3.14)',
          correctAnswer: 56.52,
          userAnswer: '',
          isCompleted: false,
          hint: 'Fencing needed = circumference. Use C = πd',
          formula: 'C = πd',
          visualData: { showRadius: false, showDiameter: true, showFormula: true }
        }
      ]
    }
  ]);

  // Wizard Dialogues
  const wizardDialogues = {
    intro: [
      "Welcome to the Measurement Sanctum! Here we explore the mathematics of circles.",
      "I shall teach you the ancient formulas for circumference and area!",
      "Together, we will master the power of π (pi) and circle calculations!"
    ],
    teaching: {
      circumference: "The circumference is the distance around a circle. Use C = πd (with diameter) or C = 2πr (with radius).",
      area: "The area is the space inside a circle. Use A = πr² (always with radius squared).",
      pi: "π (pi) is approximately 3.14159, but we often use 3.14 for calculations."
    },
    hints: {
      circumference: "Remember: Circumference = π × diameter, or 2 × π × radius",
      area: "Remember: Area = π × radius × radius (radius squared)",
      conversion: "If you have diameter, divide by 2 to get radius. If you have radius, multiply by 2 to get diameter."
    },
    correct: [
      "Excellent calculation, young mathematician!",
      "Perfect! You've mastered that formula!",
      "Outstanding work! The circles reveal their secrets to you!",
      "Magnificent! Your measurement skills are growing!"
    ],
    incorrect: [
      "Not quite right, but don't give up! Check your calculation.",
      "Close! Remember to use the correct formula and π ≈ 3.14",
      "Almost there! Double-check your arithmetic.",
      "Keep trying! Every mistake teaches us something new!"
    ]
  };

  // Get current problem
  const getCurrentProblem = () => {
    return quests[currentQuest]?.problems[currentProblem];
  };

  // Handle answer submission
  const handleAnswerSubmit = useCallback(() => {
    const problem = getCurrentProblem();
    if (!problem || isProcessing) return;
    
    setIsProcessing(true);
    const userAnswer = parseFloat(problem.userAnswer);
    const tolerance = 0.1; // Allow small rounding differences
    
    console.log('🎯 Checking answer:', userAnswer, 'vs', problem.correctAnswer);
    
    if (Math.abs(userAnswer - problem.correctAnswer) <= tolerance) {
      console.log('✅ CORRECT!');
      
      // Mark problem as completed
      setQuests(prev => prev.map(quest => 
        quest.id === quests[currentQuest].id ? {
          ...quest,
          problems: quest.problems.map(prob => 
            prob.id === problem.id ? { ...prob, isCompleted: true } : prob
          )
        } : quest
      ));
      
      setScore(prev => prev + 1);
      
      // Show success dialogue
      setWizardDialogue({
        id: `correct-${currentQuest}-${currentProblem}`,
        text: wizardDialogues.correct[Math.floor(Math.random() * wizardDialogues.correct.length)],
        type: 'correct',
        emotion: 'excited'
      });
      
      setShowWizardDialogue(true);
      
      // Move to next problem/quest
      setTimeout(() => {
        const nextProblemIndex = currentProblem + 1;
        if (nextProblemIndex < quests[currentQuest].problems.length) {
          // Next problem in current quest
          setCurrentProblem(nextProblemIndex);
          const nextProblem = quests[currentQuest].problems[nextProblemIndex];
          setWizardDialogue({
            id: `problem-${nextProblem.id}`,
            text: `${nextProblem.title}: ${nextProblem.question}`,
            type: 'intro',
            emotion: 'thinking'
          });
        } else {
          // Mark quest as completed and move to next quest
          setQuests(prev => prev.map(quest => 
            quest.id === quests[currentQuest].id ? { ...quest, completed: true } : quest
          ));
          
          if (currentQuest < totalQuests - 1) {
            setCurrentQuest(prev => prev + 1);
            setCurrentProblem(0);
            const nextQuest = quests[currentQuest + 1];
            setWizardDialogue({
              id: `quest-${nextQuest.id}`,
              text: `${nextQuest.title}: ${nextQuest.description}`,
              type: 'intro',
              emotion: 'wise'
            });
          } else {
            // All quests completed
            setWizardDialogue({
              id: 'completion',
              text: "Congratulations! You have mastered the Measurement Sanctum! You now understand circumference, area, and can solve circle problems!",
              type: 'completion',
              emotion: 'happy'
            });
          }
        }
        setIsProcessing(false);
      }, 2500);
      
    } else {
      console.log('❌ INCORRECT');
      setWizardDialogue({
        id: `incorrect-${currentQuest}-${currentProblem}`,
        text: wizardDialogues.incorrect[Math.floor(Math.random() * wizardDialogues.incorrect.length)],
        type: 'incorrect',
        emotion: 'encouraging'
      });
      
      setShowWizardDialogue(true);
      setTimeout(() => setIsProcessing(false), 1500);
    }
  }, [currentQuest, currentProblem, quests, isProcessing]);

  // Handle answer input change
  const handleAnswerChange = (value: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === quests[currentQuest].id ? {
        ...quest,
        problems: quest.problems.map(prob => 
          prob.id === getCurrentProblem().id ? { ...prob, userAnswer: value } : prob
        )
      } : quest
    ));
  };

  // Get Hint
  const getHint = useCallback(() => {
    const problem = getCurrentProblem();
    setWizardDialogue({
      id: `hint-${problem.id}`,
      text: problem.hint,
      type: 'hint',
      emotion: 'thinking'
    });
    setShowWizardDialogue(true);
  }, [currentQuest, currentProblem, quests]);

  // Show Teaching
  const showTeaching = useCallback((topic: 'circumference' | 'area' | 'pi') => {
    setWizardDialogue({
      id: `teaching-${topic}`,
      text: wizardDialogues.teaching[topic],
      type: 'teaching',
      emotion: 'wise'
    });
    setShowWizardDialogue(true);
  }, []);

  // Navigation
  const goBack = () => {
    router.push('/world-map');
  };

  const goNext = () => {
    if (quests.every(q => q.completed)) {
      router.push('/world-map/castle5');
    }
  };

  // Initialize first quest
  useEffect(() => {
    setTimeout(() => {
      const firstProblem = quests[0].problems[0];
      setWizardDialogue({
        id: `problem-${firstProblem.id}`,
        text: `${firstProblem.title}: ${firstProblem.question}`,
        type: 'intro',
        emotion: 'thinking'
      });
    }, 3000);
  }, []);

  const currentProblemData = getCurrentProblem();

  return (
    <div className={styles.adventure_container}>
      {/* Background */}
      <div className={styles.sanctuary_background}>
        <div className={styles.sanctuary_overlay}></div>
      </div>

      {/* Header */}
      <div className={styles.adventure_header}>
        <div className={styles.castle_title}>
          <h1>🏛️ Measurement Sanctum</h1>
          <p>Mastery of Circumference and Area</p>
        </div>
        
        {/* Progress Tracker */}
        <div className={styles.progress_tracker}>
          <div className={styles.progress_scroll}>
            <h3>Learning Progress</h3>
            <div className={styles.progress_bar}>
              <div 
                className={styles.progress_fill}
                style={{ width: `${(score / (quests.reduce((sum, quest) => sum + quest.problems.length, 0))) * 100}%` }}
              />
            </div>
            <p>{score} / {quests.reduce((sum, quest) => sum + quest.problems.length, 0)} Problems Solved</p>
          </div>
        </div>
      </div>

      {/* Main Adventure Area */}
      <div className={styles.adventure_main}>
        
        {/* Circle Visualization */}
        <div className={styles.circle_area}>
          <div className={styles.measurement_circle_container}>
            <svg 
              className={styles.measurement_circle}
              viewBox="0 0 400 400"
              width="400"
              height="400"
            >
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
              
              {/* Main circle */}
              <circle
                cx="200"
                cy="200"
                r={currentProblemData ? (currentProblemData.radius ? currentProblemData.radius * 3 : (currentProblemData.diameter || 20) * 1.5) : 90}
                fill="rgba(138, 43, 226, 0.2)"
                stroke="#8A2BE2"
                strokeWidth="3"
                className={styles.main_circle}
              />
              
              {/* Center point */}
              <circle
                cx="200"
                cy="200"
                r="4"
                fill="#FF6347"
                stroke="#fff"
                strokeWidth="2"
              />
              
              {/* Radius line (if needed) */}
              {currentProblemData?.visualData?.showRadius && (
                <line
                  x1="200"
                  y1="200"
                  x2={200 + (currentProblemData.radius ? currentProblemData.radius * 3 : 90)}
                  y2="200"
                  stroke="#FF6347"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
              )}
              
              {/* Diameter line (if needed) */}
              {currentProblemData?.visualData?.showDiameter && (
                <line
                  x1={200 - (currentProblemData.radius ? currentProblemData.radius * 3 : (currentProblemData.diameter || 20) * 1.5)}
                  y1="200"
                  x2={200 + (currentProblemData.radius ? currentProblemData.radius * 3 : (currentProblemData.diameter || 20) * 1.5)}
                  y2="200"
                  stroke="#00CED1"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                  markerStart="url(#arrowhead)"
                />
              )}
              
              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#FF6347" />
                </marker>
              </defs>
              
              {/* Labels */}
              {currentProblemData?.visualData?.showRadius && (
                <text x="250" y="195" fill="#FF6347" fontSize="14" fontWeight="bold">
                  r = {currentProblemData.radius || 'r'}
                </text>
              )}
              
              {currentProblemData?.visualData?.showDiameter && (
                <text x="200" y="180" fill="#00CED1" fontSize="14" fontWeight="bold" textAnchor="middle">
                  d = {currentProblemData.diameter || (currentProblemData.radius ? currentProblemData.radius * 2 : 'd')}
                </text>
              )}
            </svg>

            {/* Formula Display */}
            {currentProblemData?.visualData?.showFormula && (
              <div className={styles.formula_display}>
                <h3>Formula:</h3>
                <p className={styles.formula_text}>{currentProblemData.formula}</p>
                {currentProblemData.type === 'circumference' && (
                  <p className={styles.formula_explanation}>
                    Where π ≈ 3.14, {currentProblemData.radius ? `r = ${currentProblemData.radius}` : `d = ${currentProblemData.diameter}`}
                  </p>
                )}
                {currentProblemData.type === 'area' && (
                  <p className={styles.formula_explanation}>
                    Where π ≈ 3.14, r = {currentProblemData.radius || (currentProblemData.diameter ? currentProblemData.diameter / 2 : 'r')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Problem Panel */}
        <div className={styles.problem_panel}>
          {/* Current Problem */}
          <div className={styles.problem_scroll}>
            <h2>🧮 Current Problem</h2>
            {currentProblemData && (
              <div className={styles.problem_details}>
                <h3>{currentProblemData.title}</h3>
                <p className={styles.problem_description}>{currentProblemData.description}</p>
                <p className={styles.problem_question}>{currentProblemData.question}</p>
                
                {/* Answer Input */}
                <div className={styles.answer_section}>
                  <label>Your Answer:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentProblemData.userAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className={styles.answer_input}
                    placeholder="Enter your answer"
                    disabled={isProcessing || currentProblemData.isCompleted}
                  />
                  <button 
                    className={styles.submit_button}
                    onClick={handleAnswerSubmit}
                    disabled={isProcessing || !currentProblemData.userAnswer || currentProblemData.isCompleted}
                  >
                    {isProcessing ? '⏳ Checking...' : '✓ Submit Answer'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className={styles.action_buttons}>
                  <button 
                    className={styles.hint_button}
                    onClick={getHint}
                    disabled={isProcessing}
                  >
                    💡 Get Hint
                  </button>
                  
                  <button 
                    className={styles.teaching_button}
                    onClick={() => showTeaching(currentProblemData.type === 'word-problem' ? 
                      (currentProblemData.formula.includes('C') ? 'circumference' : 'area') : 
                      currentProblemData.type as 'circumference' | 'area')}
                    disabled={isProcessing}
                  >
                    📚 Learn Formula
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Quest Progress */}
          <div className={styles.quest_progress}>
            <h3>📜 Quest Progress</h3>
            <div className={styles.quest_list}>
              {quests.map((quest, index) => (
                <div 
                  key={quest.id}
                  className={`${styles.quest_item} ${
                    index === currentQuest ? styles.active : 
                    quest.completed ? styles.completed : styles.upcoming
                  }`}
                >
                  <h4>{quest.title}</h4>
                  <div className={styles.problem_progress}>
                    {quest.problems.map(problem => (
                      <div 
                        key={problem.id}
                        className={`${styles.problem_dot} ${problem.isCompleted ? styles.solved : styles.unsolved}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Character */}
      <div className={styles.wizard_character}>
        <div className={styles.wizard_image}>🧙‍♂️</div>
        {showWizardDialogue && (
          <div className={styles.wizard_dialogue}>
            <button 
              className={styles.dialogue_close}
              onClick={() => setShowWizardDialogue(false)}
            >
              ✕
            </button>
            <div className={styles.dialogue_content}>
              <p>{wizardDialogue.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className={styles.navigation_controls}>
        <button 
          className={styles.nav_button}
          onClick={goBack}
        >
          ← Back to Map
        </button>
        
        {quests.every(q => q.completed) && (
          <button 
            className={styles.nav_button}
            onClick={goNext}
          >
            Next Castle →
          </button>
        )}
      </div>
    </div>
  );
}