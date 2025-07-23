"use client";

import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";

// Import create-problem components (these are already Konva-based)
import Toolbox from '@/app/virtual-rooms/[roomCode]/create-problem/components/Toolbox';
import DifficultyDropdown from '@/app/virtual-rooms/[roomCode]/create-problem/components/DifficultyDropdown';
import MainArea from '@/app/virtual-rooms/[roomCode]/create-problem/components/MainArea';
import PromptBox from '@/app/virtual-rooms/[roomCode]/create-problem/components/PromptBox';
import Timer from '@/app/virtual-rooms/[roomCode]/create-problem/components/Timer';
import LimitAttempts from '@/app/virtual-rooms/[roomCode]/create-problem/components/LimitAttempts';
import SetVisibility from '@/app/virtual-rooms/[roomCode]/create-problem/components/SetVisibility';
import ShapeLimitPopup from '@/app/virtual-rooms/[roomCode]/create-problem/components/ShapeLimitPopup';

import { createProblem, deleteProblem, getRoomProblemsByCode, updateProblem } from '@/api/problems'
import Swal from "sweetalert2";
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';

interface Problem {
  id: string
  title?: string | null
  description?: string | null
  visibility: string
  expected_solution?: any[]
  difficulty: string
  max_attempts: number
  expected_xp: number
  timer?: number | null
  hint?: string | null
}

interface GamepageProps {
  roomCode: string;
  competitionId?: number;
  currentCompetition?: any;
  roomId?: string;
  isFullScreenMode?: boolean;
}

const FILL_COLORS = [
  "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf",
  "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#E3DCC2"
];

const DIFFICULTY_COLORS = {
  Easy: "#8FFFC2",
  Intermediate: "#FFFD9B",
  Hard: "#FFB49B",
};

const XP_MAP = { Easy: 10, Intermediate: 20, Hard: 30 };
const MAX_SHAPES = 1;

