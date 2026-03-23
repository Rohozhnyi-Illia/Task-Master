import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import ProtectPath from '@services/ProtectPath';
import { Provider } from 'react-redux';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

describe('Protected path', () => {
  test('Redirects to /login if user is not authenticated', () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: '' }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectPath />}>
              <Route path="/protected" element={<div>Protected</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('Renders protected content if user is authenticated', () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token' }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectPath />}>
              <Route path="protected" element={<div>Protected</div>} />
            </Route>

            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  test('Checking for the presence of a outlet layout', () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: 'mock-token' }),
      },
    });

    const Layout = () => (
      <div>
        <span>Layout</span>
        <Outlet />
      </div>
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectPath />}>
              <Route path="/" element={<Layout />}>
                <Route path="protected" element={<div>Protected</div>} />
              </Route>
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  test('Redirects to /login and replaces history if not authenticated', () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ accessToken: '' }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectPath />}>
              <Route path="protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
