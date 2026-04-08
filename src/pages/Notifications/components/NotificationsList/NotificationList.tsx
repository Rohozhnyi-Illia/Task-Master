import React, { useEffect, useState } from 'react';
import styles from './NotificationList.module.scss';
import Notification from '../Notification/Notification';
import { useSelector } from 'react-redux';
import { Pagination, NoData } from '@components/index';
import { NotificationFilterType } from '../../../../types/notification';
import { RootState } from '@store/store';
import { Notification as NotificationType } from '../../../../types/notification';

interface NotificationListProps {
  selected: NotificationFilterType;
}

const NotificationList = ({ selected }: NotificationListProps) => {
  const notifications: NotificationType[] = useSelector((state: RootState) => state.notification);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const notificationsPerPage = 5;

  const filteredNotifications = notifications.filter((notification) => {
    if (!selected || selected === 'All') return true;
    return notification.type.toLowerCase() === selected.toLowerCase();
  });

  const totalPages: number = Math.ceil(filteredNotifications.length / notificationsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredNotifications, currentPage, totalPages]);

  const indexOfLastNotification: number = currentPage * notificationsPerPage;
  const indexOfFirstTask: number = indexOfLastNotification - notificationsPerPage;
  const currentNotifications: NotificationType[] = filteredNotifications.slice(
    indexOfFirstTask,
    indexOfLastNotification,
  );

  const pageNumbers: number[] = [currentPage, currentPage + 1].filter((page) => page <= totalPages);

  return (
    <div className={styles.notificationList} data-testid="notification-list">
      <div className={styles.notificationWrapper}>
        {filteredNotifications.length > 0 ? (
          currentNotifications.map((notification) => (
            <Notification
              key={notification._id}
              id={notification._id}
              type={notification.type}
              message={notification.message}
              isRead={notification.isRead}
            />
          ))
        ) : (
          <NoData text="Nothing to see here… yet!" />
        )}

        {filteredNotifications.length > notificationsPerPage && (
          <Pagination
            pageNumbers={pageNumbers}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationList;
