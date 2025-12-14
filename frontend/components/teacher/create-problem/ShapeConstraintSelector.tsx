import React from 'react';
import styles from '@/styles/create-problem-teacher.module.css';

const SHAPE_CONSTRAINTS = [
  { value: '', label: 'No Constraint' },
  { value: 'square', label: 'Square' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'parallelogram', label: 'Parallelogram' },
  { value: 'trapezoid', label: 'Trapezoid' },
  { value: 'rhombus', label: 'Rhombus' },
  { value: 'kite', label: 'Kite' },
  { value: 'quadrilateral', label: 'Quadrilateral (Any)' },
  { value: 'line', label: 'Line' },
  { value: 'line_segment', label: 'Line Segment' },
  { value: 'angle', label: 'Angle' },
  { value: 'polygon', label: 'Polygon (General)' },
  { value: 'pentagon', label: 'Pentagon' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'octagon', label: 'Octagon' },
];

interface ShapeConstraintSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ShapeConstraintSelector: React.FC<ShapeConstraintSelectorProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => {
  return (
    <div className={styles.formControl}>
      <label className={styles.formLabel}>
        Shape Constraint
        <span className={styles.helpText}> (Optional: Enforce specific shape)</span>
      </label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {SHAPE_CONSTRAINTS.map((constraint) => (
          <option key={constraint.value} value={constraint.value}>
            {constraint.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ShapeConstraintSelector;
