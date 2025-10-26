import api from './api'

const taskService = class taskService {
  async getAllTasks() {
    try {
      const { data } = await api.get('/tasks') // относительный путь
      return { success: true, data: data.tasks || data }
    } catch (err) {
      console.error('Get All Tasks Error:', err)
      throw err
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
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async deleteTasks(id) {
    try {
      const { data } = await api.delete(`/tasks/${id}`)
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async completeTask(id) {
    try {
      const { data } = await api.patch(`/tasks/${id}/complete`)
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async updateStatus(id, status) {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, { status })
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }
}

const TaskService = new taskService()
export default TaskService
