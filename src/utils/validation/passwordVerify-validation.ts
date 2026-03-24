import * as yup from 'yup';

const passwordVerifySchema = yup.object().shape({
  verifyCode: yup
    .string()
    .trim()
    .matches(/^[A-Za-z0-9]{6}$/, 'Verification code must be exactly 6 letters or numbers')
    .required('Verification code is required'),

  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (!@#$%^&*)'),

  repeatPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Repeat password is required'),
});

export type PasswordVerifyValues = yup.InferType<typeof passwordVerifySchema>;

export default passwordVerifySchema;
