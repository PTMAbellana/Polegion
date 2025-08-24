import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid Email Value")
    .required("Email value is required"),
  phone: yup.string().required("Phone number is required"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Gender is not allowed"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password is of minimum 6 characters"),
  confirm_password: yup
    .string()
    .required("Password is required")
    .oneOf([yup.ref("password")], "Password didn't match"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match")
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
});