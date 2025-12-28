import React, { useState } from 'react'
import * as styles from './TaskMobile.module.scss'
import { calendar, trash } from '@assets'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice'
import { showError } from '@store/errorSlice'
import { ErrorModal } from '@components'

const TaskMobile = ({ task }) => {
  const [fetchError, setFetchError] = useState('')
  const displayDate = task.deadline.split('T')[0]
  const taskId = task._id
  const dispatch = useDispatch()
  const isCompleted = task.status === 'Done'

  const deleteTaskHandler = async () => {
    const deleted = task

    dispatch(deleteTasks(taskId))

    const res = await TaskService.deleteTasks(taskId)

    if (!res.success) {
      dispatch(restoreTask(deleted))
      dispatch(showError(res.error))
    }
  }

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

  return (
    <div className={`${styles.taskMobile} ${isCompleted ? styles.done : ''}`}>
      <header className={styles.taskMobile__header}>
        <div className={styles.taskMobile__category}>
          <p className={styles.taskMobile__categoryText}>{task.category}</p>
        </div>

        <input
          className={styles.taskMobile__checkbox}
          type="checkbox"
          checked={task.status === 'Done'}
          onChange={completeHandler}
        />
      </header>

      <div className={styles.taskMobile__body}>
        <h5 className={styles.taskMobile__name}>{task.task}</h5>

        <div className={styles.taskMobile__deadline}>
          <img className={styles.taskMobile__deadlineIcon} src={calendar} alt="deadline" />
          <p className={styles.taskMobile__deadlineText}>{displayDate}</p>
        </div>
      </div>

      <footer className={styles.taskMobile__footer}>
        <div className={styles.taskMobile__status}>
          <p className={styles.taskMobile__statusText}>{task.status}</p>
        </div>

        <div className={styles.taskMobile__actions}>
          <p className={styles.taskMobile__remaining}>Remaining: {task.remainingTime}h</p>

          <button className={styles.taskMobile__deleteBtn} onClick={deleteTaskHandler}>
            <img className={styles.taskMobile__deleteIcon} src={trash} alt="delete" />
          </button>
        </div>
      </footer>

      {fetchError && <ErrorModal error={fetchError} onClick={() => setFetchError('')} />}
    </div>
  )
}

export default TaskMobile
