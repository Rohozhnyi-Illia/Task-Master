import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import './styles/main.scss';
import App from './App';

const getRootElement = (): HTMLElement => {
  const element = document.getElementById('root');

  if (!element) throw new Error('Root element with id "root" not found');
  return element;
};

const root = ReactDOM.createRoot(getRootElement());

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
);
