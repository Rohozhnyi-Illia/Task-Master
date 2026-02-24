import { ISODataType, ModelBase } from './shared'

export type CategoryType = 'Critical' | 'High' | 'Middle' | 'Low'
export type StatusType = 'Done' | 'Active' | 'InProgress' | 'Archived'

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
