import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../SignUp';
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
        <SignUp />
      </MemoryRouter>
    </Provider>,
  );
};

describe('SignUp page', () => {
  test('Redirect to verification after successful registration', async () => {
    renderWithStore();

    (AuthService.register as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: '1',
        email: 'demo@taskmaster.app',
        name: 'Demo',
      },
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Name/i, { selector: 'input' }), 'Demo');
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234$');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo1234$',
        name: 'Demo',
      });
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(
      'An email activation code has been sent to your email address.',
    );

    const authButton = await within(modal).findByTestId('auth-button');
    await userEvent.click(authButton);
    expect(navigate).toHaveBeenCalledWith('/verify-email', { replace: true });
  });

  test('Shows validation errors if fields are empty', async () => {
    renderWithStore();

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/Email is require/i)).toBeInTheDocument();
    expect(await screen.findByText(/Name is require/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is require/i)).toBeInTheDocument();
  });

  test('Shows error modal if registration fails', async () => {
    renderWithStore();

    (AuthService.register as jest.Mock).mockResolvedValue({
      success: false,
      error: 'User already exists',
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Name/i, { selector: 'input' }), 'Demo');
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234$');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        email: 'demo@taskmaster.app',
        password: 'Demo1234$',
        name: 'Demo',
      });
    });

    const modal = await screen.findByTestId('modal-base');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('User already exists');
  });

  test('Saves email to sessionStorage after successful registration', async () => {
    renderWithStore();

    (AuthService.register as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: '1',
        email: 'demo@taskmaster.app',
        name: 'Demo',
      },
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Name/i, { selector: 'input' }), 'Demo');
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234$');

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('signUpEmail')).toBe('demo@taskmaster.app');
    });
  });

  test('Updates email in redux store after registration', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        loader: loaderReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

    (AuthService.register as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: '1',
        email: 'demo@taskmaster.app',
        name: 'Demo',
      },
    });

    await userEvent.type(
      screen.getByLabelText(/E-mail/i, { selector: 'input' }),
      'demo@taskmaster.app',
    );
    await userEvent.type(screen.getByLabelText(/Name/i, { selector: 'input' }), 'Demo');
    await userEvent.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Demo1234$');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(store.getState().auth.email).toBe('demo@taskmaster.app');
    });
  });
});
