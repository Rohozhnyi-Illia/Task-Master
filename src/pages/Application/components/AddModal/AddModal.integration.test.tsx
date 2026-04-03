import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Application from '../../Application';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@store/tasksSlice';
import appReducer from '@store/appSlice';
import loaderReducer from '@store/UI/loaderSlice';
import { Provider } from 'react-redux';
import TaskService from '@services/taskService';
import errorReducer from '@store/UI/errorSlice';
import { GlobalErrorModal } from '@components/index';
import { mockTasks } from '../../../../../__mocks__/tasks';
import userEvent from '@testing-library/user-event';

jest.mock('@services/taskService');

const store = configureStore({
  reducer: {
    auth: () => ({ accessToken: 'mock-token' }),
    loader: loaderReducer,
    tasks: taskReducer,
    app: appReducer,
    error: errorReducer,
  },
  preloadedState: {
    tasks: mockTasks,
  },
});

const renderWithStore = () => {
  return render(
    <Provider store={store}>
      <Application />
      <GlobalErrorModal />
    </Provider>,
  );
};

describe('Add Modal integration tests', () => {
  test('Close the modal window', async () => {
    renderWithStore();

    const addButton = await screen.findByTestId('add-button');
    await userEvent.click(addButton);

    const addModal = await screen.findByTestId('add-modal');
    expect(addModal).toBeInTheDocument();

    const closeButton = within(addModal).getByRole('button', { name: /close modal window/i });
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();
    });
  });

  test('Closes modal on Escape', async () => {
    renderWithStore();

    const addButton = await screen.findByTestId('add-button');
    await userEvent.click(addButton);

    const addModal = await screen.findByTestId('add-modal');
    expect(addModal).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();
    });
  });

  test('Closes modal when clicking on overlay', async () => {
    renderWithStore();

    const addButton = await screen.findByTestId('add-button');
    await userEvent.click(addButton);

    const addModal = await screen.findByTestId('add-modal');
    expect(addModal).toBeInTheDocument();

    await userEvent.click(addModal);

    await waitFor(() => {
      expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();
    });
  });

  test('Does NOT close modal when clicking inside content', async () => {
    renderWithStore();

    const addButton = await screen.findByTestId('add-button');
    await userEvent.click(addButton);

    const addModal = await screen.findByTestId('add-modal');
    expect(addModal).toBeInTheDocument();

    const textarea = within(addModal).getByPlaceholderText('Write text...');

    await userEvent.click(textarea);

    await waitFor(() => {
      expect(screen.queryByTestId('add-modal')).toBeInTheDocument();
    });
  });

  test('Task created successfully', async () => {
    renderWithStore();

    (TaskService.createTask as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        category: 'Critical',
        createdAt: '2026-03-09T16:01:28.906Z',
        deadline: '2026-04-03T00:00:00.000Z',
        order: 3,
        remainingTime: 48,
        status: 'Active',
        task: 'Task 4',
        timeTracker: true,
        updatedAt: '2026-03-22T15:54:04.834Z',
        user: '69abaf3e8fffd11d0b572a8c',
        __v: 0,
        _id: 'task-4',
      },
    });

    const addButton = await screen.findByTestId('add-button');
    await userEvent.click(addButton);
    const addModal = await screen.findByTestId('add-modal');

    const textarea = within(addModal).getByPlaceholderText('Write text...');
    await userEvent.type(textarea, 'Task 4');
    expect(textarea).toHaveValue('Task 4');

    const remindTrigger = within(addModal).getAllByTestId('category-select-trigger')[0];
    await userEvent.click(remindTrigger);

    const remindOption = await within(addModal).findByText('48');
    await userEvent.click(remindOption);

    const categoryTrigger = within(addModal).getAllByTestId('category-select-trigger')[1];
    await userEvent.click(categoryTrigger);

    const criticalOption = await within(addModal).findByText('Critical');
    await userEvent.click(criticalOption);

    const dayInput = screen.getByPlaceholderText('Day');
    const monthInput = screen.getByPlaceholderText('Month');
    const yearInput = screen.getByPlaceholderText('Year');

    await userEvent.clear(dayInput);
    await userEvent.type(dayInput, '15');

    await userEvent.clear(monthInput);
    await userEvent.type(monthInput, '08');

    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, '2026');

    expect(dayInput).toHaveValue(15);
    expect(monthInput).toHaveValue(8);
    expect(yearInput).toHaveValue(2026);

    const createButton = within(addModal).getByTestId('add-button');
    await userEvent.click(createButton);

    const formattedDate = new Date(Date.UTC(Number('2026'), Number('8') - 1, Number('15')));
    const newTask = {
      task: 'Task 4',
      status: 'Active',
      category: 'Critical',
      remainingTime: Number(48),
      deadline: formattedDate.toISOString(),
    };

    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledTimes(1);
      expect(TaskService.createTask).toHaveBeenCalledWith(newTask);
      expect(store.getState().tasks).toHaveLength(mockTasks.length + 1);
    });
  });

  test('A modal window displaying the error appears if an error occurs', async () => {
    renderWithStore();

    (TaskService.createTask as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Internal server error',
    });

    const addButton = await screen.findByTestId('add-button');
    await userEvent.click(addButton);
    const addModal = await screen.findByTestId('add-modal');

    const textarea = screen.getByPlaceholderText('Write text...');
    await userEvent.type(textarea, 'Task 4');

    const remindTrigger = within(addModal).getAllByTestId('category-select-trigger')[0];
    await userEvent.click(remindTrigger);

    const remindOption = await within(addModal).findByText('48');
    await userEvent.click(remindOption);

    const categoryTrigger = within(addModal).getAllByTestId('category-select-trigger')[1];
    await userEvent.click(categoryTrigger);

    const criticalOption = await within(addModal).findByText('Critical');
    await userEvent.click(criticalOption);

    const dayInput = screen.getByPlaceholderText('Day');
    const monthInput = screen.getByPlaceholderText('Month');
    const yearInput = screen.getByPlaceholderText('Year');

    await userEvent.type(dayInput, '15');
    await userEvent.type(monthInput, '08');
    await userEvent.type(yearInput, '2026');

    const createButton = within(addModal).getByTestId('add-button');
    await userEvent.click(createButton);

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Internal server error/i);
  });
});
