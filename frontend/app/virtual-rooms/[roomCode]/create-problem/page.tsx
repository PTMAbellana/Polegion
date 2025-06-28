"use client";
import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Toolbox from "./components/Toolbox";
import DifficultyDropdown from "./components/DifficultyDropdown";
import MainArea from "./components/MainArea";
import Timer from "./components/Timer";
import HintBox from "./components/HintBox";
import PromptBox from "./components/PromptBox";
import SquareShape from "./shapes/SquareShape";
import CircleShape from "./shapes/CircleShape";
import TriangleShape from "./shapes/TriangleShape";

const DIFFICULTY_COLORS = {
  Easy: "#8FFFC2",
  Intermediate: "#FFFD9B",
  Hard: "#FFB49B",
};

const FILL_COLORS = [
  "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf",
  "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#E3DCC2"
];

const DEFAULT_SIZE = 100;
const MIN_SIZE = 50;

function pxToUnits(px: number) {
  const units = (px / 50).toFixed(2).replace(/\.00$/, "");
  return `${units} units`;
}

export default function CreateProblem() {
  const router = useRouter();
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const [difficulty, setDifficulty] = useState("Easy");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Timer and Hint UI state
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerValue, setTimerValue] = useState(5);
  const [hintOpen, setHintOpen] = useState(false);
  const [hint, setHint] = useState("");

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

  // Toolbox drag
  const handleDragStart = (type: string) => {
    setDraggedShape(type);
    setSelectedTool(null);
  };

  const MAIN_AREA_HEADER_HEIGHT = 48; // px, match your .mainAreaHeader height

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const header = e.currentTarget.querySelector(`.${styles.mainAreaHeader}`) as HTMLElement;
    const headerHeight = header ? header.offsetHeight : 0;
    const x = (e.clientX - rect.left - DEFAULT_SIZE / 2) / scale;
    const y = (e.clientY - rect.top - headerHeight - DEFAULT_SIZE / 2) / scale;
    setShapes([
      ...shapes,
      {
        id: Date.now(),
        type: draggedShape,
        x,
        y,
        width: draggedShape === "square" ? DEFAULT_SIZE : undefined,
        height: draggedShape === "square" ? DEFAULT_SIZE : undefined,
        size: DEFAULT_SIZE,
        fill: "#E3DCC2",
      },
    ]);
    setDraggedShape(null);
    setSelectedTool(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Move shape
  const handleShapeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);

    // Get header height
    const header = mainAreaRef.current?.querySelector(`.${styles.mainAreaHeader}`) as HTMLElement;
    const headerHeight = header ? header.offsetHeight : 0;

    dragOffset.current = {
      x: (e.clientX - shape.x * scale),
      y: (e.clientY - (shape.y + headerHeight) * scale),
    };
    const onMouseMove = (moveEvent: MouseEvent) => {
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === id
            ? {
                ...shape,
                x: (moveEvent.clientX - dragOffset.current.x) / scale,
                y: (moveEvent.clientY - dragOffset.current.y) / scale,
              }
            : shape
        )
      );
    };
    const onMouseUp = (moveEvent: MouseEvent) => {
      if (mainAreaRef.current) {
        const areaRect = mainAreaRef.current.getBoundingClientRect();
        const shapeObj = shapes.find((s) => s.id === id);
        const x = (moveEvent.clientX - dragOffset.current.x) / scale;
        const y = (moveEvent.clientY - dragOffset.current.y) / scale;
        const shapeW = shapeObj.width ?? shapeObj.size ?? 0;
        const shapeH = shapeObj.height ?? shapeObj.size ?? 0;
        if (
          x < 0 ||
          y < 0 ||
          x > 1080 - shapeW ||
          y > 591 - shapeH
        ) {
          setShapes((prev) => prev.filter((shape) => shape.id !== id));
          setSelectedId(null);
        }
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Square resize
  const handleSquareResize = (id: number, side: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = shape.width ?? shape.size;
    const startHeight = shape.height ?? shape.size;
    const startXPos = shape.x;
    const startYPos = shape.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id !== id) return shape;
          if (side === "right") {
            return { ...shape, width: Math.max(MIN_SIZE, startWidth + ((moveEvent.clientX - startX) / scale) * 0.1) };
          }
          if (side === "left") {
            const delta = ((moveEvent.clientX - startX) / scale) * 0.1;
            const newWidth = Math.max(MIN_SIZE, startWidth - delta);
            return {
              ...shape,
              x: startXPos + (newWidth < MIN_SIZE ? startWidth - MIN_SIZE : delta),
              width: newWidth,
            };
          }
          if (side === "bottom") {
            return { ...shape, height: Math.max(MIN_SIZE, startHeight + ((moveEvent.clientY - startY) / scale) * 0.1) };
          }
          if (side === "top") {
            const delta = ((moveEvent.clientY - startY) / scale) * 0.1;
            const newHeight = Math.max(MIN_SIZE, startHeight - delta);
            return {
              ...shape,
              y: startYPos + (newHeight < MIN_SIZE ? startHeight - MIN_SIZE : delta),
              height: newHeight,
            };
          }
          return shape;
        })
      );
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Circle/triangle resize
  const handleResizeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);
    const startX = e.clientX;
    const startSize = shape.size;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = ((moveEvent.clientX - startX) / scale) * 0.1;
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === id
            ? { ...shape, size: Math.max(MIN_SIZE, startSize + delta) }
            : shape
        )
      );
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Circle resize handler
  const handleCircleResizeMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);
    const size = shape.size;
    const r = size / 2;
    const rect = (e.target as HTMLElement).closest("div[style]")!.getBoundingClientRect();
    const centerX = rect.left + r * scale;
    const startSize = shape.size;

    document.body.style.cursor = "ew-resize";

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - centerX) / scale;
      const newRadius = Math.abs(dx);
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === id
            ? { ...shape, size: Math.max(MIN_SIZE, newRadius * 2) }
            : shape
        )
      );
    };
    const onMouseUp = () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Fill Tool Drag
  const handleFillDragStart = (e: React.DragEvent) => {
    setDraggingFill(true);
    e.dataTransfer.setData("text/plain", "fill-color");
    e.dataTransfer.effectAllowed = "copy";
    const img = document.createElement("div");
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.background = fillColor;
    img.style.borderRadius = "50%";
    img.style.border = "2px solid #000";
    document.body.appendChild(img);
    e.dataTransfer.setDragImage(img, 12, 12);
    setTimeout(() => document.body.removeChild(img), 0);
  };
  const handleFillDragEnd = () => setDraggingFill(false);

  // Render shape
  const renderShape = (shape: any) => {
    const isSelected = selectedId === shape.id;
    const handleShapeDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const data = e.dataTransfer.getData("text/plain");
      if (data === "fill-color" && draggingFill && fillMode) {
        setShapes((prev) =>
          prev.map((s) =>
            s.id === shape.id ? { ...s, fill: fillColor } : s
          )
        );
      }
    };

    if (shape.type === "square") {
      return (
        <SquareShape
          key={shape.id}
          shape={shape}
          isSelected={isSelected}
          pxToUnits={pxToUnits}
          handleShapeMouseDown={handleShapeMouseDown}
          setSelectedId={setSelectedId}
          handleShapeDrop={handleShapeDrop}
          handleSquareResize={handleSquareResize}
          fillMode={fillMode}
          draggingFill={draggingFill}
        />
      );
    }
    if (shape.type === "circle") {
      return (
        <CircleShape
          key={shape.id}
          shape={shape}
          isSelected={isSelected}
          pxToUnits={pxToUnits}
          handleShapeMouseDown={handleShapeMouseDown}
          setSelectedId={setSelectedId}
          handleShapeDrop={handleShapeDrop}
          handleCircleResizeMouseDown={handleCircleResizeMouseDown}
          fillMode={fillMode}
          draggingFill={draggingFill}
          scale={scale}
        />
      );
    }
    if (shape.type === "triangle") {
      return (
        <TriangleShape
          key={shape.id}
          shape={shape}
          isSelected={isSelected}
          pxToUnits={pxToUnits}
          handleShapeMouseDown={handleShapeMouseDown}
          setSelectedId={setSelectedId}
          handleShapeDrop={handleShapeDrop}
          handleResizeMouseDown={handleResizeMouseDown}
          fillMode={fillMode}
          draggingFill={draggingFill}
        />
      );
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.scalableWorkspace}>
        {/* Sidebar group: Difficulty dropdown above Toolbox */}
        <div style={{ gridArea: "sidebar", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            dropdownRef={dropdownRef}
          />
          {dropdownOpen && (
            <div style={{ height: 360 /* or whatever fits your dropdown */ }} />
          )}
          <Toolbox
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            handleDragStart={handleDragStart}
            fillColor={fillColor}
            fillMode={fillMode}
            setFillMode={setFillMode}
            handleFillDragStart={handleFillDragStart}
            handleFillDragEnd={handleFillDragEnd}
            FILL_COLORS={FILL_COLORS}
            setFillColor={setFillColor}
          />
        </div>
        
        <div className={styles.mainColumn}>

          <div style={{ height: 32 /* or match your back button row height */ }} />

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
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            setSelectedId={setSelectedId}
            setSelectedTool={setSelectedTool}
          />
        </div>
        
        {/* Controls Row (Save, Timer, Hint) */}
        <div className={styles.controlsRow}>
          <button className={`${styles.addTimerBtn} ${styles.rowBtn}`}>Add Timer</button>
          <button className={`${styles.saveBtn} ${styles.rowBtn}`}>Save</button>
          <button className={`${styles.addHintBtn} ${styles.rowBtn}`}>Add Hint</button>
        </div>
      </div>
    </div>
  );
}