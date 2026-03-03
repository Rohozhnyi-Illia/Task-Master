import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, StatusType, CategoryType } from '../types/task';

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    getTasks(state, action: PayloadAction<Task[]>) {
      return action.payload;
    },

    createTask(state, action: PayloadAction<Task>) {
      const newState = [...state, action.payload];

      return newState.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },

    deleteTasks(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      return state.filter((task) => task._id !== taskId);
    },

    updateStatus(state, action: PayloadAction<{ id: string; status: StatusType }>) {
      const { id, status } = action.payload;
      return state.map((task) => (task._id === id ? { ...task, status } : task));
    },

    updateCategory(state, action: PayloadAction<{ id: string; category: CategoryType }>) {
      const { id, category } = action.payload;
      return state.map((task) => (task._id === id ? { ...task, category } : task));
    },

    isComplete(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      return state.map((task) => (task._id === taskId ? { ...task, status: 'Done' } : task));
    },

    restoreTask(state, action: PayloadAction<Task>) {
      return [...state, action.payload];
    },

    resetTasks() {
      return [];
    },

    updateTaskOrder(state, action: PayloadAction<Task[]>) {
      return action.payload;
    },
  },
});

export const {
  getTasks,
  deleteTasks,
  updateStatus,
  isComplete,
  createTask,
  restoreTask,
  resetTasks,
  updateTaskOrder,
  updateCategory,
} = tasksSlice.actions;
export default tasksSlice.reducer;
