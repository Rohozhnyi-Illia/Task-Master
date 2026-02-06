import React, { useState } from 'react'
import * as styles from './NotificationsPage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import CategorySelect from '../Application/components/CategorySelect/CategorySelect'
import NotificationList from './components/NotificationsList/NotificationList'
import { FaTrash } from 'react-icons/fa'
import NotificationService from '@services/notificationService'
import { showError } from '@store/errorSlice'
import {
  deleteReadNotifications,
  getNotifications,
  deleteAllNotifications,
} from '@store/notificationSlice'
import { showSuccess } from '@store/successSlice'

const NotificationsPage = () => {
  const [selected, setSelected] = useState('')
  const name = useSelector((state) => state.auth.name)
  const notifications = useSelector((state) => state.notification)
  const dispatch = useDispatch()

  const deleteReadHandler = async () => {
    const readNotifications = notifications.filter((notification) => notification.isRead)

    if (readNotifications.length === 0) {
      dispatch(showError('No read notifications to delete'))
      return
    }

    const oldNotifications = [...notifications]
    dispatch(deleteReadNotifications())

    const { success, data, error } = await NotificationService.deleteReadNotifications()

    if (!success) {
      dispatch(getNotifications(oldNotifications))
      dispatch(showError(error))
    } else {
      dispatch(showSuccess(`${data.deletedCount} notifications deleted`))
    }
  }

  const deleteAllHandler = async () => {
    if (notifications.length === 0) {
      dispatch(showError('No notifications to delete'))
      return
    }

    const oldNotifications = [...notifications]
    dispatch(deleteAllNotifications())

    const { success, data, error } = await NotificationService.deleteAllNotifications()

    if (!success) {
      dispatch(getNotifications(oldNotifications))
      dispatch(showError(error))
    } else {
      dispatch(showSuccess(`${data.deletedCount} notifications deleted`))
    }
  }

  return (
    <div className={styles.notifications}>
      <div className="container">
        <div className={styles.notifications__wrapper}>
          <h2 className={styles.notifications__title}>Hello, {name}</h2>
          <h4 className={styles.notifications__subtitle}>Check your notifications.</h4>

          {notifications.length > 0 && (
            <div className={styles.notifications__controls}>
              <div className={styles.notifications__category}>
                <CategorySelect
                  options={['All', 'Warning', 'Reminder', 'Overdue']}
                  onChange={(val) => setSelected(val)}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>

              <div className={styles.notifications__buttons}>
                <button onClick={deleteReadHandler}>
                  <p>Delete Read</p>
                  <FaTrash />
                </button>
                <button onClick={deleteAllHandler}>
                  <p>Delete All</p>
                  <FaTrash />
                </button>
              </div>
            </div>
          )}

          <NotificationList selected={selected} />
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
