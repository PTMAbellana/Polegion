"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCw, Home, ChevronRight, Check } from 'lucide-react';
import styles from '@/styles/castle4-chapter2.module.css';

const TiledChamber = () => {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [patternsCreated, setPatternsCreated] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const [grid, setGrid] = useState(Array(25).fill(null)); // Changed to 5x5 = 25 cells
  const [targetPattern, setTargetPattern] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [wizardDialogue, setWizardDialogue] = useState(
    "The artisans of old laid these floors using the language of repetition. Restore the harmony of shapes."
  );

  // Available tiles based on stage
  const availableTiles = {
    1: [
      { id: 1, type: 'triangle', color: '#9370DB', name: 'Triangle' },
      { id: 2, type: 'square', color: '#4FC3F7', name: 'Square' },
    ],
    2: [
      { id: 1, type: 'hexagon', color: '#66BBFF', name: 'Hexagon' },
      { id: 2, type: 'rectangle', color: '#9370DB', name: 'Rectangle' },
      { id: 3, type: 'triangle', color: '#4FC3F7', name: 'Triangle' },
    ],
    3: [
      { id: 1, type: 'hexagon', color: '#66BBFF', name: 'Hexagon' },
      { id: 2, type: 'square', color: '#4FC3F7', name: 'Square' },
      { id: 3, type: 'triangle', color: '#9370DB', name: 'Triangle' },
      { id: 4, type: 'pentagon', color: '#FF69B4', name: 'Pentagon' },
    ],
  };

  // Target patterns for each stage
  const targetPatterns = {
    1: generateTrianglePattern(),
    2: generateHexagonPattern(),
    3: generateComplexPattern(),
  };

  // Generate patterns - Updated for 5x5 target (25 cells) - TRUE TESSELLATIONS
  function generateTrianglePattern() {
    const pattern = [];
    // Create a complete triangle and square tessellation - NO GAPS
    // Pattern: Alternating triangles (up/down) with squares filling gaps
    const positions = [
      // Row 0
      { row: 0, col: 0, type: 'triangle', rotation: 0 },
      { row: 0, col: 1, type: 'square', rotation: 0 },
      { row: 0, col: 2, type: 'triangle', rotation: 0 },
      { row: 0, col: 3, type: 'square', rotation: 0 },
      { row: 0, col: 4, type: 'triangle', rotation: 0 },
      // Row 1
      { row: 1, col: 0, type: 'square', rotation: 0 },
      { row: 1, col: 1, type: 'triangle', rotation: 180 },
      { row: 1, col: 2, type: 'square', rotation: 0 },
      { row: 1, col: 3, type: 'triangle', rotation: 180 },
      { row: 1, col: 4, type: 'square', rotation: 0 },
      // Row 2
      { row: 2, col: 0, type: 'triangle', rotation: 0 },
      { row: 2, col: 1, type: 'square', rotation: 0 },
      { row: 2, col: 2, type: 'triangle', rotation: 0 },
      { row: 2, col: 3, type: 'square', rotation: 0 },
      { row: 2, col: 4, type: 'triangle', rotation: 0 },
      // Row 3
      { row: 3, col: 0, type: 'square', rotation: 0 },
      { row: 3, col: 1, type: 'triangle', rotation: 180 },
      { row: 3, col: 2, type: 'square', rotation: 0 },
      { row: 3, col: 3, type: 'triangle', rotation: 180 },
      { row: 3, col: 4, type: 'square', rotation: 0 },
      // Row 4
      { row: 4, col: 0, type: 'triangle', rotation: 0 },
      { row: 4, col: 1, type: 'square', rotation: 0 },
      { row: 4, col: 2, type: 'triangle', rotation: 0 },
      { row: 4, col: 3, type: 'square', rotation: 0 },
      { row: 4, col: 4, type: 'triangle', rotation: 0 },
    ];
    
    for (let i = 0; i < 25; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const match = positions.find(p => p.row === row && p.col === col);
      pattern.push(match || null);
    }
    return pattern;
  }

  function generateHexagonPattern() {
    const pattern = [];
    // Create a hexagon tessellation pattern - NO GAPS
    // Hexagons naturally tessellate together
    const positions = [
      // Row 0
      { row: 0, col: 0, type: 'hexagon', rotation: 0 },
      { row: 0, col: 1, type: 'hexagon', rotation: 0 },
      { row: 0, col: 2, type: 'hexagon', rotation: 0 },
      { row: 0, col: 3, type: 'hexagon', rotation: 0 },
      { row: 0, col: 4, type: 'hexagon', rotation: 0 },
      // Row 1
      { row: 1, col: 0, type: 'hexagon', rotation: 0 },
      { row: 1, col: 1, type: 'hexagon', rotation: 0 },
      { row: 1, col: 2, type: 'hexagon', rotation: 0 },
      { row: 1, col: 3, type: 'hexagon', rotation: 0 },
      { row: 1, col: 4, type: 'hexagon', rotation: 0 },
      // Row 2
      { row: 2, col: 0, type: 'hexagon', rotation: 0 },
      { row: 2, col: 1, type: 'hexagon', rotation: 0 },
      { row: 2, col: 2, type: 'hexagon', rotation: 0 },
      { row: 2, col: 3, type: 'hexagon', rotation: 0 },
      { row: 2, col: 4, type: 'hexagon', rotation: 0 },
      // Row 3
      { row: 3, col: 0, type: 'hexagon', rotation: 0 },
      { row: 3, col: 1, type: 'hexagon', rotation: 0 },
      { row: 3, col: 2, type: 'hexagon', rotation: 0 },
      { row: 3, col: 3, type: 'hexagon', rotation: 0 },
      { row: 3, col: 4, type: 'hexagon', rotation: 0 },
      // Row 4
      { row: 4, col: 0, type: 'hexagon', rotation: 0 },
      { row: 4, col: 1, type: 'hexagon', rotation: 0 },
      { row: 4, col: 2, type: 'hexagon', rotation: 0 },
      { row: 4, col: 3, type: 'hexagon', rotation: 0 },
      { row: 4, col: 4, type: 'hexagon', rotation: 0 },
    ];
    
    for (let i = 0; i < 25; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const match = positions.find(p => p.row === row && p.col === col);
      pattern.push(match || null);
    }
    return pattern;
  }

  function generateComplexPattern() {
    const pattern = [];
    // Create a complete square tessellation with triangular decorations - NO GAPS
    const positions = [
      // Row 0
      { row: 0, col: 0, type: 'square', rotation: 0 },
      { row: 0, col: 1, type: 'square', rotation: 0 },
      { row: 0, col: 2, type: 'square', rotation: 0 },
      { row: 0, col: 3, type: 'square', rotation: 0 },
      { row: 0, col: 4, type: 'square', rotation: 0 },
      // Row 1
      { row: 1, col: 0, type: 'square', rotation: 0 },
      { row: 1, col: 1, type: 'square', rotation: 0 },
      { row: 1, col: 2, type: 'square', rotation: 0 },
      { row: 1, col: 3, type: 'square', rotation: 0 },
      { row: 1, col: 4, type: 'square', rotation: 0 },
      // Row 2
      { row: 2, col: 0, type: 'square', rotation: 0 },
      { row: 2, col: 1, type: 'square', rotation: 0 },
      { row: 2, col: 2, type: 'square', rotation: 0 },
      { row: 2, col: 3, type: 'square', rotation: 0 },
      { row: 2, col: 4, type: 'square', rotation: 0 },
      // Row 3
      { row: 3, col: 0, type: 'square', rotation: 0 },
      { row: 3, col: 1, type: 'square', rotation: 0 },
      { row: 3, col: 2, type: 'square', rotation: 0 },
      { row: 3, col: 3, type: 'square', rotation: 0 },
      { row: 3, col: 4, type: 'square', rotation: 0 },
      // Row 4
      { row: 4, col: 0, type: 'square', rotation: 0 },
      { row: 4, col: 1, type: 'square', rotation: 0 },
      { row: 4, col: 2, type: 'square', rotation: 0 },
      { row: 4, col: 3, type: 'square', rotation: 0 },
      { row: 4, col: 4, type: 'square', rotation: 0 },
    ];
    
    for (let i = 0; i < 25; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const match = positions.find(p => p.row === row && p.col === col);
      pattern.push(match || null);
    }
    return pattern;
  }

  useEffect(() => {
    setTargetPattern(targetPatterns[currentStage]);
  }, [currentStage]);

  // Handle tile selection
  const handleTileSelect = (tile) => {
    setSelectedTile(tile);
    setWizardDialogue(`${tile.name} selected. Click on the grid to place it.`);
  };

  // Handle grid cell click
  const handleGridClick = (index) => {
    if (!selectedTile) {
      setWizardDialogue("Select a tile from the panel first!");
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = {
      ...selectedTile,
      rotation: rotation,
    };
    setGrid(newGrid);
    
    // Check if pattern is complete
    checkPatternCompletion(newGrid);
  };

  // Rotate selected tile
  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  // Check if pattern matches target - Only checks required positions
  const checkPatternCompletion = (currentGrid) => {
    // Check if all required tiles match the target pattern
    let allMatch = true;
    
    for (let i = 0; i < 25; i++) {
      const targetTile = targetPattern[i];
      const gridTile = currentGrid[i];
      
      // If target has a tile at this position
      if (targetTile) {
        // Grid must have a matching tile
        if (!gridTile || 
            gridTile.type !== targetTile.type || 
            gridTile.rotation !== targetTile.rotation) {
          allMatch = false;
          break;
        }
      }
      // If target is empty (null), we don't care what's in the grid
    }
    
    if (allMatch) {
      // Pattern complete
      setPatternsCreated(patternsCreated + 1);
      setWizardDialogue("Magnificent! The pattern is complete!");
      
      if (currentStage < 3) {
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setGrid(Array(25).fill(null));
          setSelectedTile(null);
          setRotation(0);
          setWizardDialogue("Now, let's try a more complex tessellation!");
        }, 2000);
      } else {
        setTimeout(() => {
          setShowCompletion(true);
        }, 2000);
      }
    }
  };

  // Clear grid
  const handleClearGrid = () => {
    setGrid(Array(25).fill(null));
    setWizardDialogue("Grid cleared. Start fresh!");
  };

  // Navigation handlers
  const handlePrevious = () => {
    router.push('/student/worldmap/castle4');
  };

  const handleBackToChapterMap = () => {
    router.push('/student/worldmap/castle4');
  };

  const handleNext = () => {
    // Save progress
    localStorage.setItem('castle4-chapter2-completed', 'true');
    router.push('/student/worldmap/castle4/chapter3');
  };

  // Render shape based on type
  const renderShape = (type, color, rotation, size = 40) => {
    const shapeStyle = {
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease',
    };

    switch (type) {
      case 'triangle':
        return (
          <div 
            className={styles.shapeTriangle} 
            style={{ 
              ...shapeStyle,
              borderBottomColor: color,
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderBottomWidth: size * 0.86,
            }}
          />
        );
      case 'square':
        return (
          <div 
            className={styles.shapeSquare} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      case 'hexagon':
        return (
          <div 
            className={styles.shapeHexagon} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      case 'rectangle':
        return (
          <div 
            className={styles.shapeRectangle} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size * 1.5,
              height: size * 0.7,
            }}
          />
        );
      case 'pentagon':
        return (
          <div 
            className={styles.shapePentagon} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      case 'rhombus':
        return (
          <div 
            className={styles.shapeRhombus} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size * 0.7,
              height: size * 0.7,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.chapterContainer}>
      <div className={styles.backgroundOverlay}></div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.chapterTitle}>Chapter 2: The Tiled Chamber</h1>
        <div className={styles.progressContainer}>
          <p className={styles.progressInfo}>Pattern {currentStage} of 3</p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(patternsCreated / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className={styles.gameArea}>
        {/* Tile Selection Panel - Left Side */}
        <div className={styles.tilePanel}>
          <h3 className={styles.panelTitle}>Select & Drag Tiles</h3>
          <div className={styles.tileGrid}>
            {availableTiles[currentStage].map((tile) => (
              <div
                key={tile.id}
                className={`${styles.tileOption} ${
                  selectedTile?.id === tile.id ? styles.selectedTile : ''
                }`}
                onClick={() => handleTileSelect(tile)}
              >
                {renderShape(tile.type, tile.color, 0, 50)}
              </div>
            ))}
          </div>
          
          <div className={styles.tileControls}>
            <button className={styles.rotateButton} onClick={handleRotate}>
              <RotateCw size={20} />
              <span>Rotate</span>
            </button>
            <button className={styles.clearButton} onClick={handleClearGrid}>
              Clear Grid
            </button>
          </div>
        </div>

        {/* Central Grid - Now 5x5 */}
        <div className={styles.centralArea}>
          <div className={styles.gridContainer}>
            {grid.map((cell, index) => (
              <div
                key={index}
                className={`${styles.gridCell} ${cell ? styles.filled : ''}`}
                onClick={() => handleGridClick(index)}
              >
                {cell && renderShape(cell.type, cell.color, cell.rotation, 40)}
              </div>
            ))}
          </div>
        </div>

        {/* Target Pattern - Now 5x5 */}
        <div className={styles.targetPanel}>
          <h3 className={styles.panelTitle}>Target Pattern</h3>
          <div className={styles.targetPreview}>
            <div className={styles.targetGrid}>
              {targetPattern.map((pattern, index) => (
                <div key={index} className={styles.targetCell}>
                  {pattern && renderShape(
                    pattern.type,
                    '#66BBFF',
                    pattern.rotation,
                    20
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.stageInfo}>
            <p>Pattern {currentStage} of 3</p>
            <p className={styles.stageHint}>
              {currentStage === 1 && "Tessellate triangles and squares"}
              {currentStage === 2 && "Complete the hexagon tessellation"}
              {currentStage === 3 && "Fill with square tessellation"}
            </p>
          </div>
        </div>
      </div>

      {/* Wizard Container */}
      <div className={styles.wizardContainer}>
        <img 
          src="/images/wizard.png" 
          alt="Wizard Archimedes"
          className={styles.wizardImage}
        />
        <div className={styles.wizardSpeech}>
          <p>{wizardDialogue}</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <button className={styles.controlButton} onClick={handlePrevious}>
          <ArrowLeft size={20} />
          <span>Previous</span>
        </button>
        
        <button className={styles.controlButton} onClick={handleBackToChapterMap}>
          <Home size={20} />
          <span>Back to Chapter Map</span>
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={handleNext}
          disabled={patternsCreated < 3}
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className={styles.completionModal}>
          <div className={styles.modalContent}>
            <h2>Pattern Mastery Achieved!</h2>
            <p>You have restored the harmony of the Tiled Chamber!</p>
            <div className={styles.reward}>
              <div className={styles.crystal}>🔷</div>
              <p>Reward: Tile of Eternity</p>
            </div>
            <button className={styles.nextChapterButton} onClick={handleNext}>
              Continue to Next Chapter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiledChamber;