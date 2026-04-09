import { render, screen, waitFor, within } from '@testing-library/react';
import NotificationsPage from '../../NotificationsPage';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import NotificationService from '@services/notificationService';
import errorReducer from '@store/UI/errorSlice';
import { GlobalErrorModal } from '@components/index';
import { mockNotifications } from '../../../../../__mocks__/notifications';
import userEvent from '@testing-library/user-event';
import notificationReducer from '@store/notificationSlice';
import styles from './Notification.module.scss';

jest.mock('@services/notificationService');

const renderWithStore = (store: EnhancedStore) => {
  return render(
    <Provider store={store}>
      <NotificationsPage />
      <GlobalErrorModal />
    </Provider>,
  );
};

describe('Notification integration tests', () => {
  test('Notification successfully deleted', async () => {
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

    (NotificationService.deleteNotification as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockNotifications[0], isDismissed: true, dismissedAt: new Date() },
    });

    renderWithStore(store);

    const notificationList = await screen.findByTestId('notification-list');
    const notifications = within(notificationList).getAllByTestId('notification');
    const firstNotification = notifications[0];

    const deleteButton = within(firstNotification).getByRole('button', { name: /Delete/i });

    await userEvent.click(deleteButton);

    waitFor(() => {
      expect(NotificationService.deleteNotification).toHaveBeenCalledWith('notification-1');
      const state = store.getState().notification;
      expect(state).toHaveLength(2);
      expect(firstNotification).not.toBeInTheDocument();
    });
  });

  test('The notification has been successfully read', async () => {
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

    (NotificationService.markAsRead as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockNotifications[0], isDismissed: false, isRead: true },
    });

    renderWithStore(store);

    const notificationList = await screen.findByTestId('notification-list');
    const notifications = within(notificationList).getAllByTestId('notification');
    const firstNotification = notifications[0];

    expect(firstNotification).toHaveClass(styles.unread);

    const readButton = within(firstNotification).getByRole('button', { name: /Mark as read/i });

    await userEvent.click(readButton);

    waitFor(() => {
      expect(NotificationService.markAsRead).toHaveBeenCalledWith('notification-1');
      const state = store.getState().notification;
      expect(state).toHaveLength(3);
      expect(state[0].isRead).toBe(true);
      expect(firstNotification).toHaveClass(styles.read);
    });
  });

  test('A modal window with an error message will appear', async () => {
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

    (NotificationService.deleteNotification as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Error dismissing notification',
    });

    renderWithStore(store);

    const notificationList = await screen.findByTestId('notification-list');
    const notifications = within(notificationList).getAllByTestId('notification');
    const firstNotification = notifications[0];

    const deleteButton = within(firstNotification).getByRole('button', { name: /Delete/i });

    await userEvent.click(deleteButton);

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Error dismissing notification/i);
  });
});
