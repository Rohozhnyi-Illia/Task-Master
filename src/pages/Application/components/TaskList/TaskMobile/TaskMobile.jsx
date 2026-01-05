import React, { useState, useRef, useEffect } from 'react'
import * as styles from './TaskMobile.module.scss'
import { calendar, trash } from '@assets'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice'
import { showError } from '@store/errorSlice'
import { FaAngleDown } from 'react-icons/fa6'

const STATUS_OPTIONS = ['Active', 'InProgress', 'Done', 'Archived']

const TaskMobile = ({ task }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false)

  const statusRef = useRef(null)
  const deleteRef = useRef(null)

  const displayDate = task.deadline.split('T')[0]
  const taskId = task._id
  const dispatch = useDispatch()
  const isCompleted = task.status === 'Done'

  useEffect(() => {
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
      if (deleteRef.current && !deleteRef.current.contains(e.target)) {
        setIsDeleteMenuOpen(false)
      }
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const changeStatusHandler = async (status) => {
    const prevStatus = task.status

    dispatch(updateStatus({ id: taskId, status }))

    const res = await TaskService.updateStatus(taskId, status)
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    }

    setIsDropdownOpen(false)
  }

  const deleteTaskHandler = async () => {
    const deleted = task
    dispatch(deleteTasks(taskId))
    setIsDeleteMenuOpen(false)

    const res = await TaskService.deleteTasks(taskId)
    if (!res.success) {
      dispatch(restoreTask(deleted))
      dispatch(showError(res.error))
    }
  }

  const completeHandler = async () => {
    const prevStatus = task.status
    const newStatus = isCompleted ? 'Active' : 'Done'
    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    }
  }

  return (
    <div className={`${styles.taskMobile} ${styles[task.status.toLowerCase()]}`}>
      <header className={styles.taskMobile__header}>
        <div className={styles.taskMobile__category}>
          <p className={styles.taskMobile__categoryText}>{task.category}</p>
        </div>

        <input
          className={styles.taskMobile__checkbox}
          type="checkbox"
          checked={isCompleted}
          onChange={completeHandler}
        />
      </header>

      <div className={styles.taskMobile__body}>
        <h5 className={styles.taskMobile__name}>{task.task}</h5>

        <div className={styles.taskMobile__deadline}>
          <img src={calendar} alt="" />
          <p className={styles.taskMobile__deadlineText}>{displayDate}</p>
        </div>
      </div>

      <footer className={styles.taskMobile__footer}>
        <div
          ref={statusRef}
          className={`${styles.taskMobile__status} ${isDropdownOpen ? styles.open : ''}`}
          onClick={() => {
            setIsDropdownOpen((p) => !p)
            setIsDeleteMenuOpen(false)
          }}
        >
          <p className={styles.taskMobile__statusText}>{task.status}</p>
          <FaAngleDown />

          {isDropdownOpen && (
            <ul className={styles.taskMobile__statusList}>
              {STATUS_OPTIONS.map((status) => (
                <li key={status} onClick={() => changeStatusHandler(status)}>
                  {status}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={deleteRef} className={styles.taskMobile__actions}>
          <p className={styles.taskMobile__remaining}>
            Remaining:{' '}
            <span className={styles.taskMobile__remainingHighlight}>
              {task.remainingTime === 0 ? 'None' : `${task.remainingTime}h`}
            </span>
          </p>

          <button
            className={styles.taskMobile__deleteBtn}
            onClick={() => {
              setIsDeleteMenuOpen((prev) => !prev)
              setIsDropdownOpen(false)
            }}
          >
            <img src={trash} alt="delete" />
          </button>

          {isDeleteMenuOpen && (
            <div className={styles.taskMobile__deleteMenu}>
              <p>Delete task?</p>
              <div>
                <button onClick={deleteTaskHandler}>Yes</button>
                <button onClick={() => setIsDeleteMenuOpen(false)}>No</button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

export default TaskMobile
