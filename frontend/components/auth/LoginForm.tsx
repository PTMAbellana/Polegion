"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants/routes';
import styles from '@/styles/login.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

const formSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup.string().required("Password is required"),
});

interface LoginFormProps {
  onForgotPassword: () => void;
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuthStore(); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (formdata: LoginFormData) => {
    const { email, password } = formdata;
    
    // ✨ Use the Zustand login action
    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      toast.success("Login successful!");
      router.replace(ROUTES.DASHBOARD);
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGroup}>
        <input
          type="email"
          className={styles.inputField}
          placeholder="Enter your email"
          {...register("email")}
        />
        {errors.email && (
          <p className={styles.error}>{errors.email.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <div className={styles.passwordInput}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.inputField}
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </button>
        </div>
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
      </div>

      <div className={styles.rememberForgot}>
        <div className={styles.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            className={styles.checkbox}
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe" className={styles.rememberText}>
            Remember me
          </label>
        </div>
        <a onClick={onForgotPassword} className={styles.forgotPassword}>
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className={styles.loginButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}