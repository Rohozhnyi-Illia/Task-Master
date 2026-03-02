import api from './api'
import parseError from '@utils/helpers/parseError'
import { ServiceResponse } from '../types/shared'
import { Notification, DeleteNotificationsResponse } from '../types/notification'

const notificationService = class notificationService {
  async getUserNotifications(): Promise<ServiceResponse<Notification[]>> {
    try {
      const { data } = await api.get<ServiceResponse<Notification[]>>('/notification')
      return data
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async markAsRead(id: string): Promise<ServiceResponse<Notification>> {
    try {
      const { data } = await api.patch<ServiceResponse<Notification>>(
        `/notification/${id}/read`,
      )
      return data
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteNotification(id: string): Promise<ServiceResponse<Notification>> {
    try {
      const { data } = await api.delete<ServiceResponse<Notification>>(`/notification/${id}`)
      return data
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteReadNotifications(): Promise<ServiceResponse<DeleteNotificationsResponse>> {
    try {
      const res = await api.patch<{ success: boolean; data: DeleteNotificationsResponse }>(
        '/notification/readAll',
      )
      return { success: true, data: res.data.data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteAllNotifications(): Promise<ServiceResponse<DeleteNotificationsResponse>> {
    try {
      const res = await api.patch<{ success: boolean; data: DeleteNotificationsResponse }>(
        '/notification/deleteAll',
      )
      return { success: true, data: res.data.data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }
}

const NotificationService = new notificationService()
export default NotificationService
