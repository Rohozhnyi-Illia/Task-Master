import * as yup from 'yup'
import { CategoryType, CATEGORIES_OPTIONS } from '../../types/task'

const addTaskSchema = yup.object().shape({
  task: yup
    .string()
    .trim()
    .required('Task is required')
    .max(25, 'Task name must be less than 25 characters'),

  category: yup.mixed<CategoryType>().oneOf(CATEGORIES_OPTIONS).required(),

  day: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : Number(originalValue),
    )
    .typeError('Day must be a number')
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31')
    .required('Day is required'),

  month: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : Number(originalValue),
    )
    .typeError('Month must be a number')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12')
    .required('Month is required'),

  year: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : Number(originalValue),
    )
    .typeError('Year must be a number')
    .min(2024, 'Year must be valid')
    .max(2100, 'Year must be valid')
    .required('Year is required'),
})

export type AddTaskValues = yup.InferType<typeof addTaskSchema>

export default addTaskSchema
