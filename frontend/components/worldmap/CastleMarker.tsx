"use client"

import React, { useState } from 'react'
import { CastleMarkerProps } from '@/types/props/castle'
import styles from '@/styles/world-map.module.css'

export default function CastleMarker({
  castle,
  type,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CastleMarkerProps) {
  const [imgError, setImgError] = useState(false)

  const markerClasses = [
    styles.castle_marker,
    type === 'current' ? styles.current_castle : styles.side_castle,
    castle.progress?.unlocked ? styles.unlocked : styles.locked,
    castle.progress?.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
  ].join(' ')

  const getImagePath = () => {
    if (imgError) {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%234a5568"/><text y="50%" x="50%" text-anchor="middle" dominant-baseline="middle" font-size="100">🏰</text></svg>'
    }
    return `/images/castles/castle${castle.image_number}.png`
  }

  const handleImageError = () => {
    if (!imgError) {
      console.warn(`Image not found: /images/castles/castle${castle.image_number}.png`)
      setImgError(true)
    }
  }

  return (
    <div
      className={markerClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.castle_image_container}>
        <img
          src={getImagePath()}
          alt={castle.name}
          className={`${styles.castle_image} ${!castle.progress?.unlocked ? styles.locked_filter : ''}`}
          draggable={false}
          onError={handleImageError}
        />

        {castle.progress?.completed && (
          <div className={styles.completion_crown}>👑</div>
        )}

        {!castle.progress?.unlocked && (
          <div className={styles.lock_overlay}>🔒</div>
        )}
      </div>

      {type === 'current' && (
        <div className={styles.castle_name_plate}>{castle.name}</div>
      )}
    </div>
  )
}
