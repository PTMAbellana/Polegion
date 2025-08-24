import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PasswordInputProps } from '@/types/auth';
import styles from '@/styles/login.module.css';

export default function PasswordInput({ 
  name, 
  placeholder, 
  register, 
  error, 
  showPassword, 
  onToggleVisibility 
}: PasswordInputProps) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.passwordInput}>
        <input
          type={showPassword ? "text" : "password"}
          className={styles.inputField}
          placeholder={placeholder}
          {...register(name)}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={onToggleVisibility}
        >
          {showPassword ? (
            <FaEyeSlash size={20} />
          ) : (
            <FaEye size={20} />
          )}
        </button>
      </div>
      {error && (
        <p className={styles.error}>{error}</p>
      )}
    </div>
  );
}