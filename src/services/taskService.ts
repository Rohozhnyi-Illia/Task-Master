import api from './api';
import parseError from '@utils/helpers/parseError';
import { ServiceResponse } from '../types/shared';
import { TaskInterface as Task, CategoryType, StatusType } from '../types/task';
import { ISODataType } from '../types/shared';

interface TaskData {
  task: string;
  status: StatusType;
  category: CategoryType;
  deadline: ISODataType;
  remainingTime?: number;
}

const taskService = class taskService {
  async getAllTasks(): Promise<ServiceResponse<Task[]>> {
    try {
      const { data } = await api.get<ServiceResponse<Task[]>>('/tasks');
      return data;
    } catch (error) {
      return { success: false, error: parseError(error) };
    }
  }

  async createTask({
    task,
    status,
    category,
    deadline,
    remainingTime,
  }: TaskData): Promise<ServiceResponse<Task>> {
    try {
      const { data } = await api.post<ServiceResponse<Task>>('/tasks', {
        task,
        status,
        category,
        deadline,
        remainingTime,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async deleteTasks(id: string): Promise<ServiceResponse<Task>> {
    try {
      const { data } = await api.delete<ServiceResponse<Task>>(`/tasks/${id}`);
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async completeTask(id: string): Promise<ServiceResponse<Task>> {
    try {
      const { data } = await api.patch<ServiceResponse<Task>>(`/tasks/${id}/complete`);
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async updateStatus(id: string, status: StatusType): Promise<ServiceResponse<Task>> {
    try {
      const { data } = await api.patch<ServiceResponse<Task>>(`/tasks/${id}/status`, {
        status,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async updateCategory(id: string, category: CategoryType): Promise<ServiceResponse<Task>> {
    try {
      const { data } = await api.patch<ServiceResponse<Task>>(`/tasks/${id}/category`, {
        category,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async reorderTasks(orderedIds: string[]): Promise<ServiceResponse<{ message: string }>> {
    try {
      const { data } = await api.patch<ServiceResponse<{ message: string }>>('/tasks/reorder', {
        orderedIds,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }
};

const TaskService = new taskService();
export default TaskService;
