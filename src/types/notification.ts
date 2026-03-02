import { ISODataType, ModelBase } from './shared'

export type NotificationFilterType = 'All' | 'Warning' | 'Reminder' | 'Overdue'

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

export interface DeleteNotificationsResponse {
  deletedCount: number
}
