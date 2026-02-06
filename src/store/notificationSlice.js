import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    getNotifications(state, action) {
      return action.payload
    },

    readNotification(state, action) {
      const { id, markAsRead = true } = action.payload
      return state.map((notification) =>
        notification._id === id ? { ...notification, isRead: markAsRead } : notification,
      )
    },

    deleteNotification(state, action) {
      const notificationId = action.payload
      return state.filter((notification) => notification._id !== notificationId)
    },

    restoreNotification(state, action) {
      return [...state, action.payload]
    },

    deleteReadNotifications(state) {
      return state.filter((notification) => !notification.isRead)
    },

    deleteAllNotifications() {
      return []
    },
  },
})

export const {
  getNotifications,
  readNotification,
  deleteNotification,
  restoreNotification,
  deleteReadNotifications,
  deleteAllNotifications,
} = notificationSlice.actions
export default notificationSlice.reducer
