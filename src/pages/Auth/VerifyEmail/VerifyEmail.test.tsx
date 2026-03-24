import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyEmail from '../VerifyEmail/VerifyEmail';
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
        <VerifyEmail />
      </MemoryRouter>
    </Provider>,
  );
};

describe('Verify email page', () => {
  test('Log in to the app after successful verification', async () => {
    (AuthService.verifyEmail as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: '1',
        email: 'demo@taskmaster.app',
        name: 'Demo',
        accessToken: 'token',
      },
    });

    renderWithStore();

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Verify Code/i, { selector: 'input' }), 'demo12');
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    expect(AuthService.verifyEmail).toHaveBeenCalledWith({
      email: 'demo@taskmaster.app',
      verifyCode: 'demo12',
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Your email has been successfully verified/i);

    const authButton = await within(modal).findByTestId('auth-button');
    expect(modal).toBeInTheDocument();
    await userEvent.click(authButton);
    expect(navigate).toHaveBeenCalledWith('/application', { replace: true });

    expect(sessionStorage.getItem('signUpEmail')).toBeNull();
  });

  test('Shows validation errors if fields are empty', async () => {
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Verification code is required/i)).toBeInTheDocument();
  });

  test('Shows error if verification code is incorrect', async () => {
    (AuthService.verifyEmail as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Incorrect verification code',
    });

    renderWithStore();

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Verify Code/i, { selector: 'input' }), 'demo12');
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Incorrect verification code/i);
  });

  test('Resend verification code successfuly', async () => {
    (AuthService.reVerifyEmail as jest.Mock).mockResolvedValue({
      success: true,
      data: { emailActivated: false },
    });

    renderWithStore();

    await userEvent.type(screen.getByLabelText(/E-mail/i), 'demo@taskmaster.app');
    await userEvent.click(screen.getByRole('button', { name: /Resend/i }));
    expect(await screen.findByText(/A new verification code has been sent/i)).toBeInTheDocument();
  });

  test('Shows error if resend fails', async () => {
    (AuthService.reVerifyEmail as jest.Mock).mockResolvedValue({
      success: false,
      error: 'User not found',
    });

    renderWithStore();

    await userEvent.type(screen.getByLabelText(/E-mail/i), 'demo@taskmaster.app');
    await userEvent.click(screen.getByRole('button', { name: /Resend/i }));

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/User not found/i);
  });

  test('Prefills email from sessionStorage', () => {
    sessionStorage.setItem('signUpEmail', 'demo@taskmaster.app');

    renderWithStore();

    const emailInput = screen.getByLabelText(/E-mail/i);
    expect(emailInput).toHaveValue('demo@taskmaster.app');
  });

  test('Redirects to login if no email in state or session', async () => {
    sessionStorage.clear();

    renderWithStore();

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  test('Shows validation error if only verify code is entered', async () => {
    renderWithStore();

    await userEvent.type(screen.getByLabelText(/Verify Code/i, { selector: 'input' }), '123456');

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });
});
