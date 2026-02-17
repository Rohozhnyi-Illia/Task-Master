import React, { useEffect, useState } from 'react'
import * as styles from './NotificationList.module.scss'
import Notification from '../Notification/Notification'
import { useSelector } from 'react-redux'
import { Pagination, NoData } from '@components'

const NotificationList = ({ selected }) => {
  const notifications = useSelector((state) => state.notification)
  const [currentPage, setCurrentPage] = useState(1)
  const notificationsPerPage = 5

  const filteredNotifications = notifications.filter((notification) => {
    if (!selected || selected === 'All') return true
    return notification.type.toLowerCase() === selected.toLowerCase()
  })

  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage)

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredNotifications, currentPage, totalPages])

  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstTask = indexOfLastNotification - notificationsPerPage
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstTask,
    indexOfLastNotification,
  )

  const pageNumbers = [currentPage, currentPage + 1].filter((page) => page <= totalPages)

  return (
    <div className={styles.notificationList}>
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
  )
}

export default NotificationList
