import * as yup from 'yup'

const passwordVerifySchema = yup.object().shape({
  verifyCode: yup
    .string()
    .trim()
    .required('Verification code is required')
    .matches(/^[A-Za-z0-9]{6}$/, 'Verification code must be exactly 6 letters or numbers'),

  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (!@#$%^&*)')
    .required('Password is required'),

  repeatPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Repeat password is required'),
})

export default passwordVerifySchema
