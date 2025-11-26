import React from 'react'
import { ArrowLeft } from 'lucide-react'
import styles from '@/styles/competition-teacher.module.css'

interface CompetitionHeaderProps {
  title: string
  description?: string
  onBack: () => void
}

export default function CompetitionHeader({ title, description, onBack }: CompetitionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerTop}>
          <button 
            onClick={onBack}
            className={styles.backButton}
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
        
        <h1 className={styles.title}>{title}</h1>
        
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
    </div>
  )
}
