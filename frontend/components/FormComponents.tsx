import React from 'react';
import styles from '@/styles/dashboard.module.css';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: Array<{ value: string, label: string }>;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  required = false,
  options = [],
  error
}) => {
  return (
    <div className={styles["form-group"]}>
      <label htmlFor={id}>{label}{required && <span className={styles["required-mark"]}>*</span>}</label>
      
      {type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${styles["form-input"]} ${error ? styles["form-input-error"] : ''}`}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${styles["form-input"]} ${error ? styles["form-input-error"] : ''}`}
          required={required}
        />
      )}
      
      {error && <p className={styles["field-error"]}>{error}</p>}
    </div>
  );
};

interface FormButtonsProps {
  cancelHandler: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  cancelHandler,
  isSubmitting,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel'
}) => {
  return (
    <div className={styles["form-actions"]}>
      <button
        type="button"
        onClick={cancelHandler}
        className={styles["cancel-btn"]}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        className={styles["submit-btn"]}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : submitLabel}
      </button>
    </div>
  );
};
