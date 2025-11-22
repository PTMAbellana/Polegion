'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Line as KonvaLine, Text } from 'react-konva';
import { MinigameQuestion, MinigameLine } from '@/types/common/quiz';

interface LineBasedMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  styleModule: { readonly [key: string]: string };
}

const LineBasedMinigame: React.FC<LineBasedMinigameProps> = ({
  question,
  onComplete,
  canvasWidth = 800,
  canvasHeight = 400,
  styleModule,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  const lines = question.lines || [];
  const correctAnswer = question.correctAnswer?.toString() || '';
  const correctAnswersArray = correctAnswer.split(',');
  const showType = question.showType || 'segment'; // 'segment', 'ray', or 'line'

  // Update canvas size based on container (matching Chapter 1 approach)
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current;
      if (container) {
        // Get actual container width and calculate proportional height
        const containerWidth = container.clientWidth;
        const width = Math.min(containerWidth, 800);
        const height = Math.floor(width * (canvasHeight / canvasWidth)); // Maintain aspect ratio
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Use ResizeObserver for more accurate container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (canvasRef.current) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(canvasRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvasWidth, canvasHeight]);

  const handleLineClick = (lineId: string) => {
    if (showFeedback) return; // Prevent clicks during feedback
    
    // Toggle selection
    if (selectedLines.includes(lineId)) {
      setSelectedLines(selectedLines.filter(id => id !== lineId));
    } else {
      const newSelection = [...selectedLines, lineId];
      setSelectedLines(newSelection);
      
      // Check if all correct answers are selected
      if (newSelection.length >= correctAnswersArray.length) {
        checkAnswer(newSelection);
      }
    }
  };

  const checkAnswer = (selection: string[]) => {
    // Check if selection matches all correct answers
    const isCorrect = correctAnswersArray.every(answer => selection.includes(answer)) &&
                     selection.length === correctAnswersArray.length;

    setFeedback(isCorrect ? '✓ Correct! Well done!' : '✗ Incorrect. Try again!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedLines([]);
      if (isCorrect) {
        onComplete(true, selection.join(','));
      } else {
        onComplete(false, selection.join(','));
      }
    }, 2000);
  };

  const getLineColor = (lineId: string): string => {
    if (selectedLines.includes(lineId)) {
      return correctAnswersArray.includes(lineId) ? '#4CAF50' : '#FFD700';
    }
    if (hoveredLine === lineId) return '#FFD700';
    return '#667eea';
  };

  const renderLine = (line: MinigameLine) => {
    const isSelected = selectedLines.includes(line.id);
    const isHovered = hoveredLine === line.id && selectedLines.length === 0;
    const color = getLineColor(line.id);
    
    // Scale coordinates to canvas size
    const scaleX = canvasSize.width / canvasWidth;
    const scaleY = canvasSize.height / canvasHeight;
    
    const x1 = line.x1 * scaleX;
    const y1 = line.y1 * scaleY;
    const x2 = line.x2 * scaleX;
    const y2 = line.y2 * scaleY;

    // Extend lines to canvas edges for infinite appearance
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction and extend far beyond canvas
    const dirX = dx / length;
    const dirY = dy / length;
    const extension = Math.max(canvasSize.width, canvasSize.height) * 2;
    
    const extendedX1 = x1 - dirX * extension;
    const extendedY1 = y1 - dirY * extension;
    const extendedX2 = x2 + dirX * extension;
    const extendedY2 = y2 + dirY * extension;

    return (
      <React.Fragment key={line.id}>
        {/* Extended line for visual effect */}
        <KonvaLine
          points={[extendedX1, extendedY1, extendedX2, extendedY2]}
          stroke={color}
          strokeWidth={isSelected ? 6 : isHovered ? 5 : 4}
          shadowColor="black"
          shadowBlur={isSelected ? 12 : 6}
          shadowOpacity={0.5}
          lineCap="round"
          lineJoin="round"
          listening={false} // Don't listen to mouse events on extended line
        />
        {/* Invisible thicker hit area on the actual line segment for better click detection */}
        <KonvaLine
          points={[x1, y1, x2, y2]}
          stroke="transparent"
          strokeWidth={30} // Much thicker for easier clicking
          onClick={() => handleLineClick(line.id)}
          onMouseEnter={() => selectedLines.length === 0 && setHoveredLine(line.id)}
          onMouseLeave={() => setHoveredLine(null)}
          lineCap="round"
          lineJoin="round"
        />
      </React.Fragment>
    );
  };

  return (
    <div className={styleModule.minigameContainer}>
      {/* Level Info - Horizontal Layout */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <p className={styleModule.levelInstruction} style={{ 
          margin: 0, 
          flex: 1,
          color: '#F5EFE7',
          fontSize: '1.1rem',
          fontWeight: '600',
        }}>
          {question.instruction}
        </p>
      </div>

      {/* Game Area - Canvas Left, Hints Right */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Canvas Container */}
        <div ref={canvasRef} style={{ 
          flex: '1 1 400px', 
          minWidth: '300px', 
          maxWidth: '800px',
        }}>
          <Stage 
            width={canvasSize.width} 
            height={canvasSize.height}
            style={{
              border: '2px solid #D8C4B6',
              borderRadius: '8px',
              cursor: showFeedback ? 'default' : 'pointer',
              backgroundColor: '#1a1a2e',
              width: '100%',
              height: 'auto',
              display: 'block',
              maxWidth: '100%',
            }}
          >
            <Layer>
              {/* Draw subtle grid lines */}
              {Array.from({ length: Math.ceil(canvasSize.width / 40) + 1 }).map((_, i) => (
                <React.Fragment key={`grid-v-${i}`}>
                  <KonvaLine
                    points={[i * 40, 0, i * 40, canvasSize.height]}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
              {Array.from({ length: Math.ceil(canvasSize.height / 40) + 1 }).map((_, i) => (
                <React.Fragment key={`grid-h-${i}`}>
                  <KonvaLine
                    points={[0, i * 40, canvasSize.width, i * 40]}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}

              {/* Draw all lines */}
              {lines.map((line: MinigameLine) => renderLine(line))}

              {/* Draw endpoint circles only */}
              {lines.map((line: MinigameLine) => {
                const scaleX = canvasSize.width / canvasWidth;
                const scaleY = canvasSize.height / canvasHeight;
                const x1 = line.x1 * scaleX;
                const y1 = line.y1 * scaleY;
                const x2 = line.x2 * scaleX;
                const y2 = line.y2 * scaleY;
                
                return (
                  <React.Fragment key={`points-${line.id}`}>
                    <Circle x={x1} y={y1} radius={5} fill="#fff" opacity={0.7} />
                    <Circle x={x2} y={y2} radius={5} fill="#fff" opacity={0.7} />
                  </React.Fragment>
                );
              })}
            </Layer>
          </Stage>
        </div>

        {/* Hints Container */}
        <div style={{
          flex: '0 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minWidth: '180px',
          maxWidth: '220px',
          width: '100%',
        }}>
          {/* Hint Box */}
          <div className={styleModule.hint} style={{ 
            margin: 0,
            padding: '8px 12px',
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, rgba(224, 247, 250, 0.15) 0%, rgba(179, 229, 252, 0.1) 100%)',
            border: '1.5px solid rgba(179, 229, 252, 0.3)',
            borderRadius: '6px',
            color: '#E0F7FA',
            lineHeight: '1.4',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>
            <strong style={{ 
              display: 'block', 
              marginBottom: '0.35rem', 
              color: '#B3E5FC',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>Hint</strong>
            <span style={{ fontSize: '0.75rem' }}>
              {question.hint || 'Click on the line that matches the description above.'}
            </span>
          </div>

          {/* Selected Lines Indicator */}
          {selectedLines.length > 0 && (
            <div style={{ 
              padding: '6px 12px',
              fontSize: '0.7rem',
              background: 'linear-gradient(135deg, rgba(179, 229, 252, 0.2) 0%, rgba(224, 247, 250, 0.15) 100%)',
              border: '1.5px solid rgba(179, 229, 252, 0.35)',
              borderRadius: '6px',
              color: '#E0F7FA',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                {selectedLines.length === 1 ? '1 line selected' : `${selectedLines.length} lines selected`}
              </span>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              padding: '8px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              background: feedback.includes('Correct') 
                ? 'linear-gradient(135deg, rgba(129, 212, 250, 0.25) 0%, rgba(179, 229, 252, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(255, 138, 128, 0.25) 0%, rgba(255, 205, 210, 0.2) 100%)',
              border: feedback.includes('Correct')
                ? '1.5px solid rgba(129, 212, 250, 0.5)'
                : '1.5px solid rgba(255, 138, 128, 0.5)',
              borderRadius: '6px',
              color: feedback.includes('Correct') ? '#81D4FA' : '#FF8A80',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              animation: 'slideIn 0.3s ease-out',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}>
              {feedback}
            </div>
          )}

          {/* Instructions */}
          <div style={{
            padding: '6px 12px',
            fontSize: '0.65rem',
            background: 'linear-gradient(135deg, rgba(144, 202, 249, 0.1) 0%, rgba(179, 229, 252, 0.05) 100%)',
            border: '1px solid rgba(144, 202, 249, 0.2)',
            borderRadius: '6px',
            color: '#B3E5FC',
            lineHeight: '1.3',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
          }}>
            Click on a line to select/deselect it
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineBasedMinigame;
