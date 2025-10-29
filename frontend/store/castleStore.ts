import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CastleState } from '@/types/state/castle'
import { getAllCastles } from '@/api/castles'

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
                set({ loading: true, error: null })
                
                try {
                    console.log('[CastleStore] Fetching castles for user:', userId)
                    const castles = await getAllCastles(userId)
                    console.log('[CastleStore] Fetched castles:', castles)
                    
                    const sortedCastles = castles.sort(
                        (a, b) => a.unlock_order - b.unlock_order
                    )
                    
                    // Find first unlocked castle
                    const firstUnlockedIndex = sortedCastles.findIndex(
                        c => c.progress?.unlocked
                    )
                    
                    set({
                        castles: sortedCastles,
                        currentCastleIndex: firstUnlockedIndex >= 0 ? firstUnlockedIndex : 0,
                        loading: false,
                        error: null,
                        initialized: true
                    })
                } catch (error: any) {
                    console.error('[CastleStore] Error fetching castles:', error)
                    console.error('[CastleStore] Error details:', {
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
            name: 'castle-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                initialized: state.initialized,
                showIntro: state.showIntro
            })
        }
    )
)
