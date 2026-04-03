import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddModal from './AddModal';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from '@store/UI/loaderSlice';
import TaskService from '@services/taskService';

const mockFn = jest.fn();
jest.mock('@services/taskService');

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const renderAddModal = () => {
  const store = configureStore({
    reducer: {
      loader: loaderSlice,
    },
  });

  render(
    <Provider store={store}>
      <AddModal isAddModalOpen={true} openModalHandler={mockFn} />
    </Provider>,
  );
};

describe('Add modal unit tests', () => {
  test('Validation errors are displayed if data is missing', async () => {
    renderAddModal();

    const addModal = await screen.findByTestId('add-modal');
    const addButton = within(addModal).getByRole('button', { name: /New Task/i });

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(within(addModal).findByText('Task is required'));
      expect(within(addModal).findByText('Category is required'));
      expect(within(addModal).findByText('Day is required'));
      expect(within(addModal).findByText('Month is required'));
      expect(within(addModal).findByText('Year is required'));
    });
  });

  test('Shows error if deadline is in the past', async () => {
    renderAddModal();

    const addModal = await screen.findByTestId('add-modal');
    const addButton = within(addModal).getByRole('button', { name: /New Task/i });

    const textarea = within(addModal).getByPlaceholderText('Write text...');
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

    await userEvent.type(dayInput, '01');
    await userEvent.type(monthInput, '01');
    await userEvent.type(yearInput, '2025');

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(within(addModal).findByText('Deadline must be in the future'));
    });
  });

  test('Prevents double submit', async () => {
    renderAddModal();

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

    await userEvent.type(dayInput, '15');
    await userEvent.type(monthInput, '08');
    await userEvent.type(yearInput, '2026');

    const createButton = within(addModal).getByTestId('add-button');
    await userEvent.click(createButton);
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledTimes(1);
    });
  });
});
