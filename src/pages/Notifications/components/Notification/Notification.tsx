import React from 'react';
import styles from './Notification.module.scss';
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
import { circleInfo, clockInfo, bellInfo, trash, check } from '@assets/index';

const typeIcon = {
  overdue: circleInfo,
  warning: clockInfo,
  reminder: bellInfo,
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

    const res = await NotificationService.markAsRead(id);

    if (!res.success) {
      dispatch(readNotification({ id, markAsRead: false }));
      dispatch(showError(res.error));
      return;
    }

    dispatch(showSuccess('Notification read'));
  };

  const deleteHandler = async () => {
    const backup = notification;
    dispatch(deleteNotification(id));

    const res = await NotificationService.deleteNotification(id);

    if (!res.success) {
      if (backup) dispatch(restoreNotification(backup));
      dispatch(showError(res.error));
      return;
    }

    dispatch(showSuccess('Notification deleted'));
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
      data-testid="notification"
    >
      <div className={styles.icon}>
        <img src={typeIcon[type]} alt="" />
      </div>

      <div className={styles.content}>
        <span className={styles.label}>{capitalize(type)}</span>
        <p className={styles.text} data-testid="notification-text">
          {highlightTask(message)}
        </p>
      </div>

      <div className={styles.actions}>
        {!isRead && (
          <button aria-label="Mark as read" onClick={readHandler}>
            <img src={check} alt="" />
          </button>
        )}

        <button onClick={deleteHandler} aria-label="Delete">
          <img src={trash} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
