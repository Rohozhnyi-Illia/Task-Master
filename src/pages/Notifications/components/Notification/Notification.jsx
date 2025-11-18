import React, { useState } from 'react'
import * as styles from './Notification.module.scss'
import { FaCheckCircle } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa'
import firstLetterToUpperCase from '@utils/helpers/firstLetterToUpperCase'
import NotificationService from '@services/notificationService'
import { readNotification, deleteNotification } from '@store/notificationSlice'
import { useDispatch } from 'react-redux'
import { ErrorModal } from '@components'

const Notification = ({ type, id, message, isRead }) => {
  const [fetchError, setFetchError] = useState('')
  const dispatch = useDispatch('')

  const getModifier = (type) => {
    if (type === 'warning') return 'warning'
    if (type === 'overdue') return 'overdue'
    return 'reminder'
  }

  const readHandler = async () => {
    try {
      const res = await NotificationService.markAsRead(id)

      if (!res.success) {
        setFetchError(res.error)
        return
      }

      dispatch(readNotification(res.data._id))
    } catch (error) {
      setFetchError(error)
    }
  }

  const deleteHandler = async () => {
    try {
      const res = await NotificationService.deleteNotification(id)

      if (!res.success) {
        setFetchError(res.error)
        return
      }

      console.log(res.data)

      dispatch(deleteNotification(id))
    } catch (error) {
      setFetchError(error)
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