export default function Gamepage({ 
  roomCode,
  competitionId,
  currentCompetition,
  roomId,
  isFullScreenMode = false
}: GamepageProps) {
  const router = useRouter();

  // Basic state management (removed old drag/resize states)
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState("Easy");
  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [fillMode, setFillMode] = useState(false);
  const [fillColor, setFillColor] = useState("#E3DCC2");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerValue, setTimerValue] = useState(5);
  const [hintOpen, setHintOpen] = useState(false);
  const [hint, setHint] = useState("");
  const [limitAttempts, setLimitAttempts] = useState<number | 1>(1);
  const [visible, setVisible] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [showSides, setShowSides] = useState(false);
  const [showAngles, setShowAngles] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showHeight, setShowHeight] = useState(false);
  const [showDiameter, setShowDiameter] = useState(false);
  const [showCircumference, setShowCircumference] = useState(false);
  const [showAreaByShape, setShowAreaByShape] = useState({
    circle: false,
    triangle: false,
    square: false,
  });

  // Competition-specific state
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);

  // Timer and realtime hooks for competition mode
  const { 
    competition: realtimeCompetition, 
    isConnected,
    connectionStatus 
  } = useCompetitionRealtime(competitionId, false);

  const {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired,
    isPaused
  } = useCompetitionTimer(
    competitionId, 
    realtimeCompetition || currentCompetition
  );

  // Use realtime competition data if available, fallback to props
  const activeCompetition = realtimeCompetition || currentCompetition;

  // Fetch problems for non-competition mode
  const fetchProblems = useCallback(async () => {
    // ✅ FIXED: Only fetch problems in non-competition mode AND when we have a valid roomCode
    if (!roomCode || competitionId || typeof roomCode !== 'string' || roomCode.trim() === '') {
      console.log('⏭️ Skipping fetchProblems:', { 
        roomCode: !!roomCode, 
        competitionId: !!competitionId,
        reason: competitionId ? 'Competition mode' : 'Invalid roomCode'
      });
      return;
    }
    
    try {
      console.log('📝 Fetching problems for room:', roomCode);
      const data = await getRoomProblemsByCode(roomCode);
      setProblems(data || []);
      console.log('✅ Problems fetched successfully:', data?.length || 0);
    } catch (error) {
      console.error("❌ Error fetching problems:", error);
      // Set empty array on error to prevent crashes
      setProblems([]);
      
      // Only show error alerts in non-competition mode
      if (!competitionId) {
        console.warn("Failed to fetch problems for room:", roomCode);
      }
    }
  }, [roomCode, competitionId]);

  useEffect(() => {
    // Only fetch problems when not in competition mode
    if (!competitionId) {
      fetchProblems();
    }
  }, [fetchProblems, competitionId]);

  // Fetch current problem in competition mode
  useEffect(() => {
    const fetchCurrentProblem = async () => {
      if (!competitionId || !activeCompetition?.current_problem_id) return;
      
      setIsLoadingProblem(true);
      try {
        const response = await fetch(`/api/problems/${activeCompetition.current_problem_id}`);
        if (response.ok) {
          const problemData = await response.json();
          setCurrentProblem(problemData);
          
          // Populate form fields with problem details (read-only for students)
          setTitle(problemData.title || "");
          setPrompt(problemData.description || "");
          setDifficulty(problemData.difficulty || "Easy");
          setLimitAttempts(problemData.max_attempts || 1);
          setHint(problemData.hint || "");
          setHintOpen(!!problemData.hint);
          setTimerValue(problemData.timer || 5);
          setTimerOpen(!!problemData.timer);
          
          // Clear student's shapes - they create their own solution
          setShapes([]);
          setSelectedId(null);
          
          console.log('Problem details loaded:', problemData);
        }
      } catch (error) {
        console.error('Error fetching current problem:', error);
      } finally {
        setIsLoadingProblem(false);
      }
    };
    
    if (competitionId && activeCompetition?.current_problem_id) {
      fetchCurrentProblem();
    }
  }, [activeCompetition?.current_problem_id, competitionId]);

  // Keyboard deletion handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (!isInput && (e.key === "Delete" || e.key === "Backspace") && selectedId !== null) {
        setShapes(prev => {
          const newShapes = prev.filter(shape => shape.id !== selectedId);
          if (newShapes.length === 0) {
            handleAllShapesDeleted();
          }
          return newShapes;
        });
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  // Drag start handler
  const handleDragStart = (type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("shape-type", type);
  };

  // Pixel to units conversion
  const pxToUnits = (px: number): string => {
    return (px / 10).toFixed(1);
  };

  // Shape properties calculation
  function getShapeProperties(shape) {
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

      function dist(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / 10;
      }
      function getAngle(A, B, C) {
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
  }

  // Save/Submit handler
  const handleSave = async () => {
    if (competitionId && activeCompetition) {
      // Competition mode - submit solution
      const shapesWithProps = shapes.map(getShapeProperties);
      
      const solutionPayload = {
        competition_id: competitionId,
        problem_id: activeCompetition.current_problem_id,
        participant_solution: shapesWithProps,
        submitted_at: new Date().toISOString(),
        room_id: roomId
      };
      
      try {
        const response = await fetch('/api/competition/submit-solution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(solutionPayload)
        });
        
        if (response.ok) {
          const result = await response.json();
          
          Swal.fire({
            title: "Solution Submitted!",
            text: `Your solution has been submitted successfully! You earned ${result.xp_earned || 0} XP!`,
            icon: "success",
            confirmButtonText: "Awesome!",
            timer: 3000,
            timerProgressBar: true
          });
          
          setShapes([]);
          setSelectedId(null);
          
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit solution');
        }
      } catch (error) {
        console.error("Submit error:", error);
        Swal.fire({
          title: "Submission Error",
          text: error.message || "Failed to submit solution. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
      return;
    }

    // Regular mode - create/edit problem
    const shapesWithProps = shapes.map(getShapeProperties);

    const payload = {
      title,
      description: prompt,
      expected_solution: shapesWithProps,
      difficulty,
      visibility: visible ? "show" : "hide",
      max_attempts: limitAttempts,
      expected_xp: XP_MAP[difficulty],
      timer: timerOpen ? timerValue : null,
      hint: hintOpen ? hint : null,
    };

    try {
      if (!problemId) {
        await createProblem(payload, roomCode);
        Swal.fire({
          title: "Problem Created",
          text: "Your problem has been successfully created!",
          icon: "success",
          confirmButtonText: "OK",
        }); 
      } else {
        await updateProblem(problemId, payload);
        Swal.fire({
          title: "Problem Edited",
          text: "Your problem has been successfully edited!",
          icon: "success",
          confirmButtonText: "OK",
        }); 
      }
      await fetchProblems();
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error saving the problem. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      // Reset form
      setTitle("");
      setPrompt("");
      setShapes([]);
      setSelectedId(null);
      setDifficulty("Easy");
      setLimitAttempts(1);
      setTimerOpen(false);
      setTimerValue(5);
      setHintOpen(false);
      setHint("");
      setVisible(true);
      setShowProperties(false);
      setProblemId(null);
    }
  };

  // Problem management handlers
  const handleDeleteProblem = async (problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      await deleteProblem(problemId);
      setProblems(prev => prev.filter(p => p.id !== problemId));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const handleEditProblem = async (problemId: string) => { 
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    
    setProblemId(problemId);
    setTitle(problem.title || "");
    setPrompt(problem.description || "");
    setShapes(problem.expected_solution || []);
    setDifficulty(problem.difficulty || "Easy");
    setLimitAttempts(problem.max_attempts || 1);
    setTimerOpen(problem.timer !== null && problem.timer !== undefined);
    setTimerValue(typeof problem.timer === 'number' ? problem.timer : 5);
    setHintOpen(problem.hint !== null && problem.hint !== undefined);
    setHint(problem.hint ?? "");
    setVisible(problem.visibility === "show");
    setShowProperties(true);  
  };

  const handleAllShapesDeleted = useCallback(() => {
    setShowSides(false);
    setShowAngles(false);
    setShowArea(false);
    setShowHeight(false);
    setShowDiameter(false);
    setShowCircumference(false);
    setShowAreaByShape({
      circle: false,
      triangle: false,
      square: false,
    });
  }, []);

  useEffect(() => {
    if (shapes.length === 0) {
      handleAllShapesDeleted();
    }
  }, [shapes.length, handleAllShapesDeleted]);

  // Add this debugging effect right before the return statement
  useEffect(() => {
    if (competitionId && activeCompetition) {
      console.log('Timer Debug:', {
        competitionId,
        activeCompetition: !!activeCompetition,
        timeRemaining,
        timerValue,
        isTimerActive,
        formattedTime,
        isExpired,
        isPaused,
        progressPercentage: Math.max(0, (timeRemaining / (timerValue * 60)) * 100)
      });
    }
  }, [competitionId, activeCompetition, timeRemaining, timerValue, isTimerActive, formattedTime, isExpired, isPaused]);

  return (
    <div className={`${styles.root} ${isFullScreenMode ? styles.fullScreenGame : ''}`}>
      <div className={styles.scalableWorkspace}>
        {/* Sidebar */}
        <div style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 8, marginBottom: 16 }}>
            <div className={styles.goBackGroup}>
              <button className={styles.arrowLeft} onClick={() => router.back()}>←</button>
              <span className={styles.goBackText}>Go back</span>
            </div>
          </div>
          
          {/* Difficulty - read-only in competition mode */}
          {competitionId ? (
            <div className={styles.difficultyDisplay}>
              <div className={styles.difficultyLabel}>Problem Difficulty</div>
              <div 
                className={styles.difficultyValue}
                style={{
                  backgroundColor: DIFFICULTY_COLORS[difficulty],
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {difficulty}
              </div>
            </div>
          ) : (
            <DifficultyDropdown difficulty={difficulty} setDifficulty={setDifficulty} />
          )}
          
          <Toolbox
            shapes={shapes}
            disableDrag={shapes.length >= MAX_SHAPES}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            fillMode={fillMode}
            setFillMode={setFillMode}
            fillColor={fillColor}
            setFillColor={setFillColor}
            FILL_COLORS={FILL_COLORS}
            showProperties={showProperties}
            setShowProperties={setShowProperties}
            handleDragStart={handleDragStart}
            showAreaByShape={showAreaByShape}
            setShowAreaByShape={setShowAreaByShape}
            showSides={showSides}
            setShowSides={setShowSides}
            showAngles={showAngles}
            setShowAngles={setShowAngles}
            showHeight={showHeight}
            setShowHeight={setShowHeight}
            showDiameter={showDiameter}
            setShowDiameter={setShowDiameter}
            showCircumference={showCircumference}
            setShowCircumference={setShowCircumference}
          />
        </div>

        {/* Main Column */}
        <div className={styles.mainColumn}>
          <div style={{ height: 32 }} />
          
          {/* Title - read-only in competition mode */}
          <div className={styles.formRow}>
            <input 
              className={styles.input} 
              placeholder="Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              readOnly={!!competitionId}
              style={{
                backgroundColor: competitionId ? '#f5f5f5' : 'white',
                cursor: competitionId ? 'default' : 'text'
              }}
            />
          </div>
          
          {/* Prompt - read-only in competition mode */}
          <div className={styles.promptGroup}>
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              editingPrompt={editingPrompt && !competitionId}
              setEditingPrompt={setEditingPrompt}
              promptInputRef={promptInputRef}
              readOnly={!!competitionId}
            />
          </div>
          
          {/* Main Area with Konva */}
          <MainArea
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedTool={setSelectedTool}
            saveButton={
              <button 
                className={`${styles.saveBtn} ${styles.rowBtn} ${styles.saveBtnFloating}`} 
                onClick={handleSave}
                disabled={competitionId && shapes.length === 0}
              >
                {competitionId ? "Submit Solution 🚀" : "Save"}
              </button>
            }
            shapeLimit={MAX_SHAPES}
            shapeCount={shapes.length}
            onLimitReached={() => setShowLimitPopup(true)}
            pxToUnits={pxToUnits}
            showAreaByShape={showAreaByShape}
            showSides={showSides}
            showAngles={showAngles}
            showDiameter={showDiameter}
            showCircumference={showCircumference}
            showHeight={showHeight}
          />
          
          {/* Competition Timer Display - FIXED */}
          {competitionId && activeCompetition && (
            <div className={styles.competitionTimerContainer}>
              <div className={styles.timerDisplay}>
                <div className={styles.timerHeader}>
                  <span className={styles.timerLabel}>Time Remaining</span>
                  <div className={styles.timerStatus}>
                    {isPaused && (
                      <span className={styles.pausedIndicator}>⏸️ PAUSED</span>
                    )}
                    {isExpired && (
                      <span className={styles.expiredIndicator}>⏰ TIME UP!</span>
                    )}
                    {!isPaused && !isExpired && isTimerActive && (
                      <span className={styles.activeIndicator}>⏱️ ACTIVE</span>
                    )}
                  </div>
                </div>
                
                <div className={`${styles.timerTime} ${isExpired ? styles.expired : ''} ${isPaused ? styles.paused : ''}`}>
                  {formattedTime || '00:00'}
                </div>
                
                <div className={styles.timerProgress}>
                  <div 
                    className={styles.progressBar}
                    style={{
                      width: `${Math.max(0, Math.min(100, timeRemaining && timerValue ? (timeRemaining / (timerValue * 60)) * 100 : 0))}%`,
                      backgroundColor: timeRemaining < 60 ? '#ef4444' : timeRemaining < 180 ? '#f59e0b' : '#10b981',
                      height: '8px',
                      transition: 'width 0.3s ease',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                {activeCompetition.gameplay_indicator && (
                  <div className={styles.gameplayStatus}>
                    Status: <span className={styles.statusValue}>{activeCompetition.gameplay_indicator}</span>
                  </div>
                )}
                
                {/* Debug info - remove in production */}
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  Debug: {timeRemaining}s / {timerValue * 60}s = {Math.round((timeRemaining / (timerValue * 60)) * 100)}%
                </div>
              </div>
            </div>
          )}
          
          <div className={styles.controlsRow}>
            <div style={{ display: "flex", gap: 12 }}>
              {/* Attempts - read-only in competition mode */}
              {competitionId ? (
                <div className={styles.attemptsDisplay}>
                  <span className={styles.attemptsLabel}>Max Attempts:</span>
                  <span className={styles.attemptsValue}>{limitAttempts}</span>
                </div>
              ) : (
                <LimitAttempts limit={limitAttempts} setLimit={setLimitAttempts} />
              )}
              
              {/* Timer - read-only in competition mode */}
              {competitionId ? (
                <div className={styles.timerDisplayControl}>
                  <span className={styles.timerLabel}>Timer:</span>
                  <span className={styles.timerValue}>{timerValue} min</span>
                </div>
              ) : (
                !timerOpen ? (
                  <button className={`${styles.addTimerBtn} ${styles.rowBtn}`} onClick={() => setTimerOpen(true)}>
                    Add Timer
                  </button>
                ) : (
                  <Timer timerOpen={timerOpen} setTimerOpen={setTimerOpen} timerValue={timerValue} setTimerValue={setTimerValue} />
                )
              )}
              
              {/* Hint - read-only in competition mode */}
              {(hintOpen || hint) ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, marginLeft: 4, marginBottom: 2 }}>
                    Hint
                  </span>
                  <input
                    className={styles.hintInput}
                    type="text"
                    value={hint}
                    onChange={e => setHint(e.target.value)}
                    onBlur={() => { if (!hint && !competitionId) setHintOpen(false); }}
                    placeholder="Enter hint..."
                    autoFocus={hintOpen && !competitionId}
                    readOnly={!!competitionId}
                    style={{
                      backgroundColor: competitionId ? '#f5f5f5' : 'white',
                      cursor: competitionId ? 'default' : 'text'
                    }}
                  />
                </div>
              ) : (
                !competitionId && (
                  <button className={`${styles.addHintBtn} ${styles.rowBtn}`} onClick={() => setHintOpen(true)}>
                    Add Hint
                  </button>
                )
              )}
              
              {/* Visibility - only show in non-competition mode */}
              {!competitionId && (
                <SetVisibility visible={visible} setVisible={setVisible} />
              )}
            </div>
          </div>
        </div>
        
        {/* Right sidebar - only show problems list in non-competition mode */}
        {!competitionId && (
          <div className={styles.problemsSection}>
            <div className={styles.problemsSectionHeader}>
              Existing Problems
            </div>
            <div className={styles.problemsContent}>
              {problems.length > 0 ? (
                <ul className={styles.problemList}>
                  {problems.map(problem => (
                    <li key={problem.id} className={styles.problemItem}>
                      <div className={styles.problemItemHeader}>
                        <div className={styles.problemTitle}>
                          {problem.title || "Untitled Problem"}
                        </div>
                        <div className={styles.buttonGroup}>
                          <button 
                            onClick={() => handleEditProblem(problem.id)} 
                            className={styles.editButton}
                            title="Edit this problem"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProblem(problem.id)} 
                            className={styles.deleteButton}
                            title="Delete this problem"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className={styles.problemDetails}>
                        <span 
                          className={styles.problemDifficulty} 
                          style={{ backgroundColor: DIFFICULTY_COLORS[problem.difficulty] }}
                        >
                          {problem.difficulty}
                        </span>
                        <span 
                          className={`${styles.problemVisibility} ${styles[problem.visibility]}`}
                        >
                          {problem.visibility}
                        </span>
                        <div className={styles.problemMeta}>
                          <span className={styles.problemAttempts}>
                            {problem.max_attempts} {problem.max_attempts === 1 ? 'attempt' : 'attempts'}
                          </span>
                          <span className={styles.problemXp}>
                            {problem.expected_xp} XP
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.noProblems}>
                  <div className={styles.noProblemsIcon}>📝</div>
                  <div className={styles.noProblemsText}>
                    No problems created yet.
                  </div>
                  <div className={styles.noProblemsSubtext}>
                    Create your first problem to get started!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showLimitPopup && (
        <ShapeLimitPopup onClose={() => setShowLimitPopup(false)} />
      )}
    </div>
  );
}