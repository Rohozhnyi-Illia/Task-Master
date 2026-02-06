import React, { useEffect, useRef, useState } from 'react'
import * as styles from './AddModal.module.scss'
import CategorySelect from '../CategorySelect/CategorySelect'
import AddButton from '../AddButton/AddButton'
import { closeModal } from '@assets'
import addTaskSchema from '@utils/validation/addTask-validation'
import { ErrorMessage } from '@components'
import TaskService from '@services/taskService'
import { createTask } from '@store/tasksSlice'
import { useDispatch, useSelector } from 'react-redux'
import firstLetterToUpperCase from '@utils/helpers/firstLetterToUpperCase'
import { showError } from '@store/errorSlice'
import { showLoader, closeLoader } from '@store/loaderSlice'
import { showSuccess } from '@store/successSlice'

const AddModal = ({ openModalHandler, isAddModalOpen }) => {
  const [categorySelected, setCategorySelected] = useState('')
  const [reminderSelected, setReminderSelected] = useState('')
  const [task, setTask] = useState('')
  const [deadline, setDeadline] = useState({ day: '', month: '', year: '' })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const isSubmittingRef = useRef(false)
  const modalRef = useRef(null)
  const isLoaderShown = useSelector((state) => state.loader.isLoaderShown)

  const onChangeHandler = (e) => {
    const { value } = e.target
    if (value.length > 25) return
    setTask(value)
  }

  const deadlineHandler = (e) => {
    const { name, value } = e.target
    setDeadline({ ...deadline, [name]: value })
  }

  const closeModalHandler = () => {
    openModalHandler()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    dispatch(showLoader())

    const formData = {
      task: firstLetterToUpperCase(task.trim()),
      category: categorySelected.trim(),
      day: deadline.day,
      month: deadline.month,
      year: deadline.year,
    }

    try {
      await addTaskSchema.validate(formData, { abortEarly: false })
      setErrors({})

      const formattedDate = new Date(
        Number(deadline.year),
        Number(deadline.month) - 1,
        Number(deadline.day),
      )
      const now = new Date()
      formattedDate.setHours(0, 0, 0)
      now.setHours(0, 0, 0)

      if (formattedDate < now) {
        setErrors((prev) => ({ ...prev, date: 'Deadline must be in the future' }))
        return
      }

      const res = await TaskService.createTask({
        task: formData.task,
        status: 'Active',
        category: categorySelected,
        remainingTime: Number(reminderSelected),
        deadline: formattedDate,
      })

      if (!res.success) {
        dispatch(showError(res.error))
        return
      }

      dispatch(createTask(res.data))

      setTask('')
      setCategorySelected('')
      setReminderSelected('')
      setDeadline({ day: '', month: '', year: '' })

      closeModalHandler()
      dispatch(showSuccess('The task has been added.'))
    } catch (err) {
      if (err.inner) {
        const newErrors = {}
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message
        })
        setErrors(newErrors)
      } else {
        dispatch(showError(err.message || 'Something went wrong'))
      }
    } finally {
      isSubmittingRef.current = false
      dispatch(closeLoader())
    }
  }

  useEffect(() => {
    if (!isAddModalOpen) return

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      } else if (e.key === 'Escape') {
        openModalHandler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAddModalOpen, openModalHandler])

  return (
    <div
      className={styles.addModal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          openModalHandler()
        }
      }}
      ref={modalRef}
    >
      <fieldset disabled={isLoaderShown}>
        <form className={styles.addModal__content} onSubmit={onSubmitHandler}>
          <button className={styles.addModal__button} onClick={openModalHandler} type="button">
            <img src={closeModal} alt="close" />
          </button>

          <div>
            <label htmlFor="task">Task Name</label>
            <textarea
              name="task"
              id="task"
              className={styles.addModal__textarea}
              placeholder="Write text..."
              onChange={onChangeHandler}
              value={task}
            />
            <p
              className={
                task.length < 25
                  ? styles.addModal__length
                  : `${styles.addModal__length} ${styles.warning}`
              }
            >
              {task.length}/25
            </p>
            {errors.task && (
              <ErrorMessage error={errors.task} className={styles.addModal__error} />
            )}
          </div>

          <div>
            <label htmlFor="reminder">When to remind?</label>
            <CategorySelect
              id="reminder"
              options={['None', '24', '48', '72', '96', '120']}
              onChange={(val) => setReminderSelected(val === 'None' ? '0' : val)}
              selected={reminderSelected}
              setSelected={setReminderSelected}
              label="Hours before task deadline"
            />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <CategorySelect
              id="category"
              options={['High', 'Middle', 'Low']}
              onChange={(val) => setCategorySelected(val)}
              selected={categorySelected}
              setSelected={setCategorySelected}
            />
            {errors.category && (
              <ErrorMessage error={errors.category} className={styles.addModal__error} />
            )}
          </div>

          <div>
            <label htmlFor="deadline">Task Deadline</label>
            <div className={styles.addModal__deadline} id="deadline">
              <input
                type="number"
                name="day"
                id="day"
                placeholder="Day"
                onChange={deadlineHandler}
                value={deadline.day}
                autoComplete="bday-day"
              />
              <input
                type="number"
                name="month"
                id="month"
                placeholder="Month"
                onChange={deadlineHandler}
                value={deadline.month}
                autoComplete="bday-month"
              />
              <input
                type="number"
                name="year"
                id="year"
                placeholder="Year"
                onChange={deadlineHandler}
                value={deadline.year}
                autoComplete="bday-year"
              />
            </div>
            {errors.day && (
              <ErrorMessage error={errors.day} className={styles.addModal__error} />
            )}
            {errors.month && (
              <ErrorMessage error={errors.month} className={styles.addModal__error} />
            )}
            {errors.year && (
              <ErrorMessage error={errors.year} className={styles.addModal__error} />
            )}
            {errors.date && (
              <ErrorMessage error={errors.date} className={styles.addModal__error} />
            )}
          </div>

          <div>
            <AddButton type="submit" disabled={isLoaderShown} />
          </div>
        </form>
      </fieldset>
    </div>
  )
}

export default AddModal
