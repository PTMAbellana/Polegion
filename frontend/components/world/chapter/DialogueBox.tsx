"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from '@/styles/castle1-chapter1.module.css';

interface DialogueBoxProps {
  characterName: string;
  characterImage: string;
  displayedText: string;
  isTyping: boolean;
  showContinuePrompt?: boolean;
  onClick: () => void;
}

export default function DialogueBox({
  characterName,
  characterImage,
  displayedText,
  isTyping,
  showContinuePrompt = true,
  onClick
}: DialogueBoxProps) {
  return (
    <div className={styles.dialogueWrapper}>
      <div className={styles.dialogueContainer} onClick={onClick}>
        <div className={styles.characterSection}>
          <div className={styles.portraitFrame}>
            <img src={characterImage} alt={characterName} className={styles.wizardPortrait} />
          </div>
          <span className={styles.characterName}>{characterName}</span>
        </div>
        <div className={styles.messageSection}>
          <div className={styles.dialogueText}>
            <p>{displayedText}</p>
          </div>
          {!isTyping && showContinuePrompt && (
            <div className={styles.continuePrompt}>
              <span>Click to continue</span>
              <ChevronRight size={16} className={styles.chevronBounce} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}