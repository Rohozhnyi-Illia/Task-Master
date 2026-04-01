import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddModal from './AddModal';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from '@store/UI/loaderSlice';

const mockFn = jest.fn();
jest.mock('@services/TaskService');

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
});
