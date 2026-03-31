import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockTasks } from '../../../../../../__mocks__/tasks';
import Task from './Task';
import TaskService from '@services/taskService';
import { useDispatch } from 'react-redux';

jest.mock('@services/taskService');
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const renderTask = () => {
  return render(
    <table>
      <tbody>
        <Task task={mockTasks[0]} />
      </tbody>
    </table>,
  );
};

describe('Task unit tests', () => {
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

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    renderTask();

    const task = await screen.findByTestId('task-row');
    const checkbox = within(task).getByRole('checkbox');

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: 'task-1', status: 'Done' },
        }),
      );
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
        status: 'Done',
        task: 'Test 1',
        timeTracker: true,
        updatedAt: '2026-03-22T15:54:04.834Z',
        user: '69abaf3e8fffd11d0b572a8c',
        __v: 0,
        _id: 'task-1',
      },
    });

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    renderTask();

    const task = await screen.findByTestId('task-row');
    const statusTrigger = within(task).getByText(/Active/i);

    await userEvent.click(statusTrigger);

    const dropdown = await screen.findByRole('listbox');
    const option = within(dropdown).getByText('InProgress');

    await userEvent.click(option);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: 'task-1', status: 'InProgress' },
        }),
      );
    });
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

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    renderTask();

    const task = await screen.findByTestId('task-row');
    const categoryTrigger = within(task).getByText(/High/i);

    await userEvent.click(categoryTrigger);

    const dropdown = await screen.findByRole('listbox');
    const option = within(dropdown).getByText('Low');

    await userEvent.click(option);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: 'task-1', category: 'Low' },
        }),
      );
    });
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

    renderTask();

    let task = await screen.findByTestId('task-row');
    const deleteButton = await within(task).findByTestId('task-delete-button');

    await userEvent.click(deleteButton);

    const deleteMenu = await screen.findByTestId('task-delete-menu');
    const confirmButton = within(deleteMenu).getByRole('button', { name: /Yes/i });

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: 'task-1',
        }),
      );
    });
  });
});
