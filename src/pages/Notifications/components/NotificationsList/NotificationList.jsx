import React from 'react'
import * as styles from './NotificationList.module.scss'
import Notification from '../Notification/Notification'
import { useSelector } from 'react-redux'
import noData from '../../../../assets/images/noData.svg'

const NotificationList = ({ selected }) => {
  const notifications = useSelector((state) => state.notification)
  const filtredNotifications =
    !selected || selected === 'All'
      ? notifications
      : notifications.filter((notification) => notification.type === selected.toLowerCase())

  const isEmpty = filtredNotifications.length === 0

  return (
    <div className={styles.notificationList}>
      {isEmpty ? (
        <div className={styles.notificationList__empty}>
          <img src={noData} alt="no data" />
          <h2>No Notifications Yet.</h2>
        </div>
      ) : (
        <div className={styles.notificationWrapper}>
          {filtredNotifications.map((notification) => (
            <Notification
              key={notification._id}
              id={notification._id}
              type={notification.type}
              message={notification.message}
              isRead={notification.isRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationList
