"use client"

import React, { useRef, useEffect } from 'react'

export interface TaskItem {
  id?: string
  key?: string
  label: string
}

export interface ChapterTaskPanelProps {
  tasks: TaskItem[]
  completedTasks: Record<string, boolean>
  failedTasks?: Record<string, boolean>
  earnedXP?: {
    lesson: number
    minigame: number
    quiz: number
  }
  totalXP?: number
  styleModule: any
}

export default function ChapterTaskPanel({
  tasks,
  completedTasks,
  failedTasks = {},
  earnedXP,
  totalXP,
  styleModule: styles
}: ChapterTaskPanelProps) {
  const taskListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (taskListRef.current) {
      // Find the index of the most recently completed task
      let lastCompletedIndex = -1
      
      for (let i = 0; i < tasks.length; i++) {
        const taskKey = tasks[i].id || tasks[i].key || ''
        if (completedTasks[taskKey]) {
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
        {tasks.map((task, index) => {
          const taskKey = task.id || task.key || `task-${index}`
          return (
            <div 
              key={taskKey}
              className={`${styles.taskItem} ${
                completedTasks[taskKey] ? styles.taskCompleted : ''
              } ${
                failedTasks[taskKey] ? styles.taskFailed : ''
              }`}
            >
              <div className={styles.taskCheckbox}>
                {completedTasks[taskKey] && <span>✓</span>}
                {failedTasks[taskKey] && <span>✗</span>}
              </div>
              <span className={styles.taskLabel}>{task.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
