import api from './api'

const notificationService = class notificationService {
  async getUserNotifications() {
    try {
      const { data } = await api.get('/notification')
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error fetching notifications'
      return { success: false, error: message }
    }
  }

  async markAsRead(id) {
    try {
      const { data } = await api.patch(`/notification/${id}/read`)
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error marking notification as read'
      return { success: false, error: message }
    }
  }

  async deleteNotification(id) {
    try {
      const { data } = await api.delete(`/notification/${id}`)
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error deleting notification'
      return { success: false, error: message }
    }
  }
}

const NotificationService = new notificationService()
export default NotificationService
