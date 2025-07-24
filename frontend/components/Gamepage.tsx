"use client";

import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Import create-problem components (these are already Konva-based)
import Toolbox from '@/app/virtual-rooms/[roomCode]/create-problem/components/Toolbox';
import DifficultyDropdown from '@/app/virtual-rooms/[roomCode]/create-problem/components/DifficultyDropdown';
import MainArea from '@/app/virtual-rooms/[roomCode]/create-problem/components/MainArea';
import PromptBox from '@/app/virtual-rooms/[roomCode]/create-problem/components/PromptBox';
import Timer from '@/app/virtual-rooms/[roomCode]/create-problem/components/Timer';
import LimitAttempts from '@/app/virtual-rooms/[roomCode]/create-problem/components/LimitAttempts';
import SetVisibility from '@/app/virtual-rooms/[roomCode]/create-problem/components/SetVisibility';
import ShapeLimitPopup from '@/app/virtual-rooms/[roomCode]/create-problem/components/ShapeLimitPopup';

// ✅ ADD MISSING IMPORT
import { getRoomProblemsByCode } from '@/api/problems';
import { createProblem, deleteProblem, getCompeProblem, updateProblem } from '@/api/problems'
import { submitSolution } from '@/api/attempt';
import Swal from "sweetalert2";
import { useCompetitionTimer } from '@/hooks/useCompetitionTimer';
import { useCompetitionRealtime } from '@/hooks/useCompetitionRealtime';

interface CompetitionProblem {
  id: number
  timer: number | 0 
  problem: Problem
}

interface Problem {
  id: string
  title?: string | null
  description?: string | null
  visibility: string
  difficulty: string
  max_attempts: number
  expected_xp: number
  hint?: string | null
  // ✅ ADD MISSING PROPERTIES
  expected_solution?: any[]
  timer?: number | null
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

