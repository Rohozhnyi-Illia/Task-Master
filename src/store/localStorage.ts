import { AuthState } from '../types/auth'
import { Task } from '../types/task'
import { Notification } from '../types/notification'

interface PersistedState {
  auth?: AuthState
  tasks?: Task[]
  notification?: Notification[]
}

export const loadState = (): PersistedState | undefined => {
  try {
    const serializedAuth = localStorage.getItem('authState')
    const serializedTasks = localStorage.getItem('tasksState')
    const serializedNotifications = localStorage.getItem('notificationsState')

    const auth: AuthState | undefined = serializedAuth ? JSON.parse(serializedAuth) : undefined
    const tasks: Task[] = serializedTasks ? JSON.parse(serializedTasks) : []
    const notification: Notification[] = serializedNotifications
      ? JSON.parse(serializedNotifications)
      : []

    return {
      auth,
      tasks,
      notification,
    }
  } catch (error) {
    return undefined
  }
}

export const saveState = (state: PersistedState) => {
  try {
    if (state.auth) {
      localStorage.setItem('authState', JSON.stringify(state.auth))
    }
    if (state.tasks) {
      localStorage.setItem('tasksState', JSON.stringify(state.tasks))
    }
    if (state.notification) {
      localStorage.setItem('notificationsState', JSON.stringify(state.notification))
    }
  } catch (e) {
    console.error('Error saving state', e)
  }
}
