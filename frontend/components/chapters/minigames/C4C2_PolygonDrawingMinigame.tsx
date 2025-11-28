'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Line, Circle } from 'react-konva'
import type { MinigameQuestion } from '@/types/common/quiz'

interface StyleModule { readonly [key: string]: string }

interface Props {
  question: MinigameQuestion
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void
  styleModule: StyleModule
}

const TYPE_TO_COUNT: Record<string, number> = {
  triangle: 3,
  square: 4,
  rectangle: 4,
  pentagon: 5,
  hexagon: 6,
  octagon: 8,
}

const C4C2_PolygonDrawingMinigame: React.FC<Props> = ({ question, onComplete, styleModule }) => {
  const [points, setPoints] = useState<number[]>([])
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 520, height: 320 })

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const w = Math.min(containerRef.current.clientWidth, 600)
      const h = Math.max(220, Math.floor(w * 0.5))
      setCanvasSize({ width: w, height: h })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const requiredCount = useMemo(() => TYPE_TO_COUNT[(question as any).polygonType?.toLowerCase() || ''], [question])

  const handleStageClick = (e: any) => {
    if (isClosed) return
    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()
    if (!pointer) return
    setPoints((prev) => [...prev, pointer.x, pointer.y])
  }

  const reset = () => {
    setPoints([])
    setIsClosed(false)
    setShowFeedback(false)
    setFeedback('')
  }

  const closeShape = () => {
    if (points.length >= 6) {
      setIsClosed(true)
    }
  }

  function toVertices(arr: number[]) {
    const verts: { x: number; y: number }[] = []
    for (let i = 0; i < arr.length; i += 2) verts.push({ x: arr[i], y: arr[i + 1] })
    return verts
  }

  function area(verts: { x: number; y: number }[]) {
    let s = 0
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i]
      const b = verts[(i + 1) % verts.length]
      s += a.x * b.y - b.x * a.y
    }
    return Math.abs(s) / 2
  }

  function orientation(a: any, b: any, c: any) {
    const v = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
    return v
  }

  function segmentsIntersect(p1: any, p2: any, p3: any, p4: any) {
    function dir(a: any, b: any, c: any) {
      const val = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
      if (val === 0) return 0
      return val > 0 ? 1 : -1
    }
    const d1 = dir(p1, p2, p3)
    const d2 = dir(p1, p2, p4)
    const d3 = dir(p3, p4, p1)
    const d4 = dir(p3, p4, p2)
    if (d1 !== d2 && d3 !== d4) return true
    return false
  }

  function isSimplePolygon(verts: { x: number; y: number }[]) {
    const n = verts.length
    if (n < 3) return false
    for (let i = 0; i < n; i++) {
      const a1 = verts[i]
      const a2 = verts[(i + 1) % n]
      for (let j = i + 1; j < n; j++) {
        // skip adjacent edges and the shared vertex connections
        if (j === i) continue
        if ((i + 1) % n === j) continue
        if ((j + 1) % n === i) continue
        const b1 = verts[j]
        const b2 = verts[(j + 1) % n]
        if (segmentsIntersect(a1, a2, b1, b2)) return false
      }
    }
    return true
  }

  function length(a: any, b: any) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.hypot(dx, dy)
  }

  function dot(u: any, v: any) {
    return u.x * v.x + u.y * v.y
  }

  function isRightAngle(u: any, v: any, tolerance = 0.2) {
    const nu = Math.hypot(u.x, u.y)
    const nv = Math.hypot(v.x, v.y)
    if (nu === 0 || nv === 0) return false
    const cos = Math.abs(dot(u, v) / (nu * nv))
    return cos <= tolerance
  }

  function validateShape(verts: { x: number; y: number }[]) {
    if (!isClosed) return false
    const countOk = requiredCount && verts.length === requiredCount
    const areaOk = area(verts) > 20 // minimum area to avoid degenerate shapes
    const simpleOk = isSimplePolygon(verts)
    if (!countOk || !areaOk || !simpleOk) return false
    const type = (question as any).polygonType?.toLowerCase()
    if (type === 'square' || type === 'rectangle') {
      if (verts.length !== 4) return false
      const edges = [] as any[]
      for (let i = 0; i < 4; i++) {
        const a = verts[i]
        const b = verts[(i + 1) % 4]
        edges.push({ x: b.x - a.x, y: b.y - a.y })
      }
      const rightAngles = isRightAngle(edges[0], edges[1]) && isRightAngle(edges[1], edges[2]) && isRightAngle(edges[2], edges[3]) && isRightAngle(edges[3], edges[0])
      if (!rightAngles) return false
      const sides = [length(verts[0], verts[1]), length(verts[1], verts[2]), length(verts[2], verts[3]), length(verts[3], verts[0])]
      const avg = sides.reduce((a, b) => a + b, 0) / 4
      const within = (val: number, target: number, tol = 0.25) => Math.abs(val - target) / target <= tol
      if (type === 'square') {
        // all sides roughly equal
        if (!sides.every(s => within(s, avg, 0.2))) return false
      } else {
        // rectangle: opposite sides roughly equal BUT adjacent sides NOT equal (to exclude squares)
        const oppositeSidesEqual = within(sides[0], sides[2], 0.25) && within(sides[1], sides[3], 0.25)
        const adjacentSidesDifferent = !within(sides[0], sides[1], 0.15) || !within(sides[1], sides[2], 0.15)
        if (!oppositeSidesEqual || !adjacentSidesDifferent) return false
      }
    }
    return true
  }

  const submit = () => {
    const vertexCount = Math.floor(points.length / 2)
    const verts = toVertices(points)
    const isCorrect = validateShape(verts)
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      onComplete(!!isCorrect, `${vertexCount}`)
      setTimeout(() => reset(), 10)
    }, 1200)
  }

  const linePoints = useMemo(() => points, [points])

  useEffect(() => {
    reset()
  }, [question])

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.gameAreaWrapper}>
        <div className={styleModule.controlsContainer}>
          <div className={styleModule.questionText} style={{ fontSize: '1rem' }}>{(question as any).instruction}</div>
          <div className={styleModule.hint} style={{ fontSize: '0.95rem' }}>
            Points placed: {Math.floor(points.length / 2)}{requiredCount ? ` / ${requiredCount}` : ''}
          </div>
          <div className={styleModule.hint} style={{ fontSize: '0.95rem' }}>
            {requiredCount
              ? `Tap the canvas to drop points. Place ${requiredCount} points. Then tap Close Shape and Submit.`
              : 'Tap the canvas to drop points. Then tap Close Shape and Submit.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <button
              className={styleModule.submitButton}
              onClick={reset}
              style={{ width: '100%' }}
            >
              Clear
            </button>
            <button
              className={styleModule.submitButton}
              onClick={closeShape}
              disabled={isClosed || points.length < 6}
              style={{ width: '100%' }}
            >
              Close
            </button>
            <button
              className={styleModule.submitButton}
              onClick={submit}
              disabled={!requiredCount || !isClosed}
              style={{ width: '100%' }}
            >
              Submit
            </button>
          </div>
          {showFeedback && (
            <div className={`${styleModule.feedback} ${feedback === 'Correct!' ? styleModule.feedbackSuccess : styleModule.feedbackError}`}>{feedback}</div>
          )}
        </div>
        <div className={styleModule.canvasContainer}>
          <div ref={containerRef} className={styleModule.canvasWrapper} style={{ width: '100%', maxWidth: '100%' }}>
            <Stage width={canvasSize.width} height={canvasSize.height} onClick={handleStageClick}>
              <Layer>
                {linePoints.length >= 4 && (
                  <Line points={linePoints} stroke="#B0CE88" strokeWidth={3} closed={isClosed} fill={isClosed ? 'rgba(176,206,136,0.2)' : undefined} />
                )}
                {points.map((_, i) => i % 2 === 0 && (
                  <Circle key={i} x={points[i]} y={points[i + 1]} radius={4} fill="#FFFD8F" />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  )
}

export default C4C2_PolygonDrawingMinigame