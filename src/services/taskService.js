import api from './api'
import parseError from '@utils/helpers/parseError'

const taskService = class taskService {
  async getAllTasks() {
    try {
      const { data } = await api.get('/tasks')
      return { success: true, data: data.tasks || data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async createTask({ task, status, category, deadline, remainingTime }) {
    try {
      const { data } = await api.post('/tasks', {
        task,
        status,
        category,
        deadline,
        remainingTime,
      })
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async deleteTasks(id) {
    try {
      const { data } = await api.delete(`/tasks/${id}`)
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async completeTask(id) {
    try {
      const { data } = await api.patch(`/tasks/${id}/complete`)
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async updateStatus(id, status) {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, { status })
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }

  async reorderTasks(orderedIds) {
    try {
      const { data } = await api.patch('/tasks/reorder', { orderedIds })
      return { success: true, data }
    } catch (error) {
      const message = parseError(error)
      return { success: false, error: message }
    }
  }
}

const TaskService = new taskService()
export default TaskService
