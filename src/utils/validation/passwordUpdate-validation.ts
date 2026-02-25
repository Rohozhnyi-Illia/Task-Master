import * as yup from 'yup'

const passwordUpdateSchema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
})

export type PasswordUpdateValue = yup.InferType<typeof passwordUpdateSchema>

export default passwordUpdateSchema
