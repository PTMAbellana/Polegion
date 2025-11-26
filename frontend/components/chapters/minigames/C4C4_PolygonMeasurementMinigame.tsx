'use client'

import React, { useMemo, useState } from 'react'
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

  const computed = useMemo(() => {
    const q: any = question
    if (q.type === 'perimeter') {
      if (q.shape === 'rectangle') return 2 * (q.length + q.width)
      if (q.shape === 'square') return 4 * q.side
    }
    if (q.type === 'area') {
      if (q.shape === 'rectangle') return q.length * q.width
      if (q.shape === 'square') return q.side * q.side
      if (q.shape === 'triangle') return (q.base * q.height) / 2
      if (q.shape === 'parallelogram') return q.base * q.height
      if (q.shape === 'trapezoid') return ((q.base1 + q.base2) * q.height) / 2
    }
    return undefined
  }, [question])

  const submit = () => {
    const expected = (question.correctAnswer ?? computed)?.toString().trim()
    const isCorrect = expected === answer.trim()
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, answer)
      setAnswer('')
    }, 1200)
  }

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                height: 260,
                border: '2px dashed rgba(255, 225, 175, 0.6)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#FFE1AF'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Image Placeholder</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  {(question as any).shape} · {(question as any).type}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{(question as any).instruction}</div>
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