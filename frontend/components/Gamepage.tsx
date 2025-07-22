"use client";

import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";

// Import ALL create-problem components
import Toolbox from '@/app/virtual-rooms/[roomCode]/create-problem/components/Toolbox';
import DifficultyDropdown from '@/app/virtual-rooms/[roomCode]/create-problem/components/DifficultyDropdown';
import MainArea from '@/app/virtual-rooms/[roomCode]/create-problem/components/MainArea';
import PromptBox from '@/app/virtual-rooms/[roomCode]/create-problem/components/PromptBox';
import SquareShape from '@/app/virtual-rooms/[roomCode]/create-problem/shapes/SquareShape';
import CircleShape from '@/app/virtual-rooms/[roomCode]/create-problem/shapes/CircleShape';
import TriangleShape from '@/app/virtual-rooms/[roomCode]/create-problem/shapes/TriangleShape';
import Timer from '@/app/virtual-rooms/[roomCode]/create-problem/components/Timer';
import LimitAttempts from '@/app/virtual-rooms/[roomCode]/create-problem/components/LimitAttempts';
import SetVisibility from '@/app/virtual-rooms/[roomCode]/create-problem/components/SetVisibility';
import ShapeLimitPopup from '@/app/virtual-rooms/[roomCode]/create-problem/components/ShapeLimitPopup';

