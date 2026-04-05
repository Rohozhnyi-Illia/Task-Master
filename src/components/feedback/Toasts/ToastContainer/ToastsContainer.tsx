import React from 'react';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import styles from './ToastsContainer.module.scss';
import Toast from '../Toast/Toast';
import { RootState } from '@store/store';
import { ToastItem } from '@store/UI/toastSlice';

const ToastsContainer = () => {
  const toasts: ToastItem[] = useSelector((state: RootState) => state.success.items);

  if (!toasts.length) return null;

  return ReactDOM.createPortal(
    <div className={styles.toasts__container} data-testid="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body,
  );
};

export default ToastsContainer;
