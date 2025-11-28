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
      const taskItems = taskListRef.current.querySelectorAll(`.${styles.taskItem}`)
      let scrollToIndex = -1

      // Find the last completed task
      for (let i = 0; i < tasks.length; i++) {
        const taskKey = tasks[i].id || tasks[i].key || ''
        if (completedTasks[taskKey]) {
          scrollToIndex = i
        } else {
          break
        }
      }

      // If no completed task found, check for the most recent failed task
      if (scrollToIndex === -1) {
        for (let i = tasks.length - 1; i >= 0; i--) {
          const taskKey = tasks[i].id || tasks[i].key || ''
          if (failedTasks[taskKey] && !completedTasks[taskKey]) {
            scrollToIndex = i
            break
          }
        }
      }

      // Scroll to the determined index
      if (scrollToIndex >= 0 && taskItems[scrollToIndex]) {
        setTimeout(() => {
          taskItems[scrollToIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          })
        }, 300)
      }
    }
  }, [completedTasks, failedTasks, tasks, styles.taskItem])

  const completedCount = Object.values(completedTasks).filter(Boolean).length
  const failedCount = Object.values(failedTasks).filter(Boolean).length
  const progressCount = completedCount + failedCount

  return (
    <div className={styles.taskPanel}>
      <div className={styles.taskPanelHeader}>
        <span className={styles.taskPanelTitle}>Learning Objectives</span>
        <div className={styles.progressText}>
          {progressCount} / {tasks.length} Complete
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