  // ✨ ADD: Current problem state for competition mode
  const [currentProblem, setCurrentProblem] = useState<CompetitionProblem | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);

  // ✅ MEMOIZE COMPETITION ID TO PREVENT UNNECESSARY HOOK CALLS
  const memoizedCompetitionId = useMemo(() => competitionId || 0, [competitionId]);
  
  // ✅ CONDITIONALLY USE HOOKS TO PREVENT UNNECESSARY API CALLS
  const shouldUseHooks = !!competitionId && competitionId > 0;
  
  const { 
    competition: realtimeCompetition, 
    isConnected,
    connectionStatus 
  } = useCompetitionRealtime(memoizedCompetitionId, shouldUseHooks);

  const {
    timeRemaining = 0,
    isTimerActive = false,
    formattedTime = '00:00',
    isExpired = false,
    isPaused = false
  } = useCompetitionTimer(
    memoizedCompetitionId, 
    shouldUseHooks ? (realtimeCompetition || currentCompetition) : null
  );

  // Use realtime competition data if available, fallback to props
  const activeCompetition = realtimeCompetition || currentCompetition;

  // ✅ SAFER FETCH PROBLEMS WITH BETTER ERROR HANDLING AND DEBOUNCING
  const fetchProblems = useCallback(async () => {
    // Only fetch problems in non-competition mode AND when we have a valid roomCode
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
      setProblems(Array.isArray(data) ? data : []);
      console.log('✅ Problems fetched successfully:', Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("❌ Error fetching problems:", error);
      setProblems([]);
    }
  }, [roomCode, competitionId]);

  // ✅ DEBOUNCED EFFECT TO PREVENT MULTIPLE CALLS
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!competitionId) {
      timeoutId = setTimeout(() => {
        fetchProblems();
      }, 100); // Small delay to debounce
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fetchProblems, competitionId]);

  // ✅ UPDATED: More comprehensive problem fetching with better logging
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;
    
    const fetchCurrentProblem = async () => {
      console.log('🔍 === FETCH CURRENT PROBLEM CHECK ===');
      console.log('Competition ID:', competitionId);
      console.log('Active competition:', activeCompetition);
      console.log('Current problem ID:', activeCompetition?.current_problem_id);
      console.log('Competition status:', activeCompetition?.status);
      console.log('Is page reload?', !currentProblem && activeCompetition?.current_problem_id);
      
      if (!competitionId || !activeCompetition) {
        console.log('❌ No competition data, skipping fetch');
        return;
      }
      
      // ✅ ENHANCED: Handle different competition states
      if (activeCompetition.status === 'NEW') {
        console.log('⏳ Competition not started yet, waiting...');
        return;
      }
      
      if (activeCompetition.status === 'DONE') {
        console.log('🏁 Competition completed, no need to fetch problem');
        return;
      }
      
      if (!activeCompetition.current_problem_id) {
        console.log('❌ No current problem ID, skipping fetch');
        return;
      }
      
      if (isCancelled) {
        console.log('🛑 Fetch cancelled');
        return;
      }
      
      setIsLoadingProblem(true);
      console.log('🚀 Starting to fetch problem:', activeCompetition.current_problem_id);
      
      try {
        const problemData = await getCompeProblem(activeCompetition.current_problem_id);
        
        if (isCancelled) {
          console.log('🛑 Fetch completed but cancelled');
          return;
        }
        
        if (!problemData || !problemData.problem) {
          console.error('❌ Invalid problem data received:', problemData);
          return;
        }

        console.log('✅ Problem data loaded successfully:', problemData);
        setCurrentProblem(problemData);
        
        // ✅ SAFELY POPULATE THE FORM FIELDS
        setTitle(problemData.problem.title || "");
        setPrompt(problemData.problem.description || "");
        setDifficulty(problemData.problem.difficulty || "Easy");
        setLimitAttempts(problemData.problem.max_attempts || 1);
        setHint(problemData.problem.hint || "");
        setHintOpen(!!problemData.problem.hint);
        setTimerValue(problemData.timer || 5); 
        setTimerOpen(!!problemData.timer);
        
        // ✅ CLEAR STUDENT'S SHAPES - THEY CREATE THEIR OWN SOLUTION
        setShapes([]);
        setSelectedId(null);
        
        console.log('🎯 Problem details populated successfully');
        console.log('📝 Title:', problemData.problem.title);
        console.log('📋 Description:', problemData.problem.description);
        console.log('⏱️ Timer:', problemData.timer);
        
      } catch (error) {
        if (!isCancelled) {
          console.error('❌ Error fetching current problem:', error);
          setCurrentProblem(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProblem(false);
          console.log('✅ Fetch current problem completed');
        }
      }
    };
    
    // ✅ ENHANCED: Better trigger conditions
    if (competitionId && activeCompetition) {
      console.log('🔄 Competition state changed, scheduling problem fetch...');
      timeoutId = setTimeout(() => {
        fetchCurrentProblem();
      }, 200); // Debounce to prevent rapid calls
    }
    
    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    activeCompetition?.current_problem_id, 
    activeCompetition?.status,
    activeCompetition?.current_problem_index,
    activeCompetition?.gameplay_indicator, // ✅ NEW: Also watch gameplay changes
    competitionId
  ]);

  // ✅ NEW: Force fetch on component mount for page reloads
  useEffect(() => {
    // Force fetch current problem if we have competition data but no current problem
    // This handles page reloads where the user lands directly on the game page
    if (competitionId && 
        activeCompetition?.status === 'ONGOING' && 
        activeCompetition?.current_problem_id && 
        !currentProblem && 
        !isLoadingProblem) {
      
      console.log('🔄 [Reload] Force fetching current problem on component mount...');
      
      setTimeout(async () => {
        try {
          setIsLoadingProblem(true);
          const problemData = await getCompeProblem(activeCompetition.current_problem_id);
          
          if (problemData && problemData.problem) {
            console.log('✅ [Reload] Problem data fetched successfully:', problemData);
            setCurrentProblem(problemData);
            setTitle(problemData.problem.title || "");
            setPrompt(problemData.problem.description || "");
            setDifficulty(problemData.problem.difficulty || "Easy");
            setLimitAttempts(problemData.problem.max_attempts || 1);
            setHint(problemData.problem.hint || "");
            setHintOpen(!!problemData.problem.hint);
            setTimerValue(problemData.timer || 5);
            setTimerOpen(!!problemData.timer);
            setShapes([]);
            setSelectedId(null);
          }
        } catch (error) {
          console.error('❌ [Reload] Error fetching problem on mount:', error);
        } finally {
          setIsLoadingProblem(false);
        }
      }, 500);
    }
  }, [competitionId, activeCompetition?.status, activeCompetition?.current_problem_id, currentProblem, isLoadingProblem]);

  // ✅ ENHANCED: Better competition state transition handling
  useEffect(() => {
    console.log('🎮 === COMPETITION STATE CHANGE ===');
    console.log('Status:', activeCompetition?.status);
    console.log('Gameplay:', activeCompetition?.gameplay_indicator);
    console.log('Current problem ID:', activeCompetition?.current_problem_id);
    console.log('Problem index:', activeCompetition?.current_problem_index);
    console.log('Has current problem?', !!currentProblem);
    
    // ✅ ENHANCED: Handle different state transitions
    if (activeCompetition?.status === 'ONGOING') {
      if (activeCompetition?.current_problem_id && !currentProblem) {
        console.log('🚀 Competition started or new problem! Force fetching...');
        
        setTimeout(async () => {
          try {
            setIsLoadingProblem(true);
            const problemData = await getCompeProblem(activeCompetition.current_problem_id);
            if (problemData && problemData.problem) {
              console.log('✅ Force fetch successful:', problemData);
              setCurrentProblem(problemData);
              setTitle(problemData.problem.title || "");
              setPrompt(problemData.problem.description || "");
              setDifficulty(problemData.problem.difficulty || "Easy");
              setLimitAttempts(problemData.problem.max_attempts || 1);
              setHint(problemData.problem.hint || "");
              setHintOpen(!!problemData.problem.hint);
              setTimerValue(problemData.timer || 5);
              setTimerOpen(!!problemData.timer);
              setShapes([]);
              setSelectedId(null);
            }
          } catch (error) {
            console.error('❌ Force fetch failed:', error);
          } finally {
            setIsLoadingProblem(false);
          }
        }, 300);
      }
    }
    
    // ✅ CLEAR PROBLEM: When competition ends
    if (activeCompetition?.status === 'DONE') {
      console.log('🏁 Competition completed, clearing current problem');
      setCurrentProblem(null);
      setShapes([]);
      setSelectedId(null);
    }
    
  }, [activeCompetition?.status, activeCompetition?.current_problem_id, activeCompetition?.gameplay_indicator, currentProblem]);

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

  // ✅ SAFER SHAPE PROPERTIES CALCULATION
  function getShapeProperties(shape: any) {
    try {
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

        function dist(a: any, b: any) {
          return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / 10;
        }
        function getAngle(A: any, B: any, C: any) {
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
    } catch (error) {
      console.error('Error calculating shape properties:', error);
      return shape; // Return original shape if calculation fails
    }
  }

  // ✅ SAFER SAVE/SUBMIT HANDLER
  const handleSave = async () => {
    console.log("Saving problem...");
    if (competitionId && activeCompetition) {
      // ✨ COMPETITION MODE - SUBMIT SOLUTION
      try {
        const shapesWithProps = shapes.map(getShapeProperties);
        
        // ✅ FIXED: Proper time calculation
        // timeRemaining is in seconds, currentProblem.timer is in minutes
        const totalTimeAllowedInSeconds = (currentProblem?.timer || 5) * 60; // Convert minutes to seconds
        const timeSpentInSeconds = totalTimeAllowedInSeconds - timeRemaining;
        const timeTaken = Math.max(0, timeSpentInSeconds); // Ensure non-negative

        // ✅ Validate that user created a shape
        if (shapesWithProps.length === 0) {
          Swal.fire({
            title: "No Solution Created",
            text: "Please create at least one shape before submitting your solution.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        const solutionPayload = {
          solution: shapesWithProps,
          time_taken: timeTaken,
          room_id: Number(roomId),
        };

        console.log("📊 Submission details:", {
          totalTimeAllowedInSeconds,
          timeRemaining, 
          timeSpentInSeconds,
          timeTaken,
          shapesCount: shapesWithProps.length,
          solutionPayload
        });

        console.log("🚀 Submitting solution:", solutionPayload); 
        
        const response = await submitSolution(
          competitionId,
          activeCompetition.current_problem_id,
          solutionPayload
        );

        console.log("✅ Submission response:", response);

        if (response && response.success) {
          // ✅ Enhanced success message with grading details
          const xpGained = response.xp_gained || 0;
          const feedback = response.feedback || response.attempt?.feedback || 'Solution submitted successfully!';
          
          Swal.fire({
            title: "Solution Submitted! 🎯",
            html: `
              <div style="text-align: left; margin: 10px;">
                <p><strong>Feedback:</strong> ${feedback}</p>
                <p><strong>XP Gained:</strong> +${xpGained} XP</p>
                <p><strong>Time Taken:</strong> ${Math.round(timeTaken)}s</p>
              </div>
            `,
            icon: "success",
            confirmButtonText: "Awesome!",
            timer: 5000,
            timerProgressBar: true
          });
          
          // ✅ Clear the workspace
          setShapes([]);
          setSelectedId(null);
        } else {
          throw new Error(response?.message || 'Submission failed');
        }
      } catch (error: any) {
        console.error("❌ Submit error:", error);
        
        // ✅ Better error handling
        let errorMessage = "Failed to submit solution. Please try again.";
        
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        Swal.fire({
          title: "Submission Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
      return;
    }

    // ✅ SAFER REGULAR MODE - CREATE/EDIT PROBLEM
    try {
      const shapesWithProps = shapes.map(getShapeProperties);

      const payload = {
        title,
        description: prompt,
        expected_solution: shapesWithProps,
        difficulty,
        visibility: visible ? "show" : "hide",
        max_attempts: limitAttempts,
        expected_xp: XP_MAP[difficulty as keyof typeof XP_MAP],
        timer: timerOpen ? timerValue : null,
        hint: hintOpen ? hint : null,
      };

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

    } catch (error: any) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "There was an error saving the problem. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
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

  // ✅ REDUCED TIMER DEBUG LOGGING TO PREVENT SPAM
  useEffect(() => {
    if (competitionId && activeCompetition && timeRemaining > 0) {
      // Only log every 10 seconds to reduce console spam
      if (timeRemaining % 10 === 0) {
        console.log('Timer Update:', {
          timeRemaining,
          formattedTime,
          isExpired,
          isPaused
        });
      }
    }
  }, [competitionId, activeCompetition, timeRemaining, formattedTime, isExpired, isPaused]);

  // ✅ LOADING STATE FOR COMPETITION MODE
  if (competitionId && isLoadingProblem) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>Loading problem...</div>
      </div>
    );
  }

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
                  backgroundColor: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS],
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
          
          {/* ✅ SAFER COMPETITION TIMER DISPLAY */}
          {competitionId && activeCompetition && (
            <div className={styles.competitionTimerContainer}>
              <div className={styles.timerDisplay}>
                <div className={styles.timerHeader}>
                  <span className={styles.timerLabel}>Time Remaining</span>
                  <div className={styles.timerStatus}>
                    {activeCompetition?.status === 'NEW' && (
                      <span className={styles.waitingIndicator}>⏳ WAITING TO START</span>
                    )}
                    {activeCompetition?.status === 'DONE' && (
                      <span className={styles.completedIndicator}>🏁 COMPLETED</span>
                    )}
                    {activeCompetition?.gameplay_indicator === 'PAUSE' && (
                      <span className={styles.pausedIndicator}>⏸️ PAUSED</span>
                    )}
                    {isExpired && activeCompetition?.status === 'ONGOING' && (
                      <span className={styles.expiredIndicator}>⏰ TIME UP!</span>
                    )}
                    {!isPaused && !isExpired && isTimerActive && activeCompetition?.status === 'ONGOING' && (
                      <span className={styles.activeIndicator}>⏱️ ACTIVE</span>
                    )}
                  </div>
                </div>
                
                <div className={`${styles.timerTime} ${isExpired ? styles.expired : ''} ${isPaused ? styles.paused : ''}`}>
                  {formattedTime || '00:00'}
                </div>
                
                {/* ✅ ENHANCED: Better progress bar calculation */}
                <div className={styles.timerProgress}>
                  <div 
                    className={styles.progressBar}
                    style={{
                      width: `${Math.max(0, Math.min(100, 
                        timeRemaining && currentProblem?.timer 
                          ? (timeRemaining / (currentProblem.timer * 60)) * 100 
                          : 0
                      ))}%`,
                      backgroundColor: timeRemaining < 60 ? '#ef4444' : timeRemaining < 180 ? '#f59e0b' : '#10b981',
                      height: '8px',
                      transition: 'width 0.3s ease',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                {/* ✅ ENHANCED: Show current problem info */}
                {activeCompetition.current_problem_index !== undefined && (
                  <div className={styles.problemInfo}>
                    Problem {activeCompetition.current_problem_index + 1}
                    {currentProblem && (
                      <span className={styles.problemTitle}>: {currentProblem.problem.title}</span>
                    )}
                  </div>
                )}
                
                <div className={styles.gameplayStatus}>
                  Status: <span className={styles.statusValue}>
                    {activeCompetition.gameplay_indicator || activeCompetition.status}
                  </span>
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
      </div>
      
      {showLimitPopup && (
        <ShapeLimitPopup onClose={() => setShowLimitPopup(false)} />
      )}
    </div>
  );
}