export const loadState = () => {
  try {
    const serializedAuth = localStorage.getItem('authState')
    const serializedTasks = localStorage.getItem('tasksState')
    const serializedNotifications = localStorage.getItem('notificationsState')

    const auth = serializedAuth ? JSON.parse(serializedAuth) : undefined
    const tasks = serializedTasks ? JSON.parse(serializedTasks) : []
    const notification = serializedNotifications ? JSON.parse(serializedNotifications) : []

    return {
      auth,
      tasks,
      notification,
    }
  } catch (e) {
    return undefined
  }
}

export const saveState = (state) => {
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
