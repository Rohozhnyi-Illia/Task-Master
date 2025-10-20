import * as yup from 'yup'

const addTaskSchema = yup.object().shape({
  task: yup
    .string()
    .trim()
    .required('Task is required')
    .max(25, 'Task name must be less than 25 characters'),

  category: yup.string().trim().required('Category is required'),

  day: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? NaN : Number(originalValue)))
    .typeError('Day must be a number')
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31')
    .required('Day is required'),

  month: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? NaN : Number(originalValue)))
    .typeError('Month must be a number')
    .required('Month is required')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12'),

  year: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? NaN : Number(originalValue)))
    .typeError('Year must be a number')
    .required('Year is required')
    .min(2024, 'Year must be valid')
    .max(2100, 'Year must be valid'),
})

export default addTaskSchema
