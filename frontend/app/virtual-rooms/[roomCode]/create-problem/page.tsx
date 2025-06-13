"use client";
import styles from "@/styles/create-problem.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

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
const MIN_SIZE = 50; // 1 unit = 50px

function pxToUnits(px) {
  const units = (px / 50).toFixed(2).replace(/\.00$/, "");
  return `${units} units`;
}

export default function CreateProblem() {
  const router = useRouter();
  const [draggedShape, setDraggedShape] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const [difficulty, setDifficulty] = useState("Easy");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const promptInputRef = useRef(null);

  const mainAreaRef = useRef(null);

  // Shape Fill Tool state
  const [fillMode, setFillMode] = useState(false);
  const [fillColor, setFillColor] = useState("#E3DCC2");
  const [draggingFill, setDraggingFill] = useState(false);

  // Toolbox highlight state
  const [selectedTool, setSelectedTool] = useState(null);

  // Timer and Hint UI state
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerValue, setTimerValue] = useState(5);
  const [hintOpen, setHintOpen] = useState(false);
  const [hint, setHint] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Responsive scaling to fit window
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
    const handleKeyDown = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId !== null) {
        setShapes((prev) => prev.filter((shape) => shape.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  // --- CLOSE FILL PALETTE WHEN CLICKING OUTSIDE ---
  useEffect(() => {
    function handleClickOutsideFill(event) {
      const fillTool = document.querySelector('.shapeFillTool');
      const fillPalette = document.querySelector('.fillPalette');
      if (fillTool && fillPalette && fillMode) {
        const clickedInsideFillTool = fillTool.contains(event.target);
        const clickedInsidePalette = fillPalette.contains(event.target);
        if (!clickedInsideFillTool && !clickedInsidePalette) {
          setFillMode(false);
        }
      } else if (fillTool && fillMode) {
        if (!fillTool.contains(event.target)) {
          setFillMode(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutsideFill);
    return () => document.removeEventListener("mousedown", handleClickOutsideFill);
  }, [fillMode]);

  // Handle drag start from toolbox
  const handleDragStart = (type) => {
    setDraggedShape(type);
    setSelectedTool(type);
  };

  // Handle drop in main area
  const handleDrop = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - DEFAULT_SIZE / 2) / scale;
    const y = (e.clientY - rect.top - DEFAULT_SIZE / 2) / scale;
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
    setSelectedTool(null); // Remove highlight after drop
  };

  const handleDragOver = (e) => e.preventDefault();

  // Move shape (removes if outside main area)
  const handleShapeMouseDown = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);
    dragOffset.current = {
      x: (e.clientX - shape.x * scale),
      y: (e.clientY - shape.y * scale),
    };
    const onMouseMove = (moveEvent) => {
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
    const onMouseUp = (moveEvent) => {
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

  // Resize square side
  const handleSquareResize = (id, side, e) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = shape.width ?? shape.size;
    const startHeight = shape.height ?? shape.size;
    const startXPos = shape.x;
    const startYPos = shape.y;

    const onMouseMove = (moveEvent) => {
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

  // Resize for circle and triangle (uniform)
  const handleResizeMouseDown = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    const shape = shapes.find((s) => s.id === id);
    const startX = e.clientX;
    const startSize = shape.size;
    const onMouseMove = (moveEvent) => {
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

  // --- Shape Fill Tool Drag ---
  const handleFillDragStart = (e) => {
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
  const renderShape = (shape) => {
    const isSelected = selectedId === shape.id;

    // --- SHAPE FILL DROP HANDLER ---
    const handleShapeDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const data = e.dataTransfer.getData("text/plain");
      if (data === "fill-color" && draggingFill && fillMode) {
        setShapes(prev =>
          prev.map(s =>
            s.id === shape.id ? { ...s, fill: fillColor } : s
          )
        );
      }
    };

    if (shape.type === "square") {
      const width = shape.width ?? shape.size;
      const height = shape.height ?? shape.size;
      const labelOffset = 48;
      return (
        <div
          key={shape.id}
          style={{
            position: "absolute",
            left: shape.x,
            top: shape.y,
            width,
            height,
            cursor: "move",
            zIndex: isSelected ? 10 : 2,
          }}
          onMouseDown={(e) => handleShapeMouseDown(shape.id, e)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(shape.id);
          }}
          onDragOver={e => {
            if (fillMode && draggingFill) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }
          }}
          onDrop={handleShapeDrop}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: shape.fill || "#e3dcc2",
              border: "6px solid #000",
              borderRadius: 0,
              position: "relative",
            }}
          >
            {isSelected && (
              <>
                {/* Top */}
                <span style={{
                  position: "absolute",
                  top: -labelOffset,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  fontSize: 14,
                  boxShadow: "0 2px 6px #0001",
                  whiteSpace: "nowrap"
                }}>{pxToUnits(width)}</span>
                {/* Bottom */}
                <span style={{
                  position: "absolute",
                  bottom: -labelOffset,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  fontSize: 14,
                  boxShadow: "0 2px 6px #0001",
                  whiteSpace: "nowrap"
                }}>{pxToUnits(width)}</span>
                {/* Left */}
                <span style={{
                  position: "absolute",
                  left: -labelOffset - 16,
                  top: "50%",
                  transform: "translateY(-50%) rotate(-90deg)",
                  background: "#fff",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  fontSize: 14,
                  boxShadow: "0 2px 6px #0001",
                  whiteSpace: "nowrap"
                }}>{pxToUnits(height)}</span>
                {/* Right */}
                <span style={{
                  position: "absolute",
                  right: -labelOffset - 16,
                  top: "50%",
                  transform: "translateY(-50%) rotate(-90deg)",
                  background: "#fff",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  fontSize: 14,
                  boxShadow: "0 2px 6px #0001",
                  whiteSpace: "nowrap"
                }}>{pxToUnits(height)}</span>
                {/* Resize handles */}
                {/* Top */}
                <div
                  style={{
                    position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                    width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                    cursor: "ns-resize", zIndex: 20,
                  }}
                  onMouseDown={(e) => handleSquareResize(shape.id, "top", e)}
                />
                {/* Bottom */}
                <div
                  style={{
                    position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                    width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                    cursor: "ns-resize", zIndex: 20,
                  }}
                  onMouseDown={(e) => handleSquareResize(shape.id, "bottom", e)}
                />
                {/* Left */}
                <div
                  style={{
                    position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
                    width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                    cursor: "ew-resize", zIndex: 20,
                  }}
                  onMouseDown={(e) => handleSquareResize(shape.id, "left", e)}
                />
                {/* Right */}
                <div
                  style={{
                    position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)",
                    width: 16, height: 16, background: "#fabc60", border: "2px solid #000", borderRadius: 4,
                    cursor: "ew-resize", zIndex: 20,
                  }}
                  onMouseDown={(e) => handleSquareResize(shape.id, "right", e)}
                />
              </>
            )}
          </div>
        </div>
      );
    }

    if (shape.type === "circle") {
      const size = shape.size;
      const labelYOffset = -size * 0.18;
      const r = size / 2;

      // Place handle at the right edge of the circle
      const handleX = size - 9; // 9 = handle radius (half of 18)
      const handleY = r - 9;

      const handleCircleResizeMouseDown = (id, e) => {
        e.stopPropagation();
        setSelectedId(id);
        const shape = shapes.find((s) => s.id === id);
        const rect = e.target.closest("div[style]").getBoundingClientRect();
        const centerX = rect.left + r * scale;
        const centerY = rect.top + r * scale;
        const startSize = shape.size;

        document.body.style.cursor = "ew-resize";

        const onMouseMove = (moveEvent) => {
          // Only use horizontal movement for resizing
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

      return (
        <div
          key={shape.id}
          style={{
            position: "absolute",
            left: shape.x,
            top: shape.y,
            width: size,
            height: size,
            cursor: "move",
            zIndex: isSelected ? 10 : 2,
          }}
          onMouseDown={(e) => handleShapeMouseDown(shape.id, e)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(shape.id);
          }}
          onDragOver={e => {
            if (fillMode && draggingFill) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }
          }}
          onDrop={handleShapeDrop}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: shape.fill || "#e3dcc2",
              border: "6px solid #000",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            {isSelected && (
              <>
                {/* Diameter line */}
                <svg
                  width={size}
                  height={size}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                >
                  <line
                    x1={0}
                    y1={size / 2}
                    x2={size}
                    y2={size / 2}
                    stroke="#222"
                    strokeWidth={3}
                  />
                </svg>
                {/* Side handle (resize) */}
                <div
                  style={{
                    position: "absolute",
                    left: handleX,
                    top: handleY,
                    width: 18,
                    height: 18,
                    background: "#fabc60",
                    borderRadius: "50%",
                    zIndex: 20,
                    border: "2px solid #000",
                    boxShadow: "0 0 4px #0002",
                    cursor: "ew-resize",
                    transition: "cursor 0.1s",
                  }}
                  onMouseDown={(e) => handleCircleResizeMouseDown(shape.id, e)}
                  title="Drag horizontally to resize"
                />
                {/* Diameter label */}
                <span style={{
                  position: "absolute",
                  left: "50%",
                  top: `calc(50% + ${labelYOffset}px)`,
                  transform: "translate(-50%, -50%)",
                  background: "#fff",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  fontSize: 14,
                  zIndex: 4,
                  whiteSpace: "nowrap"
                }}>
                  {pxToUnits(size)}
                </span>
              </>
            )}
          </div>
        </div>
      );
    }

    if (shape.type === "triangle") {
      const size = shape.size;
      const h = size * Math.sqrt(3) / 2;
      const stroke = 6;
      const pad = stroke;
      const svgWidth = size + pad * 2;
      const svgHeight = h + pad * 2;
      const points = [
        [svgWidth / 2, pad],                // top (A)
        [pad, h + pad],                     // bottom left (B)
        [size + pad, h + pad],              // bottom right (C)
      ];

      function dist(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
      }
      const sideLengths = [
        dist(points[0], points[1]), // AB (left)
        dist(points[1], points[2]), // BC (bottom)
        dist(points[2], points[0]), // CA (right)
      ];

      const midpoints = [
        [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2], // AB
        [(points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2], // BC
        [(points[2][0] + points[0][0]) / 2, (points[2][1] + points[0][1]) / 2], // CA
      ];

      function angleBetween(a, b) {
        return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      }
      const angles = [
        angleBetween(points[0], points[1]), // AB (left)
        angleBetween(points[1], points[2]), // BC (bottom)
        angleBetween(points[2], points[0]), // CA (right)
      ];

      const labelRotations = [
        angles[0] + 180, // left side
        angles[1],       // bottom side
        angles[2] + 180, // right side
      ];

      return (
        <div
          key={shape.id}
          style={{
            position: "absolute",
            left: shape.x - pad,
            top: shape.y - pad,
            width: svgWidth,
            height: svgHeight,
            cursor: "move",
            zIndex: isSelected ? 10 : 2,
          }}
          onMouseDown={(e) => handleShapeMouseDown(shape.id, e)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(shape.id);
          }}
          onDragOver={e => {
            if (fillMode && draggingFill) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }
          }}
          onDrop={handleShapeDrop}
        >
          <svg width={svgWidth} height={svgHeight} style={{ position: "absolute", left: 0, top: 0 }}>
            <polygon
              points={points.map((p) => p.join(",")).join(" ")}
              fill={shape.fill || "#e3dcc2"}
              stroke="#000"
              strokeWidth={stroke}
            />
          </svg>
          {isSelected &&
            midpoints.map((m, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: m[0],
                  top: m[1],
                  transform: `translate(-50%, -50%) rotate(${labelRotations[i]}deg)`,
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    borderRadius: 6,
                    border: "1px solid #aaa",
                    fontSize: 14,
                    boxShadow: "0 2px 6px #0001",
                    padding: "2px 8px",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    height: "24px",
                    fontWeight: 400,
                  }}
                >
                  {pxToUnits(sideLengths[i])}
                </div>
              </div>
            ))}
          {isSelected && (
            <div
              style={{
                position: "absolute",
                right: -10,
                bottom: -10,
                width: 16,
                height: 16,
                background: "#fabc60",
                border: "2px solid #000",
                borderRadius: 4,
                cursor: "nwse-resize",
                zIndex: 20,
              }}
              onMouseDown={(e) => handleResizeMouseDown(shape.id, e)}
            />
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.scalableWorkspace}>
        <div
          style={{
            width: 1920,
            height: 1080,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "relative",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          {/* Difficulty Dropdown */}
          <div
            ref={dropdownRef}
            className={styles.difficultyBox}
            style={{
              background: DIFFICULTY_COLORS[difficulty],
              cursor: "pointer",
              zIndex: 20,
            }}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span className={styles.difficultyText}>{difficulty}</span>
            <span style={{ marginLeft: 12, fontSize: 18, color: "#2c514c" }}>
              ▼
            </span>
            {dropdownOpen && (
              <div className={styles.difficultyDropdownMenu}>
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
          </div>

          {/* Toolbox */}
          <div className={styles.toolbox}>
            <div className={styles.toolboxHeader}></div>
            <div className={styles.toolboxContent}>
              {/* Row: Square and Circle */}
              <div className={styles.toolboxRow}>
                <div
                  className={styles.toolboxSquare}
                  draggable
                  onDragStart={() => handleDragStart("square")}
                  onClick={() => setSelectedTool("square")}
                  style={{
                    background: "#e3dcc2",
                    border: "6px solid #000",
                    borderRadius: 0,
                    width: 100,
                    height: 100,
                    marginRight: 16,
                    position: "static",
                    cursor: "pointer",
                    transform: selectedTool === "square" ? "scale(1.05)" : "scale(1)",
                    boxShadow: selectedTool === "square" ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)" : "none",
                    opacity: selectedTool === "square" ? 1 : 0.8,
                    transition: "all 0.2s ease",
                  }}
                />
                <div
                  className={styles.toolboxCircle}
                  draggable
                  onDragStart={() => handleDragStart("circle")}
                  onClick={() => setSelectedTool("circle")}
                  style={{
                    background: "#e3dcc2",
                    border: "6px solid #000",
                    borderRadius: "50%",
                    width: 100,
                    height: 100,
                    position: "static",
                    cursor: "pointer",
                    transform: selectedTool === "circle" ? "scale(1.05)" : "scale(1)",
                    boxShadow: selectedTool === "circle" ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)" : "none",
                    opacity: selectedTool === "circle" ? 1 : 0.8,
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
              {/* Row: Triangle and Fill Tool */}
              <div className={styles.toolboxRow} style={{ marginTop: 24 }}>
                <div
                  className={styles.toolboxTriangle}
                  draggable
                  onDragStart={() => handleDragStart("triangle")}
                  onClick={() => setSelectedTool("triangle")}
                  style={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 24,
                    position: "static",
                    cursor: "pointer",
                    transform: selectedTool === "triangle" ? "scale(1.05)" : "scale(1)",
                    boxShadow: selectedTool === "triangle" ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)" : "none",
                    opacity: selectedTool === "triangle" ? 1 : 0.8,
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width={100} height={100}>
                    <polygon
                      points="50,10 10,90 90,90"
                      fill="#e3dcc2"
                      stroke="#000"
                      strokeWidth="6"
                    />
                  </svg>
                </div>
                {/* Fill Tool */}
                <div
                  className={`${styles.shapeFillTool} shapeFillTool`}
                  style={{
                    background: fillColor,
                    border: "5px solid #000",
                    width: 80,
                    height: 80,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: fillMode ? "grab" : "pointer",
                    position: "relative",
                    boxShadow: fillMode ? "0 0 0 4px #fff, 0 0 0 8px rgba(0,0,0,0.2)" : "none",
                    opacity: fillMode ? 1 : 0.8,
                    transform: fillMode ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setFillMode(!fillMode);
                  }}
                  draggable={fillMode}
                  onDragStart={e => {
                    if (fillMode) {
                      handleFillDragStart(e);
                    } else {
                      e.preventDefault();
                    }
                  }}
                  onDragEnd={handleFillDragEnd}
                  title={fillMode ? "Drag to fill shapes or click outside to close" : "Click to activate fill mode"}
                >
                  {/* Paint bucket icon with dynamic styling */}
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <g>
                      <rect 
                        x="10" y="20" width="20" height="12" rx="4" 
                        fill="#fff" 
                        stroke="#222" 
                        strokeWidth="2"
                        opacity={fillMode ? 1 : 0.9}
                      />
                      <rect 
                        x="18" y="8" width="4" height="16" rx="2" 
                        fill="#fff" 
                        stroke="#222" 
                        strokeWidth="2" 
                        transform="rotate(-30 20 16)"
                        opacity={fillMode ? 1 : 0.9}
                      />
                      <ellipse 
                        cx="20" cy="34" rx="8" ry="3" 
                        fill={fillColor} 
                        stroke="#222" 
                        strokeWidth="2"
                      />
                    </g>
                  </svg>
                  <span style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: 700,
                    color: "#222",
                    fontSize: 14,
                    textShadow: "0 1px 2px #fff",
                    opacity: fillMode ? 1 : 0.8,
                  }}>
                    Fill
                  </span>
                  {/* Active indicator */}
                  {fillMode && (
                    <div style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      background: "#4CAF50",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      boxShadow: "0 0 4px rgba(0,0,0,0.3)"
                    }} />
                  )}
                </div>
              </div>
              {/* Color Palette (show when fillMode is active) */}
              {fillMode && (
                <div className={`${styles.fillPalette} fillPalette`}>
                  {FILL_COLORS.map(color => (
                    <div
                      key={color}
                      className={styles.fillColor}
                      style={{
                        background: color,
                        border: color === fillColor ? "3px solid #000" : "2px solid #000",
                        transform: color === fillColor ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.15s ease",
                        boxShadow: color === fillColor ? "0 0 0 2px #fff, 0 0 8px rgba(0,0,0,0.2)" : "none"
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        setFillColor(color);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Area */}
          <div
            ref={mainAreaRef}
            className={styles.mainArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ overflow: "hidden" }}
            onMouseDown={() => {
              setSelectedId(null);
              setSelectedTool(null); // Remove highlight when clicking main area
            }}
          >
            {shapes.map(renderShape)}
          </div>

          {/* The rest of your layout (buttons, prompt, etc.) */}
          <div style={{ marginTop: 24, marginBottom: 16 }}>
            <button className={styles.saveBtn}>Save</button>

            {/* Add Timer UI */}
            <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: 12, marginLeft: 12 }}>
              {!timerOpen ? (
                <button
                  className={styles.addTimerBtn}
                  onClick={() => setTimerOpen(true)}
                >
                  Add Timer
                </button>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontWeight: 500, marginRight: 8 }}>Timer:</span>
                  <input
                    type="number"
                    min={5}
                    value={timerValue}
                    onChange={e => setTimerValue(Math.max(5, Number(e.target.value)))}
                    style={{
                      width: 60,
                      fontSize: 16,
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: "1px solid #aaa",
                      marginRight: 8,
                    }}
                  />
                  <span style={{ marginRight: 8 }}>seconds</span>
                  <button
                    style={{
                      background: "#fabc60",
                      border: "1px solid #000",
                      borderRadius: 4,
                      padding: "2px 10px",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginRight: 4,
                    }}
                    onClick={() => setTimerOpen(false)}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              )}
            </span>

            {/* Add Hint UI */}
            <span style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 8 }}>
              {!hintOpen ? (
                <button
                  className={styles.addHintBtn}
                  onClick={() => setHintOpen(true)}
                >
                  Add Hint
                </button>
              ) : (
                <div
                  style={{
                    background: "#fffbe6",
                    border: "1px solid #aaa",
                    borderRadius: 8,
                    padding: 12,
                    minWidth: 320,
                    minHeight: 60,
                    marginBottom: 4,
                    position: "relative",
                    display: "inline-block"
                  }}
                >
                  <textarea
                    value={hint}
                    onChange={e => setHint(e.target.value)}
                    placeholder="Input hint here."
                    style={{
                      width: "100%",
                      minHeight: 40,
                      resize: "none",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontFamily: "Poppins",
                      fontSize: 18,
                      fontWeight: 300,
                      color: "#000",
                    }}
                  />
                  <button
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 8,
                      background: "#fabc60",
                      border: "1px solid #000",
                      borderRadius: 4,
                      padding: "2px 10px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => setHintOpen(false)}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              )}
            </span>
          </div>

          <div className={styles.goBackGroup}>
            <button className={styles.arrowLeft} onClick={() => router.back()}>
              ←
            </button>
            <span className={styles.goBackText}>Go back</span>
          </div>
          {/* Prompt */}
          <div className={styles.promptGroup}>
            <div
              className={styles.promptBox}
              onClick={() => {
                setEditingPrompt(true);
                if (
                  prompt.trim() === "" ||
                  prompt === "Input problem details."
                ) {
                  setPrompt("");
                }
              }}
            >
              {editingPrompt ? (
                <textarea
                  ref={promptInputRef}
                  className={styles.promptTextarea}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onBlur={() => setEditingPrompt(false)}
                  placeholder="Input problem details."
                  style={{
                    width: "100%",
                    height: "100%",
                    resize: "none",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: "Poppins",
                    fontSize: 24,
                    fontWeight: 300,
                    color: "#000",
                  }}
                />
              ) : (
                <span className={styles.promptText}>
                  {prompt.trim() === "" ? "Input problem details." : prompt}
                </span>
              )}
            </div>
          </div>
          <div className={styles.solutionHeaderBox}>
            <span className={styles.solutionHeader}>Solution</span>
          </div>
        </div>
      </div>
    </div>
  );
}