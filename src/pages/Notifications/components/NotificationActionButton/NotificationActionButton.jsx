import React from 'react'
import { FaTrash } from 'react-icons/fa'
import * as styles from './NotificationActionButton.module.scss'

const NotificationActionButton = ({ text, onClick }) => (
  <button className={styles.notifications__button} onClick={onClick}>
    <p>{text}</p>
    <FaTrash />
  </button>
)

export default NotificationActionButton
