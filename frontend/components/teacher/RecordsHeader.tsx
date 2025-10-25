"use client"

import React from 'react'
import { FileText } from 'lucide-react'
import { RecordsHeaderProps } from '@/types'
import styles from '@/styles/leaderboard.module.css'

export default function RecordsHeader({ roomId, totalStudents }: RecordsHeaderProps) {
  return (
    <div className={styles.records_simple_header}>
      <div className={styles.records_header_content}>
        <div className={styles.records_header_top}>
          <FileText className={styles.records_header_icon} />
          <div>
            <h1 className={styles.records_header_title}>Student Records</h1>
            <p className={styles.records_header_subtitle}>Room {roomId} • {totalStudents} students</p>
          </div>
        </div>
      </div>
    </div>
  )
}
