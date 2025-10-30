import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseChapterDialogueOptions {
  dialogue: string[]
  autoAdvance: boolean
  onDialogueComplete?: () => void
  typingSpeed?: number
  autoAdvanceDelay?: number
}

export interface UseChapterDialogueReturn {
  currentMessage: string
  displayedText: string
  messageIndex: number
  isTyping: boolean
  handleDialogueClick: () => void
  handleNextMessage: () => void
  setCurrentMessage: (message: string) => void
  setMessageIndex: (index: number) => void
  resetDialogue: () => void
}

export function useChapterDialogue({
  dialogue,
  autoAdvance,
  onDialogueComplete,
  typingSpeed = 15,
  autoAdvanceDelay = 2500
}: UseChapterDialogueOptions): UseChapterDialogueReturn {
  const [currentMessage, setCurrentMessage] = useState("")
  const [displayedText, setDisplayedText] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Typing effect
  useEffect(() => {
    if (!currentMessage) return
    
    setIsTyping(true)
    setDisplayedText("")
    let currentIndex = 0
    
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < currentMessage.length) {
        setDisplayedText(currentMessage.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
        }
        if (autoAdvance) {
          autoAdvanceTimeoutRef.current = setTimeout(() => {
            handleNextMessage()
          }, autoAdvanceDelay)
        }
      }
    }, typingSpeed)

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)
    }
  }, [currentMessage, autoAdvance])

  const handleNextMessage = useCallback(() => {
    if (messageIndex < dialogue.length - 1) {
      setMessageIndex(prev => prev + 1)
      setCurrentMessage(dialogue[messageIndex + 1])
    } else {
      if (onDialogueComplete) {
        onDialogueComplete()
      }
    }
  }, [messageIndex, dialogue, onDialogueComplete])

  const handleDialogueClick = useCallback(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current)
    }
    
    if (isTyping) {
      // Skip typing animation
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
      setDisplayedText(currentMessage)
      setIsTyping(false)
    } else {
      // Advance to next message
      handleNextMessage()
    }
  }, [isTyping, currentMessage, handleNextMessage])

  const resetDialogue = useCallback(() => {
    setMessageIndex(0)
    setCurrentMessage(dialogue[0])
    setDisplayedText("")
    setIsTyping(false)
  }, [dialogue])

  // Initialize with first message
  useEffect(() => {
    if (dialogue.length > 0 && messageIndex === 0 && !currentMessage) {
      setCurrentMessage(dialogue[0])
    }
  }, [dialogue, messageIndex, currentMessage])

  return {
    currentMessage,
    displayedText,
    messageIndex,
    isTyping,
    handleDialogueClick,
    handleNextMessage,
    setCurrentMessage,
    setMessageIndex,
    resetDialogue
  }
}
