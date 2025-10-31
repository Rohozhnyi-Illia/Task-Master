import * as yup from 'yup'

const signUpSchema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),

  name: yup
    .string()
    .trim()
    .min(4)
    .max(20)
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      'Name can contain letters, numbers, dots, underscores, or hyphens'
    )
    .required('Name is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (!@#$%^&*)')
    .required('Password is required'),
})

export default signUpSchema
