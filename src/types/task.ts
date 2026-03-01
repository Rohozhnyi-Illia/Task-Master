import { ModelBase } from './shared'
import { ISODataType } from './shared'

export const STATUS_OPTIONS = ['Done', 'Active', 'InProgress', 'Archived'] as const
export type StatusType = (typeof STATUS_OPTIONS)[number]

export const CATEGORIES_OPTIONS = ['Critical', 'High', 'Middle', 'Low'] as const
export type CategoryType = (typeof CATEGORIES_OPTIONS)[number]

export interface Task extends ModelBase {
  category: CategoryType
  deadline: ISODataType
  order: number
  remainingTime: number
  status: StatusType
  task: string
  timeTracker: boolean
}
