import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CastleState } from '@/types/state/castle'
import { getAllCastles } from '@/api/castles'
import { logger } from '@/utils/logger'

// Helper to get user-specific storage key
const getUserStorageKey = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return 'castle-storage-guest'
    }
    
    try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
            const parsed = JSON.parse(authStorage)
            const userId = parsed?.state?.userProfile?.id
            if (userId) {
                return `castle-storage-${userId}`
            }
        }
    } catch (error) {
        logger.error('[CastleStore] Error getting user storage key:', error)
    }
    return 'castle-storage-guest'
}

export const useCastleStore = create<CastleState>()(
    persist(
        (set, get) => ({
            // Initial state
            castles: [],
            currentCastleIndex: 0,
            selectedCastle: null,
            hoveredCastle: null,
            loading: false,
            error: null,
            initialized: false,
            showIntro: false,

            // Actions
            fetchCastles: async (userId: string) => {
                // Validate userId before making request
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                
                if (!userId || !uuidRegex.test(userId)) {
                    logger.warn('[CastleStore] Invalid or missing userId, skipping fetch:', userId)
                    set({ loading: false, error: null })
                    return
                }
                
                set({ loading: true, error: null })
                
                try {
                    logger.log('[CastleStore] Fetching castles for user:', userId)
                    const castles = await getAllCastles(userId)
                    logger.log('[CastleStore] Fetched castles:', castles)
                    logger.log('[CastleStore] Castle progress details:', castles.map((c: any) => ({
                        name: c.name,
                        unlocked: c.progress?.unlocked,
                        completed: c.progress?.completed,
                        hasProgress: !!c.progress
                    })))
                    
                    const sortedCastles = castles.sort(
                        (a: any, b: any) => a.unlock_order - b.unlock_order
                    )
                    
                    // Find first unlocked castle
                    const firstUnlockedIndex = sortedCastles.findIndex(
                        (c: any) => c.progress?.unlocked
                    )
                    
                    logger.log('[CastleStore] First unlocked castle index:', firstUnlockedIndex)
                    
                    set({
                        castles: sortedCastles,
                        currentCastleIndex: firstUnlockedIndex >= 0 ? firstUnlockedIndex : 0,
                        loading: false,
                        error: null,
                        initialized: true
                    })
                } catch (error: any) {
                    logger.error('[CastleStore] Error fetching castles:', error)
                    logger.error('[CastleStore] Error details:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status
                    })
                    set({
                        error: error.response?.data?.error || error.message || 'Failed to load castles',
                        loading: false,
                        castles: []
                    })
                }
            },

            setCurrentCastleIndex: (index: number) => {
                set({ currentCastleIndex: index })
            },

            setSelectedCastle: (castle) => {
                set({ selectedCastle: castle })
            },

            setHoveredCastle: (castle) => {
                set({ hoveredCastle: castle })
            },

            setShowIntro: (show: boolean) => {
                set({ showIntro: show })
            },

            clearError: () => {
                set({ error: null })
            },

            reset: () => {
                set({
                    castles: [],
                    currentCastleIndex: 0,
                    selectedCastle: null,
                    hoveredCastle: null,
                    loading: false,
                    error: null,
                    initialized: false,
                    showIntro: false
                })
                
                // Clear user-specific localStorage
                if (typeof window !== 'undefined') {
                    try {
                        const storageKey = getUserStorageKey()
                        localStorage.removeItem(storageKey)
                        logger.log(`[CastleStore] Cleared storage: ${storageKey}`)
                    } catch (error) {
                        logger.error('[CastleStore] Error clearing storage:', error)
                    }
                }
            },

            // Computed
            getCastleStats: () => {
                const castles = get().castles
                return {
                    totalCastles: castles.length,
                    unlockedCastles: castles.filter(c => c.progress?.unlocked).length,
                    completedCastles: castles.filter(c => c.progress?.completed).length,
                    totalXP: castles.reduce((sum, c) => sum + (c.progress?.total_xp_earned || 0), 0)
                }
            }
        }),
        {
            name: getUserStorageKey(),
            storage: createJSONStorage(() => {
                // Return a no-op storage during SSR
                if (typeof window === 'undefined') {
                    return {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {},
                    }
                }
                return localStorage
            }),
            partialize: (state) => ({
                // Don't persist showIntro - it should be controlled by localStorage check
                // Only persist UI preferences that don't have their own storage
            })
        }
    )
)
