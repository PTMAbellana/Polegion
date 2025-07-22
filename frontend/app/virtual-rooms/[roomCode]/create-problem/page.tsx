"use client";

import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, use, useCallback } from "react";
import Toolbox from "./components/Toolbox";
import DifficultyDropdown from "./components/DifficultyDropdown";
import MainArea from "./components/MainArea";
import PromptBox from "./components/PromptBox";
import Timer from "./components/Timer";
import LimitAttempts from "./components/LimitAttempts";
import SetVisibility from "./components/SetVisibility";
import ShapeLimitPopup from "./components/ShapeLimitPopup";
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

export default function CreateProblem({ params }: { params: Promise<{ roomCode: string }> }) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>("");

  useEffect(() => {
    params.then(data => {
      setRoomCode(data.roomCode);
    });
  }, [params]);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = useState("Easy");

  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

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
    if (editingPrompt && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [editingPrompt]);

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

  const handleDragStart = (type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("shape-type", type);
  };

  const pxToUnits = (px: number): number => {
    return px / 10;
  };

  const handleSave = async () => {
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
    console.log("Edit problem:", problemId);
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    console.log(problem)
    setProblemId(problemId);
    setTitle(problem.title || "");
    setPrompt(problem.description || "");
    setShapes(problem.expected_solution || []);
    console.log("Loaded shapes for edit:", problem.expected_solution);
    setDifficulty(problem.difficulty || "Easy");
    
    setLimitAttempts(problem.max_attempts || 1);
    
    setTimerOpen(problem.timer !== null && problem.timer !== undefined);
    setTimerValue(typeof problem.timer === 'number' ? problem.timer : 5);
    setHintOpen(problem.hint !== null && problem.hint !== undefined);
    setHint(problem.hint ?? "");
    setVisible(problem.visibility === "show");
    setShowProperties(true);  
  }

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

  return (
    <div className={styles.root}>
      <div className={styles.scalableWorkspace}>
        <div style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 8, marginBottom: 16 }}>
            <div className={styles.goBackGroup}>
              <button className={styles.arrowLeft} onClick={() => router.back()}>←</button>
              <span className={styles.goBackText}>Go back</span>
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
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedTool={setSelectedTool}
            saveButton={
              <button className={`${styles.saveBtn} ${styles.rowBtn} ${styles.saveBtnFloating}`} onClick={handleSave}>
                Save
              </button>
            }
            shapeLimit={MAX_SHAPES}
            shapeCount={shapes.length}
            onLimitReached={() => setShowLimitPopup(true)}
            onAllShapesDeleted={handleAllShapesDeleted}
            pxToUnits={pxToUnits}
            showAreaByShape={showAreaByShape}
            showSides={showSides}
            showAngles={showAngles}
            showDiameter={showDiameter}
            showCircumference={showCircumference}
            showHeight={showHeight}
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
      </div>
      {showLimitPopup && (
        <ShapeLimitPopup onClose={() => setShowLimitPopup(false)} />
      )}
    </div>
  );
}