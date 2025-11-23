'use client'

import React, { useState } from 'react'
import type { MinigameQuestion } from '@/types/common/quiz'
interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const C3C2_CircumferenceMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const svgSize = 280
  const radius = 80

  const check = () => {
    const correctStr = question.correctAnswer?.toString().trim()
    const given = answer.trim()
    const isCorrect = correctStr === given
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, given)
    }, 1200)
  }

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}> 
              <circle cx={svgSize/2} cy={svgSize/2} r={radius} stroke="#333" strokeWidth="3" fill="none" />
              <line x1={svgSize/2 - radius} y1={svgSize/2} x2={svgSize/2 + radius} y2={svgSize/2} stroke="#c23b22" strokeWidth="3" />
              <text x={svgSize/2 - 10} y={svgSize/2 - 10} fontSize={14} fill="#c23b22">d</text>
              <text x={18} y={24} fontSize={14} fill="#2d6cdf">Use C = 2πr or C = πd</text>
            </svg>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{question.instruction}</div>
          <div className={styleModule.hint}>{question.hint || 'Enter the circumference value.'}</div>
          <input 
            className={styleModule.answerInput}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.unit ? `Answer (${question.unit})` : 'Answer'}
          />
          <button className={styleModule.submitButton} onClick={check}>Submit</button>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C3C2_CircumferenceMinigame