import { createProblem, deleteProblem, getRoomProblemsByCode, updateProblem } from '@/api/problems'
import Swal from "sweetalert2";

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

  // Basic state management
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [draggingVertex, setDraggingVertex] = useState<{ shapeId: number; vertex: number } | null>(null);
  const [draggingShapeId, setDraggingShapeId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const draggingSideRef = useRef<{
    shapeId: number;
    points: (keyof any["shape"]["points"])[];
    start: { x: number; y: number };
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = useState("Easy");
  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [fillMode, setFillMode] = useState(false);
  const [fillColor, setFillColor] = useState("#E3DCC2");
  const [draggingFill, setDraggingFill] = useState(false);
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
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);

  // Fetch problems function
  const fetchProblems = useCallback(async () => {
    if (!roomCode || competitionId) return; // Don't fetch in competition mode
    try {
      const data = await getRoomProblemsByCode(roomCode);
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }, [roomCode, competitionId]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // ✨ ADD: Fetch current problem details when competition updates
  useEffect(() => {
    const fetchCurrentProblem = async () => {
      if (!competitionId || !currentCompetition?.current_problem_id) return;
      
      setIsLoadingProblem(true);
      try {
        // Fetch the current problem details from your API
        const response = await fetch(`/api/problems/${currentCompetition.current_problem_id}`);
        if (response.ok) {
          const problemData = await response.json();
          setCurrentProblem(problemData);
          
          // ✨ POPULATE THE FORM FIELDS WITH PROBLEM DETAILS (READ-ONLY FOR STUDENTS)
          setTitle(problemData.title || "");
          setPrompt(problemData.description || "");
          setDifficulty(problemData.difficulty || "Easy");
          setLimitAttempts(problemData.max_attempts || 1);
          setHint(problemData.hint || "");
          setHintOpen(!!problemData.hint);
          setTimerValue(problemData.timer || 5);
          setTimerOpen(!!problemData.timer);
          
          // ✨ CLEAR STUDENT'S SHAPES - THEY CREATE THEIR OWN SOLUTION
          setShapes([]);
          setSelectedId(null);
          
          console.log('🎯 Problem details loaded:', problemData);
        }
      } catch (error) {
        console.error('Error fetching current problem:', error);
      } finally {
        setIsLoadingProblem(false);
      }
    };
    
    // Only fetch in competition mode
    if (competitionId && currentCompetition?.current_problem_id) {
      fetchCurrentProblem();
    }
  }, [currentCompetition?.current_problem_id, competitionId]);

  // Shape interaction handlers
  const handleShapeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;

    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (shape.type === "circle") {
      const offsetX = e.clientX - rect.left - shape.x;
      const offsetY = e.clientY - rect.top - shape.y;
      setDraggingShapeId(id);
      setDragOffset({ x: offsetX, y: offsetY });
      return;
    }

    if (shape.type === "triangle" && shape.points?.top) {
      const referencePoint = shape.points.top;
      const offsetX = e.clientX - rect.left - referencePoint.x;
      const offsetY = e.clientY - rect.top - referencePoint.y;
      setDraggingShapeId(id);
      setDragOffset({ x: offsetX, y: offsetY });
      return;
    }

    if (shape.type === "square" && shape.points?.topLeft) {
      const offsetX = e.clientX - rect.left - shape.points.topLeft.x;
      const offsetY = e.clientY - rect.top - shape.points.topLeft.y;
      setDraggingShapeId(id);
      setDragOffset({ x: offsetX, y: offsetY });
      return;
    }
  };

  const handleCircleResizeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const shape = shapes.find((s) => s.id === id);
    if (!shape) return;

    const startX = e.clientX;
    const startSize = shape.size;
    const MIN_CIRCLE_SIZE = 80;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const newSize = Math.max(MIN_CIRCLE_SIZE, startSize + dx);

      setShapes((prevShapes) =>
        prevShapes.map((s) =>
          s.id === id ? { ...s, size: newSize } : s
        )
      );
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleVertexMouseDown = (shapeId: number, vertex: number) => {
    setDraggingVertex({ shapeId, vertex });
  };

  const handleSideMouseDown = (
    shapeId: number,
    points: (keyof any["points"])[],
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    draggingSideRef.current = {
      shapeId,
      points,
      start: { x: mouseX, y: mouseY },
    };
  };

  const handleVertexDrag = (
    shapeId: number,
    vertexKey: keyof any["points"],
    newPos: { x: number; y: number }
  ) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (shape.id !== shapeId || !shape.points) return shape;

        if (shape.type === "triangle") {
          const updatedPoints = { ...shape.points, [vertexKey]: newPos };
          return { ...shape, points: updatedPoints };
        }

        if (shape.type === "square") {
          const updatedPoints = { ...shape.points, [vertexKey]: newPos };
          return { ...shape, points: updatedPoints };
        }

        return shape;
      })
    );
  };

  const handleDragStart = (type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("shape-type", type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData("shape-type");
    
    if (!shapeType) return;

    if (shapes.length >= MAX_SHAPES) {
      setShowLimitPopup(true);
      return;
    }

    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const newShape = {
      id: Date.now(),
      type: shapeType,
      color: fillColor,
    };

    if (shapeType === "circle") {
      newShape.x = dropX;
      newShape.y = dropY;
      newShape.size = 100;
    } else if (shapeType === "square") {
      const size = 100;
      newShape.points = {
        topLeft: { x: dropX, y: dropY },
        topRight: { x: dropX + size, y: dropY },
        bottomRight: { x: dropX + size, y: dropY + size },
        bottomLeft: { x: dropX, y: dropY + size },
      };
    } else if (shapeType === "triangle") {
      const size = 100;
      newShape.points = {
        top: { x: dropX, y: dropY },
        left: { x: dropX - size/2, y: dropY + size },
        right: { x: dropX + size/2, y: dropY + size },
      };
    }

    setShapes(prev => [...prev, newShape]);
    setSelectedId(newShape.id);
    setSelectedTool(null);
  };

  const pxToUnits = (px: number): number => {
    return px / 10;
  };

  const renderShape = (shape) => {
    const commonProps = {
      shape,
      isSelected: selectedId === shape.id,
      pxToUnits,
      handleShapeMouseDown,
      setSelectedId,
      fillMode,
      draggingFill,
      scale,
    };

    switch (shape.type) {
      case "square":
        return (
          <SquareShape
            key={shape.id}
            {...commonProps}
            showProperties={showProperties}
            showAngles={showAngles}
            showSides={showSides}
            showArea={showAreaByShape.square}
            onVertexMouseDown={(vertex) =>
              setDraggingVertex({ shapeId: shape.id, vertex })
            }
            onSideMouseDown={handleSideMouseDown}
            handleVertexDrag={handleVertexDrag}
          />
        );
      case "circle":
        return (
          <CircleShape
            key={shape.id}
            {...commonProps}
            handleCircleResizeMouseDown={handleCircleResizeMouseDown}
            showDiameter={showDiameter}
            showCircumference={showCircumference}
            showArea={showAreaByShape.circle}
          />
        );
      case "triangle":
        return (
          <TriangleShape
            key={shape.id}
            {...commonProps}
            handleResizeMouseDown={() => { }}
            showSides={showSides}
            showAngles={showAngles}
            showArea={showAreaByShape.triangle}
            showHeight={showHeight}
            onShapeMove={(updatedShape) => {
              setShapes(prevShapes =>
                prevShapes.map(s => s.id === updatedShape.id ? updatedShape : s)
              );
            }}
          />
        );
      default:
        return null;
    }
  };

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
    setShowLimitPopup(problem.max_attempts !== null && problem.max_attempts !== undefined);
    setLimitAttempts(problem.max_attempts || 1);
    setTimerOpen(problem.timer !== null && problem.timer !== undefined);
    setTimerValue(typeof problem.timer === 'number' ? problem.timer : 5);
    setHintOpen(problem.hint !== null && problem.hint !== undefined);
    setHint(problem.hint ?? "");
    setVisible(problem.visibility === "show");
    setShowProperties(true);  
  };

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

      return {
        ...shape,
        points: shape.points,
        sideLengths,
        area: +area.toFixed(2),
        height,
      };
    }

    return shape;
  }

  // Save handler
  const handleSave = async () => {
    if (competitionId && currentCompetition) {
      // ✨ COMPETITION MODE - SUBMIT SOLUTION
      const shapesWithProps = shapes.map(getShapeProperties);
      
      const solutionPayload = {
        competition_id: competitionId,
        problem_id: currentCompetition.current_problem_id,
        participant_solution: shapesWithProps,
        submitted_at: new Date().toISOString(),
        room_id: roomId
      };
      
      try {
        // Submit solution to competition API
        const response = await fetch('/api/competition/submit-solution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(solutionPayload)
        });
        
        if (response.ok) {
          const result = await response.json();
          
          Swal.fire({
            title: "Solution Submitted! 🎯",
            text: `Your solution has been submitted successfully! You earned ${result.xp_earned || 0} XP!`,
            icon: "success",
            confirmButtonText: "Awesome!",
            timer: 3000,
            timerProgressBar: true
          });
          
          // Clear shapes after submission
          setShapes([]);
          setSelectedId(null);
          
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit solution');
        }
      } catch (error) {
        console.error("Submit error:", error);
        Swal.fire({
          title: "Submission Error 😞",
          text: error.message || "Failed to submit solution. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
      return;
    }

    // ✨ REGULAR MODE - CREATE/EDIT PROBLEM (existing logic stays the same)
    const shapesWithProps = shapes.map(getShapeProperties);
    console.log("Saving shapes:", shapesWithProps);

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

    let message = {}
    let error_message = {}
    if (!problemId) {
      error_message = {
        title: "Error",
        text: "There was an error creating the problem. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      }
    } else {
      error_message = {
        title: "Error",
        text: "There was an error editing the problem. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      }
    }

    try {
      console.log(JSON.stringify(payload));
      if (!problemId) {
        await createProblem(payload, roomCode);
        message = {
          title: "Problem Created",
          text: "Your problem has been successfully created!",
          icon: "success",
          confirmButtonText: "OK",
        }; 
      } else {
        console.log("Editing problem with ID:", problemId);
        await updateProblem(problemId, payload);
        message = {
          title: "Problem Edited",
          text: "Your problem has been successfully edited!",
          icon: "success",
          confirmButtonText: "OK",
        }; 
      }
      await fetchProblems();
      Swal.fire(message);
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire(error_message);
    } finally {
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

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mainAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (draggingVertex) {
        setShapes(prev =>
          prev.map(s => {
            if (s.id === draggingVertex.shapeId) {
              const newPoints = { ...s.points };
              newPoints[draggingVertex.vertex] = { x: mouseX, y: mouseY };
              return { ...s, points: newPoints };
            }
            return s;
          })
        );
      }

      const draggingSide = draggingSideRef.current;
      if (draggingSide) {
        const dx = mouseX - draggingSide.start.x;
        const dy = mouseY - draggingSide.start.y;

        setShapes(prev =>
          prev.map(s => {
            if (s.id === draggingSide.shapeId) {
              const newPoints = { ...s.points };
              draggingSide.points.forEach(key => {
                newPoints[key] = {
                  x: newPoints[key].x + dx,
                  y: newPoints[key].y + dy
                };
              });
              return { ...s, points: newPoints };
            }
            return s;
          })
        );

        draggingSideRef.current = {
          ...draggingSide,
          start: { x: mouseX, y: mouseY },
        };
      }
    };

    const handleMouseUp = () => {
      setDraggingVertex(null);
      draggingSideRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingVertex]);

  // Shape dragging handler
  useEffect(() => {
    const handleMoveShape = (e: MouseEvent) => {
      if (draggingShapeId !== null) {
        const rect = mainAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newTopLeftX = mouseX - dragOffset.x;
        const newTopLeftY = mouseY - dragOffset.y;

        const snap = (value: number, step = 1) => Math.round(value / step) * step;

        setShapes(prev =>
          prev.map(s => {
            if (s.id !== draggingShapeId) return s;

            if (s.type === "triangle" && s.points?.top) {
              const referencePoint = s.points.top;

              const offsetPoints = Object.entries(s.points).map(([key, pt]) => ({
                key,
                dx: pt.x - referencePoint.x,
                dy: pt.y - referencePoint.y,
              }));

              const newPoints = Object.fromEntries(
                offsetPoints.map(({ key, dx, dy }) => [
                  key,
                  {
                    x: snap(newTopLeftX + dx, 1),
                    y: snap(newTopLeftY + dy, 1),
                  },
                ])
              );

              return { ...s, points: newPoints };
            }

            if (s.points?.topLeft) {
              const offsetPoints = Object.entries(s.points).map(([key, pt]) => ({
                key,
                dx: pt.x - s.points.topLeft.x,
                dy: pt.y - s.points.topLeft.y,
              }));

              const newPoints = Object.fromEntries(
                offsetPoints.map(({ key, dx, dy }) => [
                  key,
                  { x: newTopLeftX + dx, y: newTopLeftY + dy },
                ])
              );

              return { ...s, points: newPoints };
            }

            if (s.type === "circle") {
              return { ...s, x: newTopLeftX, y: newTopLeftY };
            }

            return s;
          })
        );
      }
    };

    const stopDragging = (e: MouseEvent) => {
      if (draggingShapeId !== null && mainAreaRef.current) {
        const rect = mainAreaRef.current.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (
          mouseX < rect.left || mouseX > rect.right ||
          mouseY < rect.top || mouseY > rect.bottom
        ) {
          setShapes(prev => prev.filter(s => s.id !== draggingShapeId));
        }
      }
      setDraggingShapeId(null);
    };

    window.addEventListener("mousemove", handleMoveShape);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMoveShape);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [draggingShapeId, dragOffset, mainAreaRef]);

  return (
    <div className={`${styles.root} ${isFullScreenMode ? styles.fullScreenGame : ''}`}>
      <div className={styles.scalableWorkspace}>
        {/* ✨ COMPETITION INFO HEADER (only show in competition mode)
        {competitionId && currentCompetition && (
          <div className={styles.competitionHeader}>
            <div className={styles.competitionInfo}>
              <span className={styles.competitionTitle}>
                🏆 {currentCompetition.title}
              </span>
              <span className={styles.problemCounter}>
                Problem {(currentCompetition.current_problem_index || 0) + 1}
              </span>
              {isLoadingProblem && <span className={styles.loading}>Loading problem...</span>}
            </div>
          </div>
        )} */}

        {/* Sidebar */}
        <div style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 8, marginBottom: 16 }}>
            <div className={styles.goBackGroup}>
              <button className={styles.arrowLeft} onClick={() => router.back()}>←</button>
              <span className={styles.goBackText}>Go back</span>
            </div>
          </div>
          
          {/* ✨ SHOW DIFFICULTY AS READ-ONLY IN COMPETITION MODE */}
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
          
          {/* ✨ TITLE - READ-ONLY IN COMPETITION MODE */}
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
          
          {/* ✨ PROMPT - READ-ONLY IN COMPETITION MODE */}
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
          
          <MainArea
            mainAreaRef={mainAreaRef}
            shapes={shapes}
            renderShape={renderShape}
            setShapes={setShapes}
            setSelectedId={setSelectedId}
            setSelectedTool={setSelectedTool}
            onDrop={handleDrop}
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
          />
          
          <div className={styles.controlsRow}>
            <div style={{ display: "flex", gap: 12 }}>
              {/* ✨ ATTEMPTS - READ-ONLY IN COMPETITION MODE */}
              {competitionId ? (
                <div className={styles.attemptsDisplay}>
                  <span className={styles.attemptsLabel}>Max Attempts:</span>
                  <span className={styles.attemptsValue}>{limitAttempts}</span>
                </div>
              ) : (
                <LimitAttempts limit={limitAttempts} setLimit={setLimitAttempts} />
              )}
              
              {/* ✨ TIMER - READ-ONLY IN COMPETITION MODE */}
              {competitionId ? (
                <div className={styles.timerDisplay}>
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
              
              {/* ✨ HINT - READ-ONLY IN COMPETITION MODE */}
              {(hintOpen || hint) ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, marginLeft: 4, marginBottom: 2 }}>
                    {competitionId ? 'Hint' : 'Hint'}
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
              
              {/* ✨ VISIBILITY - ONLY SHOW IN NON-COMPETITION MODE */}
              {!competitionId && (
                <SetVisibility visible={visible} setVisible={setVisible} />
              )}
            </div>
          </div>
        </div>
        
        {/* ✨ RIGHT SIDEBAR - ONLY SHOW PROBLEMS LIST IN NON-COMPETITION MODE */}
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