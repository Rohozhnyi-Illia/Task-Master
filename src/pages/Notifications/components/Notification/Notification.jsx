import React from 'react'
import * as styles from './Notification.module.scss'
import { FaCheck, FaTrash, FaExclamationCircle, FaClock, FaBell } from 'react-icons/fa'
import firstLetterToUpperCase from '@utils/helpers/firstLetterToUpperCase'
import NotificationService from '@services/notificationService'
import {
  readNotification,
  deleteNotification,
  restoreNotification,
} from '@store/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { showError } from '@store/errorSlice'

const typeIcon = {
  overdue: <FaExclamationCircle />,
  warning: <FaClock />,
  reminder: <FaBell />,
}

const Notification = ({ type, id, message }) => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification.find((n) => n._id === id))
  const isRead = notification?.isRead

  const readHandler = async () => {
    dispatch(readNotification({ id, markAsRead: true }))
    try {
      const res = await NotificationService.markAsRead(id)
      if (!res.success) throw new Error(res.error)
    } catch (error) {
      dispatch(readNotification({ id, markAsRead: false }))
      dispatch(showError(error.message))
    }
  }

  const deleteHandler = async () => {
    const backup = notification
    dispatch(deleteNotification(id))
    try {
      const res = await NotificationService.deleteNotification(id)
      if (!res.success) throw new Error(res.error)
    } catch (error) {
      dispatch(restoreNotification(backup))
      dispatch(showError(error.message))
    }
  }

  const highlightTask = (message) => {
    const parts = message.split(/(".*?")/)
    return parts.map((part, index) =>
      part.startsWith('"') && part.endsWith('"') ? (
        <span key={index} className={styles.task}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${
        isRead ? styles.read : styles.unread
      }`}
      onClick={!isRead ? readHandler : undefined}
    >
      <div className={styles.icon}>{typeIcon[type]}</div>

      <div className={styles.content}>
        <span className={styles.label}>{firstLetterToUpperCase(type)}</span>
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
  )
}

export default Notification
