import { createSlice } from '@reduxjs/toolkit'

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    getTasks(state, action) {
      return action.payload
    },

    createTask(state, action) {
      const newState = [...state, action.payload]

      return newState.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    deleteTasks(state, action) {
      const taskId = action.payload
      return state.filter((task) => task._id !== taskId)
    },

    updateStatus(state, action) {
      const { id, status } = action.payload
      return state.map((task) => (task._id === id ? { ...task, status } : task))
    },

    isComplete(state, action) {
      const taskId = action.payload
      return state.map((task) => (task._id === taskId ? { ...task, status: 'Done' } : task))
    },

    restoreTask(state, action) {
      return [...state, action.payload]
    },

    resetTasks() {
      return []
    },
  },
})

export const {
  getTasks,
  deleteTasks,
  updateStatus,
  isComplete,
  createTask,
  restoreTask,
  resetTasks,
} = tasksSlice.actions
export default tasksSlice.reducer
