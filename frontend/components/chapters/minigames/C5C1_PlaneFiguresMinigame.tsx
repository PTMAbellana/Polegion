'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { MinigameQuestion } from '@/types/common/quiz'

interface StyleModule {
  readonly [key: string]: string
}

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

type ShapeMeta = {
  icon: string
  description: string
  dimension: 'plane' | 'solid'
}

const SHAPE_LIBRARY: Record<string, ShapeMeta> = {
  triangle: {
    icon: '△',
    description: 'A polygon with three straight sides and three angles.',
    dimension: 'plane',
  },
  square: {
    icon: '▢',
    description: 'A plane figure with four equal sides and four right angles.',
    dimension: 'plane',
  },
  rectangle: {
    icon: '▭',
    description: 'A plane figure with four right angles and opposite sides equal.',
    dimension: 'plane',
  },
  circle: {
    icon: '◯',
    description: 'A perfectly round plane curve where every point is equidistant from the center.',
    dimension: 'plane',
  },
  hexagon: {
    icon: '⬣',
    description: 'A plane polygon with six straight sides.',
    dimension: 'plane',
  },
  pentagon: {
    icon: '⬠',
    description: 'A plane polygon with five straight sides.',
    dimension: 'plane',
  },
  cube: {
    icon: '🧊',
    description: 'A solid with six equal square faces.',
    dimension: 'solid',
  },
  sphere: {
    icon: '⚪',
    description: 'A perfectly round 3D object. All points on the surface are equal distance from the center.',
    dimension: 'solid',
  },
  cylinder: {
    icon: '🛢️',
    description: 'A solid with two parallel circular bases connected by a curved surface.',
    dimension: 'solid',
  },
  cone: {
    icon: '🔺',
    description: 'A solid with a circular base that narrows to a single point (apex).',
    dimension: 'solid',
  },
  pyramid: {
    icon: '⟁',
    description: 'A solid with a polygon base and triangular faces that meet at an apex.',
    dimension: 'solid',
  },
  'rectangular prism': {
    icon: '📦',
    description: 'A box-shaped solid with 6 rectangular faces.',
    dimension: 'solid',
  },
}

const PLACEHOLDER_IMAGE = '/images/placeholders/castle5-shape-placeholder.svg'
const IMAGE_BASE_PATH = '/images/castle5/chapter1'

const slugifyShape = (value?: string) => {
  if (!value) return ''
  return value.toLowerCase().replace(/[\s_]+/g, '-')
}

const buildImagePath = (shape?: string) => {
  const slug = slugifyShape(shape)
  if (!slug) return null
  return `${IMAGE_BASE_PATH}/${slug}.png`
}

const PORTALS = [
  {
    id: 'plane',
    title: 'Plane Figures Portal',
    detail: 'Flat 2D shapes that only have length and width.',
  },
  {
    id: 'solid',
    title: 'Solid Figures Portal',
    detail: '3D shapes that have length, width, and height (volume).',
  },
]

const capitalizeShapeName = (value?: string) => {
  if (!value) return 'Mystery Shape'
  return value
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

const C5C1_PlaneFiguresMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const shapeName = (question as any)?.shape

  const computedImageSrc = useMemo(() => buildImagePath(shapeName), [shapeName])
  const [imageSrc, setImageSrc] = useState<string>(computedImageSrc || PLACEHOLDER_IMAGE)

  useEffect(() => {
    setImageSrc(computedImageSrc || PLACEHOLDER_IMAGE)
  }, [computedImageSrc])

  const normalizedType = ((question as any)?.type || '').toLowerCase() as 'plane' | 'solid'

  const shapeKey = useMemo(() => {
    const rawShape: string = ((question as any)?.shape || '').toLowerCase()
    return rawShape
  }, [question])

  const shapeMeta: ShapeMeta | undefined = useMemo(() => {
    if (SHAPE_LIBRARY[shapeKey]) return SHAPE_LIBRARY[shapeKey]
    const fallbackKey = shapeKey.replace(' ', '_')
    return SHAPE_LIBRARY[fallbackKey]
  }, [shapeKey])

  const handlePortalSelection = (portalId: 'plane' | 'solid') => {
    if (showFeedback) return

    setSelectedPortal(portalId)
    const isCorrect = portalId === normalizedType
    setFeedback(isCorrect ? 'Correct! The portal accepts the shape!' : 'Incorrect portal! Try again.')
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      onComplete(isCorrect, portalId)
      if (isCorrect) {
        setSelectedPortal(null)
      }
    }, 1200)
  }

  const handleImageError = () => {
    if (imageSrc !== PLACEHOLDER_IMAGE) {
      setImageSrc(PLACEHOLDER_IMAGE)
    }
  }

  const renderShapeBadge = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
      }}
    >
      <div style={{ width: '100%', maxWidth: 220, position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(12, 22, 55, 0.6)', aspectRatio: '220 / 150' }}>
        <Image
          src={imageSrc}
          alt={`${capitalizeShapeName(shapeName)} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 220px"
          style={{ objectFit: 'contain', padding: '0.75rem' }}
          onError={handleImageError}
        />
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFE3A9' }}>
        {capitalizeShapeName(shapeName)}
      </div>
      <div
        style={{
          fontSize: '0.95rem',
          color: '#DDEBFF',
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 1.4,
        }}
      >
        {shapeMeta?.description || 'Study the figure and decide which portal it belongs to.'}
      </div>
      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: 1,
          color: '#8CCDEB',
          background: 'rgba(12, 22, 55, 0.5)',
        }}
      >
        {(shapeMeta?.dimension || normalizedType || 'plane').toUpperCase()} FIGURE
      </div>
      {imageSrc === PLACEHOLDER_IMAGE && (
        <div style={{ fontSize: '0.75rem', color: '#9FB3D6', marginTop: '0.35rem' }}>Preview image coming soon</div>
      )}
    </div>
  )

  return (
    <div className={`${styleModule.minigameContainer} castle5Theme`}>
      <div className={styleModule.questionText}>
        {question.instruction || 'Determine if the figure is a plane (2D) or solid (3D) figure.'}
      </div>

      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.canvasContainer}>
          <div className={styleModule.canvasWrapper}>{renderShapeBadge()}</div>
        </div>

        <div className={styleModule.controlsContainer} style={{ gap: '1rem' }}>
          {PORTALS.map((portal) => (
            <div
              key={portal.id}
              className={`${styleModule.answerOption} ${
                selectedPortal === portal.id ? styleModule.answerOptionSelected : ''
              }`}
              onClick={() => handlePortalSelection(portal.id as 'plane' | 'solid')}
            >
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{portal.title}</div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#DDEBFF' }}>{portal.detail}</p>
            </div>
          ))}

          <div className={styleModule.hint}>
            {question.hint || 'Plane = flat with no depth. Solid = has thickness / volume.'}
          </div>
        </div>
      </div>

      {showFeedback && (
        <div
          className={`${styleModule.feedback} ${
            feedback.startsWith('Correct') ? styleModule.feedbackSuccess : styleModule.feedbackError
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  )
}

export default C5C1_PlaneFiguresMinigame

