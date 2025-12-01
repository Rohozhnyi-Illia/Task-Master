import React, { useState } from 'react'
import { trash } from '@assets'
import * as styles from './Task.module.scss'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice'
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

    dispatch(updateStatus({ id: taskId, status: newStatus }))

    try {
      await TaskService.updateStatus(taskId, newStatus)
    } catch (error) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      setFetchError(error?.response?.data?.error || error?.message || 'Error updating task')
    }
  }

  const deleteTaskHandler = async () => {
    setFetchError('')

    const deleted = task

    dispatch(deleteTasks(taskId))

    try {
      const res = await TaskService.deleteTasks(taskId)

      if (!res.success) {
        dispatch(restoreTask(deleted))
        setFetchError(res.error)
      }
    } catch (error) {
      dispatch(restoreTask(deleted))
      setFetchError(error?.response?.data?.error || error?.message || 'Error deleting task')
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
