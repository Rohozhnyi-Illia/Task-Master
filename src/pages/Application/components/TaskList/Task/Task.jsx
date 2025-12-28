import React from 'react'
import { trash } from '@assets'
import * as styles from './Task.module.scss'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice'
import { showError } from '@store/errorSlice'
import { FaAngleDown } from 'react-icons/fa6'

const Task = ({ task }) => {
  const displayDate = task.deadline.split('T')[0]
  const taskId = task._id
  const dispatch = useDispatch()
  const isCompleted = task.status === 'Done'

  const completeHandler = async () => {
    const prevStatus = task.status
    const newStatus = task.status === 'Done' ? 'Active' : 'Done'

    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)

    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    }
  }

  const deleteTaskHandler = async () => {
    const deleted = task

    dispatch(deleteTasks(taskId))

    const res = await TaskService.deleteTasks(taskId)

    if (!res.success) {
      dispatch(restoreTask(deleted))
      dispatch(showError(res.error))
    }
  }

  return (
    <tr className={isCompleted ? `${styles.task} ${styles.done}` : styles.task}>
      <td>
        <input type="checkbox" checked={isCompleted} onChange={completeHandler} />
      </td>

      <td>
        <div className={styles.task__textCell}>{task.task}</div>
      </td>

      <td>
        <div className={styles.task__statusWrapper}>
          {task.status}
          <FaAngleDown />
        </div>
      </td>
      <td>{task.category}</td>

      <td>
        <span>{displayDate}</span>
      </td>

      <td>{task.remainingTime === 0 ? 'None' : task.remainingTime + 'h'}</td>

      <td>
        <button className={styles.deleteBtn} onClick={deleteTaskHandler}>
          <img src={trash} alt="delete" />
        </button>
      </td>
    </tr>
  )
}

export default Task
