import { render, screen, waitFor, within } from '@testing-library/react';
import NotificationsPage from './NotificationsPage';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import errorReducer from '@store/UI/errorSlice';
import { GlobalErrorModal } from '@components/index';
import { mockNotifications } from '../../../__mocks__/notifications';
import notificationReducer from '@store/notificationSlice';
import userEvent from '@testing-library/user-event';
import NotificationService from '@services/notificationService';

jest.mock('@services/notificationService');

const renderWithStore = (store: EnhancedStore) => {
  return render(
    <Provider store={store}>
      <NotificationsPage />
      <GlobalErrorModal />
    </Provider>,
  );
};

describe('Notifications page', () => {
  test('Render the notifications page', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
      preloadedState: {
        notification: mockNotifications,
      },
    });

    renderWithStore(store);

    const badge = await screen.findByTestId('greeting-badge');
    const title = within(badge).getByText('Hello, TestUser 👋');
    const subtitle = within(badge).getByText('Check your notifications.');

    expect(badge).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();

    const filter = await screen.findByTestId('category-select-component');
    const actionButtons = await screen.findAllByTestId('notification-action-button');
    const notificationList = await screen.findByTestId('notification-list');
    const notifications = await within(notificationList).findAllByTestId('notification');

    expect(filter).toBeInTheDocument();
    expect(actionButtons).toHaveLength(2);
    expect(notificationList).toBeInTheDocument();
    expect(notifications).toHaveLength(3);
  });

  test('Lack of notifications', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
    });

    renderWithStore(store);

    const badge = await screen.findByTestId('greeting-badge');
    const title = within(badge).getByText('Hello, TestUser 👋');
    const subtitle = within(badge).getByText('Check your notifications.');

    expect(badge).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(screen.queryByTestId('category-select-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('notification-action-button')).not.toBeInTheDocument();

    const notificationList = await screen.findByTestId('notification-list');
    const emptyBlock = within(notificationList).getByTestId('empty-block');

    expect(emptyBlock).toBeInTheDocument();
  });

  test('Filters are not displayed if there are no tasks', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
    });

    renderWithStore(store);

    const categorySelect = screen.queryByTestId('category-select');
    expect(categorySelect).not.toBeInTheDocument();
  });

  test('Filters are displayed if there are tasks', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
      preloadedState: {
        notification: mockNotifications,
      },
    });

    renderWithStore(store);

    const categorySelect = await screen.findByTestId('category-select-component');
    expect(categorySelect).toBeInTheDocument();
  });

  test('Action buttons not displayed if there are no tasks', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
    });

    renderWithStore(store);

    const actionButtons = screen.queryByTestId('notification-action-button');
    expect(actionButtons).not.toBeInTheDocument();
  });

  test('Action buttons are displayed if there are tasks', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
      preloadedState: {
        notification: mockNotifications,
      },
    });

    renderWithStore(store);

    const actionButtons = await screen.findAllByTestId('notification-action-button');
    expect(actionButtons).toHaveLength(2);
    expect(actionButtons[0]).toBeInTheDocument();
    expect(actionButtons[1]).toBeInTheDocument();
  });

  test('Delete all notifications', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
      preloadedState: {
        notification: mockNotifications,
      },
    });

    (NotificationService.deleteAllNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { deletedCount: 3 },
    });

    renderWithStore(store);

    expect(store.getState().notification).toHaveLength(3);
    expect(await screen.findAllByTestId('notification')).toHaveLength(3);

    const actionButtons = await screen.findAllByTestId('notification-action-button');

    await userEvent.click(actionButtons[1]);

    await waitFor(() => {
      expect(store.getState().notification).toHaveLength(0);
    });

    expect(screen.queryAllByTestId('notification')).toHaveLength(0);
  });

  test('Delete read notifications', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
      preloadedState: {
        notification: mockNotifications,
      },
    });

    (NotificationService.deleteReadNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { deletedCount: 1 },
    });

    (NotificationService.markAsRead as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockNotifications[0], isDismissed: false, isRead: true },
    });

    renderWithStore(store);

    expect(store.getState().notification).toHaveLength(3);
    expect(await screen.findAllByTestId('notification')).toHaveLength(3);

    const notifications = await screen.findAllByTestId('notification');
    const notificationToDelete = notifications[0];
    const readButton = within(notificationToDelete).getByRole('button', {
      name: /Mark as read/i,
    });

    await userEvent.click(readButton);

    const actionButtons = await screen.findAllByTestId('notification-action-button');
    await userEvent.click(actionButtons[0]);

    await waitFor(() => {
      const state = store.getState().notification;
      expect(state).toHaveLength(2);
      expect(state[0].task).toBe('69aeeed855b183cb2b0eac14');
      expect(state[1].task).toBe('69aeeed855b183cb2b0eac14');
    });

    expect(await screen.findAllByTestId('notification')).toHaveLength(2);
  });

  test('Filter notifications by category', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token', name: 'TestUser' }),
        notification: notificationReducer,
        error: errorReducer,
      },
      preloadedState: {
        notification: mockNotifications,
      },
    });

    renderWithStore(store);

    const notificationList = await screen.findByTestId('notification-list');
    const categorySelect = await screen.findByTestId('category-select-component');
    const categoryTrigger = within(categorySelect).getByTestId('category-select-trigger');

    await userEvent.click(categoryTrigger);

    const dropdown = await screen.findByTestId('category-options');
    const option = within(dropdown).getByText('Overdue');

    await userEvent.click(option);

    const notifications = await within(notificationList).findAllByTestId('notification');

    expect(notifications).toHaveLength(1);

    expect(notifications[0]).toHaveTextContent(/overdue/i);
    expect(notifications[0]).toHaveTextContent(/tasks dashboard ui/i);
  });
});
