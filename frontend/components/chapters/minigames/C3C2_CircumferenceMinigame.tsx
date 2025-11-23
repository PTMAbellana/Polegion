'use client'

import React, { useState } from 'react'
import { Stage, Layer, Circle as KCircle, Line as KLine, Text as KText } from 'react-konva'
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

  const canvasWidth = 420
  const canvasHeight = 300
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const circleR = 105
  const [hovered, setHovered] = useState<string | null>(null)

  const insertPi = () => {
    const normalized = answer + (answer.endsWith(' ') || answer.length === 0 ? '' : '') + 'π'
    setAnswer(normalized)
  }

  const check = () => {
    const givenRaw = answer.trim().toLowerCase().replace(/pi/g, 'π')
    const expectedCoeff = question.radius != null ? 2 * Number(question.radius) : Number(question.diameter)
    const decimalTarget = Math.round(expectedCoeff * Math.PI * 10) / 10

    let isCorrect = false

    const symbolicMatch = givenRaw.replace(/\s+/g, '').match(/^([0-9]+(?:\.[0-9]+)?)?π$/)
    if (symbolicMatch) {
      const coeffStr = symbolicMatch[1]
      const coeff = coeffStr ? parseFloat(coeffStr) : 1
      isCorrect = Math.abs(coeff - expectedCoeff) < 1e-6
    } else {
      const numericStr = givenRaw.replace(/[^0-9.\-]/g, '')
      const val = parseFloat(numericStr)
      if (!isNaN(val)) {
        isCorrect = Math.abs(val - decimalTarget) <= 0.05
      }
    }

    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, givenRaw)
    }, 1200)
  }

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <Stage width={canvasWidth} height={canvasHeight}>
              <Layer>
                <KCircle x={centerX} y={centerY} radius={circleR} stroke="#2c3e50" strokeWidth={3} fill="#f7fbff" />
                
                {/* Radius or Diameter display */}
                {question.radius != null ? (
                  (() => {
                    const angleRad = Math.PI / 180 * 30
                    const endX = centerX + circleR * Math.cos(angleRad)
                    const endY = centerY - circleR * Math.sin(angleRad)
                    const isHover = hovered === 'radius'
                    return (
                      <>
                        <KLine
                          points={[centerX, centerY, endX, endY]}
                          stroke="#2d6cdf"
                          strokeWidth={4}
                          hitStrokeWidth={20}
                          opacity={isHover ? 1 : 0.9}
                          shadowColor="#2d6cdf"
                          shadowBlur={isHover ? 10 : 0}
                          shadowOpacity={isHover ? 0.7 : 0}
                          onMouseEnter={(e) => {
                            setHovered('radius');
                            const container = e.target.getStage()?.container();
                            if (container) {
                              container.style.cursor = 'pointer';
                            }
                          }}
                          onMouseLeave={(e) => {
                            setHovered(null);
                            const container = e.target.getStage()?.container();
                            if (container) {
                              container.style.cursor = 'default';
                            }
                          }}
                        />
                        <KText x={endX + 6} y={endY - 8} text={`r = ${question.radius}`} fontSize={16} fill="#2d6cdf" opacity={isHover ? 1 : 0.9} />
                      </>
                    )
                  })()
                ) : (
                  (() => {
                    const isHover = hovered === 'diameter'
                    return (
                      <>
                        <KLine
                          points={[centerX - circleR, centerY, centerX + circleR, centerY]}
                          stroke="#c23b22"
                          strokeWidth={4}
                          hitStrokeWidth={20}
                          opacity={isHover ? 1 : 0.9}
                          shadowColor="#c23b22"
                          shadowBlur={isHover ? 10 : 0}
                          shadowOpacity={isHover ? 0.7 : 0}
                          onMouseEnter={(e) => {
                            setHovered('diameter');
                            const container = e.target.getStage()?.container();
                            if (container) {
                              container.style.cursor = 'pointer';
                            }
                          }}
                          onMouseLeave={(e) => {
                            setHovered(null);
                            const container = e.target.getStage()?.container();
                            if (container) {
                              container.style.cursor = 'default';
                            }
                          }}
                        />
                        <KText x={centerX + circleR + 8} y={centerY - 8} text={`d = ${question.diameter}`} fontSize={16} fill="#c23b22" opacity={isHover ? 1 : 0.9} />
                      </>
                    )
                  })()
                )}
              </Layer>
            </Stage>
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
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className={styleModule.submitButton} onClick={insertPi}>π</button>
            <button className={styleModule.submitButton} onClick={check}>Submit</button>
          </div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C3C2_CircumferenceMinigame