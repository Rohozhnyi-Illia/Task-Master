import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../types/notification';

const initialState: Notification[] = [];

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getNotifications(state, action: PayloadAction<Notification[]>) {
      return action.payload;
    },

    readNotification(state, action: PayloadAction<{ id: string; markAsRead: boolean }>) {
      const { id, markAsRead = true } = action.payload;
      return state.map((notification) =>
        notification._id === id ? { ...notification, isRead: markAsRead } : notification,
      );
    },

    deleteNotification(state, action: PayloadAction<string>) {
      const notificationId = action.payload;
      return state.filter((notification) => notification._id !== notificationId);
    },

    restoreNotification(state, action: PayloadAction<Notification>) {
      return [...state, action.payload];
    },

    deleteReadNotifications(state) {
      return state.filter((notification) => !notification.isRead);
    },

    deleteAllNotifications() {
      return [];
    },
  },
});

export const {
  getNotifications,
  readNotification,
  deleteNotification,
  restoreNotification,
  deleteReadNotifications,
  deleteAllNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
