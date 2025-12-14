import React from 'react';
import styles from '@/styles/create-problem-teacher.module.css';

interface GradingRules {
  property_to_check?: string;
  tolerance?: number;
  check_shape?: boolean;
  expected_value?: number;
}

interface GradingRulesBuilderProps {
  value: GradingRules;
  onChange: (value: GradingRules) => void;
  problemType: string;
}

const GradingRulesBuilder: React.FC<GradingRulesBuilderProps> = ({ 
  value, 
  onChange,
  problemType 
}) => {
  const isGeometryProblem = problemType.includes('perimeter') || 
                           problemType.includes('area') || 
                           problemType.includes('angle');

  const handleChange = (field: keyof GradingRules, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <>
      <label className={styles.formLabel}>Grading Rules</label>
      
      <div className={styles.gradingRulesGrid}>
        {/* Property to Check */}
        <div className={styles.formControl}>
          <label className={styles.formSubLabel}>Property to Check</label>
          <select
            className={styles.select}
            value={value.property_to_check || ''}
            onChange={(e) => handleChange('property_to_check', e.target.value)}
          >
            <option value="">Auto-detect from problem type</option>
            <option value="perimeter">Perimeter</option>
            <option value="area">Area</option>
            <option value="angle">Angle</option>
            <option value="length">Length</option>
            <option value="volume">Volume</option>
          </select>
        </div>

        {/* Tolerance */}
        <div className={styles.formControl}>
          <label className={styles.formSubLabel}>
            Tolerance
            <span className={styles.helpText}> (Acceptable error margin)</span>
          </label>
          <input
            type="number"
            className={styles.input}
            value={value.tolerance || 0.01}
            onChange={(e) => handleChange('tolerance', parseFloat(e.target.value))}
            step="0.01"
            min="0"
            max="10"
            placeholder="0.01"
          />
        </div>

        {/* Expected Value (Optional) */}
        <div className={styles.formControl}>
          <label className={styles.formSubLabel}>
            Expected Value
            <span className={styles.helpText}> (Optional: For exact matching)</span>
          </label>
          <input
            type="number"
            className={styles.input}
            value={value.expected_value || ''}
            onChange={(e) => handleChange('expected_value', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Leave empty for auto"
          />
        </div>
      </div>

      {/* Check Shape - Outside grid for better visibility */}
      {isGeometryProblem && (
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={value.check_shape || false}
            onChange={(e) => handleChange('check_shape', e.target.checked)}
          />
          <span>Validate Shape Properties</span>
          <span className={styles.helpText}> (Verify shape matches constraint)</span>
        </label>
      )}

      <div className={styles.gradingRulesInfo}>
        <small>
          💡 The system will automatically grade based on problem type and these rules.
          {value.check_shape && ' Shape validation is enabled - students must draw the correct shape type.'}
        </small>
      </div>
    </>
  );
};

export default GradingRulesBuilder;
