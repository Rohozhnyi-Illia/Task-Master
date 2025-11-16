import React, { useState } from 'react'
import * as styles from './AddModal.module.scss'
import CategorySelect from '../CategorySelect/CategorySelect'
import AddButton from '../AddButton/AddButton'
import { closeModal } from '@assets'
import addTaskSchema from '@utils/validation/addTask-validation'
import { ErrorMessage } from '@components'
import { ErrorModal, Loader } from '@components'
import TaskService from '@services/taskService'
import { createTask } from '@store/tasksSlice'
import { useDispatch } from 'react-redux'
import firstLetterToUpperCase from '@utils/helpers/firstLetterToUpperCase'

const AddModal = ({ openModalHandler }) => {
  const [categorySelected, setCategorySelected] = useState('')
  const [reminderSelected, setReminderSelected] = useState('')
  const [task, setTask] = useState('')
  const [deadline, setDeadline] = useState({ day: '', month: '', year: '' })
  const [errors, setErrors] = useState({})
  const [fetchError, setFetchError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const dispatch = useDispatch()

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
    setIsErrorModalOpen(false)
    openModalHandler()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

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
        Number(deadline.day)
      )
      const now = new Date()
      formattedDate.setHours(0, 0, 0)
      now.setHours(0, 0, 0)

      if (formattedDate < now) {
        setErrors((prev) => ({
          ...prev,
          date: 'Deadline must be in the future',
        }))

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
        setFetchError(res.error)
        return
      }

      dispatch(createTask(res.data))

      setTask('')
      setCategorySelected('')
      setReminderSelected('')
      setDeadline({ day: '', month: '', year: '' })

      closeModalHandler()
    } catch (err) {
      if (err.inner) {
        const newErrors = {}
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message
        })
        setErrors(newErrors)
      } else {
        setFetchError(err.message || 'Something went wrong')
        setIsErrorModalOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={styles.addModal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          openModalHandler()
        }
      }}
    >
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
          <label htmlFor="reminder">Remaining Time(hours)</label>
          <CategorySelect
            id="reminder"
            options={['24', '48', '72', '96', '120']}
            onChange={(val) => setReminderSelected(val)}
            selected={reminderSelected}
            setSelected={setReminderSelected}
            label="When to remind?"
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
            />
            <input
              type="number"
              name="month"
              id="month"
              placeholder="Month"
              onChange={deadlineHandler}
              value={deadline.month}
            />
            <input
              type="number"
              name="year"
              id="year"
              placeholder="Year"
              onChange={deadlineHandler}
              value={deadline.year}
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
          <AddButton type="submit" />
        </div>
      </form>

      {isLoading && <Loader />}
      {isErrorModalOpen && <ErrorModal error={fetchError} onClick={closeModalHandler} />}
    </div>
  )
}

export default AddModal
