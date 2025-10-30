import { CastleWithProgress } from '../common/castle'

export interface CastleMarkerProps {
    castle: CastleWithProgress
    type: 'prev' | 'current' | 'next'
    isSelected: boolean
    isHovered: boolean
    onClick: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}

export interface CastleModalProps {
    castle: CastleWithProgress
    onClose: () => void
    onEnter: (castle: CastleWithProgress) => void
}

export interface CastleStatsProps {
    totalCastles: number
    unlockedCastles: number
    completedCastles: number
    totalXP: number
}

export interface WorldMapIntroProps {
    onIntroComplete: () => void
}
