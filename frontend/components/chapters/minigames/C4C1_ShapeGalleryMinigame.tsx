'use client'

import React, { useMemo, useState } from 'react'
import { Stage, Layer, RegularPolygon, Group, Rect, Text } from 'react-konva'
import type { MinigameQuestion } from '@/types/common/quiz'

interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const POLYGON_NAMES: Record<number, string> = {
  3: 'triangle',
  4: 'quadrilateral',
  5: 'pentagon',
  6: 'hexagon',
  7: 'heptagon',
  8: 'octagon',
  9: 'nonagon',
  10: 'decagon',
}

const OPTIONS = ['triangle','quadrilateral','pentagon','hexagon','heptagon','octagon','nonagon','decagon']

const C4C1_ShapeGalleryMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const isClassification = typeof (question as any).sides === 'number'
  const isRelationCheck = typeof (question as any).type === 'string' && !isClassification

  const correctAnswer = (question.correctAnswer?.toString() || '').toLowerCase()
  const relationExpected = React.useMemo(() => {
    const q: any = question
    if (!isRelationCheck) return null
    if (q.type === 'congruent') {
      return q.correctAnswer ? 'congruent' : 'not congruent'
    }
    if (q.type === 'similar') {
      return q.correctAnswer ? 'similar' : 'not similar'
    }
    return null
  }, [question, isRelationCheck])

  const canvasSize = useMemo(() => ({ width: 520, height: 320 }), [])

  const handleSubmitChoice = (choice: string) => {
    const normalized = choice.toLowerCase()
    const expected = isRelationCheck ? relationExpected : correctAnswer
    const isCorrect = normalized === expected
    setSelected(choice)
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, choice)
      setSelected(null)
    }, 1200)
  }

  const relationOptions = useMemo(() => {
    if ((question as any).type === 'congruent') return ['Congruent', 'Not Congruent']
    if ((question as any).type === 'similar') return ['Similar', 'Not Similar']
    return []
  }, [question])

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>
            <Stage width={canvasSize.width} height={canvasSize.height}>
              <Layer>
                {isClassification && (
                  <RegularPolygon x={260} y={160} sides={(question as any).sides as number} radius={100} fill="#f8d28b" stroke="#b7825f" strokeWidth={4} />
                )}
                {isRelationCheck && (
                  <Group>
                    <RegularPolygon x={190} y={160} sides={4} radius={70} fill="#c7e6a2" stroke="#4c763b" strokeWidth={4} />
                    <RegularPolygon x={330} y={160} sides={4} radius={(question as any).type === 'congruent' ? 70 : 50} fill="#ffd08f" stroke="#b7825f" strokeWidth={4} />
                  </Group>
                )}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText}>{(question as any).instruction}</div>
          {!isRelationCheck && (
            <div className={styleModule.answerOptions} style={{ gap: 8 }}>
              {(() => {
                const idx = OPTIONS.indexOf(correctAnswer)
                const decoys: string[] = []
                ;[-1, -2, 1, 2, -3, 3].forEach((off) => {
                  const i = idx + off
                  if (decoys.length < 3 && i >= 0 && i < OPTIONS.length && OPTIONS[i] !== correctAnswer) {
                    decoys.push(OPTIONS[i])
                  }
                })
                const display = [correctAnswer, ...decoys].slice(0, 4)
                return display.map((opt) => (
                  <div
                    key={opt}
                    className={`${styleModule.answerOption} ${selected === opt ? styleModule.answerOptionSelected : ''}`}
                    onClick={() => handleSubmitChoice(opt)}
                    style={{ padding: '6px 10px', fontSize: '0.85rem', minWidth: 100 }}
                  >
                    {opt}
                  </div>
                ))
              })()}
            </div>
          )}
          {isRelationCheck && (
            <div className={styleModule.answerOptions} style={{ gap: 8 }}>
              {relationOptions.map((opt) => (
                <div
                  key={opt}
                  className={`${styleModule.answerOption} ${selected === opt ? styleModule.answerOptionSelected : ''}`}
                  onClick={() => handleSubmitChoice(opt)}
                  style={{ padding: '6px 10px', fontSize: '0.85rem', minWidth: 100 }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
          <div className={styleModule.hint}>{(question as any).hint || ''}</div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default C4C1_ShapeGalleryMinigame