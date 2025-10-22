import React, { useState } from 'react'
import { trash } from '@assets'
import * as styles from './Task.module.scss'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus } from '@store/tasksSlice'
import { ErrorModal } from '@components'

const Task = ({ task }) => {
  const [fetchError, setFetchError] = useState('')
  const displayDate = task.deadline.split('T')[0]
  const taskId = task._id
  const dispatch = useDispatch()
  const isCompleted = task.status === 'Done'

  const completeHandler = async () => {
    setFetchError('')
    const newStatus = task.status === 'Done' ? 'Active' : 'Done'
    const prevStatus = task.status

    dispatch(updateStatus({ id: task._id, status: newStatus }))

    try {
      await TaskService.updateStatus(task._id, newStatus)
    } catch (error) {
      dispatch(updateStatus({ id: task._id, status: prevStatus }))
      setFetchError(error.message || 'Error updating task')
    }
  }

  const deleteTaskHandler = async () => {
    setFetchError('')

    try {
      const res = await TaskService.deleteTasks(taskId)

      if (!res.success) {
        setFetchError(res.error)
        return
      }

      dispatch(deleteTasks(taskId))
    } catch (error) {
      setFetchError(error.message || 'Error deleting task')
    }
  }

  return (
    <>
      <tr className={isCompleted ? `${styles.task} ${styles.done}` : styles.task}>
        <td>
          <input type="checkbox" checked={task.status === 'Done'} onChange={completeHandler} />
        </td>

        <td>
          <div className={styles.task__textCell}>{task.task}</div>
        </td>

        <td>{task.status}</td>
        <td>{task.category}</td>

        <td>
          <span>{displayDate}</span>
        </td>

        <td>{task.remainingTime}h</td>

        <td>
          <button className={styles.deleteBtn} onClick={deleteTaskHandler}>
            <img src={trash} alt="delete" />
          </button>
        </td>
      </tr>

      {fetchError && <ErrorModal error={fetchError} onClick={() => setFetchError('')} />}
    </>
  )
}

export default Task
