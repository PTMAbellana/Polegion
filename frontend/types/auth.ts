export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

// Component Props
export interface AuthFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export interface PasswordInputProps {
  name: string;
  placeholder: string;
  register: any;
  error?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

export interface EmailInputProps {
  register: any;
  error?: string;
  placeholder?: string;
}