import api from './api'
import parseError from '@utils/helpers/parseError'

const notificationService = class notificationService {
  async getUserNotifications() {
    try {
      const { data } = await api.get('/notification')
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async getUserNotificationsCount() {
    try {
      const { data } = await api.get('/notification/count')
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async markAsRead(id) {
    try {
      const { data } = await api.patch(`/notification/${id}/read`)
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteNotification(id) {
    try {
      const { data } = await api.delete(`/notification/${id}`)
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteReadNotifications() {
    try {
      const { data } = await api.patch('/notification/readAll')
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteAllNotifications() {
    try {
      const { data } = await api.patch('/notification/deleteAll')
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }
}

const NotificationService = new notificationService()
export default NotificationService
