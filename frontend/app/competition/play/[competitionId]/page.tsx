"use client";

import React, { use, useEffect, useState, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import createProblemStyles from '@/styles/create-problem.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { myAppHook } from '@/context/AppUtils';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { getRoomProblems } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getCompeById } from '@/api/competitions';
import { createProblem, deleteProblem, getRoomProblemsByCode, updateProblem } from '@/api/problems';
import Swal from "sweetalert2";

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

// Interfaces
interface Participant {
  id: number;
  fullName?: string;
  accumulated_xp: number | 0;
}

interface Problems {
    id: string
    title?: string | 'No Title'
    description: string
    difficulty: string
    max_attempts: number
    expected_xp: number
    timer: number | null
}

interface Competition {
  title: string;
  status: string;
}

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

// ALL Constants from create-problem
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

const CompetitionDashboard = ({ params } : { params  : Promise<{competitionId : number }> }) => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const compe_id = use(params)
  const router = useRouter();

  // Competition states
  const [sortOrder, setSortOrder] = useState('desc');
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [problems, setProblems] = useState<Problems[]>([])
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [competition, setCompetition] = useState<Competition | undefined>(undefined)

  // ALL Create-problem states (EXACTLY from original)
  const [createProblems, setCreateProblems] = useState<Problem[]>([]);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [draggingVertex, setDraggingVertex] = useState<{ shapeId: number; vertex: number } | null>(null);
  const [draggingShapeId, setDraggingShapeId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const draggingSideRef = useRef<{ shapeId: number; points: (keyof any["shape"]["points"])[]; start: { x: number; y: number }; } | null>(null);
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

  const { isLoggedIn } = myAppHook()
  const { isLoading: authLoading } = AuthProtection()

  // Competition logic
  useEffect(() => {
      if (isLoggedIn && !authLoading && !fetched) {
          callMe()
          setFetched(true)
      } else {
          if (authLoading || !isLoggedIn) {
              setIsLoading(true)
          }
      }
  }, [isLoggedIn, authLoading, fetched])

  const callMe = async () => {
    try {
        setIsLoading(true)
        const parts = await getAllParticipants(roomId, 'creator', true, compe_id.competitionId)
        setParticipants(parts.data.participants || [])
        
        const probs = await getRoomProblems(roomId)
        setProblems(probs)

        const compe = await getCompeById(roomId, compe_id.competitionId)
        setCompetition(compe)

        setActiveProblems([]);
    } catch (error) {
        console.error('Error fetching competition details:', error)
    } finally {
        setIsLoading(false)
    }
  }

  // ALL Create-problem fetch logic
  const fetchCreateProblems = useCallback(async () => {
    if (!roomId) return;
    try {
      const data = await getRoomProblemsByCode(roomId);
      setCreateProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }, [roomId]);

  useEffect(() => {
    fetchCreateProblems();
  }, [fetchCreateProblems]);

  // ALL Create-problem handlers (EXACTLY from original)
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

    const topLeft = shape.points?.topLeft;
    if (!topLeft) return;

    const offsetX = e.clientX - rect.left - topLeft.x;
    const offsetY = e.clientY - rect.top - topLeft.y;

    setDraggingShapeId(id);
    setDragOffset({ x: offsetX, y: offsetY });
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

        const updatedPoints = { ...shape.points, [vertexKey]: newPos };
        const pointArray = [
          updatedPoints.topLeft,
          updatedPoints.topRight,
          updatedPoints.bottomRight,
          updatedPoints.bottomLeft,
        ];

        const isSelfIntersecting = (points: any[]) => {
          const doLinesIntersect = (p1, p2, p3, p4) => {
            const ccw = (a, b, c) =>
              (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
            return (
              ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
              ccw(p1, p2, p3) !== ccw(p1, p2, p4)
            );
          };

          for (let i = 0; i < points.length; i++) {
            const a1 = points[i];
            const a2 = points[(i + 1) % points.length];
            for (let j = i + 1; j < points.length; j++) {
              if (Math.abs(i - j) <= 1 || (i === 0 && j === points.length - 1))
                continue;
              const b1 = points[j];
              const b2 = points[(j + 1) % points.length];
              if (doLinesIntersect(a1, a2, b1, b2)) return true;
            }
          }
          return false;
        };

        if (isSelfIntersecting(pointArray)) return shape;
        return { ...shape, points: updatedPoints };
      })
    );
  };

  const handleDragStart = (type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("shape-type", type);
  };

  const pxToUnits = (px: number): string => {
    const units = px / 10;
    return `${units.toFixed(1)} units`;
  };

  // ALL useEffects from create-problem (EXACTLY)
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

  useEffect(() => {
    const handleMoveShape = (e: MouseEvent) => {
      if (draggingShapeId !== null) {
        const rect = mainAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newTopLeftX = mouseX - dragOffset.x;
        const newTopLeftY = mouseY - dragOffset.y;

        setShapes(prev =>
          prev.map(s => {
            if (s.id !== draggingShapeId) return s;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleW = w / 1920;
      const scaleH = h / 1080;
      setScale(Math.min(scaleW, scaleH));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (editingPrompt && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [editingPrompt]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId !== null) {
        setShapes(prev => {
          const newShapes = prev.filter(shape => shape.id !== selectedId);

          if (newShapes.length === 0) {
            setShowSides(false);
            setShowAngles(false);
            setShowArea(false);
            setShowHeight(false);
            setShowDiameter(false);
            setShowCircumference(false);
          }

          return newShapes;
        });
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rect = mainAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      setShapes((prev) =>
        prev.filter((s) => {
          const referencePoint = s.points?.topLeft || s.points?.center || { x: s.x, y: s.y };

          return (
            referencePoint.x > -80 &&
            referencePoint.y > -80 &&
            referencePoint.x < rect.width + 80 &&
            referencePoint.y < rect.height + 80
          );
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Render shape function (EXACTLY from original)
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
          />
        );
      default:
        return null;
    }
  };

  // ALL Create-problem functions (EXACTLY from original)
  const handleSave = async () => {
    const payload = {
      title,
      description: prompt,
      expected_solution: shapes,
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
        await createProblem(payload, roomId);
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
      await fetchCreateProblems();
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

  const handleDeleteProblem = async (problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      await deleteProblem(problemId);
      setCreateProblems(prev => prev.filter(p => p.id !== problemId));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const handleEditProblem = async (problemId: string) => { 
    console.log("Edit problem:", problemId);
    const problem = createProblems.find(p => p.id === problemId);
    if (!problem) return;
    console.log(problem)
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
  }

  // Competition timer logic
  const activeProblemsList = problems.filter((p) => activeProblems.includes(p.id));
  const totalTimerSeconds = activeProblemsList.reduce((acc, p) => acc + (p.timer || 0), 0);
  
  useEffect(() => {
    setTimer(totalTimerSeconds);
  }, [totalTimerSeconds]);

  useEffect(() => {
    if (!isPaused && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, timer]);

  if (isLoading || authLoading) {
    return (
      <div className={styles["dashboard-container"]}>
        <div className={styles["loading-container"]}>
          <Loader/>
        </div>
      </div>
    )
  }

  const sortedParticipants = [...participants].sort((a, b) => {
    return sortOrder === 'desc' ? b.accumulated_xp - a.accumulated_xp : a.accumulated_xp - b.accumulated_xp;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              {competition?.title || 'Competition'}
            </h1>
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>{competition?.status}</span>
            </p>
            <p className={styles.description}>
              Compete with your classmates and earn XP by solving problems!
            </p>
          </div>
        </div>

        {/* Timer Section */}
        <div className={styles.timerSection}>
          <div className={styles.timerContent}>
            <div className={styles.timer}>
              {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
            </div>
            <div className={styles.timerStatus}>
              <span className={styles.timerLabel}>
                {timer === 0 ? 'No active problems' : isPaused ? 'Competition Paused' : 'Competition Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={styles.roomContent}>
          {/* Left Column - Competition Problems */}
          <div className={styles.leftColumn}>
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Competition Problems</h2>
              </div>
              <div className={styles.participantsList}>
                {activeProblemsList.length > 0 ? (
                  activeProblemsList.map((problem, index) => (
                    <div key={problem.id} className={styles.participantCard}>
                      <div className={styles.participantContent}>
                        <div className={styles.participantLeft}>
                          <div className={styles.participantRank}>{index + 1}</div>
                          <div>
                            <h3 className={styles.participantName}>{problem.title || 'No Title'}</h3>
                            <div className={styles.problemMeta}>
                              <span className={styles.problemDifficulty} data-difficulty={problem.difficulty}>
                                {problem.difficulty}
                              </span>
                              <span className={styles.problemXp}>{problem.expected_xp} XP</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.participantRight}>
                          <div className={styles.participantXp}>
                            {problem.timer != null && problem.timer > 0 ? `${problem.timer}s` : 'No timer'}
                          </div>
                          <button className={styles.solveButton} onClick={() => console.log('Solve problem:', problem.id)}>
                            Solve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <p>No problems added yet</p>
                    <span>Wait for the room creator to add problems to start competing!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className={styles.rightColumn}>
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Leaderboard</h2>
                <div className={styles.sortControls}>
                  <button onClick={toggleSort} className={styles.sortButton}>
                    <div className={styles.sortIcons}>
                      <ChevronUp className={`w-3 h-3 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <ChevronDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <span className={styles.sortText}>
                      {sortOrder === 'desc' ? 'Desc' : 'Asc'}
                    </span>
                  </button>
                </div>
              </div>
              <div className={styles.participantsList}>
                {sortedParticipants.length > 0 ? (
                  sortedParticipants.map((participant, index) => (
                    <div key={participant.id} className={styles.participantCard}>
                      <div className={styles.participantContent}>
                        <div className={styles.participantLeft}>
                          <div className={`${styles.participantRank} ${index < 3 ? styles[`rank${index + 1}`] : ''}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className={styles.participantName}>
                              {participant.fullName}
                            </h3>
                          </div>
                        </div>
                        <div className={styles.participantRight}>
                          <div className={styles.participantXp}>{participant.accumulated_xp} XP</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👥</div>
                    <p>No participants yet</p>
                    <span>Participants will appear here once they join</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COMPLETE CREATE-PROBLEM SECTION */}
        <div className={styles.createProblemSection}>
          <div className={styles.sectionDivider}>
            <h2 className={styles.sectionTitle}>🎯 Problem Creation Studio</h2>
            <p className={styles.sectionSubtitle}>Create and manage problems for this competition</p>
          </div>

          <div className={createProblemStyles.root}>
            <div className={createProblemStyles.scalableWorkspace}>
              {/* Sidebar */}
              <div style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 8, marginBottom: 16 }}>
                  <div className={createProblemStyles.goBackGroup}>
                    <button className={createProblemStyles.arrowLeft} onClick={() => router.back()}>←</button>
                    <span className={createProblemStyles.goBackText}>Go back</span>
                  </div>
                </div>
                <DifficultyDropdown difficulty={difficulty} setDifficulty={setDifficulty} />
                <Toolbox
                  shapes={shapes}
                  disableDrag={shapes.length >= 1}
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
              <div className={createProblemStyles.mainColumn}>
                <div style={{ height: 32 }} />
                <div className={createProblemStyles.formRow}>
                  <input className={createProblemStyles.input} placeholder="Problem Title" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className={createProblemStyles.promptGroup}>
                  <PromptBox
                    prompt={prompt}
                    setPrompt={setPrompt}
                    editingPrompt={editingPrompt}
                    setEditingPrompt={setEditingPrompt}
                    promptInputRef={promptInputRef}
                  />
                </div>
                <MainArea
                  mainAreaRef={mainAreaRef}
                  shapes={shapes}
                  renderShape={renderShape}
                  setShapes={setShapes}
                  setSelectedId={setSelectedId}
                  setSelectedTool={setSelectedTool}
                  saveButton={
                    <button className={`${createProblemStyles.saveBtn} ${createProblemStyles.rowBtn} ${createProblemStyles.saveBtnFloating}`} onClick={handleSave}>
                      Save Problem
                    </button>
                  }
                  shapeLimit={MAX_SHAPES}
                  shapeCount={shapes.length}
                  onLimitReached={() => setShowLimitPopup(true)}
                />
                <div className={createProblemStyles.controlsRow}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <LimitAttempts limit={limitAttempts} setLimit={setLimitAttempts} />
                    {!timerOpen ? (
                      <button className={`${createProblemStyles.addTimerBtn} ${createProblemStyles.rowBtn}`} onClick={() => setTimerOpen(true)}>
                        Add Timer
                      </button>
                    ) : (
                      <Timer timerOpen={timerOpen} setTimerOpen={setTimerOpen} timerValue={timerValue} setTimerValue={setTimerValue} />
                    )}
                    {(hintOpen || hint) ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, marginLeft: 4, marginBottom: 2 }}>Hint</span>
                        <input
                          className={createProblemStyles.hintInput}
                          type="text"
                          value={hint}
                          onChange={e => setHint(e.target.value)}
                          onBlur={() => { if (!hint) setHintOpen(false); }}
                          placeholder="Enter hint..."
                          autoFocus={hintOpen}
                        />
                      </div>
                    ) : (
                      <button className={`${createProblemStyles.addHintBtn} ${createProblemStyles.rowBtn}`} onClick={() => setHintOpen(true)}>
                        Add Hint
                      </button>
                    )}
                    <SetVisibility visible={visible} setVisible={setVisible} />
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Existing Problems */}
              <div className={createProblemStyles.problemsSection}>
                <div className={createProblemStyles.problemsSectionHeader}>
                  Existing Problems
                </div>
                <div className={createProblemStyles.problemsContent}>
                  {createProblems.length > 0 ? (
                    <ul className={createProblemStyles.problemList}>
                      {createProblems.map(problem => (
                        <li key={problem.id} className={createProblemStyles.problemItem}>
                          <div className={createProblemStyles.problemItemHeader}>
                            <div className={createProblemStyles.problemTitle}>
                              {problem.title || "Untitled Problem"}
                            </div>
                            <button 
                              onClick={() => handleEditProblem(problem.id)} 
                              title="Edit this problem"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProblem(problem.id)} 
                              className={createProblemStyles.deleteButton}
                              title="Delete this problem"
                            >
                              Delete
                            </button>
                          </div>
                          <div className={createProblemStyles.problemDetails}>
                            <span 
                              className={createProblemStyles.problemDifficulty} 
                              style={{ backgroundColor: DIFFICULTY_COLORS[problem.difficulty] }}
                            >
                              {problem.difficulty}
                            </span>
                            <span 
                              className={`${createProblemStyles.problemVisibility} ${createProblemStyles[problem.visibility]}`}
                            >
                              {problem.visibility}
                            </span>
                            <div className={createProblemStyles.problemMeta}>
                              <span className={createProblemStyles.problemAttempts}>
                                {problem.max_attempts} {problem.max_attempts === 1 ? 'attempt' : 'attempts'}
                              </span>
                              <span className={createProblemStyles.problemXp}>
                                {problem.expected_xp} XP
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={createProblemStyles.noProblems}>
                      <div className={createProblemStyles.noProblemsIcon}>📝</div>
                      <div className={createProblemStyles.noProblemsText}>
                        No problems created yet.
                      </div>
                      <div className={createProblemStyles.noProblemsSubtext}>
                        Create your first problem to get started!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLimitPopup && (
        <ShapeLimitPopup onClose={() => setShowLimitPopup(false)} />
      )}
    </div>
  );
};

export default CompetitionDashboard;