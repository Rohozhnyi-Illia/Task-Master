import * as yup from 'yup'

const passwordUpdateSchema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),

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

export default passwordUpdateSchema
