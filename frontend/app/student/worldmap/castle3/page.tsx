"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from '@/styles/castle3-adventure.module.css';
import Image from 'next/image';

// Types
interface CirclePart {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  color: string;
  isIdentified: boolean;
}

interface WizardDialogue {
  id: string;
  text: string;
  type: 'intro' | 'hint' | 'correct' | 'incorrect' | 'completion';
  emotion: 'happy' | 'thinking' | 'excited' | 'encouraging';
}

interface Quest {
  id: number;
  title: string;
  description: string;
  targetPart: string;
  completed: boolean;
  hint: string;
}

export default function Castle3CircleAdventure() {
  const router = useRouter();
  
  // Adventure State
  const [currentQuest, setCurrentQuest] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuests] = useState(7);
  const [showWizardDialogue, setShowWizardDialogue] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wizardDialogue, setWizardDialogue] = useState<WizardDialogue>({
    id: '1',
    text: "Welcome to the Circle Sanctuary, young mathematician! I am Archimedes the Wise. Together, we shall unlock the secrets of the perfect circle!",
    type: 'intro',
    emotion: 'happy'
  });

  // Circle Parts Data
  const [circleParts, setCircleParts] = useState<CirclePart[]>([
    {
      id: 'center',
      name: 'Center',
      description: 'The point equidistant from all points on the circle',
      position: { x: 200, y: 200 }, // Fixed: Use actual SVG coordinates
      color: '#FF6B6B',
      isIdentified: false
    },
    {
      id: 'radius',
      name: 'Radius',
      description: 'A line segment from the center to any point on the circle',
      position: { x: 200, y: 120 },
      color: '#4ECDC4',
      isIdentified: false
    },
    {
      id: 'diameter',
      name: 'Diameter',
      description: 'A line segment passing through the center with endpoints on the circle',
      position: { x: 200, y: 180 },
      color: '#45B7D1',
      isIdentified: false
    },
    {
      id: 'circumference',
      name: 'Circumference',
      description: 'The perimeter or boundary of the circle',
      position: { x: 320, y: 260 },
      color: '#96CEB4',
      isIdentified: false
    },
    {
      id: 'chord',
      name: 'Chord',
      description: 'A line segment with both endpoints on the circle',
      position: { x: 200, y: 220 },
      color: '#FFEAA7',
      isIdentified: false
    },
    {
      id: 'arc',
      name: 'Arc',
      description: 'A portion of the circumference between two points',
      position: { x: 315, y: 160 },
      color: '#DDA0DD',
      isIdentified: false
    },
    {
      id: 'sector',
      name: 'Sector',
      description: 'A region bounded by two radii and an arc',
      position: { x: 260, y: 160 },
      color: '#F4A460',
      isIdentified: false
    }
  ]);

  // Quests Data
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: "Find the Heart",
      description: "Locate the center of the circle - the heart of all geometry!",
      targetPart: 'center',
      completed: false,
      hint: "Look for the point that is equally distant from all edges of the circle."
    },
    {
      id: 2,
      title: "Discover the Radius",
      description: "Find the magical line that connects the heart to the edge!",
      targetPart: 'radius',
      completed: false,
      hint: "This line starts at the center and reaches to the circle's edge."
    },
    {
      id: 3,
      title: "Uncover the Diameter",
      description: "Seek the mighty line that crosses the entire circle through its heart!",
      targetPart: 'diameter',
      completed: false,
      hint: "This is the longest possible line segment within the circle."
    },
    {
      id: 4,
      title: "Trace the Circumference",
      description: "Follow the mystical boundary that defines the circle's edge!",
      targetPart: 'circumference',
      completed: false,
      hint: "This is the curved line that forms the circle's outer boundary."
    },
    {
      id: 5,
      title: "Identify the Chord",
      description: "Find the string that connects two points on the circle's edge!",
      targetPart: 'chord',
      completed: false,
      hint: "This line has both endpoints touching the circle's circumference."
    },
    {
      id: 6,
      title: "Locate the Arc",
      description: "Discover the curved path between two points on the circumference!",
      targetPart: 'arc',
      completed: false,
      hint: "This is a portion of the circumference, like a curved bridge."
    },
    {
      id: 7,
      title: "Find the Sector",
      description: "Uncover the slice of the circle, like a piece of mystical pie!",
      targetPart: 'sector',
      completed: false,
      hint: "This region looks like a slice of pie, bounded by two radii and an arc."
    }
  ]);

  // Wizard Dialogues
  const wizardDialogues = {
    intro: [
      "Welcome to the Circle Sanctuary, young mathematician! I am Archimedes the Wise.",
      "Here, we shall explore the ancient mysteries of the perfect circle!",
      "Each quest will reveal a different part of this sacred geometric form."
    ],
    hints: {
      center: "The center is like the heart of the circle - everything revolves around it! Click on the red dot.",
      radius: "Remember, the radius is half the diameter. It's the circle's reach! Click on the teal line.",
      diameter: "The diameter is the circle's full width - it passes right through the center! Click on the blue line.",
      circumference: "The circumference is the circle's boundary - trace it with your finger! Click on the circle edge.",
      chord: "A chord is like a bridge connecting two points on the circle's edge! Click on the yellow line.",
      arc: "An arc is a curved journey along the circumference between two points! Click on the purple arc.",
      sector: "A sector is like a slice of pie - two radii with an arc between them! Click on the orange area."
    },
    correct: [
      "Excellent work, my young scholar!",
      "Brilliant! You've mastered that part!",
      "Outstanding! Your geometric knowledge grows!",
      "Magnificent! The circle reveals its secrets to you!"
    ],
    incorrect: [
      "Not quite, but don't give up! Try again!",
      "Close, but let me give you another hint!",
      "Keep trying! Every attempt makes you wiser!",
      "Almost there! Consider the definition once more!"
    ]
  };

  // ✅ FIXED: Enhanced click handler with better logic
  const handleCirclePartClick = useCallback((partId: string) => {
    if (isProcessing) return;
    
    console.log('🎯 Clicked on part:', partId);
    console.log('🎮 Current quest target:', quests[currentQuest]?.targetPart);
    
    setIsProcessing(true);
    const currentQuestData = quests[currentQuest];
    
    if (partId === currentQuestData.targetPart) {
      console.log('✅ Correct answer!');
      
      // Correct answer
      setScore(prev => prev + 1);
      
      // Update circle parts
      setCircleParts(prev => prev.map(part => 
        part.id === partId ? { ...part, isIdentified: true } : part
      ));
      
      // Update quests
      setQuests(prev => prev.map(quest => 
        quest.id === currentQuestData.id ? { ...quest, completed: true } : quest
      ));
      
      // Show success dialogue
      setWizardDialogue({
        id: `correct-${currentQuest}`,
        text: wizardDialogues.correct[Math.floor(Math.random() * wizardDialogues.correct.length)],
        type: 'correct',
        emotion: 'excited'
      });
      
      setShowWizardDialogue(true);
      
      // Move to next quest
      setTimeout(() => {
        if (currentQuest < totalQuests - 1) {
          setCurrentQuest(prev => prev + 1);
          const nextQuest = quests[currentQuest + 1];
          setWizardDialogue({
            id: `quest-${nextQuest.id}`,
            text: `${nextQuest.title}: ${nextQuest.description}`,
            type: 'intro',
            emotion: 'thinking'
          });
        } else {
          // Adventure completed
          setWizardDialogue({
            id: 'completion',
            text: "Congratulations! You have mastered all parts of the circle! The Circle Sanctuary is now yours to command!",
            type: 'completion',
            emotion: 'happy'
          });
        }
        setIsProcessing(false);
      }, 2000);
      
    } else {
      console.log('❌ Incorrect answer');
      // Incorrect answer
      setWizardDialogue({
        id: `incorrect-${currentQuest}`,
        text: wizardDialogues.incorrect[Math.floor(Math.random() * wizardDialogues.incorrect.length)],
        type: 'incorrect',
        emotion: 'encouraging'
      });
      
      setShowWizardDialogue(true);
      setTimeout(() => setIsProcessing(false), 1000);
    }
  }, [currentQuest, quests, isProcessing]);

  // ✅ FIXED: Get hint function
  const getHint = useCallback(() => {
    if (currentQuest >= totalQuests) return;
    
    const currentQuestData = quests[currentQuest];
    setWizardDialogue({
      id: `hint-${currentQuest}`,
      text: wizardDialogues.hints[currentQuestData.targetPart as keyof typeof wizardDialogues.hints],
      type: 'hint',
      emotion: 'thinking'
    });
    setShowWizardDialogue(true);
  }, [currentQuest, quests]);

  // Navigation functions
  const goBack = () => {
    router.push('/world-map');
  };

  const goNext = () => {
    if (currentQuest === totalQuests - 1 && quests.every(q => q.completed)) {
      router.push('/world-map/castle4');
    }
  };

  // Auto-start first quest
  useEffect(() => {
    setTimeout(() => {
      setWizardDialogue({
        id: `quest-${quests[0].id}`,
        text: `${quests[0].title}: ${quests[0].description}`,
        type: 'intro',
        emotion: 'thinking'
      });
    }, 3000);
  }, []);

  return (
    <div className={styles.adventure_container}>
      {/* Background */}
      <div className={styles.sanctuary_background}>
        <div className={styles.sanctuary_overlay}></div>
      </div>

      {/* Content Wrapper - ✅ FIXED: Added proper wrapper with left margin */}
      <div className={styles.content_wrapper}>
        
        {/* ✅ FIXED: Header with proper spacing */}
        <div className={styles.adventure_header}>
          <div className={styles.castle_title}>
            <h1>🏛️ Circle Sanctuary</h1>
            <p>Ancient Mysteries of the Perfect Circle</p>
          </div>
          
          {/* Progress Tracker */}
          <div className={styles.progress_tracker}>
            <div className={styles.progress_scroll}>
              <h3>Quest Progress</h3>
              <div className={styles.progress_bar}>
                <div 
                  className={styles.progress_fill}
                  style={{ width: `${(score / totalQuests) * 100}%` }}
                />
              </div>
              <p>{score} / {totalQuests} Parts Discovered</p>
            </div>
          </div>
        </div>

        {/* Main Adventure Area */}
        <div className={styles.adventure_main}>
          {/* Interactive Circle */}
          <div className={styles.circle_area}>
            <div className={styles.mystical_circle_container}>
              
              {/* ✅ FIXED: Current target display */}
              {currentQuest < totalQuests && (
                <div className={styles.quest_target}>
                  🎯 Find: <strong>{quests[currentQuest].targetPart.toUpperCase()}</strong>
                </div>
              )}

              {/* ✅ ENHANCED: Interactive SVG with proper click handlers */}
              <svg 
                className={styles.interactive_circle}
                viewBox="0 0 400 400"
                width="400"
                height="400"
              >
                {/* Background circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="rgba(255, 255, 255, 0.1)"
                  stroke="rgba(255, 215, 0, 0.6)"
                  strokeWidth="3"
                  className={styles.main_circle}
                />
                
                {/* ✅ FIXED: Center point - clickable */}
                <circle
                  cx="200"
                  cy="200"
                  r="12"
                  fill={circleParts.find(p => p.id === 'center')?.isIdentified ? '#FF6B6B' : 'rgba(255, 107, 107, 0.7)'}
                  stroke="#fff"
                  strokeWidth="2"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('center')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* ✅ FIXED: Radius line - clickable */}
                <line
                  x1="200"
                  y1="200"
                  x2="200"
                  y2="50"
                  stroke={circleParts.find(p => p.id === 'radius')?.isIdentified ? '#4ECDC4' : 'rgba(78, 205, 196, 0.7)'}
                  strokeWidth="6"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('radius')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* ✅ FIXED: Diameter line - clickable */}
                <line
                  x1="50"
                  y1="200"
                  x2="350"
                  y2="200"
                  stroke={circleParts.find(p => p.id === 'diameter')?.isIdentified ? '#45B7D1' : 'rgba(69, 183, 209, 0.7)'}
                  strokeWidth="6"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('diameter')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* ✅ FIXED: Chord - clickable */}
                <line
                  x1="120"
                  y1="320"
                  x2="280"
                  y2="120"
                  stroke={circleParts.find(p => p.id === 'chord')?.isIdentified ? '#FFEAA7' : 'rgba(255, 234, 167, 0.7)'}
                  strokeWidth="5"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('chord')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* ✅ FIXED: Arc - clickable */}
                <path
                  d="M 280 120 A 150 150 0 0 1 350 200"
                  fill="none"
                  stroke={circleParts.find(p => p.id === 'arc')?.isIdentified ? '#DDA0DD' : 'rgba(221, 160, 221, 0.7)'}
                  strokeWidth="8"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('arc')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* ✅ FIXED: Sector - clickable */}
                <path
                  d="M 200 200 L 280 120 A 150 150 0 0 1 350 200 Z"
                  fill={circleParts.find(p => p.id === 'sector')?.isIdentified ? 'rgba(244, 164, 96, 0.5)' : 'rgba(244, 164, 96, 0.2)'}
                  stroke={circleParts.find(p => p.id === 'sector')?.isIdentified ? '#F4A460' : 'rgba(244, 164, 96, 0.7)'}
                  strokeWidth="2"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('sector')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* ✅ FIXED: Circumference - invisible clickable ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                  className={styles.circle_part}
                  onClick={() => handleCirclePartClick('circumference')}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Labels for discovered parts */}
                {circleParts.map(part => part.isIdentified && (
                  <text
                    key={part.id}
                    x={part.position.x}
                    y={part.position.y}
                    fill={part.color}
                    className={styles.part_label}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {part.name}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Quest Panel */}
          <div className={styles.quest_panel}>
            <div className={styles.quest_scroll}>
              <h2>🗡️ Current Quest</h2>
              {currentQuest < totalQuests ? (
                <div className={styles.quest_details}>
                  <h3>{quests[currentQuest].title}</h3>
                  <p>{quests[currentQuest].description}</p>
                  <button 
                    className={styles.hint_button}
                    onClick={getHint}
                    disabled={isProcessing}
                  >
                    💡 Ask for Hint
                  </button>
                </div>
              ) : (
                <div className={styles.quest_completion}>
                  <h3>🎉 All Quests Complete!</h3>
                  <p>You have mastered the Circle Sanctuary!</p>
                </div>
              )}
            </div>
            
            {/* Parts Reference */}
            <div className={styles.parts_reference}>
              <h3>📜 Circle Parts Discovered</h3>
              <div className={styles.parts_grid}>
                {circleParts.map(part => (
                  <div 
                    key={part.id}
                    className={`${styles.part_item} ${part.isIdentified ? styles.discovered : styles.undiscovered}`}
                  >
                    <div 
                      className={styles.part_color}
                      style={{ backgroundColor: part.color }}
                    ></div>
                    <span>{part.isIdentified ? part.name : '???'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Wizard Character with wizard.png image */}
      <div className={styles.wizard_character}>
        <div className={styles.wizard_image}></div>
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
        
        {currentQuest === totalQuests - 1 && quests.every(q => q.completed) && (
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