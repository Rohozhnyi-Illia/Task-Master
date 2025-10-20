import React, { useState } from 'react'
import * as styles from './AddModal.module.scss'
import CategorySelect from '../CategorySelect/CategorySelect'
import AddButton from '../AddButton/AddButton'
import { closeModal } from '@assets'
import addTaskSchema from '@utils/validation/addTask-validation'
import { ErrorMessage } from '@components'

const AddModal = ({ openModalHandler }) => {
  const [categorySelected, setCategorySelected] = useState('')
  const [reminderSelected, setReminderSelected] = useState('')
  const [task, setTask] = useState('')
  const [deadline, setDeadline] = useState({ day: '', month: '', year: '' })
  const [errors, setErrors] = useState({})

  const onChangeHandler = (e) => {
    const { value } = e.target
    if (value.length > 25) return
    setTask(value)
  }

  const deadlineHandler = (e) => {
    const { name, value } = e.target
    setDeadline({ ...deadline, [name]: value })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    const formData = {
      task: task.trim(),
      category: categorySelected.trim(),
      day: deadline.day,
      month: deadline.month,
      year: deadline.year,
    }

    try {
      await addTaskSchema.validate(formData, { abortEarly: false })
      setErrors({})

      // const formattedDate = new Date(
      //   Number(deadline.year),
      //   Number(deadline.month) - 1,
      //   Number(deadline.day)
      // )

      openModalHandler()
    } catch (err) {
      const newErrors = {}
      if (err.inner) {
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message
        })
      }
      setErrors(newErrors)
    }
  }

  return (
    <div className={styles.addModal}>
      <form className={styles.addModal__content} onSubmit={onSubmitHandler}>
        <button className={styles.addModal__button} onClick={openModalHandler}>
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
            />
            <input
              type="number"
              name="month"
              id="month"
              placeholder="Month"
              onChange={deadlineHandler}
            />
            <input
              type="number"
              name="year"
              id="year"
              placeholder="Year"
              onChange={deadlineHandler}
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
        </div>

        <div>
          <AddButton type="submit" />
        </div>
      </form>
    </div>
  )
}

export default AddModal
