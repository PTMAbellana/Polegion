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
            {(question as any).image ? (
              <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                display: 'inline-block',
                maxWidth: '100%',
              }}>
                <img
                  src={(question as any).image}
                  alt={`${(question as any).shape} ${(question as any).type}`}
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    height: 260,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            ) : (
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
                  background: 'white',
                  color: '#957C62'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Image Placeholder</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    {(question as any).shape} · {(question as any).type}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{(question as any).instruction}</div>
          <div 
            style={{
              backgroundColor: 'rgba(255, 225, 175, 0.25)',
              border: '2px solid rgba(255, 225, 175, 0.5)',
              padding: '14px 16px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '500',
              lineHeight: '1.5',
              textAlign: 'left',
              color: '#FFE1AF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              animation: 'gentleGlow 2s ease-in-out infinite',
              marginBottom: '12px',
            }}
          >
            {(question as any).hint || 'Calculate the measurement based on the given values.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '12px' }}>
            <input 
              className={styleModule.answerInput} 
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)} 
              placeholder={'Answer'}
              style={{ 
                width: '100%', 
                maxWidth: '280px',
                padding: '10px 14px',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'rgba(26, 26, 46, 0.6)',
                border: '2px solid #FFE1AF',
                borderRadius: '8px',
                color: '#FFE1AF',
                textAlign: 'center'
              }}
            />
            <button 
              className={styleModule.submitButton} 
              onClick={submit}
              style={{ minWidth: '120px' }}
            >
              Submit
            </button>
          </div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes gentleGlow {
          0%, 100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(255, 225, 175, 0.3); }
          50% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(255, 225, 175, 0.5); }
        }
      `}</style>
    </div>
  )
}

export default C4C4_PolygonMeasurementMinigame