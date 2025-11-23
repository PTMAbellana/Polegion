'use client'

import React from 'react'
import type { MinigameQuestion } from '@/types/common/quiz'
interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const C4C3_AngleSumMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [value, setValue] = React.useState('')
  const [feedback, setFeedback] = React.useState('')
  const [showFeedback, setShowFeedback] = React.useState(false)

  const submit = () => {
    const isCorrect = (question.correctAnswer?.toString() || '').trim() === value.trim()
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, value)
    }, 1200)
  }

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <div style={{ padding: 12 }}>
              <div className={styleModule.hint}>Use (n − 2) × 180° for interior angle sum.</div>
              <div style={{ fontSize: 14, color: '#333' }}>n = {question.sides ?? '—'}</div>
            </div>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{question.instruction}</div>
          <input className={styleModule.answerInput} value={value} onChange={(e) => setValue(e.target.value)} placeholder={'Sum (degrees)'} />
          <button className={styleModule.submitButton} onClick={submit}>Submit</button>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C4C3_AngleSumMinigame