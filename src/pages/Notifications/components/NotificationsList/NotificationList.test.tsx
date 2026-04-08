import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  mockNotifications,
  mockNotificationsForPagination,
} from '../../../../../__mocks__/notifications';
import NotificationList from './NotificationList';
import { NotificationFilterType } from '../../../../types/notification';
import { Notification } from '../../../../types/notification';

jest.mock('@services/notificationService');

const renderNotificationList = (
  notifications: Notification[],
  selected: NotificationFilterType,
) => {
  const store = configureStore({
    reducer: {
      notification: () => notifications,
    },
  });

  return render(
    <Provider store={store}>
      <NotificationList selected={selected} />
    </Provider>,
  );
};

describe('Notification list', () => {
  test('Displaying notifications on the page', async () => {
    renderNotificationList(mockNotifications, '');

    const notificationList = await screen.findByTestId('notification-list');
    expect(notificationList).toBeInTheDocument();

    const notifications = await within(notificationList).findAllByTestId('notification');
    expect(notifications).toHaveLength(3);
    expect(notifications[0]).toBeInTheDocument();
    expect(notifications[1]).toBeInTheDocument();
    expect(notifications[2]).toBeInTheDocument();
  });

  test('An empty block is displayed if there are no notifications', async () => {
    renderNotificationList([], '');

    const emptyBlock = await screen.findByTestId('empty-block');
    const emptyImg = await screen.findByAltText('no data');

    expect(emptyBlock).toBeInTheDocument();
    expect(emptyImg).toBeInTheDocument();
    expect(emptyBlock).toHaveTextContent(/Nothing to see here… yet!/i);
  });

  test('Pagination does not render if there are fewer than 5 tasks', async () => {
    renderNotificationList(mockNotifications, '');

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  test('Pagination is displayed if there are more than 5 tasks', async () => {
    renderNotificationList(mockNotificationsForPagination, '');

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();
  });

  test('Page turning', async () => {
    renderNotificationList(mockNotificationsForPagination, '');

    const pagination = screen.getByTestId('pagination');
    const nextButton = within(pagination).getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    let notifications = await screen.findAllByTestId('notification');
    expect(notifications).toHaveLength(5);
    expect(within(notifications[0]).getByText('"Task 6"')).toBeInTheDocument();
    expect(within(notifications[4]).getByText('"Task 10"')).toBeInTheDocument();

    const backButton = within(pagination).getByRole('button', { name: /back/i });
    await userEvent.click(backButton);

    notifications = await screen.findAllByTestId('notification');
    expect(within(notifications[0]).getByText('"Task 1"')).toBeInTheDocument();
    expect(within(notifications[4]).getByText('"Task 5"')).toBeInTheDocument();
  });
});
