import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyPassword from '../VerifyPassword/VerifyPassword';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/authSlice';
import loaderReducer from '@store/UI/loaderSlice';
import AuthService from '@services/authService';
import { MemoryRouter } from 'react-router-dom';

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
        <VerifyPassword />
      </MemoryRouter>
    </Provider>,
  );
};

describe('VerifyPassword page', () => {
  test('Redirect to the login page after changing the password', async () => {
    (AuthService.verifyPassword as jest.Mock).mockResolvedValue({
      success: true,
      data: { message: 'Password successfully changed' },
    });

    renderWithStore();

    sessionStorage.setItem('resetEmail', 'demo@taskmaster.app');

    await userEvent.type(screen.getByLabelText(/Verify Code/i, { selector: 'input' }), 'demo12');
    await userEvent.type(screen.getByLabelText(/New Password/i, { selector: 'input' }), '123Demo$');
    await userEvent.type(
      screen.getByLabelText(/Repeat Password/i, { selector: 'input' }),
      '123Demo$',
    );

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(AuthService.verifyPassword).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        newPassword: '123Demo$',
        repeatPassword: '123Demo$',
        verifyCode: 'demo12',
      });
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('Password successfully changed');

    const authButton = await within(modal).findByTestId('auth-button');
    await userEvent.click(authButton);

    expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(sessionStorage.getItem('resetEmail')).toBeNull();
  });

  test('Shows validation errors if fields are empty', async () => {
    sessionStorage.setItem('resetEmail', 'demo@taskmaster.app');
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/Verification code is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Repeat password is required/i)).toBeInTheDocument();
  });

  test('Shows error modal if verification fails', async () => {
    renderWithStore();

    (AuthService.verifyPassword as jest.Mock).mockResolvedValue({
      success: false,
      error: 'This password is already in use',
    });

    sessionStorage.setItem('resetEmail', 'demo@taskmaster.app');

    await userEvent.type(screen.getByLabelText(/Verify Code/i, { selector: 'input' }), 'demo12');
    await userEvent.type(screen.getByLabelText(/New Password/i, { selector: 'input' }), '123Demo$');
    await userEvent.type(
      screen.getByLabelText(/Repeat Password/i, { selector: 'input' }),
      '123Demo$',
    );

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(AuthService.verifyPassword).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        newPassword: '123Demo$',
        repeatPassword: '123Demo$',
        verifyCode: 'demo12',
      });
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/This password is already in use/i);
  });

  test('Redirect to password reset if there is no email in sessionStorage', async () => {
    renderWithStore();

    sessionStorage.clear();

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/update-password', { replace: true });
    });
  });

  test('Shows error modal if sessionEmail is missing on submit', async () => {
    sessionStorage.clear();
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toHaveTextContent(/Email not found/i);
  });

  test('Redirects to update-password when clicking error modal for missing email', async () => {
    renderWithStore();
    sessionStorage.clear();

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Email not found, please restart password reset flow/i);

    const authButton = await within(modal).findByTestId('auth-button');
    await userEvent.click(authButton);

    expect(navigate).toHaveBeenCalledWith('/update-password', { replace: true });
  });

  test('Shows validation errors if only verify code is entered', async () => {
    sessionStorage.setItem('resetEmail', 'demo@taskmaster.app');
    renderWithStore();

    await userEvent.type(screen.getByLabelText(/Verify Code/i, { selector: 'input' }), 'demo12');

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Repeat password is required/i)).toBeInTheDocument();
  });
});
