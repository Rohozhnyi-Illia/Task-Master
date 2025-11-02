import React, { useState } from 'react'
import * as styles from './NotificationsPage.module.scss'
import { useSelector } from 'react-redux'
import CategorySelect from '../Application/components/CategorySelect/CategorySelect'
import NotificationList from './components/NotificationsList/NotificationList'

const NotificationsPage = () => {
  const [selected, setSelected] = useState('')
  const name = useSelector((state) => state.auth.name)
  const notifications = useSelector((state) => state.notification)

  return (
    <div className={styles.notifications}>
      <div className="container">
        <div className={styles.notifications__wrapper}>
          <h2 className={styles.notifications__title}>Hello, {name}</h2>
          <h4 className={styles.notifications__subtitle}>Check your notifications.</h4>

          {notifications.length > 0 && (
            <div className={styles.notifications__category}>
              <CategorySelect
                options={['All', 'Warning', 'Reminder', 'Overdue']}
                onChange={(val) => setSelected(val)}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          )}

          <NotificationList selected={selected} />
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
