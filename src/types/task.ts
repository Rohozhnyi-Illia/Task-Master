import { ISODataType, ModelBase } from './shared'

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

export interface GetTasksResponse {
  tasks: Task[]
}

export type CreateTaskResponse = Task

export interface DeleteTaskResponse {
  message: string
  task: Task
}

export interface UpdateTaskResponse {
  message: string
  task: Task
}

export interface ReorderTasksResponse {
  message: string
}
