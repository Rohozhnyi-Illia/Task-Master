import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    getNotifications(state, action) {
      return action.payload
    },

    readNotification(state, action) {
      const notificationId = action.payload
      return state.map((notification) =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      )
    },

    deleteNotification(state, action) {
      const notificationId = action.payload
      return state.filter((notification) => notification._id !== notificationId)
    },
  },
})

export const { getNotifications, readNotification, deleteNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
