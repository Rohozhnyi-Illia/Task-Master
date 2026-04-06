import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/authSlice';
import notificationReducer from '@store/notificationSlice';
import NotificationService from '@services/notificationService';
import { MemoryRouter } from 'react-router-dom';
import loaderReducer from '@store/UI/loaderSlice';
import { mockNotifications } from '../../../__mocks__/notifications';
import styles from './Header.module.scss';
import GlobalErrorModal from '@components/feedback/Modals/GlobalErrorModal/GlobalErrorModal';
import errorReducer from '@store/UI/errorSlice';
import tasksReducer from '@store/tasksSlice';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

jest.mock('@services/notificationService');

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    auth: authReducer,
    loader: loaderReducer,
    error: errorReducer,
  },
});

const renderHeader = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
        <GlobalErrorModal />
      </MemoryRouter>
    </Provider>,
  );
};

describe('Layout header', () => {
  test('The header is rendered', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    const header = await screen.findByTestId('header');
    expect(header).toBeInTheDocument();

    const logoText = within(header).getByText(/TaskMaster/i);
    const logoImg = within(header).getAllByAltText('Logo')[0];

    expect(logoText).toBeInTheDocument();
    expect(logoImg).toBeInTheDocument();

    const homeIcon = within(header).getByAltText(/application/i);
    const notificationsIcon = within(header).getByAltText(/notifications/i);
    const statsIcon = within(header).getByAltText(/statistics/i);
    const sunIcon = within(header).getByAltText(/sun/i);
    const moonIcon = within(header).getByAltText(/moon/i);
    const logoutIcon = within(header).getByAltText(/logout/i);

    expect(homeIcon).toBeInTheDocument();
    expect(notificationsIcon).toBeInTheDocument();
    expect(statsIcon).toBeInTheDocument();
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    expect(logoutIcon).toBeInTheDocument();

    const themeToggle = within(header).getByRole('button', { name: /toggle theme/i });
    const logoutButton = within(header).getByRole('button', { name: /logout/i });

    expect(themeToggle).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();

    const burger = header.querySelector(`.${styles.header__burger}`);
    expect(burger).toBeInTheDocument();
  });

  test('Successful receipt of assignments', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    await waitFor(() => {
      expect(NotificationService.getUserNotifications).toHaveBeenCalled();
    });

    const header = await screen.findByTestId('header');
    const taskCountBadge = await within(header).findByTestId('task-count-badge');

    const state = store.getState().notification;
    expect(state.length).toBe(3);
    expect(taskCountBadge).toHaveTextContent('3');
  });

  test('Error modal when a request fails', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Error receiving notification',
    });

    renderHeader();

    await waitFor(() => {
      expect(NotificationService.getUserNotifications).toHaveBeenCalled();
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Error receiving notification/i);
  });

  test('Change the app theme', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    const header = await screen.findByTestId('header');
    const themeToggle = within(header).getByRole('button', { name: /toggle theme/i });
    const html = document.documentElement;

    expect(html).toHaveAttribute('data-theme', 'light');
    expect(themeToggle).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(themeToggle);

    expect(html).toHaveAttribute('data-theme', 'dark');
    expect(themeToggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('Navigation to the notifications page', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    const header = await screen.findByTestId('header');
    const link = within(header).getByRole('link', { name: /notifications/i });

    expect(link).toHaveAttribute('href', '/notifications');
  });

  test('Navigation to the stats page', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    const header = await screen.findByTestId('header');
    const link = within(header).getByRole('link', { name: /statistics/i });

    expect(link).toHaveAttribute('href', '/statistics');
  });

  test('Navigation to the app page', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    const header = await screen.findByTestId('header');
    const link = within(header).getByRole('link', { name: /application/i });

    expect(link).toHaveAttribute('href', '/application');
  });

  test('The burger menu opens the navigation', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    renderHeader();

    const header = await screen.findByTestId('header');
    const burger = within(header).getByTestId('burger-menu');
    const nav = within(header).getByRole('navigation');

    expect(nav.className).not.toMatch(/open/i);

    await userEvent.click(burger);

    expect(nav.className).toMatch(/open/i);
  });

  test('Logout with token', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: mockNotifications,
    });

    const store = configureStore({
      reducer: {
        notification: notificationReducer,
        auth: () => ({ accessToken: 'mock-token' }),
        loader: loaderReducer,
        error: errorReducer,
        tasks: tasksReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
          <GlobalErrorModal />
        </MemoryRouter>
      </Provider>,
    );

    const header = await screen.findByTestId('header');
    const logoutButton = within(header).getByRole('button', { name: /Logout/i });

    await userEvent.click(logoutButton);

    waitFor(() => {
      const state = store.getState();

      expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
      expect(state.auth).toEqual({});
      expect(state.tasks).toEqual([]);
      expect(state.notification).toEqual([]);
    });
  });

  test('Logout without a token', async () => {
    (NotificationService.getUserNotifications as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Internal server error',
    });

    const store = configureStore({
      reducer: {
        notification: notificationReducer,
        auth: () => ({ accessToken: '' }),
        loader: loaderReducer,
        error: errorReducer,
        tasks: tasksReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
          <GlobalErrorModal />
        </MemoryRouter>
      </Provider>,
    );

    const header = await screen.findByTestId('header');
    const logoutButton = within(header).getByRole('button', { name: /Logout/i });

    await userEvent.click(logoutButton);

    waitFor(() => {
      const state = store.getState();

      expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
      expect(state.auth).toEqual({});
      expect(state.tasks).toEqual([]);
      expect(state.notification).toEqual([]);
    });
  });
});
