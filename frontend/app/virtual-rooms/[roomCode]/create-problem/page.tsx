"use client";

import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, use, useCallback } from "react";
import Toolbox from "./components/Toolbox";
import DifficultyDropdown from "./components/DifficultyDropdown";
import MainArea from "./components/MainArea";
import PromptBox from "./components/PromptBox";
import SquareShape from "./shapes/SquareShape";
import CircleShape from "./shapes/CircleShape";
import TriangleShape from "./shapes/TriangleShape";
import Timer from "./components/Timer";
import LimitAttempts from "./components/LimitAttempts";
import SetVisibility from "./components/SetVisibility";
import { createProblem, deleteProblem, getRoomProblemsByCode } from '@/api/problems'

interface Problem {
  id: string
  title?: string | null
  description?: string | null
  visibility: string
  expected_solution?: any[]
  difficulty: string
  max_attempts: number
  expected_xp: number
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

export default function CreateProblem({ params }: { params: Promise<{ roomCode: string }> }) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>("");

  useEffect(() => {
    params.then(data => {
      setRoomCode(data.roomCode);
    });
  }, [params]);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [title, setTitle] = useState("");

  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const [draggingVertex, setDraggingVertex] = useState<{ shapeId: number; vertex: number } | null>(null);
  const [draggingShapeId, setDraggingShapeId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [draggingSide, setDraggingSide] = useState<{
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

  const [showSides, setShowSides] = useState(false);
  const [showAngles, setShowAngles] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showHeight, setShowHeight] = useState(false);
  const [showDiameter, setShowDiameter] = useState(false);
  const [showCircumference, setShowCircumference] = useState(false);

  const fetchProblems = useCallback(async () => {
    if (!roomCode) return;
    try {
      const data = await getRoomProblemsByCode(roomCode);
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }, [roomCode]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);


  const handleShapeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const shape = shapes.find(s => s.id === id);
    if (!shape) return;

    const topLeft = shape.points?.topLeft;
    if (!topLeft) return;

    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left - topLeft.x;
    const offsetY = e.clientY - rect.top - topLeft.y;

    setDraggingShapeId(id);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleVertexMouseDown = (shapeId: number, vertex: number) => {
    setDraggingVertex({ shapeId, vertex });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingVertex) {
        const rect = mainAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

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

      if (draggingSide) {
        const rect = mainAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

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

        setDraggingSide(prev => prev ? {
          ...prev,
          start: { x: mouseX, y: mouseY }
        } : null);
      }
    };

    const handleMouseUp = () => {
      setDraggingVertex(null);
      setDraggingSide(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingVertex, draggingSide]);

  // ✅ NEW USEEFFECT FOR DRAGGING WHOLE SHAPE
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

            const offsetPoints = Object.entries(s.points).map(([key, pt]) => ({
              key,
              dx: pt.x - s.points.topLeft.x,
              dy: pt.y - s.points.topLeft.y,
            }));

            const newPoints = Object.fromEntries(
              offsetPoints.map(({ key, dx, dy }) => [
                key,
                { x: newTopLeftX + dx, y: newTopLeftY + dy }
              ])
            );

            return { ...s, points: newPoints };
          })
        );
      }
    };

    const stopDragging = () => {
      setDraggingShapeId(null);
    };

    window.addEventListener("mousemove", handleMoveShape);
    window.addEventListener("mouseup", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleMoveShape);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [draggingShapeId, dragOffset]);

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
        setShapes(prev => prev.filter(shape => shape.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const handleDragStart = (type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("shape-type", type);
  };

  const pxToUnits = (px: number): string => {
    const units = px / 10;
    return `${units.toFixed(1)} units`;
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
            onVertexMouseDown={(vertex) =>
              setDraggingVertex({ shapeId: shape.id, vertex })
            }
            onSideMouseDown={(side, point, e) => {
              e.stopPropagation();
              const rect = mainAreaRef.current?.getBoundingClientRect();
              if (!rect) return;
              const start = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              };
              const pointMapping = {
                top: ["topLeft", "topRight"],
                right: ["topRight", "bottomRight"],
                bottom: ["bottomRight", "bottomLeft"],
                left: ["bottomLeft", "topLeft"],
              };
              setDraggingSide({
                shapeId: shape.id,
                points: pointMapping[side],
                start,
              });
            }}
          />
        );
      case "circle":
        return (
          <CircleShape
            key={shape.id}
            {...commonProps}
            handleCircleResizeMouseDown={() => { }}
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
            showArea={showArea}
            showHeight={showHeight}
          />
        );
      default:
        return null;
    }
  };

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
      // hint: hintOpen ? hint : null,
    };

    try {
      console.log(JSON.stringify(payload));
      await createProblem(payload, roomCode);
      await fetchProblems(); // Refresh problems after saving
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      // Call API to delete the problem
      await deleteProblem(problemId);
      setProblems(prev => prev.filter(p => p.id !== problemId));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.scalableWorkspace}>
        {/* Sidebar */}
        <div style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 8, marginBottom: 16 }}>
            <div className={styles.goBackGroup}>
              <button className={styles.arrowLeft} onClick={() => router.back()}>←</button>
              <span className={styles.goBackText}>Go back</span>
            </div>
          </div>
          <DifficultyDropdown difficulty={difficulty} setDifficulty={setDifficulty} />
          <Toolbox
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            handleDragStart={handleDragStart}
            fillColor={fillColor}
            fillMode={fillMode}
            setFillMode={setFillMode}
            handleFillDragStart={() => { }}
            handleFillDragEnd={() => { }}
            FILL_COLORS={FILL_COLORS}
            setFillColor={setFillColor}
            showProperties={showProperties}
            setShowProperties={setShowProperties}
            showSides={showSides} setShowSides={setShowSides}
            showAngles={showAngles} setShowAngles={setShowAngles}
            showArea={showArea} setShowArea={setShowArea}
            showHeight={showHeight} setShowHeight={setShowHeight}
            showDiameter={showDiameter} setShowDiameter={setShowDiameter}
            showCircumference={showCircumference} setShowCircumference={setShowCircumference}
          />
        </div>

        {/* Main Column */}
        <div className={styles.mainColumn}>
          <div style={{ height: 32 }} />
          <div className={styles.formRow}>
            <input className={styles.input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={styles.promptGroup}>
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
              <button className={`${styles.saveBtn} ${styles.rowBtn} ${styles.saveBtnFloating}`} onClick={handleSave}>
                Save
              </button>
            }
          />
          <div className={styles.controlsRow}>
            <div style={{ display: "flex", gap: 12 }}>
              <LimitAttempts limit={limitAttempts} setLimit={setLimitAttempts} />
              {!timerOpen ? (
                <button className={`${styles.addTimerBtn} ${styles.rowBtn}`} onClick={() => setTimerOpen(true)}>
                  Add Timer
                </button>
              ) : (
                <Timer timerOpen={timerOpen} setTimerOpen={setTimerOpen} timerValue={timerValue} setTimerValue={setTimerValue} />
              )}
              {(hintOpen || hint) ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, marginLeft: 4, marginBottom: 2 }}>Hint</span>
                  <input
                    className={styles.hintInput}
                    type="text"
                    value={hint}
                    onChange={e => setHint(e.target.value)}
                    onBlur={() => { if (!hint) setHintOpen(false); }}
                    placeholder="Enter hint..."
                    autoFocus={hintOpen}
                  />
                </div>
              ) : (
                <button className={`${styles.addHintBtn} ${styles.rowBtn}`} onClick={() => setHintOpen(true)}>
                  Add Hint
                </button>
              )}
              <SetVisibility visible={visible} setVisible={setVisible} />
            </div>
          </div>
        </div>
        {/* Right Sidebar */}
        <div>
          <div>Existing Problems</div>
          {
            problems.length > 0 ? (
              <ul className={styles.problemList}>
                {problems.map(problem => (
                  <li key={problem.id} className={styles.problemItem}>
                    <button onClick={() => handleDeleteProblem (problem.id)} className={styles.deleteButton}>
                      Delete
                    </button>
                    <div className={styles.problemTitle}>{problem.title || "Untitled Problem"}</div>
                    <div className={styles.problemDetails}>
                      <span className={styles.problemDifficulty} style={{ backgroundColor: DIFFICULTY_COLORS[problem.difficulty] }}>
                        {problem.difficulty}
                      </span>
                      <span className={styles.problemVisibility}>{problem.visibility}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.noProblems}>No problems created yet.</div>
            )
          }
        </div>
      </div>
    </div>
  );
}
