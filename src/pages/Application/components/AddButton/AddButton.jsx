import React from 'react'
import * as styles from './AddButton.module.scss'
import { addTask } from '@assets'

const AddButton = React.forwardRef(({ className, type = 'button', ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`${styles.addButton} ${className || ''}`}
      {...props}
    >
      New Task
      <img src={addTask} alt="add task" className={styles.addButton__icon} />
    </button>
  )
})

export default AddButton
