"use client";

import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, use } from "react";
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
import { createProblem } from '@/api/problems'

const FILL_COLORS = [
  "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf",
  "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#E3DCC2"
];

const DIFFICULTY_COLORS = {
  Easy: "#8FFFC2",
  Intermediate: "#FFFD9B",
  Hard: "#FFB49B",
};

const XP_MAP = { Easy: 10, Intermediate: 20, Hard: 30 }; // 🔹 XP by difficulty

export default function CreateProblem({ params } : { params  : Promise<{roomCode : string }> }) {
  const router = useRouter();
  const roomCode = use(params)

  // 🆕 New form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = useState("Easy");

  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const mainAreaRef = useRef<HTMLDivElement>(null);

  // Fill Tool state

  const [fillMode, setFillMode] = useState(false);
  const [fillColor, setFillColor] = useState("#E3DCC2");
  const [draggingFill, setDraggingFill] = useState(false);

  // Toolbox highlight state
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

  // Dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Responsive scaling
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

  // Focus textarea when editingPrompt becomes true
  useEffect(() => {
    if (editingPrompt && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [editingPrompt]);

  // Remove shape when Delete key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId !== null) {
        setShapes((prev) => prev.filter((shape) => shape.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  // Fill palette close on outside click
  useEffect(() => {
    function handleClickOutsideFill(event: MouseEvent) {
      const fillTool = document.querySelector('.shapeFillTool');
      const fillPalette = document.querySelector('.fillPalette');
      if (fillTool && fillPalette && fillMode) {
        const clickedInsideFillTool = fillTool.contains(event.target as Node);
        const clickedInsidePalette = fillPalette.contains(event.target as Node);
        if (!clickedInsideFillTool && !clickedInsidePalette) {
          setFillMode(false);
        }
      } else if (fillTool && fillMode) {
        if (!fillTool.contains(event.target as Node)) {
          setFillMode(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutsideFill);
    return () => document.removeEventListener("mousedown", handleClickOutsideFill);
  }, [fillMode]);

  // Drag and drop logic
  const handleDragStart = (type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("shape-type", type);
  };

  // Render shape (NO drag, drop, or resize logic)
  const renderShape = (shape: any) => {
    if (shape.type === "square") {
      return (
        <SquareShape
          key={shape.id}
          shape={shape}
          isSelected={selectedId === shape.id}
          onUpdate={update =>
            setShapes(prev =>
              prev.map(s =>
                s.id === shape.id ? { ...s, ...update } : s
              )
            )
          }
          showProperties={showProperties}
          showSides={showSides}
          showAngles={showAngles}
          showArea={showArea}
        />
      );
    }
    if (shape.type === "circle") {
      return (
        <CircleShape
          key={shape.id}
          shape={shape}
          isSelected={selectedId === shape.id}
          scale={scale}
          showDiameter={showDiameter}
          showCircumference={showCircumference}
          showArea={showArea}
        />
      );
    }
    if (shape.type === "triangle") {
      return (
        <TriangleShape
          key={shape.id}
          shape={shape}
          isSelected={selectedId === shape.id}
          showSides={showSides}
          showAngles={showAngles}
          showArea={showArea}
          showHeight={showHeight}
        />
      );
    }
  };

  // 🔹 Submit to backend
  const handleSave = async () => {
    const payload = {
      title,
      description,
      expected_solution: shapes,
      difficulty,
      visibility: visible ? "show" : "hide",
      max_attempts: limitAttempts,
      expected_xp: XP_MAP[difficulty],
    };

    // console.log('data ni shapes: ', shapes)

    try {
      console.log(JSON.stringify(payload))
      await createProblem(payload, roomCode.roomCode) 
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.scalableWorkspace}>
        {/* Sidebar group: Difficulty dropdown above Toolbox */}
        <div
          style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}
          className={dropdownOpen ? styles.dropdownActive : undefined}
        >
          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 8, marginBottom: 16 }}>
            <div className={styles.goBackGroup}>
              <button className={styles.arrowLeft} onClick={() => router.back()}>
                ←
              </button>
              <span className={styles.goBackText}>Go back</span>
            </div>
          </div>
          <DifficultyDropdown
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
          {dropdownOpen && (
            <div className={styles.difficultyDropdownMenu} style={{ width: "100%" }}>
              {["Easy", "Intermediate", "Hard"].map((diff) => (
                <div
                  key={diff}
                  className={styles.difficultyDropdownItem}
                  style={{
                    background: DIFFICULTY_COLORS[diff],
                    color: "#2c514c",
                    fontWeight: 600,
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setDifficulty(diff);
                    setDropdownOpen(false);
                  }}
                >
                  {diff}
                </div>
              ))}
            </div>
          )}
          <Toolbox
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            handleDragStart={handleDragStart}
            fillColor={fillColor}
            fillMode={fillMode}
            setFillMode={setFillMode}
            handleFillDragStart={() => {}}
            handleFillDragEnd={() => {}}
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
        
        <div className={styles.mainColumn}>
          <div style={{ height: 32 }} />
          {/* 🔹 Form Inputs */}
          <div className={styles.formRow}>
            <input className={styles.input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className={styles.input} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {/* Prompt */}
          <div className={styles.promptGroup}>
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              editingPrompt={editingPrompt}
              setEditingPrompt={setEditingPrompt}
              promptInputRef={promptInputRef}
            />
          </div>
          {/* Main Area */}
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
          {/* Controls Row (Timer, Hint, etc) */}
          <div className={styles.controlsRow}>
            <div style={{ display: "flex", gap: 12 }}>
              <LimitAttempts limit={limitAttempts} setLimit={setLimitAttempts} />
              {!timerOpen ? (
                <button
                  className={`${styles.addTimerBtn} ${styles.rowBtn}`}
                  onClick={() => setTimerOpen(true)}
                >
                  Add Timer
                </button>
              ) : (
                <Timer
                  timerOpen={timerOpen}
                  setTimerOpen={setTimerOpen}
                  timerValue={timerValue}
                  setTimerValue={setTimerValue}
                />
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
                <button
                  className={`${styles.addHintBtn} ${styles.rowBtn}`}
                  onClick={() => setHintOpen(true)}
                >
                  Add Hint
                </button>
              )}
              <SetVisibility visible={visible} setVisible={setVisible} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}