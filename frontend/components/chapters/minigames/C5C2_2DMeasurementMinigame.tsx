'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { MinigameQuestion } from '@/types/common/quiz'

interface StyleModule {
  readonly [key: string]: string
}

interface MeasurementQuestion extends MinigameQuestion {
  correctPerimeter?: number
  correctArea?: number
  unit?: string
  shape?: string
  type?: 'perimeter' | 'area' | 'both'
}

interface Props {
  question: MeasurementQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

type AnswerStatus = 'correct' | 'pending' | 'missing' | 'optional'

const labelMap: Record<string, string> = {
  length: 'Length',
  width: 'Width',
  height: 'Height ⊥',
  side: 'Side',
  side1: 'Left Side',
  side2: 'Right Side',
  side3: 'Side C',
  base: 'Base',
  base1: 'Top Base',
  base2: 'Bottom Base',
  radius: 'Radius',
  diameter: 'Diameter',
}

const PLACEHOLDER_IMAGE = '/images/placeholders/castle5-shape-placeholder.svg'
const IMAGE_BASE_PATH = '/images/castle5/chapter2'

const slugifyShape = (value?: string) => {
  if (!value) return ''
  return value.toLowerCase().replace(/[\s_]+/g, '-')
}

const buildImagePath = (shape?: string) => {
  const slug = slugifyShape(shape)
  if (!slug) return null
  return `${IMAGE_BASE_PATH}/${slug}.webp`
}

const toFriendlyShape = (shape?: string) => {
  if (!shape) return 'Mystery Polygon'
  return shape
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

const sanitizeToNumber = (value: string): number | null => {
  if (!value.trim()) return null
  
  // Normalize the input: replace 'pi' text with π symbol
  const normalized = value.trim().toLowerCase().replace(/pi/g, 'π')
  
  // Check for symbolic π answer (e.g., "14π", "π", "49π")
  const symbolicMatch = normalized.replace(/\s+/g, '').match(/^([0-9]+(?:\.[0-9]+)?)?π$/)
  if (symbolicMatch) {
    const coeffStr = symbolicMatch[1]
    const coeff = coeffStr ? parseFloat(coeffStr) : 1
    // Return the coefficient * π (e.g., 14π → 14 * 3.14159...)
    return coeff * Math.PI
  }
  
  // Check for expressions with π (e.g., "2*π*5", "π*25")
  if (normalized.includes('π')) {
    try {
      // Handle implicit multiplication (14π → 14*π, π14 → π*14)
      let expression = normalized.replace(/(\d+)(π)/g, '$1*$2')
      expression = expression.replace(/(π)(\d+)/g, '$1*$2')
      
      // Replace π with Math.PI
      expression = expression.replace(/π/g, String(Math.PI))
      
      // Remove any non-mathematical characters
      expression = expression.replace(/[^0-9.+\-*/()]/g, '')
      if (!expression) return null
      
      // Evaluate the expression
      const result = new Function(`return ${expression}`)()
      return Number.isFinite(result) ? result : null
    } catch {
      return null
    }
  }
  
  // Fallback: parse as regular number
  const cleaned = value.replace(/[^0-9.+-]/g, '')
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

const matchesWithinTolerance = (expected: number, value: string) => {
  const parsed = sanitizeToNumber(value)
  if (parsed === null) return false
  
  // Use larger tolerance for π-based answers (up to 2% or 1 unit, whichever is larger)
  const hasPi = value.includes('π')
  const tolerance = hasPi 
    ? Math.max(1, Math.abs(expected) * 0.02)  // 2% tolerance or 1 unit for π answers
    : Math.max(0.5, Math.abs(expected) * 0.01) // 1% tolerance or 0.5 for numeric answers
  
  const difference = Math.abs(parsed - expected)
  console.log(`Comparing: ${value} → ${parsed} vs expected ${expected}, diff: ${difference}, tolerance: ${tolerance}, match: ${difference <= tolerance}`)
  
  return difference <= tolerance
}

const C5C2_2DMeasurementMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [perimeterAnswer, setPerimeterAnswer] = useState('')
  const [areaAnswer, setAreaAnswer] = useState('')
  const [focusedField, setFocusedField] = useState<'perimeter' | 'area' | null>(null)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const computedImageSrc = useMemo(() => buildImagePath(question.shape as string), [question.shape])
  const [imageSrc, setImageSrc] = useState<string>(computedImageSrc || PLACEHOLDER_IMAGE)

  useEffect(() => {
    setImageSrc(computedImageSrc || PLACEHOLDER_IMAGE)
  }, [computedImageSrc])

  const handleImageError = () => {
    if (imageSrc !== PLACEHOLDER_IMAGE) {
      setImageSrc(PLACEHOLDER_IMAGE)
    }
  }

  const needsPerimeter = typeof question.correctPerimeter === 'number' || question.type === 'perimeter' || question.type === 'both'
  const needsArea = typeof question.correctArea === 'number' || question.type === 'area' || question.type === 'both'
  const unitLabel = question.unit || 'units'
  const hintText = `${question.hint ? `${question.hint} ` : ''}Click the π button to insert pi in your answer (e.g., 2*π*5).`
  
  // Determine if shape is a circle to show "Circumference" instead of "Perimeter"
  const isCircle = question.shape?.toLowerCase().includes('circle')
  const perimeterLabel = isCircle ? 'Circumference' : 'Perimeter'

  const dimensions = useMemo(() => {
    const q: any = question
    const results: { label: string; value: string }[] = []
    const addEntry = (key: string, raw: any) => {
      if (raw === undefined || raw === null) return
      const label = labelMap[key] || key
      results.push({ label, value: `${raw} ${unitLabel}`.trim() })
    }

    Object.keys(labelMap).forEach((key) => addEntry(key, q[key]))

    if (Array.isArray(q.sides) && q.sides.length) {
      results.push({ label: 'Sides', value: q.sides.join(', ') + ` ${unitLabel}` })
    }

    if (Array.isArray(q.points) && q.points.length) {
      results.push({ label: 'Points', value: q.points.join(', ') })
    }

    return results
  }, [question, unitLabel])

  const handleSubmit = () => {
    const perimeterCorrect = !needsPerimeter || (typeof question.correctPerimeter === 'number' && matchesWithinTolerance(question.correctPerimeter, perimeterAnswer))
    const areaCorrect = !needsArea || (typeof question.correctArea === 'number' && matchesWithinTolerance(question.correctArea, areaAnswer))
    const isCorrect = perimeterCorrect && areaCorrect

    setFeedback(isCorrect ? 'Gate unlocked! Measurements are correct.' : 'Something is off. Re-check your calculations.')
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, `P=${perimeterAnswer}, A=${areaAnswer}`)
      if (isCorrect) {
        setPerimeterAnswer('')
        setAreaAnswer('')
      }
    }, 1200)
  }

  const insertPiValue = () => {
    const value = 'π'
    if (focusedField === 'perimeter') {
      setPerimeterAnswer((prev) => prev + value)
    } else if (focusedField === 'area') {
      setAreaAnswer((prev) => prev + value)
    }
  }

  const perimeterStatus: AnswerStatus = needsPerimeter
    ? perimeterAnswer
      ? typeof question.correctPerimeter === 'number' && matchesWithinTolerance(question.correctPerimeter, perimeterAnswer)
        ? 'correct'
        : 'pending'
      : 'missing'
    : 'optional'

  const areaStatus: AnswerStatus = needsArea
    ? areaAnswer
      ? typeof question.correctArea === 'number' && matchesWithinTolerance(question.correctArea, areaAnswer)
        ? 'correct'
        : 'pending'
      : 'missing'
    : 'optional'

  const renderStatusBadge = (status: AnswerStatus) => {
    const palette: Record<AnswerStatus, { text: string; color: string; border: string }> = {
      correct: { text: '✓ Ready', color: '#4CAF50', border: 'rgba(76,175,80,0.5)' },
      pending: { text: 'Check Value', color: '#FFC107', border: 'rgba(255,193,7,0.4)' },
      missing: { text: 'Enter value', color: '#FF7043', border: 'rgba(255,112,67,0.4)' },
      optional: { text: 'Optional', color: '#90A4AE', border: 'rgba(144,164,174,0.4)' },
    }
    const styles = palette[status]
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: styles.color,
          border: `1px solid ${styles.border}`,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        {styles.text}
      </span>
    )
  }

  return (
    <div className={`${styleModule.minigameContainer} castle5Theme`} style={{ maxWidth: '850px', padding: '0.75rem', gap: '0.5rem', maxHeight: 'calc(100vh - 160px)' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%' }}>
        {/* Left side - Canvas */}
        <div style={{ flex: '1 1 50%', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(12, 22, 55, 0.6)', aspectRatio: '16 / 9', width: '100%' }}>
            <Image
              src={imageSrc}
              alt={`${toFriendlyShape(question.shape)} preview`}
              fill
              sizes="400px"
              style={{ objectFit: 'contain', padding: '0.5rem' }}
              onError={handleImageError}
            />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFE3A9', textAlign: 'center' }}>
            {toFriendlyShape(question.shape)}
          </div>
          
          {/* Dimensions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '0.4rem',
            }}
          >
            {dimensions.map((dimension) => (
              <div
                key={`${dimension.label}-${dimension.value}`}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  padding: '0.3rem 0.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.65rem', color: '#9FB3D6', textTransform: 'uppercase' }}>
                  {dimension.label}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#E8F4FD', fontWeight: 600 }}>{dimension.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Controls */}
        <div style={{ flex: '1 1 45%', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {needsPerimeter && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontWeight: 600, color: '#FFE3A9', fontSize: '0.85rem' }}>
                {perimeterLabel} ({unitLabel})
              </label>
              <input
                className={styleModule.answerInput}
                placeholder="e.g., 14π"
                value={perimeterAnswer}
                onChange={(e) => setPerimeterAnswer(e.target.value)}
                onFocus={() => setFocusedField('perimeter')}
                style={{ fontSize: '0.9rem', padding: '0.4rem 0.6rem' }}
              />
              {renderStatusBadge(perimeterStatus)}
            </div>
          )}

          {needsArea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontWeight: 600, color: '#FFE3A9', fontSize: '0.85rem' }}>
                Area ({unitLabel}<sup>2</sup>)
              </label>
              <input
                className={styleModule.answerInput}
                placeholder="e.g., 49π"
                value={areaAnswer}
                onChange={(e) => setAreaAnswer(e.target.value)}
                onFocus={() => setFocusedField('area')}
                style={{ fontSize: '0.9rem', padding: '0.4rem 0.6rem' }}
              />
              {renderStatusBadge(areaStatus)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
            <button
              className={styleModule.submitButton}
              type="button"
              onClick={insertPiValue}
              disabled={!focusedField}
              style={{ flex: '0 0 auto', padding: '0.5rem 0.75rem', fontSize: '1rem' }}
            >
              π
            </button>
            <button
              className={styleModule.submitButton}
              onClick={handleSubmit}
              disabled={(needsPerimeter && !perimeterAnswer.trim()) || (needsArea && !areaAnswer.trim())}
              style={{ flex: '1', padding: '0.5rem', fontSize: '0.9rem' }}
            >
              Check Answer
            </button>
          </div>

          <div className={styleModule.hint} style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{hintText}</div>
        </div>
      </div>

      {showFeedback && (
        <div
          className={`${styleModule.feedback} ${
            feedback.startsWith('Gate') ? styleModule.feedbackSuccess : styleModule.feedbackError
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  )
}

export default C5C2_2DMeasurementMinigame