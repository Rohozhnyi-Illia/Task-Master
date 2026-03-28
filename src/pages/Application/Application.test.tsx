import { render, screen, waitFor, within } from '@testing-library/react';
import Application from './Application';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@store/tasksSlice';
import appReducer from '@store/appSlice';
import loaderReducer from '@store/UI/loaderSlice';
import { Provider } from 'react-redux';
import TaskService from '@services/taskService';
import errorReducer from '@store/UI/errorSlice';
import { GlobalErrorModal } from '@components/index';
import { mockTasks } from '../../../__mocks__/tasks';
import userEvent from '@testing-library/user-event';

jest.mock('@services/taskService');

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      auth: () => ({ accessToken: 'mock-token' }),
      loader: loaderReducer,
      tasks: taskReducer,
      app: appReducer,
      error: errorReducer,
    },
  });

  return render(
    <Provider store={store}>
      <Application />
      <GlobalErrorModal />
    </Provider>,
  );
};

describe('Application page', () => {
  test('Successful retrieval of tasks', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token' }),
        loader: loaderReducer,
        tasks: taskReducer,
        app: appReducer,
        error: errorReducer,
      },
    });

    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTasks,
    });

    expect(store.getState().app.firstAppLoadDone).toBe(false);

    render(
      <Provider store={store}>
        <Application />
      </Provider>,
    );

    await waitFor(() => {
      expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);
      expect(store.getState().app.firstAppLoadDone).toBe(true);
      expect(store.getState().tasks).toHaveLength(3);
    });
  });

  test('The loader does not appear on the second load', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token' }),
        loader: loaderReducer,
        tasks: taskReducer,
        app: () => ({ firstAppLoadDone: true }),
        error: errorReducer,
      },
    });

    const spyDispatch = jest.spyOn(store, 'dispatch');

    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTasks,
    });

    render(
      <Provider store={store}>
        <Application />
      </Provider>,
    );

    await waitFor(() => {
      expect(TaskService.getAllTasks).toHaveBeenCalled();
    });

    expect(spyDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'loader/showLoader' }),
    );
    expect(spyDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'loader/closeLoader' }),
    );
  });

  test('Error retrieving tasks', async () => {
    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Internal server error',
    });

    renderWithStore();

    await waitFor(() => {
      expect(TaskService.getAllTasks).toHaveBeenCalled();
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Internal server error/i);
  });

  test('Filters are not displayed if there are no tasks', async () => {
    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    renderWithStore();

    await waitFor(() => {
      expect(TaskService.getAllTasks).toHaveBeenCalled();
    });

    const categorySelect = screen.queryByTestId('category-select');
    const keywordInput = screen.queryByTestId('keyword-input');

    expect(categorySelect).not.toBeInTheDocument();
    expect(keywordInput).not.toBeInTheDocument();
  });

  test('Filters are displayed if there are tasks', async () => {
    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTasks,
    });

    renderWithStore();

    await waitFor(() => {
      expect(TaskService.getAllTasks).toHaveBeenCalled();
    });

    const categorySelect = await screen.findByTestId('category-select');
    const keywordInput = await screen.findByTestId('keyword-input');

    expect(categorySelect).toBeInTheDocument();
    expect(keywordInput).toBeInTheDocument();
  });

  test('Open a modal window to create a task', async () => {
    renderWithStore();

    const addButton = await screen.findByTestId('add-button');

    expect(addButton).toBeInTheDocument();
    expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();

    await userEvent.click(addButton);

    const addModal = await screen.findByTestId('add-modal');
    expect(addModal).toBeInTheDocument();
  });

  test('Opening the drop-down container', async () => {
    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTasks,
    });

    renderWithStore();

    const dragAndDropButton = await screen.findByTestId('drag-and-drop-button');
    expect(dragAndDropButton).toBeInTheDocument();
    expect(screen.queryByTestId('drag-and-drop-container')).not.toBeInTheDocument();

    await userEvent.click(dragAndDropButton);

    const dragAndDropContainer = await screen.findByTestId('drag-and-drop-container');
    expect(dragAndDropContainer).toBeInTheDocument();
    const dragAndDropItems =
      await within(dragAndDropContainer).findAllByTestId('drag-and-drop-item');

    expect(dragAndDropItems).toHaveLength(3);
  });

  test('The drag-and-drop button is displayed only if there are fewer than 1 task', async () => {
    (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: [mockTasks[0]],
    });

    renderWithStore();

    expect(screen.queryByTestId('drag-and-drop-button')).not.toBeInTheDocument();
  });
});
