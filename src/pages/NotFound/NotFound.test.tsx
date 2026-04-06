import { render, screen, within } from '@testing-library/react';
import NotFound from './NotFound';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import loaderReducer from '@store/UI/loaderSlice';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

const renderPage = (store: EnhancedStore) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    </Provider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Not found page', () => {
  test('Page rendering with a token', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token' }),
        loader: loaderReducer,
      },
    });

    renderPage(store);

    const page = await screen.findByTestId('not-found');
    expect(page).toBeInTheDocument();

    const img = within(page).getByAltText(/Not Found/i);
    const text = within(page).getByText(/Oops, Page Not Found.../i);

    expect(img).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    const navigateButton = within(page).getByTestId('navigate-button');
    expect(navigateButton).toHaveRole('button');

    expect(navigateButton).toBeInTheDocument();
    expect(navigateButton).toHaveTextContent(/Go to Dashboard/i);
  });

  test('Page rendering without the token', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: '' }),
        loader: loaderReducer,
      },
    });

    renderPage(store);

    const page = await screen.findByTestId('not-found');
    expect(page).toBeInTheDocument();

    const img = within(page).getByAltText(/Not Found/i);
    const text = within(page).getByText(/Oops, Page Not Found.../i);

    expect(img).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    const navigateButton = within(page).getByTestId('navigate-button');
    expect(navigateButton).toHaveRole('button');

    expect(navigateButton).toBeInTheDocument();
    expect(navigateButton).toHaveTextContent(/Go to Login/i);
  });

  test('Navigation with a token', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token' }),
        loader: loaderReducer,
      },
    });

    renderPage(store);

    const page = await screen.findByTestId('not-found');
    const navigateButton = within(page).getByTestId('navigate-button');

    await userEvent.click(navigateButton);

    expect(navigate).toHaveBeenCalledWith('/application', { replace: true });
  });

  test('Navigation without the token', async () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: '' }),
        loader: loaderReducer,
      },
    });

    renderPage(store);

    const page = await screen.findByTestId('not-found');
    const navigateButton = within(page).getByTestId('navigate-button');

    await userEvent.click(navigateButton);

    expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
