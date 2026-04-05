import { render, screen, waitFor, act, within } from '@testing-library/react';
import ToastsContainer from './ToastContainer/ToastsContainer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import toastSlice, { showSuccess } from '@store/UI/toastSlice';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();

const createTestStore = () =>
  configureStore({
    reducer: {
      success: toastSlice,
    },
  });

const renderToastContainer = () => {
  const store = createTestStore();

  render(
    <Provider store={store}>
      <ToastsContainer />
    </Provider>,
  );

  return store;
};

describe('Toast', () => {
  test('The toasts are rendering successfully ', async () => {
    const store = renderToastContainer();

    await act(async () => {
      store.dispatch(showSuccess('Test 1'));
    });

    const toastContainer = await screen.findByTestId('toast-container');
    const toast = await within(toastContainer).findByTestId('toast');

    expect(toastContainer).toBeInTheDocument();
    expect(toast).toBeInTheDocument();
  });

  test('Toasts are displayed after a successful operation', async () => {
    const store = renderToastContainer();

    await act(async () => {
      store.dispatch(showSuccess('Test 1'));
      store.dispatch(showSuccess('Test 2'));
      store.dispatch(showSuccess('Test 3'));
    });

    const toasts = await screen.findAllByTestId('toast');

    expect(toasts).toHaveLength(3);
    expect(toasts[0]).toHaveTextContent('Test 1');
    expect(toasts[1]).toHaveTextContent('Test 2');
    expect(toasts[2]).toHaveTextContent('Test 3');
  });

  test('Toast disappears automatically after 5 seconds', async () => {
    const store = renderToastContainer();

    await act(async () => {
      store.dispatch(showSuccess('Auto remove'));
    });

    const toast = await screen.findByTestId('toast');
    expect(toast).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });
  });

  test('Manual toast removal', async () => {
    jest.useFakeTimers();

    const store = renderToastContainer();

    await act(async () => {
      store.dispatch(showSuccess('Manual remove'));
    });

    const toast = await screen.findByTestId('toast');
    expect(toast).toBeInTheDocument();

    const deleteButton = within(toast).getByRole('button', { name: /Close toast/i });

    await act(async () => {
      userEvent.click(deleteButton);
      jest.advanceTimersByTime(5000 + 300);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });
  });
});
