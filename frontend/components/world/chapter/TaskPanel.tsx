"use client";

import React, { useRef, useEffect } from 'react';
import { CheckCircle, Lock } from 'lucide-react';
import styles from '@/styles/castle1-chapter1.module.css';

interface Task {
  key: string;
  label: string;
}

interface TaskPanelProps {
  tasks: Task[];
  completedTasks: Record<string, boolean>;
}

export default function TaskPanel({ tasks, completedTasks }: TaskPanelProps) {
  const taskListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (taskListRef.current) {
      const completedCount = Object.values(completedTasks).filter(Boolean).length;
      if (completedCount > 0) {
        const taskItems = taskListRef.current.querySelectorAll(`.${styles.taskItem}`);
        if (taskItems[completedCount - 1]) {
          setTimeout(() => {
            taskItems[completedCount - 1].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest'
            });
          }, 300);
        }
      }
    }
  }, [completedTasks]);

  const totalTasks = tasks.length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  return (
    <div className={styles.taskPanel}>
      <div className={styles.taskPanelHeader}>
        <span className={styles.taskPanelTitle}>Learning Objectives</span>
        <div className={styles.progressText}>
          {completedCount} / {totalTasks} Complete
        </div>
      </div>
      <div className={styles.taskList} ref={taskListRef}>
        {tasks.map(task => (
          <div 
            key={task.key} 
            className={`${styles.taskItem} ${completedTasks[task.key] ? styles.taskCompleted : ''}`}
          >
            <div className={styles.taskIconWrapper}>
              {completedTasks[task.key] ? (
                <CheckCircle size={18} className={styles.iconComplete} />
              ) : (
                <Lock size={18} className={styles.iconLocked} />
              )}
            </div>
            <span className={styles.taskText}>{task.label}</span>
          </div>
        ))}
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${(completedCount / totalTasks) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}