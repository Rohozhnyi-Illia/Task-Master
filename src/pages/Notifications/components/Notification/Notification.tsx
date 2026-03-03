import React from 'react';
import styles from './Notification.module.scss';
import { FaCheck, FaTrash, FaExclamationCircle, FaClock, FaBell } from 'react-icons/fa';
import capitalize from '@utils/helpers/capitalize';
import NotificationService from '@services/notificationService';
import {
  readNotification,
  deleteNotification,
  restoreNotification,
} from '@store/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { showError } from '@store/UI/errorSlice';
import { showSuccess } from '@store/UI/toastSlice';
import { Notification as NotificationType } from '../../../../types/notification';
import { RootState } from '@store/store';

const typeIcon = {
  overdue: <FaExclamationCircle />,
  warning: <FaClock />,
  reminder: <FaBell />,
};

interface NotificationProps {
  type: NotificationType['type'];
  id: string;
  message: string;
  isRead: boolean;
}

const Notification = ({ type, id, message }: NotificationProps) => {
  const dispatch = useDispatch();
  const notification: NotificationType | undefined = useSelector((state: RootState) =>
    state.notification.find((n) => n._id === id),
  );
  const isRead = notification?.isRead;

  const readHandler = async () => {
    dispatch(readNotification({ id, markAsRead: true }));

    try {
      const res = await NotificationService.markAsRead(id);
      if (!res.success) dispatch(showError(res.error));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(readNotification({ id, markAsRead: false }));
        dispatch(showError(error.message));
      } else {
        dispatch(showError('Something wrong'));
      }
    }
  };

  const deleteHandler = async () => {
    const backup = notification;
    dispatch(deleteNotification(id));

    try {
      const res = await NotificationService.deleteNotification(id);
      if (!res.success) {
        dispatch(showError(res.error));
        return;
      }

      dispatch(showSuccess('Notification has been deleted'));
    } catch (error) {
      if (error instanceof Error) {
        if (backup) {
          dispatch(restoreNotification(backup));
        }
        dispatch(showError(error.message));
      } else {
        dispatch(showError('Something wrong'));
      }
    }
  };

  const highlightTask = (message: string) => {
    const parts = message.split(/(".*?")/);
    return parts.map((part, index) =>
      part.startsWith('"') && part.endsWith('"') ? (
        <span key={index} className={styles.task}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${isRead ? styles.read : styles.unread}`}
      onClick={!isRead ? readHandler : undefined}
    >
      <div className={styles.icon}>{typeIcon[type]}</div>

      <div className={styles.content}>
        <span className={styles.label}>{capitalize(type)}</span>
        <p className={styles.text}>{highlightTask(message)}</p>
      </div>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        {!isRead && (
          <button aria-label="Mark as read">
            <FaCheck />
          </button>
        )}
        <button onClick={deleteHandler} aria-label="Delete">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default Notification;
