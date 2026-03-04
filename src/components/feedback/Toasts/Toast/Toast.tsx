import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearSuccess } from '@store/UI/toastSlice';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import styles from './Toast.module.scss';

interface ToastProps {
  id: string;
  message: string;
}

const Toast = ({ id, message }: ToastProps) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => dispatch(clearSuccess(id)), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
      <div>
        <FaCheckCircle className={styles.toast__icon} />
      </div>

      <p className={styles.toast__text}>{message}</p>

      <button className={styles.toast__xmark} onClick={() => dispatch(clearSuccess(id))}>
        <FaCircleXmark />
      </button>
    </div>
  );
};

export default Toast;
