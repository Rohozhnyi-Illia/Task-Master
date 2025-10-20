import React from 'react'
import * as styles from './Notification.module.scss'

const Notification = ({ notification }) => {
  return (
    <div className={styles.notification}>
      <div className={styles.notification__item}></div>
      <p className={styles.notification__text}>{notification}</p>
    </div>
  )
}

export default Notification
