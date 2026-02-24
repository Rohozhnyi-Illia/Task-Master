import { ISODataType, ModelBase } from './shared'

interface NotificationBase extends ModelBase {
  task: string
  dismissedAt: ISODataType | null
  message: string
  isDismissed: boolean
  isRead: boolean
}

export interface WarningNotification extends NotificationBase {
  type: 'warning'
  meta: {
    warningDay: number
  }
}

export interface ReminderNotification extends NotificationBase {
  type: 'reminder'
  meta: {
    reminderHour: number
  }
}

export interface OverdueNotification extends NotificationBase {
  type: 'overdue'
  meta?: never
}

export type Notification = WarningNotification | ReminderNotification | OverdueNotification

export interface GetNotificationsResponse {
  notifications: Notification[]
}

export type MarkAsReadResponse = Notification

export interface DeleteNotificationResponse {
  success: true
  data: Notification
}

export interface DeleteNotificationsResponse {
  success: true
  deletedCount: number
}
