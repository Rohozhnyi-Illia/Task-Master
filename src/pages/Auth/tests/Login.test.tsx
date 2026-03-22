import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
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
        <Login />
      </MemoryRouter>
    </Provider>,
  );
};

describe('Login page', () => {
  test('Redirect to the app after a successful login', async () => {
    (AuthService.login as jest.Mock).mockResolvedValue({
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
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo1234',
      });
      expect(navigate).toHaveBeenCalledWith('/application');
    });
  });

  test('Shows validation errors if fields are empty', async () => {
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  test('Shows error modal if login fails', async () => {
    renderWithStore();

    (AuthService.login as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Incorrect password',
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo12345');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo12345',
      });
    });

    const modal = await screen.findByTestId('error-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Incorrect password/i);
  });

  test('Redirect to email verification if the account is not activated', async () => {
    renderWithStore();

    (AuthService.login as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Email not activated',
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo1234',
      });
    });

    const modal = await screen.findByTestId('error-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Your email is not verified. Please check your inbox/i);

    const authButton = await within(modal).findByTestId('auth-button');
    await userEvent.click(authButton);
    expect(navigate).toHaveBeenCalledWith('/verify-email');
  });

  test('Attempt to activate an already activated account', async () => {
    renderWithStore();

    (AuthService.reVerifyEmail as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Account already activated',
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234');
    await userEvent.click(screen.getByRole('button', { name: /Activate/i }));

    await waitFor(() =>
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo1234',
      }),
    );

    const modal = await screen.findByTestId('error-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Account already activated/i);
  });

  test('Activating an inactive account', async () => {
    renderWithStore();

    (AuthService.reVerifyEmail as jest.Mock).mockResolvedValue({
      success: true,
      data: { emailActivated: true },
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234');
    await userEvent.click(screen.getByRole('button', { name: /Activate/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo1234',
      });
      expect(navigate).toHaveBeenCalledWith('/verify-email');
    });
  });

  test('Show a validation error when activating an account', async () => {
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /Activate/i }));
    expect(screen.getByText(/Email is required/i));
  });

  test('Redirects to /application if savedAuth.keepLogged is true', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        loader: loaderReducer,
      },
    });

    const authState = {
      email: 'demo@taskmaster.app',
      keepLogged: true,
      accessToken: 'token123',
      id: '1',
      name: 'Demo',
    };

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(authState));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      const state = store.getState().auth;
      expect(state.email).toBe('demo@taskmaster.app');
      expect(state.accessToken).toBe('token123');
    });

    expect(navigate).toHaveBeenCalledWith('/application');
  });

  test('Sets email in form is savedAuth.email exists but keepLogged is false', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        loader: loaderReducer,
      },
    });

    const authState = {
      email: 'demo@taskmaster.app',
      keepLogged: false,
    };

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(authState));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const emailInput = screen.getByLabelText(/E-mail/i, { selector: 'input' });
    expect(emailInput).toHaveValue('demo@taskmaster.app');
  });
});
