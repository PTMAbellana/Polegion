import React, { useState } from 'react'
import styles from '@/styles/competition-teacher.module.css'

interface CreateCompetitionFormProps {
  onSubmit: (title: string) => Promise<void>
  loading?: boolean
}

export default function CreateCompetitionForm({ onSubmit, loading = false }: CreateCompetitionFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    await onSubmit(title.trim())
    setTitle('')
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Create Competition</h2>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <textarea
            className={styles.textarea}
            placeholder="Enter competition title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            rows={2}
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className={styles.createButton}
          disabled={loading || !title.trim()}
        >
          {loading ? 'Creating...' : '+ Create Competition'}
        </button>
      </form>
    </div>
  )
}
