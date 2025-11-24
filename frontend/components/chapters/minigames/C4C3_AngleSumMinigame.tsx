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

  const n = (question as any).sides as number
  const isRegular = !!(question as any).isRegular
  const computedSum = typeof n === 'number' ? (n - 2) * 180 : undefined
  const expected = isRegular && computedSum ? Math.round(computedSum / n) : (question.correctAnswer as any)

  const submit = () => {
    const trimmed = value.trim()
    const target = String(expected ?? '').trim()
    const isCorrect = trimmed === target
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, value)
      setValue('')
    }, 1200)
  }

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.levelInfoContainer}>
        <div className={styleModule.questionText}>{(question as any).instruction}</div>
      </div>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <div className={styleModule.formulaDisplay}>
              {typeof n === 'number' ? (
                <>
                  <div>Sum = (n − 2) × 180°</div>
                  <div>n = {n}</div>
                  {isRegular && (
                    <div>Each angle = Sum ÷ n</div>
                  )}
                </>
              ) : (
                <div>Set the number of sides</div>
              )}
            </div>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.inputContainer}>
            <input
              className={styleModule.answerInput}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isRegular ? 'Each angle' : 'Sum'}
            />
            <span style={{ color: '#FFFD8F', fontWeight: 700 }}>°</span>
          </div>
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