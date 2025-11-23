'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { MinigameQuestion } from '@/types/common/quiz'
interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const C4C2_PolygonDrawingMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const shapes = question.shapes || []
  const correctAnswer = question.correctAnswer?.toString() || ''

  const handleShapeClick = (shapeId: string) => {
    setSelectedShape(shapeId)
    const isCorrect = shapeId === correctAnswer
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, shapeId)
      setSelectedShape(null)
    }, 1200)
  }

  const getShapeImagePath = (shape: any) => `/images/castle1/chapter3/${shape.type.toLowerCase()}.png`

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {shapes.map((shape: any) => (
                <div key={shape.id} className={styleModule.answerOption} onClick={() => handleShapeClick(shape.id)}>
                  <Image src={getShapeImagePath(shape)} alt={shape.name || shape.type} width={180} height={120} style={{ objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{question.instruction}</div>
          <div className={styleModule.hint}>{question.hint || 'Select the correct polygon.'}</div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C4C2_PolygonDrawingMinigame