import { useRef, useEffect, useCallback } from 'react'

export interface UseChapterAudioOptions {
  isMuted: boolean
  audioBasePath?: string
}

export interface UseChapterAudioReturn {
  playNarration: (filename: string) => void
  stopAudio: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export function useChapterAudio({ 
  isMuted, 
  audioBasePath = '/audio/narration' 
}: UseChapterAudioOptions): UseChapterAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playNarration = useCallback((audioPath: string) => {
    // Skip audio playback if muted or no audio path
    if (isMuted || !audioPath) return
    
    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      // If path already includes an audio extension, use as-is; otherwise add .mp3
      const hasExtension = audioPath.match(/\.(mp3|wav|ogg|m4a)$/i)
      const fullPath = hasExtension ? audioPath : `${audioPath}.mp3`
      const audio = new Audio(fullPath)
      
      audio.onerror = () => {
        // Silently fail - audio files are optional
        console.log(`[Audio] File not found (optional): ${fullPath}`)
      }
      
      audio.play().catch(err => {
        // Silently fail - audio is optional
        console.log(`[Audio] Playback skipped (optional): ${fullPath}`)
      })
      
      audioRef.current = audio
    } catch (error) {
      // Silently fail - audio is optional
      console.log('[Audio] Audio playback is optional, continuing without sound')
    }
  }, [isMuted, audioBasePath])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  // Stop audio when muted
  useEffect(() => {
    if (isMuted && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isMuted])

  return {
    playNarration,
    stopAudio,
    audioRef
  }
}
