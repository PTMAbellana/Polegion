import React from 'react';
import styles from '@/styles/create-problem-teacher.module.css';

const PROBLEM_TYPES = [
  { value: 'general', label: 'General Problem' },
  { value: 'angle_complementary', label: 'Complementary Angles' },
  { value: 'angle_supplementary', label: 'Supplementary Angles' },
  { value: 'angle_sum', label: 'Angle Sum' },
  { value: 'angle_interior', label: 'Interior Angles' },
  { value: 'angle_exterior', label: 'Exterior Angles' },
  { value: 'perimeter', label: 'Perimeter (General)' },
  { value: 'area', label: 'Area (General)' },
  { value: 'perimeter_square', label: 'Square Perimeter' },
  { value: 'perimeter_rectangle', label: 'Rectangle Perimeter' },
  { value: 'perimeter_triangle', label: 'Triangle Perimeter' },
  { value: 'perimeter_circle', label: 'Circle Perimeter (Circumference)' },
  { value: 'perimeter_quadrilateral', label: 'Quadrilateral Perimeter' },
  { value: 'area_square', label: 'Square Area' },
  { value: 'area_rectangle', label: 'Rectangle Area' },
  { value: 'area_triangle', label: 'Triangle Area' },
  { value: 'area_circle', label: 'Circle Area' },
  { value: 'area_quadrilateral', label: 'Quadrilateral Area' },
  { value: 'line_length', label: 'Line Length' },
  { value: 'line_midpoint', label: 'Line Midpoint' },
  { value: 'pythagorean_theorem', label: 'Pythagorean Theorem' },
  { value: 'volume', label: 'Volume' },
  { value: 'surface_area', label: 'Surface Area' },
];

interface ProblemTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ProblemTypeSelector: React.FC<ProblemTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className={styles.formControl}>
      <label className={styles.formLabel}>Problem Type</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {PROBLEM_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemTypeSelector;
