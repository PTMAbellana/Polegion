"use client"

import React from 'react'

export interface ChapterDialogueBoxProps {
  wizardName: string
  wizardImage: string
  displayedText: string
  isTyping: boolean
  showContinuePrompt: boolean
  onClick: () => void
  styleModule: any
}

export default function ChapterDialogueBox({
  wizardName,
  wizardImage,
  displayedText,
  isTyping,
  showContinuePrompt,
  onClick,
  styleModule: styles
}: ChapterDialogueBoxProps) {
  return (
    <div className={styles.dialogueWrapper}>
      <div className={styles.dialogueContainer} onClick={onClick}>
        <div className={styles.characterSection}>
          <div className={styles.portraitFrame}>
            <img src={wizardImage} alt={wizardName} className={styles.wizardPortrait} />
          </div>
        </div>
        <div className={styles.messageSection}>
          <div className={styles.dialogueTextWrapper}>
            <div className={styles.dialogueSpeaker}>{wizardName}</div>
            <div className={styles.dialogueText}>
              {displayedText}
            </div>
          </div>
          {!isTyping && showContinuePrompt && (
            <div className={styles.continuePrompt}>
              Click to continue →
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
