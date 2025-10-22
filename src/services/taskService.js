import api from './api'

const URL = 'http://localhost:9000/api/tasks'

const taskService = class taskService {
  async getAllTasks() {
    try {
      const { data } = await api.get('/tasks')
      return { success: true, data: data.tasks || data }
    } catch (err) {
      console.error('Get All Tasks Error:', err)
      throw err
    }
  }

  async createTask(props) {
    const { task, status, category, deadline, remainingTime } = props
    try {
      const { data } = await api.post(`${URL}/`, {
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
      const { data } = await api.delete(`${URL}/${id}`)
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
      const { data } = await api.patch(`${URL}/${id}/complete`)
      return data
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
      const { data } = await api.patch(`${URL}/${id}/status`, { status })
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
