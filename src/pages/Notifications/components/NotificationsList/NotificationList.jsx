import React from 'react'
import * as styles from './NotificationList.module.scss'
import Notification from '../Notification/Notification'
import { useSelector } from 'react-redux'
import noData from '../../../../assets/images/noData.svg'

const NotificationList = ({ selected }) => {
  const notifications = useSelector((state) => state.notification)
  const filteredNotifications = notifications.filter((notification) => {
    if (!selected || selected === 'All') return true
    return notification.type.toLowerCase() === selected.toLowerCase()
  })

  return (
    <div className={styles.notificationList}>
      <div className={styles.notificationWrapper}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Notification
              key={notification._id}
              id={notification._id}
              type={notification.type}
              message={notification.message}
              isRead={notification.isRead}
            />
          ))
        ) : (
          <div className={styles.notificationList__empty}>
            <img src={noData} alt="no data" />
            <h2>No Notifications Yet.</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationList
