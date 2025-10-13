import * as yup from 'yup'

const loginSchema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),

  password: yup
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
})

export default loginSchema
