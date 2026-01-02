"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { STUDENT_ROUTES, TEACHER_ROUTES } from '@/constants/routes';
import styles from '@/styles/login.module.css';
import { LoginFormData, LoginFormProps } from '@/types';
import { loginSchema } from '@/schemas/authSchemas';

export default function LoginForm({ 
  onForgotPassword,
  userType
}: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuthStore(); 
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (formdata: LoginFormData) => {
    const { email, password } = formdata;
    
    // ✨ Use the Zustand login action
    const result = await login(email, password);
    
    if (result.success) {
      let route;
      
      // Wait for userProfile to be available
      const { userProfile } = useAuthStore.getState();
      
      switch(userType) {
        case "student":
          route = STUDENT_ROUTES.DASHBOARD;
          break;
        case "teacher":
          // Redirect teachers to restricted page in research build
          route = '/teacher/restricted';
          break;
        default:
          // For general login, redirect based on actual user role
          if (userProfile?.role === "teacher") {
            route = '/teacher/restricted';
          } else {
            route = STUDENT_ROUTES.DASHBOARD;
          }
          break;
      }
      
      toast.success(result.message || "Login successful");
      router.push(route);
    } else {
      toast.error(result.message || "Login failed");
      console.log(result.error)
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