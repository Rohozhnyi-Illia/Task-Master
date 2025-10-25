import React, { useState } from 'react'
import * as styles from './Notification.module.scss'
import { FaTrash, FaCheckCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { readNotification, deleteNotification } from '@store/notificationSlice'
import NotificationService from '@services/notificationService'
import { ErrorModal } from '@components'

const Notification = ({ notification, id, isRead }) => {
  const [fetchError, setFetchError] = useState('')
  const dispatch = useDispatch()
  const notificationId = id

  const deleteHandler = async () => {
    setFetchError('')

    try {
      const res = await NotificationService.deleteNotification(notificationId)

      if (!res.success) {
        return setFetchError(res.error)
      }

      dispatch(deleteNotification(res.data.data._id))
    } catch (error) {
      setFetchError(error.message)
    }
  }

  const readHandler = async () => {
    setFetchError('')

    try {
      const res = await NotificationService.markAsRead(notificationId)

      if (!res.success) {
        return setFetchError(res.error)
      }

      dispatch(readNotification(res.data._id))
    } catch (error) {
      setFetchError(error.message)
    }
  }

  return (
    <div className={`${styles.notification} ${isRead ? styles.read : ''}`}>
      {!isRead && (
        <button className={styles.notification__complete} onClick={readHandler}>
          <FaCheckCircle />
        </button>
      )}

      <button className={styles.notification__delete} onClick={deleteHandler}>
        <FaTrash />
      </button>

      <p className={styles.notification__text}>{notification}</p>

      {fetchError && <ErrorModal error={fetchError} onClick={() => setFetchError('')} />}
    </div>
  )
}

export default Notification
