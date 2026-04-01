import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { mockTasks } from '../../../../../../__mocks__/tasks';
import TaskList from '../TaskList/TaskList';
import { FilterOption } from '@utils/fields/filterOptions';
import { TaskInterface } from '../../../../../types/task';
import { GlobalErrorModal } from '@components/index';
import errorReducer from '@store/UI/errorSlice';
import TaskService from '@services/taskService';
import taskReducer from '@store/tasksSlice';

jest.mock('@services/taskService');

const renderTaskList = (tasks: TaskInterface[], keyword: string, selected: FilterOption) => {
  const store = configureStore({
    reducer: {
      tasks: taskReducer,
      error: errorReducer,
    },
    preloadedState: {
      tasks,
    },
  });

  return render(
    <Provider store={store}>
      <TaskList keyword={keyword} selected={selected} />
      <GlobalErrorModal />
    </Provider>,
  );
};

describe('TaskMobile integration tests', () => {
  test('completion of the task', async () => {
    (TaskService.updateStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        category: 'High',
        createdAt: '2026-03-09T16:01:28.906Z',
        deadline: '2026-04-03T00:00:00.000Z',
        order: 0,
        remainingTime: 48,
        status: 'Done',
        task: 'Test 1',
        timeTracker: true,
        updatedAt: '2026-03-22T15:54:04.834Z',
        user: '69abaf3e8fffd11d0b572a8c',
        __v: 0,
        _id: 'task-1',
      },
    });

    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    const tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];
    const checkbox = within(firstTask).getByRole('checkbox');

    expect(firstTask).toHaveTextContent(/Active/i);
    expect(firstTask).toHaveTextContent(/Test 1/i);
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(TaskService.updateStatus).toHaveBeenCalledWith('task-1', 'Done');
      expect(firstTask).toHaveTextContent(/Done/i);
      expect(checkbox).toBeChecked();
    });
  });

  test('Update Status', async () => {
    (TaskService.updateStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        category: 'High',
        createdAt: '2026-03-09T16:01:28.906Z',
        deadline: '2026-04-03T00:00:00.000Z',
        order: 0,
        remainingTime: 48,
        status: 'InProgress',
        task: 'Test 1',
        timeTracker: true,
        updatedAt: '2026-03-22T15:54:04.834Z',
        user: '69abaf3e8fffd11d0b572a8c',
        __v: 0,
        _id: 'task-1',
      },
    });

    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    const tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];
    const statusTrigger = within(firstTask).getByText(/Active/i);

    await userEvent.click(statusTrigger);

    const dropdown = within(firstTask).getByTestId('task-mobile-status-dropdown');
    const option = within(dropdown).getByText('InProgress');

    await userEvent.click(option);

    await waitFor(() => {
      expect(TaskService.updateStatus).toHaveBeenCalledWith('task-1', 'InProgress');
      expect(firstTask).toHaveTextContent(/InProgress/i);
    });
  });

  test('Change the status to current', async () => {
    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    const tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];
    const statusTrigger = within(firstTask).getByText(/Active/i);

    await userEvent.click(statusTrigger);

    const dropdown = within(firstTask).getByTestId('task-mobile-status-dropdown');
    const option = within(dropdown).getByText('Active');
    await userEvent.click(option);

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/This status is already active/i);
  });

  test('Update Category', async () => {
    (TaskService.updateCategory as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        category: 'Low',
        createdAt: '2026-03-09T16:01:28.906Z',
        deadline: '2026-04-03T00:00:00.000Z',
        order: 0,
        remainingTime: 48,
        status: 'Active',
        task: 'Test 1',
        timeTracker: true,
        updatedAt: '2026-03-22T15:54:04.834Z',
        user: '69abaf3e8fffd11d0b572a8c',
        __v: 0,
        _id: 'task-1',
      },
    });

    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    const tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];
    const categoryTrigger = within(firstTask).getByText(/High/i);

    await userEvent.click(categoryTrigger);

    const dropdown = within(firstTask).getByTestId('task-mobile-category-dropdown');
    const option = within(dropdown).getByText('Low');

    await userEvent.click(option);

    await waitFor(() => {
      expect(TaskService.updateCategory).toHaveBeenCalledWith('task-1', 'Low');
      expect(firstTask).toHaveTextContent(/Low/i);
    });
  });

  test('Change the category to the current one', async () => {
    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    const tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];
    const categoryTrigger = within(firstTask).getByText(/High/i);

    await userEvent.click(categoryTrigger);

    const dropdown = within(firstTask).getByTestId('task-mobile-category-dropdown');
    const option = within(dropdown).getByText('High');

    await userEvent.click(option);

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/This category is already active/i);
  });

  test('Shows error modal if error', async () => {
    (TaskService.updateStatus as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Task not found or does not belong to the user',
    });

    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    const tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];
    const checkbox = within(firstTask).getByRole('checkbox');

    await userEvent.click(checkbox);

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Task not found or does not belong to the user/i);
  });

  test('Delete task', async () => {
    (TaskService.deleteTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        category: 'High',
        createdAt: '2026-03-09T16:01:28.906Z',
        deadline: '2026-04-03T00:00:00.000Z',
        order: 0,
        remainingTime: 48,
        status: 'Active',
        task: 'Test 1',
        timeTracker: true,
        updatedAt: '2026-03-22T15:54:04.834Z',
        user: '69abaf3e8fffd11d0b572a8c',
        __v: 0,
        _id: 'task-1',
      },
    });

    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    let tasks = await within(taskList).findAllByTestId('task-mobile');
    const firstTask = tasks[0];

    const deleteButton = await within(firstTask).findByTestId('task-mobile-delete-button');
    await userEvent.click(deleteButton);

    const deleteMenu = within(firstTask).getByTestId('task-mobile-delete-menu');
    const confirmButton = within(deleteMenu).getByRole('button', { name: /Yes/i });

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(TaskService.deleteTasks).toHaveBeenCalledWith('task-1');
    });

    tasks = await within(taskList).findAllByTestId('task-mobile');
    expect(tasks).toHaveLength(2);
  });
});
