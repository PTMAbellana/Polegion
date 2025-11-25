// ============================================================================
// CATEGORY SELECTOR COMPONENT
// ============================================================================
// Displays 6 category cards for practice selection
// ============================================================================

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/practice.module.css';

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  initials: string;
  color: string;
  gradient: string;
}

export const PRACTICE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'knowledge-recall',
    name: 'Knowledge Recall',
    description: 'Basic geometry definitions and facts',
    initials: 'KR',
    color: '#2b9348',
    gradient: 'linear-gradient(135deg, #6EE7B7, #3B82F6)',
  },
  {
    id: 'concept-understanding',
    name: 'Concept Understanding',
    description: 'Understanding relationships and classifications',
    initials: 'CU',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #93C5FD, #3B82F6)',
  },
  {
    id: 'procedural-skills',
    name: 'Procedural Skills',
    description: 'Compute area, perimeter, angles, and more',
    initials: 'PS',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #FEC163, #DE4313)',
  },
  {
    id: 'analytical-thinking',
    name: 'Analytical Thinking',
    description: 'Patterns, logic, and multi-step reasoning',
    initials: 'AT',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #D8B4FE, #A855F7)',
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    description: 'Real-world geometry word problems',
    initials: 'PS+',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #FECACA, #F87171)',
  },
  {
    id: 'hots',
    name: 'Higher Order Thinking',
    description: 'Creative thinking and complex reasoning',
    initials: 'HOT',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #7DD3FC, #0EA5E9)',
  },
];

interface CategorySelectorProps {
  onSelect?: (categoryId: string) => void;
}

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    if (onSelect) {
      onSelect(categoryId);
    } else {
      router.push(`/student/practice/${categoryId}`);
    }
  };

  return (
    <div className={styles.categoryGrid}>
      {PRACTICE_CATEGORIES.map((category) => (
        <div
          key={category.id}
          className={styles.categoryCard}
          onClick={() => handleCategoryClick(category.id)}
          style={{ borderColor: category.color }}
        >
          <div
            className={styles.categoryIcon}
            style={{ background: category.gradient }}
          >
            <span>{category.initials}</span>
          </div>
          <h3 className={styles.categoryName}>{category.name}</h3>
          <p className={styles.categoryDescription}>{category.description}</p>
          <button 
            className={styles.categoryButton}
            style={{ backgroundColor: category.color }}
          >
            Start Practice
          </button>
        </div>
      ))}
    </div>
  );
}
