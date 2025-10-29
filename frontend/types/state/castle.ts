import { CastleWithProgress, CastleStats } from '../common/castle'

export interface CastleState {
    // Data
    castles: CastleWithProgress[]
    currentCastleIndex: number
    selectedCastle: CastleWithProgress | null
    hoveredCastle: CastleWithProgress | null
    
    // Loading states
    loading: boolean
    error: string | null
    initialized: boolean
    
    // UI states
    showIntro: boolean
    
    // Actions
    fetchCastles: (userId: string) => Promise<void>
    setCurrentCastleIndex: (index: number) => void
    setSelectedCastle: (castle: CastleWithProgress | null) => void
    setHoveredCastle: (castle: CastleWithProgress | null) => void
    setShowIntro: (show: boolean) => void
    clearError: () => void
    reset: () => void
    
    // Computed
    getCastleStats: () => CastleStats
}
