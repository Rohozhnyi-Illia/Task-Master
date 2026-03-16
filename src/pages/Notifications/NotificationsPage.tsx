import React, { useState } from 'react';
import styles from './NotificationsPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { CategorySelect } from '@components/index';
import NotificationList from './components/NotificationsList/NotificationList';
import NotificationService from '@services/notificationService';
import { showError } from '@store/UI/errorSlice';
import {
  deleteReadNotifications,
  getNotifications,
  deleteAllNotifications,
} from '@store/notificationSlice';
import { showSuccess } from '@store/UI/toastSlice';
import NotificationActionButton from './components/NotificationActionButton/NotificationActionButton';
import { RootState } from '@store/store';
import { Notification, NotificationFilterType } from '../../types/notification';
import { GreetingBadge } from '@components/index';

const NotificationsPage = () => {
  const [selected, setSelected] = useState<NotificationFilterType | undefined>(undefined);
  const name: string = useSelector((state: RootState) => state.auth.name);
  const notifications: Notification[] = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();

  const deleteReadHandler = async () => {
    const readNotifications = notifications.filter((notification) => notification.isRead);

    if (readNotifications.length === 0) {
      dispatch(showError('No read notifications to delete'));
      return;
    }

    const oldNotifications = [...notifications];
    dispatch(deleteReadNotifications());

    const res = await NotificationService.deleteReadNotifications();

    if (res.success) {
      dispatch(
        showSuccess(
          `${res.data.deletedCount} ${res.data.deletedCount > 1 ? 'Notifications' : 'Notification'} deleted`,
        ),
      );
    } else {
      dispatch(getNotifications(oldNotifications));
      dispatch(showError(res.error));
    }
  };

  const deleteAllHandler = async () => {
    if (notifications.length === 0) {
      dispatch(showError('No notifications to delete'));
      return;
    }

    const oldNotifications = [...notifications];
    dispatch(deleteAllNotifications());

    const res = await NotificationService.deleteAllNotifications();

    if (res.success) {
      dispatch(
        showSuccess(
          `${res.data.deletedCount} ${res.data.deletedCount > 1 ? 'Notifications' : 'Notification'} deleted`,
        ),
      );
    } else {
      dispatch(getNotifications(oldNotifications));
      dispatch(showError(res.error));
    }
  };

  return (
    <div className={styles.notifications}>
      <div className="container">
        <div className={styles.notifications__wrapper}>
          <GreetingBadge name={name} />

          {notifications.length > 0 && (
            <div className={styles.notifications__controls}>
              <div className={styles.notifications__controlsWrapper}>
                <div className={styles.notifications__category}>
                  <CategorySelect<NotificationFilterType>
                    options={['All', 'Warning', 'Reminder', 'Overdue']}
                    selected={selected}
                    onChange={(val) => setSelected(val)}
                    label="Select a category"
                  />
                </div>

                <div className={styles.notifications__buttons}>
                  <NotificationActionButton text="Delete Read" onClick={deleteReadHandler} />
                  <NotificationActionButton text="Delete All" onClick={deleteAllHandler} />
                </div>
              </div>
            </div>
          )}

          <NotificationList selected={selected} />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
