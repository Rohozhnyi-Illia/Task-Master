import React from 'react'
import * as styles from './TaskMobile.module.scss'
import { calendar, trash } from '@assets'

const TaskMobile = ({ task }) => {
  return (
    <div className={styles.taskMobile}>
      <header className={styles.taskMobile__header}>
        <div className={styles.taskMobile__category}>
          <p className={styles.taskMobile__categoryText}>{task.category}</p>
        </div>

        <input
          className={styles.taskMobile__checkbox}
          type="checkbox"
          checked={task.completed}
          onChange={() => {}}
        />
      </header>

      <div className={styles.taskMobile__body}>
        <h5 className={styles.taskMobile__name}>{task.name}</h5>

        <div className={styles.taskMobile__deadline}>
          <img className={styles.taskMobile__deadlineIcon} src={calendar} alt="deadline" />
          <p className={styles.taskMobile__deadlineText}>{task.deadline}</p>
        </div>
      </div>

      <footer className={styles.taskMobile__footer}>
        <div className={styles.taskMobile__status}>
          <p className={styles.taskMobile__statusText}>{task.status}</p>
        </div>

        <div className={styles.taskMobile__actions}>
          <p className={styles.taskMobile__remaining}>Remaining: {task.remaining}h</p>

          <button className={styles.taskMobile__deleteBtn}>
            <img className={styles.taskMobile__deleteIcon} src={trash} alt="delete" />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default TaskMobile
