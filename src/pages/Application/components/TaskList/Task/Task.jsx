import React from 'react'
import { trash } from '@assets'
import * as styles from './Task.module.scss'

const Task = ({ task }) => {
  return (
    <tr className={styles.task}>
      <td>
        <input type="checkbox" checked={task.completed} onChange={() => {}} />
      </td>

      <td>
        <div className={styles.task__textCell}>{task.name}</div>
      </td>

      <td>{task.status}</td>
      <td>{task.category}</td>

      <td>
        <span>{task.deadline}</span>
      </td>

      <td>{task.remaining}h</td>

      <td>
        <button className={styles.deleteBtn}>
          <img src={trash} alt="delete" />
        </button>
      </td>
    </tr>
  )
}

export default Task
