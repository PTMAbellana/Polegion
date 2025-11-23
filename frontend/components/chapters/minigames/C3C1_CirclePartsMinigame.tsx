'use client'

import React, { useState } from 'react'
import { Stage, Layer, Circle, Line, Text } from 'react-konva'
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

  const canvasWidth = 560
  const canvasHeight = 380
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const radius = 140

  const handlePartSelect = (partId: string) => {
    const correct = question.correctAnswer?.toString() === partId
    setFeedback(correct ? 'Correct!' : 'Try again')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(!!correct, partId)
    }, 1200)
  }

  const renderCircle = () => (
    <>
      <Circle x={centerX} y={centerY} radius={radius} stroke="#333" strokeWidth={2} />
      {/* Radius line */}
      <Line points={[centerX, centerY, centerX + radius, centerY]} stroke="#2d6cdf" strokeWidth={3} />
      <Text x={centerX + radius - 30} y={centerY - 22} text={'r'} fontSize={18} fill="#2d6cdf" />
      {/* Diameter line */}
      <Line points={[centerX - radius, centerY, centerX + radius, centerY]} stroke="#c23b22" strokeWidth={3} />
      <Text x={centerX - 10} y={centerY - 38} text={'d'} fontSize={18} fill="#c23b22" />
      {/* Chord */}
      <Line points={[centerX - 60, centerY - 70, centerX + 90, centerY - 10]} stroke="#7a3ea8" strokeWidth={3} />
      <Text x={centerX + 95} y={centerY - 30} text={'chord'} fontSize={16} fill="#7a3ea8" />
      {/* Arc label */}
      <Text x={centerX - 100} y={centerY + radius + 8} text={'arc'} fontSize={16} fill="#555" />
      {/* Center label */}
      <Circle x={centerX} y={centerY} radius={4} fill="#111" />
      <Text x={centerX + 6} y={centerY + 6} text={'center'} fontSize={14} fill="#111" />
    </>
  )

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <Stage width={canvasWidth} height={canvasHeight}>
              <Layer>{renderCircle()}</Layer>
            </Stage>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{question.instruction}</div>
          <div className={styleModule.hint}>{question.hint || 'Tap the correct part.'}</div>
          <div className={styleModule.answerOptions}>
            {['center', 'radius', 'diameter', 'chord', 'arc', 'sector'].map((id) => (
              <div key={id} className={styleModule.answerOption} onClick={() => handlePartSelect(id)}>
                {id}
              </div>
            ))}
          </div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C3C1_CirclePartsMinigame