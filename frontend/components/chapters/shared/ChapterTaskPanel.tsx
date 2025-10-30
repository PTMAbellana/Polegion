"use client"

import React, { useRef, useEffect } from 'react'

export interface TaskItem {
  key: string
  label: string
}

export interface ChapterTaskPanelProps {
  tasks: TaskItem[]
  completedTasks: Record<string, boolean>
  failedTasks?: Record<string, boolean>
  styleModule: any
}

export default function ChapterTaskPanel({
  tasks,
  completedTasks,
  failedTasks = {},
  styleModule: styles
}: ChapterTaskPanelProps) {
  const taskListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (taskListRef.current) {
      // Find the index of the most recently completed task
      let lastCompletedIndex = -1
      
      for (let i = 0; i < tasks.length; i++) {
        if (completedTasks[tasks[i].key]) {
          lastCompletedIndex = i
        } else {
          // Stop at the first incomplete task
          break
        }
      }
      
      if (lastCompletedIndex >= 0) {
        const taskItems = taskListRef.current.querySelectorAll(`.${styles.taskItem}`)
        if (taskItems[lastCompletedIndex]) {
          setTimeout(() => {
            taskItems[lastCompletedIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest'
            })
          }, 300)
        }
      }
    }
  }, [completedTasks, tasks, styles.taskItem])

  const completedCount = Object.values(completedTasks).filter(Boolean).length

  return (
    <div className={styles.taskPanel}>
      <div className={styles.taskPanelHeader}>
        <span className={styles.taskPanelTitle}>Learning Objectives</span>
        <div className={styles.progressText}>
          {completedCount} / {tasks.length} Complete
        </div>
      </div>
      <div className={styles.taskList} ref={taskListRef}>
        {tasks.map(task => (
          <div 
            key={task.key} 
            className={`${styles.taskItem} ${
              completedTasks[task.key] ? styles.taskCompleted : ''
            } ${
              failedTasks[task.key] ? styles.taskFailed : ''
            }`}
          >
            <div className={styles.taskCheckbox}>
              {completedTasks[task.key] && <span>✓</span>}
              {failedTasks[task.key] && <span>✗</span>}
            </div>
            <span className={styles.taskLabel}>{task.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
