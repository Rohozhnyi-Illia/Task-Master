import {
  Notification,
  OverdueNotification,
  ReminderNotification,
  WarningNotification,
} from '../src/types/notification';

export const mockNotifications: Notification[] = [
  {
    createdAt: '2026-04-03T00:00:01.162Z',
    dismissedAt: null,
    isDismissed: false,
    isRead: false,
    message: 'The task "Tasks dashboard UI" is overdue! Deadline has passed.',
    task: '69aeeed855b183cb2b0eac14',
    type: 'overdue',
    updatedAt: '2026-04-03T00:00:01.162Z',
    user: '69abaf3e8fffd11d0b572a8c',
    __v: 0,
    _id: 'notification-1',
  },
  {
    createdAt: '2026-04-03T00:00:01.162Z',
    dismissedAt: null,
    isDismissed: false,
    isRead: false,
    message: 'Don\'t forget the task "Tasks dashboard UI"! Only 1 day(s) left.',
    meta: { warningDay: 1 },
    task: '69aeeed855b183cb2b0eac14',
    type: 'warning',
    updatedAt: '2026-04-03T00:00:01.162Z',
    user: '69abaf3e8fffd11d0b572a8c',
    __v: 0,
    _id: 'notification-2',
  },
  {
    createdAt: '2026-04-03T00:00:01.162Z',
    dismissedAt: null,
    isDismissed: false,
    isRead: false,
    message: 'Reminder: Your task "Login page UI" is due in 72 hours!',
    meta: { reminderHour: 42 },
    task: '69aeeed855b183cb2b0eac14',
    type: 'reminder',
    updatedAt: '2026-04-03T00:00:01.162Z',
    user: '69abaf3e8fffd11d0b572a8c',
    __v: 0,
    _id: 'notification-3',
  },
];

export const mockNotificationsForPagination: Notification[] = Array.from({ length: 10 }, (_, i) => {
  const base = {
    createdAt: '2026-04-03T00:00:01.162Z',
    dismissedAt: null,
    isDismissed: false,
    isRead: i % 2 === 0,
    task: `task-${(i % 10) + 1}`,
    updatedAt: '2026-04-03T00:00:01.162Z',
    user: '69abaf3e8fffd11d0b572a8c',
    __v: 0,
    _id: `notification-${i + 1}`,
  };

  const typeIndex = i % 3;

  if (typeIndex === 0) {
    const notification: OverdueNotification = {
      ...base,
      type: 'overdue',
      message: `The task "Task ${i + 1}" is overdue! Deadline has passed.`,
    };

    return notification;
  }

  if (typeIndex === 1) {
    const notification: WarningNotification = {
      ...base,
      type: 'warning',
      message: `Don't forget the task "Task ${i + 1}"! Only ${(i % 5) + 1} day(s) left.`,
      meta: { warningDay: (i % 5) + 1 },
    };

    return notification;
  }

  const notification: ReminderNotification = {
    ...base,
    type: 'reminder',
    message: `Reminder: Your task "Task ${i + 1}" is due in ${(i + 1) * 6} hours!`,
    meta: { reminderHour: (i + 1) * 6 },
  };

  return notification;
});
