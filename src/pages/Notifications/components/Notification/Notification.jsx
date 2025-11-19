import React, { useState } from 'react'
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
import { ErrorModal } from '@components'

const Notification = ({ type, id, message }) => {
  const [fetchError, setFetchError] = useState('')
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
        setFetchError(res.error)

        dispatch(readNotification({ id, markAsRead: false }))
      }
    } catch (error) {
      setFetchError(error)
      dispatch(readNotification({ id, markAsRead: false }))
    }
  }

  const deleteHandler = async () => {
    const notificationToDelete = notification

    dispatch(deleteNotification(id))

    try {
      const res = await NotificationService.deleteNotification(id)
      if (!res.success) {
        setFetchError(res.error)

        dispatch(restoreNotification(notificationToDelete))
      }
    } catch (error) {
      setFetchError(error)
      dispatch(restoreNotification(notificationToDelete))
    }
  }

  return (
    <>
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

      {fetchError && <ErrorModal error={fetchError} onClick={() => setFetchError('')} />}
    </>
  )
}

export default Notification
