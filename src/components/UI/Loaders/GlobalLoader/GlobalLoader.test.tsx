import { render, screen, waitFor } from '@testing-library/react';
import GlobalLoader from './GlobalLoader';
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from '@store/UI/loaderSlice';
import { Provider } from 'react-redux';
import { showLoader, closeLoader } from '@store/UI/loaderSlice';
import { act } from 'react';

const store = configureStore({
  reducer: {
    loader: loaderReducer,
  },
});

const renderLoader = () => {
  render(
    <Provider store={store}>
      <GlobalLoader />
    </Provider>,
  );
};

describe('Loader', () => {
  test('Loader appears and disappears', async () => {
    renderLoader();

    expect(screen.queryByTestId('global-loader')).not.toBeInTheDocument();

    await act(async () => {
      store.dispatch(showLoader());
    });

    const loader = await screen.findByTestId('global-loader');
    expect(loader).toBeInTheDocument();

    await act(async () => {
      store.dispatch(closeLoader());
    });

    await waitFor(() => {
      expect(screen.queryByTestId('global-loader')).not.toBeInTheDocument();
    });
  });
});
