'use client'

import React, { useState } from 'react'
import { Stage, Layer, Circle, Line, Text, Wedge } from 'react-konva'
import type { MinigameQuestion } from '@/types/common/quiz'
interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const C3C1_CirclePartsMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [feedback, setFeedback] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)

  const canvasWidth = 480
  const canvasHeight = 320
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const radius = 115
  const angleRad = Math.PI / 180 * 40
  const radiusEndX = centerX + radius * Math.cos(angleRad)
  const radiusEndY = centerY - radius * Math.sin(angleRad)

  const target = (question.partType || '').toLowerCase()
  const handleShapeClick = (partId: string) => {
    const correct = target === partId
    setFeedback(correct ? 'Correct!' : 'Try again')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(!!correct, partId)
    }, 900)
  }

  const renderCircle = () => (
    <>
      <Circle x={centerX} y={centerY} radius={radius} stroke="#2c3e50" strokeWidth={3} fill="#f7fbff" />
      <Line
        points={[centerX, centerY, radiusEndX, radiusEndY]}
        stroke="#2d6cdf"
        strokeWidth={4}
        opacity={target === 'radius' || hoveredPart === 'radius' ? 1 : 0.25}
        hitStrokeWidth={20}
        name="radius"
        shadowColor="#2d6cdf"
        shadowBlur={hoveredPart === 'radius' ? 10 : 0}
        shadowOpacity={hoveredPart === 'radius' ? 0.7 : 0}
        onMouseEnter={(e) => { setHoveredPart('radius'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
        onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
        onClick={() => handleShapeClick('radius')}
      />
      <Text x={radiusEndX - 24} y={radiusEndY - 22} text={'r'} fontSize={18} fill="#2d6cdf" opacity={target === 'radius' || hoveredPart === 'radius' ? 1 : 0.25} />
      <Line
        points={[centerX - radius, centerY, centerX + radius, centerY]}
        stroke="#c23b22"
        strokeWidth={4}
        opacity={target === 'diameter' || hoveredPart === 'diameter' ? 1 : 0.25}
        hitStrokeWidth={16}
        name="diameter"
        shadowColor="#c23b22"
        shadowBlur={hoveredPart === 'diameter' ? 10 : 0}
        shadowOpacity={hoveredPart === 'diameter' ? 0.7 : 0}
        onMouseEnter={(e) => { setHoveredPart('diameter'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
        onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
        onClick={() => handleShapeClick('diameter')}
      />
      <Text x={centerX - 8} y={centerY - 34} text={'d'} fontSize={18} fill="#c23b22" opacity={target === 'diameter' || hoveredPart === 'diameter' ? 1 : 0.25} />
      <Line
        points={[centerX - 60, centerY - 70, centerX + 90, centerY - 10]}
        stroke="#7a3ea8"
        strokeWidth={4}
        opacity={target === 'chord' || hoveredPart === 'chord' ? 1 : 0.25}
        hitStrokeWidth={16}
        name="chord"
        shadowColor="#7a3ea8"
        shadowBlur={hoveredPart === 'chord' ? 10 : 0}
        shadowOpacity={hoveredPart === 'chord' ? 0.7 : 0}
        onMouseEnter={(e) => { setHoveredPart('chord'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
        onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
        onClick={() => handleShapeClick('chord')}
      />
      {(() => {
        const arcStartDeg = 30
        const arcEndDeg = 95
        const step = 3
        const toRad = (deg: number) => Math.PI / 180 * deg
        const startRad = toRad(arcStartDeg)
        const endRad = toRad(arcEndDeg)
        const startX = centerX + radius * Math.cos(startRad)
        const startY = centerY - radius * Math.sin(startRad)
        const endX = centerX + radius * Math.cos(endRad)
        const endY = centerY - radius * Math.sin(endRad)
        const points: number[] = []
        for (let a = arcStartDeg; a <= arcEndDeg; a += step) {
          const r = toRad(a)
          points.push(centerX + radius * Math.cos(r), centerY - radius * Math.sin(r))
        }
        const visible = target === 'arc' || hoveredPart === 'arc'
        return (
          <>
            <Line
              points={points}
              stroke="#ff8c00"
              strokeWidth={6}
              opacity={visible ? 1 : 0.25}
              name="arc"
              hitStrokeWidth={20}
              shadowColor="#ff8c00"
              shadowBlur={hoveredPart === 'arc' ? 12 : 0}
              shadowOpacity={hoveredPart === 'arc' ? 0.8 : 0}
              onMouseEnter={(e) => { setHoveredPart('arc'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
              onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
              onClick={() => handleShapeClick('arc')}
            />
            <Circle
              x={startX}
              y={startY}
              radius={5}
              fill="#ff8c00"
              opacity={visible ? 1 : 0.25}
              name="arc"
              onMouseEnter={(e) => { setHoveredPart('arc'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
              onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
              onClick={() => handleShapeClick('arc')}
            />
            <Circle
              x={endX}
              y={endY}
              radius={5}
              fill="#ff8c00"
              opacity={visible ? 1 : 0.25}
              name="arc"
              onMouseEnter={(e) => { setHoveredPart('arc'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
              onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
              onClick={() => handleShapeClick('arc')}
            />
          </>
        )
      })()}
      <Wedge
        x={centerX}
        y={centerY}
        radius={radius - 12}
        angle={60}
        rotation={20}
        fill="#f8d28b"
        stroke="#b7825f"
        strokeWidth={2}
        opacity={target === 'sector' || hoveredPart === 'sector' ? 0.9 : 0.15}
        name="sector"
        shadowColor="#b7825f"
        shadowBlur={hoveredPart === 'sector' ? 10 : 0}
        shadowOpacity={hoveredPart === 'sector' ? 0.7 : 0}
        onMouseEnter={(e) => { setHoveredPart('sector'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
        onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
        onClick={() => handleShapeClick('sector')}
      />
      <Circle
        x={centerX}
        y={centerY}
        radius={6}
        fill="#111"
        opacity={target === 'center' || hoveredPart === 'center' ? 1 : 0.4}
        name="center"
        shadowColor="#111"
        shadowBlur={hoveredPart === 'center' ? 10 : 0}
        shadowOpacity={hoveredPart === 'center' ? 0.6 : 0}
        onMouseEnter={(e) => { setHoveredPart('center'); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'pointer') }}
        onMouseLeave={(e) => { setHoveredPart(null); e.target?.getStage()?.container().style && (e.target.getStage()!.container().style.cursor = 'default') }}
        onClick={() => handleShapeClick('center')}
      />
      <Text x={centerX + 8} y={centerY + 8} text={'O'} fontSize={16} fill="#111" opacity={target === 'center' || hoveredPart === 'center' ? 1 : 0.4} />
    </>
  )

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <Stage width={canvasWidth} height={canvasHeight} onClick={(e) => {
              const name = typeof e.target?.name === 'function' ? e.target.name() : ''
              if (!name) {
                setFeedback('Try again')
                setShowFeedback(true)
                setTimeout(() => setShowFeedback(false), 700)
              }
            }}>
              <Layer>{renderCircle()}</Layer>
            </Stage>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{question.instruction}</div>
          <div className={styleModule.hint}>{question.hint || 'Tap the correct part.'}</div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C3C1_CirclePartsMinigame