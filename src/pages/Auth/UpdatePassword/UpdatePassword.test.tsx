import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdatePassword from './UpdatePassword';
import AuthService from '@services/authService';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/authSlice';
import loaderReducer from '@store/UI/loaderSlice';
import { Provider } from 'react-redux';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

jest.mock('@services/authService');

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      loader: loaderReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <UpdatePassword />
      </MemoryRouter>
    </Provider>,
  );
};

describe('UpdatePassword page', () => {
  test('Redirect to verification after a successful request', async () => {
    (AuthService.updatePassword as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        message: 'The operation was successful',
      },
    });

    renderWithStore();

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(AuthService.updatePassword).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
      });
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(
      /The code to change your password has been sent to your email address./i,
    );

    const authButton = await within(modal).findByTestId('auth-button');
    await userEvent.click(authButton);
    expect(navigate).toHaveBeenCalledWith('/verify-password', { replace: true });
  });

  test('Shows validation errors if fields are empty', async () => {
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  test('Shows error modal if request fails', async () => {
    (AuthService.updatePassword as jest.Mock).mockResolvedValue({
      success: false,
      error: 'User not found',
    });

    renderWithStore();

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(AuthService.updatePassword).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
      });
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/User not found/i);
  });

  test('Saves email to sessionStorage', async () => {
    (AuthService.updatePassword as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        message: 'The operation was successful',
      },
    });

    renderWithStore();

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(AuthService.updatePassword).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
      });
    });

    await waitFor(() => {
      expect(sessionStorage.getItem('resetEmail')).toBe('demo@taskmaster.app');
    });
  });
});
