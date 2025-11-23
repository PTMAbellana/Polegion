'use client'

import React, { useState } from 'react'
import type { MinigameQuestion } from '@/types/common/quiz'
interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const C4C4_PolygonMeasurementMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const submit = () => {
    const isCorrect = (question.correctAnswer?.toString() || '').trim() === answer.trim()
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, answer)
    }, 1200)
  }

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <div style={{ padding: 12 }}>
              <div className={styleModule.hint}>Use the appropriate formula (e.g., P = 2(l + w), A = l × w).</div>
              <div style={{ fontSize: 14, color: '#333' }}>{question.formula || '—'}</div>
            </div>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{question.instruction}</div>
          <input className={styleModule.answerInput} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={'Answer'} />
          <button className={styleModule.submitButton} onClick={submit}>Submit</button>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C4C4_PolygonMeasurementMinigame