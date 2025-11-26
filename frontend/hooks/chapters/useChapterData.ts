import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { AuthProtection } from '@/context/AuthProtection'
import { getChaptersByCastle } from '@/api/chapters'
import { initializeCastleProgress } from '@/api/castles'
import { getChapterQuizzesByChapter } from '@/api/chapterQuizzes'
import { getMinigamesByChapter } from '@/api/minigames'
import type { ChapterQuiz, Minigame } from '@/types/common'

export interface UseChapterDataOptions {
  castleId: string
  chapterNumber: number
  castleRoute?: string
}

export interface UseChapterDataReturn {
  chapterId: string | null
  quiz: ChapterQuiz | null
  minigame: Minigame | null
  loading: boolean
  error: string | null
  authLoading: boolean
  userProfile: any
}

export function useChapterData({ castleId, chapterNumber, castleRoute }: UseChapterDataOptions): UseChapterDataReturn {
  const { userProfile } = useAuthStore()
  const { isLoading: authLoading } = AuthProtection()

  const [chapterId, setChapterId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<ChapterQuiz | null>(null)
  const [minigame, setMinigame] = useState<Minigame | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChapterData = async () => {
      if (!authLoading && userProfile?.id) {
        try {
          setLoading(true)
          setError(null)
          
          console.log(`[useChapterData] Loading data for castle: ${castleId}, chapter: ${chapterNumber}`)
          const chaptersRes = await getChaptersByCastle(castleId)
          
          let chapter = chaptersRes.data?.find((ch: any) => ch.chapter_number === chapterNumber)
          
          if (!chapter && castleRoute) {
            const routeSlug = castleRoute.split('/').filter(Boolean).pop() || castleRoute
            const initRes = await initializeCastleProgress(userProfile.id, routeSlug)
            const initChapters = initRes?.data?.chapters || []
            chapter = initChapters.find((ch: any) => ch.chapter_number === chapterNumber)
          }
          
          if (!chapter) {
            throw new Error(`Chapter ${chapterNumber} not found`)
          }
          
          console.log(`[useChapterData] Found chapter:`, chapter)
          setChapterId(chapter.id)
          
          const [quizzesRes, minigamesRes] = await Promise.all([
            getChapterQuizzesByChapter(chapter.id),
            getMinigamesByChapter(chapter.id)
          ])
          
          if (quizzesRes.data && quizzesRes.data.length > 0) {
            setQuiz(quizzesRes.data[0])
          } else {
            console.warn(`[useChapterData] No quizzes found for chapter ${chapterNumber}`)
          }
          
          if (minigamesRes.data && minigamesRes.data.length > 0) {
            setMinigame(minigamesRes.data[0])
          } else {
            console.warn(`[useChapterData] No minigames found for chapter ${chapterNumber}`)
          }
          
        } catch (err: any) {
          console.error('[useChapterData] Failed to load chapter data:', err)
          setError(err.message || 'Failed to load chapter data')
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadChapterData()
  }, [authLoading, userProfile, castleId, chapterNumber])

  return {
    chapterId,
    quiz,
    minigame,
    loading,
    error,
    authLoading,
    userProfile
  }
}
