import React, { useEffect, useState } from 'react'
import * as styles from './NotificationList.module.scss'
import Notification from '../Notification/Notification'
import { useSelector } from 'react-redux'
import { noData, back, next } from '@assets'

const NotificationList = ({ selected }) => {
  const notifications = useSelector((state) => state.notification)
  const [currentPage, setCurrentPage] = useState(1)
  const notificationsPerPage = 10

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

  const nextHandler = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const backHandler = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

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
          <div className={styles.notificationList__empty}>
            <img src={noData} alt="no data" />
            <h2>No Notifications Yet.</h2>
          </div>
        )}

        {filteredNotifications.length > notificationsPerPage && (
          <div className={styles.pagination}>
            <div className={styles.pagination__back}>
              <button onClick={backHandler} disabled={currentPage === 1}>
                <img src={back} alt="back" />
              </button>
            </div>

            <div className={styles.pagination__pages}>
              {pageNumbers.map((num) => (
                <div
                  key={num}
                  className={`${styles.pagination__pageNumber} ${
                    num === currentPage ? styles.active : ''
                  }`}
                  onClick={() => setCurrentPage(num)}
                >
                  <p>{num}</p>
                </div>
              ))}
            </div>

            <div className={styles.pagination__next}>
              <button onClick={nextHandler} disabled={currentPage >= totalPages}>
                <img src={next} alt="next" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationList
