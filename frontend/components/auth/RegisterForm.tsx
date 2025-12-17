"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { RegisterFormData } from '@/types/forms/auth';
import { registerSchema } from '@/schemas/authSchemas';
import { ROUTES, STUDENT_ROUTES, TEACHER_ROUTES } from '@/constants/routes';
import PasswordInput from '@/components/auth/inputs/PasswordInput';
import EmailInput from '@/components/auth/inputs/EmailInput';
import styles from '@/styles/register.module.css';

export default function RegisterForm(
  { 
    userType 

  }: { 
    userType: 'student' | 'teacher' 
  }
) {
  const router = useRouter();
  const { register: registerUser, loginLoading } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (formData: RegisterFormData) => {
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms and Conditions to continue");
      return;
    }

    const result = await registerUser(formData, userType);
    
    if (result.success) {
      let route;
      switch(userType) {
        case "student":
          route = STUDENT_ROUTES.LOGIN;
          break;
          case "teacher":
            route = TEACHER_ROUTES.LOGIN;
          break;
        default:
          route = ROUTES.LOGIN;
        }
      toast.success("User registered successfully");
      router.push(route);
    } else {
      toast.error(result.error || "Failed to register user");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGrid}>
        {/* Row 1: First Name, Last Name */}
        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="First Name"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className={styles.error}>
              {errors.firstName.message?.toString()}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Last Name"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className={styles.error}>
              {errors.lastName.message?.toString()}
            </p>
          )}
        </div>

        {/* Row 2: Phone, Gender */}
        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Phone Number"
            {...register("phone")}
          />
          {errors.phone && (
            <p className={styles.error}>
              {errors.phone.message?.toString()}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <select
            className={styles.selectField}
            {...register("gender")}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className={styles.error}>
              {errors.gender.message?.toString()}
            </p>
          )}
        </div>

        {/* Row 3: Email (full width) */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <EmailInput 
            register={register}
            error={errors.email?.message?.toString()}
            placeholder="Email Address"
          />
        </div>

        {/* Row 4: Password (full width) */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <PasswordInput
            name="password"
            placeholder="Password"
            register={register}
            error={errors.password?.message?.toString()}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* Row 5: Confirm Password (full width) */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <PasswordInput
            name="confirm_password"
            placeholder="Confirm Password"
            register={register}
            error={errors.confirm_password?.message?.toString()}
            showPassword={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className={styles.termsContainer}>
        <label className={styles.termsLabel}>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className={styles.termsCheckbox}
          />
          <span>
            I agree to the{' '}
            <Link
              href="/terms-and-conditions"
              className={styles.termsLink}
            >
              Terms and Conditions
            </Link>
            {' '}and confirm that:
          </span>
        </label>
        <ul className={styles.confirmationList}>
          <li>I have read and understood the data collection practices</li>
          <li>I understand this is a research platform for educational purposes</li>
          <li>If I am under 18, my parent/guardian has provided consent</li>
        </ul>
      </div>

      <button
        type="submit"
        className={styles.registerButton}
        disabled={loginLoading || !agreedToTerms}
      >
        {loginLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}