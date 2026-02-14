import React, { useState, useRef, useEffect } from 'react'
import * as styles from './TaskMobile.module.scss'
import { calendar, trash } from '@assets'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice'
import { showError } from '@store/UI/errorSlice'
import { showSuccess } from '@store/UI/toastSlice'
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
      if (statusRef.current && !statusRef.current.contains(e.target)) setIsDropdownOpen(false)
      if (deleteRef.current && !deleteRef.current.contains(e.target))
        setIsDeleteMenuOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const completeHandler = async () => {
    const prevStatus = task.status
    const newStatus = isCompleted ? 'Active' : 'Done'
    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    } else {
      dispatch(showSuccess(isCompleted ? 'Task is active again' : 'Task completed'))
    }
  }

  const changeStatusHandler = async (status) => {
    if (status === task.status) return dispatch(showError('Status is already active'))
    if (status === 'Done') {
      await completeHandler()
      setIsDropdownOpen(false)
      return
    }

    const prevStatus = task.status
    dispatch(updateStatus({ id: taskId, status }))
    const res = await TaskService.updateStatus(taskId, status)
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    } else {
      dispatch(showSuccess('Status updated'))
      setIsDropdownOpen(false)
    }
  }

  const deleteTaskHandler = async () => {
    const deleted = task
    dispatch(deleteTasks(taskId))
    setIsDeleteMenuOpen(false)

    const res = await TaskService.deleteTasks(taskId)
    if (!res.success) {
      dispatch(restoreTask(deleted))
      dispatch(showError(res.error))
    } else dispatch(showSuccess('Task deleted'))
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return styles.done
      case 'inprogress':
        return styles.inprogress
      case 'archived':
        return styles.archived
      default:
        return ''
    }
  }

  return (
    <div className={`${styles.taskMobile} ${getStatusClass(task.status)}`}>
      <div className={styles.taskMobile__header}>
        <div className={styles.taskMobile__category}>{task.category}</div>
        <input type="checkbox" checked={isCompleted} onChange={completeHandler} />
      </div>

      <div className={styles.taskMobile__body}>
        <h4 className={styles.taskMobile__title}>{task.task}</h4>

        <div className={styles.taskMobile__meta}>
          <span>
            <img src={calendar} alt="" />
            <p>{displayDate}</p>
          </span>

          <span>
            Remaining: {task.remainingTime === 0 ? 'None' : `${task.remainingTime}h`}
          </span>
        </div>
      </div>

      <div className={styles.taskMobile__footer}>
        <div
          ref={statusRef}
          className={`${styles.taskMobile__status} ${isDropdownOpen ? styles.open : ''}`}
          onClick={() => {
            setIsDropdownOpen((p) => !p)
            setIsDeleteMenuOpen(false)
          }}
        >
          <div className={styles.taskMobile__trigger}>
            <p>{task.status}</p>
            <FaAngleDown />
          </div>

          {isDropdownOpen && (
            <ul className={styles.taskMobile__statusList}>
              {STATUS_OPTIONS.map((s) => (
                <li key={s} onClick={() => changeStatusHandler(s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={deleteRef} className={styles.taskMobile__actions}>
          <button
            className={styles.taskMobile__deleteButton}
            onClick={() => setIsDeleteMenuOpen((prev) => !prev)}
          >
            <img src={trash} alt="" />
          </button>

          <div
            className={`${styles.taskMobile__deleteMenu} ${
              isDeleteMenuOpen ? styles.taskMobile__deleteMenu_open : ''
            }`}
          >
            <p>Delete task?</p>
            <div>
              <button onClick={deleteTaskHandler} className={styles.deleteButton}>
                Yes
              </button>
              <button onClick={() => setIsDeleteMenuOpen(false)}>No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskMobile
