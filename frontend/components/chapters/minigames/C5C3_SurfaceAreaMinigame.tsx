'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { MinigameQuestion } from '@/types/common/quiz'

interface StyleModule {
  readonly [key: string]: string
}

interface SurfaceAreaQuestion extends MinigameQuestion {
  shape?: string
  hint?: string
  formula?: string
  unit?: string
}

const labelMap: Record<string, string> = {
  side: 'Side',
  length: 'Length',
  width: 'Width',
  height: 'Height',
  radius: 'Radius',
  diameter: 'Diameter',
  slantHeight: 'Slant Height',
  base: 'Base',
  baseEdge: 'Base Edge',
}

const PLACEHOLDER_IMAGE = '/images/placeholders/castle5-shape-placeholder.svg'
const IMAGE_BASE_PATH = '/images/castle5/chapter3'

const slugifyShape = (value?: string) => {
  if (!value) return ''
  return value.toLowerCase().replace(/[\s_]+/g, '-')
}

const buildImagePath = (shape?: string) => {
  const slug = slugifyShape(shape)
  if (!slug) return null
  return `${IMAGE_BASE_PATH}/${slug}.png`
}

const toFriendlyShape = (shape?: string) => {
  if (!shape) return 'Mystery Solid'
  return shape
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

const sanitizeToNumber = (value: string): number | null => {
  if (!value.trim()) return null
  
  // Normalize "pi" text to π symbol
  const normalized = value.trim().toLowerCase().replace(/pi/g, 'π')
  
  // Check for symbolic π notation like "14π" or "49.5π"
  const symbolicMatch = normalized.replace(/\s+/g, '').match(/^([0-9]+(?:\.[0-9]+)?)?π$/)
  if (symbolicMatch) {
    const coefficient = symbolicMatch[1] ? parseFloat(symbolicMatch[1]) : 1
    return coefficient * Math.PI
  }
  
  // Handle expressions with implicit multiplication like "14π" or "2π5"
  try {
    let expr = normalized.replace(/π/g, '*' + Math.PI.toString())
    // Add multiplication between numbers and parentheses/π
    expr = expr.replace(/(\d)\(/g, '$1*(')
    expr = expr.replace(/\)(\d)/g, ')*$1')
    const result = eval(expr)
    return Number.isFinite(result) ? result : null
  } catch {
    // Fallback to simple numeric parsing
    const cleaned = value.replace(/[^0-9.+-]/g, '')
    if (!cleaned) return null
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : null
  }
}

const insertPiValue = (currentAnswer: string, setAnswer: (val: string) => void) => {
  setAnswer(currentAnswer + 'π')
}

const getExpectedValue = (question: MinigameQuestion): number | null => {
  if (typeof question.correctAnswer === 'number') {
    return question.correctAnswer
  }
  if (Array.isArray(question.correctAnswer) && question.correctAnswer.length) {
    const parsed = Number(question.correctAnswer[0])
    return Number.isFinite(parsed) ? parsed : null
  }
  if (typeof question.correctAnswer === 'string') {
    return sanitizeToNumber(question.correctAnswer)
  }
  return null
}

const matchesWithinTolerance = (expected: number | null, value: string) => {
  if (expected === null) return false
  const parsed = sanitizeToNumber(value)
  if (parsed === null) return false
  
  // Determine if the answer uses π symbol (more tolerance for symbolic answers)
  const hasSymbolicPi = value.toLowerCase().includes('π') || value.toLowerCase().includes('pi')
  const tolerance = hasSymbolicPi
    ? Math.max(0.5, Math.abs(expected) * 0.02) // 2% tolerance for π answers
    : Math.max(0.5, Math.abs(expected) * 0.01) // 1% tolerance for numeric
  
  return Math.abs(parsed - expected) <= tolerance
}

const C5C3_SurfaceAreaMinigame: React.FC<{
  question: SurfaceAreaQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}> = ({ question, onComplete, styleModule }) => {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const computedImageSrc = useMemo(() => buildImagePath(question.shape), [question.shape])
  const [imageSrc, setImageSrc] = useState<string>(computedImageSrc || PLACEHOLDER_IMAGE)

  useEffect(() => {
    setImageSrc(computedImageSrc || PLACEHOLDER_IMAGE)
  }, [computedImageSrc])

  const handleImageError = () => {
    if (imageSrc !== PLACEHOLDER_IMAGE) {
      setImageSrc(PLACEHOLDER_IMAGE)
    }
  }

  const expectedValue = useMemo(() => getExpectedValue(question), [question])
  const baseUnit = question.unit || 'units'
  const areaUnit = `${baseUnit}²`

  const dimensions = useMemo(() => {
    const q: any = question
    const entries: { label: string; value: string }[] = []
    const addEntry = (key: string, raw: any) => {
      if (raw === undefined || raw === null) return
      const label = labelMap[key] || key
      entries.push({ label, value: `${raw} ${baseUnit}`.trim() })
    }
    Object.keys(labelMap).forEach((key) => addEntry(key, q[key]))
    return entries
  }, [question, baseUnit])

  const handleSubmit = () => {
    const isCorrect = matchesWithinTolerance(expectedValue, answer)
    setFeedback(isCorrect ? 'Surface restored! Correct surface area.' : 'Not quite. Revisit the formula.')
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, answer)
      if (isCorrect) {
        setAnswer('')
      }
    }, 1200)
  }

  return (
    <div className={`${styleModule.minigameContainer} castle5Theme`}>
      <div className={styleModule.gameAreaWrapper} style={{ maxWidth: '850px', gap: '0.5rem' }}>
        <div className={styleModule.canvasContainer} style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <div className={styleModule.canvasWrapper}>
            <div
              style={{
                padding: '0.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFE3A9' }}>{toFriendlyShape(question.shape)}</div>
              <div style={{ width: '100%', position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(12,22,55,0.6)', aspectRatio: '420 / 190' }}>
                <Image
                  src={imageSrc}
                  alt={`${toFriendlyShape(question.shape)} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: 'contain', padding: '0.75rem' }}
                  onError={handleImageError}
                />
              </div>
              {dimensions.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    gap: '0.5rem',
                  }}
                >
                  {dimensions.map((dimension) => (
                    <div
                      key={`${dimension.label}-${dimension.value}`}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 6,
                        padding: '0.4rem 0.5rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.65rem',
                          color: '#9FB3D6',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {dimension.label}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#E8F4FD', fontWeight: 600 }}>{dimension.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {question.formula && (
                <div
                  style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: 6,
                    border: '1px dashed rgba(255,255,255,0.25)',
                    color: '#B8D2FF',
                    fontSize: '0.75rem',
                  }}
                >
                  {question.formula}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styleModule.controlsContainer} style={{ flex: '1 1 45%', gap: '0.6rem', padding: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: '#FFE3A9', fontSize: '0.85rem' }}>
            Surface Area ({areaUnit})
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className={styleModule.answerInput}
              placeholder="e.g., 150 or 60π"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={() => insertPiValue(answer, setAnswer)}
              style={{
                padding: '0.5rem 0.75rem',
                background: 'rgba(255,227,169,0.15)',
                border: '1px solid rgba(255,227,169,0.3)',
                borderRadius: 8,
                color: '#FFE3A9',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Insert π symbol"
            >
              π
            </button>
          </div>

          <button className={styleModule.submitButton} onClick={handleSubmit} disabled={!answer.trim()}>
            Validate Surface Area
          </button>

          <div className={styleModule.hint} style={{ fontSize: '0.75rem' }}>
            {question.hint || 'Sum all faces. Use π button for circular shapes. Formula hints above!'}
          </div>
        </div>
      </div>
      {showFeedback && (
        <div
          className={`${styleModule.feedback} ${
            feedback.startsWith('Surface') ? styleModule.feedbackSuccess : styleModule.feedbackError
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  )
}

export default C5C3_SurfaceAreaMinigame