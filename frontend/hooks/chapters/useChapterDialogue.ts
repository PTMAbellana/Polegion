import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseChapterDialogueOptions {
  dialogue: string[]
  autoAdvance: boolean
  onDialogueComplete?: () => void
  typingSpeed?: number
  autoAdvanceDelay?: number
  initialMessageIndex?: number
  onMessageIndexChange?: (index: number) => void
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
  autoAdvanceDelay = 2500,
  initialMessageIndex = 0,
  onMessageIndexChange,
}: UseChapterDialogueOptions): UseChapterDialogueReturn {
  const [currentMessage, setCurrentMessage] = useState("")
  const [displayedText, setDisplayedText] = useState("")
  const [messageIndex, setMessageIndex] = useState(initialMessageIndex)
  const [isTyping, setIsTyping] = useState(false)

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDialogueLengthRef = useRef(dialogue.length)
  const hasInitializedRef = useRef(false)

  // Initialize on first mount with saved position
  useEffect(() => {
    if (!hasInitializedRef.current && dialogue.length > 0) {
      hasInitializedRef.current = true
      previousDialogueLengthRef.current = dialogue.length
      
      const index = Math.min(initialMessageIndex, dialogue.length - 1)
      setMessageIndex(index)
      setCurrentMessage(dialogue[index])
      setDisplayedText("")
      setIsTyping(false)
    }
  }, [dialogue.length, initialMessageIndex])

  // Detect scene changes by length change (but skip first init)
  useEffect(() => {
    if (!hasInitializedRef.current) return; // Skip if not initialized yet
    
    const lengthChanged = dialogue.length !== previousDialogueLengthRef.current
    
    if (lengthChanged) {
      previousDialogueLengthRef.current = dialogue.length
      
      if (dialogue.length > 0) {
        setMessageIndex(0)
        setCurrentMessage(dialogue[0])
        setDisplayedText("")
        setIsTyping(false)
        if (onMessageIndexChange) {
          onMessageIndexChange(0)
        }
      }
    }
  }, [dialogue.length, onMessageIndexChange])

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
      const newIndex = messageIndex + 1
      setMessageIndex(newIndex)
      setCurrentMessage(dialogue[newIndex])
      onMessageIndexChange?.(newIndex)
    } else {
      if (onDialogueComplete) {
        onDialogueComplete()
      }
    }
  }, [messageIndex, dialogue, onDialogueComplete, onMessageIndexChange])

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
