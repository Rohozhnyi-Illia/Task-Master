import React, { useEffect, useRef, useState } from 'react'
import { trash, calendar } from '@assets'
import * as styles from './Task.module.scss'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice'
import { showError } from '@store/errorSlice'
import { FaAngleDown } from 'react-icons/fa6'
import { createPortal } from 'react-dom'
import { showSuccess } from '../../../../../store/successSlice'

const STATUS_OPTIONS = ['Active', 'InProgress', 'Done', 'Archived']

const Task = ({ task }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false)
  const wrapperRef = useRef(null)
  const dropdownRef = useRef(null)
  const deleteWrapperRef = useRef(null)
  const deleteDropdownRef = useRef(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

  const displayDate = task.deadline.split('T')[0]
  const taskId = task._id
  const dispatch = useDispatch()
  const isCompleted = task.status === 'Done'

  const openDropdownHandler = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.top + window.scrollY - 144 - 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
    setIsDropdownOpen((prev) => !prev)
  }
  const closeDropdownHandler = () => setIsDropdownOpen(false)

  const completeHandler = async () => {
    const prevStatus = task.status
    const newStatus = isCompleted ? 'Active' : 'Done'
    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    }

    isCompleted
      ? dispatch(showSuccess('The task is active again'))
      : dispatch(showSuccess('Task completed'))
  }

  const changeStatusHandler = async (newStatus) => {
    const prevStatus = task.status

    if (newStatus === prevStatus) {
      closeDropdownHandler()
      dispatch(showError('You cannot change the status to current'))
      return
    }

    if (newStatus === 'Done') {
      closeDropdownHandler()
      completeHandler()
      return
    }

    closeDropdownHandler()
    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)

    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
    }

    dispatch(showSuccess('Status has been updated'))
  }

  const openDeleteMenu = () => setIsDeleteMenuOpen(true)
  const closeDeleteMenu = () => setIsDeleteMenuOpen(false)

  const confirmDeleteHandler = async () => {
    const deleted = task
    dispatch(deleteTasks(taskId))

    const res = await TaskService.deleteTasks(taskId)
    if (!res.success) {
      dispatch(restoreTask(deleted))
      dispatch(showError(res.error))
    }

    dispatch(showSuccess(`The task: "${task.task}" has been deleted`))
    closeDeleteMenu()
  }

  useEffect(() => {
    const clickOutsideHandler = (e) => {
      if (
        wrapperRef.current &&
        dropdownRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !dropdownRef.current.contains(e.target)
      ) {
        closeDropdownHandler()
      }
      if (
        deleteWrapperRef.current &&
        deleteDropdownRef.current &&
        !deleteWrapperRef.current.contains(e.target) &&
        !deleteDropdownRef.current.contains(e.target)
      ) {
        closeDeleteMenu()
      }
    }

    const keyDownHandler = (e) => {
      if (e.key === 'Escape') {
        closeDropdownHandler()
        closeDeleteMenu()
      }
    }

    document.addEventListener('mousedown', clickOutsideHandler)
    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('mousedown', clickOutsideHandler)
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const firstLi = dropdownRef.current.querySelector('li')
      if (firstLi) firstLi.focus()
    }
  }, [isDropdownOpen])

  useEffect(() => {
    if (isDeleteMenuOpen && deleteDropdownRef.current) {
      const firstBtn = deleteDropdownRef.current.querySelector('button')
      if (firstBtn) firstBtn.focus()
    }
  }, [isDeleteMenuOpen])

  return (
    <tr className={`${styles.task} ${styles[task.status.toLowerCase()]}`}>
      <td>
        <input type="checkbox" checked={isCompleted} onChange={completeHandler} />
      </td>

      <td>
        <div className={styles.task__textCell}>{task.task}</div>
      </td>

      <td className={styles.task__statusCell}>
        <div
          className={styles.task__statusWrapper}
          ref={wrapperRef}
          onClick={openDropdownHandler}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openDropdownHandler()
          }}
        >
          {task.status}
          <FaAngleDown style={{ rotate: `${isDropdownOpen ? '180deg' : '0deg'}` }} />
        </div>

        {isDropdownOpen &&
          createPortal(
            <div
              className={styles.task__dropdown}
              ref={dropdownRef}
              style={{
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                position: 'absolute',
                zIndex: 9999,
              }}
            >
              <ul className={styles.task__dropdownList}>
                {STATUS_OPTIONS.map((status) => (
                  <li
                    key={status}
                    className={styles.task__dropdownOption}
                    tabIndex={0}
                    onClick={() => changeStatusHandler(status)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') changeStatusHandler(status)
                      if (e.key === 'Escape') closeDropdownHandler()
                    }}
                  >
                    {status}
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )}
      </td>

      <td>{task.category}</td>

      <td>
        <div className={styles.task__dateWrapper}>
          <span>{displayDate}</span>
          <img src={calendar} alt="calendar" />
        </div>
      </td>

      <td>{task.remainingTime === 0 ? 'None' : task.remainingTime + 'h'}</td>

      <td>
        <div ref={deleteWrapperRef} className={styles.task__deleteWrapper}>
          <button className={styles.deleteBtn} onClick={openDeleteMenu}>
            <img src={trash} alt="delete" />
          </button>

          {isDeleteMenuOpen &&
            createPortal(
              <div
                ref={deleteDropdownRef}
                className={styles.task__deleteMenu}
                style={{
                  top:
                    deleteWrapperRef.current.getBoundingClientRect().bottom + window.scrollY,
                  left: deleteWrapperRef.current.getBoundingClientRect().left,
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') closeDeleteMenu()
                }}
              >
                <p>Are you sure you want to delete?</p>
                <div>
                  <button onClick={confirmDeleteHandler}>Yes</button>
                  <button onClick={closeDeleteMenu}>No</button>
                </div>
              </div>,
              document.body,
            )}
        </div>
      </td>
    </tr>
  )
}

export default Task
