"use client"

import React, { useState } from 'react'
import { CastleMarkerProps } from '@/types/props/castle'
import styles from '@/styles/world-map.module.css'

export default function CastleMarker({
  castle,
  type,
  isSelected,
  isHovered,
  animationDirection,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CastleMarkerProps) {
  const [imgError, setImgError] = useState(false)

  // Determine animation classes based on type and direction
  const getAnimationClass = () => {
    if (!animationDirection) return '';
    
    if (animationDirection === 'right') {
      // When moving right (clicking >):
      // - Prev (CL) stays as side castle (no animation needed)
      // - Current (CC) becomes prev - shrinks from center to side
      // - Next (CR) becomes current - grows from side to center (handled by current_castle)
      // - New next appears - grows from small to side
      if (type === 'prev') return styles.shrinking_from_center; // This was the old current
      if (type === 'next') return styles.appearing; // This is the new castle appearing
    } else if (animationDirection === 'left') {
      // When moving left (clicking <):
      // - Prev (CL) becomes current - grows from side to center (handled by current_castle)
      // - Current (CC) becomes next - shrinks from center to side
      // - Next (CR) stays as side castle (no animation needed)
      // - New prev appears - grows from small to side
      if (type === 'prev') return styles.appearing; // This is the new castle appearing
      if (type === 'next') return styles.shrinking_from_center; // This was the old current
    }
    
    return '';
  };

  const markerClasses = [
    styles.castle_marker,
    type === 'current' ? styles.current_castle : styles.side_castle,
    castle.progress?.unlocked ? styles.unlocked : styles.locked,
    castle.progress?.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
    getAnimationClass(),
  ].filter(Boolean).join(' ')

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
      </div>

      {type === 'current' && (
        <div className={styles.castle_name_plate}>{castle.name}</div>
      )}
    </div>
  )
}
