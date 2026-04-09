import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Notification from './Notification';
import NotificationService from '@services/notificationService';
import { useDispatch, useSelector } from 'react-redux';
import { mockNotifications } from '../../../../../__mocks__/notifications';

jest.mock('@services/notificationService');

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const renderNotification = () => {
  return render(
    <Notification
      id="notification-1"
      type="reminder"
      message='Test "Task 1" message'
      isRead={false}
    />,
  );
};

describe('Notification unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        notification: mockNotifications,
      }),
    );
  });

  test('mark as read', async () => {
    (NotificationService.markAsRead as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockNotifications[0], isDismissed: false, isRead: true },
    });

    renderNotification();

    const notification = screen.getByTestId('notification');
    const readButton = within(notification).getByRole('button', {
      name: /Mark as read/i,
    });

    await userEvent.click(readButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: 'notification-1', markAsRead: true },
        }),
      );
    });

    expect(NotificationService.markAsRead).toHaveBeenCalledWith('notification-1');
  });

  test('mark as read rollback on error', async () => {
    (NotificationService.markAsRead as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Error marking notification as read',
    });

    renderNotification();

    const notification = screen.getByTestId('notification');
    const readButton = within(notification).getByRole('button', {
      name: /Mark as read/i,
    });

    await userEvent.click(readButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: 'notification-1', markAsRead: true },
        }),
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: 'notification-1', markAsRead: false },
        }),
      );
    });
  });

  test('delete notification', async () => {
    (NotificationService.deleteNotification as jest.Mock).mockResolvedValue({
      success: true,
    });

    renderNotification();

    const notification = screen.getByTestId('notification');
    const deleteButton = within(notification).getByRole('button', {
      name: /Delete/i,
    });

    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: 'notification-1',
        }),
      );
    });

    expect(NotificationService.deleteNotification).toHaveBeenCalledWith('notification-1');
  });

  test('restore notification on delete error', async () => {
    (NotificationService.deleteNotification as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Delete failed',
    });

    renderNotification();

    const notification = screen.getByTestId('notification');
    const deleteButton = within(notification).getByRole('button', {
      name: /Delete/i,
    });

    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: 'notification-1',
        }),
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            _id: 'notification-1',
          }),
        }),
      );
    });
  });
});
