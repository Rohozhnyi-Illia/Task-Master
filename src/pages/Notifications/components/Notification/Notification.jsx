import React from 'react'
import * as styles from './Notification.module.scss'
import { FaCheckCircle, FaTrash } from 'react-icons/fa'
import firstLetterToUpperCase from '@utils/helpers/firstLetterToUpperCase'
import NotificationService from '@services/notificationService'
import {
  readNotification,
  deleteNotification,
  restoreNotification,
} from '@store/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { showError } from '@store/errorSlice'

const Notification = ({ type, id, message }) => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification.find((n) => n._id === id))
  const isRead = notification?.isRead

  const getModifier = (type) => {
    if (type === 'warning') return 'warning'
    if (type === 'overdue') return 'overdue'
    return 'reminder'
  }

  const readHandler = async () => {
    dispatch(readNotification({ id, markAsRead: true }))

    try {
      const res = await NotificationService.markAsRead(id)
      if (!res.success) {
        dispatch(readNotification({ id, markAsRead: false }))
        dispatch(showError(res.error))
      }
    } catch (error) {
      dispatch(readNotification({ id, markAsRead: false }))
      dispatch(showError(error.message || 'Something went wrong'))
    }
  }

  const deleteHandler = async () => {
    const notificationToDelete = notification

    dispatch(deleteNotification(id))

    try {
      const res = await NotificationService.deleteNotification(id)
      if (!res.success) {
        dispatch(restoreNotification(notificationToDelete))
        dispatch(showError(res.error))
      }
    } catch (error) {
      dispatch(restoreNotification(notificationToDelete))
      dispatch(showError(error.message || 'Something went wrong'))
    }
  }

  return (
    <div
      className={`${styles.notification} ${styles[getModifier(type)]} ${
        isRead ? styles.read : ''
      }`}
    >
      <div className={styles.notification__header}>
        <h4 className={styles.notification__title}>{firstLetterToUpperCase(type)}</h4>
        <div className={styles.notification__buttons}>
          {!isRead && (
            <button type="button" onClick={readHandler}>
              <FaCheckCircle />
              <p>Read</p>
            </button>
          )}
          <button type="button" onClick={deleteHandler}>
            <FaTrash />
            <p>Delete</p>
          </button>
        </div>
      </div>
      <p className={styles.notification__text}>{message}</p>
    </div>
  )
}

export default Notification
