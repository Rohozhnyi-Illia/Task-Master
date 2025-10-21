import React, { useState } from 'react'
import * as styles from './TaskMobile.module.scss'
import { calendar, trash } from '@assets'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus } from '@store/tasksSlice'
import { ErrorModal } from '@components'

const TaskMobile = ({ task }) => {
  const [fetchError, setFetchError] = useState('')
  const displayDate = task.deadline.split('T')[0]
  const taskId = task._id
  const dispatch = useDispatch()
  const isCompleted = task.status === 'Done'

  const deleteTaskHandler = async () => {
    setFetchError('')

    try {
      console.log('🗑️ Deleting task:', taskId)
      const res = await TaskService.deleteTasks(taskId)
      console.log('✅ Server delete response:', res)

      dispatch(deleteTasks(taskId))
    } catch (error) {
      console.error('❌ Delete error:', error)
      setFetchError(error.message || 'Error deleting task')
    }
  }

  const completeHandler = async () => {
    setFetchError('')
    const newStatus = task.status === 'Done' ? 'Active' : 'Done'
    const prevStatus = task.status

    dispatch(updateStatus({ id: task._id, status: newStatus }))

    try {
      await TaskService.updateStatus(task._id, newStatus)
      console.log('✅ Server update response: task status updated to', newStatus)
    } catch (error) {
      dispatch(updateStatus({ id: task._id, status: prevStatus }))
      console.error('❌ Complete error:', error)
      setFetchError(error.message || 'Error updating task')
    }
  }

  return (
    <div className={isCompleted ? `${styles.taskMobile} ${styles.done}` : styles.taskMobile}>
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
