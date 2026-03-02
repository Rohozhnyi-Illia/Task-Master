import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { trash, calendar } from '@assets/index'
import styles from './Task.module.scss'
import { useDispatch } from 'react-redux'
import TaskService from '@services/taskService'
import { deleteTasks, updateStatus, restoreTask, updateCategory } from '@store/tasksSlice'
import { showError } from '@store/UI/errorSlice'
import { showSuccess } from '@store/UI/toastSlice'
import { FaAngleDown } from 'react-icons/fa6'
import DropdownPortal from '../DropdownPortal/DropdownPortal'
import { createPortal } from 'react-dom'
import {
  CATEGORIES_OPTIONS,
  STATUS_OPTIONS,
  TaskInterface,
  CategoryType,
  StatusType,
} from '../../../../../types/task'

interface TaskProps {
  task: TaskInterface
}

const Task = ({ task }: TaskProps) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false)
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState<boolean>(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false)
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const categoryWrapperRef = useRef<HTMLDivElement>(null)
  const statusWrapperRef = useRef<HTMLDivElement>(null)
  const deleteWrapperRef = useRef<HTMLDivElement>(null)
  const deleteDropdownRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()
  const taskId: string = task._id
  const isCompleted: boolean = task.status === 'Done'
  const displayDate: string = task.deadline.split('T')[0]

  const toggleStatusDropdownHandler = () => {
    setIsStatusDropdownOpen((prev) => !prev)
  }

  const toggleCategoryDropdownHandler = () => {
    setIsCategoryDropdownOpen((prev) => !prev)
  }

  const closeStatusDropdownHandler = () => setIsStatusDropdownOpen(false)
  const closeCategoryDropdownHandler = () => setIsCategoryDropdownOpen(false)

  const completeHandler = async () => {
    const prevStatus = task.status
    const newStatus = isCompleted ? 'Active' : 'Done'

    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)

    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
      return
    }

    dispatch(showSuccess(isCompleted ? 'The task is active again' : 'The task was completed'))
  }

  const changeStatusHandler = async (newStatus: StatusType) => {
    const prevStatus = task.status

    if (newStatus === prevStatus) {
      dispatch(showError('This status is already active'))
      return
    }

    if (newStatus === 'Done') {
      await completeHandler()
      return
    }

    dispatch(updateStatus({ id: taskId, status: newStatus }))

    const res = await TaskService.updateStatus(taskId, newStatus)

    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }))
      dispatch(showError(res.error))
      return
    }

    dispatch(showSuccess('Status has been updated'))
  }

  const changeCategoryHandler = async (newCategory: CategoryType) => {
    const prevCategory = task.category

    if (newCategory === prevCategory) {
      dispatch(showError('This category is already active'))
      return
    }

    dispatch(updateCategory({ id: taskId, category: newCategory }))

    const res = await TaskService.updateCategory(taskId, newCategory)
    if (!res.success) {
      dispatch(updateCategory({ id: taskId, category: prevCategory }))
      dispatch(showError(res.error))
      return
    }

    dispatch(updateCategory({ id: taskId, category: newCategory }))
    dispatch(showSuccess('Category has been updated'))
  }

  const confirmDeleteHandler = async () => {
    const deleted = task
    dispatch(deleteTasks(taskId))

    const res = await TaskService.deleteTasks(taskId)

    if (!res.success) {
      dispatch(restoreTask(deleted))
      dispatch(showError(res.error))
      return
    }

    dispatch(showSuccess(`The task has been deleted`))
  }

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDeleteMenuOpen(false)
      }
    }

    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [setIsDeleteMenuOpen, deleteDropdownRef])

  const getStatusClass = (status: StatusType) => {
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

  useLayoutEffect(() => {
    if (!isDeleteMenuOpen) return
    if (!deleteWrapperRef.current) return

    const rect = deleteWrapperRef.current.getBoundingClientRect()

    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })
  }, [isDeleteMenuOpen])

  return (
    <tr className={`${styles.task} ${getStatusClass(task.status)}`}>
      <td>
        <input type="checkbox" checked={isCompleted} onChange={completeHandler} />
      </td>

      <td>
        <div className={styles.task__textCell}>{task.task}</div>
      </td>

      <td className={styles.task__statusCell}>
        <div
          ref={statusWrapperRef}
          className={styles.task__statusWrapper}
          onClick={toggleStatusDropdownHandler}
        >
          {task.status}
          <FaAngleDown style={{ rotate: isStatusDropdownOpen ? '180deg' : '0deg' }} />
        </div>

        <DropdownPortal
          isOpen={isStatusDropdownOpen}
          anchorRef={statusWrapperRef}
          options={STATUS_OPTIONS}
          onSelect={changeStatusHandler}
          onClose={closeStatusDropdownHandler}
        />
      </td>

      <td>
        <div
          className={styles.task__categoryWrapper}
          ref={categoryWrapperRef}
          onClick={toggleCategoryDropdownHandler}
        >
          {task.category}
          <FaAngleDown style={{ rotate: isCategoryDropdownOpen ? '180deg' : '0deg' }} />
        </div>

        <DropdownPortal
          isOpen={isCategoryDropdownOpen}
          anchorRef={categoryWrapperRef}
          options={CATEGORIES_OPTIONS}
          onSelect={changeCategoryHandler}
          onClose={closeCategoryDropdownHandler}
        />
      </td>

      <td>
        <div className={styles.task__dateWrapper}>
          <span>{displayDate}</span>
          <img src={calendar} alt="calendar" />
        </div>
      </td>

      <td>{task.remainingTime === 0 ? 'None' : task.remainingTime + 'h'}</td>

      <td>
        <div ref={deleteWrapperRef} className={styles.task__deleteWrapper}>
          <button
            className={styles.deleteBtn}
            onClick={() => setIsDeleteMenuOpen((prev) => !prev)}
          >
            <img src={trash} alt="delete" />
          </button>

          {isDeleteMenuOpen &&
            createPortal(
              <div
                ref={deleteDropdownRef}
                className={styles.task__deleteMenu}
                style={{ top: position.top, left: position.left }}
              >
                <p>Are you sure you want to delete?</p>
                <div>
                  <button onClick={confirmDeleteHandler}>Yes</button>
                  <button onClick={() => setIsDeleteMenuOpen(false)}>No</button>
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
