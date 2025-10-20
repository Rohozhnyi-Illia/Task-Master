import React from 'react'
import * as styles from './AddButton.module.scss'
import { addTask } from '@assets'

const AddButton = ({ className, type = 'button', ...props }) => {
  return (
    <button type={type} className={`${styles.addButton} ${className || ''}`} {...props}>
      New Task
      <img src={addTask} alt="add task" className={styles.addButton__icon} />
    </button>
  )
}

export default AddButton
